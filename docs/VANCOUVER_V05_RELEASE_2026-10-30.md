# Vancouver V0.5 — experimental release validation

Public route: https://asymmetri.co/labs/vancouver. This implementation is prepared
for the owner's authorized release; activation identity and final production
health are recorded separately after the guarded deployment. No deployment is
implied by this pre-release report.

## Delivered behavior

- Phones open Drive in an expanded, safe-area-aware playing view. The map, routes
  and settings live in one scrollable Menu panel; opening it stops driving and
  clears held input. Explore has a small entry action instead of a large card.
- Independent captured touch pointers retain pedal/steering ownership. Steering
  can slide between the existing buttons. Active feedback, cancel/blur release,
  landscape spacing, focus containment and Escape remain available.
- Manual steering has progressive held input, speed-sensitive wheel limits,
  quicker return and countersteer, and a fixed 120 Hz integration step. It uses
  no road-heading correction. Collision/water boundaries remain enabled.
- Pace labels disclose Relaxed 22 km/h and Normal 68 km/h. Normal reached 67 km/h
  in a UI run; braking, reverse and explicit Recover remain usable.
- Chase and Wide cameras use stronger damping and checked horizontal sight
  lines. Illustrative bridge decks fade when blocking the camera-to-car ray.
- The north-up map marks the car and limited False Creek boundary. “Playable
  area” replaces “Whole city.” Search, landmark selection, local routing, aerial
  exploration, scenic Cruise and three manual drives remain.
- A development-only synthetic elevation lab establishes connected XYZ surfaces,
  continuous ramps, full-car deck support and grade separation. Public Cambie
  Bridge remains view-only. See [the proof and research](VANCOUVER_V05_ELEVATION_2026-10-30.md).

No new dependency, backend, common city engine or public geographic asset is
introduced. Surrey V0.3 and GIS Apps changes were integrated from `37d3311` in the
isolated Vancouver clone. Shared Vancouver physics consumed by Richmond is
unchanged. Labs navigation, display names and direct city URLs are preserved.

## Manual driving evidence

These are native UI keyboard runs, observed and steered at each turn. Cruise and
programmatic route following were not used. Distances are actual travelled
metres, not nominal guide lengths. Seconds include stopped observation time;
moving seconds are separate. Recover is an explicit user action, not invisible
steering assistance. Contacts count blocked-state transitions.

| Run | Distance m | Seconds | Moving s | Contacts | Recover | Resets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Scenic forward | 2396.4 | 747.7 | 319.4 | 7 | 4 | 0 |
| Scenic reverse | 2425.6 | 615.4 | 362.4 | 6 | 3 | 0 |
| Village backstreets | 1132.0 | 328.9 | 198.7 | 1 | 1 | 0 |
| West-side corners | 739.8 | 517.0 | 137.6 | 5 | 0 | 0 |
| North shore crescent | 1028.2 | 465.8 | 198.8 | 22 | 1 | 0 |

Both scenic runs registered a complete lap. All three neighbourhood routes
reached their roadside stop. Scenic straights used Normal and turns used Relaxed;
neighbourhood runs used Relaxed. Wide was used except the north under-bridge
section, which switched to Chase before the subsequent bridge-fade correction.
A later short north-reverse check verified that fade visually; it is not a
completed reverse-route test. Other neighbourhood reverse runs were not completed.

V0.4's comparable forward Village/West/North runs recorded respectively
1124.1/741.8/948.7 m, 2/1/13 contacts and 1/0/2 Recover actions. V0.5 Village
improved, while West and North contacts increased. **A substantial overall
reduction in accidental curb contacts has not been demonstrated.** Handling
remains experimental. Long held inputs, curved street alignment and tight
junction clearance need more human testing. Camera obstruction can still occur
at a close building/curb encounter; Recover restored a useful view.

Two incomplete Village tuning attempts (447.6 m, 7 contacts; 651.8 m, 11 contacts)
are retained as failures. An interrupted scenic-forward attempt (2368.3 m,
9 contacts, 3 Recover, no completed lap) overshot a turn after browser-control
timeout left an input held. It was excluded from acceptance and repeated. No
failed attempt is silently relabelled as a completed drive.

## Performance and environments

Brave on the development Mac, CSS 1800 × 984, DPR 1.333. The neighbourhood runs
used Next development mode: cumulative average 59.8 fps, minimum 35 fps, final
600-frame p95 18.0/17.6/18.1 ms (West/North/Village). These session-wide counters
include idle observation and are not independent per-route distributions.
V0.4 reported 59.9 fps average, minimum 48 and p95 16.8 ms in its earlier session;
this is contextual evidence, not a controlled benchmark.

A fresh optimized Next session, same viewport/DPR, recorded 27.3 drive seconds,
58.9 fps average, minimum 51, current 60 and p95 18.3 ms. This separate rendering
sample used **Cruise**, and is not a manual-driving result. The long scenic
session was contaminated by backgrounding/control interruptions: cumulative
53.9–55.7 fps and minimum 1, adaptive pixel ratio 1, p95 18.2/18.0 ms. It cannot
establish a clean frame-time regression. No material sustained frame-rate drop
was observed in the fresh sample; stronger matched-duration benchmarking remains.

Renderer counts remained 85 geometries/11 textures across three Explore/Drive
switches, with 39 draw calls in the sampled location. Pause removed the canvas
and Resume recreated a working scene. This bounded observation detected no
resource growth; it is not a long-duration GPU-memory proof.

## Mobile, accessibility and lifecycle

The owner's physical iPhone was released from testing at their request. No
physical iPhone or Android hardware acceptance is claimed. A dedicated iPhone 16
simulator running iOS 26.5 Safari verified clear portrait/landscape play, held
acceleration, Menu pause/close, orientation changes and Safari background/resume
with speed remaining zero. Browser CSS widths 320, 390, 639 landscape, 1024 tablet
and 1800 desktop were inspected. The 320 px expanded view had no horizontal
overflow. Map keyboard routing and Escape were exercised.

True simultaneous multi-finger input, hardware GPU/thermal/battery behavior and
Android remain unverified. Pure tests cover independent control ownership;
single-pointer simulator actions are not equivalent to multitouch hardware.
Existing adaptive rendering, reduced-motion branches, accessible source/landmark
text and WebGL loss/retry code remain. This release did not repeat physical or
forced WebGL-loss acceptance. No application console errors were observed in the
final browser inspection; unrelated browser-extension warnings were present.

Private evidence includes before screenshots supplied by the owner, after phone
and simulator views, route JSON/screenshots, bridge occlusion and synthetic deck
captures. Owner photos are not public assets or committed to this repository.

## Geographic and licensing continuity

All V0.1–V0.4 snapshots are preserved. V0.4 city remains 545,239 bytes with SHA-256
`23e80e2e65de63f960d9bd8d00931c9d7f6761fc6fb25bfe47db0df31941d1fa`.
436 footprints retain 18 NRCan 2013 heights, 102 City 2009 heights and 316 estimates.
No recently published historic measurement is described as current. MIT code,
OGL–Vancouver and OGL–Canada attributions remain distinct. Only bounded primary
bridge/LiDAR catalogue research was acquired; no point-cloud download or source
artwork was imported. The original synthetic 480 m proof is not Cambie geometry.

## Local verification and release gates

- Vancouver 59/59, integrated Surrey V0.3 35/35 and investment 7/7 tests pass.
- TypeScript/ESLint pass with the existing unrelated tutorial-reader warning.
- Production dependency audit: zero vulnerabilities.
- Both integrated local production build paths passed (Next webpack and Vinext).
  The exact-SHA Linux candidate, capacity/rollback and public health checks must
  pass before activation and are recorded in the deployment receipt.
- The production bundles omit Local elevation proof and Local graphics recovery
  test controls. No external telemetry or server state was added.

## Follow-up priorities

V0.6 should prioritize matched human manual-driving trials, corner/curve steering
and close-building camera framing before adding game systems. Test physical iOS
and Android multitouch and sustained performance. For Cambie, acquire bounded
terrain/deck data in one verified datum, complete both approaches, build curved
surface topology and test both directions/underpasses. Do not expose the synthetic
proof as a geographic bridge. Traffic, pedestrians, missions, multiplayer and a
new backend remain outside this release.
