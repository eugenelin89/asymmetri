# Surrey Adventure V0.1 — Playable Prototype

**Survive the streets. Discover the stories.** An independent Asymmetri Labs browser
adventure at `/labs/surrey`. The 1.31 × 1.45 km City Centre slice contains actual
City of Surrey street, sidewalk, building, park and rail geometry. Characters,
crimes and narrative are authored fiction, unrelated to real incidents or safety.

[Play the public release](https://asymmetri.co/labs/surrey) ·
[Verified release and recovery record](../../docs/SURREY_RELEASE_2026-10-30.md)

## Play

Run the website with its Node 24 `.nvmrc`, installed lockfile and `npm run dev:next`.
Visit `/labs/surrey` and select **Play Now**. WebGL2 is required. No account, paid
map API, backend, save file, analytics or external runtime requests are added.

| Input | Action |
| --- | --- |
| WASD / arrows | Camera-relative walking |
| Shift | Sprint; recover stamina by walking or resting |
| Drag / wheel | Rotate camera / change distance |
| E | Interact; dialogue has a keyboard-focusable Continue button |
| M | Local / whole-neighbourhood map |
| Escape | Pause / resume |
| R | Safe station recovery, keeping quest progress |

Touch devices have held directional and sprint controls plus E. Camera buttons
provide a keyboard/touch alternative. The expanded view has a focus boundary;
dialogue/menu buttons keep keyboard focus inside the active panel. Reduced-motion
preferences suppress procedural bob/swing and camera smoothing. Gentle streets
disables optional threats; Lite lowers rendering resolution and removes shadows.
Hidden/offscreen/inactive scenes suspend animation. Reloading starts a fresh story.

## What is playable

**Welcome to Surrey**: walk from the station entrance area to Alex at the gold
marker, accept the case, inspect the yellow transit slip, catch a fictional runner
or get Sam and Jo to help, recover the orange backpack, and return it for $35.
The runner drops the bag at the end of a bounded escape route. The three-minute
chase deadline offers a retry through Alex without a monetary penalty. No combat.

An optional seeded pickpocket encounter warns the player near a fictional trigger,
approaches at walking pace, can be escaped or dismissed by calling for help, and
has a cooldown. A contact can cost at most $5 and 8 health once per encounter.
Gentle mode removes the event and restores any money intercepted by that event.
Sam, a neighbour staying in a shelter, and Jo, an outreach worker, provide a
conversation, water/health and help with the quest; they are never threat actors.
The purple marker collects one stopped-watch clue and clearly introduces a
**future**, fictional, non-graphic homicide mystery. It is not a second full mission.

## Architecture and Vancouver boundary

- `data.ts`: bounded same-origin versioned fetch, aborts and map contract checks.
- `world.ts`: full-body clearance, sliding collision, <=15 cm movement substeps,
  safe recovery and bounded A* NPC routes using the same walkable geometry.
  Reuses Vancouver's tested `inPolygon`/`segmentDistance` predicates by import.
- `simulation.ts`: renderer-independent, seeded quest/status/inventory/encounter
  logic. Stages cover available, active clue/chase/return, completed and failed.
- `scenery.ts`: original procedural people, building extrusion/window textures,
  batched streets, trees, lights, crosswalks, signs and elevated rail structures.
- `engine.ts`: Three.js, input, camera clearance, ambient movement, disposal and
  rendering suspension; 150 ms snapshots cross into React, never per-frame state.
- `Adventure.tsx`, `MiniMap.tsx`, CSS: start/menu/dialogue, HUD, responsive controls,
  north-oriented SVG geography, inventory and accessibility/text instructions.

No Vancouver file or snapshot changes. Surrey does not import Vancouver map data,
places, renderer or vehicle state. Rendering conventions and offline preprocessing
follow Vancouver; a separate player simulation avoids a risky shared-engine refactor.
Future transport modes can replace locomotion while retaining quest state and map.
No runtime/development dependency was added; only the offline Python tool uses Shapely.

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

## Verification

`npm run test:surrey` covers source integrity, safe spawn, full-body building and
boundary collision, normalized movement, long stalls, frame-rate independence,
all quest paths through actual collision movement, pursuit and community solutions,
stage gating, one-time rewards, failure/retry/recovery, deterministic danger,
cooldowns, empty-wallet damage limits, gentle mode, dialogue pause, stamina,
future clue deduplication and failing/cancelled asset loads.

Release checks also include `npm run check`, `npm run test:vancouver`,
`npm run test:investment`, `npm audit --omit=dev`, `npm run build:next`,
`npm run build`, and `git diff --check`. The `prebuild:next` hook runs Surrey tests in the existing
exact-source Node 22 candidate workflow without changing workflow permissions. Deployment uses `docs/DEPLOYMENT.md` and
its production-owner, capacity, independent-build and complete-rollback guards.

## Limits and roadmap

V0.1 has one complete mission, one danger type and simple ambient pedestrians.
No interiors, vehicles, traffic simulation, violence/combat, terrain, saved
progress, full crime investigation, NPC schedules or transit boarding. Some
street furniture is decorative rather than collidable. Physical phone thermal,
battery and long-session performance still need testing; desktop viewport
emulation is not a physical-device claim.

1. **V0.2 — Dangerous Streets:** more authored encounters, meaningful dialogue,
   a complete mystery, stronger pedestrian avoidance and pursuit animation.
2. **V0.3 — Living Surrey:** better source-backed landmark massing, day/evening,
   neighbourhood services, schedules and optional local save/resume.
3. **V0.4 — Beyond City Centre:** validate a wider connected pedestrian network
   toward Gateway and King George; improve Holland Park paths and terrain.
4. **V0.5 — Vehicles and Transit:** add separate cycling/driving modes and verified
   elevated transit traversal with safe boarding and collision boundaries.
5. **V1.0:** connected story arcs, persistent progression and a larger city.

The next three highest-impact improvements are a richer landmark/street scene,
physical-phone input/performance acceptance, and a second complete investigation.
