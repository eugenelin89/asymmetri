import { ClosingCta } from "@/components/editorial/closing-cta";
import { PerspectiveDiagram } from "@/components/editorial/perspective-diagram";
import { PlatformVisual } from "@/components/editorial/platform-visual";
import { SystemFlow } from "@/components/editorial/system-flow";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
  pageMetadata.platform,
  "/work/asymmetrico-platform",
);

const audiences = [
  {
    title: "Athletes",
    body: "Review feedback, understand strengths, identify opportunities, and see development over time.",
  },
  {
    title: "Coaches",
    body: "Submit structured observations, preserve context, and prepare stronger development conversations.",
  },
  {
    title: "Organizations",
    body: "Track participation, review patterns, preserve knowledge, and use limited staff time more effectively.",
  },
];

export default function PlatformCaseStudyPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.platform.name,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    description: site.platform.descriptor,
    creator: {
      "@type": "Organization",
      name: site.company.name,
    },
  };

  return (
    <div className="site">
      <PageIntro
        eyebrow="Deployed work · athlete development"
        title="Asymmetrico Platform"
        summary={site.platform.descriptor}
      >
        <div className="case-meta">
          <span>Status · deployed</span>
          <span>Environment · community baseball</span>
          <span>Identity · anonymized</span>
        </div>
      </PageIntro>
      <main id="main-content">
        <section className="chapter chapter--soft case-overview">
          <div className="shell">
            <PlatformVisual />
            <div className="case-overview__grid">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>A record that gets more useful as development continues.</h2>
              </div>
              <div className="editorial-copy">
                <p>{site.platform.summary}</p>
                <p>
                  The platform does not decide who is talented. It preserves
                  observations, connects perspectives, reveals missing information, and
                  gives development conversations more context.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas case-challenge">
          <div className="shell case-challenge__grid">
            <div>
              <p className="eyebrow">The challenge</p>
              <h2>Knowledge was valuable. Its shelf life was short.</h2>
              <p className="lede">
                Development information was fragmented across memory, spreadsheets,
                conversations, isolated evaluations, and seasonal turnover.
              </p>
            </div>
            <blockquote>
              How might a resource-constrained sports organization preserve multiple
              perspectives on athlete development without creating an administrative
              burden?
            </blockquote>
          </div>
        </section>

        <section className="chapter chapter--ink">
          <div className="shell">
            <div className="chapter-heading chapter-heading--narrow">
              <p className="eyebrow eyebrow--light">The evaluation model</p>
              <h2>Three perspectives. One continuing conversation.</h2>
              <p className="lede lede--light">
                The system preserves differences between perspectives. It does not
                average them into an artificial objective truth.
              </p>
            </div>
            <PerspectiveDiagram />
          </div>
        </section>

        <section className="chapter chapter--soft">
          <div className="shell">
            <div className="chapter-heading chapter-heading--split">
              <div>
                <p className="eyebrow">Useful at every level</p>
                <h2>One system. Different jobs to be done.</h2>
              </div>
              <p className="lede">
                Each view is shaped around a real decision, not around showing more
                dashboard.
              </p>
            </div>
            <div className="audience-grid">
              {audiences.map((audience, index) => (
                <article key={audience.title}>
                  <span>0{index + 1}</span>
                  <h3>{audience.title}</h3>
                  <p>{audience.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas">
          <div className="shell">
            <div className="chapter-heading chapter-heading--narrow">
              <p className="eyebrow">System view</p>
              <h2>From observation to development conversation.</h2>
            </div>
            <SystemFlow />
          </div>
        </section>

        <section className="chapter chapter--ink architecture-chapter">
          <div className="shell architecture-chapter__grid">
            <div>
              <p className="eyebrow eyebrow--light">Technical architecture</p>
              <h2>Structured enough to preserve context. Modular enough to evolve.</h2>
              <p className="lede lede--light">
                The deployed system uses Django with clear subsystem ownership for
                athlete identity, accounts, seasonal participation, analytics, and
                planning workflows.
              </p>
            </div>
            <div className="architecture-list">
              {[
                "Structured athlete records",
                "Configurable versioned question sets",
                "Evaluation cycles + season snapshots",
                "Multiple response types",
                "Timeline + comparison services",
                "Reporting + completion services",
                "Role-aware accounts",
                "Permission-controlled views",
              ].map((item, index) => (
                <div key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter--soft privacy-chapter">
          <div className="shell privacy-chapter__grid">
            <div>
              <p className="eyebrow">Privacy</p>
              <h2>Athlete information is not marketing material.</h2>
            </div>
            <div>
              <p className="lede">
                Access is permission-controlled. Public visuals use synthetic names and
                reconstructed interfaces. No real athlete histories, evaluation
                responses, coach notes, account details, or source-organization identity
                are shown here.
              </p>
              <div className="privacy-tags" aria-label="Privacy safeguards">
                <span>Synthetic public data</span>
                <span>Role-aware access</span>
                <span>Purpose-limited views</span>
                <span>No public application link</span>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas state-chapter">
          <div className="shell state-chapter__grid">
            <article>
              <p className="eyebrow">Current state</p>
              <h3>Deployed</h3>
              <p>
                Structured evaluations, review workflows, athlete profiles, timelines,
                comparison, completion tracking, reporting, role-aware accounts, and
                seasonal context are working in a real community sports environment.
              </p>
            </article>
            <article>
              <p className="eyebrow">Future direction</p>
              <h3>Exploratory</h3>
              <p>
                Biomechanics, affordable sensors, video-derived information,
                cross-source athlete profiles, and intelligent development support
                remain future directions—not current product claims.
              </p>
            </article>
          </div>
        </section>
        <ClosingCta />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
