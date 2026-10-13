import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {askDto,askId,askEntryHref,askContext,askEvidenceHref,askSourceHref,validConversation,activeQuestion,
  askRequest,askConversation,decodeAskTab,freshAskTab,confirmsPending,controlSatisfied,canReplayPending} from '../lib/ask-client.ts';
const examples=JSON.parse(readFileSync(new URL('../receiver/vendor/investment/v1/responses.json',import.meta.url),'utf8')).examples;
const copy=v=>structuredClone(v),json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':status>=400?'application/problem+json':'application/json'}});

test('context actions preserve only exact public record identities and reject ambiguous input',()=>{
 const ref=examples.AskQuestionInput.context,href=askEntryHref(ref),query=Object.fromEntries(new URL(href,'https://asymmetri.co').searchParams);
 assert.deepEqual(askContext(query),ref);assert.equal(askContext({...query,version:['1','2']}),null);
 assert.equal(askContext({...query,question:'private text'}),null);assert.equal(askContext({...query,version:'0'}),null);
 assert.equal(askContext({...query,record:'a/../private'}),null);assert.equal(askId(undefined),false);
 assert.equal(askEvidenceHref(ref,'other-experiment'),null);assert.match(askEvidenceHref(ref,ref.experimentId),/\/records\/transaction\/fixture-tx-2\/versions\/1\?run=fixture-run$/);
 for(const url of ['javascript:alert(1)','data:text/html,a','https://user:secret@example.test/','//example.test'])assert.equal(askSourceHref(url),null);
 assert.equal(askSourceHref('https://example.test/evidence'),'https://example.test/evidence');
});

test('conversation rendering requires owned identities, route binding and no fabricated completed answer',()=>{
 const page=copy(examples.AskConversationPage),id=page.conversation.conversationId;
 assert.equal(validConversation(page,id),true);assert.equal(validConversation(page,'another-conversation'),false);
 const hash=copy(page);hash.turns[0].answer.questionHash='f'.repeat(64);assert.equal(validConversation(hash,id),false);
 const route=copy(page);route.turns[0].status.route.workerId='invented-worker';assert.equal(validConversation(route,id),false);
 const unknown=copy(page);unknown.turns[0].status.state='outcome_unknown';assert.equal(validConversation(unknown,id),false);
 assert.equal(activeQuestion('outcome_unknown'),true);assert.equal(activeQuestion('answered'),false);
 const extra=copy(page);extra.turns[0].answer.privateExecutionId='private';assert.equal(askDto('AskConversationPage',extra),false);
});

test('same-submission retries retain exact body/key and use only the same-origin private API',async()=>{
 const seen=[],value=copy(examples.AskQuestionInput),session=copy(examples.AskSession),id='same-request';
 const wire=async(url,options)=>{seen.push({url,...options});return json(examples.AskAdmission,202);};
 for(let i=0;i<2;i++)await askRequest('AskAdmission','/conversations/fixture-conversation-a/questions',{method:'POST',id,value,session},wire);
 assert.equal(seen[0].body,seen[1].body);assert.equal(seen[0].headers['Idempotency-Key'],id);
 assert.equal(seen[0].headers['X-CSRF-Token'],session.csrfToken);assert.equal(seen[0].headers.Cookie,undefined);
 assert.equal(seen[0].credentials,'same-origin');assert.equal(seen[0].cache,'no-store');assert.equal(seen[0].redirect,'error');assert.equal(seen[0].referrerPolicy,'no-referrer');
 for(const path of ['https://evil.test','/hq/claims','/conversations/a?after=a&after=b','//availability'])await assert.rejects(()=>askRequest('AskAvailability',path,{},wire));
 assert.equal(seen.length,2);
});

test('unverified, oversized or inconsistent responses never expose provider/server error details',async()=>{
 await assert.rejects(()=>askRequest('AskAvailability','/availability',{},async()=>json({state:'available'})),{code:'UNVERIFIED'});
 await assert.rejects(()=>askRequest('AskAvailability','/availability',{},async()=>new Response('x'.repeat(524289),{headers:{'Content-Type':'application/json'}})),{code:'UNVERIFIED'});
 const problem={...examples.Problem,detail:'PRIVATE diagnostic',status:503,code:'UNAVAILABLE',retryable:true,retryAfterSeconds:60};
 await assert.rejects(()=>askRequest('AskAvailability','/availability',{},async()=>json(problem,503)),error=>error.code==='UNAVAILABLE'&&error.retryAfterSeconds===60&&!error.message.includes('PRIVATE'));
 await assert.rejects(()=>askRequest('AskAvailability','/availability',{},async()=>json(problem,500)),{code:'UNVERIFIED'});
});

test('pagination refuses repeated cursors, duplicate turns and a changed conversation owner',async()=>{
 const page=copy(examples.AskConversationPage),session=examples.AskSession,id=page.conversation.conversationId;
 assert.equal((await askConversation(id,session,undefined,async()=>json(page))).turns.length,1);
 let count=0;
 await assert.rejects(()=>askConversation(id,session,undefined,async()=>{count++;return json({...page,nextCursor:'repeat'});}),{code:'UNVERIFIED'});
 assert.equal(count,2);
 await assert.rejects(()=>askConversation(id,session,undefined,async()=>json({...page,conversation:{...page.conversation,conversationId:'someone-else'}})),{code:'UNVERIFIED'});
});

test('tab restoration keeps only bounded owned metadata and a retryable pending input, never an answer cache',()=>{
 const state=freshAskTab();state.session={...examples.AskSession,expiresAt:'2027-01-01T00:00:00Z'};
 state.conversationId='fixture-conversation-a';state.pending={id:'pending-once',admission:null,input:copy(examples.AskQuestionInput)};
 assert.deepEqual(decodeAskTab(JSON.stringify(state),0),state);assert.equal('answers' in state,false);
 assert.equal(decodeAskTab(JSON.stringify({...state,answers:[examples.AskAnswer]}),0),null);
 assert.equal(decodeAskTab(JSON.stringify({...state,session:{...state.session,serviceId:'real-service'}}),0),null);
 assert.equal(decodeAskTab(JSON.stringify(state),Date.parse('2027-01-02')),null);
 assert.equal(decodeAskTab(JSON.stringify({...state,pending:{id:null,input:state.pending.input}}),0),null);
 state.control={kind:'delete',id:'delete-once',questionId:null};assert.equal(decodeAskTab(JSON.stringify(state),0).control.id,'delete-once');
});


test('an identical historical question cannot acknowledge an unconfirmed new submission',()=>{
 const page=copy(examples.AskConversationPage),pending={id:'new-request',input:copy(page.turns[0].input),admission:null};
 assert.equal(confirmsPending(pending,page),false);
 pending.admission={questionId:'new-question',questionHash:page.turns[0].status.questionHash};assert.equal(confirmsPending(pending,page),false);
 pending.admission.questionId=page.turns[0].questionId;assert.equal(confirmsPending(pending,page),true);
 const mismatched=copy(page);mismatched.turns[0].status.questionHash='f'.repeat(64);assert.equal(confirmsPending(pending,mismatched),false);
 mismatched.turns[0].status.questionHash=pending.admission.questionHash;mismatched.turns[0].input.text='different input';assert.equal(confirmsPending(pending,mismatched),false);
 const state=freshAskTab();state.session=examples.AskSession;state.conversationId=page.conversation.conversationId;state.pending=pending;
 assert.equal(canReplayPending(state),true);state.control={kind:'delete',id:'delete',questionId:null};assert.equal(canReplayPending(state),false);
});

test('valid histories may include declined turns in addition to eight answered turns',async()=>{
 const base=copy(examples.AskConversationPage),turns=Array.from({length:9},(_,i)=>{const turn=copy(base.turns[0]);turn.questionId='question-'+i;turn.status.questionId=turn.questionId;turn.answer.questionId=turn.questionId;if(i===0){turn.answer=null;turn.status.state='declined';}return turn;});
 let calls=0;const result=await askConversation(base.conversation.conversationId,examples.AskSession,undefined,async()=>{calls++;return json({...base,turns:turns.slice(calls===1?0:8,calls===1?8:9),nextCursor:calls===1?'next':null});});
 assert.equal(result.turns.length,9);
 const wrong=copy(base);wrong.turns[0].answer.serviceId='wrong-service';await assert.rejects(()=>askConversation(base.conversation.conversationId,examples.AskSession,undefined,async()=>json(wrong)),{code:'UNVERIFIED'});
});

test('expiry or a conversation-wide deletion can satisfy an owned cancellation without claiming a new deletion',()=>{
 const receipt=copy(examples.AskControlReceipt),id=receipt.conversationId,command={kind:'cancel',id:'cancel-once',questionId:'question-a'};
 assert.equal(controlSatisfied(command,id,{...receipt,questionId:'question-a',action:'expire'}),true);
 assert.equal(controlSatisfied(command,id,{...receipt,questionId:null,action:'delete'}),true);
 assert.equal(controlSatisfied(command,id,{...receipt,questionId:'other-question',action:'expire'}),false);
 assert.equal(controlSatisfied({...command,kind:'delete',questionId:null},id,{...receipt,questionId:null,action:'expire'}),false);
});
