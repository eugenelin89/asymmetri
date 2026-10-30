# Vancouver V0.3 — experimental release, October 30, 2026

## Scope and decision

The owner authorized scoped implementation, main commits/push and guarded public
release at `https://asymmetri.co/labs/vancouver`. Project name **Vancouver** and Labs
menu **Vancouver in Progress** remain. This record distinguishes tested source
from production activation; the release identity and final gates are recorded below
when activation completes. No dependencies, backend, accounts or tracking added.

## Driving and navigation

V0.2 used a narrow analytic centreline collision corridor separately from visible
pavement. Its blocked state cleared on the first stationary frame, hiding the
reason for a stop. V0.3 generates visible pavement and indexed 64 m collision
cells together, preserving building and water exclusion. Four endpoint repairs
are below 0.75 m; 110 illustrative round junction aprons provide turning room.
All 436 V0.2 building shapes and old water geometry remain unchanged.

Vehicle integration uses <=1/120 s substeps (0.1 s stall cap), stronger predictable
low-speed steering, speed reduction during hard turns, persistent blocked reasons,
a checked nearby recovery and a chase camera whose clearance tests land/buildings
instead of requiring the camera itself to remain over pavement.

A 241-node, 282-edge ground graph with 2.6 m clearance drives local routing.
Retaining the short 2.6 m Ontario / 1st junction connector prevents a long detour
and turnaround. The **2,368.584 m False Creek loop** follows Athletes Way,
Columbia, W 1st, Quebec, Terminal, Main, E 2nd and Ontario. Both directions and
transition into the next lap pass full-car collision tests. Optional Cruise feeds
the same real steering/acceleration/braking, never teleports along a spline, and
manual driving input takes over. Cruise is offered only for the accepted circuit.

Gold road arrows, turn prompts, remaining distance and lap feedback make the route
visible. The minimap defaults to nearby streets, with Whole city toggle, position
and numbered places; bridges are dashed/view-only. All six destinations have
local routes to safe roadside stops. A waterfront attraction may be off the road.

## Geography and bridge decision

V0.3 is an independent immutable 471,161-byte snapshot with pinned parent/raw
source/output hashes in its manifest; V0.1 and V0.2 remain byte-identical.
115 building heights use the City's [2009 LiDAR dataset](https://opendata.vancouver.ca/explore/dataset/building-footprints-2009/),
`hgt_agl`, only when spatial intersection-over-union with retained 2015 footprints
is >=0.8 and heights are 3–150 m. Per-part record IDs and overlap remain inspectable.
Special landmark models and the stadium are excluded; 321 heights remain
illustrative. These are mixed-date historic approximations, **not current survey
measurements**. The bounded download is 905,334 bytes / 915 records. OGL–Vancouver
attribution, dataset notice, licence and reproducible offline command are retained.

The newer [NRCan optimized building-footprint product](https://open.canada.ca/data/dataset/7a5cda52-c7df-427f-9ced-26f19a8a64d6)
and its [selective GeoParquet access](https://nrcan.github.io/CanElevation/optimized_building_footprint/)
were investigated. No large national/provincial dataset was imported. Matching
current acquisition dates, roof massing and coverage is a bounded V0.4 follow-up.

Cambie visuals now subdivide the deck so long water spans stay level instead of
sloping between shore endpoints; land ramps are smoothly approximated. **Bridge
driving is deferred.** The source lines do not provide a reliable elevated,
grade-separated approach network; car height, camera and deck collision would
need coordinated reconstruction. Flat ground-only collision remains enforced.
The [City's Cambie upgrade material](https://vancouver.ca/streets-transportation/cambie-street-bridge-upgrades.aspx)
was consulted; visual elevation is still illustrative.

## Verification

- Node 24.10.0 matches local `.nvmrc`; no nvm installation was present.
- 25 Vancouver tests pass, including both loop directions and next-lap seam at
  15/30/60/120 Hz, visible pavement/tile seams, recovery, retained snapshots,
  height joins, collision exclusions and all six destination paths.
- Seven investment tests pass; production npm audit reports zero vulnerabilities.
- TypeScript/ESLint pass with the existing unrelated tutorial navigation warning.
- Brave on the local Mac: forward loop plus next 158 m completed after 245.4 s
  driving mode, 2,524.4 m travelled, zero collisions, 60.0 FPS average / 57 minimum
  one-second sample; rolling 600-frame p95 17.6 ms. Initial desktop CSS viewport
  1800×1021, DPR 1.6. Both directions together: 490.8 s, 5,006.9 m, zero collisions,
  60.0 FPS average, 57 minimum sample, 17.3–17.6 ms sampled rolling p95. Reverse
  completed one lap and 92 m into the next. These are actual rendered driving
  sessions using the optional controller, not a manually steered entire loop.
- Responsive checks measured **actual CSS dimensions** (the browser's zoom made
  requested emulation dimensions differ): 320×740, 390×844, 767×1024 tablet,
  844×390 landscape, and 1280×900 desktop. No horizontal page overflow. Expanded
  phone/landscape view, map toggle, Lite and rotation worked during reverse drive.
  Lite sampled DPR 0.8 in that viewport environment. No physical-device claim.
- Driving held 85 renderer geometry / 11 texture counts across both loops;
  sampled draw calls 34–56. Three pause/resume cycles removed the canvas entirely
  and recreated one, with identical 69 geometry / 11 texture counts in aerial
  view. Leaving for Labs removed the canvas; returning recreated one cleanly.
  Counts concern renderer resources, not a complete browser-heap leak profile.
- Manual acceptance: held acceleration plus steering, deliberate road-edge stop,
  persistent blocked reason at rest, nearby recovery, reverse gear, braking,
  reset, pointer-held pedals/release, Cruise keyboard takeover without extra
  focus click, destination guidance including facing-away instructions, nearby
  start, landmark search, aerial keyboard pan/wheel zoom, mode switching and
  expanded-view Escape/focus return passed.
- No application browser errors were observed. An unrelated installed extension
  emitted listener warnings. Embedded-browser rendering/input failed on both
  unchanged production V0.2 and local V0.3 during this session, so actual V0.3
  visual/interaction acceptance used Brave. V0.2's earlier embedded-browser idle
  baseline was about 60 FPS / 40 calls; differing environments prevent a strict
  matched performance comparison.
- Reduced-motion branches are retained by inspection. Physical multi-touch,
  battery/thermal performance, OS reduced-motion emulation and forced WebGL
  context-loss recovery were not exercised in this release.
- Both `npm run build:next -- --webpack` and `npm run build` pass. Existing
  Browserslist-age and Vinext chunk/classification notices remain; no dependency
  changes were made. Dataset regeneration is byte-identical. Scoped credential,
  private-attachment-path and obsolete-brand scans and `git diff --check` pass.
  Production acceptance is recorded separately after activation.

## Capacity, preservation and recovery

Initial V0.3 preflight: clean V0.2 source `7990eabe022aed0ed28b477b07bc2d9ad457e1d6`,
build `LgdQfEvDuIcwEAl6_yxWS`, 6.409 GiB free disk and 401.3 MiB available memory.
The older redundant original V0.1 runtime (`a27af82`, build
`vX6ln8E9nzEy5RzvDLV6n`) was losslessly archived to owner storage, SHA-256 checked,
gzip verified and fully compared against remote tar contents/metadata. Only after
clean identity, inactive/open-file and configuration-reference checks was its
uncompressed directory removed, recovering 1,023,193,088 bytes. The full current
V0.2, final V0.1 rollback and pre-Vancouver runtime remain on-server. Archive digest:
`a3ab660688123094ce659a414585730d87e75ecd6d1ad9acf332d3f4ec68577d`.

The independent exact-SHA Linux candidate must pass guarded checkout/extraction,
private loopback acceptance, native image optimization and protected route checks
before activation. Floors remain 192 MiB available memory and 6 GiB free disk.
The swap stops only the website and retains the entire previous V0.2 runtime;
a failed activation restores it. Five peer service identities, 55 configuration
hashes, 13 peer vhosts and the Node binary are compared. No OS/Nginx/TLS/DNS or
unrelated service change is included.

## Remaining limits and V0.4

The accepted circuit is a bounded route, not proof that every historical street
junction is ideal for manual driving. Flat terrain, simplified shoreline and
mixed-date building geometry remain. No walking, traffic, pedestrians or bridge
traversal. Prioritize physical iOS/Android input, thermal/performance profiling,
broader manual-drive routes, newer bounded measured geography, then elevated
bridge approaches. Viewport testing is not physical-phone testing; forced GPU
context-loss recovery must not be claimed without an actual test.
