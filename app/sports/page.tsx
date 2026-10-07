import { MotionFamily } from "@/components/motion-family";
import Image from "next/image";
import { sportsNavigation, sports, motion, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(sports.metadata, sports.path, "/images/sport-social.png");
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SportsPage() {
  return (
    <div className="site sports-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <nav className="sports-nav" aria-label="Asymmetri Sports navigation">
          <div className="shell">
            <span>Asymmetri Sports</span>
            <div>
              {sportsNavigation.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <section className="hero">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--light">{sports.hero.eyebrow}</p>
              <h1>{sports.hero.headline}</h1>
              <p className="hero__support">{sports.hero.support}</p>
              <div className="button-row">
                <a className="button button--primary" href="#story">
                  Our story
                </a>
                <a className="text-link text-link--light" href="#contact">
                  Get in touch
                </a>
              </div>
            </div>
            <figure className="hero__figure">
              <Image
                src={sports.images.pitchingDelivery.src}
                alt={sports.images.pitchingDelivery.alt}
                fill
                sizes="(max-width: 820px) 100vw, 56vw"
                priority
              />
            </figure>
          </div>
        </section>
        <section className="section story" id="story">
          <div className="shell story__grid">
            <div className="section-heading">
              <p className="eyebrow">{sports.story.eyebrow}</p>
              <h2>{sports.story.headline}</h2>
            </div>
            <div className="story__body">
              {sports.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
        <section className="section approach" id="approach">
          <div className="shell">
            <div className="approach__heading">
              <div>
                <p className="eyebrow eyebrow--light">
                  {sports.approach.eyebrow}
                </p>
                <h2>{sports.approach.headline}</h2>
              </div>
              <p>{sports.approach.introduction}</p>
            </div>
            <ol className="approach__steps">
              {sports.approach.steps.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="approach__principle">{sports.approach.principle}</p>
          </div>
        </section>
        <section
          className="section motion-intro"
          id="product"
          tabIndex={-1}
          aria-labelledby="motion-intro-title"
        >
          <div className="shell product-split">
            <div>
              <div className="motion-identity">
                <Image
                  src={motion.icon.src}
                  alt={motion.icon.alt}
                  width={80}
                  height={80}
                />
                <div>
                  <p className="eyebrow">{motion.introduction.eyebrow}</p>
                  <p className="motion-identity__name">{motion.name}</p>
                </div>
              </div>
              <h2 id="motion-intro-title">{motion.headline}</h2>
              <p className="product-descriptor">{motion.descriptor}</p>
            </div>
            <div className="product-prose">
              {motion.introduction.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a
                className="button button--ink"
                href={motion.introduction.link.href}
              >
                {motion.introduction.link.label}
              </a>
              <p className="product-status">{motion.releaseStatement}</p>
            </div>
          </div>
        </section>
        <MotionFamily />
        <section className="section closing" id="contact">
          <div className="shell closing__grid">
            <div>
              <p className="eyebrow">{sports.closing.eyebrow}</p>
              <h2>{sports.closing.headline}</h2>
            </div>
            <div className="closing__action">
              <p>{sports.closing.body}</p>
              <a
                className="button button--ink"
                href={`mailto:${site.company.contactEmail}`}
              >
                Start a conversation
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
