import { richmond, gisApps } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata } from "@/lib/metadata";
import { RichmondGame } from "@/projects/richmond/Game";
import styles from "@/projects/richmond/richmond.module.css";
export const metadata = pageMetadata(
  richmond.metadata,
  richmond.path,
  "/images/labs-social.png",
);
export default function RichmondPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell">
        <div className={styles.intro}>
          <div>
            <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
              <a href="/labs">Asymmetri Labs</a>
              <span>/</span>
              <a href={gisApps.path}>{gisApps.name}</a>
              <span>/</span>
              <span aria-current="page">Richmond</span>
            </nav>
            <h1 className={styles.title}>
              {richmond.name}
              <span>.</span>
            </h1>
            <p className={styles.tagline}>{richmond.tagline}</p>
          </div>
          <div className={styles.edition}>
            <span className={styles.badge}>{richmond.status}</span>
            <p>
              A fictional courier. A real city.
              <br />
              Your next shift starts around the corner.
            </p>
          </div>
        </div>
        <RichmondGame />
        <noscript>
          Enable JavaScript and WebGL2 to play. The game follows a fictional
          food courier in Richmond. All game money is fictional and progress
          stays in your browser.
        </noscript>
        <section className={styles.notes}>
          <div>
            <h2>Real streets. Your own adventure.</h2>
            <p>
              Explore an OpenStreetMap reconstruction of Richmond and Sea
              Island. The source supplies roads, building footprints, waterways
              and airport surfaces. Heights, façades, road widths and bridge
              elevations include approximations. Buildings load in nearby
              districts.
            </p>
            <p>
              All interactive businesses, customers and incidents are fictional.
              The title describes the fictional protagonist learning city
              driving. Optional encounters never use ethnicity or other
              demographic identity as a risk factor. Gentle Streets disables
              threats.
            </p>
          </div>
          <div>
            <h2>Come inside. Make yourself at home.</h2>
            <p>
              Richmond Centre, the YVR terminal and the airport operations
              office use original walkable interiors. They are not current floor
              plans. Open Airfield is a fictional sandbox available from the
              start; it does not depict real airport access or security
              procedures.
            </p>
            <p>
              © OpenStreetMap contributors. Geographic data is available under
              the{" "}
              <a href="https://opendatacommons.org/licenses/odbl/1-0/">
                Open Database Licence
              </a>
              . Original game code and procedural models are MIT licensed. No
              affiliation with the City, airport, malls or named landmarks is
              implied.
            </p>
            <div className={styles.links}>
              <a href={richmond.source.href}>Source code ↗</a>
              <a href={richmond.manifest}>Map provenance ↗</a>
              <a href={richmond.guide}>Coverage & controls ↗</a>
            </div>
          </div>
          <details id="richmond-controls" className={styles.controls}>
            <summary>Controls, accessibility and text guide</summary>
            <p>
              WASD/arrows move; Shift sprints; Space brakes; F enters/exits the
              car; E interacts. Drag looks around. 1–4 switch cameras; M opens
              the map; O opens orders; R recovers safely. Touch controls are
              visible during play. Menus, aerial surveying and hidden tabs pause
              the shift. Lite Mode, reduced motion, text scaling, north-up
              camera and Gentle Streets are in Settings.
            </p>
            <p>
              Accept an order, park by the marked entrance, enter on foot and
              collect the labelled food at the counter. Return to the same car,
              drive to the customer, park and hand over the order on foot. The
              food-court and airport shops accept fictional CAD. Saves use only
              this browser’s Richmond storage; no account or upload is required.
            </p>
            <p>
              If graphics are unavailable, this guide, source links and the
              website navigation remain usable. Retry graphics in the game panel
              after restoring browser WebGL support.
            </p>
          </details>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
