import Image from "next/image";
import { HomeCapability } from "@/components/home-capability";
import { HomeWorkerFlow } from "@/components/home-worker-flow";
import { LegacyHomeFragments } from "@/components/legacy-home-fragments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { botsquad, home, labs, motion, site, sports } from "@/content/site";

import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(home.metadata, "/", "/images/home-social.png");

export default function HomePage() {
  return (
    <div className="site home-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <LegacyHomeFragments />
        <section className="home-hero">
          <div className="shell home-hero__grid">
            <div className="home-hero__copy">
              <p className="eyebrow eyebrow--light">{home.hero.eyebrow}</p>
              <h1>{home.hero.headline}</h1>
              <p className="hero__support">{home.hero.support}</p>
              <div className="button-row">
                <a
                  className="button button--primary"
                  href={home.hero.primary.href}
                >
                  {home.hero.primary.label}
                </a>
                <a
                  className="text-link text-link--light"
                  href={home.hero.secondary.href}
                >
                  {home.hero.secondary.label} ↗
                </a>
              </div>
            </div>
            <HomeCapability />
          </div>
          <div className="shell home-hero__foot">
            <span>Independent thinking. Practical technology.</span>
            <a href="#products">
              Explore the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section className="home-philosophy">
          <div className="shell product-split">
            <h2>{home.philosophy.headline}</h2>
            <p>{home.philosophy.body}</p>
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
              <p className="eyebrow">{home.products.eyebrow}</p>
              <h2 id="products-title">{home.products.headline}</h2>
            </div>
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
                    01 / {sports.name}
                  </p>
                </div>
                <p className="product-showcase__name">{motion.name}</p>
                <h3>{motion.headline}</h3>
                <p>{motion.descriptor} {home.motionSummary}</p>
                <p className="showcase-status">{motion.releaseStatus}</p>
                <div className="button-row">
                  <a className="button button--ink" href={motion.path}>
                    Explore Asymmetri Motion
                  </a>
                  <a className="text-link" href="/motion#introduction-video">
                    Watch the introduction
                  </a>
                </div>
                <a className="sport-story-link" href={sports.path}>
                  {sports.name}: story and product family{" "}
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
                  src={home.motionPreview.src}
                  alt={home.motionPreview.alt}
                  width={home.motionPreview.width}
                  height={home.motionPreview.height}
                  sizes="(max-width: 700px) 70vw, 260px"
                />
                <figcaption>
                  Actual app capture. Projected 2D evidence, interpreted in
                  context.
                </figcaption>
              </figure>
            </article>
            <article className="product-showcase product-showcase--botsquad">
              <div className="product-showcase__copy">
                <p className="product-showcase__index">02 / {labs.name}</p>
                <p className="product-showcase__name">{botsquad.name}</p>
                <h3>{home.botsquadPreview.headline}</h3>
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
                <a className="sport-story-link" href={labs.path}>
                  {labs.name}: our approach <span aria-hidden="true">↗</span>
                </a>
              </div>
              <HomeWorkerFlow />
            </article>
          </div>
        </section>
        <section className="section company-common">
          <div className="shell product-split">
            <div>
              <p className="eyebrow eyebrow--light">{home.common.eyebrow}</p>
              <h2>{home.common.headline}</h2>
            </div>
            <div className="product-prose">
              <p>{home.common.body}</p>
              <a
                className="text-link text-link--light"
                href={home.common.link.href}
              >
                {home.common.link.label} ↗
              </a>
            </div>
          </div>
        </section>
        <section className="section closing" id="contact">
          <div className="shell closing__grid">
            <div>
              <p className="eyebrow">{home.contact.eyebrow}</p>
              <h2>{home.contact.headline}</h2>
            </div>
            <div className="closing__action">
              <p>{home.contact.body}</p>
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
          <nav className="shell legacy-links" aria-label="Moved Sports sections">
            <span id="story">
              <a href="/sports#story">Sports story</a>
            </span>
            <span id="approach">
              <a href="/sports#approach">Sports approach</a>
            </span>
            <span id="product">
              <a href="/sports#product">Sports product</a>
            </span>
          </nav>
        </noscript>
      </main>
      <SiteFooter />
    </div>
  );
}
