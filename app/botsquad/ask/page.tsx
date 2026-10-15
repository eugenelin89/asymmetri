import '../trade/investment.css';
import './ask.css';
import {BotSquadNavigation} from '@/components/botsquad-navigation';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {askExperience as copy,approvedAskPrivacyNotices,syntheticAskPrivacyNotices} from '@/content/site';
import {askContext} from '@/lib/ask-client';
import {AskChat} from '@/components/ask/ask-chat';
export const dynamic='force-dynamic';
export const metadata={title:'Ask BotSquad · Questions not open',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams,context=askContext(params),invalid=Object.keys(params).length>0&&!context;
  const experimentId=process.env.ASYMMETRI_INVESTMENT_EXPERIMENT??null;
  // Real-use provider/retention disclosure and HQ execution remain separate acceptance work.
  const synthetic=process.env.NODE_ENV==='development'&&process.env.ASYMMETRI_ASK_UI_MODE==='synthetic_fixture';
  return <div className="site inv-site"><SiteHeader/><main id="main-content" tabIndex={-1} className="shell inv-main ask-page">
    <BotSquadNavigation current="ask" />
    <header className="ask-hero"><p className="inv-kicker">BotSquad / Questions & evidence</p><h1>{copy.title}</h1><p>{copy.introduction}</p></header>
    {invalid?<section className="ask-unavailable"><h2>That record reference could not be read.</h2><p>No session or question has been created.</p><a href="/botsquad/ask">Open Ask without a record →</a></section>:
      <AskChat key={JSON.stringify(context)} context={context} experimentId={experimentId} notices={synthetic?syntheticAskPrivacyNotices:approvedAskPrivacyNotices} synthetic={synthetic}/>}
    <section className="ask-boundary"><h2>Keep the evidence in view.</h2><p>{copy.separation}</p><p>{copy.historical}</p></section>
  </main><SiteFooter/></div>;
}
