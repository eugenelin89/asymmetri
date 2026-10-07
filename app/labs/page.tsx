import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { labs } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(labs.metadata, labs.path, "/images/labs-social.png");

export default function LabsPage() {
  return (
    <div className="site labs-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="labs-hero">
          <div className="shell product-split">
            <div>
              <p className="eyebrow eyebrow--light">{labs.name}</p>
              <h1>{labs.headline}</h1>
              <p className="hero__support">{labs.introduction}</p>
              <div className="button-row">
                <a className="button button--accent" href={labs.productLink.href}>
                  {labs.productLink.label}
                </a>
                <a className="text-link text-link--light" href={labs.approachLink.href}>
                  {labs.approachLink.label} ↓
                </a>
              </div>
            </div>
            <aside className="labs-direction" aria-label={labs.approachLink.label}>
              <p className="eyebrow">{labs.approachLink.label}</p>
              <ol>
                {labs.approach.principles.map((principle, index) => (
                  <li key={principle.title}>
                    <span aria-hidden="true">0{index + 1}</span>
                    <p>{principle.title}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>
        <section className="section" id="approach" tabIndex={-1}>
          <div className="shell">
            <div className="product-split">
              <div className="product-heading">
                <p className="eyebrow">{labs.approach.eyebrow}</p>
                <h2>{labs.approach.headline}</h2>
              </div>
              <p className="product-lead">{labs.approach.body}</p>
            </div>
            <dl className="product-details product-details--columns labs-principles">
              {labs.approach.principles.map((principle) => (
                <div key={principle.title}>
                  <dt>{principle.title}</dt><dd>{principle.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="section labs-product">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">{labs.product.eyebrow}</p>
              <h2>{labs.product.headline}</h2>
              <p className="product-note">{labs.product.body}</p>
            </div>
            {labs.projects.map((project) => <article className="labs-product__card" key={project.path}>
              <h3>{project.name}</h3>
              <p>{project.descriptor}</p>
              <p className="showcase-status">{project.status} · MIT licensed</p>
              <p>{project.access.current}</p>
              <div className="button-row">
                <a className="button button--ink" href={project.path}>
                  Explore {project.name}
                </a>
                <a className="text-link" href={project.source.href}>
                  {project.source.label} ↗
                </a>
              </div>
            </article>)}
          </div>
        </section>
        <section className="section company-common">
          <div className="shell product-split">
            <h2>{labs.closing.headline}</h2>
            <div className="product-prose">
              <p>{labs.closing.body}</p>
              <a className="text-link text-link--light" href={labs.closing.link.href}>
                {labs.closing.link.label} ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
