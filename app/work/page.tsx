import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.work, "/work");

export default function WorkPage() {
  return <div className="site"><PageIntro eyebrow="Work" title="Technology for better development." summary="We build tools for athletes and coaches doing more with less. Baseball is the first proving ground." />
    <main id="main-content">
      <section className="section section--soft"><div className="shell"><div className="section-heading"><p className="eyebrow">Built · athlete development</p><h2>Keep feedback and development history connected.</h2><p className="lede">We have built software in a real community baseball environment that combines structured feedback, different perspectives, and an athlete’s history. It gives coaches more context and gives development conversations somewhere to continue.</p><p className="disclosure">The interface below is a privacy-safe reconstruction with synthetic information—not a production screenshot.</p></div><DevelopmentVisual /></div></section>
      <section className="section"><div className="shell work-editorial"><article><p className="eyebrow">Coaching intelligence</p><h2>Organize what matters.</h2><p className="lede">Technology can help coaches preserve observations, identify priorities, and prepare better conversations. It should amplify coaching judgment, not replace it.</p></article><figure className="signal-image"><Image src={site.images.signal.src} alt={site.images.signal.alt} fill sizes="(max-width: 760px) 100vw, 48vw" /></figure></div></section>
      <section className="section section--ink"><div className="shell research-layout"><div><p className="eyebrow eyebrow--light">Research · experimental</p><h2>Make measurement practical.</h2><p className="lede lede--light">We are exploring biomechanics, affordable sensors, video, movement signals, and machine learning for useful athlete feedback outside specialized facilities. This work is experimental—not a deployed product or a promise of current capability.</p></div><figure><Image src={site.images.sensor.src} alt={site.images.sensor.alt} fill sizes="(max-width: 760px) 100vw, 38vw" /></figure></div></section>
      <section className="section closing"><div className="shell closing__inner"><p className="eyebrow">Starting with baseball</p><h2>Built from baseball. Designed for sport.</h2><p className="lede">Baseball is where the first tools are being built and tested. The broader direction is technology that can help athletes and coaches across sports make better use of the resources they have.</p></div></section>
    </main><SiteFooter /></div>;
}

function DevelopmentVisual() {
  return <figure className="development-visual"><figcaption>Multiple perspectives, one clearer picture</figcaption><div className="development-visual__body"><div><span className="ui-label">Synthetic athlete</span><strong>Avery R.</strong><small>Development history · 3 seasons</small></div><div className="development-visual__timeline"><span>Self reflection</span><i /><span>Coach feedback</span><i /><span>Development focus</span></div></div></figure>;
}
