import test from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:net';
import { readFile, readdir, writeFile, utimes, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { generateKeyPairSync } from 'node:crypto';
import type { Event, EventBatch, PortfolioSnapshot } from '../vendor/investment/v1/types.js';
import { validate, sha256 } from '../src/schema.js';
import { config } from '../src/config.js';
import { Archive } from '../src/database.js';
import { harness, golden, examples, prefix, encode, clone } from './helpers.js';

function of<T extends Event['type']>(batch:EventBatch,type:T):Extract<Event,{type:T}>{const e=batch.events.find(e=>e.type===type);assert.ok(e);return e as Extract<Event,{type:T}>;}
function expectStatus(response:{status:number;raw:string},status:number){assert.equal(response.status,status,response.raw);}

test('migration repeat and empty startup create no publication authority or data',async t=>{
  const h=await harness(t);const db=h.receiver.db;db.migrate();db.migrate();
  assert.equal(db.get<{n:number}>('SELECT count(*) n FROM events')!.n,0);assert.equal(db.get<{n:number}>('SELECT count(*) n FROM runs')!.n,0);
  expectStatus(await h.get(prefix+'/status'),404);expectStatus(await h.get('/api/ask/v1/availability'),404);
  const before=db.all('SELECT * FROM schema_migrations');await h.restart();assert.deepEqual(h.receiver.db.all('SELECT * FROM schema_migrations'),before);
  const other=new Archive(h.cfg);assert.equal(other.db.pragma('foreign_keys',{simple:true}),1);other.close();
});

test('real HTTP golden ingestion, exact public DTOs, durable immutable receipt and restart',async t=>{
  const h=await harness(t);await h.stage();const first=await h.batch();expectStatus(first,201);validate('PublicationReceipt',first.body);
  assert.equal((first.body.acceptedIds as string[]).length,27);assert.equal(first.headers['cache-control'],'private, no-store');
  const retry=await h.batch();expectStatus(retry,200);assert.deepEqual(retry.body,first.body);
  const receipt=await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId));expectStatus(receipt,200);assert.deepEqual(receipt.body,first.body);
  const routes:[string,string][]=[['status','PublicStatus'],['snapshot','SnapshotResponse'],['events','EventPage'],['performance','PerformancePage'],['discussions','DiscussionPage'],['discussions/fixture-discussion','DiscussionDetail'],['decisions/fixture-decision','DecisionDetail'],['transactions','TransactionPage'],['artifacts','ArtifactPage'],['artifacts/fixture-artifact/versions/1','ArtifactDetail'],['records/valuation/fixture-valuation/versions/1','RecordDetail']];
  for(const [path,type]of routes){const r=await h.get(prefix+'/'+path);expectStatus(r,200);validate(type,r.body);assert.doesNotMatch(r.raw,/local-test-key|public_key|scope_json|PRIVATE|privateKey/);}
  const experiment=await h.get('/api/experiments/v1/experiments/fixture-experiment');expectStatus(experiment,200);validate('PublicExperiment',experiment.body);
  const snapshot=await h.get(prefix+'/snapshot');assert.equal((snapshot.body.snapshot as PortfolioSnapshot).equity,'1020');
  assert.throws(()=>h.receiver.db.run('UPDATE events SET event_hash=?','0'.repeat(64)),/immutable/);
  assert.deepEqual(h.receiver.db.db.pragma('foreign_key_check'),[]);assert.deepEqual(h.receiver.db.db.pragma('integrity_check'),[{integrity_check:'ok'}]);
  await h.restart();expectStatus(await h.batch(),200);assert.deepEqual((await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId))).body,first.body);
});

test('SQL duplicate identity: concurrent requests, repackaged events and changed bytes',async t=>{
  const h=await harness(t);await h.stage();const results=await Promise.all(Array.from({length:5},()=>h.batch()));
  assert.deepEqual(results.map(x=>x.status).sort(),[200,200,200,200,201]);for(const x of results)assert.deepEqual(x.body,results[0]!.body);
  const changed=clone(golden.batch);changed.events[0]!.recordedAt='2026-01-05T22:00:00Z';expectStatus(await h.batch(changed),409);
  const repack=clone(golden.batch);repack.batchId='repack';const response=await h.batch(repack);expectStatus(response,201);assert.equal((response.body.acceptedIds as string[]).length,0);assert.equal((response.body.duplicateIds as string[]).length,27);
  repack.batchId='repack-changed';of(repack,'discussion.contribution').payload.body='Different';expectStatus(await h.batch(repack),409);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,27);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM financial_journal')!.n,2);
  const spaced=Buffer.from(JSON.stringify(golden.batch,null,1));expectStatus(await h.send(h.signed('POST',prefix+'/events',spaced,golden.batch.batchId)),409);
});

test('failure within transaction rolls back every event, then committed lost response reconciles',async t=>{
  const h=await harness(t);await h.stage();h.fault('after-event-insert');const failure=await h.batch();expectStatus(failure,503);assert.doesNotMatch(failure.raw,/PRIVATE|sqlite|dataDir/);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,0);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM runs')!.n,0);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM batches')!.n,0);
  h.fault('before-http-response');expectStatus(await h.batch(),503);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,27);
  h.fault('');await h.restart();const receipt=await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId));expectStatus(receipt,200);expectStatus(await h.batch(),200);
});

test('HTTP security: signatures, raw duplicates, nonce persistence, expiry, authority and method',async t=>{
  const h=await harness(t),path=prefix+'/heartbeat',data=clone(examples.Heartbeat) as Record<string,unknown>;data.sentAt=new Date(h.now()*1000).toISOString();
  const make=()=>h.signed('POST',path,encode(data),String(data.heartbeatId));
  const valid=make();expectStatus(await h.send(valid),200);expectStatus(await h.send(valid),409);await h.restart();expectStatus(await h.send(valid),409);
  expectStatus(await h.http('POST',path,[['Host',h.cfg.authority],['Content-Length',String(encode(data).length)],['Content-Type','application/json']],encode(data)),401);
  const cases:[string,(m:ReturnType<typeof make>)=>void,number][]=[
    ['body',m=>{m.body=Buffer.from('{}');},401],['signature',m=>{m.headers.find(x=>x[0]==='signature')![1]='sig1=:bad:';},401],
    ['digest',m=>{m.headers.find(x=>x[0]==='content-digest')![1]='sha-256=:bad:';},401],['generation',m=>{m.headers.find(x=>x[0]==='botsquad-generation')![1]='2';},409],
    ['duplicate header',m=>{m.headers.push(['Content-Type','application/json']);},401],['forwarded',m=>{m.headers.push(['X-Forwarded-Host','receiver.test']);},401],
    ['forwarded RFC',m=>{m.headers.push(['Forwarded','host=receiver.test']);},401],['query',m=>{m.path+='?x=1';},401],['content parameters',m=>{m.headers.find(x=>x[0]==='content-type')![1]='application/json; charset=utf-8';},415]
  ];
  for(const [name,mutate,status]of cases){const m=make();mutate(m);const r=await h.send(m);expectStatus(r,status);assert.equal(r.headers['cache-control'],'private, no-store',name);}
  expectStatus(await h.send(make(),[['Host','receiver.test']]),401);
  const m=make();expectStatus(await h.send(m,[],prefix+'/events'),401);
  expectStatus(await h.send(make(),[],path,'PUT'),405);
  const expired=make();h.setClock(h.now()+181);expectStatus(await h.send(expired),401);
  expectStatus(await h.get(prefix+'/receipts/'+golden.batch.batchId),401);
  const wrongHost=await h.http('GET',prefix+'/status',[['Host','evil.test']]);expectStatus(wrongHost,401);
  const invalidPath=await h.get(prefix+'/%65vents');expectStatus(invalidPath,400);
});

test('revocation, scope, key activation and generation remain current on receipt/retry/commit',async t=>{
  const h=await harness(t);await h.stage();expectStatus(await h.batch(),201);
  const fresh=h.signed('GET',prefix+'/receipts/'+golden.batch.batchId);h.receiver.db.revokeKey(h.scope.keyId,new Date(h.now()*1000).toISOString());expectStatus(await h.send(fresh),403);expectStatus(await h.batch(),403);
  const pair=generateKeyPairSync('ed25519');const rotated={...h.scope,keyId:'rotated',generation:'2'};h.receiver.db.authorize(rotated,{...h.key,publicKey:pair.publicKey.export({type:'spki',format:'pem'}).toString()},new Date(h.now()*1000).toISOString());
  assert.throws(()=>h.receiver.db.authorize({...rotated,generation:'1'},{...h.key,publicKey:pair.publicKey.export({type:'spki',format:'pem'}).toString()},new Date(h.now()*1000).toISOString()));
});

test('wrong run, disallowed event and commit-time revocation reject atomically',async t=>{
  const h=await harness(t);await h.stage();const wrong=clone(golden.batch);wrong.runId='other';expectStatus(await h.batch(wrong),403);
  h.receiver.db.authorize({...h.scope,eventTypes:['run.published']},h.key,new Date(h.now()*1000).toISOString());expectStatus(await h.batch(),403);
  h.receiver.db.authorize(h.scope,h.key,new Date(h.now()*1000).toISOString());
  h.fault('before-batch-commit',()=>h.receiver.db.revokeKey(h.scope.keyId,new Date(h.now()*1000).toISOString()));expectStatus(await h.batch(),403);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,0);
});

const invalidBatches:[string,(b:EventBatch)=>void][]=[
  ['source conflict',b=>{b.events[2]!.sourceSequence=b.events[1]!.sourceSequence;}],
  ['dependency',b=>{b.events=b.events.filter(x=>x.type!=='discussion.opened') as EventBatch['events'];}],
  ['journal gap',b=>{of(b,'paper.ledger_transaction').payload.journalSequence='2';}],
  ['snapshot predecessor',b=>{b.events=b.events.filter(x=>x.type!=='paper.ledger_transaction') as EventBatch['events'];}],
  ['configuration',b=>{of(b,'portfolio.snapshot').payload.configurationHash='0'.repeat(64);}],
  ['unknown actor',b=>{of(b,'discussion.contribution').actor={kind:'worker',workerId:'untrusted'};}],
  ['equity',b=>{of(b,'portfolio.snapshot').payload.equity='9999';}]
];
for(const [label,mutate]of invalidBatches)test('HTTP rejects '+label+' with no partial SQL state',async t=>{const h=await harness(t);await h.stage();const b=clone(golden.batch);mutate(b);const r=await h.batch(b);assert.ok([400,403,409,422].includes(r.status),r.raw);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,0);});

test('snapshot ordering, explicit correction versions, and partial-data history',async t=>{
  const h=await harness(t);await h.stage();expectStatus(await h.batch(),201);
  const original=of(clone(golden.batch),'portfolio.snapshot');
  const newer=clone(original);newer.eventId='newer-snapshot';newer.sourceSequence='30';newer.payload.valuationId='newer-valuation';newer.payload.valuationSequence='3';
  const older=clone(original);older.eventId='older-snapshot';older.sourceSequence='29';older.payload.valuationId='older-valuation';older.payload.valuationSequence='2';
  const send=(e:Event,id:string)=>h.batch({...clone(golden.batch),batchId:id,events:[e]});
  expectStatus(await send(newer,'newer'),201);expectStatus(await send(older,'older'),201);
  assert.equal(((await h.get(prefix+'/snapshot')).body.snapshot as PortfolioSnapshot).valuationId,'newer-valuation');
  const revised=clone(older);revised.eventId='revised-old';revised.sourceSequence='31';revised.payload.revision=2;revised.payload.supersedes={kind:'valuation',id:'older-valuation',version:1,relation:'supersedes'};
  expectStatus(await send(revised,'revised'),201);assert.equal(((await h.get(prefix+'/snapshot')).body.snapshot as PortfolioSnapshot).valuationId,'newer-valuation');
  const bad=clone(revised);bad.eventId='conflict-val';bad.sourceSequence='32';bad.payload.valuationId='new-identity';expectStatus(await send(bad,'collision'),409);
  const partial=clone(newer);partial.eventId='missing-observation';partial.sourceSequence='32';partial.payload.valuationId='missing-valuation';partial.payload.valuationSequence='4';partial.payload.quality='partial';partial.payload.equity=null;partial.payload.totalReturn=null;partial.payload.dailyReturn=null;partial.payload.drawdown=null;partial.payload.excessReturn=null;partial.payload.holdings[0]!.mark=null;partial.payload.holdings[0]!.marketValue=null;partial.payload.holdings[0]!.unrealizedPnl=null;partial.payload.holdings[0]!.missingReason='No permitted observation.';
  expectStatus(await send(partial,'partial'),201);assert.equal(((await h.get(prefix+'/snapshot')).body.snapshot as PortfolioSnapshot).valuationId,'newer-valuation');
  expectStatus(await h.get(prefix+'/records/valuation/older-valuation/versions/1'),200);expectStatus(await h.get(prefix+'/records/valuation/older-valuation/versions/2'),200);
});

test('public pagination is bounded, opaque, fixed-watermark, reset after epoch/filter/expiry change',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const first=await h.get(prefix+'/events?limit=2');expectStatus(first,200);assert.equal((first.body.items as unknown[]).length,2);
  const cursor=first.body.nextCursor as string;assert.ok(cursor&&!/^\d+$/.test(cursor));
  const second=await h.get(prefix+'/events?limit=2&after='+cursor);expectStatus(second,200);assert.notDeepEqual(second.body.items,first.body.items);
  expectStatus(await h.get(prefix+'/events?limit=3&after='+cursor),409);expectStatus(await h.get(prefix+'/transactions?limit=2&after='+cursor),409);
  for(const query of ['limit=101','limit=0','limit=1&limit=2','arbitrary=true'])expectStatus(await h.get(prefix+'/events?'+query),400);
  expectStatus(await h.get(prefix+'/performance?from=2026-02-30'),422);expectStatus(await h.get(prefix+'/performance?from=2026-01-06&to=2026-01-05'),400);
  h.receiver.db.resetEpoch();const reset=await h.get(prefix+'/events?limit=2&after='+cursor);expectStatus(reset,409);assert.equal(reset.body.code,'CURSOR_RESET');
  const next=await h.get(prefix+'/events?limit=2');h.setClock(h.now()+901);expectStatus(await h.get(prefix+'/events?limit=2&after='+next.body.nextCursor),409);
});

test('withdrawal cannot leak bodies in events, details, exact records, caches or derived references',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const before=await h.get(prefix+'/events');expectStatus(await h.get(prefix+'/events',[['If-None-Match',String(before.headers.etag)]]),304);
  const target=of(golden.batch,'discussion.contribution');h.receiver.db.hide('fixture-experiment','fixture-run',target.eventId,'withdrawn',new Date(h.now()*1000).toISOString());
  const after=await h.get(prefix+'/events',[['If-None-Match',String(before.headers.etag)]]);expectStatus(after,200);assert.ok(!(after.body.items as {event:Event}[]).some(x=>x.event.eventId===target.eventId));assert.equal(after.headers['cache-control'],'public, max-age=0, must-revalidate');
  const exact=await h.get(prefix+'/records/contribution/'+target.payload.contributionId+'/versions/1');expectStatus(exact,200);assert.equal(exact.body.visibility,'withdrawn');assert.equal(exact.body.event,null);
  const detail=await h.get(prefix+'/discussions/fixture-discussion');assert.ok(!(detail.body.contributions as Event[]).some(x=>x.eventId===target.eventId));
});

test('staging is private, hash/type/size checked, idempotent and crash recoverable',async t=>{
  const h=await harness(t);const c=golden.content[0]!,path=prefix+'/content/'+c.sha256;
  expectStatus(await h.get(path),405);const m=h.signed('PUT',path,Buffer.from(c.text),'upload',c.contentType);const first=await h.send(m);expectStatus(first,201);validate('ContentReceipt',first.body);
  expectStatus(await h.send(h.signed('PUT',path,Buffer.from(c.text),'upload-again',c.contentType)),201);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM content_objects')!.n,1);
  const retry=await h.send(h.signed('PUT',path,Buffer.from(c.text),'upload',c.contentType));assert.deepEqual(retry.body,first.body);
  expectStatus(await h.send(h.signed('PUT',prefix+'/content/'+'0'.repeat(64),Buffer.from(c.text),'bad-hash',c.contentType)),409);
  expectStatus(await h.send(h.signed('PUT',path,Buffer.alloc(131073),'huge','text/plain')),413);
  const unsupported=await h.send(h.signed('PUT',path,Buffer.from(c.text),'html','text/html'));assert.ok([415,422].includes(unsupported.status));
  expectStatus(await h.get(prefix+'/artifacts/fixture-artifact/versions/1/content'),404);
  expectStatus(await h.batch(),409);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,0);
  await h.stage();await h.batch();expectStatus(await h.get(prefix+'/artifacts/fixture-artifact/versions/1/content'),503);
  const bytes=await readFile(h.receiver.storage.path(c.sha256));assert.equal(sha256(bytes),c.sha256);assert.deepEqual(await readdir(join(h.dir,'incoming')),[]);
});

test('interrupted upload, disk write failure and premetadata orphan remain nonpublic',async t=>{
  const h=await harness(t),c=golden.content[0]!;h.fault('disk-write');expectStatus(await h.send(h.signed('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),'disk',c.contentType)),503);h.fault('');
  assert.deepEqual(await readdir(join(h.dir,'incoming')),[]);
  const m=h.signed('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),'interrupt',c.contentType),port=(h.receiver.server.address() as {port:number}).port;
  await new Promise<void>(resolve=>{const socket=connect(port,'127.0.0.1',()=>{socket.write(['PUT '+m.path+' HTTP/1.1','Host: receiver.test',...m.headers.map(([k,v])=>k+': '+v),'Content-Length: '+c.text.length,'',''].join('\r\n')+c.text.slice(0,2));setTimeout(()=>{socket.destroy();resolve();},30);});socket.on('error',()=>resolve());});
  await new Promise(resolve=>setTimeout(resolve,30));assert.deepEqual(await readdir(join(h.dir,'incoming')),[]);
  h.fault('after-content-install');expectStatus(await h.send(h.signed('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),'orphan',c.contentType)),503);h.fault('');
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM staged_content')!.n,0);expectStatus(await h.get(prefix+'/artifacts/fixture-artifact/versions/1/content'),404);
  const temp=join(h.dir,'incoming','aaaaaaaa-aaaa.part');await writeFile(temp,'incomplete');await utimes(temp,0,0);
  const cleanup=await h.receiver.storage.cleanup(h.now()+86401,10);assert.equal(cleanup.removed,2);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM content_objects')!.n,0);
});

test('staging rejects symlink replacement and missing/corrupt bytes before metadata commit',async t=>{
  const h=await harness(t);await h.stage();const c=golden.content[0]!;await writeFile(h.receiver.storage.path(c.sha256),'corrupt');expectStatus(await h.batch(),409);
  const target=join(h.dir,'unrelated');await writeFile(target,c.text);const hash=sha256('symlink-test');await symlink(target,h.receiver.storage.path(hash));
  expectStatus(await h.send(h.signed('PUT',prefix+'/content/'+hash,Buffer.from('symlink-test'),'symlink','text/plain')),503);
  assert.equal(await readFile(target,'utf8'),c.text);
});

test('heartbeat cannot create trades or make old valuation fresh; stale state and quotas are real',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const before=h.receiver.db.get<{n:number}>('SELECT count(*) n FROM financial_journal')!.n;
  const heartbeat=clone(examples.Heartbeat) as Record<string,unknown>;heartbeat.sentAt=new Date(h.now()*1000).toISOString();
  const make=()=>h.send(h.signed('POST',prefix+'/heartbeat',encode(heartbeat),String(heartbeat.heartbeatId)));
  expectStatus(await make(),200);h.setClock(h.now()+200);expectStatus(await make(),200);const status=await h.get(prefix+'/status');assert.equal((status.body.freshness as {status:string}).status,'stale');assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM financial_journal')!.n,before);
  h.receiver.db.authorize({...h.scope,writesPerMinute:1},h.key,new Date(h.now()*1000).toISOString());h.setClock(h.now()+60);expectStatus(await make(),200);expectStatus(await make(),429);
  expectStatus(await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId)),200);
});

test('JSON wire rejects unknown fields, unsupported versions, duplicate keys and invalid Unicode',async t=>{
  const h=await harness(t);const inputs=[Buffer.from('{"schemaVersion":"1.0","schemaVersion":"1.0"}'),Buffer.from('{"x":"\\ud800"}'),Buffer.from([0xc0,0xaf]),Buffer.from('['.repeat(20)+'0'+']'.repeat(20)),encode({...golden.batch,privateData:'hidden'}),encode({...golden.batch,schemaVersion:'2.0'})];
  for(let i=0;i<inputs.length;i++){const r=await h.send(h.signed('POST',prefix+'/events',inputs[i]!,String(i)));assert.ok([400,422].includes(r.status),r.raw);}
});

test('local configuration rejects repository storage and public listeners',async t=>{
  const h=await harness(t);assert.throws(()=>config({...h.cfg,host:'0.0.0.0'}));assert.throws(()=>config({...h.cfg,unexpected:true}));assert.throws(()=>config({...h.cfg,dataDir:process.cwd()}));
});
