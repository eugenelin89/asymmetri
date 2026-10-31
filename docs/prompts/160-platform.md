# Prompt 160: Surrey V0.6 browser acceptance and integration follow-up

- Date: 2026-10-31
- Scope: platform
- Goal: Complete ordinary-control acceptance, preserve approved releases and correct defects found during play.

## Original user request

> CODEX — SURREY, CITY OF ADVENTURE V0.6: OPEN ROADS & TRANSPORT FREEDOM
>
> Do not stop at a proposal. Inspect the current code, implement the features, test the gameplay using ordinary controls, preserve existing work and deploy through the established safe release process.

The continuing brief prioritizes a validated connected road network, free driving,
GPS/rerouting, safe vehicle continuity, bounded traffic and one complete detour
mission. It requires preserved earlier cases/saves/geography, compact phone views,
ordinary browser gameplay, exact-source Linux preparation, coordinated main/server
activation, protected routes and a complete immediate rollback. Physical-phone
acceptance must be reported separately. If release is blocked, retain the tested
candidate and document the exact remaining gate. The public name remains
**Surrey, City of Adventure**. The earlier iPhone complaint about stacked panels
continues to guide compact layout decisions.

## Scope

Resumed acceptance after the shared browser recovered. Incorporated approved
UBC/homepage releases into the dedicated Surrey branch, resolved journal/document
collisions, corrected GPS guidance and cleared compact views. Local acceptance is
complete within the recorded desktop-browser scope. Production preparation follows
this journal; this record does not claim deployment.

## Decisions

- Serialize browser blocks with Richmond because focus and viewport overrides can
  invalidate another city's measurements. Reset temporary viewports on handback.
- Preserve both journal histories. Move isolated Surrey 149 to 159 because UBC
  independently published 149. Retain historical evidence and the original commit.
- Keep car handling: short steering pulses separated by tool observations do not
  establish a handling defect. Actual boundary stops clear with normal reversing.
- Fix written GPS instructions without changing accepted geometry or collision.
- Move compact help into the existing explicit menu, keep one 44 px objective/GPS
  strip, and suppress redundant aerial and landscape route panels.
- Preserve all UBC code and external profile storage. Any activation needs a fresh
  complete backup of the actual live runtime, never only an old build directory.

## Implementation

Repeated shared source endpoints created zero-length bearings and false turns.
Guidance now skips duplicate legs and chooses the closest outgoing source road.
The Central City detour correctly names City Parkway, 102 Avenue, King George
Boulevard and Old Yale Road; its 1,192.607 m planned geometry is unchanged.

Compact screens place the objective strip immediately below the view controls.
Aerial help, paused speed and the redundant view-hint line no longer obscure the
city. Landscape uses the same single GPS line as portrait. Menu keeps full help,
status, settings and map access.

## Engineering impact

A real-network regression verifies all four turn directions/street names and
rejects endpoint artifacts. No dependencies, backend, telemetry, source data,
vehicle physics or peer-game behavior changed. Additive document merges retain
approved UBC/homepage work.

## Files changed

- Surrey navigation and regression: correct turn instructions.
- Surrey CSS and README: compact clear views and controls.
- Changelog, acceptance, testing and deployment docs: evidence, limitations and gates.
- Main merges: preserve independently approved UBC/homepage content.
- Historical Surrey journal: relocate 149 to 159 without changing observations.

## Documentation updated

The acceptance record separates the October 30 blocker, the interrupted October 31
partial drive and the subsequently completed run. It records actual boundary
contacts and reverse manoeuvres, not a fictitious zero-contact manual drive.
The deployment gate distinguishes local acceptance from production activation.

## Git diff summary

GPS commit 500d69d: 6 files, 78 insertions and 13 deletions (17 insertions and
4 deletions in navigation/regression; the rest evidence documentation).
Compact-layout/acceptance commit 01cf789: 5 files, 74 insertions and 19 deletions.
The two merges retain upstream work rather than claim it as new Surrey code.
This journal is excluded from its own change totals.

## Verification

- 229 regressions pass: 68 Surrey, 74 Vancouver, 27 Richmond, 53 UBC, 7 investment.
- TypeScript/ESLint passes with the existing tutorial navigation warning.
- Production dependency audit: zero vulnerabilities.
- Vinext and Next webpack builds pass. Final local build: C5Eo9f6hB2o2YBhTUDAqQ.
- Exact offline transport/report bytes reproduce; original snapshots are unchanged.
- 24 local production routes/assets pass; seven rebuilt affected/protected routes
  pass again. Tutorial canonical and geographic asset bytes are preserved.
- Ordinary browser controls: Continue, walk to Nora, accept, walk to car, E enter,
  five streets, four junction turns, destination choice, moving reroute, clear/free
  drive, final stop, E exit, walk to Mina and deliver. Actual drive 1,238.3 m; reward
  $85 once; total $105 and inventory zero. No Recover or hidden state injection.
- Reload retains completed case, balance, selected destination and parked pose
  -27.64,471.09,-2.117. Same car re-enters; aerial preserves state and freezes time.
- Rendered portrait/landscape/narrow/tablet checks at CSS 390×844, 844×390, 320×567
  and 820×1180 pass without horizontal overflow. Focus restoration and Escape work.
- Held W+Escape opens Menu and clears acceleration; resumed car stays stationary.
  Repeated reloads retain one canvas. No app console errors; extension warnings
  are separate. Background-tab creation did not establish a hidden page, so no
  actual background-suspension pass is inferred. Automated lifecycle tests pass.
- Sampled desktop rendering reached 39.2–60 FPS with adaptive quality; these are
  snapshots, not sustained performance. Physical iPhone, real simultaneous
  multitouch, app backgrounding and phone thermal behavior remain unverified.
- Git whitespace/privacy scans pass. No private attachment paths are archived.

## Repository state after implementation commit

Dedicated branch codex/surrey-adventure-v06, implementation HEAD 01cf789; clean
before this journal. Approved main 60574c8 is an ancestor. No force push or
unrelated user changes. Main/server window coordinated with UBC, homepage and
Richmond. Live still 526213d / ujW5iepUV_ni0g_OH7ONo at read-only preflight.

## Implementation commits

- a710517: original V0.6 implementation (historical journal b6eae37).
- 9c105ec: preserve approved UBC/homepage through f7230c7 and both journal histories.
- e3f8be2: preserve UBC encounters through 60574c8.
- 500d69d: correct GPS instructions and record resumed evidence.
- 01cf789: clear compact views and complete local acceptance.

## Archive commit

Record Surrey V0.6 completed local browser acceptance.

## Lessons learned

Physical graph validation does not guarantee correct written directions: duplicate
endpoints need explicit guidance coverage. Short tool-separated pulses differ
from held driving input. Save real screenshots and report their viewport/device
scope rather than treating DOM measurements as physical-phone acceptance.

## Follow-up ideas

Finish the authorized exact-source Linux release and live browser verification;
record those separately. Physical iPhone multitouch remains pending. Extra vehicle
footprints and safe train boarding remain deferred as documented in the candidate.
