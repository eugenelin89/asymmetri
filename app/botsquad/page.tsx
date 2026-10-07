import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { IntroductionVideo } from "@/components/introduction-video";
import { WorkerExample } from "@/components/worker-example";
import { WorkerFlow } from "@/components/worker-flow";
import { botsquad, introductions, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(botsquad.metadata, botsquad.path, "/images/labs-social.png");
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "SoftwareSourceCode"],
  name: botsquad.name,
  description: botsquad.descriptor,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Ubuntu",
  programmingLanguage: "TypeScript",
  runtimePlatform: "Node.js",
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
          <div className="shell">
            <p className="eyebrow eyebrow--light">{botsquad.eyebrow}</p>
            <h1>{botsquad.headline}</h1>
            <p className="hero__support">{botsquad.descriptor}</p>
            <p className="botsquad-hero__status">{botsquad.status}</p>
            <div className="button-row">
              <a className="button button--primary" href={botsquad.source.href}>{botsquad.source.label} ↗</a>
              <a className="text-link text-link--light" href="#how-it-works">See how it works ↓</a>
              <a className="text-link text-link--light" href="#introduction-video">Watch the introduction ↓</a>
            </div>
          </div>
        </section>
        <nav className="squad-index shell" aria-label="On this page">
          {botsquad.navigation.map((item) => <a key={item.href} href={item.href}>{item.label} <span aria-hidden="true">↓</span></a>)}
        </nav>
        <section className="section" id="the-goal">
          <div className="shell product-split">
            <div className="product-heading"><p className="eyebrow">{botsquad.goal.eyebrow}</p><h2>{botsquad.goal.headline}</h2></div>
            <div className="squad-prose"><p>{botsquad.goal.problem}</p><p>{botsquad.goal.ambition}</p><p className="squad-emphasis">{botsquad.goal.boundary}</p></div>
          </div>
        </section>
        <section className="section squad-raised" id="how-it-works">
          <div className="shell">
            <div className="product-split">
              <div className="product-heading">
                <p className="eyebrow">How it works</p><h2>{botsquad.workerModel.headline}</h2>
                <div className="squad-memory" aria-label="What persists">
                  {botsquad.workerModel.retained.map((item) => <span key={item}>{item}</span>)}
                  <p>{botsquad.workerModel.runtime}</p>
                </div>
              </div>
              <div className="squad-prose"><p>{botsquad.workerModel.body}</p><p>{botsquad.workerModel.limit}</p></div>
            </div>
            <div className="squad-team-heading product-heading">
              <h2>{botsquad.team.headline}</h2><p>{botsquad.team.introduction}</p>
            </div>
            <WorkerFlow />
          </div>
        </section>
        <section className="section" id="capabilities">
          <div className="shell">
            <div className="squad-section-heading product-heading"><p className="eyebrow">Current capabilities</p><h2>{botsquad.capabilities.headline}</h2><p>{botsquad.capabilities.introduction}</p></div>
            <div className="squad-capabilities">
              {botsquad.capabilities.items.map((item, index) => (
                <article key={item.title}><span className="squad-number" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>
              ))}
            </div>
            <div className="squad-evidence">
              <div><h3>{botsquad.capabilities.evidence.title}</h3><p>{botsquad.capabilities.evidence.body}</p></div>
              <figure>
                <ul>{botsquad.capabilities.evidence.steps.map((step) => <li key={step}>{step}</li>)}</ul>
                <figcaption>{botsquad.capabilities.evidence.caption}</figcaption>
              </figure>
            </div>
            <p className="squad-limit"><strong>Current limits. </strong>{botsquad.capabilities.limits}</p>
          </div>
        </section>
        <section className="section squad-raised" id="design-ideas">
          <div className="shell">
            <div className="product-heading"><h2>{botsquad.principles.headline}</h2></div>
            <div className="squad-principles">{botsquad.principles.items.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
            <a className="text-link" href={botsquad.whitePaper.href}>{botsquad.whitePaper.label} ↗</a>
          </div>
        </section>
        <section className="section" id="example"><div className="shell"><WorkerExample /></div></section>
        <section className="section squad-raised" id="building-asymmetri">
          <div className="shell">
            <div className="squad-section-heading product-heading"><p className="eyebrow">Our own experiment</p><h2>{botsquad.asymmetriUsage.headline}</h2><p>{botsquad.asymmetriUsage.introduction}</p></div>
            <div className="squad-usage">
              {botsquad.asymmetriUsage.projects.map((project) => <article key={project.title}><h3><a href={project.href}>{project.title} ↗</a></h3><p>{project.body}</p></article>)}
            </div>
            <p className="squad-limit"><strong>What we’ve tried. </strong>{botsquad.asymmetriUsage.evidence}</p>
            <p className="squad-closing">{botsquad.asymmetriUsage.closing}</p>
          </div>
        </section>
        <section className="section" id="availability">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">Getting started</p><h2>Try it yourself.</h2>
              <p className="product-lead">{botsquad.licenseNote}</p>
              <div className="button-row"><a className="button button--primary" href={botsquad.gettingStarted.href}>{botsquad.gettingStarted.label} ↗</a><a className="text-link" href={botsquad.source.href}>{botsquad.source.label} ↗</a></div>
            </div>
            <ol className="squad-setup">{botsquad.gettingStartedSteps.map((step, index) => <li key={step.title}><span aria-hidden="true">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
          </div>
        </section>
        <section className="section squad-technical" id="under-the-hood">
          <div className="shell product-split">
            <div className="product-heading"><h2>{botsquad.underTheHood.headline}</h2><ul className="squad-stack">{botsquad.underTheHood.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
            <div className="squad-prose"><p>{botsquad.underTheHood.body}</p><p>{botsquad.underTheHood.privacy}</p></div>
          </div>
        </section>
        <section className="section" id="roadmap">
          <div className="shell">
            <div className="product-heading"><h2>{botsquad.roadmap.headline}</h2></div>
            <div className="squad-roadmap">
              <article><h3>{botsquad.roadmap.today.title}</h3><p>{botsquad.roadmap.today.body}</p></article>
              <article className="squad-roadmap__focus"><p className="eyebrow">{botsquad.roadmap.focus.title}</p><h3>{botsquad.roadmap.focus.label}</h3><p>{botsquad.roadmap.focus.body}</p></article>
              <article><h3>{botsquad.roadmap.later.title}</h3><p>{botsquad.roadmap.later.body}</p></article>
            </div>
            <a className="text-link" href={botsquad.roadmapLink.href}>{botsquad.roadmapLink.label} ↗</a>
          </div>
        </section>
        <section className="section squad-raised" id="human-control">
          <div className="shell product-split">
            <div className="product-heading"><h2>{botsquad.control.headline}</h2></div>
            <div className="squad-prose"><p>{botsquad.control.body}</p><a className="text-link" href={botsquad.whitePaper.href}>{botsquad.whitePaper.label} ↗</a></div>
          </div>
        </section>
        <IntroductionVideo video={introductions.botsquad} />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </div>
  );
}
