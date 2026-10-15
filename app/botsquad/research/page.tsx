import { BotSquadNavigation } from '@/components/botsquad-navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { botsquadResearch as copy, tradeGuide } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata(copy.metadata, copy.href, '/images/labs-social.png');

export default function ResearchPage() {
  return (
    <div className="site botsquad-page research-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <div className="shell"><BotSquadNavigation current="research" /></div>
        <section className="botsquad-hero">
          <div className="shell">
            <p className="eyebrow eyebrow--light">{copy.label}</p>
            <h1>{copy.headline}</h1>
            <p className="hero__support">{copy.introduction}</p>
            <p className="botsquad-hero__status">{copy.relationship}</p>
          </div>
        </section>
        <section className="section squad-raised" aria-labelledby="research-projects">
          <div className="shell product-split">
            <div className="product-heading"><h2 id="research-projects">{copy.projectsHeading}</h2></div>
            <article className="labs-product__card">
              <h3><a href={copy.project.href}>{copy.project.label}</a></h3>
              <p className="product-lead">{copy.project.description}</p>
              <div className="button-row"><a className="button button--primary" href={copy.project.href}>{copy.project.action} →</a><a className="text-link" href={tradeGuide.href}>{tradeGuide.action} →</a></div>
            </article>
          </div>
        </section>
        <div className="shell labs-closing"><p>{copy.closing}</p></div>
      </main>
      <SiteFooter />
    </div>
  );
}
