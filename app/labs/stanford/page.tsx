import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata } from "@/lib/metadata";
import { stanford } from "@/content/stanford";
import { Campus } from "@/projects/stanford/Campus";
import { places } from "@/projects/stanford/registry";
import coverage from "@/projects/stanford/data/roster-coverage.json";
import styles from "@/projects/stanford/campus.module.css";
export const metadata = pageMetadata(stanford.metadata,stanford.path,"/images/labs-social.png");
export default function StanfordPage(){return <div className={styles.page}>
  <SiteHeader />
  <main id="main-content" tabIndex={-1} className="shell">
    <div className={styles.intro}><div><nav aria-label="Breadcrumb"><a href="/labs">ASYMMETRI LABS</a> / <a href="/labs/gis">GIS APPS</a> / STANFORD</nav><h1>{stanford.name}</h1><p>{stanford.tagline}</p></div><span className={styles.edition}>{stanford.status}</span></div>
    <Campus />
    <div className={styles.notes}>
      <section><div className={styles.statLine}><span>WALK · THIRD PERSON · AERIAL · MAP</span><span>STANFORD, CALIFORNIA</span></div><h2>Follow the palms.<br />See what opens.</h2><p>Enter the sandstone arcades of the Main Quad. Find the reading rooms in Green Library, climb Hoover Tower, step inside Memorial Church, and explore Stanford’s art, music, engineering and athletics. The campus includes {places.filter(p=>p.interior==="B").length} building reconstructions with walk-through interiors, plus outdoor venues.</p><p>Meet educational avatars of Fei-Fei Li, Andrew Ng, Christopher Manning and other faculty, famous alumni, and athletes from the published varsity rosters. Create your own public character and let other visitors meet it, using the same profile and conversation controls as UBC.</p><p>Student cameos draw on public academic profiles, LinkedIn education excerpts and the supplied research list. Source checks vary by record; current enrollment is unverified. All appearances and walking routes are simulated.</p><p>Halloween brings moonlight, ghosts, jiangshi, yōkai, monsters, comic superheroes, manga characters and robots. Its automatic season is October 24–November 7. The base campus returns afterward, and either edition can be selected at any time. A future Christmas edition is reserved for December.</p></section>
      <section><h2>Real references.<br />Room to explore.</h2><p>Original geometry draws on campus maps, building photographs and public room descriptions. These are detailed interpretations, not surveyed digital twins. Interiors, furnishing positions and avatars remain stylized; no real person’s location is tracked. Real-world access restrictions are independent of virtual access.</p><details><summary>Building guide and architectural sources</summary><ul>{places.map(p=><li key={p.id}><strong>{p.name}</strong> — {p.description} <a href={p.links[0].url} target="_blank" rel="noopener noreferrer">Official information ↗</a></li>)}</ul><a href="/stanford/v0.1-2026-10-31/manifest.json">Geographic provenance and licences ↗</a></details><details><summary>Varsity roster coverage · {coverage.uniqueAthletes} athletes</summary><p>{coverage.competitionNote}</p><p>Every imported athlete has a virtual walking route; nearby avatars are streamed within crowd limits. Seasons below are the labels published by Stanford, including forthcoming seasons. This is a dated roster snapshot.</p><table><thead><tr><th>Published team / season</th><th>Athletes</th></tr></thead><tbody>{coverage.teams.map(t=><tr key={t.sport}><td><a href={t.source} target="_blank" rel="noopener noreferrer">{t.team} · {t.season}</a></td><td>{t.count}</td></tr>)}</tbody></table></details></section>
    </div>
    <noscript><p>JavaScript and WebGL2 are required for the 3D campus. The destination guide and source links remain available above.</p></noscript>
  </main><SiteFooter />
</div>}
