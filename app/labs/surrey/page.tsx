import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { surrey } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { SurreyAdventure } from "@/projects/surrey/Adventure";
import styles from "@/projects/surrey/surrey.module.css";
export const metadata = pageMetadata(
  surrey.metadata,
  surrey.path,
  "/images/labs-social.png",
);
export default function SurreyPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell">
        <div className={styles.intro}>
          <div>
            <div className={styles.breadcrumb}>
              <a href="/labs">Asymmetri Labs</a>
              <span>/</span>
              <span>Play something unexpected</span>
            </div>
            <h1 className={styles.title}>
              {surrey.name}
              <span>.</span>
            </h1>
            <p className={styles.tagline}>{surrey.tagline}</p>
          </div>
          <div className={styles.edition}>
            <span className={styles.badge}>{surrey.status}</span>
            <p>{surrey.description}</p>
          </div>
        </div>
        <SurreyAdventure />
        <noscript>
          <p>
            Enable JavaScript and WebGL2 to play. Walk with WASD or arrows,
            sprint with Shift, interact with E, and recover with R. The mission
            follows a fictional stolen backpack from a commuter near Surrey
            Central to its return. V toggles aerial exploration; F centres the camera on the player. A second fictional homicide case uses evidence and witness accounts. Progress is saved only in this browser.
          </p>
        </noscript>
        <section className={styles.notes}>
          <div>
            <h2>Real streets. Fictional stories.</h2>
            <p>
              All characters and incidents are invented. This game is not a
              claim about the safety of Surrey neighbourhoods, real-world
              navigation or public-safety advice. People experiencing
              homelessness are neighbours with their own stories, not a danger
              category. The cast and player are fictional adults. The stories include non-graphic homicide, theft and scams. Optional mature dialogue mentions sex work and drugs; no sexual acts, purchases or graphic violence are depicted. Mature Encounters is off by default, and Gentle Streets suppresses threats.
            </p>
            <p>
              A compact City Centre slice includes Surrey Central, the bus loop,
              Central City, SFU Surrey, City Hall, Civic Plaza, the library and
              Holland Park. V0.3 adds source road surfaces, curbs, medians and park
              paths. Height units are verified as metres and matched to official
              records; measurement dates and methods remain unknown. Architecture
              is an artistic reconstruction. Terrain remains flat because the
              elevation datum could not be verified. No City
              endorsement is implied.
            </p>
          </div>
          <div>
            <h2>Built to explore. Open to everyone.</h2>
            <p>
              Contains information licensed under the{" "}
              <a href={surrey.dataLicence}>
                Open Government License – City of Surrey
              </a>
              . Geographic sources were retrieved October 30, 2026. Original
              game code and procedural models are MIT licensed.
            </p>
            <div className={styles.links}>
              <a href={surrey.source.href}>Source code ↗</a>
              <a href={surrey.manifest}>Map sources & processing ↗</a>
              <a href={surrey.license.href}>Licences ↗</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
