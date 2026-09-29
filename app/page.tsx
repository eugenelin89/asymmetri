import Image from "next/image";
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
            <h2>{about.principles[0].title}</h2>
            <p>{about.principles[0].body}</p>
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
                <div className="motion-identity">
                  <Image src={motion.icon.src} alt={motion.icon.alt} width={64} height={64} />
                  <p className="product-showcase__name">{motion.name}</p>
                </div>
                <h3>{motion.headline}</h3>
                <p>{motion.hero.support}</p>
                <p className="showcase-status">{motion.platform} · {motion.releaseStatus}</p>
                <div className="button-row">
                  <a className="button button--ink" href={motion.path}>More about Motion</a>
                  <a className="text-link" href="/motion#introduction-video">Watch the introduction</a>
                </div>
              </div>
              <figure className="motion-showcase-visual">
                <Image src={labs.motionPreview.src} alt={labs.motionPreview.alt} width={labs.motionPreview.width} height={labs.motionPreview.height} sizes="(max-width: 700px) 70vw, 230px" />
                <figcaption>An actual Motion capture. The lines show the projected 2D geometry used for this result.</figcaption>
              </figure>
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
