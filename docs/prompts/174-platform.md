# Prompt 174: Richmond browser acceptance and phone/map follow-up

- Date: 2026-10-31
- Scope: platform
- Goal: Continue the authorized Richmond driving/exploration milestone, preserve accurate gameplay evidence, and finish independent code/release preparation when browser control is unreliable.

## Original user request

> For Vancouver and Surrey, I find on the iPhone, the main playing view is blocked by multiple sub views... Make sure for Richmond this issue is also addressed

> I am going to be away for about an hour. phone is available and locked. deploy when ready.

> Is there an aerial view for richmond?

The user supplied the Richmond Driving, Exploration and Mobile Polish brief,
whose full decision-oriented summary is preserved in journal173 (originally the
isolated branch's148). It requires causal collision diagnosis, normal-controls
before/after A–F journeys, explicit exploration with preserved career and paused
consequences, unobstructed phone input, bounded renderer improvements, unchanged
save/geographic data, actual device distinctions, regression/build/lifecycle
checks and coordinated exact-source deployment only after acceptance. Initial
fixtures are permitted; mid-journey bypasses and false completion claims are not.
If blocked, finish independent work and report the remaining gate honestly.

After an unexpected browser navigation interrupted the office handover, the user
answered the optional question about using that tab:

> I am not sure...

The cause remains unassigned. No user action or application defect is inferred
from that answer. Deployment authorization persists, but required acceptance does
not become optional.

## Scope

Richmond-owned runtime, CSS, map, two focused regressions and acceptance notes in
`codex/richmond-polish-v02`. No immutable map, shared Vancouver physics/input,
other-city save, dependency, backend, site navigation or live-server changes.
The available locked physical phone was not accessed or unlocked.

## Decisions

- Preserve full car collision and real geography. A historical static clear-road
  pose remained traversable; missing historical actor state prevents a definitive
  retrospective cause. Current nearby contacts identified moving traffic and
  separated normally. Existing whole-body/NPC overlap fixes remain unchanged.
- Correct a stale incoming blocked flag that mislabelled resting/braking after
  actor contact as a surface rejection. Preserve first-contact pose, condition,
  time and nearby people/vehicles in developer-only diagnostics. Older raw contact
  labels are explicitly qualified rather than retrospectively treated as proof.
- Exclude the graph's car-to-road projection from turn cues, retaining it on the
  displayed route. Real upcoming junction guidance remains intact.
- Preserve prior play camera/interior on survey return; use aerial-scale clipping,
  aspect-aware whole-city framing and roof-aware labels. No camera teleport.
- Give the map a300m nearby view and regional toggle, draw existing aprons and the
  gold fictional connection, and separate coincident player/car/goal labels.
- Enlarge narrow-screen zoom/status targets to44px. Reduce the obstructing airport
  sign from40m to14m, runway labels from65m to24m, and combine overlapping survey
  and fictional-airfield notices. Loading cannot open blank panels.
- Long browser-control blocks repeatedly stalled or reset in Brave and isolated
  IAB. Record interrupted journeys as incomplete; do not splice fixture restarts
  together or confuse pure physics tests with driving acceptance.

## Implementation

The code follow-up is committed at2030754797ba8c3dedd3dc134c263636c2c15f1e.
The earlier implementation37fcbe5dd926447c5d4284a7e306856a46ce74f5 supplies
whole-body contacts, NPC motion checks, navigation legs, exploration entry,
input ownership and lifecycle improvements. This follow-up fixes issues observed
in actual use and records the controlled journey outcomes in the acceptance log.

## Engineering impact

Schema1 and `asymmetri.richmond.save.v1` remain unchanged. No geographic bytes,
shared handling parameters, dependency or public asset files changed. New labels
are procedural renderer code. Recover remains a fallback; no test was bypassed
with position injection, hidden completion, collision disabling or automatic
recovery. Development fixtures do not read/write the career save.

## Files changed

- Richmond camera/engine/scenery: framing, clipping, label clearance, camera return
  and first-contact diagnostics.
- Richmond Game/Map/CSS: nearby navigation, apron wayfinding, loading guard,
  readable phone targets and non-overlapping notices.
- Richmond vehicle/navigation/tests: accurate resting-contact diagnosis and
  projection-free turn instructions, with two meaningful regression cases.
- Richmond README and acceptance log: exact implemented controls, measured runs,
  evidence caveats, device distinctions and integration/release gates.

## Documentation updated

`docs/RICHMOND_V02_ACCEPTANCE.md` records full A–F status and chronological evidence;
`projects/richmond/README.md` explains map scope and the designated connection.
The old branch-only journal148 is relocated to173 to preserve UBC's upstream148.
Its historical verification content is retained.173/174 were proposed to Stanford/UBC/Case Western. The GIS/Labs owner then
acknowledged the169–174 reservations and proposed175/176; Richmond confirmed no
conflict. No main/server window is reserved.

## Git diff summary

Implementation2030754:12 files,788 insertions,80 deletions. Most additions are
acceptance evidence and limitations. This record and historical-journal relocation
are excluded from that implementation diff.

## Verification

- Local Node24.10.0: final TypeScript and ESLint passed (one existing tutorial-reader navigation warning, zero errors).
- Production dependency audit: zero vulnerabilities.
- Vinext production build: passed, with its existing route-classification warning.
- Sixteen local production route checks passed, including Richmond entry copy,
  GIS city links and protected Motion privacy/support/tutorial pages. Local server
  stopped after checks.
- Production bundle scan: developer journey entry labels absent.
- Privacy/content diff scans: no private-key material, credential-like strings,
  private attachment paths or superseded branding. No public assets added.
- Exact-source Linux CI passed: Richmond36/36 (including all six pure journey
  tests), Surrey54/54, Vancouver74/74; Next webpack production build, checks,
  audit and runtime packaging all passed. Node22.23.1/npm11.6.0, Ubuntu24.04.
- The combined local run produced192 passing tests and one file-level failure
  after the duplicate Richmond journey process was deliberately terminated with
  SIGTERM following its successful Linux completion. Local wall time1764.98s;
  the interrupted local file is not counted as a pass. The Linux Richmond suite
  completed in338.36s. Thirty-four local investment/Ask/brief tests plus164 unique
  city tests verified in Linux yield198 distinct passing test cases across the
  two environments. This is not a claim that the interrupted local command passed.

Normal browser-control results (full measurements and caveats in acceptance log):

| Journey | Baseline | Candidate |
| --- | --- | --- |
| A core delivery | Complete1,527.38m;3 reverses;0 Recover/reset | Complete1,525.01m;1 reverse;0 Recover/reset |
| B mall/shop/departure | Complete;kit bought,same car;4 reverses;0 Recover/reset | Complete;kit bought,same car;3 reverses;0 Recover/reset |
| C terminal takeout | Complete5,919.79m;8 reverses;0 Recover/reset | Complete5,892.28m;7 reverses;0 Recover/reset |
| D airport lunch/office | Blocked4,247.10m;19 reverses;0 Recover/reset | Drove6,161.03m,parked/entered office;12 reverses;0 Recover;navigation lost fixture before handover;incomplete |
| E airfield/walk/return | Complete3,378.66m;3 reverses;0 Recover/reset | Brave interrupted;independent IAB864.21m,1 reverse,0 contacts/Recover before control timeout;incomplete |
| F regional | Not run | Not run |

A/C pickup and exactly-once payment, B purchase/inventory and same-car continuity
were browser-verified. Changed controller revisions, browser viewports, actor
timing and tool latency prohibit attributing raw-count/time differences solely
to handling changes. The recorded D environment state loss is not a zero-reset
end-to-end pass. Automatic breakdown recovery was avoided by stopping baselineD
at condition12.83; the manual Recover counter alone would not prove its absence.

Responsive Brave checks covered390×844,320×567 and844×390 with large text;
zero control/canvas overlap and overflow, minimum targets approximately44px.
Final IAB390×844 play has a390×537.43 canvas with no visible button/select overlap;
map scope controls are44px high. One paused focus-trapped panel and return focus,
clock/pose preservation, graphics-loss retry and three Done/Continue cycles passed.
New map scope preserves player/car/clock. Actual renderer screenshots verify
phone road visibility, the reduced sign, whole-city aerial and settled YVR labels.

Desktop Brave A sampled56–60fps baseline and52–61fps candidate (both medians60,
Lite/DPR1,1134×648); these are sampled HUD data, not a frame-time distribution.
Later IAB phone-sized YVR/whole-city samples were11/18fps under substantial shared
host load. These are neither controlled regression measurements nor iPhone results.
No battery/thermal certification is claimed.

Simulator access timed out again: **Not run**. Physical iPhone and true simultaneous
touch: **Not run**. Remaining gates include full candidateD/E and baseline/candidateF,
map-download failure/retry, consistent district before/after screenshots, quiet-host
performance and remaining device/lifecycle checks. The frozen snapshot and shared
physics/input remain unchanged; save/payment regressions are independent of these
missing browser gates.

## Repository state after implementation commit

Branch `codex/richmond-polish-v02`, implementation2030754 pushed to origin,
based onac677c4. Fresh origin/main is7711e84. No main integration or production
activation. UBC owns the shared window and167/168; Case Western169/170, Stanford
coordination is retained in the acceptance log. The GIS/Labs owner has175/176
and subsequently approved changing only the global submenu label to Campus and
City. Preserve that newer decision when integrating, while retaining/labs/gis,
hub cards/footer and every URL. UBC's current live source remains8eba0e9 per its acknowledgement;
that is peer evidence, not a fresh Richmond server audit. Preserve the live profile
backend, current rollback and protected routes on any eventual integration/release.

Exact-source Linux workflow41242465542 completed successfully for
2030754797ba8c3dedd3dc134c263636c2c15f1e. Artifact13058157874 is254,279,977 bytes;
GitHub ZIP SHA-25642b253620375e6e36df30164c8335c43831c19dcd10fac3c6679519f74585b84.
It expires2026-11-07. Downloaded ZIP and contained tar checksums match their
recorded values. The tar contains the exact source2030754, Node22.23.1 and
BUILD_ID `RRs9qxvQ2bErHVJX7kZTy`. Tar SHA-256:
`6f9f91c85b21310cddf5d2f78ca33fe654d46ed74436d4f173f991b7fe00c362`;
tar size254,279,540 bytes. The archive is retained locally under the dated
Richmond V0.2 preparation directory, with a machine-readable receipt.

This prepared artifact is not proof of main integration, complete gameplay
acceptance or production activation. No Linux tree was staged on the server,
and no live health, capacity or rollback measurement was reused as a current fact.
All owned browser tabs and local preview servers are closed, temporary viewport
overrides reset, and the duplicate local journey worker stopped. Unrelated user
browser tabs/processes were not modified.

## Implementation commits

- 37fcbe5dd926447c5d4284a7e306856a46ce74f5 — Prepare Richmond V0.2 driving and exploration candidate.
- 2030754797ba8c3dedd3dc134c263636c2c15f1e — Refine Richmond camera, map and contact diagnostics from browser acceptance.

## Archive commit

Document Richmond acceptance follow-up and preserve journal ownership

## Lessons learned

Capture the first contact before braking can change its classification. Distinguish
model geometry, navigation projection and tool-input timing. Keep one isolated
browser fixture, checkpoint observed poses and never replay timed-out input blindly.
Viewport requests are not measured CSS sizes. Read actual renderer screenshots:
the airport sign and overlapping notices were visible defects despite passing
geometry and layout tests. Deployment authorization does not waive acceptance.

## Follow-up ideas

Finish the named gates with reliable isolated browser control and a quiet host;
then reconcile newest main (including the Campus and City submenu decision), confirm shared ownership, rerun integration checks and
build a fresh exact-source Linux artifact before the authorized release. Do not
use this older-base checkpoint artifact as a tested combined campus deployment.
