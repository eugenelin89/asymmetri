# Prompt 139: Surrey V0.4 — Living Surrey

- Date: 2026-10-30
- Scope: platform
- Goal: Ship a more convincing living Surrey with preserved saves, compact phones and a complete third investigation.

## Original user request

> Inspect the current project, implement substantial playable improvements, validate them, and ship the strongest safe V0.4 release possible.

The owner's detailed V0.4 brief requires the renamed **Surrey, City of Adventure**
to retain its route, Three.js engine, fixed extent, geographic snapshots, two
existing cases, encounters, saves and clear Street/Aerial controls. Investigate the
2025 DEM datum using bounded official evidence; retain an explicit flat fallback
if the datum remains unverified. Improve architecture and street detail, introduce
a saved day/night clock and lightweight purposeful pedestrian schedules, add a
complete adult missing-person mystery with multiple approaches and endings,
refine consequences, sound and mobile usability, and validate browser playthroughs,
migration, performance and all relevant builds/tests. Release through the guarded
Linux workflow with a complete immediate rollback and protected peer services.
The earlier phone obstruction report remains an acceptance constraint. Physical
phone testing must never be claimed from desktop viewport emulation.

## Scope

Surrey modules, public route/registry, new provenance receipts and affected docs.
Vancouver, Motion, BotSquad, shared geometry predicates and published geographic
snapshots remain unchanged. Richmond and Vancouver V0.6 remain isolated.

## Decisions

Fresh metadata does not establish the 2025 DEM vertical datum/geoid/accuracy;
bounded numeric access is possible but cannot resolve that uncertainty. Keep flat
ground and retain exact new request hashes. Use shared window masks and emissive
materials rather than per-lamp dynamic lights. Keep a readable night fill and
optional stable daylight. Preserve the compact direction pad and on-demand phone
panels, with safe-area spacing. Schema3 retains the old storage key and explicitly
migrates validated v2 progress. The third case respects an adult's autonomy;
misleading sightings require corroboration. Jo's limited trust affects a safe
robbery distraction without introducing a complex economy.

## Implementation

Saved day phases and speed/rest controls; lightweight role schedules, clear routes,
crossing waits and idle/threat states; night facade/lamp/shop lighting and original
procedural detail; muted-by-default performer synthesis; complete Missing Person
witness/paper routes and privacy/reunion rewards; encounter opening variants and
evening mature eligibility; continuous camera sightline clipping, overlay pause,
phone safe areas and deduplicated GPU resource disposal.

## Engineering impact

One renderer, bounded population, adaptive pixel ratio, shared geometry/materials,
distance updates and explicit audio teardown. No dependency, account, telemetry,
paid API or external runtime data service. New mission data is strictly validated;
old money, cases, inventory, evidence, location and settings remain intact.

## Files changed

Surrey simulation, save, scene/materials, population, camera and UI modules; new
clock, missing-case, audio and resource-disposal modules; route and centralized
metadata; new V0.4 release/terrain manifests. No published city bytes changed.

## Documentation updated

Project/root READMEs, changelog, notices, architecture, testing, content, assets,
deployment guidance and the V0.4 release record describe behavior and limits.

## Git diff summary

33 files changed, 1025 insertions and 114 deletions. Most additions are the new
case/clock/population behavior, focused tests and exact terrain evidence receipts.

## Verification

44 Surrey, 59 Vancouver, 7 investment and 3 reconstruction tests passed. Typecheck
and lint pass with one pre-existing tutorial navigation warning. Production audit
has zero vulnerabilities. Next and Vinext builds pass; diff whitespace is clean.
Browser: completed the new witness/privacy route, reached Riley by real walking,
recovered to the station and returned for $60; completed the original backpack
pursuit/return at night for $35; discovered Case02. Reload restored $115, closed
Cases01/03, active Case02, three items and witness notes. Actual CSS390×844,
320×567 and844×390 had no horizontal overflow; touch-button hold did not scroll.
Forty view switches stabilized at110 geometries/45 textures after warmup; sampled
58–60fps and no browser errors. Physical devices remain untested.

## Repository state after implementation commit

Isolated branch `codex/surrey-adventure-v04`, based on approved main965d5b9.
Implementation committed cleanly before this journal. Richmond handed over a
bounded main/server release window and journal139; Vancouver acknowledged.
No production activation yet. Fresh baseline preserves runtime44654b3 and complete
rollback, with55 config hashes,13 peer virtual hosts and sufficient staging space.

## Implementation commits

- `9a05ff4` — Bring Surrey to life with day-night streets and a third investigation.

## Archive commit

Record Surrey V0.4 implementation and acceptance decisions

## Lessons learned

Test the actual long walk around the mall, not only state transitions. Small source
samples do not establish a vertical datum. Keep phone status panels behind Menu,
check legacy save migrations explicitly, and serialize shared production releases.

## Follow-up ideas

Physical multi-touch/thermal acceptance and an authoritative 2025 vertical-datum
report. More measured facade references and transit movement can follow separately.
