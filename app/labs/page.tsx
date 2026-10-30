import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LabsProjectCards } from "@/components/labs-project-cards";
import { labs } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(labs.metadata, labs.path, "/images/labs-social.png");

export default function LabsPage() {
  return (
    <div className="site labs-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="labs-hero">
          <div className="shell">
            <p className="eyebrow eyebrow--light">{labs.name}</p>
            <h1>{labs.headline}</h1>
            <p className="hero__support">{labs.introduction}</p>
            <p className="labs-hero__open-source">{labs.openSource}</p>
          </div>
        </section>
        <section className="section labs-product" aria-labelledby="labs-projects">
          <div className="shell product-split">
            <h2 id="labs-projects">{labs.projectsHeading}</h2>
            <LabsProjectCards projects={labs.projects} />
          </div>
        </section>
        <div className="shell labs-closing">
          <p>{labs.closing}</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
