# Prompt 137: Vancouver V0.5 clear phone play and driving foundations

- Date: 2026-10-30
- Scope: design
- Goal: Deliver a clearer mobile city view, refine manual driving and establish an isolated elevation foundation.

## Original user request

> Also, I find on the iPhone, the main playing view is blocked by multiple sub views...

> i need the phone. can you use simulator instead?

> why the max speed of the car is only 22km/h?

The complete owner-authored V0.5 brief authorizes autonomous implementation,
testing, commits, pushes and safe production release. Its priorities are manual
handling, honest repeated driving measurements, mobile/touch usability, bounded
bridge/elevation progress, spatial understanding and selected lightweight visual
work. Preserve free roam, scenic Cruise, local navigation, fallback, all old data
URLs and the existing Three.js architecture. Test physical hardware only if
available, distinguish simulation, and do not let an unfinished bridge block
other completed improvements. The owner subsequently requested simulator testing
and provided two phone screenshots illustrating oversized overlays.

The brief requires coordination with Surrey/Richmond/GIS Apps, isolated work,
serialized production activity, Engineering Journal commits and latest-main
integration. Keep existing DigitalOcean architecture and resource floors, build
an independent exact-source Linux candidate, preserve full immediate rollback,
verify protected Motion routes and peer services, and report limitations, measured
results, screenshots, source/build identities and recovery. No unrelated backend,
OS, proxy, TLS/DNS or cross-city refactor is authorized by this release.

## Scope

Vancouver UI, manual input wrapper, camera visibility, synthetic elevation proof,
public Vancouver status and affected documentation. Geography/dependencies/shared
physics and Surrey code are unchanged. Production activation follows separately.

## Decisions

Use one mobile Menu instead of persistent map/route/settings cards, pause while
it is open, and expand Drive automatically. Keep familiar touch buttons with
independent pointer ownership and sliding steering. Make 22/68 km/h pace limits
explicit. Shape steering without route following. Retain bridge driving as
unavailable: primary source research does not establish continuous verified XYZ
approaches. The synthetic development-only proof must not appear in production.

## Implementation

Progressive, speed-sensitive manual steering with fixed substeps; road-edge
warning; Chase/Wide camera constraints and obstructing-bridge fade; compact mobile
controls and menu; map coverage/position wording; per-run diagnostics. The isolated
proof models connected ground/ramp/deck surfaces and a disconnected underpass.

## Engineering impact

No dependency, server state, tracking or shared engine. Collision rules remain.
Phone play exposes substantially more of the road. Manual acceptance is mixed,
not a proven overall improvement: Village contacts decreased, West/North increased.
The release report includes incomplete attempts and camera limitations. No
physical mobile or real Cambie acceptance is claimed.

## Files changed

Vancouver React/CSS/engine/types/tests and new controls, handling, camera and
synthetic elevation modules; own route/status copy; project and repository docs.
No private screenshots or attachment paths were published.

## Documentation updated

README, architecture, content, local development, testing, asset manifest and
project notices describe actual behavior. The release validation and elevation
research reports record measurements, provenance, failures and remaining work.

## Git diff summary

24 files changed, 947 insertions and 76 deletions. Most additions are contained
Vancouver code, meaningful tests and evidence-oriented documentation.

## Verification

59 Vancouver, 35 integrated Surrey and seven investment tests pass. Type/lint
checks pass with one existing tutorial warning; production audit has zero
vulnerabilities. Integrated Next webpack and Vinext builds pass; development-only
controls are absent from production chunks. Added-content privacy/reference scan
and diff checks pass. All old Vancouver datasets and peer project code are intact.

Manual scenic forward/reverse and three forward neighbourhood routes completed
without resets, with measured contacts/recoveries. Fresh optimized desktop sample
averaged 58.9 fps; three view switches retained 85 geometries/11 textures. iPhone
16/iOS 26.5 Simulator Safari passed clear portrait/landscape, Menu pause and
background/resume. Physical multitouch/GPU/battery and forced WebGL-loss retest
remain unperformed. Full measurements and caveats are in the release report.

## Repository state after implementation commit

Main in the isolated Vancouver clone, based on latest peer integration `37d3311`.
Implementation `53fe7545ba05ffde8df5c5509a477729839a380e`; clean before this journal,
one commit ahead of origin/main. GIS/Richmond confirmed Vancouver's next release
window and journal 137. No force push, branch merge or peer overwrite.

## Implementation commits

- `53fe7545ba05ffde8df5c5509a477729839a380e` — Improve Vancouver phone play, manual controls and elevation foundations.

## Archive commit

`Record Vancouver V0.5 implementation decisions and validation`

## Lessons learned

Compact controls need a real playing-area budget. Simulator evidence must remain
separate from hardware evidence. Per-run counters and honest failed attempts are
more useful than describing every handling change as an improvement.

## Follow-up ideas

Matched human driving trials, tight-building camera improvements, physical mobile
multitouch/performance, and bounded datum-consistent Cambie approach/deck data.
