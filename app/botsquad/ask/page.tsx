import '../investment/investment.css';
import './ask.css';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {askExperience as copy} from '@/content/site';
import {askContext,askEvidenceHref} from '@/lib/ask-client';
import {AskChat} from '@/components/ask/ask-chat';
export const dynamic='force-dynamic';
export const metadata={title:'Ask BotSquad · Questions not open',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams,context=askContext(params),invalid=Object.keys(params).length>0&&!context;
  const experimentId=process.env.ASYMMETRI_INVESTMENT_EXPERIMENT??null;
  // Real-use provider/retention disclosure and HQ execution remain separate acceptance work.
  const synthetic=process.env.NODE_ENV==='development'&&process.env.ASYMMETRI_ASK_UI_MODE==='synthetic_fixture';
  const href=context?askEvidenceHref(context,experimentId):null;
  return <div className="site inv-site"><SiteHeader/><main id="main-content" tabIndex={-1} className="shell inv-main ask-page">
    <nav className="inv-breadcrumb" aria-label="Ask navigation"><a href="/botsquad">BotSquad</a><span>/</span><a href="/botsquad/investment">Investment showcase</a><span>/</span><span>Ask</span></nav>
    <header className="ask-hero"><p className="inv-kicker">BotSquad / Questions & evidence</p><h1>{copy.title}</h1><p>{copy.introduction}</p></header>
    {invalid?<section className="ask-unavailable"><h2>That record reference could not be read.</h2><p>No session or question has been created.</p><a href="/botsquad/ask">Open Ask without a record →</a></section>:
      synthetic?<AskChat key={JSON.stringify(context)} context={context} experimentId={experimentId}/>:<div className="ask-layout"><section className="ask-unavailable" aria-labelledby="ask-unavailable-title"><span className="inv-kicker">Not accepting questions</span><h2 id="ask-unavailable-title">{copy.unavailableTitle}</h2><p>{copy.unavailable}</p><p>{copy.next}</p>
        {context&&<div className="ask-context"><span>{copy.context}</span><strong>{context.record.kind} · {context.record.id} · version {context.record.version}</strong><small>Experiment {context.experimentId} / Run {context.runId}</small><p>{copy.contextNotice}</p>{href&&<a href={href}>Inspect the exact public record →</a>}<a href="/botsquad/ask">View general Ask →</a></div>}
        <a href="/botsquad/investment">Explore published investment evidence →</a></section>
        <aside className="ask-privacy" aria-labelledby="ask-privacy-title"><h2 id="ask-privacy-title">{copy.privacyTitle}</h2>{copy.privacy.map(text=><p key={text}>{text}</p>)}</aside></div>}
    <section className="ask-boundary"><h2>Keep the evidence in view.</h2><p>{copy.separation}</p><p>{copy.historical}</p></section>
  </main><SiteFooter/></div>;
}
