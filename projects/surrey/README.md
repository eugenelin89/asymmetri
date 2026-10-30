# Surrey, City of Adventure V0.2 — Dangerous Streets

**Survive the streets. Discover the stories.** A fictional third-person adventure
and aerial city explorer at `/labs/surrey`, using the unchanged 1.31 × 1.45 km
City of Surrey geographic snapshot. Every character and incident is invented;
this is not a real crime map or a statement about neighbourhood safety.

[Play](https://asymmetri.co/labs/surrey) · [V0.2 release record](../../docs/SURREY_V02_RELEASE_2026-10-30.md) · [V0.1 release / recovery record](../../docs/SURREY_RELEASE_2026-10-30.md)

## Play and controls

Use Node 24 from `.nvmrc`, the installed lockfile and `npm run dev:next`.
Select **Play Now**, or **Continue Game** when this browser has a valid save.
WebGL2 is required. No account, backend, paid API, analytics or upload is added.

| Input | Adventure | Aerial Explore |
| --- | --- | --- |
| WASD / arrows | Camera-relative walk | Pan city |
| Shift | Sprint, consuming stamina | — |
| Drag | Rotate follow camera | Orbit |
| Right drag / two fingers | — | Pan; pinch zooms |
| Wheel / zoom buttons | Camera distance | Zoom |
| V / visible mode button | Switch to aerial | Back to Adventure |
| F / Return to Player | — | Centre camera on exact player position |
| E | Interact | Disabled |
| M | Toggle mini-map extent | Toggle mini-map extent |
| Escape | Pause / close overlay | Pause / close overlay |
| R | Safe station recovery | Disabled |

Touch directional controls pan in aerial mode; visible orbit/zoom buttons provide
alternatives to gestures. Follow Player and Free Explore share one scene, renderer
and animation loop. Aerial mode freezes walking, mission/encounter clocks and NPC
activity. A distinctive YOU marker uses the actual player position. Landmark
selection and journal pins set waypoints, never teleport the player. Undiscovered
evidence is not revealed from the air. Camera transitions interpolate unless
reduced motion is requested. Hidden/offscreen/inactive scenes stop rendering.

Expanded view, menus, dialogue and journal have focus boundaries. Choices require
explicit button selection; E does not silently choose an outcome. Lite reduces
pixel ratio and disables shadows. Reduced motion suppresses bob/swing and camera
smoothing. Gentle Streets suppresses threats. Mature Encounters is **off by
default** and enables only optional, non-explicit adult dialogue about sex work
and drugs. There are no sexual acts, drug transactions or graphic violence.

## Two complete cases and street stories

**Welcome to Surrey:** meet Alex, inspect the transit slip, recover the backpack
through a bounded pursuit or help from Sam and Jo, and return it for $35. Failure
allows retry; recovery preserves quest progress. The V0.1 pickpocket remains.

**The Surrey Central Mystery:** inspect the sealed scene, gather five clues and
interview Nina, Idris and Rowan. Compare the unreliable watch, clock log and C17
paperwork; the red paint is misleading. The journal records evidence and discovered
leads. Return to the scene to submit a theory after at least three clues and two
witnesses. An inconclusive/unsupported report pays $10 and permits further inquiry;
a corroborated conclusion pays at most $75 total, including any earlier stipend.
No body is depicted. The fictional cart kiosk is not an actual business allegation.
The case can be investigated before or after the backpack mission.

Six data-driven encounters supplement the original pickpocket: a robbery demand
(pay/refuse/flee/help/distract), a stolen portfolio with bounded chase or victim/
witness assistance, optional adult solicitation with decline/question/leave choices,
an optional dealer proposition with refusal/report/inquiry choices, a seeded
charity collection that may be sincere or fraudulent, and a community wallet/
directions interaction. Cooldowns and a 60-second post-recovery grace period avoid
immediate repeated threats. Rewards occur once per type. Mature dialogue does not
make sex workers, homelessness, poverty or substance use automatic danger signals.
All cast members and the player are fictional adults.

## Save and resume

`asymmetri.surrey.save.v2` is a versioned localStorage record, written during play,
after decisions, on pause/visibility changes and teardown. It preserves both cases,
clues, inventory, health/stamina/money, safe player position, settings, cooldowns
and seeded runtime state. No record leaves this browser. Saves are origin-specific:
apex and www do not share them. New Game asks before replacing a valid save;
clearing site data also removes progress. Invalid/incompatible records are ignored
and retained until a new game replaces them. Restricted/quota-full storage shows a
notice and play continues without guaranteed persistence. Restore validates enums,
allowlisted items, finite ranges and map/version, then safely relocates invalid
geometry positions. Aerial framing itself resets around the saved player.

## Architecture and performance

- `data.ts` / `world.ts`: bounded same-origin map contract, full-body clearance,
  sliding collision, movement substeps, safe recovery and bounded A* navigation.
- `simulation.ts`: pure seeded state, both cases, encounter choices and timers.
- `story.ts` / `encounters.ts`: authored clues, witnesses, verdicts and event data.
- `save.ts`: versioned serialization boundary, validation and failure-safe storage.
- `camera.ts`: bounded aerial orbit/pan/zoom/follow mathematics.
- `population.ts`: sidewalk-parallel routes, pauses, separation and threat reactions.
- `scenery.ts` / `landmarks.ts`: original procedural landmarks and shared rounded
  person geometry, source-backed labels and reference provenance.
- `engine.ts`: one Three.js renderer/loop, input, shared scene, camera transitions,
  visibility suspension, adaptive DPR, autosave and complete GPU/event disposal.
- `Adventure.tsx`, `Journal.tsx`, `MiniMap.tsx`, CSS: responsive HUD, explicit
  choices, evidence, discovered leads, compass and visible touch controls.

React receives 150 ms snapshots rather than frame updates. Ambient pedestrians are
bounded to 10 on coarse-pointer devices or 18 otherwise. Distant aerial pedestrians
are culled; labels are decluttered and rendered at readable screen size. Environmental
objects use instancing where applicable, and people share geometry/materials.
Vancouver supplies only existing geometry predicates. Its renderer, controls,
vehicle state and snapshots are unchanged. No dependency or network service added.

## Geography and provenance

Snapshot: `public/surrey/v0.1-2026-10-30/`. The manifest records exact queries, raw
SHA-256s, retrieved counts, output hash/size, bounding box, coordinate transform,
source metadata dates where available and processing limitations. 786 clipped
building parts, 199 road lines, 637 sidewalk source features, nine park parts,
26 source rail features and 35 signals were retrieved October 30, 2026.

Seven bounded City endpoints supply roads, sidewalks, civic names, parks, rails,
signals and the newer Building Footprints service. A failing optional park-path
endpoint was excluded rather than silently substituted. No OSM data is imported.
The source licence permits adaptation and distribution with attribution; no City
logos, official marks or endorsement claims are used. See `THIRD_PARTY_NOTICES.md`.

Local x points east and z south; origin [-122.849,49.1895]. Source coordinates are
WGS84, projected using 111320 m/degree and cos(origin latitude). Feet/grades,
terrain elevation, legal pedestrian access and real-world navigation are not modeled.
Road widths derive from lane counts; source sidewalk lines are buffered to a
minimum 3 m width. A small station apron is illustrative. Building footprints are
simplified by 0.4 m and road lines by 0.25 m. A 0.55 m building clearance buffer
plus player-radius checks produces the tiled walkable surface. All remaining flat
ground is traversable, including plazas, parks and street crossings. This is an
arcade access model, not a claim that every real property is publicly accessible.

Source `BUILDING_HEIGHT` values guide stylized massing and are clamped to 4–160 m.
The source field does not verify units or observation dates, so these are explicitly
**not surveyed/current building-height claims**. Facades, trees, lamps, crosswalks,
station canopy and human scale are artistic approximations. Feature/service edit
dates are recorded separately from the unknown survey dates. The scene is colorful
and geographically based; it is not an architectural replica.

Reproduce offline, using a cache outside the repository:

```sh
python3 -m venv /path/to/surrey-tooling
/path/to/surrey-tooling/bin/pip install -r projects/surrey/tools/requirements.txt
/path/to/surrey-tooling/bin/python projects/surrey/tools/build_city.py --cache /path/to/surrey-source-data
```

The importer rejects errors/truncation, checks existing raw-source pins, and refuses
to replace differing output under an existing snapshot. Changed source needs a new
reviewed version. Retain raw cache files for deterministic reproduction; upstream
live queries may change. No network request occurs during tests or normal builds.

## V0.2 architectural interpretation

The immutable geographic snapshot remains authoritative for footprints/roads and
collision. The combined SFU/Central City footprint now renders as a lower podium,
curved office tower and glass/timber atrium instead of one tall extrusion. Library
floor ribbons/skylights, City Hall's oversailing roof, the glazed station entrances,
Civic Plaza and Holland Park fountain/amphitheatre give readable silhouettes.
Exact tower placement, dimensions, windows and props are artistic approximations,
not surveys. Benches, bins, shelters, stationary buses, parked cars, construction
barriers and fictional signage are decorative, generally without collision.
Primary architectural references are listed in `landmarks.ts` and
`THIRD_PARTY_NOTICES.md`; no reference photographs, logos or public artworks are copied.

## Verification and release

`npm run test:surrey` covers immutable map/source integrity, real collision walks
through both backpack solutions and mystery outcomes, evidence/reward gates,
seeded encounters/choices, cooldowns, gentle/mature settings, pursuit/recovery,
aerial camera bounds and return, repeated mode/timer/RNG preservation, validated
save/restore, storage failure, pedestrian separation and failed/cancelled loading.
Run `npm run check`, Vancouver/investment regression tests, `npm audit --omit=dev`,
`npm run build:next`, `npm run build` and `git diff --check` before release.
The existing `prebuild:next` hook includes Surrey tests in the exact-source Linux
Node 22 workflow. Deployment follows `docs/DEPLOYMENT.md`: capacity floors,
independent candidate, protected routes/services and whole previous runtime rollback.
Browser acceptance is recorded separately from automated simulation coverage.

## Limits and next steps

No interiors, drivable vehicles, transit boarding, combat, terrain or autonomous
NPC agent service. Community tasks are short authored branches, not full delivery
quests. The mystery uses fixed authored clues; encounter selection/outcomes are
seeded. Saves are browser-local and can be cleared by the browser. Viewport testing
is not physical-phone thermal, battery, gesture or long-session certification.

1. Physical iOS/Android input, frame-time, thermal and long-session acceptance.
2. Richer recurring-character errands and schedules with more mission choices.
3. Source-backed terrain, Holland Park paths and transit traversal, before map expansion.
