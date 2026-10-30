# Vancouver V0.6 research and release decision — 2026-10-30

**Retain public Vancouver V0.5. V0.6 was not deployed.** The handling/camera
candidate failed manual acceptance. Real-data Cambie work advances elevation
architecture but remains isolated. This follows the owner's explicit direction
to preserve the stable previous version when changes fail to improve it.

## Scope and isolation

Work started from V0.5 journal `965d5b9e13fc19ecf84947807bb7ec2522fd9bf9` in the
existing isolated Vancouver clone. GIS Apps, Richmond and Surrey coordination
preserved concurrent releases; final integration includes approved main
`fec321bf7fa866cb9f3e3930863432baf0b8de2e`. New handling/camera code lives under
`projects/vancouver/development/`, loaded only in development. V0.5 remains the
default locally too; select the labelled research candidate and restart a route
for comparison. Stable `handling.ts`, `camera.ts`, `physics.ts`, `input.ts`, controls,
public copy and all published V0.1–V0.4 geographic assets are unchanged. No new
backend, westward expansion, cross-city refactor or version-only snapshot.

## Manual comparison

Ordinary native UI key presses, steering from the visible road, braking to inspect.
No Cruise, coordinate injection, route follower or automatic Recover completed a
manual journey. Explicit Recover actions are counted. Stop/observe input includes
observation time and is not continuous human play. Operator learning and changed
camera height are confounds; single runs are not statistical improvement evidence.

Fresh baseline North/Village and candidates A–D used Brave/Next development on
macOS, CSS 1800×984, DPR about 0.8, Auto, Wide camera. Neighbourhoods used Relaxed
(peak 21.8 km/h); scenic runs used Normal straights/Relaxed turns (peak 68.4).
Completed reverse D followed a browser restart, CSS 1800×985/DPR 1.6. Historical
V0.5 scenic runs used an optimized build/DPR 1.333; neighbourhoods used development.
Those historical numbers are context, not controlled pairs.

Raw contacts count blocked-state transitions: one curb incident can cause repeated
counts. Contacts/km divides by actual travelled distance, including reversing.
Steering counts are press starts; rapid opposites occur within three seconds.
Release rotation measures the first 0.3 seconds after release, not deviation from
an intended turn. Time is active-drive / moving seconds. Whole-run frame p95 uses
1 ms bins capped at 200 ms and includes idle observation. Average/minimum FPS is cumulative per
renderer session; inherited minima are not fresh per-route benchmarks.

| Run | Metres | Seconds active / moving | Raw contacts / per km | Recover / reset | Steering / rapid opposite | Release ° | Frame p95 ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| North V0.5 fresh | 958.8 | 408.0 / 181.0 | 6 / 6.26 | 0 / 0 | 23 / 2 | 2.14 | 18 |
| North A partial | 622.6 | 305.9 / 117.8 | 7 / 11.24 | 0 / 0 | 16 / 1 | 2.01 | 18 |
| North B partial | 345.7 | 183.3 / 65.5 | 10 / 28.93 | 0 / 0 | 6 / 0 | 2.33 | 18 |
| North C | 958.5 | 368.6 / 180.6 | 7 / 7.30 | 0 / 0 | 20 / 0 | 2.30 | 18 |
| Village C | 1130.3 | 373.1 / 203.0 | 7 / 6.19 | 1 / 0 | 9 / 0 | 1.95 | 17 |
| Village V0.5 fresh | 1122.2 | 342.2 / 200.0 | 6 / 5.35 | 1 / 0 | 8 / 1 | 2.01 | 17 |
| Village D | 1143.9 | 409.2 / 206.4 | 6 / 5.25 | 0 / 0 | 14 / 2 | 2.07 | 18 |
| West D | 737.6 | 430.9 / 130.3 | 0 / 0.00 | 0 / 0 | 5 / 0 | 2.08 | 19 |
| North D | 999.8 | 394.0 / 187.6 | 15 / 15.00 | 3 / 0 | 21 / 0 | 2.06 | 17 |
| Scenic forward D | 2411.8 | 536.4 / 281.0 | 14 / 5.80 | 5 / 0 | 19 / 0 | 2.04 | 17 |
| Scenic reverse D | 2389.2 | 462.5 / 283.3 | 9 / 3.77 | 5 / 0 | 13 / 0 | 2.15 | 17 |

All non-partial rows reached their roadside stop or completed one scenic lap.
D's five completed routes total 7.682 km, 44 raw contacts, 13 Recover actions and
zero resets. West completed cleanly, but has no fresh baseline. Village reduced
Recover 1→0 with six contacts, but needed more steering presses (8→14) and time.
North regressed against the fresh baseline, 6/0→15/3 contacts/Recover.

| Route | Historical V0.5 metres / contacts / Recover | D metres / contacts / Recover |
|---|---:|---:|
| Scenic forward | 2396.4 / 7 / 4 | 2411.8 / 14 / 5 |
| Scenic reverse | 2425.6 / 6 / 3 | 2389.2 / 9 / 5 |
| Village | 1132.0 / 1 / 1 | 1143.9 / 6 / 0 |
| West | 739.8 / 5 / 0 | 737.6 / 0 / 0 |
| North | 1028.2 / 22 / 1 | 999.8 / 15 / 3 |

Failed A/B attempts are retained. C completed North with seven contacts versus
fresh baseline six, and Village seven/one Recover. An initial reverse D attempt
was interrupted by the browser restart: last visible 2.1 km remaining, at least
one contact and one Recover, no reset. Exact final counters were lost; excluded
from complete totals. The subsequent completed reverse is listed above. Fresh
V0.5 scenic/West repeats remain unperformed; no claim of controlled improvement.

## Findings and experimental changes

**Control:** in fixed-speed pulse diagnostics V0.5 turns 190.97° during a two-second
held input plus release at 19 m/s. D reduces this to 89.40°. A 0.3-second pulse
changes 16.36°→7.74°, release tail 2.80°→1.33°. At 6 m/s both remain exactly 107.58°
(two-second pulse), 8.97° (0.3-second pulse), 1.52° release tail. These are pure
model tests, not manual acceptance. D preserves V0.5's 0.45-second progressive
ramp, 120 Hz substeps, exponential return, acceleration/braking and 6/19 m/s caps;
its high-speed yaw limit falls to 0.85 rad/s. A/B's slower initial response made
low-speed bends harder; C's faster response increased corrections. D's isolated
high-speed improvement did not yield an acceptable overall driving result.
Small exit-heading errors accumulate over long straights; hard stops and curb
recontact chatter make correction frustrating.

**Geometry:** full-car route-centre sampling at 2 m spacing passed 1181 samples
per scenic direction, 558 Village, 366 West and 471 North. This is not proof of
forgiving turns. Four North samples have less than 1 m of lateral freedom on one
side; near Nelson/Beatty (-429.24,-326.29), only 0.75 m left offset is available.
Manitoba's offset and North's consecutive curves remain demanding. No street,
collision margin, vehicle footprint, building or water exclusion was relaxed.

**Camera/interface:** candidate Wide is 24 m behind/17 m high; Chase 15 m/10 m, modest
speed offsets, capped anticipation and faster aim damping. FOV stays 44°; reduced
motion disables candidate anticipation/body lean. A building-height index and
sampled sight-line/near-plane volume allow water and views over low roofs.
Nevertheless a building hid the car in reverse D: four fitting passes are not a
general occlusion guarantee. Optional mild Bear cues leave every route point and
public V0.5 cue unchanged, but do not identify every early curve. The public mobile
Menu, Chase/Wide, map, search, places, aerial controls and Cruise are preserved.
No decorative overhaul was shipped after driving acceptance failed.

## Cambie progress

Real City alignment and 2025 provincial DSM/DEM now support a 1330.625 m connected
research corridor, six explicitly connected surfaces and a separate 125.163 m
Marinaside underpass. Curved monotone height interpolation, finite-width full-car
support, vehicle height/pitch and explicit grade separation are implemented.
A finite-endpoint sampling defect found by full traversal tests was fixed.
Six automated crossings pass (two directions × 15/60/120 Hz). Scripted tracking is
physics evidence, not manual acceptance.

A manual northbound research run covered 1314.9 m in 463.8 s, five raw contacts,
zero Recover/reset, all six surfaces, stopping short of the finite end. It used
candidate C handling, Relaxed bends/Normal deck, with continuous visible height
and no water fall or layer switch. Underpass testing stopped at 52.5 m/one contact:
the deck hid the car. A 33.3 m/two-contact pre-refresh failed attempt is retained.
Manual southbound, public-road connection, bridge navigation, reset/recovery and
complete camera acceptance remain unperformed. **Cambie stays view-only publicly.**
Widths, median/carriageway placement, crossfall and barriers are still illustrative
test geometry; the public city is flat and excludes the full south approach.
See [elevation data and remaining gates](VANCOUVER_V06_ELEVATION_2026-10-30.md).

## Mobile, lifetime and performance

Local iPhone 16 Simulator/iOS 26.5 (23F77): Safari loaded the aerial scene and entered
the expanded portrait Drive view. Further input and landscape checks were blocked
by intermittent native simulator window-control failures. This is partial simulator
verification, not physical-device acceptance. No phone/Mirroring access attempted.
Simultaneous physical multitouch, sustained GPU/thermal/battery measurements, new
simulator landscape/background-resume and touch-camera acceptance were not run.

Desktop CSS 390×844, 320×567, 844×390 and 767×1024 retained one canvas/no horizontal
overflow. Held pointer acceleration/braking worked. Menu froze pose and cleared
input; Map/Routes appeared one at a time. Escape restored canvas focus at zero
speed. Temporary viewport override was reset. Pure independent-pointer tests do
not constitute physical multitouch acceptance.

Forced WebGL loss showed readable place content/fallback; Restore recreated one
scene. Three pause→resume→scenic-entry cycles each removed the canvas on pause and
returned to 85 geometries/11 textures/41 draw calls/122190 triangles at the same
short-drive pose. No accumulation observed in these counters; not a full heap or
native-GPU leak proof. Console inspection found no application errors; warnings
originated in a browser extension. Native unsupported-WebGL hardware and reduced-
motion visual acceptance were not rerun; reduced-motion code was reviewed.

D completed-run whole-frame p95 is 17–19 ms, rolling ending p95 about 16.8–18.7 ms,
average around 60 FPS. Reverse at DPR 1.6 ended with 49 draws/121576 triangles/85 geometries/
11 textures; scene counts vary by view. Fresh baseline/candidate North p95 both
17–18 ms; no material pacing difference observed in these samples. These development
desktop samples do not establish matched production or iPhone performance.

## Release identity and evidence

No V0.6 Linux artifact was activated. The current independently built shared
runtime is Surrey V0.5, including Vancouver V0.5/Richmond V0.1: source
`fcd2b900b512652a94af07571b841e823c61d2de`, Linux build `VaAKfIoEAK5LbGri4K8V8`,
Node 22.23.1. [Shared runtime receipt](SURREY_V05_RELEASE_2026-10-30.md).
Complete immediate rollback: `/var/www/asymmetri-rollback-before-surrey-v05-20261030`,
source `be6fc3bc069cd77b54240846b27166027b333d3b`, build `gIRztyRG7Pdh1DR3AAHQR`.
This work performs no server mutation or activation. Implementation/journal SHAs
are in [Engineering Journal 147](prompts/147-platform.md) and the final handoff,
avoiding a self-reference.
Final automated/build and fresh read-only health results follow below.

Private JSON, screenshots, bounded sources, profiles and logs remain outside Git
in the deployment-retention `2026-10-30/vancouver-v06` collection. Evidence includes
North/Village before-and-after, all completed candidate routes, reverse camera
obstruction, Cambie profile/northbound/underpass, and compact portrait/landscape.
Owner-provided phone photographs are not republished as repository assets.

## V0.7 priorities

1. Independent continuous human driving, matched optimized builds and repeated
   baselines for all five routes; retain failed attempts and distinct incidents.
2. Diagnose swept turning/curb separation at Manitoba/Nelson/Beatty while preserving
   full-car, building and water protection.
3. Resolve camera occlusion with obstruction fixtures and live reverse/underpass tests.
4. Verify lane/deck widths and ground-datum transitions at both Cambie approaches,
   then both manual directions, reset/recovery and grade-aware navigation.
5. Complete simulator interaction and authorized physical multitouch/GPU profiling.

## Final verification receipt

- Local Node 24.10.0 matches `.nvmrc`; nvm unavailable. All 162 tests pass:
  74 Vancouver, 54 Surrey, 27 Richmond, 7 investment.
- TypeScript and lint pass, with only the pre-existing tutorial navigation warning.
  Production dependency audit: zero vulnerabilities. `git diff --check` passes.
- Next webpack and Vinext production builds pass. Local macOS Next build ID
  `mY8AJASFE7pLrIJKOXRmc` is a local verification build, not the deployed Linux ID.
  Production JS scans exclude research UI, evidence module and Cambie data in both
  output formats (development caches are outside the production scan).
- Local optimized browser: V0.5 label/default, manual acceleration/braking, one
  canvas, no research UI/evidence payload and no application console errors.
- Offline Cambie extraction reproduces 28668 bytes and its exact pinned SHA256.
- Fresh server inspection at 2026-10-30 23:51:59 UTC confirms source/build and full
  rollback above, active/running/enabled, zero automatic restarts and no application
  error entries since activation. Available memory 392084 KiB; disk 9619292160 bytes
  (above 192 MiB/6 GiB floors). All 55 configuration hashes, 13 peer virtual hosts,
  peer-service process identities and Node binary match Surrey's retained baseline.
- Fresh public apex and www each pass 16 routes and 24 tutorial-image hashes, including
  GIS Apps, Vancouver, Surrey, Richmond, Motion, privacy/support and BotSquad.
  Protected content/canonical/IDs match the preceding Surrey receipt.
- Another 56 public checks pass: GIS navigation, Motion tutorial canonicals and
  redirects, all Vancouver snapshot identities, Surrey snapshot identities on both
  hosts, and sampled Richmond manifest/city/tile identities on both hosts. This is
  not a new exhaustive check of all Richmond output files.
