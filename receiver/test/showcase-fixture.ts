/** INV-04 deterministic author-created demonstration. Never imported by operational startup. */
import { readFileSync } from 'node:fs';
import { canonicalHash, divideEven, fixed, sha256, validate } from '../src/schema.js';
import type { Event, EventBatch, ContentType, PortfolioSnapshot, RecordRef } from '../vendor/investment/v1/types.js';
const original = JSON.parse(readFileSync(new URL('../../vendor/investment/v1/golden.json', import.meta.url), 'utf8')) as {batch:EventBatch;content:{text:string;sha256:string;contentType:ContentType}[]};
const decimal = (value: bigint) => `${value < 0n ? '-' : ''}${(value < 0n ? -value : value) / 1000000n}.${((value < 0n ? -value : value) % 1000000n).toString().padStart(6,'0')}`;
const ref = <K extends RecordRef['kind']>(kind:K, id:string, version=1, relation:RecordRef['relation']='supports'):RecordRef & {kind:K} => ({kind,id,version,relation});
export function showcaseFixture() {
  const {batch,content} = structuredClone(original);
  const events: Event[] = batch.events;
  const run = events.find(e=>e.type==='run.published')!;
  if(run.type!=='run.published') throw Error('fixture');
  run.payload.title='A small position. A visible disagreement.';
  run.payload.purpose='A synthetic demonstration of research, challenge, decisions and subsequent review.';
  run.payload.objective='Make the evidence inspectable, including mistakes and uncertainty.';
  const team=events.find(e=>e.type==='team.published')!;
  if(team.type!=='team.published') throw Error('fixture');
  team.payload.workers[0]!.name='Example Researcher';
  team.payload.workers[0]!.role='Research & proposal';
  team.payload.workers[0]!.responsibilities=['Compare evidence and publish a testable proposal.'];
  team.payload.workers[1]!.name='Example Independent Risk & Evidence Reviewer';
  team.payload.workers[1]!.role='Independent challenge';
  team.payload.workers[1]!.responsibilities=['Challenge assumptions and keep unresolved objections visible.'];
  team.payload.workers.push({workerId:'fixture-coordinator',name:'Example Coordinator',role:'Synthesis & review',responsibilities:['Connect conclusions to decisions and review outcomes.'],status:'unavailable'});
  const topic=events.find(e=>e.type==='discussion.opened')!;
  if(topic.type==='discussion.opened'){topic.payload.topic='How much evidence is enough to take a small position?';topic.payload.charter='Synthetic discussion: weigh a two-share experiment against staying in cash. Preserve the objection, then inspect the result.';}
  content[0]!.text='Synthetic demonstration — not live trading or real worker activity\n\nResearch note / version 1\n\nThe fictional instrument SYNTH is used to exercise a small, bounded position. Two shares at a synthetic opening mark of USD 100 leave USD 800 in cash. The position is an accounting example, not a stock recommendation.\n\nChallenge: a small position limits exposure but does not make weak evidence stronger. The example lacks an independent market source and any observed demand.\n\nSynthesis: proceed only inside this isolated demonstration. Retain the objection and compare the portfolio with an equally funded synthetic benchmark. No claim about investment skill follows.';
  content[1]!.text='Synthetic demonstration — not live trading or real worker activity\n\nResearch note / corrected version 2\n\nCorrection: the first note conflated a testable accounting example with a research thesis. No observed company evidence exists. The two-share purchase remains a synthetic test case. The original decision keeps its exact version-1 reference.\n\nThe later review must separate a working ledger from a sound investment. Negative and incomplete observations remain in the record.';
  for(const c of content)c.sha256=sha256(c.text);
  for(const e of events){
    if(e.type==='artifact.registered')e.payload.title='Position note: small exposure does not resolve uncertain evidence';
    if(e.type==='artifact.published'){
      e.payload.title='Position note: small exposure does not resolve uncertain evidence';
      const c=content[e.payload.version-1]!;e.payload.sha256=c.sha256;e.payload.sizeBytes=Buffer.byteLength(c.text);
      for(const s of e.payload.sources){s.url='https://example.com';s.title='Fictional source placeholder — no market evidence';}
    }
    if(e.type==='discussion.contribution') e.payload.body=e.payload.ordinal==='1'?'Synthetic contribution: I propose two shares, leaving most capital in cash. This tests whether a modest position and an explicit review point make our decision easier to inspect. The research note contains the assumptions.':'Synthetic challenge: position size is not evidence quality. We have no independent observation of this fictional company. Keep that objection attached to the decision, compare against cash, and do not interpret a favorable mark as proof of our thesis.';
    if(e.type==='discussion.closed'){e.payload.outcome='Synthetic synthesis: the purchase exercises the ledger. It does not resolve the research objection.';e.payload.dissent=['The reviewer does not endorse the investment thesis.'];e.payload.unresolved=['No real source or market-data rights have been verified.'];}
    if(e.type==='decision.published'){
      const p=e.payload.proposal;
      p.rationale=p.action==='BUY'?'Synthetic example: take a two-share position to test a bounded evidence-to-action chain. Keep the research objection visible.':p.action==='HOLD'?'Synthetic example: retain cash and wait. The available evidence does not justify additional exposure.':'Synthetic example: attempt a sale that exceeds held quantity to demonstrate a rejection without a financial effect.';
      p.alternatives=p.action==='HOLD'?['Add exposure now','Reduce the existing position']:['Keep all capital in cash','Wait for independently verified evidence'];
      e.payload.review.dissent=['No actual investment conclusion is supported by synthetic evidence.'];
      for(const s of p.sources)s.url='https://example.com';
      e.payload.proposalHash=canonicalHash(p);e.payload.review.proposalHash=e.payload.proposalHash;
    }
    if(e.type==='paper.order'){
      const decision=events.find(d=>d.type==='decision.published'&&d.payload.proposal.decisionId===e.payload.decisionId)!;
      if(decision.type==='decision.published')e.payload.proposalHash=decision.payload.proposalHash;
    }
  }
  let sequence=28;
  function add(type:Event['type'],payload:Event['payload'],actor:Event['actor']={kind:'system'},references:RecordRef[]=[],at='2026-01-20T22:00:00Z'){
    const e={...events[0]!,eventId:`showcase-event-${sequence}`,sourceSequence:String(sequence++),type,payload,actor,references,occurredAt:at,recordedAt:at} as Event;
    validate('Event',e);events.push(e);return e;
  }
  for(const status of ['registered','awaiting_publication','failed','withheld','withdrawn'] as const)
    add('artifact.registered',{artifactId:`showcase-${status}`,title:`Synthetic ${status} deliverable`,author:{kind:'system'},status,reason:'Synthetic lifecycle example; no public content.',relationships:[]});
  add('worker.activity',{activityId:'showcase-review-completed',workerId:'fixture-reviewer',activity:'review',work:ref('review','fixture-outcome-review'),startedAt:'2026-01-05T21:01:00Z',finishedAt:'2026-01-05T21:03:00Z',summary:'Synthetic review completed. No ongoing execution.'});
  const base=structuredClone(events.find(e=>e.type==='portfolio.snapshot')!.payload) as PortfolioSnapshot;
  let peak=1020n*1000000n,previous=peak,maxDrawdown=0n;
  const sessions=['2026-01-06','2026-01-07','2026-01-08','2026-01-09','2026-01-12','2026-01-13','2026-01-14','2026-01-15','2026-01-16','2026-01-20'];
  const prices=[104,95,88,97,101,null,99,105,98,96];
  for(let i=0;i<sessions.length;i++){
    const s=structuredClone(base),session=sessions[i]!,at=session+'T21:00:00Z',price=prices[i] ?? null;
    s.valuationId=`showcase-valuation-${i+2}`;s.valuationSequence=String(i+2);s.markSetId=`showcase-marks-${i+2}`;s.session=session;s.valuationAsOf=at;s.previousComparableEquity=decimal(previous);
    const h=s.holdings[0]!;h.symbol='SYNNEW';
    for(const mark of [h.mark!,s.benchmark.mark!])Object.assign(mark,{observationId:`${mark.instrumentId}-close-${i+2}`,session,marketAt:at,availableAt:at,retrievedAt:at});
    const benchmarkPrice=100+i; s.benchmark.session=session;s.benchmark.mark!.value=String(benchmarkPrice);s.benchmark.equity=String(benchmarkPrice*10);s.benchmark.totalReturn=decimal(BigInt(benchmarkPrice-100)*10000n);
    if(price===null){s.quality='partial';h.mark=null;h.marketValue=null;h.unrealizedPnl=null;h.missingReason='Synthetic missing closing observation.';s.equity=null;s.unrealizedPnl=null;s.totalReturn=null;s.dailyReturn=null;s.drawdown=null;s.excessReturn=null;s.limitations=['Synthetic missing observation: no interpolation or substitute price.'];}
    else {
      const equity=BigInt(800+2*price)*1000000n;peak=equity>peak?equity:peak;const drawdown=divideEven(equity*1000000n,peak)-1000000n;maxDrawdown=drawdown<maxDrawdown?drawdown:maxDrawdown;
      h.mark!.value=String(price);h.marketValue=String(2*price);h.unrealizedPnl=String(2*price-200);s.equity=decimal(equity);s.unrealizedPnl=h.unrealizedPnl;s.totalReturn=decimal(divideEven(equity*1000000n,1000000000n)-1000000n);s.dailyReturn=decimal(divideEven(equity*1000000n,previous)-1000000n);s.peakEquity=decimal(peak);s.drawdown=decimal(drawdown);s.maxDrawdown=decimal(maxDrawdown);s.excessReturn=decimal(fixed(s.totalReturn)-fixed(s.benchmark.totalReturn!));previous=equity;
    }
    add('portfolio.snapshot',s,undefined,[],at);
  }
  // A corrected valuation preserves the original observation and exact revision path.
  const corrected=structuredClone(events.find(e=>e.type==='portfolio.snapshot'&&e.payload.valuationId==='showcase-valuation-11')!);
  if(corrected.type==='portfolio.snapshot'){
    corrected.payload.revision=2;corrected.payload.supersedes=ref('valuation',corrected.payload.valuationId,1,'supersedes');
    corrected.payload.limitations=['Synthetic provenance clarification; arithmetic is unchanged.'];
    add('portfolio.snapshot',corrected.payload,undefined,[corrected.payload.supersedes]);
  }
  // Unfilled terminal orders exercise distinct states without any ledger effect.
  for(const terminal of ['cancelled','expired'] as const){
    const d=structuredClone(events.find(e=>e.type==='decision.published'&&e.payload.proposal.action==='BUY')!);
    const o=structuredClone(events.find(e=>e.type==='paper.order'&&e.payload.status==='proposed')!);
    if(d.type!=='decision.published'||o.type!=='paper.order')throw Error('fixture');
    d.payload.proposal.decisionId='showcase-'+terminal+'-decision';d.payload.proposal.rationale='Synthetic unfilled order lifecycle example: '+terminal+'. No financial effect.';
    d.payload.review.reviewId='showcase-'+terminal+'-review';d.payload.proposalHash=canonicalHash(d.payload.proposal);d.payload.review.proposalHash=d.payload.proposalHash;
    add('decision.published',d.payload,d.actor);
    o.payload.orderId='showcase-'+terminal+'-order';o.payload.decisionId=d.payload.proposal.decisionId;o.payload.proposalHash=d.payload.proposalHash;
    let prior=add('paper.order',structuredClone(o.payload));
    if(terminal==='expired'){o.payload.revision++;o.payload.previousEventId=prior.eventId;o.payload.status='validated';prior=add('paper.order',structuredClone(o.payload));}
    o.payload.revision++;o.payload.previousEventId=prior.eventId;o.payload.status=terminal;o.payload.reason='Synthetic '+terminal+' example, no fill.';o.payload.reservedCash='0';o.payload.reservedQuantity='0';add('paper.order',o.payload);
  }
  add('review.published',{reviewId:'showcase-later-review',originalDecisions:[ref('decision','fixture-decision')],observations:[ref('valuation','showcase-valuation-11')],interpretation:'Synthetic later review: equity is USD 992, below the USD 1,000 starting capital. Small exposure limited the size of the loss, but did not validate the original thesis. Preserve the missing observation and the reviewer’s objection.',limitations:['Hand-authored test values, not a historical backtest or actual employee learning.'],nextDisposition:'pause',asOf:'2026-01-20T22:00:00Z'},{kind:'worker',workerId:'fixture-reviewer'});
  add('run.status',{state:'ended',reason:'Synthetic demonstration ended. Retained as a read-only archive.',effectiveAt:'2026-01-20T22:00:00Z',nextReviewAt:null});
  return {batch:{...batch,batchId:'showcase-fixture',events:events as EventBatch['events']},content};
}
