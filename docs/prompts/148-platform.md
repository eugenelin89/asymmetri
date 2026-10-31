# Prompt 148: Richmond driving and exploration candidate

- Date: 2026-10-30
- Scope: platform
- Goal: Improve Richmond driving, aerial access and phone input while preserving career and geography, with controlled gameplay gates before release.

## Original user request

> For Vancouver and Surrey, I find on the iPhone, the main playing view is blocked by multiple sub views... Make sure for Richmond this issue is also addressed

> I am going to be away for about an hour. phone is available and locked. deploy when ready.

> Is there an aerial view for richmond?

The latest attached implementation brief is headed **Richmond Learns to Drive —
Next milestone: Driving, Exploration and Mobile Polish**. Its decision-oriented
requirements are: confirm the actual baseline and independent city ownership;
diagnose prior road stops and traffic overlap before tuning; preserve full car
collision, grade separation, frame-rate stability and explicit recovery; make
manual control and parking predictable; separate driving, entrance, interior and
return-to-car navigation; measure comparable normal-control A–F browser journeys
(core, mall, terminal/bridge, airport-office, runway/walking/return and regional).
Target zero Recover/reset and unexplained stops. Initial fixtures are allowed,
mid-journey state bypasses are not. Pure tests do not prove browser completion.

Improve the existing aerial system with Continue, Start Delivery Shift, Explore
Richmond and Open Airfield entry choices, Find Me/Car, Whole City, landmarks and
Return to Player. Preserve active career, orders, positions and interior context;
aerial survey pauses consequences and never teleports the courier. New-career
replacement requires explicit confirmation. Keep phone controls outside the scene,
one paused focused panel, safe areas, landscape and larger text; test independent
multitouch ownership and cancellation/focus/background/orientation clearing.

Bound visual work to readability, camera clearance and population distribution,
preserving multicultural content and Gentle Streets. Preserve v1 save namespace,
old valid careers, immutable data and attribution. Run city/site tests, checks,
builds, dependency and lifecycle checks; record real renderer images, settings,
frame pacing and device limitations. Never unlock the phone. Coordinate main,
journal and release windows, use exact tested Linux artifacts and fresh capacity,
rollback/protected-route/peer checks. If blocked, finish independent implementation
and release preparation, disclose the blocker, and do not claim deployment.

## Scope

Richmond runtime, tests and documentation in the existing independent clone on
`codex/richmond-polish-v02`. No city data regeneration, shared physics/input change,
new dependency, public-copy change, account, tracking, backend or server mutation.
The requested isolated workflow takes precedence over the repository main default.

## Decisions

- Reproduced two pure baseline failures: NPC junction rotation introducing a
  0.185079m overlap, and a turning overlap deepening from0.239693m to0.251139m.
  Fixed body-level contact and checked motion; shared handling parameters remain.
- The historical clear-road stop could not be reproduced with its retained pose.
  Its unknown dynamic state remains a limitation, not an asserted fix.
- Improved existing navigation/camera/input rather than duplicating the engine.
  Retained the existing per-source input map; tightened lifecycle and pointer-owner
  handling. Kept scene/controls in separate phone layout regions.
- Kept initial developer fixtures isolated from career storage and excluded their
  controls from production. Browser automation used normal interaction/key inputs.
- Browser mouse/capture controls stopped working and baseline animation stopped
  advancing, including after an environment reload. Keyboard menus remained usable.
  No controlled before/after acceptance could be completed. Production remains V0.1.
- Existing deployment authority does not justify bypassing the user's gameplay
  gates. This candidate is committed on its isolated branch, without main integration
  or activation. Physical iPhone remains Not run; no unlock was attempted.

## Implementation

Richmond-owned SAT/circle body contacts, perimeter/footprint checks and intermediate
vehicle motion; collision-aware NPC turns; nearby actor retention and entrance
clearance; activity-specific navigation/advance-turn text; explicit exploration
entry and aerial controls that preserve interiors; saved Lite DPR; height-aware
interior camera obstruction; stronger input cancellation and held keyboard buttons.
Map data validated for Continue is reused when starting. Idle aerial frames retain
Find Me follow. Visible survey labels identify the player and parked car.

## Engineering impact

No schema or namespace changes. Stronger geometry validation may repair a formerly
accepted overlapping position while preserving its career. Geography and other city
keys remain byte-for-byte unchanged. No public asset files were added. New camera
and distribution visuals require renderer acceptance. No sustained phone, thermal,
battery or memory/performance certification is claimed.

## Files changed

- Richmond collision, vehicle, navigation, world, population and simulation implement
  the behavioral changes; camera/interiors/engine implement viewing and lifecycle.
- Game/types/styles expose the entry flow and compact controls.
- Developer fixtures and both test suites provide reproducible initial scenarios
  and actual-wrapper regression coverage.
- Richmond README, architecture, local-development, testing and acceptance documents
  explain candidate behavior and blocked release gates.

## Documentation updated

`RICHMOND_V02_ACCEPTANCE.md` retains baseline reproductions, the incomplete browser
matrix, actual hardware/settings samples, screenshot limitations, save behavior,
checks and release prerequisites. Existing V0.1 release receipts remain historical.
No old resource measurement is reused as current server capacity evidence.

## Git diff summary

Implementation:20 files,1,396 insertions,181 deletions. Changes are scoped to
Richmond and necessary documentation. No dependency, snapshot or shared-module diff.

## Verification

- Richmond34/34 pass, including continuous actual-wrapper journeys, all688 output
  hashes, payments/shops/saves, airfield/cameras/pause and15/30/60/120Hz contact cases.
- Vancouver/Surrey/core investment135/135 pass; Ask/brief27/27 pass:196 unique targeted
  automated tests. Next prebuild independently repeated Surrey54/54.
- Typecheck/lint pass; one pre-existing tutorial navigation warning.
- Next production and Vinext production builds pass; production fixture strings absent.
- Audit reports zero vulnerabilities. Sixteen local production route checks pass.
- Diff and scoped secret/private-attachment scans pass. No dependency changes.
- Two unrelated Trade integration invocations stopped at their required synthetic
  server environment assertions; neither is represented as passing.
- Browser A baseline: pickup/exit/same-car return,173.62m drive, two explained boundary
  incidents, one successful reverse correction, zero Recover, one environment reload;
  no handover/payment. Candidate only had an8m zero-contact/zero-Recover smoke.
  B–F and clean comparisons are Not run. New phone layouts, real multitouch,
  final lifecycle cases and consistent scene screenshots remain unverified.
- Simulator control timed out. Locked physical iPhone Not run. Desktop observations
  on M4/16GiB Brave include57–60fps brief samples, not a sustained benchmark.

## Repository state after implementation commit

Branch `codex/richmond-polish-v02`, implementation `37fcbe5dd926447c5d4284a7e306856a46ce74f5`; clean tracked tree before
writing this journal, one commit ahead of reconciled main `ac677c4`. The branch is
prepared for ordinary non-force push; main and production remain untouched.
Vancouver and Surrey acknowledged journal148 without conflict. GIS received the
coordination update but returned no new acknowledgement. No production window held.
Local test servers are stopped at handoff. Logs, ordinary-key helper and two baseline
renderer captures are retained outside Git for the next acceptance session.

## Implementation commits

- `37fcbe5dd926447c5d4284a7e306856a46ce74f5` — Prepare Richmond V0.2 driving and exploration candidate

## Archive commit

`Document Richmond V0.2 candidate and blocked browser acceptance`

## Lessons learned

A successful geometry suite and HTTP smoke are separate from comfortable manual
play. Preserve interrupted evidence and exact helper/settings versions. Collision
correctness should be fixed at the body/step boundary, not by widening geography
or strengthening recovery. A locked phone and desktop Lite do not establish iPhone
acceptance. Resume from this branch and evidence, then reconcile current main and
reserve a release window only after the outstanding browser gates pass.
