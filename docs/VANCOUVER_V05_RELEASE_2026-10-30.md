# Vancouver V0.5 — experimental release validation

Public route: https://asymmetri.co/labs/vancouver. **V0.5 is deployed.** Guarded
activation completed October 30, 2026 at 21:23:49 UTC (14:23 Vancouver time).
Public acceptance passed on apex and www. The source/build identity and complete
immediately preceding rollback are recorded below.

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
  The exact-SHA Linux candidate and all capacity/rollback/public health checks
  passed as recorded below.
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


## Production deployment receipt

- Implementation: `53fe7545ba05ffde8df5c5509a477729839a380e`.
- Implementation journal 137 / deployed source:
  `44654b31afc61a17667c3fff48f88bc5094a2a3d`.
- Linux build: `em5HpR-sbeh857iO3MUWB`, Node `v22.23.1`, Ubuntu 24.04 GitHub runner.
- [Successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41129619738),
  artifact `13012781269`, 254,148,462-byte runtime tar, 896,283,503 uncompressed bytes.
- Runtime tar SHA-256:
  `16c313d147523793a53a0d1f428c5e1577b5502b0843cf248895699353eb4ba2`.
  Artifact ZIP SHA-256:
  `02225639ce435636ce0509673d87fc32ede186c65fc2daa31292235a3a9dde3c`.

The Linux job passed check, Vancouver tests, production audit and Next webpack
build (including the Surrey prebuild tests). The downloaded ZIP, tar, source SHA,
Node version and build ID were checked before transfer. The remote streamed tar
hash matched; source checkout and dependencies were independent and application
owned. No build or dependency install touched the live tree. The activation moved
whole runtimes, changing only `asymmetri.service`. No OS, Nginx, DNS, TLS, receiver,
peer application or production dependency update was performed.

The private candidate passed 15 routes, eight protected host/path checks, 124
legacy tutorial IDs, 24 original tutorial assets, Motion video/TestFlight behavior,
Ask/Trade and unchanged Surrey main content. Every Vancouver V0.1–V0.4 data file
and Surrey V0.1/V0.3 file matched committed bytes. Native Sharp optimization
returned a valid PNG with HTTP 200. Development-only test panels were absent.

Public apex and www each passed 14 routes, protected main-content/link/canonical
comparisons and tutorial assets. An additional 38 route, redirect and immutable
data checks passed. GIS Apps displayed Vancouver V0.5 and Surrey City Reconstructed.
Local integrated Surrey Street/Aerial modes rendered with no error log. The live
Vancouver browser check at actual CSS 390×844 had no horizontal overflow, clear
play, active acceleration and Menu pause; closing Menu retained 0 km/h, with no
application console errors. This desktop viewport is not physical-phone evidence.
A short live sample averaged 59.5 fps at DPR 0.8; it is not a hardware benchmark.
Keyboard focus wrapping, search/landmark selection and staged Escape were also
verified on the integrated local build.

Five preparation guards passed. The lowest measured available memory was
**217.2 MiB**, and minimum preparation free disk **6.3586 GiB**, above the
192 MiB / 6 GiB floors. Six activation-monitor samples had no violation. Final
health at 21:24:51 UTC showed 368.96 MiB available and 6.3505 GiB free, an active,
running, enabled website with zero restarts and zero post-activation errors.
The expected old-process shutdown exit 143 is recorded separately. Five peer
services, 55 configuration fingerprints, 13 unrelated virtual-host responses and
the Node executable remained unchanged.

### Retention and rollback

An older inactive runtime, source `e909c8da9121f9f9179dfb3d71d78e0621805a85`, build
`At28nruWgLtaH0vOlV-pM`, was losslessly archived to owner storage before retirement.
The 275,773,440-byte archive passed matching SHA-256, gzip integrity and a full
remote tar comparison:
`e807ca4c77d0d9e621c2548bcfbb7bd4eeb426089f615fd36eb8a334ad933c5e`.
Only that inactive, unreferenced directory was removed, recovering 1,023,537,152
bytes. Current and immediately preceding runtimes stayed intact throughout.

The complete immediately preceding production runtime is retained at
**`/var/www/asymmetri-rollback-before-vancouver-v05-20261030`**:
source `248c0a5c382abeba98c601081f2624064dd43a30`, build
`VnQohiF4lOLKTwiRVOpzn`, with executable Linux dependencies and clean source.
The pre-Surrey-V0.3, pre-V0.4 and original pre-Vancouver runtimes also remain.
Automatic rollback was armed and not needed; no deliberate live rollback drill
was performed.

To recover, recheck source/build, clean trees, dependencies, capacity and peers;
stop only `asymmetri.service`, retain the current tree at a fresh failure location,
move the verified preceding whole runtime to `/var/www/asymmetri`, restart that
service and repeat protected/public/peer checks. Never overwrite retained trees
or reset their source in place.

Remote evidence: `/var/lib/asymmetri-vancouver-v05-release-20261030`. Owner-held
checksums, archives, screenshots, JSON and logs are retained outside Git in the
Vancouver V0.5 deployment-retention directory. GitHub artifact expiry is transport
retention only. Subsequent receipt/journal commits change documentation only;
the deployed source/build identity above remains exact.
