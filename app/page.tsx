import Image from "next/image";
import Link from "next/link";
import { ClosingCta } from "@/components/editorial/closing-cta";
import { PerspectiveDiagram } from "@/components/editorial/perspective-diagram";
import { PlatformVisual } from "@/components/editorial/platform-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";

const constraints = [
  ["01", "Limited budgets", "Use what is attainable, then make it more useful."],
  ["02", "Volunteer time", "Reduce the cost of remembering, organizing, and following up."],
  ["03", "Changing teams", "Carry development context forward when people move on."],
  ["04", "Mixed experience", "Make sophisticated capability understandable in real workflows."],
];

export default function HomePage() {
  return (
    <div className="site">
      <SiteHeader tone="dark" />
      <main id="main-content">
        <section className="hero">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--light">{site.hero.eyebrow}</p>
              <h1>
                Talent is everywhere.
                <span>The tools aren’t.</span>
              </h1>
              <p className="hero__thesis">{site.hero.thesis}</p>
              <div className="button-row">
                <Link className="button button--clay" href="/work">
                  Explore our work <span aria-hidden="true">↗</span>
                </Link>
                <Link className="text-link text-link--light" href="/why-asymmetrico">
                  Why Asymmetrico <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <figure className="hero__figure">
              <Image
                src="/images/sports/baseball-running-action.webp"
                alt="A baseball player accelerating out of the batter’s box as clay lifts from the ground."
                fill
                sizes="(max-width: 760px) 100vw, 56vw"
                priority
              />
              <div className="hero__annotation" aria-hidden="true">
                <span>Effort</span>
                <i />
                <strong>visible</strong>
              </div>
              <figcaption>
                Talent is not distributed according to budget. Opportunity often is.
              </figcaption>
            </figure>
          </div>
          <div className="hero__index" aria-hidden="true">
            <span>01</span>
            <i />
            <span>12</span>
          </div>
        </section>

        <section className="chapter chapter--canvas problem-chapter">
          <div className="shell">
            <div className="chapter-heading chapter-heading--offset">
              <p className="eyebrow">The imbalance</p>
              <h2>The work is happening. The infrastructure is missing.</h2>
              <p className="lede">
                Community programs are full of care, experience, and commitment. But
                valuable development information still lives in conversations, memory,
                isolated notes, and spreadsheets.
              </p>
            </div>
            <div className="fragment-grid" role="list" aria-label="Consequences of fragmented information">
              {[
                "Feedback disappears",
                "Coaches change",
                "Athletes become snapshots",
                "Observations stay disconnected",
                "Potential is overlooked",
              ].map((item, index) => (
                <div className={`fragment-card fragment-card--${index + 1}`} role="listitem" key={item}>
                  <span>0{index + 1}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
            <p className="problem-chapter__close">
              The problem is not a lack of care. <strong>It is a lack of continuity.</strong>
            </p>
          </div>
        </section>

        <section className="chapter chapter--ink name-chapter">
          <div className="shell name-chapter__grid">
            <div className="name-chapter__aside">
              <p className="eyebrow eyebrow--light">Why Asymmetrico</p>
              <div className="leverage-mark" aria-hidden="true">
                <span>small input</span>
                <i />
                <strong>larger field of insight</strong>
              </div>
            </div>
            <div>
              <h2>{site.nameStory.headline}</h2>
              <div className="editorial-copy editorial-copy--light">
                {site.nameStory.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Link className="text-link text-link--light" href="/why-asymmetrico">
                Read the thinking <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="chapter chapter--soft platform-chapter">
          <div className="shell">
            <div className="chapter-heading chapter-heading--split">
              <div>
                <p className="eyebrow">{site.platform.status}</p>
                <h2>The first system makes development visible.</h2>
              </div>
              <div>
                <p className="lede">{site.platform.summary}</p>
                <Link className="text-link" href="/work/asymmetrico-platform">
                  Explore the case study <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <PlatformVisual />
          </div>
        </section>

        <section className="chapter chapter--canvas perspective-chapter">
          <div className="shell">
            <div className="chapter-heading chapter-heading--narrow">
              <p className="eyebrow">One athlete · multiple perspectives</p>
              <h2>No single point of view is the whole athlete.</h2>
              <p className="lede">
                Self reflection, teammate observations, and coaching judgment each
                reveal something different. The value is not in flattening them into
                one score. It is in seeing where they connect.
              </p>
            </div>
            <PerspectiveDiagram />
          </div>
        </section>

        <section className="chapter chapter--soft timeline-chapter">
          <div className="shell timeline-chapter__grid">
            <div className="timeline-chapter__copy">
              <p className="eyebrow">Development should accumulate</p>
              <h2>Feedback should not disappear at the end of a season.</h2>
              <p className="lede">
                Evaluation cycles create a record of what changed, what remained
                consistent, and what a new coach should understand first.
              </p>
            </div>
            <div className="season-timeline" aria-label="Illustrative multi-season athlete timeline">
              {[
                ["2024", "Baseline", "A first shared view"],
                ["2025", "Pattern", "Strengths become visible"],
                ["2026", "Direction", "Priorities gain context"],
                ["Next", "Continuity", "The record moves forward"],
              ].map(([year, title, note], index) => (
                <div key={year}>
                  <span>{year}</span>
                  <i className={`dot dot--${["clay", "blue", "green", "ink"][index]}`} />
                  <strong>{title}</strong>
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter--ink constraint-chapter">
          <div className="shell">
            <div className="chapter-heading chapter-heading--split">
              <div>
                <p className="eyebrow eyebrow--light">Built for real constraints</p>
                <h2>Accessibility is an engineering standard.</h2>
              </div>
              <p className="lede lede--light">
                Accessible does not mean basic. It means technology that can survive
                limited time, mixed experience, imperfect information, and gradual
                adoption without losing its integrity.
              </p>
            </div>
            <div className="constraint-list">
              {constraints.map(([number, title, body]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas research-chapter">
          <div className="shell">
            <div className="chapter-heading chapter-heading--split">
              <div>
                <p className="eyebrow">Beyond software · emerging work</p>
                <h2>Capabilities once limited to laboratories can become practical.</h2>
              </div>
              <p className="lede">
                Related research in sensors, biomechanics, video, and machine learning
                points toward another expression of the same thesis: useful
                measurement should not depend on elite infrastructure.
              </p>
            </div>
            <div className="research-grid">
              <figure className="research-card research-card--portrait">
                <Image
                  src="/images/research/wearable-sensor-prototype.webp"
                  alt="A baseball player testing wired motion sensors on the arm and waist during an early prototype session."
                  fill
                  sizes="(max-width: 760px) 100vw, 34vw"
                />
                <figcaption>
                  <span>Emerging work · affordable sensing</span>
                  Early prototype data collection
                </figcaption>
              </figure>
              <figure className="research-card research-card--signal">
                <Image
                  src="/images/research/motion-signal-plot.webp"
                  alt="Two line plots showing hip acceleration and angular velocity across a recorded pitching motion."
                  fill
                  sizes="(max-width: 760px) 100vw, 55vw"
                />
                <figcaption>
                  <span>Research artifact · motion signals</span>
                  Measurement is one perspective—not a verdict.
                </figcaption>
              </figure>
            </div>
            <p className="research-disclosure">
              This is related research and technical foundation. It is not presented as
              a mature commercial Asymmetrico product.
            </p>
          </div>
        </section>

        <section className="chapter chapter--soft principles-chapter">
          <div className="shell">
            <div className="chapter-heading chapter-heading--narrow">
              <p className="eyebrow">What we believe</p>
              <h2>Technology should make the human work more durable.</h2>
            </div>
            <div className="principle-grid">
              {site.principles.map((principle, index) => (
                <article key={principle.title}>
                  <span>0{index + 1}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="human-outcome">
          <div className="shell human-outcome__grid">
            <figure>
              <Image
                src="/images/sports/baseball-pitching-mound.webp"
                alt="A pitcher pauses on the mound and looks toward home plate before the next delivery."
                fill
                sizes="(max-width: 760px) 100vw, 52vw"
              />
            </figure>
            <div>
              <p className="eyebrow eyebrow--light">The human outcome</p>
              <h2>See the athlete. Keep the context.</h2>
              <p>
                Better information should lead to clearer goals, stronger conversations,
                more ownership, and more chances for potential to be understood.
              </p>
              <blockquote>
                Better tools should not be reserved for the athletes who already have
                every advantage.
              </blockquote>
            </div>
          </div>
        </section>

        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
