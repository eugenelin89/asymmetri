# Prompt 127: Vancouver V0.4 — Beyond the Loop

- Date: 2026-10-30
- Scope: design
- Goal: Expand independently driven city exploration, improve sourced geography and release through the existing safeguards.

## Original user request

> VANCOUVER V0.4 — Beyond the Loop
> Autonomous Development, Testing & Experimental Release
> Proceed autonomously with V0.4. Implement, test and deploy if safe.

The supplied request prioritized auditing the full eastern False Creek street
network, visible/collision agreement, dependable manual driving and recovery,
three meaningful additional routes and bidirectional acceptance where practical.
Cruise could not substitute for manual tests. It requested newer bounded licensed
geography with honest dates and reproducible immutable V0.4 output, retaining all
old snapshots. Cambie driving was conditional on proper approaches/elevation,
grade separation, water exclusion and bidirectional tests; defer if disproportionate.
Physical-phone tests were conditional on actual device/tool availability, with
viewport, multitouch, context-loss, background and performance checks distinguished.
Immersion and westward expansion were lower priority. Preserve existing engine,
React/Next integration, licences, accessibility, fallback and lightweight rendering;
no unnecessary backend, accounts or analytics. Both build paths and relevant tests
must pass. Production authorization required an isolated Linux build, 192 MiB /
6 GiB floors, peer-service preservation and a complete prior-runtime rollback;
no OS/Nginx/DNS changes or deletion of unverified recovery assets. The final report
must give routes/distances, provenance, bridge/mobile/performance limits, screenshots,
source/build identity, production health, rollback and V0.5 priorities.

## Scope

Vancouver engine/UI, offline data tools, a new geographic snapshot, tests and
operational documentation. Shared project facts change only for Vancouver.
Surrey V0.2 and the separately requested GIS Apps category are integrated from
main and preserved. No changes to their game/data implementations, protected
Motion/BotSquad content, runtime dependencies or infrastructure configuration.

## Decisions

- Work in an independent ordinary main checkout because the existing website
  checkout belonged to active Surrey work; no worktree, feature branch or PR.
- Free roam is the primary start. Optional manual route starts and map-selected
  destinations use the existing clearance graph. Cruise remains circuit-only.
- Audit existing connectivity honestly: the largest connected 21.368 km component
  was not newly added. Preserve disconnected pockets/cropped ends rather than
  fabricate connections. Widen 110 clipped aprons and render exact collision cells.
- Relaxed pace limits speed without steering; a wide camera improves visibility.
  Each pointer/key owns its press. Offscreen/blur/background code clears motion.
- NRCan's newer product contains old acquisitions. Accept 18 high-overlap 2013
  LiDAR maximum heights, reject poor 2016 records, retain all footprints and
  label 102 older 2009 heights plus 316 estimates. No current-survey claim.
- Defer bridge driving and westward expansion: reliable elevated approach topology
  and physical-device acceptance remain missing.
- Keep native background interruption and unavailable phone/multitouch/thermal
  testing explicit. Do not equate desktop viewport measurements with hardware.

## Implementation

Three additional routes: Village backstreets (1.121 km), West-side corners
(0.738 km), North shore crescent (0.946 km). Map keyboard/pointer routing,
checked offset smoothing, clearer crossings/dashes, free-roam guidance, pace and
camera controls, independent held input and development-only context-loss controls.
The 545,239-byte V0.4 snapshot adds conservative sourced height joins, a component
audit and wider junctions while retaining prior geographic snapshots unchanged.

## Engineering impact

The same Three.js/WebGL2, client-only local routing and indexed collision remain.
No npm/lockfile/runtime service change. Optional offline PyArrow 20.0.0 supports a
pinned-ETag 64 MiB-capped extractor; actual transfer was 12,211,931 bytes. Public
provenance and separate Canada/Vancouver government-data licences remain explicit.
The final integrated source descends from GIS journal bfed817 and Surrey V0.2.

## Files changed

Vancouver page/project facts; Explorer, MiniMap, engine, input ownership, navigation,
scenery, shared project types and scoped CSS; Vancouver regression suite; NRCan
extractor and V0.4 builder; new city/manifest. No old snapshot bytes change.

## Documentation updated

Root/project README, third-party notices, architecture, content, asset manifest,
local setup, testing, deployment guidance and a detailed V0.4 evidence/limitations
record. All source dates and untested hardware/bridge capabilities are disclosed.

## Git diff summary

25 files changed, 1,151 insertions and 82 deletions. Most additions describe the
new immutable manifest, reproducible processing, source-reviewed tests and release
evidence. This record is excluded from those totals.

## Verification

- Node 24.10.0 matches local .nvmrc; no nvm present.
- Final TypeScript/ESLint pass with one existing tutorial navigation warning.
- 43 Vancouver, 29 Surrey and seven investment tests pass; production audit zero.
- Both optimized Next/webpack and Vinext builds pass. Existing framework notices
  retained. No production deployment from Mac build/dependencies.
- Dataset/manifest regeneration is byte-identical; older snapshots unchanged.
  Source dates/quality, geometry, input ownership and both-direction clearance pass.
- Actual manually steered distances: Village 1,124.1 m; West 741.8 m; North 948.7 m;
  North reverse 936.0 m to the roadside arrival tolerance. The first three runs
  used recovery/reversing after visible edge contacts (2/1/13 events). The entire
  reverse north shore run had zero collisions and no recovery/reset. Other reverse
  routes were checked geometrically, not driven end-to-end manually.
- Manual session approximately 3.75 km, average 59.9 FPS, final p95 16.8 ms, stable
  85 geometry/11 texture counts. Scenic forward/reverse laps and next-lap seams
  separately passed with zero collisions, average 60 FPS and p95 16.8–17.4 ms.
- Actual CSS 320×740, 390×844, 768×1024, 844×390 and 1800×985 had no page overflow.
  Map routing, pointer-held acceleration, Escape/focus, Lite, search, reset,
  offscreen stop and three pause/resume cycles passed. Route leave/return recreated
  one canvas. Forced context loss, explicit restore and Retry worked. Optimized
  build omits test controls. No application console errors.
- Paired iPhone was offline; no usable physical phone. Native tab-background test
  interrupted; reduced-motion inspected only. No battery/thermal/physical multitouch
  or hardware-performance acceptance claim.
- Local optimized HTTP checks: 14 routes, protected main content/canonical/link
  comparison and all 24 tutorial assets match live. GIS cards and both city links
  were followed in the integrated browser build.
- Scoped credential/private-path/obsolete-brand checks and cached diff check pass.
- Fresh production baseline is Surrey source 52f4451 / build kpnCoQ9y6YEz8nDG63G0n.
  Older V0.3 runtime was losslessly archived to owner storage with matching SHA,
  gzip check, full remote tar comparison and clean/inactive/unreferenced checks;
  only then removed in uncompressed form. Live and immediate Surrey V0.1 rollback
  remain complete. Free disk recovered to 8,027,074,560 bytes; floors unchanged.
- Exact-source Linux build, candidate activation and public acceptance are pending
  at this implementation checkpoint and will receive a separate release receipt.

## Repository state after implementation commit

Main, clean after implementation, one commit ahead of origin/main bfed817.
The independent checkout preserves concurrent work. This journal is the only
new tracked change after the implementation commit.

## Implementation commits

- e1b97b6eef9d08d4e3724944bc438e2e0f4c462c — feat(vancouver): release V0.4 free-roam routes and sourced geography

## Archive commit

`docs(journal): record Vancouver V0.4 implementation and acceptance`

## Lessons learned

A zero-collision controller loop does not prove free manual exploration. Record
real route traversal separately, including contacts and recovery. Wider visible
pavement must share the exact collision geometry. New publication dates do not
make historic heights current. Concurrent city/category work needs one integrated
main release and serialized server capacity/activation operations.

## Follow-up ideas

Physical iOS/Android input and thermal profiling; clearer steering/edge feedback;
more manually accepted streets; newer bounded acquisitions and roof models;
proper Cambie deck/approach graph before further geography expansion.
