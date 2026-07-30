import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <div className="site">
      <SiteHeader tone="dark" />
      <main id="main-content">
        <section className="hero">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--light">{site.hero.eyebrow}</p>
              <h1>{site.hero.headline}</h1>
              <p className="hero__support">{site.hero.support}</p>
              <div className="button-row">
                <Link className="button button--clay" href="/story">
                  Our story
                </Link>
                <Link className="text-link text-link--light" href="/contact">
                  Get in touch
                </Link>
              </div>
            </div>
            <figure className="hero__figure">
              <Image
                src={site.images.running.src}
                alt={site.images.running.alt}
                fill
                sizes="(max-width: 760px) 100vw, 52vw"
                priority
              />
            </figure>
          </div>
        </section>
        <section className="section problem">
          <div className="shell split">
            <p className="eyebrow">The access gap</p>
            <div>
              <h2>Most athletes do not lack effort. They lack access.</h2>
              <p className="lede">
                Advanced feedback, biomechanics, and long-term development tools
                remain concentrated in expensive facilities and elite programs.
                Talent and ambition are not. Better tools should be within reach
                of more athletes and the people helping them grow.
              </p>
            </div>
          </div>
        </section>
        <section className="section section--soft">
          <div className="shell split">
            <p className="eyebrow">Our mission</p>
            <div>
              <h2>{site.mission.headline}</h2>
              <p className="lede">{site.mission.body}</p>
            </div>
          </div>
        </section>
        <section className="section baseball">
          <div className="shell story-pair">
            <div>
              <p className="eyebrow">{site.origin.eyebrow}</p>
              <h2>{site.origin.headline}</h2>
            </div>
            <div>
              {site.origin.paragraphs.map((paragraph) => (
                <p className="lede" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
        <section className="section section--ink">
          <div className="shell approach">
            <div>
              <p className="eyebrow eyebrow--light">
                The tools may already be in your pocket
              </p>
              <h2>{site.coaching.headline}</h2>
              {site.coaching.paragraphs.map((paragraph) => (
                <p className="lede lede--light" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            <figure>
              <Image
                src={site.images.sensor.src}
                alt={site.images.sensor.alt}
                fill
                sizes="(max-width: 760px) 100vw, 38vw"
              />
            </figure>
          </div>
        </section>
        <section className="section closing">
          <div className="shell closing__inner">
            <p className="eyebrow">The beginning</p>
            <h2>{site.closing.headline}</h2>
            <p className="lede">{site.closing.body}</p>
            <Link className="button button--ink" href="/contact">
              Start a conversation
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
