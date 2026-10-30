# Prompt 120: Vancouver V0.3 continuous exploration

- Date: 2026-10-30
- Scope: design
- Goal: Make eastern False Creek continuously drivable and easier to explore, then safely release V0.3.

## Original user request

> VANCOUVER V0.3 — Make the City Truly Explorable
>
> Do not stop at planning. Implement, validate, and deploy autonomously if safe.
>
> Proceed with Vancouver V0.3.

The large request authorized implementation, tests, main commits/push and production
release without ordinary decision approval. It required inspecting live V0.2 and
its documentation; prioritizing road connectivity, visible/collision consistency,
vehicle handling and a continuous route tested both directions; local navigation,
wayfinding, destinations and clear blocked feedback; bounded licensed geography
and honest historic/measured/illustrative height distinctions; an immutable V0.3
snapshot preserving V0.1/V0.2; bridge driving only if reliable across approaches,
elevation, camera and collision; one or two coherent exploration features; mobile
controls/orientation with truthful physical-device limits; meaningful-session
performance and disposal/error checks; preservation of all other Asymmetri pages,
services, redirects, data and configuration; unchanged memory/disk floors and an
independent Linux candidate with full immediate rollback. It requested a final
report of features, tested route, bridge decision, desktop/mobile performance,
screenshots, exact source/build, health/recovery and V0.4 priorities. Keep Vancouver,
Vancouver in Progress and /labs/vancouver. No new backend, tracking, traffic,
pedestrians or large unrelated datasets.

## Scope

Scoped Vancouver engine, UI, geographic snapshot, pure regression tests and
related documentation. Deployment is a separate guarded step; this journal does
not claim it has occurred. No dependency, infrastructure or unrelated page edits.

## Decisions

Use one land-clipped pavement for rendering and tiled collision, keep building
and water exclusion, repair only sub-metre source gaps, and create bounded turning
aprons. Preserve a tiny real junction connector rather than accepting routing
detours. Add a tested local scenic loop, optional normal-physics Cruise and six
roadside destination routes. Keep manual takeover, reverse/reset and nearby
recovery. Route guidance warns when facing away from the path.

Adopt only conservative 2009 LiDAR/2015 footprint height matches with source IDs,
overlap and historic disclosure. Exclude special landmark models and stadium.
Defer newer national geography and elevated bridge driving; improve sampled bridge
visuals without permitting ground cars over water. Retain the original snapshots.

## Implementation

A 2.369 km False Creek circuit, both directions, gold road arrows, local/whole-city
map, turn/remaining/lap feedback, persistent obstruction hints, safe recovery,
120 Hz movement integration and improved chase-camera clearance. The immutable
471,161-byte scene has 241 graph nodes, 282 edges, four small endpoint repairs,
110 illustrative junction aprons, 115 historic LiDAR heights and 321 illustrative
heights. All 436 prior building shapes remain unchanged.

## Engineering impact

One local navigation module, bounded collision cells and route-arrow instancing;
no runtime data API or new dependencies. DOM-only sampled diagnostics are not
transmitted. Phone controls remain pointer-based; keyboard takeover gets focus.
Pause/unmount dispose scene resources. Native bridge elevation remains future work.

## Files changed

Vancouver UI, minimap, engine, scenery, pure physics/navigation and types; new
versioned geographic data and offline generator; extended Vancouver tests;
route/content version and honest data notices; project and repository guides.

## Documentation updated

README, architecture, content, local development, testing, asset manifest,
deployment guidance, project README, third-party notices and the V0.3 release
record describe the actual behavior, provenance, tests, capacity and remaining gates.

## Git diff summary

24 files changed, 968 insertions and 103 deletions. Changes are confined to
Vancouver implementation/data and affected documentation.

## Verification

Node 24.10.0; TypeScript/ESLint pass (one existing tutorial warning); 25 Vancouver
and seven investment tests pass; both Next webpack and Vinext builds pass; npm
production audit zero; diff/privacy/path checks clean; deterministic geographic
regeneration; V0.1/V0.2 digests unchanged. Both loop directions plus lap seams
pass at 15/30/60/120 Hz. All six destination paths have checked full-car clearance.

Actual Brave driving: 490.8 seconds / 5,006.9 m, both loops, zero collisions,
60.0 FPS average, 57 minimum one-second sample, sampled rolling p95 17.3–17.6 ms,
stable 85 geometry / 11 texture counts. Viewports include actual 320/390 portrait,
767 tablet, 844 landscape and desktop. Manual steering/acceleration, braking,
reverse, reset, recovery, pointer pedals, keyboard Cruise takeover, directions,
search, aerial pan/zoom, mode switching, Lite and expanded Escape/focus passed.
Three pause/resume cycles and Labs departure/re-entry removed/recreated one canvas
with stable renderer counts. Browser application errors absent; unrelated extension
warnings excluded. Embedded test browser failed on unchanged V0.2 too; Brave was
the working acceptance environment. No physical-phone, real multi-touch, thermal,
forced WebGL loss or OS reduced-motion-emulation claim.

Production capacity baseline preserved current V0.2. One older redundant V0.1
runtime was losslessly archived, hashed, gzip checked and fully compared remotely
before inactive/source/build/reference rechecks and removal of its uncompressed
copy. This recovered about 976 MiB without changing services or configuration.
Current V0.2, final V0.1 rollback and pre-Vancouver runtime remain complete.

## Repository state after implementation commit

Main; implementation SHA 6a8aa71e1f5bbc03dc4e6c69f3004b1121a470b2. Clean after implementation, one
commit ahead of origin before this journal. A normal push follows this journal.
Production remains V0.2 pending independent Linux candidate and guarded checks.

## Implementation commits

- 6a8aa71e1f5bbc03dc4e6c69f3004b1121a470b2 — feat(vancouver): add continuous scenic driving and local navigation

## Archive commit

`docs(journal): record Vancouver V0.3 development and acceptance`

## Lessons learned

Visible geometry and collision need one source. Very short graph edges can carry
essential intersections. Test the end-to-start lap seam as well as an open route.
Record actual CSS viewport sizes and distinguish renderer resources from heap
profiling, and browser emulation from physical devices.

## Follow-up ideas

Physical iOS/Android testing, broader manual-driving routes, bounded current
footprint/height joins and coordinated elevated bridge approaches.
