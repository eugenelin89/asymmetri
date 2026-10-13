import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { askHarness, askPrefix as p } from './ask-helpers.js';
import { examples, encode } from './helpers.js';
import { canonicalHash, sha256 } from '../src/schema.js';
import type { AskClaim, AskControlReceipt } from '../vendor/investment/v1/types.js';
import { time } from '../src/ask/database.js';

test('private sessions use hash-only cookies, current ownership and CSRF; IDs never recover credentials', async t => {
  const h = await askHarness(t), requestId = randomUUID(), a = await h.session(requestId), b = await h.session();
  assert.match(a.cookie, /^__Host-botsquad_ask=[A-Za-z0-9_-]{43}$/);
  const saved = h.service.store.get<{secret_hash:string}>('SELECT secret_hash FROM sessions WHERE id=?',a.body.sessionId)!;
  assert.equal(saved.secret_hash,sha256(a.cookie.split('=')[1]!));
  const conversation = await h.conversation(a), path = p+'/conversations/'+conversation.conversationId;
  assert.equal((await h.browser(b,'GET',path)).status,404);
  assert.equal((await h.browser(a,'GET',p+'/conversations/unknown')).status,404);
  assert.equal((await h.request('GET',path,[['Sec-Fetch-Site','same-origin'],['Cookie',a.cookie]])).status,200);
  assert.equal((await h.request('GET',path,[['Cookie',a.cookie]])).status,403);
  assert.equal((await h.request('GET',path,[['Origin','null'],['Cookie',a.cookie]])).status,403);
  const noCsrf = {headers:a.headers.filter(([name])=>name!=='X-CSRF-Token')};
  assert.equal((await h.browser(noCsrf,'DELETE',path)).status,403);
  const retry = await h.browser(a,'POST',p+'/sessions',examples.AskSessionCreate,requestId);
  assert.equal(retry.status,201);assert.equal(retry.headers['set-cookie'],undefined);
  const stolen = await h.browser(b,'POST',p+'/sessions',examples.AskSessionCreate,requestId);
  assert.equal(stolen.status,409);
  const noCookie = await h.request('POST',p+'/sessions',[['Origin',h.cfg.origin],['Content-Type','application/json'],
    ['Content-Length',String(encode(examples.AskSessionCreate).length)],['Idempotency-Key',requestId]],encode(examples.AskSessionCreate));
  assert.equal(noCookie.status,404);
  h.setClock(Date.parse(a.body.expiresAt)/1000);
  assert.equal((await h.browser(a,'GET',path)).status,404);
});

test('concurrent duplicate admission commits one immutable question and cannot bypass the outstanding limit', async t => {
  const h=await askHarness(t), a=await h.session(), c=await h.conversation(a), id=randomUUID();
  const results=await Promise.all([h.question(a,c,{},id),h.question(a,c,{},id)]);
  assert.deepEqual(results.map(r=>r.status),[202,202]);assert.deepEqual(results[0]!.body,results[1]!.body);
  assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM questions')!.n,1);
  assert.equal((await h.question(a,c,{text:'Changed bytes'},id)).status,409);
  assert.equal((await h.question(a,c)).status,409);
  const stored=JSON.parse(h.service.store.get<{question_json:string}>('SELECT question_json FROM questions')!.question_json);
  const {questionHash,...rest}=stored;assert.equal(questionHash,canonicalHash(rest));
  const other=await h.session();assert.equal((await h.question(other,c)).status,404);
  assert.equal((await h.question(a,c,{workerId:'privileged-worker'})).status,422);
});

test('signed answer identity survives wrapper retries and restart, while changed content conflicts', async t => {
  const h=await askHarness(t), q=await h.ready(), path=`${p}/hq/questions/${q.admission.questionId}/answer`, id=randomUUID();
  const first=await h.send(h.signed('POST',path,q.delivery,id));assert.equal(first.status,200,first.raw);
  assert.equal(first.body.disposition,'accepted');assert.equal(first.body.answerDigest,canonicalHash(q.answer));
  assert.deepEqual((await h.send(h.signed('POST',path,q.delivery,id))).body,first.body);
  assert.deepEqual((await h.send(h.signed('POST',path,q.delivery))).body,first.body);
  const changed={...q.delivery,answer:{...q.answer,text:'Changed answer'}};
  assert.equal((await h.send(h.signed('POST',path,changed))).status,409);
  await h.restart();
  assert.deepEqual((await h.send(h.signed('GET',`${p}/hq/answers/${q.answer.answerId}/receipt`))).body,first.body);
  const own=await h.browser(q.session,'GET',`${p}/conversations/${q.conversation.conversationId}`);
  assert.equal((own.body.turns as {answer:{answerId:string}}[])[0]!.answer.answerId,q.answer.answerId);
  assert.equal(own.headers['cache-control'],'private, no-store');assert.equal(own.headers['x-robots-tag'],'noindex, nofollow');
  assert.equal((await h.request('GET','/api/experiments/v1/experiments/fixture-experiment')).status,400);
});

for(const action of ['cancel','delete'] as const)test(`${action} suppresses late answers and purges cached claim bodies without extending repeated controls`,async t=>{
  const h=await askHarness(t), q=await h.ready();
  const path=action==='cancel'?`${p}/questions/${q.admission.questionId}/cancel`:`${p}/conversations/${q.conversation.conversationId}`;
  const result=await h.browser(q.session,action==='cancel'?'POST':'DELETE',path,action==='cancel'?examples.AskCancel:undefined);
  assert.equal(result.status,200,result.raw);
  const duplicate=await h.browser(q.session,action==='cancel'?'POST':'DELETE',path,action==='cancel'?examples.AskCancel:undefined);
  assert.equal(duplicate.body.controlId,result.body.controlId);
  assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM controls')!.n,1);
  assert.equal(h.service.store.get<{question_json:string|null}>('SELECT question_json FROM questions')!.question_json,null);
  assert.equal(h.service.store.get<{response_json:string|null}>("SELECT response_json FROM transport_receipts WHERE target LIKE '%/claims'")!.response_json,null);
  const response=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery));
  assert.equal(response.status,200,response.raw);assert.equal(response.body.disposition,action==='cancel'?'discarded_cancelled':'discarded_deleted');
  assert.equal(h.service.store.get<{answer_json:string|null}>('SELECT answer_json FROM answers')!.answer_json,null);
  await h.restart();assert.equal((await h.send(h.signed('GET',`${p}/hq/answers/${q.answer.answerId}/receipt`))).status,200);
});

test('control pages require delivered acknowledgments and a final empty current-generation barrier',async t=>{
  const h=await askHarness(t), a=await h.session(), c=await h.conversation(a);
  for(let n=0;n<101;n++)h.service.store.atomic(()=>h.service.lifecycle.control(c.conversationId,'synthetic-question-'+n,'cancel',h.now()));
  const first=await h.sync();assert.equal(first.status,200,first.raw);
  assert.equal((first.body.controls as unknown[]).length,100);assert.ok(first.body.nextCursor);
  assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM barriers WHERE watermark>0')!.n,0);
  const bad=await h.sync(['unknown-control'],first.body.nextCursor as string);assert.equal(bad.status,409);
  const missing=await h.sync([],first.body.nextCursor as string);assert.equal((missing.body.controls as unknown[]).length,1);
  assert.equal((await h.sync([],missing.body.nextCursor as string)).status,409);
  const ids=(first.body.controls as AskControlReceipt[]).map(row=>row.controlId);
  const second=await h.sync(ids,first.body.nextCursor as string);assert.equal(second.status,200,second.raw);
  const final=await h.sync((second.body.controls as AskControlReceipt[]).map(row=>row.controlId),second.body.nextCursor as string);
  assert.equal(final.status,200,final.raw);assert.deepEqual(final.body.controls,[]);assert.equal(final.body.nextCursor,null);
  assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM barriers WHERE watermark>0')!.n,1);
});

test('new controls invalidate answer barriers and withdrawn original context suppresses uncited output',async t=>{
  const h=await askHarness(t), q=await h.ready({context:(examples.AskQuestionInput as {context:unknown}).context});
  h.setVisible(false);
  const response=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery));
  assert.equal(response.status,200,response.raw);assert.equal(response.body.disposition,'withheld_evidence');
  assert.equal(h.service.store.get<{answer_json:string|null}>('SELECT answer_json FROM answers')!.answer_json,null);
});

test('raw expiry notifies HQ and prevents outstanding or cached-body resurrection',async t=>{
  const limits={...examples.AskLimits as object,configurationStatus:'owner_approved',approvalRecordId:'test-approval',rawRetentionSeconds:60} as never;
  const h=await askHarness(t,{limits}), q=await h.ready();h.setClock(h.now()+60);
  const response=await h.sync();assert.equal(response.status,200,response.raw);
  assert.equal((response.body.controls as AskControlReceipt[])[0]!.action,'expire');
  assert.equal(h.service.store.get<{state:string}>('SELECT state FROM questions')!.state,'expired');
  assert.equal(h.service.store.get<{question_json:string|null}>('SELECT question_json FROM questions')!.question_json,null);
  const late=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery));
  assert.equal(late.body.disposition,'discarded_expired');
});

test('short scope/key lifetime bounds leases; old claim replay after renewal fails expired',async t=>{
  const h=await askHarness(t), a=await h.session(), c=await h.conversation(a);await h.question(a,c);
  h.scope.expiresAt=time(h.now()+40);h.service.authority.authorize(h.scope,h.key);
  const id=randomUUID(), response=await h.claim(id);assert.equal(response.status,200,response.raw);
  const claim=response.body.claim as AskClaim;assert.equal(claim.leaseExpiresAt,h.scope.expiresAt);
  h.scope.expiresAt=time(h.now()+600);h.service.authority.authorize(h.scope,h.key);
  h.setClock(h.now()+20);
  const renewed=await h.send(h.signed('POST',`${p}/hq/claims/${claim.claimId}/renew`,{schemaVersion:'1.0',serviceId:h.scope.serviceId,
    consumerGeneration:h.scope.consumerGeneration,questionId:claim.question.questionId,questionHash:claim.question.questionHash}));
  assert.equal(renewed.status,200,renewed.raw);h.setClock(h.now()+21);
  assert.equal((await h.claim(id)).status,410);
});

test('future answer accounting time cannot create an unreconcilable receipt',async t=>{
  const h=await askHarness(t),q=await h.ready();
  const response=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,{...q.delivery,answer:{...q.answer,generatedAt:time(h.now()+1)}}));
  assert.equal(response.status,400);assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM answers')!.n,0);
});

test('ordinary traffic exhaustion leaves authenticated cancellation and HQ reconciliation available',async t=>{
  const h=await askHarness(t),q=await h.ready();
  for(let i=0;i<300;i++)await h.request('GET',p+'/availability');
  assert.equal((await h.request('GET',p+'/availability')).status,429);
  assert.equal((await h.browser(q.session,'POST',`${p}/questions/${q.admission.questionId}/cancel`,examples.AskCancel)).status,200);
  assert.equal((await h.sync()).status,200);
});

test('expired authority pauses availability and prevents new session admission',async t=>{
  const h=await askHarness(t);h.setClock(h.key.notAfter);
  assert.equal((await h.request('GET',p+'/availability')).body.state,'paused');
  const bytes=encode(examples.AskSessionCreate);
  const response=await h.request('POST',p+'/sessions',[['Origin',h.cfg.origin],['Content-Type','application/json'],['Content-Length',String(bytes.length)],['Idempotency-Key',randomUUID()]],bytes);
  assert.equal(response.status,503);assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM sessions')!.n,0);
});

test('cancellation during archive verification wins over the cached private answer',async t=>{
  const h=await askHarness(t),q=await h.ready();
  assert.equal((await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery))).status,200);
  let entered!:()=>void,finish!:(value:boolean)=>void;
  const started=new Promise<void>(resolve=>{entered=resolve;});
  h.contextHook(()=>{entered();return new Promise<boolean>(resolve=>{finish=resolve;});});
  const pending=h.browser(q.session,'GET',`${p}/conversations/${q.conversation.conversationId}`);
  await started;
  assert.equal((await h.browser(q.session,'POST',`${p}/questions/${q.admission.questionId}/cancel`,examples.AskCancel)).status,200);
  finish(true);assert.deepEqual((await pending).body.turns,[]);
});

test('large Unicode replies paginate by bytes and every valid owned turn remains readable',async t=>{
  const h=await askHarness(t),session=await h.session(),conversation=await h.conversation(session);let prior:string|null=null;
  for(let index=0;index<8;index++){
    if(index===5){h.setClock(h.now()+3600);await h.barrier();}
    const admitted=await h.question(session,conversation,{priorQuestionId:prior});assert.equal(admitted.status,202,admitted.raw);
    const admission=admitted.body;prior=admission.questionId as string;
    const claimed=await h.claim();const claim=claimed.body.claim as AskClaim;const barrier=await h.barrier();
    const wrapper={schemaVersion:'1.0',claimId:claim.claimId,consumerGeneration:h.scope.consumerGeneration,lastControlSyncId:barrier};
    const status={schemaVersion:'1.0',questionId:prior,questionHash:admission.questionHash,state:'answering',route:examples.AskRoute,updatedAt:time(h.now()),safeReason:null};
    assert.equal((await h.send(h.signed('POST',`${p}/hq/questions/${prior}/status`,{...wrapper,status}))).status,200);
    const answer={...examples.AskAnswer as object,answerId:randomUUID(),questionId:prior,conversationId:conversation.conversationId,questionHash:admission.questionHash,
      generatedAt:time(h.now()),knowledgeAsOf:null,text:'🦉'.repeat(8000),limitations:Array.from({length:20},(_,i)=>String(i)+'🦉'.repeat(498)),evidence:[],publicSources:[]};
    const response=await h.send(h.signed('POST',`${p}/hq/questions/${prior}/answer`,{...wrapper,answer}));assert.equal(response.status,200,response.raw);
  }
  const first=await h.browser(session,'GET',`${p}/conversations/${conversation.conversationId}`);assert.equal(first.status,200,first.raw);
  assert.ok(first.body.nextCursor);assert.ok(Buffer.byteLength(first.raw)<524288);
  const next=await h.browser(session,'GET',`${p}/conversations/${conversation.conversationId}?after=${first.body.nextCursor}`);assert.equal(next.status,200,next.raw);
  assert.equal((first.body.turns as unknown[]).length+(next.body.turns as unknown[]).length,8);assert.equal(next.body.nextCursor,null);
});

test('paginated follow-up reads revalidate the earlier trusted context even without a new citation',async t=>{
  const h=await askHarness(t),q=await h.ready({context:(examples.AskQuestionInput as {context:unknown}).context});
  assert.equal((await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery))).status,200);
  const admitted=await h.question(q.session,q.conversation,{priorQuestionId:q.admission.questionId});assert.equal(admitted.status,202);
  const questionId=admitted.body.questionId as string,claim=(await h.claim()).body.claim as AskClaim,barrier=await h.barrier();
  const wrapper={schemaVersion:'1.0',claimId:claim.claimId,consumerGeneration:h.scope.consumerGeneration,lastControlSyncId:barrier};
  const status={schemaVersion:'1.0',questionId,questionHash:admitted.body.questionHash,state:'answering',route:examples.AskRoute,updatedAt:time(h.now()),safeReason:null};
  assert.equal((await h.send(h.signed('POST',`${p}/hq/questions/${questionId}/status`,{...wrapper,status}))).status,200);
  const answer={...q.answer,answerId:randomUUID(),questionId,questionHash:admitted.body.questionHash};
  const path=`${p}/conversations/${q.conversation.conversationId}?limit=1`;
  let withdrawn=false,checked=0;h.contextHook(async refs=>{checked+=refs.length;return !withdrawn || refs.length===0;});
  assert.equal((await h.send(h.signed('POST',`${p}/hq/questions/${questionId}/answer`,{...wrapper,answer}))).body.disposition,'accepted');
  assert.ok(checked>0);const first=await h.browser(q.session,'GET',path);assert.ok(first.body.nextCursor);
  withdrawn=true;checked=0;const next=await h.browser(q.session,'GET',path+'&after='+first.body.nextCursor);
  assert.equal(next.status,200,next.raw);assert.ok(checked>0);
  const turn=(next.body.turns as {answer:unknown;status:{state:string}}[])[0]!;assert.equal(turn.answer,null);assert.equal(turn.status.state,'declined');
});

test('raw HTTP validation and dedicated signature authority reject ambiguous or replayed requests',async t=>{
  const h=await askHarness(t);
  for(const headers of [[['Host',h.cfg.authority]],[['Forwarded','for=127.0.0.1']],[['Connection','close'],['Connection','close']]] as [string,string][][]){
    assert.equal((await h.request('GET',p+'/availability',headers)).status,401);
  }
  const id=randomUUID(),msg=h.signed('POST',p+'/hq/claims',{schemaVersion:'1.0',serviceId:h.scope.serviceId,consumerGeneration:h.scope.consumerGeneration,claimRequestId:id,capacity:1},id);
  assert.equal((await h.send(msg)).status,200);assert.equal((await h.send(msg)).status,409);
  h.service.store.run('UPDATE service_keys SET revoked=1');
  assert.equal((await h.claim()).status,403);
});

test('same-second millisecond status and answer timestamps remain valid and receipt ordering stays exact',async t=>{
  const h=await askHarness(t),q=await h.ready(),generatedAt=time(h.now()+0.5);h.setClock(h.now()+0.8);
  const status={schemaVersion:'1.0',questionId:q.admission.questionId,questionHash:q.admission.questionHash,state:'answering',route:examples.AskRoute,updatedAt:generatedAt,safeReason:null};
  const wrapper={schemaVersion:'1.0',claimId:q.claim.claimId,consumerGeneration:h.scope.consumerGeneration,lastControlSyncId:q.barrier};
  const statusResponse=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/status`,{...wrapper,status}));assert.equal(statusResponse.status,200,statusResponse.raw);
  const answer=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,{...q.delivery,answer:{...q.answer,generatedAt}}));
  assert.equal(answer.status,200,answer.raw);assert.equal(answer.body.receivedAt,time(h.now()));assert.ok(Date.parse(answer.body.receivedAt as string)>Date.parse(generatedAt));
});
