import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { askHarness,askPrefix as p } from './ask-helpers.js';
import { examples, wireHttp } from './helpers.js';
import { createAsk } from '../src/ask/http.js';
import { randomUUID,generateKeyPairSync } from 'node:crypto';
import type { AskControlReceipt } from '../vendor/investment/v1/types.js';
import { backupAsk,restoreAsk,controlSnapshot,reconcileAsk } from '../src/ask/recovery.js';
import { AskStore } from '../src/ask/database.js';
import { AskAuthority } from '../src/ask/auth.js';
import { canonicalHash } from '../src/schema.js';

test('cancellation checkpoints private content out of SQLite and WAL before acknowledging',async t=>{
  const h=await askHarness(t),marker='PRIVATE-SYNTHETIC-WAL-SENTINEL-4124',q=await h.ready({text:marker});
  assert.equal((await h.browser(q.session,'POST',`${p}/questions/${q.admission.questionId}/cancel`,examples.AskCancel)).status,200);
  for(const file of await readdir(h.cfg.dataDir))if(file.startsWith('ask.sqlite'))assert.equal((await readFile(join(h.cfg.dataDir,file))).includes(Buffer.from(marker)),false,file);
});

test('private recovery copies omit raw content and restore held with retired sessions and keys',async t=>{
  const h=await askHarness(t),marker='PRIVATE-SYNTHETIC-BACKUP-SENTINEL-8742',q=await h.ready({text:marker});
  const answer=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery));assert.equal(answer.status,200);
  const backup=join(h.root,'recovery'),digest=await backupAsk(h.service.store,backup,h.now());
  for(const file of await readdir(backup))assert.equal((await readFile(join(backup,file))).includes(Buffer.from(marker)),false,file);
  assert.ok(h.service.store.get<{question_json:string}>('SELECT question_json FROM questions')!.question_json.includes(marker));
  const cancel=await h.browser(q.session,'POST',`${p}/questions/${q.admission.questionId}/cancel`,examples.AskCancel);assert.equal(cancel.status,200);
  const current=controlSnapshot(h.service.store,h.now());
  const relocated=join(h.root,'relocated');await rename(backup,relocated);
  const cfg=await restoreAsk(relocated,join(h.root,'restored'),digest,h.now());
  assert.equal(JSON.parse(await readFile(join(cfg.dataDir,'config.json'),'utf8')).enabled,false);
  assert.equal(cfg.enabled,false);assert.equal(cfg.admissionEnabled,false);
  const restored=new AskStore(cfg);t.after(()=>restored.close());
  assert.equal(restored.meta().held,1);assert.equal(new AskAuthority(restored,h.now).available(),false);
  assert.equal(restored.get<{question_json:null}>('SELECT question_json FROM questions')!.question_json,null);
  assert.equal(restored.get<{deleted:number}>('SELECT deleted FROM sessions')!.deleted,1);
  assert.deepEqual(JSON.parse(restored.get<{receipt_json:string}>('SELECT receipt_json FROM answers')!.receipt_json),answer.body);
  assert.throws(()=>reconcileAsk(restored,current,'0'.repeat(64),h.now()));
  const stale={...current,capturedAt:new Date((h.now()-301)*1000).toISOString()};assert.throws(()=>reconcileAsk(restored,stale,canonicalHash(stale),h.now()));
  current.generation='100';
  reconcileAsk(restored,current,canonicalHash(current),h.now());assert.equal(restored.meta().generation,'101');assert.equal(restored.meta().held,0);
  assert.ok(restored.get('SELECT 1 FROM controls WHERE id=?',cancel.body.controlId as string));
  assert.equal(new AskAuthority(restored,h.now).available(),false);
  assert.equal(restored.get<{question_json:null}>('SELECT question_json FROM questions')!.question_json,null);
});


test('restored HTTP listener rejects retired cookies, keys and claims; a fresh generation needs a new control barrier',async t=>{
  const h=await askHarness(t),q=await h.ready(),backup=join(h.root,'http-recovery');
  const digest=await backupAsk(h.service.store,backup,h.now()),journal=controlSnapshot(h.service.store,h.now());
  const cfg=await restoreAsk(backup,join(h.root,'http-restored'),digest,h.now());
  cfg.enabled=true;cfg.port=0;cfg.admissionEnabled=true;cfg.claimsEnabled=true;cfg.deliveryEnabled=true;
  let restored=await createAsk(cfg,{now:h.now,contextVisible:async()=>true});t.after(()=>restored.close());
  const request=(method:string,path:string,headers:[string,string][]=[],body=Buffer.alloc(0))=>wireHttp((restored.server.address() as {port:number}).port,method,path,[['Host',cfg.authority],...headers],body);
  const signed=async(method:'GET'|'POST',path:string,value?:unknown,id:ReturnType<typeof randomUUID>=randomUUID())=>{
    const msg=h.signed(method,path,value,id);
    return request(method,path,[...msg.headers,...(method==='POST'?[['Content-Length',String(msg.body.length)] as [string,string]]:[])],Buffer.from(msg.body));
  };
  const sessionBytes=Buffer.from(JSON.stringify(examples.AskSessionCreate));
  const newSession=()=>request('POST',p+'/sessions',[['Origin',cfg.origin],['Content-Type','application/json'],['Content-Length',String(sessionBytes.length)],['Idempotency-Key',randomUUID()]],sessionBytes);
  const retiredMessage=h.signed('GET',`${p}/hq/answers/${q.answer.answerId}/receipt`);
  assert.equal((await request('GET',p+'/availability')).body.state,'disabled');
  assert.equal((await newSession()).status,503);
  assert.equal((await request('GET',`${p}/conversations/${q.conversation.conversationId}`,q.session.headers)).status,404);
  assert.equal((await signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery)).status,401);
  await restored.close();const offline=new AskStore(cfg);journal.generation='100';
  reconcileAsk(offline,journal,canonicalHash(journal),h.now());offline.close();
  restored=await createAsk(cfg,{now:h.now,contextVisible:async()=>true});
  assert.equal((await request('GET',p+'/availability')).body.state,'paused');
  h.scope.consumerGeneration=restored.store.meta().generation;h.scope.keyId='fresh-restored-key';
  assert.throws(()=>restored.authority.authorize(h.scope,h.key));
  h.scope.consumerGeneration=String(BigInt(h.scope.consumerGeneration)+1n);
  const freshKeys=generateKeyPairSync('ed25519');h.keys.privateKey=freshKeys.privateKey;h.keys.publicKey=freshKeys.publicKey;
  h.key.publicKey=freshKeys.publicKey.export({type:'spki',format:'pem'}).toString();
  restored.authority.authorize(h.scope,h.key);
  assert.equal((await newSession()).status,503);
  assert.equal((await request('GET',p+'/availability')).body.state,'paused');
  let after:string|null=null,acknowledgedControlIds:string[]=[];
  for(let count=0;count<4;count++){
    const syncId=randomUUID(),response=await signed('POST',p+'/hq/control-sync',{schemaVersion:'1.0',serviceId:h.scope.serviceId,consumerGeneration:h.scope.consumerGeneration,syncId,after,acknowledgedControlIds},syncId);
    assert.equal(response.status,200,response.raw);
    const controls=response.body.controls as AskControlReceipt[];if(!controls.length&&response.body.nextCursor===null)break;
    after=response.body.nextCursor as string|null;acknowledgedControlIds=controls.map(row=>row.controlId);
  }
  assert.equal((await request('GET',p+'/availability')).body.state,'available');
  const freshSession=await newSession();assert.equal(freshSession.status,201,freshSession.raw);
  const freshCookie=(freshSession.headers['set-cookie'] as string[])[0]!.split(';')[0]!;
  assert.equal((await request('GET',`${p}/conversations/${q.conversation.conversationId}`,[['Origin',cfg.origin],['Cookie',freshCookie]])).status,404);
  assert.equal((await request('GET',retiredMessage.path,retiredMessage.headers)).status,401);
  const staleId=randomUUID();const stale=await signed('POST',p+'/hq/claims',{schemaVersion:'1.0',serviceId:h.scope.serviceId,consumerGeneration:'101',claimRequestId:staleId,capacity:1},staleId);assert.equal(stale.status,409,stale.raw);
  const late=await signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,{...q.delivery,consumerGeneration:h.scope.consumerGeneration});
  assert.equal(late.status,403,late.raw);
  assert.equal((await request('GET',`${p}/conversations/${q.conversation.conversationId}`,q.session.headers)).status,404);
  assert.equal(restored.store.get<{n:number}>('SELECT count(*) n FROM answers WHERE answer_json IS NOT NULL')!.n,0);
});
