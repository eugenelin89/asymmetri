# Surrey V0.6 — Open Roads: candidate acceptance

**Implemented candidate; not deployed.** Work is isolated on
`codex/surrey-adventure-v06`, refreshed through approved main `60574c8` on
October 31. Production remains Surrey V0.5; the later UBC/homepage releases are
preserved in the candidate. Required ordinary-control rendered-browser acceptance
is incomplete. See the October 31 follow-up below for partial resumed evidence.

## Implemented scope

- 17,009 m of unique connected path geometry, versus the original 218.30 m route;
  17,154 m of unique source centrelines. Lengths use geometric unions, not repeated
  route traversals. The 133 accepted segments have 116 nodes, 57 source junctions,
  56 reachable branching intersections and 478 accepted directed transitions.
  Thirty turns and 66 source segments are excluded. A disconnected pavement
  fragment is removed after final corridor clipping.
- Eight roadside stops: Surrey Central, Civic Plaza, City Hall, City Centre
  Library, Central City, SFU Surrey, Holland Park and King George Station.
  Every outward route and the seven distinct return routes to Surrey Central
  pass full compact-body validation and foot-exit checks. Stops also require
  clearance to rejoin the road. Their locations do not imply legal parking or
  direct vehicle access to a landmark entrance.
- Free driving without a mission or route; map selection, A*, highlighted route,
  next turn, remaining/planned distance, stopped arrival, deviation rerouting,
  explicit unreachable feedback and Clear Route. Navigation never moves the car.
- Case05, **The Long Way Around**: meet Nora on foot, accept the archive, drive a
  connected alternative around fictional University Drive roadwork, park near
  Central City, exit and hand it to Mina for $85 once. The 761.217 m direct route
  becomes a 1,192.607 m alternative across seven segments. Completion clears the
  workzone. Cargo, driven distance, visited roads and reward consistency save.
- Six compact NPCs on a validated 695.405 m circuit, Low/Normal distant budgets,
  saved-car placement avoidance, full-body sweeps and yielding. Shared fictional
  green/yellow/red phases coordinate visible bulbs, NPCs and crossing pedestrians.
- Existing compact handling, four cases, day/night state, aerial freeze, recovery,
  rail motion and save key remain. Schema5 explicitly migrates schema2/3/4.
  Held controls have independent key/pointer owners and lifecycle clearing.
- Phone defaults remain two view controls, Menu, one compact objective/GPS line
  and edge touch controls. Map/GPS and detailed status open explicitly. The map
  is scrollable and retains keyboard focus after Clear Route.

## Geographic evidence and limits

The separate V0.6 manifest records raw/output digests, source queries, complete
counts, projection, tolerances and licence. V0.3 geography and V0.5 transport
remain byte-identical. The importer checks all 199 source-road coordinate
correspondences, intersects named source corridors with pavement, subtracts
curbs/medians/buildings/non-open surfaces, and derives only the car component.
Final runtime geometry checks each accepted edge/turn at 0.15 m intervals.
The connectivity report includes rejection reasons and outward/return distances.

Road widths are inferred, survey dates are not assured, and geometry/traffic are
for gameplay. King George selects a consistent supported carriageway; not every
lane, U-turn or real-world movement is represented. Source-supported junction
aprons can extend up to 18 m around source nodes; they add no pavement. Terrain
remains flat. Sedan/SUV are deferred because their distinct full footprints have
not been accepted. SkyTrain remains moving scenery: a second in-bounds station
exists, but a complete safe vertical access/boarding trip is unverified.

## October 30 automated and offline verification

- 67 Surrey tests pass, including all four earlier case completions and both
  Missing Person endings. Walking drivers detour around stopped traffic with
  movement inputs; cars use throttle/steering/brake inputs. Actors and collision
  are never disabled to complete the stories.
- Case05 passes accept → walk → enter → save/reload → 1.19 km alternate drive →
  stop → aerial freeze/return → exit → foot handoff → $85 reward → save. No
  recovery or position mutation completes the route; the driving test reports
  zero contacts and records seven visited road segments.
- 74 Vancouver, 27 Richmond and 7 investment tests pass: **175 total**.
- `npm run check` passes, with one pre-existing tutorial navigation lint warning.
  `npm audit --omit=dev` reports zero vulnerabilities. `npm run build` (Vinext) and `npm run build:next -- --webpack` both pass on
  Node24. The Next prebuild gate repeats all67 Surrey and27 Richmond tests.
  Twenty-one local production routes/assets return HTTP200, including GIS peers,
  Motion protected routes, tutorial canonical, BotSquad, the configured favicon,
  all retained Surrey snapshots and the new manifest/report. Served dataset
  digests match the source files. `git diff --check` and added-content privacy
  scans pass. Dependencies and peer code are unchanged.
- Offline derivation reproduces its pinned draft exactly. Exact-runtime
  validation reproduces the final transport/report bytes. The final connected
  mask excludes the small detached clipping fragment.
- Local route calculations measured roughly 10–470 ms on the development Mac
  before final packaging; this is not a phone performance claim. Rendered FPS,
  thermal/battery behaviour and real multitouch are unverified.

## October 30 browser evidence and exact blocker

The local Next preview returned HTTP200. Ordinary keyboard activation started a
new game, opened Map, selected Central City (0.76 km), saved/reloaded, resumed
that selection, switched to Aerial Explore and back, and cleared the route. The final phone Menu → Map → Menu check left one
Menu dialog and zero map dialogs; Clear Route returned focus to the destination
select. Selection, map, help and view controls responded through their actual UI handlers.
No hidden game state, save injection, teleport, JavaScript input dispatch or
synthetic mission completion was used.

DOM geometry checks at CSS390×844, 844×390, 820×1180 and 1280×720 found the explicit
map inside the expanded viewport with no horizontal overflow. At phone size the
status panels were hidden and touch movement/Menu/compact GPS remained exposed.
The phone map measured about366×563 px within390×844; landscape680×274 within844×390.
These are **DOM/layout measurements only**, not screenshot or physical-device proof.

The selected Brave browser repeatedly timed out on mouse input and screenshot
capture. Keyboard menus responded, but after a held W input the visible canvas
telemetry remained at player25.80,33.21 and elapsed0.00. The game did not advance
for a driving test. Native capture did not provide a reliable matching game view.
Vancouver and Richmond independently reported the same browser animation/input/
screenshot limitation. No browser security setting was weakened. Temporary
viewport overrides were reset and the owned test tab/server were closed.

**Therefore manual driving/turning, rerouting while moving, Case05 end-to-end,
visual rendering, final console/lifecycle checks, simultaneous touchscreen
steering/acceleration, physical iPhone performance and live post-release browser
acceptance are incomplete. Do not treat the unit tests or DOM checks as passing
those gates.**

## October 31 follow-up

The browser connection recovered temporarily. On the retained local production
build `Ue-yFwVA0MSu1L2u-TfHH` from `b6eae37`, mouse Continue resumed the saved game;
held WASD moved the character, Nora's dialogue accepted Case05, and E entered the
compact. Normal held keyboard controls drove along Central Avenue and City Parkway
into 102 Avenue. The last verified mission distance was 352.0 m before a reverse
realignment; Case05 remained accepted. No Recover, injected save, position mutation
or collision bypass was used. The delivery was **not completed** in this run.

Short steering pulses separated by browser observations understeered at the first
right turn and at 102 Avenue's median. Boundary collisions stopped the car, and
ordinary reverse manoeuvres cleared each. Sustained steering/acceleration worked
but needed correct approach positioning. These incidents are retained as evidence;
neither a clean drive nor a product handling improvement is claimed. Sampled render
rates ranged from 39.2 to 60 FPS. Adaptive DPR decreased from 1.5 to 0.75, with
reduced ambient and traffic budgets. These are desktop snapshots, not sustained
performance or physical-phone results.

This run exposed a GPS defect: duplicate shared endpoints invented turns and could
name the incoming street. Guidance now ignores zero-length legs and identifies
the closest outgoing road. The detour correctly names City Parkway, 102 Avenue,
King George Boulevard and Old Yale Road. Its geometry and 1,192.607 m length are
unchanged. A real-network regression covers all four directions/names and rejects
the false endpoint/arrival turns; the offline snapshot still reproduces exactly.

Browser control disconnected mid-drive, resetting the tool session. The Brave
extension temporarily disappeared; native capture showed no usable page content.
The same browser subsequently reconnected. Shared-browser checks are serialized
with Richmond so focus and viewport overrides do not invalidate either run.
The combined candidate is being rebuilt before continuing the saved drive.
Moving reroute, complete delivery/handoff, final save/park/exit/aerial checks,
phone screenshots, console/lifecycle checks and live post-release acceptance
remain outstanding. Physical iPhone/multitouch testing remains separately pending.

Main refresh merges preserve the approved UBC and homepage code. The original
Surrey journal 149 is retained as journal 159 to avoid UBC's independently assigned
149; the historical observations were preserved. UBC journals 157/158 remain intact.
Its October 31 handoff reports live source `526213d283cba5e70b192cc295e8ccdd3271467c`,
build `ujW5iepUV_ni0g_OH7ONo`; read `UBC_ENCOUNTER_RELEASE_2026-10-31.md` before any
later release. No Surrey main push or production mutation has occurred.

## October 30 production preservation and next release step

Read-only production inspection during this task confirmed source
`fcd2b900b512652a94af07571b841e823c61d2de`, BUILD_ID
`VaAKfIoEAK5LbGri4K8V8`, service active. The complete immediate rollback remains
`/var/www/asymmetri-rollback-before-surrey-v05-20261030` with source
`be6fc3bc069cd77b54240846b27166027b333d3b`, build`gIRztyRG7Pdh1DR3AAHQR`.
These are observations of the existing V0.5 release, not a V0.6 deployment.
The brief's statement that V0.5 had no live browser acceptance was superseded by
its subsequent successful live pass, recorded in journal146.

No main integration, Linux release artifact, server activation, restart or
configuration change was performed for V0.6. Richmond's V0.2 remains on its own
isolated branch (journal148); Vancouver's approved development-only research is
preserved from main (journal147). Surrey uses journal149; no shared window held.

When rendered browser operation is restored, complete the ordinary-control
acceptance above on the exact candidate, including a real detour drive, missed
turn/reroute, old-save resume, park/exit/re-entry, old missions and responsive
HUD. Then refresh approved main and coordinate the shared window. Build the
exact-source Linux candidate through the existing guarded workflow, retain the
complete immediate runtime rollback, verify protected/peer routes and source/
artifact/BUILD_ID identity, activate only after all guards pass, and repeat live
browser acceptance. Physical iPhone testing must be reported separately.
