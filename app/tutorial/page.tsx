import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TutorialReader } from "@/components/tutorial-reader";
import { motion, site, tutorial, tutorialMedia, type TutorialModule } from "@/content/site";

export const metadata: Metadata = {
  ...tutorial.metadata,
  alternates: { canonical: tutorial.canonical },
  openGraph: {
    ...tutorial.metadata, url: tutorial.canonical, type: "website", siteName: site.company.name,
    images: [{ url: motion.socialImage, width: 1024, height: 1024, alt: motion.icon.alt }],
  },
  twitter: { ...tutorial.metadata, card: "summary", images: [motion.socialImage] },
};

function ModuleContent({ module, number }: { module: TutorialModule; number: number }) {
  return <>
    {module.id === "troubleshooting" && <div className="tutorial-troubleshooting">
      {tutorial.troubleshooting.map((item) => <details key={item.id}>
        <summary id={item.id}>{item.title}</summary><p>{item.body}</p>
      </details>)}
    </div>}
    {module.steps.map((step, index) => {
      const media = step.media ? tutorialMedia[step.media] : undefined;
      return <section key={step.id} id={step.id} tabIndex={-1}
        aria-labelledby={`${step.id}-title`} data-step-path={step.path} data-step-view={step.view}
        className={`tutorial-step${media ? " tutorial-step--visual" : ""}${media?.kind === "Instructional illustration" ? " tutorial-step--illustration" : ""}`}>
        <div className="tutorial-step__copy">
          <p className="tutorial-step__number">Step {number}.{index + 1}{step.path ? ` · ${step.path === "record" ? "Record" : "Import"}` : ""}{step.view ? ` · ${step.view === "back" ? "Back View" : "Side View"}` : ""}</p>
          <h3 id={`${step.id}-title`}>{step.title}</h3>
          {step.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {step.items && <ol>{step.items.map((item) => <li key={item}>{item}</li>)}</ol>}
          {step.note && <p className="tutorial-note">{step.note}</p>}
          <a className="tutorial-permalink" href={`#${step.id}`} aria-label={`Link to step ${number}.${index + 1}: ${step.title}`}>Link to this step <span aria-hidden="true">↗</span></a>
        </div>
        {media && <figure className={`tutorial-figure ${media.kind === "App screenshot" ? "tutorial-figure--screen" : "tutorial-figure--illustration"}`}>
          <a href={media.src} target="_blank" rel="noreferrer" aria-label={`Open full image in a new tab: ${media.alt}`}>
            <Image src={media.src} alt={media.alt} width={media.width} height={media.height} unoptimized />
          </a>
          <figcaption><span>{media.kind} · <a href={media.src} target="_blank" rel="noreferrer">Open full image ↗</a></span>{media.caption}</figcaption>
        </figure>}
      </section>;
    })}
  </>;
}

export default function TutorialPage() {
  const modules: TutorialModule[] = tutorial.modules;
  return <div className="site tutorial-page">
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <header className="tutorial-hero">
        <div className="shell">
          <a className="tutorial-back" href={motion.path}>← Asymmetri Motion</a>
          <p className="eyebrow">The practical guide</p>
          <h1>{tutorial.title}</h1>
          <p className="tutorial-hero__intro">{tutorial.introduction}</p>
          <p className="tutorial-hero__meta">10 modules · Record or import · Back and Side View</p>
        </div>
      </header>
      <TutorialReader headers={modules.map((module, index) => <header key={module.id} className="tutorial-module__header">
          <p className="eyebrow">{String(index + 1).padStart(2, "0")} / {module.label}</p>
          <h2 id={`${module.id}-title`}>{module.title}</h2><p>{module.intro}</p>
          {module.steps.length > 2 && <details className="tutorial-contents"><summary>In this module · {module.steps.length} steps</summary>
            <ul>{module.steps.map((step) => <li key={step.id} data-step-path={step.path} data-step-view={step.view}>
              <a href={`#${step.id}`}>{step.title}</a></li>)}</ul>
          </details>}
        </header>)} modules={modules.map(({ id, label, steps }) => ({ id, label, steps: steps.map(({ id, path, view }) => ({ id, path, view })) }))}
        panels={modules.map((module, index) => <ModuleContent key={module.id} module={module} number={index + 1} />)} />
      <div className="tutorial-help shell">
        <div><h2>Need a hand?</h2><p>Use the support guide or revisit how Motion handles your data.</p></div>
        <div className="button-row"><a className="button button--ink" href="/support">Motion Support</a><a className="text-link" href="/privacy">Privacy Policy</a></div>
        <p className="tutorial-disclosure">{tutorial.disclosure} {motion.releaseStatement}</p>
      </div>
    </main>
    <SiteFooter />
  </div>;
}
