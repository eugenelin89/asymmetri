import Image from "next/image";
import { ClosingCta } from "@/components/editorial/closing-cta";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.about, "/about");

export default function AboutPage() {
  return (
    <div className="site">
      <PageIntro
        eyebrow="About"
        title="Built where sport, software, and physical systems meet."
        summary="Asymmetrico applies the discipline of real-world engineering to athlete development: imperfect information, limited resources, human judgment, and tools that have to work outside a controlled demo."
      />
      <main id="main-content">
        <section className="chapter chapter--soft about-story">
          <div className="shell about-story__grid">
            <figure>
              <Image
                src="/images/research/systems-workbench.webp"
                alt="A workbench with tracked robot prototypes, electronics, and hand tools."
                fill
                sizes="(max-width: 760px) 100vw, 42vw"
              />
              <figcaption>Systems that leave simulation teach a useful kind of humility.</figcaption>
            </figure>
            <div>
              <p className="eyebrow">Engineering DNA</p>
              <h2>Reality is the design constraint.</h2>
              <div className="editorial-copy">
                <p>
                  Asymmetrico emerged from hands-on work across community sports,
                  athlete development, software systems, machine learning, sensors,
                  biomechanics, robotics, and physical prototyping.
                </p>
                <p>
                  The technical origin includes systems that had to leave simulation
                  and survive the real world. That same discipline now shapes how we
                  build sports technology: around noisy environments, incomplete
                  information, constrained resources, and people doing the work.
                </p>
                <p>
                  The current focus is clear: accessible sports technology, with
                  baseball as the first proving ground.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas">
          <div className="shell">
            <div className="chapter-heading chapter-heading--narrow">
              <p className="eyebrow">How we work</p>
              <h2>Start with the constraint. Earn the complexity.</h2>
            </div>
            <div className="method-grid">
              {[
                ["01", "Observe", "Understand the decisions, handoffs, and missing context in the real workflow."],
                ["02", "Structure", "Create just enough system to preserve information and make it usable."],
                ["03", "Test", "Put the tool into the environment where time, trust, and attention are limited."],
                ["04", "Accumulate", "Let the record improve as people, seasons, and sources change."],
              ].map(([number, title, body]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter--ink about-focus">
          <div className="shell about-focus__grid">
            <div>
              <p className="eyebrow eyebrow--light">Current focus</p>
              <h2>Sports technology that respects the people closest to development.</h2>
            </div>
            <div className="about-focus__list">
              {[
                "Athlete-development infrastructure",
                "Coaching intelligence",
                "Longitudinal athlete records",
                "Multi-perspective evaluation",
                "Accessible biomechanics",
                "Affordable sensing + video",
              ].map((item, index) => (
                <div key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
