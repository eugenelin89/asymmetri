import type { PortfolioSnapshot, ReceivedEvent } from '../receiver/vendor/investment/v1/types';

/** Published facts only. No inferred job success, trading permission or market schedule. */
export function investmentBrief(records: ReceivedEvent[], snapshot: PortfolioSnapshot | null) {
  const ordered = [...records].sort((a, b) => BigInt(a.event.sourceSequence) < BigInt(b.event.sourceSequence) ? -1 : BigInt(a.event.sourceSequence) > BigInt(b.event.sourceSequence) ? 1 : 0);
  const decisionRecord = ordered.findLast(record => record.event.type === 'decision.published');
  const decision = decisionRecord?.event.type === 'decision.published' ? decisionRecord.event : null;
  const statusEvent = ordered.findLast(record => record.event.type === 'run.status')?.event;
  const valuations = ordered.flatMap(record => record.event.type === 'portfolio.snapshot' ? [record.event.payload] : []);
  if (snapshot) valuations.push(snapshot);
  valuations.sort((a, b) => BigInt(a.valuationSequence) < BigInt(b.valuationSequence) ? -1 : BigInt(a.valuationSequence) > BigInt(b.valuationSequence) ? 1 : a.revision - b.revision);
  const valuation = valuations.at(-1) ?? null;
  const sourceTimes = decision?.payload.proposal.sources.map(source => source.retrievedAt).filter((value): value is string => value !== null).sort((a, b) => Date.parse(a) - Date.parse(b)) ?? [];
  return {
    decision, decisionRecord, valuation,
    operatingStatus: statusEvent?.type === 'run.status' ? statusEvent : null,
    thesis: decision?.payload.proposal.rationale.split('\n')[0] ?? null,
    sourceCount: decision?.payload.proposal.sources.length ?? 0,
    researchFrom: sourceTimes[0] ?? null,
    researchTo: sourceTimes.at(-1) ?? null,
    nextReviewAt: statusEvent?.type === 'run.status' ? statusEvent.payload.nextReviewAt : null,
  };
}

export function briefTime(value: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(value));
}
export function briefDate(value: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value));
}
