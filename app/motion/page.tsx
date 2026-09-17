import type { Metadata } from "next";
import Image from "next/image";
import { EvidenceChain } from "@/components/evidence-chain";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { motion, site, tutorial } from "@/content/site";

export const metadata: Metadata = {
  ...motion.metadata,
  alternates: { canonical: motion.path },
  openGraph: {
    ...motion.metadata,
    url: motion.path,
    siteName: site.company.name,
    type: "website",
    locale: "en_CA",
    images: [{ url: motion.socialImage, width: 1024, height: 1024, alt: motion.icon.alt }],
  },
  twitter: {
    ...motion.metadata,
    card: "summary",
    images: [motion.socialImage],
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: motion.name,
  description: motion.descriptor,
  url: `${site.company.siteUrl}${motion.path}`,
  operatingSystem: motion.operatingSystem,
  availableOnDevice: motion.device,
  applicationCategory: "SportsApplication",
  publisher: { "@type": "Organization", name: site.company.name, url: site.company.siteUrl },
};

export default function MotionPage() {
  return (
    <div className="site motion-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="motion-hero">
          <div className="shell motion-hero__grid">
            <div>
              <p className="eyebrow eyebrow--light">{motion.hero.eyebrow}</p>
              <p className="motion-hero__name">{motion.name}</p>
              <h1>{motion.headline}</h1>
              <p className="hero__support">{motion.hero.support}</p>
              <a className="button button--accent" href={motion.hero.link.href}>
                {motion.hero.link.label}
              </a>
            </div>
            <div className="motion-product">
              <Image src={motion.icon.src} alt={motion.icon.alt} width={224} height={224} priority />
              <p className="motion-product__descriptor">{motion.descriptor}</p>
              <div className="motion-product__details">
                <p>{motion.platform}</p>
                <p>{motion.releaseStatus}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="section motion-gap">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">{motion.gap.eyebrow}</p>
              <h2>{motion.gap.headline}</h2>
            </div>
            <div className="product-prose">
              {motion.gap.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>
        <section className="section motion-workflow" id="how-it-works">
          <div className="shell product-split">
            <div className="product-heading section-heading">
              <p className="eyebrow">{motion.workflow.eyebrow}</p>
              <h2>{motion.workflow.headline}</h2>
              <a className="text-link motion-tutorial-link" href={tutorial.link.href}>{tutorial.link.label} →</a>
            </div>
            <ol className="workflow-list">
              {motion.workflow.steps.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    {"note" in step && <p className="workflow-list__note">{step.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="section motion-evidence" aria-labelledby="evidence-title">
          <div className="shell">
            <div className="product-split">
              <div className="product-heading">
                <p className="eyebrow">{motion.evidence.eyebrow}</p>
                <h2 id="evidence-title">{motion.evidence.headline}</h2>
              </div>
              <p className="product-lead">{motion.evidence.support}</p>
            </div>
            <EvidenceChain />
            <p className="motion-evidence__closing">{motion.evidence.closing}</p>
          </div>
        </section>
        <section className="section motion-history">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">{motion.history.eyebrow}</p>
              <h2>{motion.history.headline}</h2>
              <p className="product-lead">{motion.history.support}</p>
            </div>
            <div>
              <dl className="product-details">
                {motion.history.items.map((item) => (
                  <div key={item.title}>
                    <dt>{item.title}</dt>
                    <dd>{item.body}</dd>
                  </div>
                ))}
              </dl>
              <p className="product-note">{motion.history.note}</p>
            </div>
          </div>
        </section>
        <section className="section motion-limits">
          <div className="shell">
            <div className="product-heading">
              <p className="eyebrow">{motion.limits.eyebrow}</p>
              <h2>{motion.limits.headline}</h2>
            </div>
            <dl className="product-details product-details--columns">
              {motion.limits.items.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="section motion-privacy">
          <div className="shell product-split">
            <div className="product-heading">
              <p className="eyebrow">{motion.privacy.eyebrow}</p>
              <h2>{motion.privacy.headline}</h2>
            </div>
            <div className="product-prose">
              {motion.privacy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a className="text-link" href={motion.privacy.link.href}>{motion.privacy.link.label}</a>
            </div>
          </div>
        </section>
        <section className="section closing motion-closing">
          <div className="shell">
            <div className="closing__grid">
              <div>
                <p className="eyebrow">{motion.coaching.eyebrow}</p>
                <h2>{site.closing.headline}</h2>
              </div>
              <dl className="product-details">
                {motion.coaching.audiences.map((audience) => (
                  <div key={audience.title}>
                    <dt>{audience.title}</dt>
                    <dd>{audience.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="motion-release">
              <p>{motion.releaseStatement}</p>
              <div className="button-row">
                <a className="button button--ink" href={`mailto:${site.company.contactEmail}`}>Get in touch</a>
                {site.footerNavigation.map((link) => <a className="text-link" key={link.href} href={link.href}>{link.label}</a>)}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </div>
  );
}
