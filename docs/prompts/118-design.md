# Prompt 118: Vancouver V0.2 autonomous overnight improvements

- Date: 2026-10-30
- Scope: design
- Goal: Improve the live city, driving and UX, then safely release V0.2.

## Original user request

> VANCOUVER V0.2 — Autonomous Overnight Improvement & Release

The owner supplied a detailed mission and explicitly authorized scoped code,
tests, commits, main pushes and production deployment when safety checks pass.
The request directs autonomous decisions while the owner sleeps: inspect V0.1 in
a real browser and capture desktop/mobile baselines; noticeably improve eastern
False Creek's low-poly city, recognizable landmarks, materials, lighting,
vegetation, streets and water; improve acceleration/braking/reverse, steering,
chase camera, collisions, spawns/reset and keyboard/touch driving; investigate
old footprint/road conflicts without disabling collision. Bridge traversal is
optional and may remain restricted. Improve onboarding, modes, HUD/markers,
place navigation, immersion, mobile layouts and failure states. Review GPU
cleanup, mount/unmount, context recovery, input and frame-rate/resolution behavior.
Keep the bounded dataset, distinguish measured sources from artistic estimates,
preserve licensing and create a new immutable data version if changed. Avoid
heavy/unlicensed assets, new backend complexity and speculative optional features.

Preserve Motion/Sports, privacy/support/tutorial, BotSquad services, navigation,
assets and all other hosted sites. Follow repository workflow, approved SSH and
isolated Linux builds; verify exact revisions, clean trees, dependencies,
capacity and complete recovery. Never relax resource floors, upgrade the OS,
change Nginx/unrelated services or delete necessary recovery assets. Deploy only
a validated candidate; otherwise keep V0.1 live and report the exact blocker.
Keep Vancouver's name, URL and “Vancouver in Progress” submenu. Verify real browser
controls, resize/expansion, driving, cleanup, 320/390/768px overflow, performance,
accessibility and unrelated routes. Do not claim physical-phone tests unless
performed. Provide before/after screenshots, improvements, defects fixed,
validation/performance, exact release identity/URL/health, limits and V0.3 priorities.

## Scope

Vancouver modules, separate V0.2 data, version copy and affected documentation.
No dependencies, shared layouts, backend services, footprint expansion, traffic,
pedestrians, bridge driving or infrastructure changes.

## Decisions

Use original procedural models/textures and restrained materials. Keep source
centrelines and all 436 building parts; trim 24 street-clearance overlaps by
1,922.8 m², clipping pavement to existing land. Use full-body collision sampling,
short substeps and spatial bins. Validate every landmark spawn with forward
clearance. Defer elevated roads; preserve water and building collisions.

Choose a portable full-window dialog after native fullscreen immediately exited
in the embedded browser. Add keyboard focus/Escape, Lite and six accessible place
summaries. Throttle HUD updates, stop hidden/offscreen animation, recreate scenes
after errors and dispose GPU resources on unmount. Use the existing off-host Linux
artifact process; preserve the 192 MiB/6 GiB floors and complete V0.1 rollback.

## Implementation

Varied windowed facades/roofs, crossings/sidewalks/lamps, mixed trees, water details,
recognizable dome/green roof/wetland/island/bridge structures and a detailed car.
Smooth arcade steering, brake-before-reverse, damped camera, safe nearby starts,
street/speed/gear HUD, minimap, quick viewpoints and numbered place markers.
A separate 276,986-byte V0.2 snapshot retains parent/source digests and clear
artistic disclosures. V0.1 remains byte-identical.

## Engineering impact

Rendering remains route-local. No new runtime API, tracking or dependency.
Merged/instanced scene parts, static shadows, bounded/adaptive pixel ratio and
explicit disposal limit rendering work. Recovery preserves source-backed text.
The deployment is authorized but has not occurred at this journal commit.

## Files changed

Vancouver engine/UI/physics/styles/types/tests, new scenery and SVG minimap,
offline refinement, two V0.2 geographic files and version/disclosure copy.

## Documentation updated

Project README/notices and root README; architecture, content, assets, local
workflow, testing and deployment guides describe actual features and boundaries.

## Git diff summary

23 files changed, 1,020 insertions and 378 deletions. Changes stay within the city
experience and its documentation/version references.

## Verification

TypeScript/ESLint passed with one existing tutorial navigation warning. All 13
Vancouver and seven investment tests passed. Offline derivation reproduced the
same bytes and passed topology/trim/retention guards. Production audit: zero
vulnerabilities. Next webpack and Vinext production builds passed; existing stale
Browserslist/chunk-size advisories remain. Diff and targeted secret/private-field
scans passed; dependency locks and V0.1 data are unchanged.

Real browser: aerial selection/search and movement, nearby spawn, simultaneous
acceleration/steering, brake/reverse/reset, expansion/Escape, Lite, pause/resume,
three repeated scene disposals, and route exit (zero canvases)/return (one canvas).
320/390/768px viewports have no horizontal overflow. Optimized desktop sample:
60 FPS, 80 draw calls, 114,421 triangles at DPR 1.6; mobile-width Lite driving:
60 FPS, 38 calls at DPR 1. No current optimized browser errors/warnings.
These are desktop browser samples, not physical-phone benchmarks. Forced WebGL
context loss has not been executed; the recovery path was reviewed in code.

## Repository state after implementation commit

Main at the implementation SHA below, clean before this journal, ahead of remote.
Implementation and journal will be pushed normally for isolated Linux CI.

## Implementation commits

- 38c48ede984dcc00054277f14fed1e0fbb7cf568 — Improve Vancouver city scenery, driving and exploration for V0.2

## Archive commit

Record Vancouver V0.2 overnight implementation decisions

## Lessons learned

Car-body clearance and safe initial direction matter more than center-point
collision alone. Remove fixed precision before buffering overlays to avoid
collapsed geometry. Verify actual fullscreen behavior and use a portable fallback.
Old runtime disk usage can include shared hardlinks; unique storage determines
capacity recovered by archival. Preserve full checked archives before removal.

## Follow-up ideas

Physical-phone profiling, junction/collision feedback, measured heights and
current footprints, then separately modeled bridge elevations. These are V0.3
candidates, not promises in this release.
