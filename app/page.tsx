import Image from "next/image";
import { CapabilityDiagram } from "@/components/capability-diagram";
import { WorkerDiagram } from "@/components/worker-diagram";
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
              <p className="eyebrow eyebrow--light">{labs.hero.eyebrow}</p>
              <h1>{labs.hero.headline}</h1>
              <p className="hero__support">{labs.hero.support}</p>
              <div className="button-row">
                <a
                  className="button button--accent"
                  href={labs.hero.primary.href}
                >
                  {labs.hero.primary.label}
                </a>
                <a
                  className="text-link text-link--light"
                  href={labs.hero.secondary.href}
                >
                  {labs.hero.secondary.label} ↗
                </a>
              </div>
            </div>
            <CapabilityDiagram />
          </div>
          <div className="shell labs-hero__foot">
            <span>Independent thinking. Practical technology.</span>
            <a href="#products">
              Explore the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section className="labs-philosophy">
          <div className="shell product-split">
            <h2>{labs.philosophy.headline}</h2>
            <p>{labs.philosophy.body}</p>
          </div>
        </section>
        <section
          className="section portfolio"
          id="products"
          tabIndex={-1}
          aria-labelledby="products-title"
        >
          <div className="shell">
            <div className="portfolio__heading">
              <p className="eyebrow">{labs.products.eyebrow}</p>
              <h2 id="products-title">{labs.products.headline}</h2>
            </div>
            <article className="product-showcase product-showcase--botsquad">
              <div className="product-showcase__copy">
                <p className="product-showcase__index">01 / AI coordination</p>
                <p className="product-showcase__name">{botsquad.name}</p>
                <h3>{botsquad.headline}</h3>
                <p>{botsquad.descriptor}</p>
                <p className="showcase-status">
                  {botsquad.status} · MIT licensed
                </p>
                <div className="button-row">
                  <a className="button button--ink" href={botsquad.path}>
                    Explore BotSquad
                  </a>
                  <a className="text-link" href="/botsquad#introduction-video">
                    Watch the introduction
                  </a>
                </div>
                <a className="sport-story-link" href={work.path}>
                  {work.name}: our approach <span aria-hidden="true">↗</span>
                </a>
              </div>
              <WorkerDiagram />
            </article>
            <article className="product-showcase product-showcase--motion">
              <div className="product-showcase__copy">
                <div className="motion-identity">
                  <Image
                    src={motion.icon.src}
                    alt={motion.icon.alt}
                    width={64}
                    height={64}
                  />
                  <p className="product-showcase__index">
                    02 / Pitching evidence
                  </p>
                </div>
                <p className="product-showcase__name">{motion.name}</p>
                <h3>{motion.headline}</h3>
                <p>
                  {motion.descriptor} Record, mark and inspect a pitch. Return
                  to the evidence as your history grows.
                </p>
                <p className="showcase-status">{motion.releaseStatus}</p>
                <div className="button-row">
                  <a className="button button--ink" href={motion.path}>
                    Explore Asymmetri Motion
                  </a>
                  <a className="text-link" href="/motion#introduction-video">
                    Watch the introduction
                  </a>
                </div>
                <a className="sport-story-link" href="/sport#story">
                  Asymmetri Sport: where it began{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <figure className="motion-showcase-visual">
                <div
                  className="motion-showcase-visual__frames"
                  aria-hidden="true"
                >
                  <span>Video</span>
                  <span>Marked frame</span>
                  <span>Evidence</span>
                </div>
                <Image
                  src={labs.motionPreview.src}
                  alt={labs.motionPreview.alt}
                  width={labs.motionPreview.width}
                  height={labs.motionPreview.height}
                  sizes="(max-width: 700px) 70vw, 260px"
                />
                <figcaption>
                  Actual app capture. Projected 2D evidence, interpreted in
                  context.
                </figcaption>
              </figure>
            </article>
          </div>
        </section>
        <section className="section labs-common">
          <div className="shell product-split">
            <div>
              <p className="eyebrow eyebrow--light">{labs.common.eyebrow}</p>
              <h2>{labs.common.headline}</h2>
            </div>
            <div className="product-prose">
              <p>{labs.common.body}</p>
              <a
                className="text-link text-link--light"
                href={labs.common.link.href}
              >
                {labs.common.link.label} ↗
              </a>
            </div>
          </div>
        </section>
        <section className="section closing" id="contact">
          <div className="shell closing__grid">
            <div>
              <p className="eyebrow">{labs.contact.eyebrow}</p>
              <h2>{labs.contact.headline}</h2>
            </div>
            <div className="closing__action">
              <p>{labs.contact.body}</p>
              <a
                className="button button--ink"
                href={`mailto:${site.company.contactEmail}`}
              >
                {site.company.contactEmail} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <noscript>
          <nav className="shell legacy-links" aria-label="Moved Sport sections">
            <span id="story">
              <a href="/sport#story">Sport story</a>
            </span>
            <span id="approach">
              <a href="/sport#approach">Sport approach</a>
            </span>
            <span id="product">
              <a href="/sport#product">Sport product</a>
            </span>
          </nav>
        </noscript>
      </main>
      <SiteFooter />
    </div>
  );
}
