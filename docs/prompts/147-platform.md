# Prompt 147: Vancouver V0.6 measured research and release decision

- Date: 2026-10-30
- Scope: platform
- Goal: Measure driving changes and advance real-data Cambie elevation without releasing a regression.

## Original user request

> VANCOUVER V0.6 — Better Driving, Real Bridges

The attached brief authorized autonomous engineering, actual manual UI tests,
commits, pushes and conditional production release. It requested a reproducible
V0.5 comparison across all five routes; separate diagnosis of input, geometry and
camera problems; predictable steering; camera clearance; and a bounded Cambie
candidate based on licensed real alignment and consistent elevation datums.
Bridge driving could be public only after meaningful entrance, exit, full-car,
water, grade-separation, camera, reset and navigation acceptance in both directions.
Otherwise an isolated candidate was acceptable. The owner explicitly preferred
retaining the stable previous release if no acceptable improvement emerged.

The brief also required preserving the V0.5 mobile Menu, testing through Simulator
and desktop tools without reacquiring the owner's phone, honest disclosure of
unperformed hardware tests, and recognizable geography without westward expansion.
Keep Three.js/WebGL2, route isolation, fallback, cleanup and immutable V0.1–V0.4
data; avoid a new backend or cross-city engine. Coordinate Surrey, Richmond and
GIS Apps; use the next journal ID, normal Git integration and serialized deployment.
Any release required both production builds, relevant suites, independent Linux
identity, protected-site checks, resource floors and complete-runtime rollback.
The final report must include comparisons, failed tests, bridge/data/mobile status,
performance, screenshots, Git/runtime identities, health and V0.7 priorities.

## Scope

Vancouver-only development diagnostics, handling/camera experiments, curved
elevation support, reproducible real-data Cambie extraction, automated tests and
evidence documentation. Shared documentation received scoped appendices. No
shared physics modification, public version/copy change, new public snapshot,
production activation, server cleanup or unrelated service mutation.

## Decisions

- Keep Vancouver V0.5 live. Candidate D failed the fresh North comparison and did
  not establish non-regression across the remaining routes. Do not relabel a
  research result as an accepted game release.
- Keep V0.5 as the local default, with explicit development-only comparison UI.
  Production builds omit the research modules and data.
- Preserve A/B failures, C results, an interrupted reverse attempt, and all five
  completed D journeys. Automated path tracking is never manual acceptance.
- Use City plan alignment and bounded 2025 BC DSM/DEM in documented horizontal
  and vertical coordinates. Keep estimated profile values distinct from surveyed
  road levels, illustrative widths and the public city's flat ground datum.
- Keep Cambie view-only publicly. Camera visibility, carriageway verification,
  public approach integration and manual southbound acceptance remain open.
- Coordinate a brief main/journal window with the other GIS chats. Surrey and
  Richmond acknowledged journal 147 and the integration window; no deployment
  window or capacity cleanup was needed.

## Implementation

Development-only comparison preserves candidate D's high-speed steering limit,
exact Relaxed response, camera anticipation/height fitting and optional mild bend
cues. Bounded in-memory evidence records contacts, corrections, release rotation
and frame bins. The public handling, camera, input and physics modules are unchanged.

The Cambie lab connects six visible curved surfaces across 1330.625 m, with a
separate 125.163 m underpass. Monotone height interpolation, explicit graph nodes,
full-car support and continuous vehicle height/pitch prevent XY crossings from
becoming automatic deck connections. Traversal tests exposed and fixed an endpoint
sampling defect. A pinned offline builder reproduces a 28668-byte source-only
research snapshot, with inputs, licences, acquisition/retrieval dates, checksums,
transformations and uncertainty documented.

## Engineering impact

No new production dependency, backend, persistent user data or upload. Research
evidence remains in memory; retained test logs, screenshots and source files stay
outside Git. Python extraction uses a separate pinned environment. Production
builds retain V0.5 behavior and exclude the new lab, comparison UI and dataset.
The elevation architecture remains isolated from public city driving. Existing
fallback, mobile Menu, published data URLs and independent-project copy remain.

## Files changed

- Vancouver engine/types and Explorer expose explicit local comparisons; navigation
  can optionally add bend cues without changing route geometry.
- The development directory holds the candidate controller/camera, bounded evidence,
  Cambie lab, immutable research JSON and operating instructions.
- Elevation sampling and Vancouver tests cover real curved surfaces, seams, full-car
  traversal, grade separation, immutable data and candidate input/camera constraints.
- The offline extraction builder and Python requirements pin reproducible inputs.
- Project documentation, attribution and shared scoped appendices explain the
  research boundary and failed acceptance decision.

## Documentation updated

The V0.6 research report contains complete and failed manual runs, matched versus
historical comparisons, environments, performance, mobile limitations and live
health. The elevation report records source evidence and remaining bridge gates.
Project README/development README and third-party notices explain how to reproduce
and interpret the candidate. Architecture, local development, testing and asset
manifest appendices describe isolation, commands, checks and the source-only asset.

## Git diff summary

Implementation: 23 files changed, 1062 insertions and 17 deletions. Most additions
are isolated research code, real-data extraction, tests and evidence documentation.
This journal is excluded from those totals.

## Verification

- 162 tests pass: 74 Vancouver, 54 Surrey, 27 Richmond and 7 investment.
- TypeScript and lint pass; one pre-existing tutorial navigation warning remains.
  Production dependency audit reports zero vulnerabilities. Staged whitespace and
  credential/private-path/prohibited-copy scans pass after removing two extra EOF
  blank lines; no owner photographs or private application assets were published.
- Next webpack and Vinext production builds pass on local Node 24.10.0, matching
  `.nvmrc`; nvm is unavailable. Both production JS scans omit research modules/data.
  Local Next ID `mY8AJASFE7pLrIJKOXRmc` is not a Linux deployment identity.
- Local optimized browser retains V0.5, acceleration/braking, one canvas, no
  research payload/UI and no application console errors.
- Candidate D completed all five routes: 7.682 km, 44 raw contacts, 13 Recover
  actions and zero resets. Fresh North baseline 6 contacts/0 Recover became 15/3;
  fresh Village 6/1 became 6/0, with more steering presses and time. West was clean
  but lacked a fresh baseline. Scenic forward/reverse recorded 14/5 and 9/5;
  historical V0.5 recorded 7/4 and 6/3 in different environments. No consistent
  improvement claim. Failed A/B and interrupted reverse evidence is retained.
- Candidate desktop whole-run frame p95 was 17–19 ms, including observation time;
  this is not a matched production or physical-phone benchmark.
- Six automated Cambie traversals pass, both directions at 15/60/120 Hz. Manual
  northbound crossed all six surfaces over 1314.9 m with five contacts and no
  Recover/reset. Underpass camera testing failed; southbound manual acceptance and
  public integration remain unperformed. Offline extraction is byte-identical.
- Responsive desktop checks cover 320/390 px portrait, 844 px landscape and tablet,
  held pointer controls, menu input cancellation, single-panel ownership and focus
  return. Forced WebGL loss/recovery works. Three pause/resume/route cycles return
  to the same geometry/texture counters; this is not exhaustive heap/GPU leak proof.
- iPhone 16 Simulator/iOS 26.5 rendered aerial and expanded portrait driving.
  Further native control failed intermittently. No new simulator landscape,
  background/resume, actual simultaneous multitouch, thermal/battery or physical
  phone acceptance. No owner phone access attempted. Reduced-motion code was
  reviewed, but visual acceptance was not rerun.
- Read-only live inspection at 2026-10-30 23:51:59 UTC confirms active/running/enabled,
  zero automatic restarts, no application errors since activation, 392084 KiB
  available memory and 9619292160 bytes free disk, above the 192 MiB/6 GiB floors.
  Configuration hashes, peer vhosts, peer processes and Node binary are unchanged.
- Both public hosts pass 16 routes and 24 tutorial-image checks each, including
  GIS Apps, Vancouver, Surrey, Richmond, Motion and BotSquad. Another 56 checks
  pass for navigation, canonicals/redirects and snapshot identities, including
  sampled Richmond tiles. This does not claim a new exhaustive Richmond tile scan.
- No V0.6 Linux build or activation. Serving source remains
  `fcd2b900b512652a94af07571b841e823c61d2de`, Linux ID `VaAKfIoEAK5LbGri4K8V8`,
  Node 22.23.1. Complete immediate rollback remains
  `/var/www/asymmetri-rollback-before-surrey-v05-20261030`, source
  `be6fc3bc069cd77b54240846b27166027b333d3b`, build `gIRztyRG7Pdh1DR3AAHQR`.

## Repository state after implementation commit

Branch `main`, implementation `a025202e29840f519ac41612464eb82f4c231b61`, clean tree
before creating this journal, one commit ahead of verified `origin/main`
`fec321bf7fa866cb9f3e3930863432baf0b8de2e`. The implementation includes concurrent
Surrey/Richmond releases and preserves their files. Normal push follows this
separate archive commit; no branch, worktree, PR, merge or force-push was used.

## Implementation commits

- `a025202e29840f519ac41612464eb82f4c231b61` — Preserve V0.5 after measured V0.6
  driving and Cambie research.

## Archive commit

`Document Vancouver V0.6 research in engineering journal 147`

## Lessons learned

Pure controller improvements do not establish easier driving. Tight geometry,
camera obstruction and stop/observe input need separate evidence. Historical
contact counts cannot substitute for fresh controlled baselines. Raster-derived
bridge height alone does not establish a safe drivable carriageway or public
ground connection. Preserve an accepted release when measured results regress.

## Follow-up ideas

V0.7 may add repeated continuous human driving in matched optimized builds;
geometry/curb diagnosis at Manitoba, Nelson and Beatty; camera obstruction
fixtures; verified Cambie lane widths and ground datum transitions; both manual
bridge directions; and complete simulator/authorized physical input profiling.
These remain future work, not accepted or deployed features.
