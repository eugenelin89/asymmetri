import { investmentShowcase } from '@/content/site';
import type { ContextRef } from '@/receiver/vendor/investment/v1/types';
export function AskPreview({context,label='Ask BotSquad'}:{context?:ContextRef;label?:string}) {
  return <aside className="inv-ask"><span className="inv-kicker">Future capability · unavailable</span><h3>{label}</h3><p>{investmentShowcase.ask}</p>{context&&<p className="inv-meta">Context: {context.record.kind} · {context.record.id} · version {context.record.version}<br/>Run: {context.runId}</p>}<button type="button" disabled data-context={context?JSON.stringify(context):undefined}>Employee answers are not enabled</button><a href="/botsquad/ask">About the planned Ask experience ↗</a></aside>;
}
