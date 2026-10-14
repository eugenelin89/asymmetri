import type { Mode, RunPublished } from '@/receiver/vendor/investment/v1/types';
import { displayTime, money } from '@/lib/investment-links';
import { investmentShowcase as copy } from '@/content/site';

/** Render only the signed public run description and frozen settings. */
export function RunConfiguration({ run, mode }: { run: RunPublished; mode: Mode }) {
  const c = run.configuration;
  const settings = [
    ['Evidence', mode === 'observed_paper' ? copy.observed : 'Synthetic fixture · authored test values'],
    ['Run kind', run.runKind.replaceAll('_', ' ')],
    ['Methodology', c.methodologyVersion],
    ['Configuration', `${c.configurationVersion} · ${c.configurationStatus.replaceAll('_', ' ')}`],
    ['Initial paper capital', money(c.initialCapital)],
    ['Benchmark', `${c.benchmarkInstrument.symbol} · ${c.benchmarkConvention.replaceAll('_', ' ')}`],
    ['Commission per fill', money(c.commission)],
    ['Modeled slippage', `${c.slippageBps} basis points · included in fill price`],
    ['Decision cutoff', `${c.cutoffMinutes} minutes before target regular open`],
    ['Opening evidence window', `${c.maxOpeningWaitSeconds} seconds after regular open`],
    ['Position / sector limits', `${c.positionLimitBps / 100}% / ${c.sectorLimitBps / 100}%`],
    ['Drawdown stop threshold', `${c.drawdownStopBps / 100}% · not a guaranteed loss cap`],
    ['Run starts', displayTime(run.startsAt)],
    ['Run ends', displayTime(run.endsAt)],
  ];
  return <div className="inv-method">
    <h3>Published experiment summary</h3>
    <p>{run.purpose}</p><p>{run.objective}</p>
    <p className="inv-meta">The description and settings are supplied by the trusted publisher. Publication does not independently verify employee reasoning or trading claims.</p>
    <details className="inv-details"><summary>Original frozen methodology & run settings</summary>
      <dl className="inv-metrics">{settings.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>Universe: {c.universe.map(instrument => instrument.symbol).join(', ')}.</p>
      <p>Opening reference: {c.openingFieldDefinition}</p>
      <p>{c.attribution} · {c.dataDelaySeconds}s configured delay.</p>
      {c.methodologyVersion === 'inv-real-open-v1' && <p>Decisions precede the target session. Its completed daily bar is retrieved after close; the OPEN is a modeled paper-execution reference. Market reference, evidence retrieval and accounting times are separate.</p>}
      <h4>Published limitations</h4><ul>{c.limitations.map((limitation, i) => <li key={i}>{limitation}</li>)}</ul>
      <p className="inv-meta">Configuration hash: <code>{run.configurationHash}</code></p>
    </details>
  </div>;
}
