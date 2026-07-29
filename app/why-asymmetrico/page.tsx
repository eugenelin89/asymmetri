import { ClosingCta } from "@/components/editorial/closing-cta";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
  pageMetadata.why,
  "/why-asymmetrico",
);

const inputs = [
  "Coach observation",
  "Athlete reflection",
  "Teammate perspective",
  "Affordable measurement",
  "Historical context",
];

export default function WhyPage() {
  return (
    <div className="site">
      <PageIntro
        eyebrow="Why Asymmetrico"
        title="More potential than resources."
        summary="The name is built around asymmetric advantage: using focused, accessible technology to create leverage when scale is not available."
      />
      <main id="main-content">
        <section className="chapter chapter--canvas why-opening">
          <div className="shell why-opening__grid">
            <div>
              <p className="eyebrow">The uneven field</p>
              <h2>Talent is not distributed according to budget.</h2>
            </div>
            <div className="editorial-copy">
              <p>
                Some programs have dedicated analysts, specialized staff, private
                facilities, advanced sensors, and constant exposure. Others have
                volunteer coaches, limited time, consumer hardware, and information
                split across conversations and memory.
              </p>
              <p>
                The smaller organization rarely wins by imitating the larger one. It
                needs a different source of advantage.
              </p>
            </div>
          </div>
        </section>

        <section className="chapter chapter--ink leverage-page">
          <div className="shell">
            <div className="chapter-heading chapter-heading--narrow">
              <p className="eyebrow eyebrow--light">The Asymmetrico idea</p>
              <h2>{site.nameStory.headline}</h2>
            </div>
            <div className="leverage-system">
              <div className="leverage-system__inputs">
                {inputs.map((input, index) => (
                  <div key={input}>
                    <span>0{index + 1}</span>
                    <strong>{input}</strong>
                  </div>
                ))}
              </div>
              <div className="leverage-system__shift" aria-hidden="true">
                <i />
                <span>focus + continuity</span>
              </div>
              <div className="leverage-system__outcome">
                <span className="eyebrow eyebrow--light">Asymmetric advantage</span>
                <strong>A clearer development picture than any one input can provide.</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter chapter--soft">
          <div className="shell">
            <div className="chapter-heading chapter-heading--split">
              <div>
                <p className="eyebrow">Leverage over scale</p>
                <h2>Make more of the insight already in the room.</h2>
              </div>
              <div className="editorial-copy">
                {site.nameStory.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="why-statements">
              <article>
                <span>01</span>
                <h3>Preserve expertise</h3>
                <p>A coach’s observation becomes more valuable when it survives a season.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Connect perspectives</h3>
                <p>Differences between self, peer, coach, and measurement create useful questions.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Widen visibility</h3>
                <p>Longitudinal context helps potential emerge beyond a single tryout.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas name-note">
          <div className="shell name-note__grid">
            <div className="name-note__word">co</div>
            <div>
              <p className="eyebrow">A quiet second layer</p>
              <h2>Technology works best when people can use it together.</h2>
              <p className="lede">
                The ending is not a forced linguistic origin. It simply leaves room for
                what makes the work useful: company, collaboration, coaches, community,
                and collective development.
              </p>
            </div>
          </div>
        </section>
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
