import { investmentShowcase } from '@/content/site';
import { askEntryHref } from '@/lib/ask-client';
import type { ContextRef } from '@/receiver/vendor/investment/v1/types';
export function AskPreview({context,label='Ask BotSquad'}:{context?:ContextRef;label?:string}) {
  return <aside className="inv-ask"><span className="inv-kicker">Questions are not open yet</span><h3>{label}</h3><p>{investmentShowcase.ask}</p>{context&&<p className="inv-meta">Selected reference: {context.record.kind} · {context.record.id} · version {context.record.version}<br/>Run: {context.runId}</p>}<a href={askEntryHref(context)}>{context?'View Ask with this record reference':'About Ask and your privacy'} →</a></aside>;
}
