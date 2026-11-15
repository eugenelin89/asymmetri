import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { taipei } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(taipei.metadata, taipei.path);
export default function TaipeiPage() {
 return <div className="site labs-page"><SiteHeader /><main id="main-content" tabIndex={-1}>
 <section className="labs-hero"><div className="shell"><p className="eyebrow eyebrow--light"><a href="/labs">Asymmetri Labs</a> / Civic experiment</p><h1>{taipei.name}</h1><p className="hero__support">{taipei.description}</p><p>{taipei.format}</p><a className="button button--primary" href={taipei.play}>{taipei.playLabel}</a></div></section>
 <section className="section"><div className="shell product-split"><h2>Power with limits.</h2><div><p className="product-lead">{taipei.premise}</p>{taipei.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div></section>
 <section className="section"><div className="shell product-split"><h2>Fiction, with human stakes.</h2><div><p>{taipei.notice}</p><p>{taipei.boundaries}</p><h3>Basic, private measurement</h3><p>{taipei.analytics}</p><a className="button" href={taipei.play}>{taipei.playLabel}</a></div></div></section>
 </main><SiteFooter /></div>;
}
