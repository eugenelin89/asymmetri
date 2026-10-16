import type { PublicStatus } from '@/receiver/vendor/investment/v1/types';
import { investmentShowcase } from '@/content/site';

const copy = investmentShowcase.status;
const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
});

function PublishedTime({ value, fallback }: { value: string | null; fallback: string }) {
  return value
    ? <time dateTime={value}>{dateFormat.format(new Date(value))}</time>
    : <>{fallback}</>;
}

/** A display-only summary of the verified archive response, separate from worker activity. */
export function ExperimentStatus({ status, nextReviewAt }: {
  status: PublicStatus | null;
  nextReviewAt: string | null;
}) {
  const state = status?.state.replaceAll('_', ' ');
  return <section className="inv-status" aria-labelledby="experiment-status-title">
    <h2 id="experiment-status-title">{copy.title}</h2>
    <dl>
      <div><dt>{copy.runState}</dt><dd>{state ? state[0].toUpperCase() + state.slice(1) : copy.unavailableValue}</dd></div>
      <div><dt>{copy.dataFreshness}</dt><dd data-freshness={status?.freshness.status ?? 'unavailable'}>{status ? copy.freshnessLabels[status.freshness.status] : copy.unavailableValue}</dd></div>
      <div><dt>{copy.lastPublication}</dt><dd><PublishedTime value={status?.freshness.lastPublicationAt ?? null} fallback={status ? copy.notPublished : copy.unavailableValue}/></dd></div>
      <div><dt>{copy.nextReview}</dt><dd><PublishedTime value={nextReviewAt} fallback={status ? copy.notPublished : copy.unavailableValue}/></dd></div>
    </dl>
    <p>{copy.activityScope}</p>
  </section>;
}
