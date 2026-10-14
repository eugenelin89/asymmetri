/** Disposable authored evidence. Never used by production or public routes. */
import assert from 'node:assert/strict';
import type { Event, EventBatch, RunStatusEvent } from '../vendor/investment/v1/types.js';
import { canonicalHash } from '../src/schema.js';
import { golden, clone } from './helpers.js';

export const closeNow='2026-10-14T23:40:00Z';
export function eventOf<T extends Event['type']>(batch:EventBatch,type:T):Extract<Event,{type:T}> {
  const found=batch.events.find(e=>e.type===type);assert.ok(found);return found as Extract<Event,{type:T}>;
}
export function sealCloseBatch(batch:EventBatch):void {
  const run=eventOf(batch,'run.published');run.payload.configurationHash=canonicalHash(run.payload.configuration);
  const decision=eventOf(batch,'decision.published');decision.payload.proposalHash=canonicalHash(decision.payload.proposal);decision.payload.review.proposalHash=decision.payload.proposalHash;
  let previous:string|null=null;
  for(const event of batch.events){
    if(event.type==='paper.order'){event.payload.proposalHash=decision.payload.proposalHash;event.payload.configurationHash=run.payload.configurationHash;}
    if(event.type==='paper.ledger_transaction'){
      event.payload.configurationHash=run.payload.configurationHash;event.payload.previousHash=previous;
      const {journalHash:old,...unsigned}=event.payload;assert.ok(old);event.payload.journalHash=canonicalHash(unsigned);previous=event.payload.journalHash;
    }
    if(event.type==='portfolio.snapshot'){event.payload.configurationHash=run.payload.configurationHash;event.payload.journalHash=previous!;}
  }
}
export function closeBatch():EventBatch {
  const batch=JSON.parse(JSON.stringify(golden.batch).replaceAll('2026-01-05','2026-10-14')) as EventBatch;
  batch.batchId='synthetic-close-recovery';batch.events=batch.events.slice(0,17) as EventBatch['events'];
  const run=eventOf(batch,'run.published');run.payload.endsAt='2026-10-16T23:30:00Z';
  const notice:RunStatusEvent={...clone(run),type:'run.status',eventId:'fixture-close-amendment',sourceSequence:'11',occurredAt:'2026-10-14T12:30:00Z',recordedAt:'2026-10-14T12:30:00Z',actor:{kind:'system'},references:[],payload:{state:'private_trial',reason:'SYNTHETIC prospective close recovery. The morning open and historical usage gap remain retained.',effectiveAt:'2026-10-14T12:30:00Z',nextReviewAt:null,executionAmendment:{amendmentId:'fixture-close-recovery',methodologyVersion:'inv-real-close-recovery-v1',configurationHash:run.payload.configurationHash,approvalRecordId:'fixture-owner-approval',session:'2026-10-14',decisionCutoff:'2026-10-14T19:30:00.000Z',marketAt:'2026-10-14T20:00:00.000Z',collectionNotBefore:'2026-10-14T20:05:00.000Z',processNotBefore:'2026-10-14T20:20:00.000Z',expiresAt:'2026-10-14T23:30:00.000Z',benchmarkConvention:'cash_then_same_session_close',usageAccounting:'historical_gap_retained'}}};
  batch.events.splice(10,0,notice);
  const amendment=notice.payload.executionAmendment!;
  const supports={kind:'event',id:notice.eventId,version:1,relation:'supports'} as const;
  for(const [index,event] of batch.events.entries()){
    event.sourceSequence=String(index+1);
    if(event.type==='decision.published'){event.payload.proposal.executionAmendmentId=amendment.amendmentId;event.references.push(supports);}
    if(event.type==='paper.order'){
      Object.assign(event.payload,{executionAmendmentId:amendment.amendmentId,lockedAt:'2026-10-14T13:12:00Z',deadline:amendment.decisionCutoff,expiresAt:amendment.expiresAt});event.references.push(supports);
      if(event.payload.status==='filled')event.occurredAt=event.recordedAt='2026-10-14T20:21:00Z';
    }
    if(event.type==='paper.ledger_transaction'&&event.payload.fill){
      event.occurredAt=event.recordedAt=event.payload.recordedAt='2026-10-14T20:20:00.000Z';event.payload.effectiveAt=amendment.marketAt;
      Object.assign(event.payload.fill.observation,{field:'regular_close',marketAt:amendment.marketAt,availableAt:amendment.marketAt,retrievedAt:amendment.collectionNotBefore});
    }
    if(event.type==='portfolio.snapshot'){
      event.occurredAt=event.recordedAt='2026-10-14T20:25:00Z';event.payload.valuationAsOf=amendment.marketAt;event.references.push(supports);
      const s=event.payload;Object.assign(s,{equity:'1000',unrealizedPnl:'0',totalReturn:'0',peakEquity:'1000',excessReturn:'0'});
      for(const h of s.holdings){Object.assign(h,{marketValue:'200',unrealizedPnl:'0'});Object.assign(h.mark!,{value:'100',marketAt:amendment.marketAt,availableAt:amendment.marketAt,retrievedAt:amendment.collectionNotBefore});}
      const b=s.benchmark;Object.assign(b,{equity:'1000',totalReturn:'0'});Object.assign(b.mark!,{value:'100',marketAt:amendment.marketAt,availableAt:amendment.marketAt,retrievedAt:amendment.collectionNotBefore});
      b.recovery={amendmentId:amendment.amendmentId,allocation:{observation:clone(b.mark!),units:'10',cash:'0',recordedAt:amendment.processNotBefore}};
    }
  }
  sealCloseBatch(batch);amendment.configurationHash=run.payload.configurationHash;return batch;
}
