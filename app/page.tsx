import Image from "next/image";
import { WorkerExample } from "@/components/worker-example";
import { LegacyHomeFragments } from "@/components/legacy-home-fragments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { botsquad, labs, motion, site, work } from "@/content/site";

export default function HomePage() {
  return (
    <div className="site labs-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <LegacyHomeFragments />
        <section className="labs-hero">
          <div className="shell labs-hero__grid">
            <div className="labs-hero__copy">
              <p className="eyebrow">{labs.hero.eyebrow}</p>
              <h1>{labs.hero.headline}</h1>
              <p className="hero__support">{labs.hero.support}</p>
              <a className="text-link" href={labs.hero.primary.href}>
                {labs.hero.primary.label} <span aria-hidden="true">↓</span>
              </a>
            </div>
            <aside className="product-index" aria-label="Product availability">
              <p className="eyebrow">{labs.availability}</p>
              <a href={botsquad.path}><strong>{botsquad.name} <span aria-hidden="true">↗</span></strong><span>{botsquad.status}</span></a>
              <a href={motion.path}><strong>{motion.name} <span aria-hidden="true">↗</span></strong><span>{motion.releaseStatus}</span></a>
            </aside>
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
                <h3>{botsquad.name}</h3>
                <p>{botsquad.descriptor}</p>
                <p className="showcase-status">{botsquad.status} · MIT licensed</p>
                <div className="button-row">
                  <a className="text-link" href={botsquad.path}>More about BotSquad <span aria-hidden="true">↗</span></a>
                  <a className="text-link" href={botsquad.source.href}>{botsquad.source.label}</a>
                </div>
              </div>
              <WorkerExample />
            </article>
            <article className="product-showcase product-showcase--motion">
              <div className="product-showcase__copy">
                <a className="product-domain" href="/sport">Asymmetri Sport</a>
                <div className="motion-identity">
                  <Image src={motion.icon.src} alt={motion.icon.alt} width={64} height={64} />
                  <h3>{motion.name}</h3>
                </div>
                <p>{motion.hero.support}</p>
                <p className="showcase-status">{motion.platform} · {motion.releaseStatus}</p>
                <div className="button-row">
                  <a className="text-link" href={motion.path}>More about Motion <span aria-hidden="true">↗</span></a>
                  <a className="text-link" href="/tutorial">Read the guide</a>
                </div>
              </div>
              <figure className="motion-showcase-visual">
                <Image src={labs.motionPreview.src} alt={labs.motionPreview.alt} width={labs.motionPreview.width} height={labs.motionPreview.height} sizes="(max-width: 700px) 70vw, 230px" />
                <figcaption>An actual Motion capture. The lines show the projected 2D geometry used for this result.</figcaption>
              </figure>
            </article>
          </div>
        </section>
        <section className="section home-origin">
          <div className="shell product-split">
            <figure>
              <Image src={site.images.pitchingDelivery.src} alt={site.images.pitchingDelivery.alt} width={site.images.pitchingDelivery.width} height={site.images.pitchingDelivery.height} sizes="(max-width: 900px) 100vw, 50vw" />
              <figcaption>{labs.origin.caption}</figcaption>
            </figure>
            <div className="product-heading product-prose">
              <p className="eyebrow">{labs.origin.eyebrow}</p>
              <h2>{labs.origin.headline}</h2>
              <p>{labs.origin.body}</p>
              <p className="founder-attribution">{labs.origin.attribution}</p>
              <a className="text-link" href={labs.origin.link.href}>{labs.origin.link.label} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
        <section className="section closing" id="contact">
          <div className="shell closing__grid">
            <div><p className="eyebrow">{labs.contact.eyebrow}</p><h2>{labs.contact.headline}</h2></div>
            <div className="closing__action">
              <p>{labs.contact.body}</p>
              <a className="text-link" href={`mailto:${site.company.contactEmail}`}>{site.company.contactEmail} <span aria-hidden="true">↗</span></a>
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
