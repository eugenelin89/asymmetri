# Surrey, City of Adventure V0.6 — Open Roads

Candidate on `codex/surrey-adventure-v06`; production remains V0.5 until rendered-browser acceptance and guarded deployment pass. See [V0.6 acceptance and release gate](../../docs/SURREY_V06_ACCEPTANCE_2026-10-30.md).

**Survive the streets. Discover the stories.** A fictional third-person adventure
and aerial city explorer at `/labs/surrey`, using a reconstructed 1.31 × 1.45 km
City of Surrey geographic snapshot. Every character and incident is invented;
this is not a real crime map or a statement about neighbourhood safety.

[Play](https://asymmetri.co/labs/surrey) · [V0.5 release record](../../docs/SURREY_V05_RELEASE_2026-10-30.md) · [V0.4 release record](../../docs/SURREY_V04_RELEASE_2026-10-30.md) · [V0.3 release record](../../docs/SURREY_V03_RELEASE_2026-10-30.md) · [V0.2 release record](../../docs/SURREY_V02_RELEASE_2026-10-30.md) · [V0.1 release / recovery record](../../docs/SURREY_RELEASE_2026-10-30.md)

## Play and controls

Use Node 24 from `.nvmrc`, the installed lockfile and `npm run dev:next`.
Select **Play Now**, or **Continue Game** when this browser has a valid save.
WebGL2 is required. No account, backend, paid API, analytics or upload is added.

| Input | Street Adventure | Aerial Explore |
| --- | --- | --- |
| WASD / arrows | Camera-relative walk | Pan city |
| Shift | Sprint, consuming stamina | — |
| Drag | Rotate follow camera | Orbit |
| Right drag / two fingers | — | Pan; pinch zooms |
| Wheel / zoom buttons | Camera distance | Zoom |
| Two view buttons / V | Select Aerial Explore | Select Street Adventure |
| F / Return to Player | — | Centre camera on exact player position |
| E | Interact | Disabled |
| M | Toggle mini-map extent | Toggle mini-map extent |
| Escape | Pause / close overlay | Pause / close overlay |
| R | Safe station recovery | Disabled |

Both **Street Adventure** and **Aerial Explore** remain visible, with a checkmarked
Active label and pressed semantics. V also works from non-editable controls, but
not through dialogue, journal or pause. A short first-use explanation is stored
separately at `asymmetri.surrey.view-help.v1`; Help / Menu → View help reopens it.

Phones open the expanded game automatically. The default mobile HUD contains the
two view buttons, Menu, one compact objective line and edge touch controls. Health,
stamina, money, inventory, settings and full mission details are in Menu. The map
and aerial tools open on request and have explicit Close buttons. Return to Player
stays visible in Aerial Explore. This avoids the stacked panels shown in the
owner's V0.2 iPhone screenshots. Small-screen copy leads with tapping/gestures.

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

## Five complete cases and street stories

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

**The Missing Person:** Tess asks about adult friend Riley near the station. Choose
witness comparison (Mo + Eden and one clue) or paper corroboration (notice + receipt
and one witness). The library notice, campus receipt and Eden's account disprove a
misleading red-van assumption. Find Riley voluntarily taking a quiet afternoon near
Holland Park's fountain. Offer a private message ($60) or ask for a consensual reunion
($75); return to Tess for the ending. Rewards cannot repeat. Journal exposes leads
as learned; no undiscovered person is exposed from above. Recover can bring you
back to the station while preserving the return stage. The long path around the
mall is walkable and is not a shortcut through its footprint.

Six data-driven encounters supplement the original pickpocket: a robbery demand
(pay/refuse/flee/help/distract), a stolen portfolio with bounded chase or victim/
witness assistance, optional adult solicitation with decline/question/leave choices,
an optional dealer proposition with refusal/report/inquiry choices, a seeded
charity collection that may be sincere or fraudulent, and a community wallet/
directions interaction. Cooldowns and a 60-second post-recovery grace period avoid
immediate repeated threats. Rewards occur once per type. Mature dialogue does not
make sex workers, homelessness, poverty or substance use automatic danger signals.
All cast members and the player are fictional adults. Each event has two authored
opening variants. Optional adult encounters occur only in evening/night. Jo's trust
(0–3) increases for first community help, rewarded community/theft help and Case03;
at trust2 the robbery bus distraction reliably succeeds. No money-farming relationship loop.

**A Ride Across Surrey:** meet Jules near the station and explicitly accept a
projector delivery for a fictional community screening. Walk to the teal car on
Central Avenue, enter, follow the cyan route through the City Parkway turn, stop
in the destination ring, exit beside the car and meet Quinn. The ordered route
checkpoints require actual driving. Completion removes the projector and pays
$55 once. The car remains available afterward; old cases stay independent.

**The Long Way Around:** meet Nora near the station on foot and accept the
community archive. A fictional University Drive workzone closes one road. The
761.217 m direct route becomes a 1,192.607 m alternative across seven segments.
Drive a connected alternative, stop at the Central City roadside destination,
exit and hand the package to Mina for $85 once. The workzone then clears. Cargo,
actual driven distance, visited roads and completion survive reload/recovery.
All four earlier cases remain independent. Accepting this job is optional.

## Driving and transit

Driving is a movement state within Street Adventure. E enters only beside the
car, or exits only at rest into a reachable, unoccupied position. W/Up accelerates,
S/Down brakes then reverses, A/D steers, Space handbrakes, R recovers to the nearest
clear validated route pose. Recovery preserves cargo and checkpoints. A moving
car cannot be exited. Entry is blocked during active pursuits. Free driving does
not require accepting Case04. Touch has held Go/Brake/steering buttons, Handbrake,
Exit car and Recover; speed is shown in km/h. Aerial freezes the exact car state
and follows the occupied vehicle's YOU marker. Returning resumes that state.

The car uses a 4.16×2.04m oriented footprint, polygon-boundary tests and midpoint/
endpoint swept movement at 120Hz substeps. Curbs, medians, closed surfaces and
buildings are excluded. Acceleration, reverse, braking, steering return and
speed-dependent turning are bounded. Collision stops without damage or bounce.
A smooth chase camera retains drag/zoom controls; walking keeps its own view.

V0.6 provides **17,009 m of unique connected road paths** (17,154 m of unique
source centrelines), 133 accepted source road segments and eight roadside stops.
The source includes Central Avenue, City Parkway, University Drive, 104 Avenue,
Old Yale Road, King George Boulevard and the Holland Park perimeter. Driving
remains within validated source pavement, excluding curbs, medians, buildings,
non-open surfaces, unnamed access lanes and disconnected/unsupported turns.
Road widths are inferred; this is a game network, not real navigation or legal
parking advice. Stops require a supported rejoin and safe foot exit; they do not
promise direct access to pedestrian-only landmark entrances.

**Map & GPS** selects Surrey Central, Civic Plaza, City Hall, the library, Central
City, SFU Surrey, Holland Park or King George Station. A* includes incoming road
direction and accepted turn transitions. Gold guidance shows route length,
remaining distance, the next turn and stopped arrival. A sustained deviation
recalculates from the current car; no position is changed. Clear Route returns
to free driving. Aerial and reload preserve selection; reload rebuilds geometry.
The old 218.30 m cyan projector route remains independent and appears only during
that mission when GPS is cleared.

Six bounded compact NPCs use a 695.405 m validated circuit through Central Avenue,
City Parkway, 104 Avenue and University Drive. Low targets three distant actors;
Normal targets six, with coarse devices capped at three and sustained low frame
rate reducing the budget. Nearby cars remain present instead of disappearing.
Distant actors update coarsely and may park in place. Full-body movement, saved-car
spawn avoidance, lookahead yielding and pedestrian clearance remain enforced.
Signals use a shared fictional 68-second cycle: green 32 s, yellow 4 s, red 32 s.
Crossing pedestrians start only with enough red time and finish across if the
phase changes. This is a bounded traffic simulation, not actual signal timing.

Three original train cars shuttle smoothly over one connected 811.83m elevated
rail chain, dwell at Surrey Central and at conservative endpoints, then reverse
travel without jumping tracks. Side platforms, entrance/glazing/stairs, lights,
track lines and spaced supports are illustrative. Columns avoid paved roads.
The retained 8.2m deck-centre height is not surveyed elevation. **Train boarding
is unavailable**; safe multi-station access/boarding is deferred beyond V0.6. King George Station lies within the map, but a complete safe vertical boarding path has not been verified. Train doors open illustratively during the Surrey Central dwell.

Reproduce the transport snapshot offline from the retained V0.3 receipt cache:

```sh
/path/to/surrey-tooling/bin/python projects/surrey/tools/derive_transport.py --repo . --cache /path/to/v03-source-cache --out /path/to/new-transport-output
```

The script checks pinned input hashes and refuses to replace different existing
transport bytes. The versioned manifest records source URLs, licence, geometry
limits and output hashes; no runtime geographic service is added.

V0.6 derivation uses the same pinned City receipts. With Python/Shapely 2.0.7:

```sh
/path/to/python projects/surrey/tools/derive_network.py --repo . --cache /path/to/v03-source-cache --roads /path/to/roads.json --out /path/to/draft
node projects/surrey/tools/validate_transport.mjs --input /path/to/draft/network-draft.json --out /path/to/output --python /path/to/python
```

Both steps reject different existing output bytes. The first verifies hashes,
feature counts and all 199 source-road coordinate correspondences. The second
uses the exact runtime footprint and routing code, clips to accepted corridors,
checks every advertised transition and all outward/return destination routes,
and produces the network plus connectivity report. Unique lengths are geometric
unions, never sums of repeated trips. See the V0.6 manifest for source requests,
hashes, tolerances, rejected segments and geographic limitations.

## Living city

The saved fictional clock begins at13:00 and advances1,4 or12 game minutes per real
second. Morning06–12, afternoon12–18, evening18–21 and night21–06 change sun angle,
sky/fog, fill light, window masks and lamp/shop emission. No per-lamp dynamic lights
or downloaded audio are required. Stable daylight visibility keeps a clear daytime
render without changing the clock or schedules. Menus, map/help, dialogue, hidden
pages and Aerial Explore freeze active simulation. Rest in Menu moves to08:00 or
21:00 without consuming mission timers; active pursuits block rest.

Fictional commuter, student, office-worker and shopper roles use nearby clear paths
and time windows. Painted crossing areas supply bounded crossing routes with waits;
idle phases include waiting, looking, talking gestures and sitting. Threats trigger
flight, assistance gestures and return to normal activity. Distant actors use coarse
updates capped to safe collision steps. These are illustrative schedules, not resident
movement records. Night retains only a small commuter population. Bus doors cycle
at the stationary bus stop; a procedural marimba performer plays an original four-note
phrase only when sounds are enabled and the player is nearby during daytime. Mute,
volume and lifecycle cleanup are explicit. Bus driving/boarding and a citywide traffic
simulation are not implemented.


## Save and resume

`asymmetri.surrey.save.v2` is a versioned localStorage record, written during play,
after decisions, on pause/visibility changes and teardown. It preserves all five cases,
clues, inventory, health/stamina/money, safe player position, settings, cooldowns
and seeded runtime state. No record leaves this browser. Saves are origin-specific:
apex and www do not share them. New Game asks before replacing a valid save;
clearing site data also removes progress. Invalid/incompatible records are ignored
and retained until a new game replaces them. Restricted/quota-full storage shows a
notice and play continues without guaranteed persistence. Restore validates enums,
allowlisted items, finite ranges and map/version. An explicit migration accepts
V0.2 records referencing `v0.1-2026-10-30` under the same storage key and upgrades
their map identity. Schema3 uses the same storage key and explicitly migrates v2
records to a fresh afternoon clock, unstarted Case03, trust1 only for prior community
help, stable visibility off and audio muted. New fields validate ranges, enums,
unique allowlists and reward/ending/evidence consistency. Progress, settings,
inventory and runtime timers survive;
only an invalid position is relocated to nearby safe ground. Aerial framing itself resets around the saved player.

Schema4 explicitly migrates schema2/3 to an available parked car and unstarted
Case04. It validates occupancy, finite car pose/speed/steering, ordered checkpoint
range, cargo and reward consistency. Reload restores an occupied car stopped;
an invalid car location moves to a clear validated route pose without resetting
mission progress. Parked location, money, all earlier clues and settings survive.

Schema5 retains the same storage key and migrates schema2/3/4. V0.5 car positions
and all case progress survive when valid; invalid poses recover to a clear body-
checked road with a foot exit. New defaults are free drive, unstarted Case05 and
Normal traffic. Save validation checks the transport version, destination/road
allowlists, cargo, distance and reward consistency. Route geometry is rebuilt,
not stored. Input ownership is per pointer or keyboard key; releasing one finger
cannot cancel another held control. Pause, blur, visibility and teardown clear
all held input.

## Architecture and performance

- `data.ts` / `world.ts`: bounded same-origin map contract, full-body clearance,
  sliding collision, movement substeps, safe recovery and bounded A* navigation.
- `simulation.ts`: pure seeded state, five cases, encounter choices and timers.
- `story.ts` / `encounters.ts`: authored clues, witnesses, verdicts and event data.
- `vehicle.ts`, `transport.ts`: oriented swept collision, validated road/rail paths, traffic, safe recovery and delivery state.
- `navigation.ts`, `input.ts`, `signals.ts`: validated A*, local guidance, independent held controls and simplified traffic phases.
- `transportScene.ts`: shared original car/train meshes, disposable GPS line, workzone and platform lights.
- `save.ts`: versioned serialization boundary, validation and failure-safe storage.
- `camera.ts`: bounded aerial controls plus continuously fitted ground sightlines after smoothing.
- `time.ts`, `missing.ts`, `audio.ts`: clock/lighting, adult investigation data and opt-in original synthesis.
- `population.ts`: sidewalk-parallel routes, pauses, separation and threat reactions.
- `architecture.ts` / `buildings.ts`: deterministic building profiles, varied
  shared facade materials, roof equipment and 128m tiles for nearby detail.
- `scenery.ts` / `landmarks.ts`: original procedural landmarks and shared rounded
  person geometry, source-backed labels and reference provenance.
- `engine.ts`: one Three.js renderer/loop, input, shared scene, camera transitions,
  visibility suspension, adaptive DPR, autosave and complete GPU/event disposal.
- `Adventure.tsx`, `Journal.tsx`, `MiniMap.tsx`, CSS: responsive HUD, explicit
  choices, evidence, discovered leads, compass and visible touch controls.

React receives 150 ms snapshots rather than frame updates. Ambient pedestrians are
bounded to 12 on coarse-pointer devices or 24 otherwise (reducing toward eight under sustained slow frames). Distant aerial pedestrians
are culled; labels are decluttered and rendered at readable screen size. Environmental
objects use instancing where applicable, and people share geometry/materials.
Vancouver supplies only existing geometry predicates. Its renderer, controls,
vehicle state and snapshots are unchanged. No dependency or network service added.

## Geography and provenance

Current geography: `public/surrey/v0.3-2026-10-30/`; transport: `public/surrey/v0.6-2026-10-30/`. V0.5 transport bytes remain unchanged. The V0.4 release manifest and fresh terrain review are in `public/surrey/v0.4-2026-10-30/`; no new city file is duplicated. V0.1 and V0.3 remain byte-identical.
The new manifest pins the parent, exact source URLs, raw and output SHA-256,
retrieval times, licence, CRS, processing tolerances and known uncertainty.
Runtime loading is same-origin only; no paid or live geographic API is used.

The existing 786 building parts, anchors and collision cells are retained. Actual
Road Surface polygons (128 records) replace inferred pavement where available.
Uncovered centreline reaches retain continuous buffered corridors: 131 road
features have widths derived from paired active curb probes and 68 retain a
lane-count estimate. Active assets include 660 curb features and 92 medians;
proposed assets are excluded. Unioned intersections preserve holes and subtract
medians/buildings. Paint is clipped to asphalt. Sidewalk/asphalt interiors do not
overlap. A topology-preserving 1cm precision grid prevents tiny invalid polygons
from reappearing during JSON rounding. Buildings retain 0.4m simplification;
road lines 0.25m; new curb/path lines 0.2m.

The working Trails and Paths service adds 262 active source features, including
Holland Park paths. Source widths are used where present; missing widths use an
explicit 2m estimate. Existing sidewalks retain their minimum 3m gameplay width.
Crosswalks derive from signal points and nearby road direction; **their stripes
are illustrative**, because no authoritative painted-crosswalk outlines were found.
Closed-to-Traffic pavement and the arcade walkable surface are not legal access
claims. Decorative objects add no invisible collision barriers.

Local x points east and z south, origin [-122.849,49.1895], using the existing
111320m/degree equirectangular frame. Rendered input uses server WGS84 output.
The hosted and OpenData services' default WGS84 transformations differ by about
1.283m; this retained alignment uncertainty is documented, not presented as survey
accuracy. Height matching uses native EPSG:26910 coordinates to avoid that offset.

**Building heights:** OpenData layer155 explicitly labels BUILDING_HEIGHT and
GROUND_ELEVATION in metres. Every retained building part has a FACILITYID join,
native boundary residual below 0.2m and height agreement below 0.005m. All 786
are classified `derived-spatial-match`. None is `verified-measured`: measurement
method, survey date, roof statistic and accuracy remain unknown. The importer
supports `illustrative-estimate` when no reliable match/value exists; unmatched
raw records in this query did not survive the retained footprint selection.
Source heights are no longer clamped to 160m; 3 Civic Plaza retains 164.04m.
The hosted feed's October 1, 2026 edit date is not a survey date.

**Terrain:** flat fallback remains deliberate. Official 2025 DEM header probes
confirm 0.5m pixels and EPSG:26910. The bbox lies in the NW download quadrant,
whose ZIP is 2.38GB. Official contours cite April 2025 LiDAR, but the 2025 DEM/LAS
vertical datum could not be verified. The full DEM was not downloaded and no
invented ground heights were introduced. `GROUND_ELEVATION` is not treated as a
verified terrain grid. All bases/people remain on the same local zero plane;
SkyTrain guideways retain an illustrative 8.2m deck centre above it.

Reproduce offline using retained raw receipts outside the repository:

```sh
python3 -m venv /path/to/surrey-tooling
/path/to/surrey-tooling/bin/pip install -r projects/surrey/tools/requirements.txt
/path/to/surrey-tooling/bin/python projects/surrey/tools/reconstruct_city.py --cache /path/to/v03-source-cache
/path/to/surrey-tooling/bin/python projects/surrey/tools/test_reconstruction.py
```

`reconstruct_city.py` checks exact feature counts, truncation/error flags and raw
hashes, and refuses a different output at an existing version. Its query URLs
provide bounded replay; retain the original bytes because upstream feeds and JSON
serialization can change. The untouched `build_city.py` still reproduces V0.1
with its separate original cache. Normal tests/builds require no geographic network.

## Architectural reconstruction

Deterministic facility-ID profiles vary glass, residential, apartment, commercial,
storefront and civic facades. Shared canvas materials use multiple window patterns
and colours. Nearby doors, canopies and balconies are batched into 128m visibility
tiles; roofs, setbacks and mechanical equipment remain readable from above. Both
views share these meshes. Untextured roof caps avoid distant z-fighting and window
textures on roofs. Source road names orient original street signs along road axes.

Central City/SFU separates mall, lower podium, curved tower and timber/glass atrium.
StructureCraft's atrium description supports 26.21m height, 78.03m facade length
and 7.32m lower-column spacing; placement/curvature remain artistic. Library floor
ribbons follow its actual angled footprint and vaulted rooflights distinguish it
from City Hall's cantilevered roof and glazed entrance. Surrey Central has a curved
canopy, elevated platform, columns, stairs and glazed stationhouse. Civic Plaza
paving and Holland Park fountain/amphitheatre remain illustrative, with sourced
park paths. Benches, bins, buses, shelters and barriers remain lightweight scenery.
No proprietary model, photo, logo or public artwork was copied. References are in
`landmarks.ts` and `THIRD_PARTY_NOTICES.md`; source outlines are not survey-accurate
architectural replicas.

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

No interiors, citywide driving, transit boarding, combat, terrain or autonomous
NPC agent service. Community tasks are short authored branches, distinct from the complete Case04 driving delivery. The mystery uses fixed authored clues; encounter selection/outcomes are
seeded. Saves are browser-local and can be cleared by the browser. Viewport testing
is not physical-phone thermal, battery, gesture or long-session certification.

1. Physical iOS/Android input, frame-time, thermal and long-session acceptance.
2. Richer recurring-character errands and schedules with more mission choices.
3. Datum-verified terrain and transit traversal before map expansion.
