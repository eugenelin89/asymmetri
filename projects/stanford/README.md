# Stanford Virtual Campus

Independent Stanford explorer at `/labs/stanford`, adapted from the UBC and CWRU campus controls. Original Three.js architecture and sound; source-linked educational avatars; no affiliation with Stanford University. The reference reconstruction is stylized, not photogrammetry or a surveyed digital twin.

## Explore

- WASD/arrows to walk, Shift to run, drag or left/right arrows to turn, V for first/third person, E to interact, M for map. Touch movement/turn/run/interact controls, aerial orbit, full view, photo mode and adjustable quality remain available.
- Search buildings, visit their entrances, request a pedestrian route, or select a map destination. A separate map control reaches the real Redwood City rowing/sailing waterfront; it has not been moved beside campus.
- 32 enterable landmarks include Memorial Church, Main Quad, Hoover Tower, Green Library and Bing Wing, Cantor, Anderson, Bing Concert Hall, Memorial Auditorium, Gates, Huang, Packard, Hewlett, Clark, Peterson, Knight Management Center, Law School, Tresidder, Old Union, Bookstore, Toyon, Branner, Roble, Encina, Maples, McMurtry, Windhover, Dinkelspiel, Mausoleum, Burnham Pavilion, Ford Center and Arrillaga Squash Center. Source outlines surround conservative furnished public cores. Floor guides describe the virtual geometry.
- Branner includes five demonstration bedrooms, shared bathroom doors and a two-stop lift. These are invented circulation/room layouts, not real assignments or access information. Other residences provide interpreted common spaces and rooms. Hoover has a continuous 18-flight route to its viewing deck.
- Twelve outdoor venue groups include Stanford Stadium, Sunken Diamond, Cobb Track, Cagan, Avery, Taube, beach volleyball, golf, Frost Amphitheater, field hockey, softball, and the rowing/sailing center. Practice figures and vehicle/shuttle movements are simulations.

## Campus people and profiles

The checked snapshot contains 823 distinct athletes, 855 team memberships across 32 published roster pages covering 36 varsity programs, 39 faculty, 18 alumni, six historical figures and 515 student records. The NCAA does not sponsor championships for every Stanford varsity program; the coverage manifest distinguishes artistic swimming, sailing, squash and relevant rowing programs. Published 2026, 2026–27 and 2027 season labels are preserved. They are not a claim of live eligibility.

Faculty include Fei-Fei Li, Andrew Ng and Christopher Manning. Avatars use generic appearances and sourced professional descriptions, with fictional movement and bounded educational conversation. Nearby models stream within quality budgets; all named records have virtual walking routes. People are discovered by encounter rather than a location-tracking directory.

Student records include the original 16 LinkedIn excerpts plus all 500 supplied Stanford academic references; one supplied row merges into an existing athlete, leaving 515 student-kind records and one athlete with a student affiliation. All 500 supplied sources were inspected: 498 official Stanford profiles, one personal academic portfolio and one public LinkedIn excerpt. Of 138 supplied completion years, 137 were corroborated; the remaining supplied year was absent from the inspected profile and is labeled uncorroborated. An official-name correction preserves the original supplied spelling and stable character ID. Direct LinkedIn pages were inaccessible. Current enrollment remains unverified, including on public university profiles. No private profile fields, contact details, photos or inferred personal traits are used. Roster and faculty sources are official public pages. See `data/people-sources.json` and `data/roster-coverage.json`.

Visitors can create, edit, recover, report and remove their own public character through the UBC-style profile interface. Stanford has its own API, cookie and private storage namespace; it does not reuse UBC participants. Only submitted public text appears in dialogue.

## Themes and sound

`themes.ts` defines independent overlays and Pacific-time calendar windows. Halloween defaults October 24 through November 7 inclusive. Seasonal saved selections expire November 8. Manual base/Halloween selection and “Use automatic holiday schedule” are available. Christmas reserves December 1–31 but remains unavailable; December currently opens the base edition.

Halloween adds 22 creature types, 24 original procedural comic/manga/robot visitors, interior decorations, moonlight, bats, and an optional hockey-mask pursuer with a prop knife. Pursuit uses outdoor source paths, waits outside interiors, stops short of the player and causes no attacks or damage. Population and reduced-motion controls apply to seasonal movement.

Original Web Audio generates a detuned minor drone, wind, bells, wolf howls and spatial ghost cries/screams. Audio starts on the visitor's Enter/Sound gesture. Mute and volume controls remain visible; base mode fades the soundtrack and hidden tabs suspend it. No downloaded recording, film score, voice imitation or microphone is used.

## Data and asset pipeline

`tools/compile_geography.py` transforms public OpenStreetMap records into the versioned snapshot under `public/stanford/v0.1-2026-10-31/`: 4,581 building parts, 29,635 surfaces, 7,144 trees, 3,291 pedestrian routes, 156 entrances and 3,398 road parts. Source IDs, acquisition hashes, height assumptions and geographic limits are retained. Tree geometry distinguishes mapped Canary Island date palms. Landscape is flat; unmeasured heights and interior/furnishing layouts are interpretations.

`architecture-sources.json` records official descriptions, photo references, observed features and inferred details. References inform original geometry; no source photos, floor-plan scans, university logos or downloaded character art are bundled. Source access restrictions (including temporary Church/Tower closures) do not close the virtual interpretations.

`tools/import_students.py /absolute/path/research.md` imports only Stanford academic columns from the supplied research, deduplicates sources/identities and explicitly discards contact columns. Its bounded source review is recorded in `data/student-import-verification.json`. It does not turn supplied references into independently verified enrollment.

`tools/import_rosters.py` refreshes all official roster pages, aborts on failed imports, deduplicates stable public player IDs and preserves non-athlete records. Review new sources and refresh simulation assets before release.

`tools/compile_seasonal.mjs` prepares collision-checked seasonal, people and navigation layout assets from the complete campus. Its provenance binds them to geography, anchors and geometry code. These are simulated paths, not observed whereabouts. Runtime construction reuses this work; tests verify source hashes and clear routes.

## Local development

Use Node 24 (`.nvmrc`). No dependencies were added. In the repository:

```bash
STANFORD_PROFILE_DIR=/private/tmp/stanford-local-community npm run dev:next -- --webpack --hostname 127.0.0.1 --port 3037
node --test projects/stanford/*.test.mjs
npm run check
npm run build
npm run build:next -- --webpack
npm audit --omit=dev
```

Open `http://127.0.0.1:3037/labs/stanford`. Use a private absolute directory for `STANFORD_PROFILE_DIR`; development storage must not be put under `public/` or committed. Production activation requires a persistent Node filesystem directory, owner permissions and backups. The profile backend inherits the UBC capability-cookie, recovery, ownership, same-origin, rate-limit, moderation and atomic-file safeguards. The route family is `/labs/stanford/community-api/`. A Workers-only deployment needs a separate storage adapter; the existing DigitalOcean Node deployment supports this design.

Keep concurrent campus work in separate validation exports/build directories, not a shared `.next`. Local implementation does not authorize deployment. See `AGENTS.md`, the implementation report and `docs/STANFORD_COMMUNITY_OPERATIONS.md`.

## Shared reviews and private play reporting

The follow-up frontend uses committed shared components: a ready-game session tracker scoped to the explorer and visitor reviews above the footer. The owner subsequently requested removal of the Play privacy panel everywhere, so neither the landing page nor Project information renders that panel or its controls. Existing stored opt-outs, GPC and DNT remain honored by the shared tracker; the shared privacy policy describes the collection. No profile or character identity is sent to the tracker. See [integration and validation](../../docs/STANFORD_COMMUNITY_INTEGRATION_2026-10-31.md); initial campus deployment and this follow-up activation are separate.
