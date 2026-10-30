// SPDX-License-Identifier: MIT — Vancouver-specific route; see projects/vancouver/LICENSE.
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { vancouver } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { VancouverExplorer } from "@/projects/vancouver/Explorer";
import { places } from "@/projects/vancouver/places";
import styles from "@/projects/vancouver/vancouver.module.css";

export const metadata = pageMetadata(vancouver.metadata, vancouver.path, "/images/labs-social.png");

export default function VancouverPage() {
  return <div className={styles.page}>
    <SiteHeader />
    <main id="main-content" tabIndex={-1} className="shell">
      <div className={styles.intro}>
        <div><div className={styles.breadcrumb}><a href="/labs">Asymmetri Labs</a><span>/</span><span>A city, in progress</span></div><h1 className={styles.title}>{vancouver.name}<span style={{ color: "var(--brand-bright)" }}>.</span></h1><p className={styles.tagline}>{vancouver.tagline}</p></div>
        <div className={styles.edition}><span className={styles.badge}>{vancouver.status}</span><span>A small slice of the waterfront.<br />Plenty more city to come.</span></div>
      </div>
      <VancouverExplorer />
      <noscript><section className={styles.notes}><div><h2>Explore the places</h2><p>JavaScript is needed for 3D navigation. These descriptions and sources remain available.</p>{places.map((place) => <article key={place.id}><h3>{place.name}</h3><p>{place.detail}</p><a href={place.url}>{place.source}</a></article>)}</div></section></noscript>
      <div className={styles.notes}>
        <section><h2>A city experiment, just getting started.</h2><p>Explore from the air or try arcade driving on flat streets. Walking, bridge driving, traffic, historical layers and proposed developments are not included yet. Granville Island and the rest of Vancouver are outside this first area.</p><p>This is an independent Asymmetri Labs experiment, unaffiliated with the City of Vancouver or any political party. It is not a current survey or a navigation tool.</p><a href={vancouver.source.href}>Explore the source ↗</a></section>
        <section><h2>Real geography. Honest limitations.</h2><p>Building footprints are from 2015; heights are illustrative. Terrain is flat. The simplified 2002 shoreline is supplemented by park polygons. Street widths, road-clearance trims, promenade, models and trees are artistic approximations. Source data was retrieved on 30 October 2026.</p><details><summary>Data, credits and open-source licences</summary><p>Contains information licensed under the <a href="https://opendata.vancouver.ca/pages/licence/">Open Government Licence – Vancouver</a>.</p><ul>
          <li><a href="https://opendata.vancouver.ca/explore/dataset/building-footprints-2015/">Building footprints (2015)</a></li>
          <li><a href="https://opendata.vancouver.ca/explore/dataset/public-streets/">Public streets</a></li>
          <li><a href="https://opendata.vancouver.ca/explore/dataset/parks-polygon-representation/">Park polygons</a></li>
          <li><a href="https://opendata.vancouver.ca/explore/dataset/shoreline-2002/">Shoreline (2002)</a></li>
          <li><a href="/vancouver/v0.2-2026-10-30/manifest.json">Dataset provenance and checksums</a> · <a href="/vancouver/v0.2-2026-10-30/city.json">Download scene data</a></li>
        </ul><p>Vancouver code and original models: MIT. Three.js: MIT. No third-party photos, fonts or model downloads. No OpenStreetMap data is included in this release.</p><p>Design research: <a href="https://github.com/dAAAb/ai2033.taipei">AI2033 Taipei</a>, <a href="https://github.com/mrdoob/slop-newyork">Slop New York</a> and <a href="https://github.com/bounce12340/chiang-wanan-policy-island">Taipei Policy Islands</a>. Vancouver uses an original implementation.</p><a href={vancouver.license.href}>Full licence and third-party notices ↗</a></details></section>
      </div>
    </main>
    <SiteFooter />
  </div>;
}
