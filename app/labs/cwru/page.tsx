import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata } from "@/lib/metadata";
import { cwru } from "@/content/site";
import { Campus } from "@/projects/cwru/Campus";
import { CampusPrivacyPreferences } from "@/projects/campus-analytics/PlaySession";
import { ReviewSection } from "@/projects/campus-reviews/ReviewSection";
import { places } from "@/projects/cwru/registry";
import styles from "@/projects/cwru/campus.module.css";
export const metadata = pageMetadata(cwru.metadata,cwru.path,"/images/labs-social.png");
export default function CwruPage(){return <div className={styles.page}>
  <SiteHeader />
  <main id="main-content" tabIndex={-1} className="shell">
    <div className={styles.intro}><div><nav aria-label="Breadcrumb"><a href="/labs">ASYMMETRI LABS</a> / <a href="/labs/gis">GIS APPS</a> / CASE WESTERN RESERVE</nav><h1>{cwru.name}</h1><p>{cwru.tagline}</p></div><span className={styles.edition}>{cwru.status}</span></div>
    <CampusPrivacyPreferences compact />
    <Campus />
    <div className={styles.notes}>
      <section><div className={styles.statLine}><span>WALK · THIRD PERSON · AERIAL · MAP</span><span>CLEVELAND, OHIO</span></div><h2>University Circle, one doorway at a time.</h2><p>Begin beside Kelvin Smith Library. Explore Tinkham Veale’s glass commons, the sculptural Peter B. Lewis Building, the historic chapel and Adelbert Hall. Step into a lecture hall, a makerspace, and a demonstration residence suite. Meet faculty, athletes and students on simulated walks through their academic districts.</p><p>The Halloween edition fills campus paths with 16 kinds of wandering creatures and costumes: hopping jiangshi, ghosts, skeletons, witches, monsters, comic heroes, manga-inspired characters, robots and mecha. Moonlit skies, pumpkins and cobwebs complete the scene. Switch it on or off in Atmosphere.</p></section>
      <section><h2>Real places. A careful reconstruction.</h2><p>Source-mapped geography and original architectural models create an independent virtual campus. Public maps, floor plans and descriptions guide the details. Selected interiors are enterable interpretations; this is not a surveyed digital twin. People’s appearances, dialogue and movements are simulated.</p><details><summary>Buildings, sources and accessible destination guide</summary><ul>{places.map(p=><li key={p.id}><strong>{p.name}</strong> — {p.description} <a href={p.links[0].url} target="_blank" rel="noopener noreferrer">University information ↗</a></li>)}</ul><a href="/cwru/v0.1-2026-10-31/manifest.json">Geographic provenance and licences</a></details></section>
    </div>
    <noscript><p>JavaScript and WebGL2 are needed for the 3D campus. The building guide and source links remain available.</p></noscript>
    <ReviewSection campus="cwru" campusName="CWRU" />
  </main><SiteFooter />
</div>}
