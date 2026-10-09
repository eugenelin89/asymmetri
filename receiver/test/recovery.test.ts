import test from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import { chmod, cp, mkdtemp, rm, lstat, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { connect } from 'node:net';
import { generateKeyPairSync } from 'node:crypto';
import { Storage } from '../src/storage.js';
import { createReceiver } from '../src/http.js';
import { canonicalHash } from '../src/schema.js';
import { Archive } from '../src/database.js';
import { config } from '../src/config.js';
import type { PortfolioSnapshot } from '../vendor/investment/v1/types.js';
import { harness, golden, prefix, encode, clone, wireHttp } from './helpers.js';

async function child(h:Awaited<ReturnType<typeof harness>>,point='') {
  const process=fork(new URL('./child.js',import.meta.url),[JSON.stringify(h.cfg),String(h.now()),point],{stdio:['ignore','ignore','pipe','ipc'],execArgv:[]});
  let stderr='';process.stderr?.on('data',x=>stderr+=String(x));
  const ready=await Promise.race([once(process,'message').then(([x])=>x as {port:number}),once(process,'exit').then(()=>{throw new Error(stderr);})]);
  const exit=once(process,'exit');
  return {process,exit,send(m:ReturnType<typeof h.signed>){return wireHttp(ready.port,m.method,m.path,[['Host',h.cfg.authority],...m.headers,...(m.method==='GET'?[]:[['Content-Length',String(m.body.length)] as [string,string]])],Buffer.from(m.body));},async stop(){if(process.exitCode===null&&process.signalCode===null)process.kill('SIGTERM');await exit;}};
}

for(const point of ['after-event-insert','before-sql-commit','after-sql-commit','before-http-response'])test('real process kill and SQLite recovery: '+point,async t=>{
  const h=await harness(t);await h.stage();const c=await child(h,point),m=h.signed('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId);
  try {await assert.rejects(c.send(m));await c.exit;}finally{await c.stop();}
  const committed=['after-sql-commit','before-http-response'].includes(point);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,committed?27:0);
  assert.equal((await h.send(m)).status,409,'nonce reservation survives crash');
  assert.equal((await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId))).status,committed?200:404);
  assert.equal((await h.batch()).status,committed?200:201);
  assert.deepEqual(h.receiver.db.db.pragma('integrity_check'),[{integrity_check:'ok'}]);assert.deepEqual(h.receiver.db.db.pragma('foreign_key_check'),[]);
});

test('separate processes converge concurrent duplicate submissions',async t=>{
  const h=await harness(t);await h.stage();const c=await child(h);
  try {
    const result=await Promise.all([h.batch(),c.send(h.signed('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId))]);
    assert.deepEqual(result.map(x=>x.status).sort(),[200,201]);assert.deepEqual(result[0]!.body,result[1]!.body);
    assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,27);
  }finally{await c.stop();}
});

test('atomic content rename survives real kill and expired staging retry restores identical bytes',async t=>{
  const h=await harness(t),v=golden.content[0]!,c=await child(h,'after-content-rename');
  const make=()=>h.signed('PUT',prefix+'/content/'+v.sha256,Buffer.from(v.text),'durable-upload',v.contentType);
  try{await assert.rejects(c.send(make()));await c.exit;}finally{await c.stop();}
  assert.equal((await lstat(h.receiver.storage.path(v.sha256))).nlink,1);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM staged_content')!.n,0);
  const first=await h.send(make());assert.equal(first.status,201);
  await h.receiver.storage.cleanup(h.now()+86401);
  const retried=await h.send(make());assert.equal(retried.status,201);assert.deepEqual(retried.body,first.body);
  assert.equal((await h.receiver.storage.read(v.sha256,v.contentType,Buffer.byteLength(v.text))).toString(),v.text);
});

test('withdrawal follows scalar dependencies and never resurrects a superseded valuation',async t=>{
  const h=await harness(t);await h.stage();await h.batch();
  const original=clone(golden.batch.events.find(x=>x.type==='portfolio.snapshot')!);assert.equal(original.type,'portfolio.snapshot');if(original.type!=='portfolio.snapshot')return;
  const revised=clone(original);revised.eventId='corrected-valuation';revised.sourceSequence='28';revised.payload.revision=2;revised.payload.supersedes={kind:'valuation',id:original.payload.valuationId,version:1,relation:'supersedes'};
  assert.equal((await h.batch({...golden.batch,batchId:'corrected',events:[revised]})).status,201);
  assert.equal(((await h.get(prefix+'/snapshot')).body.snapshot as PortfolioSnapshot).revision,2);
  h.receiver.db.hide('fixture-experiment','fixture-run',revised.eventId,'withdrawn',new Date(h.now()*1000).toISOString());
  assert.equal((await h.get(prefix+'/snapshot')).body.snapshot,null);
  h.receiver.db.hide('fixture-experiment','fixture-run','fixture-event-07','withdrawn',new Date(h.now()*1000).toISOString());
  const events=(await h.get(prefix+'/events')).body.items as {event:{eventId:string}}[];
  for(const id of ['fixture-event-11','fixture-event-12','fixture-event-13','fixture-event-14','fixture-event-15','fixture-event-16','fixture-event-17'])assert.ok(!events.some(x=>x.event.eventId===id),id);
});

test('offline snapshot copy, integrity checks and restore fence preserve data but revoke authority',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const receipt=(await h.batch()).body,cursor=(await h.get(prefix+'/events?limit=2')).body.nextCursor;const backup=await mkdtemp(join(tmpdir(),'inv02-restore-'));await chmod(backup,0o700);t.after(()=>rm(backup,{recursive:true,force:true}));
  // SQLite online backup supplies a consistent database; stopped-service runbook also copies durable objects.
  await h.receiver.db.db.backup(join(backup,'archive.sqlite'));await cp(join(h.dir,'objects'),join(backup,'objects'),{recursive:true});
  const restored=new Archive(config({...h.cfg,enabled:false,dataDir:backup}));
  try {
    const epoch=restored.meta().epoch;restored.fenceRestore(new Date(h.now()*1000).toISOString());
    assert.notEqual(restored.meta().epoch,epoch);assert.equal(restored.key(h.scope.keyId)!.revoked,1);assert.equal(JSON.parse(restored.key(h.scope.keyId)!.scope_json).enabled,false);assert.equal(restored.key(h.scope.keyId)!.generation,'2');
    assert.equal(restored.get<{n:number}>('SELECT count(*) n FROM events')!.n,27);assert.equal(restored.get<{n:number}>('SELECT count(*) n FROM batches')!.n,1);
    assert.deepEqual(restored.db.pragma('integrity_check'),[{integrity_check:'ok'}]);assert.deepEqual(restored.db.pragma('foreign_key_check'),[]);
    assert.throws(()=>restored.authorize(h.scope,h.key,new Date(h.now()*1000).toISOString()));
    const storage=new Storage(restored);await storage.init();for(const v of golden.content)assert.equal((await storage.read(v.sha256,v.contentType,Buffer.byteLength(v.text))).toString(),v.text);
  }finally{restored.close();}
  const service=await createReceiver({...h.cfg,dataDir:backup},{now:h.now});
  try {
    const port=(service.server.address() as {port:number}).port;
    const send=(m:ReturnType<typeof h.signed>)=>wireHttp(port,m.method,m.path,[['Host',h.cfg.authority],...m.headers,...(m.method==='GET'?[]:[['Content-Length',String(m.body.length)] as [string,string]])],Buffer.from(m.body));
    assert.equal((await send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId))).status,403);
    const pair=generateKeyPairSync('ed25519');Object.assign(h.keys,pair);Object.assign(h.scope,{keyId:'restored-fresh-key',generation:'2'});h.key.publicKey=pair.publicKey.export({type:'spki',format:'pem'}).toString();
    service.db.authorize(h.scope,h.key,new Date(h.now()*1000).toISOString());
    assert.deepEqual((await send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId))).body,receipt);
    const retry=await send(h.signed('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId));assert.equal(retry.status,200);assert.deepEqual(retry.body,receipt);
    const reset=await wireHttp(port,'GET',prefix+'/events?limit=2&after='+cursor,[['Host',h.cfg.authority]]);assert.equal(reset.body.code,'CURSOR_RESET');
    assert.equal(service.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,27);
  }finally{await service.close();}
});

test('raw TCP rejects mixed-case duplicate protected/framing headers and transfer encoding',async t=>{
  const h=await harness(t),port=(h.receiver.server.address() as {port:number}).port;
  for(const extra of [['Host: receiver.test','hOsT: receiver.test'],['Content-Length: 0','cOnTeNt-LeNgTh: 0'],['Signature-Input: bad','sIgNaTuRe-InPuT: bad'],['Transfer-Encoding: chunked']]){
    const raw=await new Promise<string>((resolve,reject)=>{const socket=connect(port,'127.0.0.1',()=>socket.end(['GET '+prefix+'/status HTTP/1.1',...(extra[0]!.startsWith('Host:')?[]:['Host: receiver.test']),...extra,'Connection: close','',''].join('\r\n')));let data='';socket.on('data',x=>data+=String(x));socket.on('end',()=>resolve(data));socket.on('error',reject);});
    assert.match(raw,/HTTP\/1.1 (400|401)/);assert.match(raw,/no-store/);
  }
});

test('migration has no authority; checkout prefix bypass and private PEM persistence are prevented',async t=>{
  const h=await harness(t),empty=await mkdtemp(join(tmpdir(),'inv02-empty-'));await chmod(empty,0o700);t.after(()=>rm(empty,{recursive:true,force:true}));
  const db=new Archive(config({...h.cfg,enabled:false,dataDir:empty}));try{assert.equal(db.get<{n:number}>('SELECT count(*) n FROM publishers')!.n,0);assert.equal(db.get<{n:number}>('SELECT count(*) n FROM runs')!.n,0);}finally{db.close();}
  const inside=new URL('../../../..runtime/',import.meta.url);await mkdir(inside,{mode:0o700});t.after(()=>rm(inside,{recursive:true,force:true}));assert.throws(()=>config({...h.cfg,dataDir:inside.pathname}));
  const scope={...h.scope,keyId:'public-normalization'};h.receiver.db.authorize(scope,{...h.key,publicKey:h.keys.privateKey.export({type:'pkcs8',format:'pem'}).toString()},new Date(h.now()*1000).toISOString());
  assert.match(h.receiver.db.key(scope.keyId)!.public_key,/BEGIN PUBLIC KEY/);assert.doesNotMatch(h.receiver.db.key(scope.keyId)!.public_key,/PRIVATE/);
});

test('metadata capacity reserve rejects writes while authenticated old receipts remain readable',async t=>{
  const h=await harness(t);await h.stage();await h.batch();
  h.receiver.db.db.exec('CREATE TABLE test_capacity (data BLOB)');
  const pages=Number(h.receiver.db.db.pragma('page_count',{simple:true}));h.receiver.db.db.pragma(`max_page_count=${pages+300}`);
  h.receiver.db.run('INSERT INTO test_capacity VALUES(zeroblob(400000))');
  const old=await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId));assert.equal(old.status,200);
  const retry=await h.batch();assert.equal(retry.status,429); // Reserve is for receipt GET authentication, not new write nonces.
  const cursor=await h.get(prefix+'/events?limit=1');assert.equal(cursor.status,429);assert.equal(cursor.body.code,'BUDGET_EXHAUSTED');
  const repack=clone(golden.batch);repack.batchId='capacity-exhausted';const denied=await h.batch(repack);assert.equal(denied.status,429);assert.equal(denied.body.code,'BUDGET_EXHAUSTED');
  assert.equal((await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId))).status,200);
});


test('latest decision uses revision; effective instrument withdrawals suppress dependent valuations',async t=>{
  const h=await harness(t);await h.stage();await h.batch();
  const d=clone(golden.batch.events.find(x=>x.type==='decision.published')!);assert.ok(d.type==='decision.published');
  d.eventId='late-decision-v2';d.sourceSequence='31';d.payload.proposal.decisionId='out-of-order-decision';d.payload.proposal.revision=2;d.payload.proposalHash=canonicalHash(d.payload.proposal);d.payload.review.proposalHash=d.payload.proposalHash;d.payload.review.proposalRevision=2;d.payload.review.reviewId='late-review-v2';
  const send=(event:typeof d,id:string)=>h.batch({...golden.batch,batchId:id,events:[event]});assert.equal((await send(d,'decision-v2')).status,201);
  const older=clone(d);older.eventId='late-decision-v1';older.sourceSequence='30';older.payload.proposal.revision=1;older.payload.proposalHash=canonicalHash(older.payload.proposal);older.payload.review.proposalHash=older.payload.proposalHash;older.payload.review.proposalRevision=1;older.payload.review.reviewId='late-review-v1';assert.equal((await send(older,'decision-v1')).status,201);
  const detail=(await h.get(prefix+'/decisions/out-of-order-decision')).body.decision as typeof d;assert.equal(detail.payload.proposal.revision,2);
  const s=clone(golden.batch.events.find(x=>x.type==='portfolio.snapshot')!),update=golden.batch.events.find(x=>x.type==='instrument.updated')!;assert.ok(s.type==='portfolio.snapshot'&&update.type==='instrument.updated');
  s.eventId='ticker-snapshot';s.sourceSequence='32';s.payload.valuationId='ticker-valuation';s.payload.valuationSequence='2';s.payload.valuationAsOf=update.payload.effectiveAt;s.payload.holdings[0]!.symbol=update.payload.instrument.symbol;
  assert.equal((await h.batch({...golden.batch,batchId:'ticker-snapshot-batch',events:[s]})).status,201);
  h.receiver.db.hide('fixture-experiment','fixture-run',update.eventId,'withdrawn',new Date(h.now()*1000).toISOString());
  const rows=(await h.get(prefix+'/events')).body.items as {event:{eventId:string}}[];assert.ok(!rows.some(x=>x.event.eventId===s.eventId));
});

test('observed-paper publication needs trusted local rights approval, never a publisher claim',async t=>{
  const h=await harness(t),event=clone(golden.batch.events[0]!);assert.ok(event.type==='run.published');
  event.evidenceMode='observed_paper';event.payload.runKind='official';event.payload.configuration.configurationStatus='owner_approved';event.payload.configuration.approvalRecordId='claimed-approval';event.payload.configurationHash=canonicalHash(event.payload.configuration);
  const response=await h.batch({...golden.batch,events:[event]});assert.equal(response.status,403,response.raw);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM runs')!.n,0);
});


test('latest withdrawn orders and operational status cannot fall back to obsolete state',async t=>{
  const h=await harness(t);await h.stage();await h.batch();
  const filled=golden.batch.events.find(x=>x.type==='paper.order'&&x.payload.status==='filled')!;assert.ok(filled.type==='paper.order');
  h.receiver.db.hide('fixture-experiment','fixture-run',filled.eventId,'withdrawn',new Date(h.now()*1000).toISOString());
  const detail=await h.get(prefix+'/decisions/fixture-decision');assert.equal(detail.status,200);assert.ok(!(detail.body.orders as {orderId:string}[]).some(x=>x.orderId===filled.payload.orderId));
  const state=clone(golden.batch.events.find(x=>x.type==='run.status')!);assert.ok(state.type==='run.status');state.eventId='later-status';state.sourceSequence='28';state.payload.state='paused';
  assert.equal((await h.batch({...golden.batch,batchId:'later-status',events:[state]})).status,201);
  h.receiver.db.hide('fixture-experiment','fixture-run',state.eventId,'withheld',new Date(h.now()*1000).toISOString());assert.equal((await h.get(prefix+'/status')).status,503);
  assert.equal((await h.get('/api/experiments/v1/experiments/fixture-experiment')).status,503);
});

test('rights approval revoked during asynchronous validation prevents observed batch commit',async t=>{
  const h=await harness(t),event=clone(golden.batch.events[0]!);assert.ok(event.type==='run.published');event.evidenceMode='observed_paper';event.payload.runKind='official';event.payload.configuration.configurationStatus='owner_approved';event.payload.configuration.approvalRecordId='synthetic-approval';event.payload.configurationHash=canonicalHash(event.payload.configuration);
  h.receiver.db.run('INSERT INTO publication_approvals VALUES(?,?,?,?)',event.experimentId,event.runId,event.payload.configurationHash,new Date(h.now()*1000).toISOString());
  h.fault('before-batch-commit',()=>{h.receiver.db.run('DELETE FROM publication_approvals');});
  assert.equal((await h.batch({...golden.batch,events:[event]})).status,403);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM events')!.n,0);
});

test('fresh signed receipts reject expired keys, inactive keys and expired publisher scopes',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const originalTime=h.now(),get=()=>h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId));
  h.setClock(h.key.notBefore-1);assert.equal((await get()).status,403);h.setClock(h.key.notAfter);assert.equal((await get()).status,403);h.setClock(originalTime);
  h.receiver.db.authorize({...h.scope,expiresAt:new Date(originalTime*1000).toISOString()},h.key,new Date(originalTime*1000).toISOString());assert.equal((await get()).status,403);
});
