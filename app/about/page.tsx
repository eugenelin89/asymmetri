import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { about, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(about.metadata, "/about");

export default function AboutPage() {
  return (
    <div className="site about-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="about-hero">
          <div className="shell">
            <p className="eyebrow eyebrow--light">{about.eyebrow}</p>
            <h1>{about.headline}</h1>
            <div className="about-introduction">
              <p>{about.introduction}</p>
              <p>{about.meaning}</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="shell">
            <p className="eyebrow">What guides the work</p>
            <dl className="product-details product-details--columns about-principles">
              {about.principles.map((p) => (
                <div key={p.title}>
                  <dt>{p.title}</dt>
                  <dd>{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="section about-origin">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">Where it began</p>
              <h2>A phone camera. A better question.</h2>
            </div>
            <div className="product-prose">
              <p>{about.origin}</p>
              <a className="text-link" href="/sport#story">
                Read the Sport story ↗
              </a>
            </div>
          </div>
        </section>
        <section className="section about-next">
          <div className="shell">
            <h2>See the idea at work.</h2>
            <div className="button-row">
              <Link className="button button--ink" href="/#products">
                Explore the products
              </Link>
              <a
                className="text-link"
                href={`mailto:${site.company.contactEmail}`}
              >
                Start a conversation ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
