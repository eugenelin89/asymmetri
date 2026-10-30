import { LabsProjectCards } from "@/components/labs-project-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions, gisApps } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata = pageMetadata(gisApps.metadata, gisApps.path, "/images/labs-social.png");

export default function GisAppsPage() {
  return (
    <div className="site labs-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="labs-hero">
          <div className="shell">
            <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
              <ol>
                <li><a href={divisions.labs.path}>{divisions.labs.name}</a></li>
                <li><span aria-current="page">{gisApps.name}</span></li>
              </ol>
            </nav>
            <h1>{gisApps.name}</h1>
            <p className="hero__support">{gisApps.introduction}</p>
          </div>
        </section>
        <section className="section labs-product" aria-labelledby="gis-projects">
          <div className="shell product-split">
            <h2 id="gis-projects">{gisApps.projectsHeading}</h2>
            <LabsProjectCards projects={gisApps.projects} />
          </div>
        </section>
        <section className={`section ${styles.reconstruction}`} aria-labelledby="reconstructing-the-city">
          <div className="shell">
            <div className={styles.introduction}>
              <h2 id="reconstructing-the-city">{gisApps.reconstruction.heading}</h2>
              <p className="product-lead">{gisApps.reconstruction.introduction}</p>
            </div>
            <ol className={styles.steps}>
              {gisApps.reconstruction.steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <div className={styles.limits}>
              <h2>{gisApps.reconstruction.limitsHeading}</h2>
              <div className={styles.limitsGrid}>
                {gisApps.reconstruction.limits.map((limit) => (
                  <article key={limit.title}>
                    <h3>{limit.title}</h3>
                    <p>{limit.body}</p>
                  </article>
                ))}
              </div>
              <p className={styles.sourcesNote}>{gisApps.reconstruction.sourcesNote}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
