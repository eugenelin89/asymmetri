import type { EventPage, PortfolioSnapshot, PublicStatus, Worker } from '@/receiver/vendor/investment/v1/types';
import type { ArchiveResponse } from '@/lib/investment-archive';
import { investmentBrief, briefDate, briefTime } from '@/lib/investment-brief';
import { actorName, inRun, money } from '@/lib/investment-links';

function Time({ value }: { value: string }) {
  return <time dateTime={value}>{briefTime(value)}</time>;
}

export function SessionBrief({ events, snapshot, status, workers, run, synthetic, checkedAt }: {
  checkedAt: number;
  events: ArchiveResponse<EventPage>;
  snapshot: PortfolioSnapshot | null;
  status: PublicStatus | null;
  workers: Worker[];
  run?: string;
  synthetic: boolean;
}) {
  const brief = investmentBrief(events.data?.items ?? [], snapshot);
  const { decision, decisionRecord, valuation, operatingStatus } = brief;
  const operationalUpdate = operatingStatus && <div className="inv-brief-heading">
    <p className="inv-kicker">Latest operational update</p>
    <p className="inv-brief-lead">{operatingStatus.payload.reason}</p>
    <p className="inv-meta">Updated <Time value={operatingStatus.payload.effectiveAt}/>.</p>
  </div>;
  if (!events.data || !decision || !decisionRecord) return <section id="latest-update" className="inv-brief" aria-labelledby="brief-title">
    <p className="inv-kicker">Latest update{synthetic ? ' · Synthetic demonstration' : ''}</p>
    {operationalUpdate}
    <h2 id="brief-title">{events.data ? 'No decision in the latest published records.' : 'Latest update unavailable.'}</h2>
    <p>{events.data ? 'A completed decision has not been verified in this event window. The experiment status below does not establish that a session ran or a trade occurred.' : 'The public records could not be verified. Refresh the page to try again.'}</p>
    <a href="#desk">Browse the published record →</a>
  </section>;

  const { proposal, review } = decision.payload;
  const reviewer = workers.find(worker => worker.workerId === review.reviewerId)?.name ?? 'The independent reviewer';
  const approved = review.disposition === 'approve';
  const headline = approved ? { HOLD: 'HOLD — keep the portfolio unchanged.', BUY: 'BUY proposal approved.', SELL: 'SELL proposal approved.' }[proposal.action] : `${proposal.action} proposal ${review.disposition === 'reject' ? 'rejected' : 'needs revision'}.`;
  const nextReviewElapsed = brief.nextReviewAt && Date.parse(brief.nextReviewAt) <= checkedAt;

  return <section id="latest-update" className="inv-brief" aria-labelledby="brief-title">
    {operationalUpdate}
    <div className="inv-brief-heading">
      <p className="inv-kicker">Latest published decision{synthetic ? ' · Synthetic demonstration' : ''}</p>
      <p className="inv-meta">{briefDate(proposal.committedAt)} · Vancouver time</p>
      <h2 id="brief-title">{headline}</h2>
      <p className="inv-brief-lead">{brief.thesis}</p>
      <p>{actorName(decision.actor, workers)} proposed {proposal.action}. {reviewer} {approved ? 'approved it' : review.disposition === 'reject' ? 'rejected it' : 'requested changes'}.</p>
    </div>
    {status?.watermark.sourceGaps && <p className="inv-warning">Some public records are missing. This summary may be incomplete.</p>}
    <div className="inv-brief-grid">
      <div>
        <h3>Why this decision</h3>
        <p>{review.rationale}</p>
        <p className="inv-meta">{reviewer}’s review at <Time value={review.reviewedAt}/>.</p>
      </div>
      <div>
        <h3>Portfolio last reported</h3>
        {valuation ? <>
          <p className="inv-brief-balance">{money(valuation.cash)} <span>cash · {valuation.holdings.length} {valuation.holdings.length === 1 ? 'holding' : 'holdings'}</span></p>
          <p className="inv-meta">As of <Time value={valuation.valuationAsOf}/>. Valuation: {valuation.quality}.</p>
          {valuation.benchmark.missingReason && <p className="inv-warning">Benchmark comparison unavailable: {valuation.benchmark.missingReason}.</p>}
        </> : <p>No verified portfolio valuation is available.</p>}
        <p className="inv-meta">{approved && proposal.action === 'HOLD' ? 'This decision proposes no buy or sell order.' : 'An approved proposal is not a completed trade. See the transaction journal for recorded execution.'}</p>
      </div>
      <div>
        <h3>What still needs attention</h3>
        <ul>{(review.dissent.length ? review.dissent : proposal.risks).map((risk, index) => <li key={index}>{risk}</li>)}</ul>
      </div>
      <div>
        <h3>What happens next</h3>
        <p>{brief.nextReviewAt ? <>{nextReviewElapsed ? 'Last scheduled review: ' : 'Next scheduled review: '}<strong><Time value={brief.nextReviewAt}/></strong>.{nextReviewElapsed ? ' A newer completed review is not established by these records.' : ' This is a published schedule, not a guarantee of completion.'}</> : 'No next review time is included in the latest published records.'}</p>
        <p>{proposal.invalidationCondition}</p>
      </div>
    </div>
    <details className="inv-brief-timeline">
      <summary>Session timeline and evidence</summary>
      <ol>
        {brief.researchFrom && <li><strong>Research cited</strong><span>{brief.sourceCount} cited {brief.sourceCount === 1 ? 'source' : 'sources'}, retrieved <Time value={brief.researchFrom}/>{brief.researchTo !== brief.researchFrom && brief.researchTo && <> to <Time value={brief.researchTo}/></>}. Source citations do not count completed research requests.</span></li>}
        <li><strong>Proposal committed</strong><span><Time value={proposal.committedAt}/> · {actorName(decision.actor, workers)}</span></li>
        <li><strong>Independent review</strong><span><Time value={review.reviewedAt}/> · {reviewer}: {review.disposition}</span></li>
        <li><strong>Published here</strong><span><Time value={decisionRecord.receivedAt}/></span></li>
      </ol>
    </details>
    <div className="inv-actions"><a href={inRun('/botsquad/trade/decisions/' + proposal.decisionId, run)}>Read the full decision and review →</a><a href="#desk">Read the team discussion →</a><a href="#journal">Check the transaction journal →</a></div>
  </section>;
}
