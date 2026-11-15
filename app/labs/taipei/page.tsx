import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { taipei } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(taipei.metadata, taipei.path);
export default function TaipeiPage() {
 return <div className="site labs-page"><SiteHeader /><main id="main-content" tabIndex={-1}>
 <section className="labs-hero"><div className="shell"><p className="eyebrow eyebrow--light"><a href="/labs">Asymmetri Labs</a> / Civic experiment</p><h1>{taipei.name}</h1><p className="hero__support">{taipei.description}</p><p>Desktop browser · English · No account · About 8–12 minutes</p><a className="button button--primary" href={taipei.play}>Play Taipei →</a></div></section>
 <section className="section"><div className="shell product-split"><h2>Power with limits.</h2><div><p className="product-lead">The clinic is filling up. Shuttles are stalled. A shelter video is going viral, and the president is calling.</p><p>You are the fictional Mayor of Taipei. Protect residents and keep essential services running with two municipal teams. You can request national assistance; you do not command the military.</p><p>Inspect three districts in a stylized 3D city. Weigh the evidence and known team commitments, make one choice per turn, then see its consequences. Follow Mei, Hsin and Yu-ting through six decisions and a city-level debrief. Restart to try another strategy.</p><p>There is no reflex timer. Core decisions work with a keyboard.</p></div></div></section>
 <section className="section"><div className="shell product-split"><h2>Fiction, with human stakes.</h2><div><p>{taipei.notice}</p><p>The experiment explores judgment under uncertainty and civic tradeoffs. Its numerical effects are authored for play, not estimates of real harm or predictions about public institutions. The game’s source repository is private.</p><h3>Basic, private measurement</h3><p>{taipei.analytics}</p><a className="button" href={taipei.play}>Start a response →</a></div></div></section>
 </main><SiteFooter /></div>;
}
