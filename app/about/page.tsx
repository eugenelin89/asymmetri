import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.about, "/about");

export default function AboutPage() {
  return <div className="site"><PageIntro eyebrow="About" title="Built for the people doing more with less." summary="Asymmetrico is a sports technology company working to make better development tools more accessible." />
    <main id="main-content">
      <section className="section" id="why-asymmetrico"><div className="shell about-lead"><div><p className="eyebrow">Why we exist</p><h2>Access should not decide who gets to improve intelligently.</h2></div><div><p className="lede">Ability and ambition appear everywhere. Sophisticated feedback, measurement, and development systems do not. We believe thoughtful technology can narrow that gap without diminishing the human relationships at the centre of sport.</p><p className="lede">Constraints can lead to better design: clearer priorities, more useful information, and systems that earn their complexity.</p></div></div></section>
      <section className="section section--soft"><div className="shell origin"><figure><Image src={site.images.workbench.src} alt={site.images.workbench.alt} fill sizes="(max-width: 760px) 100vw, 42vw" /></figure><div><p className="eyebrow">Technical origin</p><h2>Designed for the real world.</h2><p className="lede">Asymmetrico grew from building systems that had to work outside controlled environments. That same discipline now shapes our approach to sports technology: practical tools, imperfect information, real constraints, and measurable human value.</p><p className="lede">Software, sensors, biomechanics, machine learning, and real-world experimentation are methods. Better athlete and coach development is the point.</p></div></div></section>
      <section className="section section--ink"><div className="shell split"><p className="eyebrow eyebrow--light">Where we begin</p><div><h2>Baseball first. Sport ahead.</h2><p className="lede lede--light">Baseball inspired Asymmetrico and offers a rich place to learn: repeated movement, detailed observation, deep coaching knowledge, and a long relationship with data. It is our first proving ground, not our boundary.</p><Link className="button button--clay" href="/work">See our work</Link></div></div></section>
    </main><SiteFooter /></div>;
}
