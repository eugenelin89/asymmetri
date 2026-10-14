import type { Benchmark } from '@/receiver/vendor/investment/v1/types';
import { displayTime, money } from '@/lib/investment-links';

export function BenchmarkRecoveryEvidence({ benchmark }: { benchmark: Benchmark }) {
  const recovery = benchmark.recovery;
  if (!recovery) return null;
  const allocation = recovery.allocation;
  return <details className="inv-details"><summary>Benchmark close allocation evidence</summary>
    <p>Amendment: <code>{recovery.amendmentId}</code>. {allocation ? 'The initial cash-to-benchmark allocation is retained here; subsequent valuations apply the original benchmark rules.' : 'No close allocation is recorded in this valuation. The benchmark remains in cash.'}</p>
    {allocation && <>
      <p>{allocation.units} units · cash remaining {money(allocation.cash)} · raw closing reference {money(allocation.observation.value)}.</p>
      <p>Market reference {displayTime(allocation.observation.marketAt)} · available {displayTime(allocation.observation.availableAt)} · retrieved {displayTime(allocation.observation.retrievedAt)} · allocation recorded {displayTime(allocation.recordedAt)}.</p>
      <p>{allocation.observation.provider} / {allocation.observation.feed} · {allocation.observation.session} · {allocation.observation.field.replaceAll('_', ' ')}.</p>
    </>}
  </details>;
}
