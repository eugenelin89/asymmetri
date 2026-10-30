# Vancouver V0.4 — Beyond the Loop

## Scope

The owner authorized autonomous implementation, validation, commits, push and
production release at `/labs/vancouver`, subject to the existing capacity,
isolation and complete-runtime rollback safeguards. Project name Vancouver and
Labs label **Vancouver in Progress** remain. No npm dependencies, backend,
accounts, analytics or runtime geographic requests are added.

## Driving beyond the circuit

Free roam is now the primary start. Three optional manually driven routes add
wayfinding through different streets; leave guidance at any time. Tap a ground
street on the map for a local route, or use arrows and Enter/Space with map focus.
Disconnected starts/ends report a useful notice instead of connecting across
buildings or water. Six landmark roadside routes and the scenic-loop Cruise remain.

The complete ground network audit found 283 source lines / 23.112 km. Its safe
clearance graph covers 22.833 km; the largest component is 21.368 km. That network
already existed in V0.3: this release adds validated routes and usability, not
21 km of new streets. A 1.287 km Moberly/Stamp's Landing pocket and three tiny
cropped components remain separate. No invented road connects cropped endpoints.

110 junction aprons widen from 8.5 to 10.5 m, adding 3,621.1 square metres of
illustrative turning pavement, clipped around retained buildings and water.
Visible roads now render the exact collision-cell polygons, including cell seams.
Lane dashes stop before junctions; crosswalk marks stay inside permitted pavement.
Checked short offsets between parallel approaches, including Manitoba / 1st,
receive a gentle guide instead of two immediate right-angle instructions.

Relaxed pace limits forward speed to about 22 km/h and never steers. Normal pace
retains the previous arcade speed. The optional wide camera improves turn visibility.
Each key/finger owns its press, so releasing one cannot cancel another. Camera
multitouch suppresses accidental landmark selection after a two-pointer gesture.
Blur, backgrounding and offscreen pauses clear velocity, Cruise and held input.

## Manual acceptance

Brave on the local Mac, actual CSS 1800×985, device/renderer DPR 1.3333, default
relaxed pace and wide camera. Ordinary UI key presses controlled acceleration,
steering, reverse and braking; Cruise was false throughout these tests.
Arrival is a roadside tolerance (under 12 m remaining), not an exact endpoint.

| Route | Guide length | Actual manually driven distance | Result |
| --- | ---: | ---: | --- |
| Village backstreets | 1,121.4 m | 1,124.1 m | Arrived; Walter Hardwick, Manitoba, 3rd, Columbia, 4th. Two road-edge collision events after heading drift; one nearby recovery. |
| West-side corners | 737.7 m | 741.8 m | Arrived; 2nd, Crowe, 1st, Wylie. One early-turn curb contact, cleared by manual reversing; no recovery/reset. |
| North shore crescent | 946.3 m | 948.7 m | Arrived; Marinaside curves and Nelson. Thirteen edge-contact events during overlong/early steering; two nearby recoveries plus reversing. |
| North shore crescent, reverse | 946.1 m | 936.0 m | Arrived, zero new collisions, no recovery/reset. Full reverse traversal through the same curves and offset. |

The first three runs are successful traversals with recovery, **not collision-free
acceptance**. The full reverse north shore run separately demonstrates continuous
manual traversal without collisions. Village/West reverse routes pass geometric
full-car-clearance tests, but were not manually traversed end-to-end in reverse.
The measured geometry tests cover all three routes in both directions at every sampled path point;
this does not establish that every street in the entire model is equally drivable.

Combined manual session: approximately 3.75 km travelled, average 59.9 FPS,
48 minimum one-second sample and final rolling 600-frame p95 16.8 ms. The roughly
1,727-second drive-mode duration includes stops while inspecting results. Renderer
geometry/texture counts remained 85/11. These are browser renderer counts, not
whole-process heap or battery measurements. Curb contacts remain a usability limit;
more forgiving steering feedback is a V0.5 priority.

## Geographic data

V0.4 is an immutable 545,239-byte snapshot; city SHA-256:
`23e80e2e65de63f960d9bd8d00931c9d7f6761fc6fb25bfe47db0df31941d1fa`.
All 436 V0.3 building footprints, source road centrelines, water and land are
retained. V0.1, V0.2 and V0.3 remain unchanged. Regeneration from the pinned source
produces byte-identical city and manifest files.

The [NRCan optimized building product](https://open.canada.ca/data/dataset/7a5cda52-c7df-427f-9ced-26f19a8a64d6)
and its [official selective-access documentation](https://nrcan.github.io/CanElevation/optimized_building_footprint/)
provide a public GeoParquet source. The external extractor pins its ETag, checks
HTTP 206/Content-Range and every returned byte range, and enforces a 64 MiB cap.
It transferred 12,211,931 bytes from the 2.415 GB object, narrowed to row groups
416/417 and 372 intersecting records. Raw extract SHA-256:
`109bb8e6542a802fb0f97734fecc03985e25b37fba9672d3f90f55cdad9a3784`.
PyArrow 20.0.0 is optional offline tooling only; production dependencies do not change.

309 records were acquired February 7–19, 2013; 63 June–September 2016 records
have poor extraction quality and are rejected. Only **18 February 2013 LiDAR
maximum roof heights** pass IoU >=0.8, accepted quality, no flags and 3–150 m limits.
Special landmarks/stadium are excluded. Thirteen replace 2009 heights and five
replace estimates. Final totals: **18 NRCan 2013, 102 City 2009, 316 illustrative**.
Per-record IDs, acquisition dates, overlap, quality, horizontal/vertical accuracy
and heights are retained. No footprint or roof geometry is replaced. Maximum roof
height used for an extrusion is not a surveyed flat roof or current building model.

The [City's 2022 LiDAR](https://opendata.vancouver.ca/explore/dataset/lidar-2022/)
was investigated: individual tile downloads range from tens of MB to multiple GB.
No broad LAS import, unverified development-record join or OSM layer was added.
NRCan is newer than the 2009 measurements but remains historical; publication and
retrieval dates are not acquisition dates. Canada and Vancouver Open Government
Licence attribution, licences and raw/output hashes are retained in the public
manifest, page and project notices.

## Bridge and expansion decision

Cambie remains **view-only**. The existing source has ambiguous/multiple approach
lines at the cropped boundary without a trustworthy ground/deck layer, continuous
ramp elevations or a navigation graph that distinguishes crossings from junctions.
Adding car height alone would misrepresent grade separation. Correct work requires
reviewed ramps, vertical car/camera transitions, deck boundaries and a continuous
bridge graph. Water exclusion is unchanged; no endpoint teleport is introduced.
Westward expansion is deferred until current street usability and physical-device
memory/performance are accepted. Neither bridge driving nor Granville Island
coverage is claimed.

## Browser and mobile acceptance

A paired iPhone 16 was listed offline; no connected usable iPhone/Android device
was available. Physical simultaneous multitouch, device GPU performance, thermal,
battery and mobile-browser behavior remain unverified. Desktop viewport checks
must not be presented as hardware tests.

Actual forced WebGL context loss displayed the readable fallback and six-place
information. Both explicit Restore WebGL and Retry 3D recreated a working scene.
The local test controls are gated out of production. Independent simultaneous
input ownership is unit-tested; held on-screen acceleration and keyboard map
routing were exercised through the browser UI. Installed-extension listener
warnings were unrelated to the application.

Actual CSS viewport checks: 320×740, 390×844, 768×1024 tablet, 844×390 landscape
and 1800×985 desktop. No horizontal page overflow; all five landscape driving
buttons were 54×54 CSS pixels and within the viewport. A compact landscape route
panel keeps the car visible. Expanded-view Escape returned focus to its launch
button. Keyboard map routing, free roam, landmark search, reset and held on-screen
acceleration worked. Lite reduced renderer DPR to 1 in this desktop environment.

The old loop completed forward plus 127 m into its next lap, 2,510.8 m total
session travel, zero collisions, 60.0 FPS average / 60 minimum one-second sample
and rolling p95 17.1 ms. The session included 390 px portrait, 320 px expanded and
844 px landscape viewports. Reverse at 768×1024 completed a lap plus 264 m,
2,630.3 m total, zero collisions, 60.0 FPS average / 60 minimum sample, p95 16.8 ms.
Both used DPR 1.3333 and retained 85 geometry / 11 texture counts. These Cruise
checks are separate from the four manually steered route runs above.

The live V0.3 baseline on this Mac sampled 59.7 average FPS / 17.1 ms p95 over
97 seconds and 974 m, with 85/11 geometry/texture counts. Its renderer DPR was 1.6,
so this is not a strictly matched performance comparison. No unacceptable sustained
frame-rate regression appeared in the V0.4 tests, but phone hardware, browser heap,
thermal and battery behavior remain open. The optimized Next build also rendered
and accepted manual driving without application errors; a short startup sample
was 55.1 average FPS / 17.6 ms p95, minimum one-second sample 39 FPS.

Scrolling the scene fully offscreen stopped velocity and Cruise; return did not
resume driving. Three pause/resume cycles removed the canvas (zero) and recreated
one; final overview resources were 69 geometries / 11 textures. Leaving for Labs
removed the canvas and returning recreated it. A native tab-background test was
interrupted by active browser use; do not treat that as a completed backgrounding
or physical-mobile test. Reduced-motion branches were inspected, not OS-emulated.
No application console errors were observed. The optimized build contains no
local WebGL test controls.

## Build and integration gates

Local Node 24.10.0 matches `.nvmrc`; nvm is unavailable. Vancouver's 43 tests pass,
including both Cruise directions at 15/30/60/120 Hz and all three new routes in
both directions geometrically. Seven investment tests pass. The production npm
audit has zero vulnerabilities; TypeScript/ESLint pass with the existing unrelated
tutorial navigation warning. Source/raw/output checksums, immutable older assets,
offline tool compilation, scoped credential/private-path/obsolete-brand scans and
diff whitespace checks pass. After integrating Surrey V0.2 and GIS Apps, both
`npm run build:next -- --webpack` and `npm run build` pass, along with 43 Vancouver,
29 Surrey and seven investment tests. Existing Browserslist-age and Vinext
chunk/classification notices remain. No npm dependency or lockfile changes occur.
The independently built Linux runtime passed candidate and public acceptance;
its exact source and production identity are recorded below.

The independent main checkout avoids changing Surrey's active checkout. Surrey
V0.2 is retained. The coordinated GIS Apps category keeps city/data/source URLs
and uses shared project facts, so Vancouver's V0.4 status and description appear
in its card. No city page becomes a redirect. Release checks explicitly cover the
GIS entry, both games, protected Motion/BotSquad content and all old datasets.
The final local production build passed 14 HTTP route checks and preserved all
24 tutorial assets and protected main content/canonicals/links against live
production. Browser navigation from GIS Apps reached both original city URLs;
its cards display Vancouver V0.4 and Surrey V0.2.

## Capacity and retained runtimes

Fresh serving baseline: Surrey V0.2 source
`52f4451752c2995a7f397a022090a42a821b31a0`, build `kpnCoQ9y6YEz8nDG63G0n`;
7,002,812,416 bytes free disk and 385,716 KiB available memory. Before preparing
another independent candidate, the older V0.3 runtime was archived losslessly to
owner storage. Its source/build were pinned, worktree clean, open-file and
configuration-reference checks empty, gzip verified, SHA-256 matched at both
ends and a complete remote tar comparison passed. Only then was the redundant
uncompressed directory removed. Archive SHA-256:
`be9cd1175bd07d7ea53bfb9db1dcccbf6a33b9b0e870be0d07777c22bc257c69`
(276,060,160 bytes). Free space rose to 8,027,074,560 bytes.

The preceding Surrey V0.2 and Surrey V0.1 full runtimes remain complete. V0.4
activation preserved the entire serving V0.2 tree as its immediate rollback.
Earlier final V0.1 and pre-Vancouver recovery remain retained.
Floors stay 192 MiB available memory and 6 GiB free disk. No OS, Nginx, DNS, TLS,
Node binary or peer service change is part of this release. Source/build/runtime
must remain independent; Mac dependencies are never copied to production.


## Completed production release

Activated **October 30, 2026 at 18:59:32 UTC** (11:59:32 Vancouver time), after
private Linux acceptance. Public URL: <https://asymmetri.co/labs/vancouver>.
The separately authorized GIS Apps grouping is included; its card retains
**Vancouver in Progress**, and both city URLs remain direct pages.

| Identity | Verified value |
| --- | --- |
| Vancouver implementation | `e1b97b6eef9d08d4e3724944bc438e2e0f4c462c` |
| Deployed source / implementation journal | `313dba357ecc00f1de28b8db5d2c326ec9d1125e` |
| Next build | `Zaa4FN3iARR31Yquw4Cij` |
| Linux runtime | Node `v22.23.1`, Next `16.4.3`, Three `0.186.1` |
| CI run / job | [41110651124](https://github.com/eugenelin89/asymmetri/actions/runs/41110651124) / `124251878146`, success |
| Artifact | `13003008184`, `website-linux-candidate` |
| ZIP SHA-256 | `da5f0e1bc2e9066177bd8b242f970173d29464cd17f74c62cb6f8e92f557343f` |
| Runtime tar SHA-256 | `64f23ab2d1b2a4f1412fcf6c90d8de4efa4b0b3f5a3720c30554374d04065d0e` |
| Runtime tar bytes | `254127525`; uncompressed file bytes `896217041` |

Pinned CI actions built the reviewed lockfile on Ubuntu 24.04 with Node 22.23.1
and npm 11.6.0. CI checks, Vancouver tests, production audit and the Next build
(including Surrey prebuild tests) passed. ZIP/tar hashes, safe archive paths,
source receipt, Node version and build ID were independently verified. The exact
source was fetched into a separate application-owned checkout; no live source or
dependencies were overwritten during preparation.

The private port-3107 candidate passed 14 general routes plus Vancouver, all four
immutable Vancouver city/manifest pairs, GIS links/status, Surrey content and all
Surrey data hashes, native Sharp processing, eight protected host checks, 124
existing tutorial IDs and 24 tutorial assets. A separate 14-route comparison
matched protected main content, canonical URLs, links and tutorial assets against
the preceding public site. The candidate process stopped successfully before
activation. Checksums matched again after streaming the Linux artifact to the host.

| Guarded phase | Minimum available memory (KiB) | Minimum free disk (bytes) |
| --- | ---: | ---: |
| Verified older-runtime archival | 364848 | 7002718208 |
| Verified redundant-runtime cleanup | 402796 | 7002669056 |
| Independent checkout | 396984 | 8026902528 |
| Linux artifact extraction | 403220 | 7033110528 |
| Private candidate acceptance | 275704 | 6978588672 |

Every guard exited zero with service identities unchanged. The lowest preparation
memory was **269.2 MiB** and candidate free disk **6.499 GiB**, above unchanged
192 MiB / 6 GiB floors. Activation's before/after readings were 416712/387848 KiB
available memory and 6978576384 bytes free disk. The complete-directory swap took
about 5.6 seconds including health checks; that duration is not a measured external
outage. Only `asymmetri.service` was stopped/started.

Public checks passed on apex and www: 14 routes per host, protected main
content/canonicals/links and all 24 tutorial assets preserved. Thirty additional
HTTPS checks covered GIS/Vancouver/Surrey/Motion pages, access and legacy redirects,
and every Vancouver V0.1–V0.4 city/manifest hash. Browser checks rendered V0.4,
launched West-side corners and drove about 23 m manually without a collision;
GIS links reached both original city URLs. This short public smoke supplements
the full manual route acceptance, not another end-to-end traversal. A short live
sample at CSS 1800×915 / DPR 1.6 recorded 58.5 average FPS and 17.3 ms rolling p95;
it includes startup and is not a mobile benchmark. No application console errors
were observed; unrelated browser-extension listener warnings remain separate.

An independent GIS release verification also reported 16 page checks, 68 tutorial
and city-asset hash checks, four redirects and native browser Labs→GIS→both cities
passing on apex/www. Its separate receipt is owned by the GIS task.

The website is enabled, active/running with zero automatic restarts and no
post-activation journal errors. The old runtime's expected shutdown exit 143 was
recorded separately. All five peer service identities, 13 virtual hosts, 55
configuration hashes and the Node executable hash match the baseline. The
pre-existing inactive/socket-activated gunicorn state was preserved. The first
post-release health reading was 397048 KiB available memory and 6978560000 bytes
free disk. A second check at 19:03:13 UTC retained zero restarts and zero
post-activation errors, with 411420 KiB available memory and 6978441216 bytes
free disk. No Nginx, DNS, TLS, OS, Node binary or peer-service changes occurred.

## Immediate recovery and retained evidence

The complete immediately preceding website remains at
`/var/www/asymmetri-rollback-before-v04-20261030`:
source `52f4451752c2995a7f397a022090a42a821b31a0`, build
`kpnCoQ9y6YEz8nDG63G0n`, including its independent dependencies and build. Clean
source, build identity and executable Next runtime were rechecked. The complete
pre-Vancouver runtime remains recoverable as well. Rollback would restore the
preceding combined website, including Vancouver V0.3 and Surrey V0.2; it would
also revert this release's GIS navigation grouping.

Use the established whole-directory rollback procedure in `DEPLOYMENT.md`: stop
only the website, move the current tree to a fresh diagnosis path, move the verified
rollback tree back to `/var/www/asymmetri`, start the website and repeat protected
route, peer/config and capacity checks. Do not replace only `.next` or mix old
source with new dependencies. Automatic rollback was armed during activation;
no rollback was required or deliberately rehearsed against the live service.

Root-owned receipts remain under
`/var/lib/asymmetri-vancouver-v04-release-20261030`. Owner storage holds verified
Linux ZIP/tar artifacts, the older-runtime lossless archive, source/data receipts,
resource guards, browser metrics and before/after screenshots. Public release
screenshots include `before-desktop.jpg`, `after-desktop-live.jpg`,
`after-routes-live.jpg` and `after-drive-live.jpg`; viewport and manual-route
screenshots are retained separately. They are evidence artifacts, not new site
assets. Documentation commits after this release do not change the deployed
source/build identity above.

## V0.5 priorities

1. Physical iPhone and Android testing: simultaneous touch input, backgrounding,
   context recovery, sustained GPU/frame-time, memory, temperature and battery.
2. More forgiving manual steering feedback and repeated collision-free trials,
   including full reverse Village/West traversals and disconnected-pocket recovery.
3. A source-backed Cambie ground/deck graph, ramps and elevation/camera transitions
   before any bridge traversal is advertised.
4. Bounded newer height/roof processing and only then measured westward expansion.
