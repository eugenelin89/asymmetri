import test from 'node:test';
import assert from 'node:assert/strict';
import type { EventBatch, PublisherScope, RunStatusEvent } from '../vendor/investment/v1/types.js';
import { checkPublicationBatch } from '../src/publication.js';
import { checkContent } from '../src/content.js';
import { canonicalHash, ContractError } from '../src/schema.js';
import { clone, examples, golden, harness, prefix } from './helpers.js';
import { closeBatch, closeNow, eventOf, sealCloseBatch } from './close-recovery-fixture.js';

function check(batch=closeBatch()) {
  const scope=clone(examples.PublisherScope) as PublisherScope;scope.expiresAt='2027-01-01T00:00:00Z';
  return checkPublicationBatch(Buffer.from(JSON.stringify(batch)),batch.batchId,{
    experimentId:batch.experimentId,runId:batch.runId,now:closeNow,
    scope,history:[],receipts:new Map(),
    content:new Map(golden.content.map(c=>[c.sha256,checkContent(Buffer.from(c.text),c.contentType,c.sha256)])),
  });
}
test('one-session close proof passes while the unamended OPEN golden remains valid',()=>{
  assert.equal(check().acceptedIds.length,18);
  assert.equal(check(clone(golden.batch)).acceptedIds.length,27);
});
const mutations:[string,(batch:EventBatch)=>void][]=[
  ['missing amendment',b=>{b.events=b.events.filter(e=>e.type!=='run.status') as EventBatch['events'];}],
  ['another session',b=>{eventOf(b,'decision.published').payload.proposal.targetSession='2026-10-15';}],
  ['unknown amendment',b=>{eventOf(b,'decision.published').payload.proposal.executionAmendmentId='unpublished';}],
  ['wrong configuration',b=>{eventOf(b,'run.status').payload.executionAmendment!.configurationHash='b'.repeat(64);}],
  ['missing decision support',b=>{eventOf(b,'decision.published').references=[];}],
  ['missing order support',b=>{eventOf(b,'paper.order').references=[];}],
  ['missing valuation support',b=>{eventOf(b,'portfolio.snapshot').references=[];}],
  ['proposal at cutoff',b=>{const p=eventOf(b,'decision.published').payload;p.proposal.committedAt=p.review.reviewedAt='2026-10-14T19:30:00.000Z';eventOf(b,'decision.published').recordedAt=p.review.reviewedAt;}],
  ['review at cutoff',b=>{const d=eventOf(b,'decision.published');d.payload.review.reviewedAt=d.recordedAt='2026-10-14T19:30:00.000Z';}],
  ['lock at cutoff',b=>{const o=eventOf(b,'paper.order');o.payload.lockedAt=o.recordedAt='2026-10-14T19:30:00.000Z';}],
  ['lock before review',b=>{eventOf(b,'paper.order').payload.lockedAt='2026-10-14T13:00:00Z';}],
  ['lock differs from first record',b=>{eventOf(b,'paper.order').payload.lockedAt='2026-10-14T13:11:00Z';}],
  ['partial lock fields',b=>{delete eventOf(b,'paper.order').payload.lockedAt;}],
  ['changed order lock revision',b=>{const e=b.events.find(e=>e.type==='paper.order'&&e.payload.revision===2)!;if(e.type==='paper.order')e.payload.lockedAt='2026-10-14T13:13:00Z';}],
  ['OPEN substitution',b=>{const e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.fill)!;if(e.type==='paper.ledger_transaction')e.payload.fill!.observation.field='regular_open';}],
  ['early close retrieval',b=>{const e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.fill)!;if(e.type==='paper.ledger_transaction')e.payload.fill!.observation.retrievedAt='2026-10-14T20:04:59Z';}],
  ['stale close reference',b=>{const e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.fill)!;if(e.type==='paper.ledger_transaction')e.payload.effectiveAt=e.payload.fill!.observation.marketAt='2026-10-14T19:59:59Z';}],
  ['early accounting',b=>{const e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.fill)!;if(e.type==='paper.ledger_transaction')e.payload.recordedAt='2026-10-14T20:19:59Z';}],
  ['fill at expiry',b=>{const e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.fill)!;if(e.type==='paper.ledger_transaction')e.payload.recordedAt=e.recordedAt='2026-10-14T23:30:00.000Z';}],
  ['stripped benchmark recovery',b=>{delete eventOf(b,'portfolio.snapshot').payload.benchmark.recovery;}],
  ['allocation differs from reported benchmark',b=>{eventOf(b,'portfolio.snapshot').payload.benchmark.recovery!.allocation!.units='9';}],
  ['cash phase with allocated units',b=>{eventOf(b,'portfolio.snapshot').payload.benchmark.recovery!.allocation=null;}],
  ['allocation after snapshot recording',b=>{eventOf(b,'portfolio.snapshot').payload.benchmark.recovery!.allocation!.recordedAt='2026-10-14T20:26:00Z';}],
  ['allocation at expiry',b=>{eventOf(b,'portfolio.snapshot').payload.benchmark.recovery!.allocation!.recordedAt='2026-10-14T23:30:00.000Z';}],
  ['duplicate amendment',b=>{const a=clone(eventOf(b,'run.status'));a.eventId='other-amendment';a.sourceSequence='99';b.events.push(a);}],
];
for(const [name,change] of mutations)test('close recovery rejects '+name,()=>{
  const batch=closeBatch();change(batch);sealCloseBatch(batch);
  assert.throws(()=>check(batch),e=>e instanceof ContractError,name);
});
test('durable amendment survives pagination/status changes/restart and withdrawal hides dependent evidence',async t=>{
  const h=await harness(t,closeNow);await h.stage();
  const batch=closeBatch(),notice=eventOf(batch,'run.status');
  const old=batch.events.slice(0,10).map(canonicalHash);
  const later:RunStatusEvent[]=Array.from({length:105},(_,i)=>({...clone(notice),eventId:'before-amendment-'+i,sourceSequence:'1',occurredAt:'2026-10-14T12:20:00Z',recordedAt:'2026-10-14T12:20:00Z',payload:{state:'paused',reason:'SYNTHETIC retained status',effectiveAt:'2026-10-14T12:20:00Z',nextReviewAt:null}}));
  batch.events.splice(10,0,...later);batch.events.forEach((e,i)=>e.sourceSequence=String(i+1));
  for(let i=0;i<batch.events.length;i+=50){const part={...batch,batchId:'close-part-'+i,events:batch.events.slice(i,i+50)};const r=await h.batch(part as EventBatch);assert.equal(r.status,201,r.raw);}
  const after:RunStatusEvent={...clone(notice),eventId:'after-amendment',sourceSequence:String(batch.events.length+1),occurredAt:'2026-10-14T22:00:00Z',recordedAt:'2026-10-14T22:00:00Z',payload:{state:'paused',reason:'Later status without amendment',effectiveAt:'2026-10-14T22:00:00Z',nextReviewAt:null}};
  assert.equal((await h.batch({...batch,batchId:'later-status',events:[after]})).status,201);
  assert.deepEqual(h.receiver.db.history(batch.experimentId,batch.runId).slice(0,10).map(x=>x.event_hash),old);
  const first=await h.get(prefix+'/events?limit=100');assert.equal(JSON.stringify(first.body).includes('fixture-close-amendment'),false);
  const status=await h.get(prefix+'/status');assert.equal(status.status,200);assert.equal(status.body.state,'paused');assert.deepEqual(status.body.executionAmendment,notice);
  await h.restart();assert.deepEqual((await h.get(prefix+'/status')).body.executionAmendment,notice);
  h.receiver.db.hide(batch.experimentId,batch.runId,notice.eventId,'withheld',closeNow);
  assert.equal((await h.get(prefix+'/status')).status,503);
  for(const [kind,id] of [['decision','fixture-decision'],['order','fixture-order'],['transaction','fixture-tx-2'],['valuation','fixture-valuation']]){
    const result=await h.get(`${prefix}/records/${kind}/${id}/versions/1`);assert.equal(result.status,200,result.raw);assert.equal(result.body.event,null);assert.equal(result.body.visibility,'withheld');
  }
});
