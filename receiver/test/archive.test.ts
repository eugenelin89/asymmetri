import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync, crc32 } from 'node:zlib';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from 'node:net';
import { once } from 'node:events';
import { Controls } from '../src/controls.js';
import { Archive } from '../src/database.js';
import { PublicReads } from '../src/reads.js';
import { backup, restore } from '../src/backup.js';
import { checkContent } from '../src/content.js';
import { canonicalHash, sha256 } from '../src/schema.js';
import type { ArtifactDetail, ArtifactPage, DiscussionDetail, ContentType, EventBatch } from '../vendor/investment/v1/types.js';
import { harness, golden, prefix, clone } from './helpers.js';
const time='2026-01-05T22:00:00Z',e='fixture-experiment',r='fixture-run',artifact=prefix+'/artifacts/fixture-artifact/versions/';
function png(suffix:Buffer=Buffer.alloc(0)):Buffer{
  const chunk=(type:string,data:Buffer)=>{const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(type,4);data.copy(b,8);b.writeUInt32BE(crc32(b.subarray(4,-4)),b.length-4);return b;};
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(1);ihdr.writeUInt32BE(1,4);ihdr.set([8,6,0,0,0],8);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',Buffer.concat([deflateSync(Buffer.from([0,20,60,80,255])),suffix])),chunk('IEND',Buffer.alloc(0))]);
}
test('all allowed formats validate and unused PNG compressed input is rejected',()=>{
  for(const [type,bytes] of [['text/plain',Buffer.from('Synthetic text')],['text/markdown',Buffer.from('# Synthetic report\n[Source](https://example.com/research)')],['application/json',Buffer.from('{"synthetic":true}')],['text/csv',Buffer.from('label,value\nsynthetic,2')],['image/png',png()]] as [ContentType,Buffer][]){assert.equal(checkContent(bytes,type,sha256(bytes)).sizeBytes,bytes.length);}
  for(const bytes of [png(Buffer.from('hidden')),png(deflateSync(Buffer.from('second')))])assert.throws(()=>checkContent(bytes,'image/png',sha256(bytes)));
  for(const [type,text] of [['text/markdown','[x](java%73cript:alert)'],['text/markdown','![x](https://example.com/image)'],['text/plain','<svg onload=alert(1)>'],['text/csv','a,b\nx, =1+1'],['text/csv','a,b\nx,"\t@SUM(1)"'],['application/json','{"a":1,"a":2}']] as [ContentType,string][])assert.throws(()=>checkContent(Buffer.from(text),type,sha256(text)));
});
test('exact content versions, statuses, hashes and immutable decision evidence survive restart',async t=>{
  const h=await harness(t);await h.stage();assert.equal((await h.batch()).status,201);
  const v1=(await h.get(artifact+'1')).body as unknown as ArtifactDetail;assert.equal(v1.status,'superseded');
  const download=await h.get(artifact+'1/content');assert.equal(download.status,200);assert.equal(sha256(download.raw),v1.metadata!.sha256);assert.match(String(download.headers['content-disposition']),/^attachment;/);assert.equal(download.headers['cache-control'],'private, no-store');
  assert.equal((await h.get(prefix+'/content/'+v1.metadata!.sha256)).status,405);
  await h.restart();assert.equal(sha256((await h.get(artifact+'1/content')).raw),v1.metadata!.sha256);
  const decision=golden.batch.events.find(x=>x.type==='decision.published')!;assert.ok(JSON.stringify((await h.get(prefix+'/events')).body).includes(decision.eventId));
});
test('registry lifecycle never loses an explicitly hidden registration',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const controls=new Controls(h.receiver.db);
  for(const status of ['awaiting_publication','failed','withheld','withdrawn'] as const){
    controls.registry(e,r,'fixture-artifact',status,time);const page=(await h.get(prefix+'/artifacts')).body as unknown as ArtifactPage;
    assert.equal(page.items.length,1);
    if(['withheld','withdrawn'].includes(status)){assert.equal(page.items[0]!.status,status);assert.equal(page.items[0]!.registration.title,'Unavailable investment deliverable');assert.equal((await h.get(artifact+'1/content')).status,410);}
  }
  const n=h.receiver.db.get<{n:number}>('SELECT count(*) n FROM artifact_controls')!.n;controls.registry(e,r,'fixture-artifact','withdrawn',time);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM artifact_controls')!.n,n);assert.throws(()=>controls.registry(e,r,'fixture-artifact','registered',time));
});
test('unpublished deliverable has safe exact-version waiting state',async t=>{
  const h=await harness(t),batch=clone(golden.batch);const index=batch.events.findIndex(x=>x.type==='artifact.registered');batch.events=batch.events.slice(0,index+1) as EventBatch['events'];await h.stage();assert.equal((await h.batch(batch)).status,201);
  assert.equal((await h.get(artifact+'1')).body.status,'registered');assert.equal((await h.get(artifact+'1/content')).status,409);assert.equal((await h.get(artifact+'2')).status,404);
});
test('withdrawal invalidates cache/cursor and interrupts pending download before headers',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const before=await h.get(artifact+'1'),cursor=(await h.get(prefix+'/events?limit=2')).body.nextCursor;
  const v=golden.batch.events.find(x=>x.type==='artifact.published')!;
  h.fault('before-download-headers',()=>h.receiver.db.hide(e,r,v.eventId,'withdrawn',time));assert.equal((await h.get(artifact+'1/content')).status,410);h.fault('');
  const after=await h.get(artifact+'1',[['If-None-Match',String(before.headers.etag)]]);assert.equal(after.status,200);assert.equal(after.body.metadata,null);assert.notEqual(after.headers.etag,before.headers.etag);
  assert.equal((await h.get(prefix+'/events?limit=2&after='+cursor)).body.code,'CURSOR_RESET');
  new Controls(h.receiver.db).releaseCorrection(e,r,golden.batch.events.find(x=>x.type==='artifact.published'&&x.payload.version===2)!.eventId,time);
  assert.equal((await h.get(artifact+'2/content')).status,200);assert.equal((await h.get(artifact+'1/content')).status,410);
});
test('owner and system contributions are distinct; closure is terminal',async t=>{
  const h=await harness(t);await h.stage();const base=clone(golden.batch),closure=base.events.findIndex(x=>x.type==='discussion.closed');const contribution=base.events.find(x=>x.type==='discussion.contribution')!;
  assert.equal(contribution.type,'discussion.contribution');if(contribution.type!=='discussion.contribution')return;
  const first:EventBatch={...base,batchId:'open-topic',events:base.events.slice(0,closure) as EventBatch['events']};assert.equal((await h.batch(first)).status,201);
  const count=first.events.filter(x=>x.type==='discussion.contribution').length;
  for(const [index,kind]of ['owner','system'].entries()){
    const item=clone(contribution);item.eventId='interjection-'+kind;item.sourceSequence=String(100+index);item.actor={kind:kind as 'owner'|'system'};item.payload.contributionId='contribution-'+kind;item.payload.ordinal=String(count+index+1);
    assert.equal((await h.batch({...base,batchId:'batch-'+kind,events:[item]})).status,201);
  }
  const detail=(await h.get(prefix+'/discussions/'+contribution.payload.discussionId)).body as unknown as DiscussionDetail;assert.deepEqual(detail.contributions.slice(-2).map(x=>x.actor.kind),['owner','system']);
  const closing=base.events[closure]!;assert.equal((await h.batch({...base,batchId:'close-topic',events:[closing]})).status,201);
  const later=clone(contribution);later.eventId='late-contribution';later.sourceSequence='103';later.payload.contributionId='late';later.payload.ordinal=String(count+3);assert.equal((await h.batch({...base,batchId:'late',events:[later]})).status,409);
  assert.equal((await h.batch({...base,batchId:'double-close',events:[{...closing,eventId:'close-again',sourceSequence:'104'}]})).status,409);
});
test('complete backup restore verifies bytes, preserves newer controls and fences old authority',async t=>{
  const h=await harness(t);await h.stage();await h.batch();const root=await mkdtemp(join(tmpdir(),'inv03-backup-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const receipt=(await h.batch()).body,source=join(root,'backup');const saved=await backup(h.receiver.db,source,time);
  const v=golden.batch.events.find(x=>x.type==='artifact.published')!;h.receiver.db.hide(e,r,v.eventId,'withdrawn',time);const current=new Controls(h.receiver.db).snapshot();
  const cfg=await restore(source,join(root,'restore'),saved.digest,time),db=new Archive(cfg);try{
    const reads=new PublicReads(db,h.now);assert.throws(()=>reads.artifact(e,r,'fixture-artifact',1));assert.equal(db.key(h.scope.keyId)!.revoked,1);
    const controls=new Controls(db);controls.reconcile(current,canonicalHash(current),time);assert.equal((reads.artifact(e,r,'fixture-artifact',1).body as ArtifactDetail).status,'withdrawn');
    assert.deepEqual(JSON.parse(db.get<{receipt_json:string}>('SELECT receipt_json FROM batches')!.receipt_json),receipt);
  }finally{db.close();}
  await writeFile(join(source,'data','objects',golden.content[0]!.sha256),'tampered');await assert.rejects(restore(source,join(root,'bad'),saved.digest,time));
});
test('malformed first request cannot execute signed second request on same socket',async t=>{
  const h=await harness(t);await h.stage();await h.batch();
  for(const header of ['Connection: keep-alive\r\nConnection: keep-alive','Expect: unsupported','Expect: 100-continue','Host: receiver.test']){
    const m=h.signed('GET',prefix+'/receipts/'+golden.batch.batchId),before=JSON.stringify(h.receiver.db.all('SELECT * FROM nonces'));
    await new Promise<void>((resolve,reject)=>{const socket=connect((h.receiver.server.address() as {port:number}).port,'127.0.0.1');socket.on('error',e=>{if((e as NodeJS.ErrnoException).code!=='ECONNRESET')reject(e);});socket.on('close',()=>resolve());socket.on('data',()=>{});socket.on('connect',()=>socket.write(`GET ${prefix}/status HTTP/1.1\r\nHost: receiver.test\r\n${header}\r\n\r\nGET ${m.path} HTTP/1.1\r\nHost: receiver.test\r\n${m.headers.map(([k,v])=>`${k}: ${v}`).join('\r\n')}\r\n\r\n`));});
    assert.equal(JSON.stringify(h.receiver.db.all('SELECT * FROM nonces')),before);
  }
});
test('every safe format downloads exact bytes; active withdrawal blocks aliases and late uploads',async t=>{
 const h=await harness(t);await h.stage();await h.batch();let sequence=100;
 const registration=golden.batch.events.find(x=>x.type==='artifact.registered')!,version=golden.batch.events.find(x=>x.type==='artifact.published')!;
 if(registration.type!=='artifact.registered'||version.type!=='artifact.published')throw new Error('fixture');
 const formats:[ContentType,Buffer][]=[['text/plain',Buffer.from('SYNTHETIC '+ 'x'.repeat(90000))],['text/markdown',Buffer.from('# SYNTHETIC report')],['application/json',Buffer.from('{"synthetic":true}')],['text/csv',Buffer.from('kind,value\nsynthetic,1')],['image/png',png()]];
 for(const [index,[type,bytes]]of formats.entries()){
  const id='safe-format-'+index,hash=sha256(bytes),reg=clone(registration),v=clone(version);
  reg.eventId=id+'-reg';reg.sourceSequence=String(sequence++);reg.payload.artifactId=id;v.eventId=id+'-version';v.sourceSequence=String(sequence++);Object.assign(v.payload,{artifactId:id,contentType:type,sha256:hash,sizeBytes:bytes.length});
  assert.equal((await h.send(h.signed('PUT',prefix+'/content/'+hash,bytes,id+'-upload',type))).status,201);
  assert.equal((await h.batch({...golden.batch,batchId:id,events:[reg,v]})).status,201);
  const route=prefix+'/artifacts/'+id+'/versions/1/content';assert.equal(sha256((await h.get(route)).bytes),hash);
  if(index===0){
   const aliasReg=clone(reg),alias=clone(v);aliasReg.eventId='alias-reg';aliasReg.sourceSequence=String(sequence++);aliasReg.payload.artifactId='alias';alias.eventId='alias-version';alias.sourceSequence=String(sequence++);alias.payload.artifactId='alias';
   assert.equal((await h.batch({...golden.batch,batchId:'alias',events:[aliasReg,alias]})).status,201);
   h.fault('download-chunk',()=>h.receiver.db.hide(e,r,v.eventId,'withdrawn',time));await assert.rejects(h.get(route));h.fault('');
   assert.equal((await h.get(prefix+'/artifacts/alias/versions/1/content')).status,410);
   assert.equal((await h.send(h.signed('PUT',prefix+'/content/'+hash,bytes,'withdrawn-retry',type))).status,410);
  }
 }
});
test('artifact rights approval binds exact metadata and changes visibility epoch',async t=>{
 const h=await harness(t),v=clone(golden.batch.events.find(x=>x.type==='artifact.published')!);if(v.type!=='artifact.published')throw new Error('fixture');
 const controls=new Controls(h.receiver.db);assert.equal(controls.approved(e,r,v.payload),false);const epoch=h.receiver.db.meta().visibility_epoch;
 controls.approve(e,r,v.payload,time);assert.equal(controls.approved(e,r,v.payload),true);assert.ok(h.receiver.db.meta().visibility_epoch>epoch);
 const changed=clone(v.payload);changed.title+=' changed';assert.equal(controls.approved(e,r,changed),false);assert.equal(controls.approved(e,'other-run',v.payload),false);assert.throws(()=>controls.approve(e,r,changed,time));
 h.receiver.db.fenceRestore(time);assert.equal(controls.approved(e,r,v.payload),false);
});
test('newer unknown-event suppression survives old-backup replay',async t=>{
 const h=await harness(t);await h.stage();await h.batch();const controls=new Controls(h.receiver.db),snapshot=controls.snapshot();snapshot.visibility.push({experiment_id:e,run_id:r,event_id:'future-suppressed',visibility:'withdrawn',recorded_at:time});
 h.receiver.db.fenceRestore(time);controls.reconcile(snapshot,canonicalHash(snapshot),time);
 const event=clone(golden.batch.events.find(x=>x.type==='worker.activity')!);event.eventId='future-suppressed';event.sourceSequence='100';
 h.receiver.db.atomic(()=>h.receiver.db.insertEvent(event,time,'synthetic-recovery'));
 assert.ok(!(new PublicReads(h.receiver.db,h.now).visible(e,r).rows.some(x=>x.event_id===event.eventId)));
});
test('withdrawal during staging and restored future suppression reject late metadata',async t=>{
 const h=await harness(t),batch=clone(golden.batch),index=batch.events.findIndex(x=>x.type==='artifact.registered'),registration=batch.events[index]!;
 batch.events=batch.events.slice(0,index+1) as EventBatch['events'];assert.equal((await h.batch(batch)).status,201);
 await h.stage();const version=clone(golden.batch.events.find(x=>x.type==='artifact.published')!);version.sourceSequence='100';
 h.fault('before-batch-commit',()=>{h.receiver.db.hide(e,r,registration.eventId,'withdrawn',time);h.fault('');});
 const late={...golden.batch,batchId:'late-after-withdrawal',events:[version]} as EventBatch;
 assert.equal((await h.batch(late)).status,410);assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM artifact_versions')!.n,0);
 const snapshot=new Controls(h.receiver.db).snapshot();snapshot.visibility.push({experiment_id:e,run_id:r,event_id:'future-version',visibility:'withdrawn',recorded_at:time});
 h.receiver.db.fenceRestore(time);new Controls(h.receiver.db).reconcile(snapshot,canonicalHash(snapshot),time);
 h.scope.generation=String(BigInt(h.scope.generation)+1n);h.scope.keyId='fresh-synthetic';h.receiver.db.authorize(h.scope,h.key,time);
 version.eventId='future-version';assert.equal((await h.batch({...late,batchId:'future',events:[version]})).status,410);
});
test('restore-incomplete marker prevents accidental service startup',async t=>{
 const h=await harness(t);await h.stage();await h.batch();await h.receiver.close();
 await writeFile(join(h.dir,'RESTORE_INCOMPLETE'),'Synthetic interrupted restore');
 const {createReceiver}=await import('../src/http.js');await assert.rejects(createReceiver(h.cfg));
});
test('authenticated backup encryption round-trip rejects tampering and removes failed plaintext',async t=>{
 const {randomBytes}=await import('node:crypto'),{readFile,stat}=await import('node:fs/promises'),{sealFile,openFile}=await import('../src/encryption.js');
 const root=await mkdtemp(join(tmpdir(),'inv03-encrypted-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const bytes=randomBytes(1024*1024),key=randomBytes(32);await writeFile(join(root,'source'),bytes);
 await sealFile(join(root,'source'),join(root,'sealed'),key);await openFile(join(root,'sealed'),join(root,'opened'),key);assert.equal(sha256(await readFile(join(root,'opened'))),sha256(bytes));
 const bad=await readFile(join(root,'sealed'));bad[24]=bad[24]!^1;await writeFile(join(root,'bad'),bad);await assert.rejects(openFile(join(root,'bad'),join(root,'rejected'),key));await assert.rejects(stat(join(root,'rejected')));key.fill(0);
});
test('signed observed artifact needs exact owner approval beyond the approved run',async t=>{
 const h=await harness(t);await h.stage();await h.batch();const controls=new Controls(h.receiver.db),original=clone(golden.batch.events.find(x=>x.type==='artifact.published')!);if(original.type!=='artifact.published')throw Error('fixture');
 const run=h.receiver.db.get<{config_hash:string}>('SELECT config_hash FROM runs')!;h.receiver.db.run('INSERT INTO publication_approvals VALUES(?,?,?,?)',e,r,run.config_hash,time);
 original.evidenceMode='observed_paper';original.eventId='observed-unapproved';original.sourceSequence='100';original.payload.version=3;original.payload.supersedes={kind:'artifact',id:original.payload.artifactId,version:2,relation:'supersedes'};
 const batch={...golden.batch,batchId:'observed-unapproved',events:[original]} as EventBatch;assert.equal((await h.batch(batch)).status,403);
 controls.approve(e,'wrong-run',original.payload,time);assert.equal((await h.batch(batch)).status,403);
 const changed=clone(original.payload);changed.title+=' wrong metadata';controls.approve(e,r,changed,time);assert.equal((await h.batch(batch)).status,403);
 assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM artifact_versions WHERE version=3')!.n,0);
});
test('stalled large download has an absolute deadline and releases admission',async t=>{
 const {randomBytes}=await import('node:crypto'),{setTimeout:delay}=await import('node:timers/promises');
 const h=await harness(t);await h.stage();await h.batch();
 const chunk=(type:string,data:Buffer)=>{const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(type,4);data.copy(b,8);b.writeUInt32BE(crc32(b.subarray(4,-4)),b.length-4);return b;};
 const header=Buffer.alloc(13);header.writeUInt32BE(1000);header.writeUInt32BE(1000,4);header.set([8,6,0,0,0],8);const pixels=randomBytes(4001000);for(let y=0;y<1000;y++)pixels[y*4001]=0;
 const bytes=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]),hash=sha256(bytes);
 assert.ok(bytes.length<4194304);assert.equal((await h.send(h.signed('PUT',prefix+'/content/'+hash,bytes,'large-image','image/png'))).status,201);
 const reg=clone(golden.batch.events.find(x=>x.type==='artifact.registered')!),v=clone(golden.batch.events.find(x=>x.type==='artifact.published')!);if(reg.type!=='artifact.registered'||v.type!=='artifact.published')throw Error('fixture');
 reg.eventId='large-reg';reg.sourceSequence='100';reg.payload.artifactId='large';v.eventId='large-version';v.sourceSequence='101';Object.assign(v.payload,{artifactId:'large',contentType:'image/png',sha256:hash,sizeBytes:bytes.length});assert.equal((await h.batch({...golden.batch,batchId:'large',events:[reg,v]})).status,201);
 const socket=connect((h.receiver.server.address() as {port:number}).port,'127.0.0.1');t.after(()=>socket.destroy());socket.on('error',()=>{});socket.pause();socket.on('connect',()=>socket.write(`GET ${prefix}/artifacts/large/versions/1/content HTTP/1.1\r\nHost: receiver.test\r\nConnection: close\r\n\r\n`));
 await delay(500);assert.equal(h.receiver.diagnostics.active,1);await delay(15500);assert.equal(h.receiver.diagnostics.active,0);assert.equal((await h.get(prefix+'/status')).status,200);
});
test('encrypted backup ceiling and crashes never publish incomplete final files',async t=>{
 const {randomBytes}=await import('node:crypto'),{truncate,stat,readdir}=await import('node:fs/promises'),{spawn}=await import('node:child_process');
 const {sealFile,openFile,maxEncryptedBytes}=await import('../src/encryption.js');const root=await mkdtemp(join(tmpdir(),'inv03-seal-crash-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const key=randomBytes(32);await writeFile(join(root,'empty'),'');await sealFile(join(root,'empty'),join(root,'empty-sealed'),key);await openFile(join(root,'empty-sealed'),join(root,'empty-opened'),key);assert.equal((await stat(join(root,'empty-opened'))).size,0);await writeFile(join(root,'oversized'),'');await truncate(join(root,'oversized'),maxEncryptedBytes-35);await assert.rejects(sealFile(join(root,'oversized'),join(root,'oversized-output'),key));await assert.rejects(stat(join(root,'oversized-output')));
 await writeFile(join(root,'source'),'SYNTHETIC backup');await writeFile(join(root,'key'),key,{mode:0o600});await sealFile(join(root,'source'),join(root,'encrypted'),key);
 for(const [mode,source]of [['sealFile','source'],['openFile','encrypted']]){
  const destination=join(root,'crashed-'+mode),child=spawn(process.execPath,['--input-type=module','-e',`import {readFile} from 'node:fs/promises';import {${mode}} from ${JSON.stringify(new URL('../src/encryption.js',import.meta.url).href)};await ${mode}(process.argv[1],process.argv[2],await readFile(process.argv[3]),()=>process.kill(process.pid,'SIGKILL'));`,join(root,source!),destination,join(root,'key')]);
  const [,signal]=await once(child,'exit');assert.equal(signal,'SIGKILL');await assert.rejects(stat(destination));assert.ok((await readdir(root)).some(x=>x.startsWith('crashed-'+mode+'.partial-')));
 }
});
