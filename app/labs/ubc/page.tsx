import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata } from "@/lib/metadata";
import { ubc } from "@/content/site";
import { Campus } from "@/projects/ubc/Campus";
import { places } from "@/projects/ubc/registry";
import styles from "@/projects/ubc/campus.module.css";
export const metadata = pageMetadata(
  ubc.metadata,
  ubc.path,
  "/images/labs-social.png",
);
export default function UbcPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell">
        <div className={styles.intro}>
          <div>
            <nav aria-label="Breadcrumb">
              <a href="/labs">ASYMMETRI LABS</a> /{" "}
              <a href="/labs/gis">GIS APPS</a> / UBC
            </nav>
            <h1>{ubc.name}</h1>
            <p>{ubc.tagline}</p>
          </div>
          <span className={styles.edition}>{ubc.status}</span>
        </div>
        <Campus />
        <div className={styles.notes}>
          <section>
            <div className={styles.statLine}>
              <span>FIRST PERSON · THIRD PERSON · AERIAL · MAP</span>
              <span>9 ENTERABLE RECONSTRUCTIONS</span>
            </div>
            <h2>A university, open to your imagination.</h2>
            <p>
              Begin at the UBC entrance letters on University Boulevard and
              Wesbrook Mall. Walk onto the virtual baseball field, explore the
              Rose training hall, browse the Bookstore and visit the Student Nest.
              See Beaty’s suspended blue whale, descend to its collection gallery,
              and explore the study spaces at Irving K. Barber Learning Centre.
              Meet people naturally as you explore and start a conversation to
              learn who they are. At Orchard Commons,
              explore eight fictional demonstration bedrooms, shared bathrooms,
              a lounge and study area.
            </p>
            <p>
              UBC Vancouver is on the traditional, ancestral and unceded
              territory of the Musqueam people.
            </p>
          </section>
          <section>
            <h2>Real geography. An evolving reconstruction.</h2>
            <p>
              This independent preview combines official UBC GIS data with
              original procedural architecture. Campus terrain uses a flat datum;
              interior heights and layouts are reference-based interpretations.
              Virtual access does not grant real-world access. This is not an
              official UBC project.
            </p>
            <details>
              <summary>
                Sources, coverage and accessible destination guide
              </summary>
              <ul>
                {places.map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong> — {p.description}{" "}
                    <a
                      href={p.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official information ↗
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/ubc/v0.1-2026-10-30/manifest.json">
                GIS provenance and licences
              </a>
            </details>
          </section>
        </div>
        <noscript>
          <p>
            JavaScript and WebGL2 are needed for 3D exploration. The destination
            guide and official source links remain available above.
          </p>
        </noscript>
      </main>
      <SiteFooter />
    </div>
  );
}
