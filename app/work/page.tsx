import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { botsquad, work } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(work.metadata, work.path);

export default function WorkPage() {
  return (
    <div className="site work-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="work-hero">
          <div className="shell work-hero__copy">
            <div>
              <p className="eyebrow eyebrow--light">{work.name}</p>
              <h1>{work.headline}</h1>
              <p className="hero__support">{work.introduction}</p>
              <div className="button-row">
                <a className="button button--accent" href={work.productLink.href}>
                  {work.productLink.label}
                </a>
                <a className="text-link text-link--light" href={work.approachLink.href}>
                  {work.approachLink.label} ↓
                </a>
              </div>
            </div>

          </div>
        </section>
        <section className="section" id="approach" tabIndex={-1}>
          <div className="shell">
            <div className="product-split">
              <div className="product-heading">
                <p className="eyebrow">{work.approach.eyebrow}</p>
                <h2>{work.approach.headline}</h2>
              </div>
              <p className="product-lead">{work.approach.body}</p>
            </div>
            <dl className="product-details product-details--columns work-principles">
              {work.approach.principles.map((principle) => (
                <div key={principle.title}>
                  <dt>{principle.title}</dt><dd>{principle.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="section work-product">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">{work.product.eyebrow}</p>
              <h2>{work.product.headline}</h2>
              <p className="product-note">{work.product.body}</p>
            </div>
            <div className="work-product__card">
              <h3>{botsquad.name}</h3>
              <p>{botsquad.descriptor}</p>
              <p className="showcase-status">{botsquad.status} · MIT licensed</p>
              <p>{botsquad.access.current}</p>
              <div className="button-row">
                <a className="button button--ink" href={work.productLink.href}>
                  {work.productLink.label}
                </a>
                <a className="text-link" href={work.portfolioLink.href}>
                  {work.portfolioLink.label} ↗
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="section labs-common">
          <div className="shell product-split">
            <h2>{work.closing.headline}</h2>
            <div className="product-prose">
              <p>{work.closing.body}</p>
              <a className="text-link text-link--light" href={work.closing.link.href}>
                {work.closing.link.label} ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
