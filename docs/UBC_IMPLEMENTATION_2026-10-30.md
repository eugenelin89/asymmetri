# UBC Virtual Campus — implementation and acceptance report

Date: October 30, 2026, America/Vancouver. Candidate: V0.1 research preview.

**A substantial application is implemented, but the flagship V2 acceptance
standard has not been reached.** Automated navigation and source-integrity checks
pass. After the user enabled browser access, desktop and responsive walkthroughs
found and resolved entrance, Nest-envelope, guide-proximity and field-shadow issues.
Twenty-five real browser/scene captures are retained. Physical-device testing and
architectural-fidelity acceptance remain outstanding. No production deployment was performed.

## A. Project implementation

Repository: `https://github.com/eugenelin89/asymmetri`, independent local checkout
`/Users/eugenelin/Documents/ChatGPT/Vancouver/ubc-virtual-campus`, branch `main`.
The existing `richmond` and `surrey-v03` checkouts were inspected but not edited.
Both were on active development branches. The UBC checkout was cloned from the
canonical repository, verified clean on main, and fast-forward synchronized before editing.

| Location | Responsibility |
| --- | --- |
| `app/labs/ubc/page.tsx` | Server-rendered route, metadata, source and accessible visitor guide |
| `projects/ubc/Campus.tsx`, `campus.module.css` | Responsive explorer, modal information, search, map, controls and dialogue |
| `projects/ubc/engine.ts` | Three.js scene, first-person/aerial input, ray selection, environment, LOD and lifecycle |
| `projects/ubc/spatial.ts` | Local coordinate transforms, spatially indexed building collision, floor/ramp support, connected source routing |
| `projects/ubc/architecture.ts` | Four original public-interior/exterior assets, collision, stairs, furniture and displays |
| `projects/ubc/stadium.ts` | Field, mound, bases, dugouts, bullpens, netting, grandstand, press box and floodlights |
| `projects/ubc/scenery.ts`, `people.ts` | GIS context, instanced source-position trees, original stylized simulated population |
| `projects/ubc/registry.ts`, `types.ts` | Places, characters, topics, source links, verification, permissions and explicit reconstruction status |
| `projects/ubc/environment.ts` | Seasons, Vancouver civil time and NOAA solar approximation |
| `projects/ubc/tools/` | Dependency-free, source-pinned offline compiler and integrity tests |
| `public/ubc/v0.1-2026-10-30/` | Compact data, geographic anchors and provenance manifest |
| `public/ubc/preview-map.svg` | Original vector preview derived from the same GIS data; not a screenshot |

The route and GIS Apps card follow the established Asymmetri design, metadata and
hosting boundaries. No new npm dependency, backend, account system, analytics,
visitor tracking, external AI call, payment or persistent dialogue storage was added.

Reuse audit: Vancouver supplies established patterns for immutable GIS snapshots,
footprint rendering and independent input ownership. Richmond's source was inspected
for collision, interiors and metre-space navigation. Surrey's scene resource disposer
is directly imported; its existing disposal test still passes. The new pedestrian,
interior, registry and lighting modules remain UBC-owned, suitable for later reuse
after browser acceptance. Existing city engines and published snapshots are unchanged.

### Data, transformation and licences

The seven imported layers come from [UBC Open Geospatial Data](https://github.com/UBCGeodata/ubc-geospatial-opendata),
pinned at commit `885732d332a20a59143f655c83fb15e1367ebe4d`: buildings, entrances,
hard landscape, soft landscape, trees, pedestrian routes and roads. The repository's
category README files declare PDDL 1.0. Each raw file's URL, digest, size and licence
evidence is retained in the public manifest. No source editor names or email
metadata are included in the visitor payload.

Source coordinates are WGS84. All features use one local UTM zone 10N metric space,
x east and z south, with origin `[-123.245,49.26]`. The stdlib compiler implements
the transverse-Mercator series on GRS80; it treats WGS84 positions as NAD83 without
an epoch adjustment. This can introduce metre-scale datum differences. Centimetre
storage precision is not a claim of centimetre accuracy. Geometry retains polygon
holes and multipart identity. Terrain remains flat.

The public building metadata defines `BLDG_HEIGHT` as metres from grade to the
highest roof point. 600 polygon parts use that source field, with measurement
dates/methods unknown; five use labelled floor-count estimates. No unlicensed
ArcGIS height layer was imported. Tree species are retained when recorded; 588
records have no species identification, and their species remain explicitly unknown.
The data classifies 2,773 trees as evergreen. Missing tree heights are illustrative.

Official 2026 [campus maps](https://planning.ubc.ca/about-us/campus-maps) were
checked during research. Public photographs and historical drawings informed the
original models; no third-party images or meshes are shipped. Code/models are MIT;
the GIS snapshot remains under its separate PDDL terms. No UBC logo or voice/portrait
likeness asset is included. Full rights notes are in `projects/ubc/THIRD_PARTY_NOTICES.md`.

## B. Implemented geographic coverage

The snapshot includes 605 completed-building polygon parts, 6,070 landscape polygons,
9,324 tree locations, 6,103 outdoor route lines, 1,450 current entrance points and
213 road centre lines. Requested WGS84 bounds are `[-123.263,49.244,-123.224,49.277]`.
Intersecting source features are retained whole, rather than clipped at that boundary.
Under-construction and pre-construction building records are omitted.

Detailed original geometry is concentrated in the baseball precinct and four
priority architectural destinations. The remainder is GIS-derived background
context, with simplified facades and source maximum heights. Source coverage does
not mean every building is recognizable at architectural-survey fidelity.

| Place | Geographic evidence and present state |
| --- | --- |
| West 16th start | Source sidewalk route 2306, **49.254536518, −123.241133961**, approximately 20 m north of the East Mall/W16 roundabout. Collision-clear in the compiled world; current physical access is not field-surveyed. |
| Tourmaline West | Home-plate clay-circle centre inferred from hardscape 970, **49.256111870, −123.240391429**. Mound surface 974 establishes south-southwest orientation. Field outline 3658 and bullpen surfaces 3669/3672 are retained. Detailed components are reconstructed. |
| Rose | Source building VBL10237 and primary-entrance record; original timber/net training interior and interpreted facade. |
| Sauder | Source Henry Angus VBL10067; lobby and taller rear academic mass. Powerhouse is described as construction with expected 2027 completion, not shown as finished. |
| Bookstore | Source VBL10065; interpreted glazed frontage, retail interior and rear mass. |
| AMS Nest | Source VBL10407; interpreted central atrium, timber forms, suspended study lounge and supported galleries. The navigable envelope is 76 m wide to avoid overlap with the neighbouring Alumni Centre. The original footprint remains in map/source data. |
| Main academic campus | Continuous source roads, paths, buildings and trees. Most architecture remains simplified. |
| Rose Garden | Garden/parkade context information point; the elevated garden and detailed planting are not reconstructed. |

The rendered stadium uses a conventional 18.44 m pitching distance. Source surface
circle centres are approximately 17.94 m apart, so the exact plate position and
field dimensions remain reconstruction evidence, not an independent survey.
Source-aligned road markings are illustrative, not lane surveys.

## C. Working interiors

All four are genuine navigable 3D environments with physical door openings,
fixture/wall collision and normal exits. **All are Level B; none is claimed as Level A.**

| Interior | Implemented public spaces | Automated physical evidence |
| --- | --- | --- |
| Rose Indoor Training Centre | Four net cages, pitching equipment, two mounds, timber frame, screens, turf, lights and circulation | Walk through entrance, reach all four cages and information point, leave normally |
| UBC Bookstore | Book aisles, apparel fixtures, supplies tables, checkout/service counters and lighting | Walk between fixtures, reach all three information displays, exit; actual-source orientation checked |
| AMS Nest | Ground atrium, two upper galleries at 5/10 m, visible stairs, guarded edges, suspended study lounge/bridge, tables and food areas | Continuous ascent, upper circulation, railing check, descent and exit |
| Henry Angus/Sauder | Selected public-lobby interpretation, furniture and program information | Enter, reach display and leave; rear/upper mass is closed |

Public Bookstore plans are historical; AMS's public amenities map documents more
levels than this preview models. Furniture, public-space arrangement, roof forms
and facade details are representative. Oriented geographic envelopes are used
for custom models; they do not reproduce every indentation of the source footprint.
The Nest uses a reduced central envelope rather than its full bounding rectangle,
which would overlap the Alumni Centre. Ten source trees inside the four model
envelopes are omitted from rendering to keep reconstructed interiors clear; the
immutable GIS dataset retains those records. This does not assert that real trees
should be removed or that the reconstructed envelope is the final architecture.
The custom doorway is clear but does not necessarily coincide exactly with the
recorded entrance point. No identical interiors are generated for unknown buildings.

## D. Interactive characters

Both mandatory guides pass automated placement/movement checks and browser discovery,
visible-label, E activation and curated-response checks. They stop and face visitors
within six metres, avoiding the earlier problem of walking away during activation.

| Guide | Source verification and conversation |
| --- | --- |
| Dr. Greg Werker | Current [faculty profile](https://www.sauder.ubc.ca/people/greg-werker): Senior Associate Dean, Student Experience; Lecturer, Operations and Logistics. The leadership list's older “Students” wording is documented. Ten curated topics cover teaching, OR, management science, Sauder programs, mathematics, statistics, healthcare optimization, analytics, facilities and sources. |
| Dr. Benoit-Antoine Bacon | Official biography/indexed text and the [September 2026 welcome](https://president.ubc.ca/communications/2026/09/08/welcome-back-message-from-dr-benoit-antoine-bacon-2/) corroborate the 17th President/Vice-Chancellor role. Curated topics cover welcome, research/university overview, prospective international students, student life and exploration. |

The registry includes identity, category, title, institution, department, source URLs,
verification date, model, label, zone, virtual routes, behaviour, topics, biography,
permissions, disclaimer and status. It supports named and fictional categories.
The population renderer creates additional fictional visitors and indoor shoppers.

Original stylized capsule characters have articulated walking limbs, pauses and
obstacle/crowd checks. No portrait textures, photorealistic likeness, cloned voices,
real schedules or live positions are used. Dialogue is third-person educational
content, with session-only history and follow-ups. Free text selects reviewed topics;
unsupported requests receive uncertainty and official links. No actual person is
represented as participating or endorsing the project.

Population remains a simple simulation. It does not yet provide high-quality
skinned animation, comprehensive cycling/seated activity, full stair navigation
for crowds or realistic all-campus activity density.

## E. Information and hyperlinks

The directory contains priority places, both guides and all named imported building
records (deduplicated by building ID). Major models and information boards support ray selection; near objects
provide E/tap interactions. Bookstore displays link to course materials, apparel
and stationery. Nest displays link to food, study rooms and clubs. Sauder, stadium,
Rose, Beaty, libraries and official map links are included.

External links use an HTTPS host allowlist, reject credentials and unsafe schemes,
and open with `target="_blank" rel="noopener noreferrer"`. The simulation state
remains in its current page. No stock, prices, live booking or live occupancy is invented.
Official destinations were opened through source research. The library and some
president pages may present anti-bot/browser-verification responses, so their
ordinary-browser behaviour remains an acceptance item rather than a claimed dead link.

Internal actions include information selection, virtual Visit entrance, map display,
directory filtering and connected walking routes. The route graph excludes known
building-interior source lines and rejects edges intersecting current collision
geometry. Disconnected routes return a notice, not a fabricated direct path.
Route endpoints snap to nearby source vertices; short entrance approaches may require
free walking. This is simulation guidance, not real accessibility advice.

The UI includes touch controls, accessible button names, focus handling, a modal
focus trap, keyboard topics, reduced motion and a server-rendered no-WebGL guide.
Browser checks covered on-screen movement holds, direct 3D Nest selection, Bookstore
apparel and Nest study displays, search, Escape dismissal and initial modal keyboard
focus. At 390 × 844, 767 × 1024 and 1440 × 900 CSS-pixel views there was no horizontal
overflow. A 300-pixel probe exposes the existing site's 320-pixel minimum width.
Physical touch devices and screen readers remain untested. One external-source click
kept the campus state, but the in-app browser did not expose a separate destination
tab; normal-browser new-tab behaviour remains to be checked. HTTPS destinations and
security attributes are verified separately from that browser limitation.

## F. Visual and environmental quality

Implemented rendering features include physically based materials, original
grain/noise textures, ACES tonemapping, antialiasing, directional soft shadows,
physical-scale geometry, glazed fronts, timber structures, batched furniture,
instanced tree canopies and distant building proxies. Stadium floodlights and
interior lighting respond to the environment. Four seasons, rainy winter and optional
snow, fog/clouds, wet pavement and Vancouver solar timing are selectable.

Real evidence is in [the browser validation gallery](validation/ubc/README.md), with
hashes, dimensions and capture provenance in its manifest. PNGs are actual WebGL
exports read from the visible photo preview, with no UI or developer overlays.
JPEGs show browser interactions; some retain in-app viewport padding and the Next
development indicator. They are not generated concept artwork.

Captured views include the West 16th spawn, home plate, grandstand, golden hour,
night lighting, Rose, Bookstore, Nest atrium and upper gallery, Sauder exterior/lobby,
both guide interactions, route map, all four seasons and rainy/snowy winter.
The shadow-striping defect visible in the initial stadium walkthrough was corrected
by fixing field winding/normals and excluding layered turf/clay from casting shadows.
The final browser log contained no warnings or errors.

**These images do not meet the requested flagship realism benchmark.** Vegetation,
characters and background facades are visibly procedural, and landmark massing is
approximate. Snow colours lawns/background roofs and trees but does not yet accumulate
on all bespoke roofs, stadium turf or furniture. Exact-reference comparison, a
specific Main Mall composition, and close-up mound/dugout/bullpen evidence remain
outstanding. No photorealism or full architectural accuracy is claimed.

## G. Testing and unresolved limits

| Check | Result |
| --- | --- |
| `npm run test:ubc` | 17 passing Node tests, including stadium walkthrough, integrated sourced geography, all four interiors, Nest stairs, guide movement, safe URLs, curated dialogue, solar timing, collision and routing |
| Python source-data suite | Five passing integrity tests: hashes, counts, projection axes/inverse, polygon rings/holes, anchors, privacy and route exclusions |
| Existing GIS regression suites | Vancouver, Surrey and Richmond passed; existing city engines and data unchanged |
| `npm run check` | TypeScript and lint pass; one pre-existing `tutorial-reader.tsx` navigation warning outside this scope |
| Next production build | Passed, including `/labs/ubc` and protected existing routes |
| Vinext production build | Passed; existing large-bundle warning remains, including Three.js-related code |
| `npm audit --omit=dev` | Zero reported production dependency vulnerabilities |
| Local HTTP | `/labs/ubc` returned HTTP 200; data/anchor availability checked separately |
| Browser walkthrough | Rose entrance/hall/exit, Bookstore entrance/aisle/exit, Nest entrance and both upper gallery ascents, Sauder entrance/lobby, stadium field/home plate/grandstand, both guides, map route and information displays exercised |
| Responsive and screenshots | 25 captures; desktop, tablet and 390 CSS-pixel mobile-width checks; on-screen movement, keyboard dismissal, quality, reduced motion and marker controls exercised |
| Browser rendering sample | Final Auto sample at Sauder: 60 FPS, 513 draw calls, 1,740,385 triangles at 1440 × 900 CSS pixels. A Low-setting transition sample read 31 FPS/304 calls/712,531 triangles. These are instantaneous UI observations, with a panel open, not sustained walking benchmarks or hardware certification |
| Physical iOS/Android hardware | Not tested |

The automated tests use actual generated collision geometry and continuous movement,
not teleport-only assertions. They found and fixed a Bookstore doorway-column clash
at the actual geographic orientation. The stadium test walks around its real model
barriers rather than disabling collision to reach targets.

Browser testing additionally found and fixed exterior arrival direction, duplicate
directory records, neighbouring geometry intruding into the Nest, indoor tree
clipping, guides leaving during interaction, out-of-view dialogue answers, duplicate
facade signs, a removed Three.js shadow mode, the preview-image loading warning and
field self-shadow striping. Regression assertions now cover the actual Nest approach
and first stairs against neighbouring GIS buildings, nearby guide pauses and upward
field normals. Full Nest descent/exit, every cage, mound/dugout/bullpen traversal and
all displays are automated geometry evidence; they are not all claimed as completed
manual browser journeys.

The renderer delays startup until requested and uses geographic vegetation groups,
material batching, architecture proxies and quality-dependent resolution/shadows.
It **does not yet implement full geographic asset streaming, compressed glTF/KTX2
pipelines or production crowd LOD**. Source geometry and all four detailed assets
are constructed on startup. These are performance limitations to measure, not
unverified capabilities to advertise.

## H. Local availability and deployment

Local development was served on `http://127.0.0.1:3026/labs/ubc`; HTTP readiness
was verified. The owned preview process is stopped at task teardown. Restart it
from the checkout with:

```sh
npm run dev:next -- --port 3026 --hostname 127.0.0.1
```

The code follows the existing Next/DigitalOcean and Vinext/Sites deployment paths.
Production was not deployed, restarted or reconfigured. The current site and other
city applications remain unchanged. A production release should follow the existing
candidate validation and rollback procedure after browser acceptance.

## I. Five highest-value next improvements

1. Complete remaining physical-device and sustained walking benchmarks, external
   new-tab checks and reference comparisons; use them to set visual/performance budgets.
2. Add a licensed elevation surface and accurate grade/entrance transitions, with
   one verified vertical datum across paths, buildings, landscaping and interiors.
3. Replace minimum-rectangle landmark envelopes with surveyed/reference-aligned
   architectural meshes, prioritizing stadium structures, Rose and the West 16th approach.
4. Refine Bookstore/Nest/Sauder public layouts against usable current references,
   add documented accessible vertical circulation, and improve materials/lighting.
5. Implement true geographic/interior streaming and compressed asset LOD, then
   improve vegetation and animated crowds within measured desktop/mobile budgets.

Phase status: Phase 0 has concrete source/architecture outputs. Phases 1–3 have
implemented interactive candidates, passing automated movement tests and substantial
browser validation, but remain below production visual/fidelity acceptance. Phase 4 supplies geographic
context, not detailed campus-wide architecture. Phases 5–6 remain future work.
