import { WorkerFlow } from "@/components/worker-flow";
import { LegacyHomeFragments } from "@/components/legacy-home-fragments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { about, labs, botsquad, motion, site, work } from "@/content/site";

export default function HomePage() {
  return (
    <div className="site labs-page">
      <SiteHeader />
      <LegacyHomeFragments />
      <main id="main-content" tabIndex={-1}>
        <section className="labs-hero">
          <div className="shell labs-hero__grid">
            <div className="labs-hero__copy">
              <p className="eyebrow">{labs.hero.eyebrow}</p>
              <h1>{labs.hero.headline}</h1>
              <p className="hero__support">{labs.hero.support}</p>
              <div className="button-row">
                <a className="button button--accent" href={labs.hero.primary.href}>
                  {labs.hero.primary.label}
                </a>
                <a className="text-link" href={labs.hero.secondary.href}>
                  {labs.hero.secondary.label} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <nav className="labs-hierarchy" aria-label="Company and product hierarchy">
              <p>{site.company.name}</p>
              <ul>
                {site.navigation.map((item) => "children" in item && (
                  <li key={item.href}>
                    <a href={item.href}>{item.label} <span aria-hidden="true">↗</span></a>
                    <ul>
                      {item.children?.filter((child) => child.href !== item.href).map((child) => (
                        <li key={child.href}>
                          <a href={child.href}>{child.label} <span aria-hidden="true">↗</span></a>
                          <p>{child.href === botsquad.path ? botsquad.status : motion.releaseStatus}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
        <section className="labs-philosophy">
          <div className="shell product-split">
            <h2>{labs.philosophy.headline}</h2>
            <p>{labs.philosophy.body}</p>
          </div>
        </section>
        <section className="section portfolio" id="products" tabIndex={-1} aria-labelledby="products-title">
          <div className="shell">
            <div className="portfolio__heading">
              <p className="eyebrow">{labs.products.eyebrow}</p>
              <h2 id="products-title">{labs.products.headline}</h2>
            </div>
            <article className="product-showcase product-showcase--botsquad">
              <div className="product-showcase__copy">
                <a className="product-domain" href={work.path}>{work.name}</a>
                <p className="product-showcase__name">{botsquad.name}</p>
                <h3>{botsquad.headline}</h3>
                <p>{botsquad.descriptor}</p>
                <p className="showcase-status">{botsquad.status} · MIT licensed</p>
                <div className="button-row">
                  <a className="button button--ink" href={botsquad.path}>More about BotSquad</a>
                  <a className="text-link" href="/botsquad#introduction-video">Watch the introduction</a>
                </div>
              </div>
              <WorkerFlow />
            </article>
            <article className="product-showcase product-showcase--motion">
              <div className="product-showcase__copy">
                <a className="product-domain" href="/sport">Asymmetri Sport</a>
                <p className="product-showcase__name">{motion.name}</p>
                <h3>{labs.sport.headline}</h3>
                <p>{labs.sport.body}</p>
                <p className="showcase-status">{motion.platform} · {motion.releaseStatus}</p>
                <div className="button-row">
                  <a className="button button--ink" href={motion.path}>More about Motion</a>
                  <a className="text-link" href="/motion#introduction-video">Watch the introduction</a>
                </div>
              </div>
              <aside className="sport-overview">
                <p className="sport-overview__heading">{labs.sport.overview.headline}</p>
                <p>{labs.sport.overview.body}</p>
                <a className="text-link" href={labs.sport.overview.link.href}>
                  {labs.sport.overview.link.label} <span aria-hidden="true">↗</span>
                </a>
              </aside>
            </article>
          </div>
        </section>
        <section className="section labs-common">
          <div className="shell product-split">
            <div className="product-heading">
              <h2>{about.principles[1].title}</h2>
            </div>
            <div className="product-prose">
              <p>{about.principles[1].body}</p>
              <p>{about.principles[2].body}</p>
              <a className="text-link" href={labs.hero.secondary.href}>
                {labs.hero.secondary.label} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <section className="section closing" id="contact">
          <div className="shell closing__grid">
            <div><p className="eyebrow">{labs.contact.eyebrow}</p><h2>{labs.contact.headline}</h2></div>
            <div className="closing__action">
              <p>{labs.contact.body}</p>
              <a className="button button--ink" href={`mailto:${site.company.contactEmail}`}>{site.company.contactEmail} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
        <noscript>
          <nav className="shell legacy-links" aria-label="Moved Sport sections">
            <span id="story"><a href="/sport#story">Sport story</a></span>
            <span id="approach"><a href="/sport#approach">Sport approach</a></span>
            <span id="product"><a href="/sport#product">Sport product</a></span>
          </nav>
        </noscript>
      </main>
      <SiteFooter />
    </div>
  );
}
