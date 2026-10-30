# Prompt 142: Richmond delivery world and unobstructed phone play

- Date: 2026-10-30
- Scope: platform
- Goal: Implement Richmond Learns to Drive as an independent GIS delivery adventure, including mall/YVR gameplay and clear phone controls.

## Original user request

> CODEX — RICHMOND LEARNS TO DRIVE
> Integrated implementation brief: Richmond, YVR, delivery gameplay, and coordinated GIS Apps integration

The large attached brief requested a connected, real-GIS Richmond game in the
existing Asymmetri repository: driving, parking, walking, four cameras, delivery
economy, local saves, crowds/traffic, optional bounded encounters, usable mall and
airport interiors, airport deliveries and a fictional open airfield. It required
source provenance/licences, immutable reproducible data, truthful coverage,
actual gameplay acceptance, regression/build checks, coordinated GIS Apps
integration and existing guarded release procedures. It explicitly requested an
isolated branch and cross-chat coordination, preserving all unrelated work.

> For Vancouver and Surrey, I find on the iPhone, the main playing view is blocked by multiple sub views... Make sure for Richmond this issue is also addressed

> I am going to be away for about an hour. phone is available and locked. deploy when ready.

The final message explicitly authorizes Richmond deployment after the gates pass.
The locked phone is not physical-device acceptance evidence and remains untouched.

## Scope

Richmond-owned source, immutable OSM-derived data, route, tests, documentation,
and narrow shared registry/sitemap/build-script changes. Existing Vancouver and
Surrey implementations, saves, Motion/Sports/BotSquad, private drafts, unrelated
services and hosting architecture remain owned by their existing workflows.

## Decisions

- Reused only Vancouver's confirmed stable geometry/vehicle helpers; separate
  Richmond simulation, renderer, interiors, population and save namespace.
- Used bounded OSM API imports in EPSG:32610, source-node topology and whole-car
  clearance. ODbL covers the entire derived geographic database; original code
  and procedural art are MIT. Interiors, customers and access systems are fiction.
- Preserved real distances and 33 authored anchors. Bridge heights, unknown
  building heights/façades and sidewalks are explicitly approximate.
- Kept `/labs/richmond`, typed `gisApps.projects`, the approved existing city
  names and routes, and the simplified Labs category menu.
- Phone play has a dedicated viewport, safe areas, controls outside the canvas,
  compact status, and one paused dialog with inert background/focus containment.
- Menus, aerial exploration and hidden tabs pause simulation. Fictional CAD and
  progress are browser-local; no account, telemetry or new backend/dependency.

## Implementation

Eight authored missions and generated offers support pickup, correct inventory,
same-car parking/return, delivery, tips, ratings, cancellation and exactly-once
receipts. Mall shops and both entrances, terminal and operations office, useful
purchases, equipment, four cameras, bounded threats/Gentle Streets, crowd/traffic
budgets, streaming, local saves and explicit Open Airfield are implemented.

Browser acceptance found and corrected narrow-lane parked traffic, furniture-
crossing guidance, omitted pickup approach time, one-way car loops in final
walking guidance, local recovery orientation, bumper separation, dialog focus,
graphics retry canvas reuse and close-counter camera obstruction.

## Engineering impact

Richmond loads its renderer and same-origin map only after Start on its route.
The immutable snapshot is about 55 MB, with 686 detail tiles and a city overview;
large raw caches remain outside Git. Inputs and all 688 declared outputs have
hashes, and independent offline recompiles matched byte-for-byte. No dependency
or lockfile change was needed. Production continues with the approved Node 22
runtime and existing isolated Linux build/whole-runtime rollback workflow.

## Files changed

- `projects/richmond/`: simulation, geometry/navigation, rendering, population,
  interiors, camera, save/UI, tests, importer and project/licence documentation.
- `public/richmond/v0.1-2026-10-30/`: city, detail tiles, manifest and exclusions.
- `app/labs/richmond/`, sitemap, typed content registry and package scripts.
- README and architecture, content, assets, development, testing and handoff docs.

## Documentation updated

The project README provides the geographic/interior matrix, controls, licence
boundaries, assumptions and reproducible commands. `RICHMOND_HANDOFF.md` records
actual acknowledgements, integration history, browser journeys, device context,
limitations and the deployment boundary. Shared docs describe only implemented
routes, data and commands.

## Git diff summary

Implementation: 723 files changed, 9,420 insertions and 15 deletions. Most new files
are immutable geographic detail tiles. Shared changes are narrow, additive and
reconciled with Surrey V0.4; no raw caches or generated builds are committed.

## Verification

- Local Node v24.10.0 matches `.nvmrc`; typecheck/lint passed with the existing
  tutorial navigation warning only.
- Richmond 27, Vancouver 59, Surrey 44 and investment 7 tests passed after the
  final main reconciliation. Next and Vinext production builds passed; audit
  reported zero vulnerabilities. Existing Browserslist/chunk warnings remain.
- Continuous physics tests cover all regional anchors, eight delivery road legs,
  full included runways, mall/terminal/office walks and both mall exits.
- Actual browser: core delivery paid once; mall food pickup, $28 equipment
  purchase, reload and same-car return; Terminal Takeout paid $34; Airport Lunch
  Run paid $36; airport $5 meal/$12 repair purchases; four-camera continuity.
- Actual browser Open Airfield: office gate → apron → about 1.2 km taxiways →
  about 360 m on 08R/26L → stop/walk/same-car return → taxiways/gate/public mode.
  Final cash $59. No direct state injection or camera teleport was used.
- Driving included reverse corrections and bounded local recovery on public
  roads; the airfield excursion used reversing without Recover. Handling is not
  presented as flawless. Full regional journeys were not all repeated in 3D.
- Production phone emulation: 390×843, 844×390, 320×675 large text, tablet and
  desktop; no game-button overlap with phone canvas or horizontal overflow.
  Focus trap/Escape and single inert-background dialogs verified.
- Real context loss/retry and missing-map/retry tested locally with preserved
  state. The original immutable map bytes were restored and hash-verified.
- Mac Brave sampled mostly 58–60 FPS (occasional 53); no physical-phone,
  sustained thermal or battery claim. Optional threat variants/invalid saves
  are deterministic test coverage, not a complete manual browser pass.
- Privacy/credential/private-attachment/prohibited-brand scans and diff checks
  passed. Protected routes, canonicals, tutorial links and GIS discovery passed.
- Exact-source Linux candidate run 41140933816 is in progress at this journal
  checkpoint. Activation must wait for successful artifact verification and
  private candidate checks. Final deployment evidence belongs in the release
  receipt, not an inferred success here.

## Repository state after implementation commit

Branch `codex/richmond-delivery`, based on reconciled main
`9e5f4cad26f426e00c647499cb8b4bf59492ca14`. Implementation is pushed on that branch;
the checkout was clean before this journal. Push the two-commit result to main
without force after rechecking remote advancement. No Richmond runtime has been
activated at this checkpoint.

Coordination tools exchanged scope and decisions with Vancouver, Surrey and GIS
Apps owners. Surrey finished its bounded V0.4 release and returned the window;
Richmond owns the next integration/deployment window. Journal 142 is this record;
143 is provisionally reserved for the release receipt. Vancouver V0.6 and Surrey
V0.5 remain isolated. The current live baseline is Surrey source `0a73d7cc`, with
its full predecessor retained. Fresh release preflight recorded 378,016 KiB
available memory, 11,873,882,112 free bytes, 55 config fingerprints and 13 peer
vhosts; no activation or infrastructure change is implied by that preflight.

## Implementation commits

- `be6fc3bc069cd77b54240846b27166027b333d3b` — Add Richmond delivery adventure, playable YVR and clear phone controls.

## Archive commit

`Record Richmond implementation, phone acceptance and release authorization`

## Lessons learned

Actual journeys catch guidance, traffic, furniture and camera problems that
graph reachability alone misses. Keep physical-device evidence distinct from
viewport emulation. Preserve independent city saves, source hashes, narrow shared
interfaces and serialized releases while neighbouring projects evolve.

## Follow-up ideas

Physical iPhone multitouch/thermal acceptance, smoother tight-junction handling,
broader rendered regional drives, complete localization, smaller initial map
payload and more detailed source-backed architecture remain useful refinements.
