import type { RunStatusEvent } from '@/receiver/vendor/investment/v1/types';
import { investmentRecovery as copy } from '@/content/site';
import { displayTime, recordHref } from '@/lib/investment-links';

/** An immutable published amendment, independent of the latest run status/page. */
export function ExecutionAmendmentNotice({ event }: { event: RunStatusEvent }) {
  const amendment = event.payload.executionAmendment;
  if (!amendment) return null;
  const clocks = [
    ['Decision, review and order locked before', amendment.decisionCutoff],
    ['Closing price reference', amendment.marketAt],
    ['Evidence collection no earlier than', amendment.collectionNotBefore],
    ['Accounting no earlier than', amendment.processNotBefore],
    ['Order expires', amendment.expiresAt],
  ];
  return <section className="inv-method inv-amendment" aria-label={copy.title}>
    <p className="inv-kicker">{amendment.session} · {amendment.methodologyVersion}</p>
    <h3>{copy.title}</h3>
    <p>{copy.introduction}</p>
    <p>{event.payload.reason}</p>
    <dl className="inv-metrics">{clocks.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><time dateTime={value}>{displayTime(value)}</time></dd></div>)}</dl>
    <p>{copy.benchmark}</p>
    <p>{copy.usage}</p>
    <p>{copy.limits}</p>
    <a href={recordHref({ kind: 'event', id: event.eventId, version: 1, relation: 'supports' }, event.runId)}>{copy.record} →</a>
  </section>;
}
