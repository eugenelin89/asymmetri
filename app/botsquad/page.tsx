import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { IntroductionVideo } from "@/components/introduction-video";
import { WorkerExample } from "@/components/worker-example";
import { WorkerFlow } from "@/components/worker-flow";
import { botsquad, introductions, site, labs } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(botsquad.metadata, botsquad.path, "/images/labs-social.png");
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "SoftwareSourceCode"],
  name: botsquad.name,
  description: botsquad.descriptor,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Ubuntu",
  url: `${site.company.siteUrl}${botsquad.path}`,
  codeRepository: botsquad.source.href,
  license: botsquad.licenseUrl,
  publisher: { "@type": "Organization", name: site.company.name },
};

export default function BotSquadPage() {
  return (
    <div className="site botsquad-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="botsquad-hero">
          <div className="shell product-split">
            <div>
              <p className="eyebrow eyebrow--light">
                {botsquad.name} / AI coordination
              </p>
              <h1>{botsquad.headline}</h1>
              <p className="hero__support">{botsquad.descriptor}</p>
              <div className="button-row">
                <a
                  className="button button--primary"
                  href={botsquad.source.href}
                >
                  {botsquad.source.label} ↗
                </a>
                <a
                  className="text-link text-link--light"
                  href="#introduction-video"
                >
                  Watch the introduction
                </a>
              </div>
              <p className="botsquad-hero__status">{botsquad.status}</p>
              <a className="text-link text-link--light" href={labs.path}>
                An {labs.name} project ↗
              </a>
            </div>
            <WorkerFlow />
          </div>
        </section>
        <IntroductionVideo video={introductions.botsquad} />
        <section className="section">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">{botsquad.problem.eyebrow}</p>
              <h2>{botsquad.problem.headline}</h2>
            </div>
            <p className="product-lead">{botsquad.problem.body}</p>
          </div>
        </section>
        <section className="section botsquad-workflow" id="how-it-works">
          <div className="shell product-split">
            <div className="product-heading section-heading">
              <p className="eyebrow">How it works</p>
              <h2>{botsquad.workflowHeadline}</h2>
              <p className="product-note">{botsquad.persistence}</p>
            </div>
            <ol className="workflow-list">
              {botsquad.workflow.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="section botsquad-example">
          <div className="shell">
            <WorkerExample />
          </div>
        </section>
        <section className="section company-common">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow eyebrow--light">Review and permissions</p>
              <h2>{botsquad.control.headline}</h2>
            </div>
            <div className="product-prose">
              <p>{botsquad.control.body}</p>
              <p>{botsquad.access.privacy}</p>
            </div>
          </div>
        </section>
        <section className="section botsquad-access" id="availability">
          <div className="shell">
            <div className="product-heading">
              <p className="eyebrow">Getting started</p>
              <h2>{botsquad.access.headline}</h2>
            </div>
            <div className="access-grid">
              <div>
                <h3>Source and self-hosting</h3>
                <p>{botsquad.access.current}</p>
                <p className="product-note">{botsquad.licenseNote}</p>
              </div>
              <div>
                <h3>Current focus</h3>
                <p>{botsquad.access.priority}</p>
                <p className="product-note">
                  {botsquad.access.deferred}
                </p>
              </div>
            </div>
            <p className="access-runtime">{botsquad.access.runtime}</p>
            <div className="button-row">
              <a className="button button--ink" href={botsquad.source.href}>
                {botsquad.source.label} ↗
              </a>
              <a className="text-link" href={botsquad.gettingStarted.href}>
                {botsquad.gettingStarted.label} ↗
              </a>
              <a
                className="text-link"
                href={`mailto:${site.company.contactEmail}`}
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </div>
  );
}
