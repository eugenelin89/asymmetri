import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <div className="site">
      <SiteHeader />
      <main id="main-content">
        <section className="hero">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--light">{site.hero.eyebrow}</p>
              <h1>{site.hero.headline}</h1>
              <p className="hero__support">{site.hero.support}</p>
              <div className="button-row">
                <a className="button button--accent" href="#story">
                  Our story
                </a>
                <a className="text-link text-link--light" href="#contact">
                  Get in touch
                </a>
              </div>
            </div>
            <figure className="hero__figure">
              <Image
                src={site.images.pitchingDelivery.src}
                alt={site.images.pitchingDelivery.alt}
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
              <p className="eyebrow">{site.story.eyebrow}</p>
              <h2>{site.story.headline}</h2>
            </div>
            <div className="story__body">
              {site.story.paragraphs.map((paragraph) => (
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
                  {site.approach.eyebrow}
                </p>
                <h2>{site.approach.headline}</h2>
              </div>
              <p>{site.approach.introduction}</p>
            </div>
            <ol className="approach__steps">
              {site.approach.steps.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="approach__principle">{site.approach.principle}</p>
          </div>
        </section>
        <section className="section closing" id="contact">
          <div className="shell closing__grid">
            <div>
              <p className="eyebrow">{site.closing.eyebrow}</p>
              <h2>{site.closing.headline}</h2>
            </div>
            <div className="closing__action">
              <p>{site.closing.body}</p>
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
