# Richmond V0.2 — driving and exploration work in progress

Baseline: `1ce3b1e5f518d219d461ae6952927270a7f85f2c`, Richmond V0.1, isolated
`codex/richmond-polish-v02`. Current live runtime at rebaseline was Surrey V0.5
`fcd2b900b512652a94af07571b841e823c61d2de` / `VaAKfIoEAK5LbGri4K8V8`, including
Richmond V0.1. This document is local acceptance, not a release receipt.

Vancouver, Surrey and GIS Apps coordination messages were sent through chat tools.
Vancouver confirmed that its V0.6 manual candidate failed; its shared physics and
input exports stay unchanged. Surrey confirmed no transferable multi-pointer
certification. No main, journal or server window is held during local experiments.
Vancouver subsequently published isolated research/docs at `ac677c4` (journal147),
without changing production. The isolated checkout was fast-forwarded to that main without conflicts before final checks. Vancouver and Surrey acknowledged no conflict with journal148. GIS received the update; no new acknowledgement was returned. No production window was reserved.

## Reproductions before candidate movement changes

The immutable map and imported Vancouver `physics.ts` are unchanged. A frozen
baseline source tree plus development-only initial fixtures is retained outside
Git for like-for-like browser runs. Fixtures use seed18273, Lite, density1, Gentle
Streets and north-up top view; no mid-journey state controls or career writes.
Actual render resolution must be recorded: V0.1 did not apply saved Lite DPR on
initial renderer creation; V0.2 corrects this.

- Historical clear-road pose x−1319.23, z−1495.80, y0, yaw5.902: baseline static
  world fits. Two seconds of normal integrator input travels16.0667m forward or
  8.0252m reverse with no contact. A single-obstacle position/heading sweep found
  no two-way trap at that pose. This does not reproduce the historical incident
  or establish its cause; historical dynamic actor state was not retained.
- Actual population junction rotation: actor202 on edge32759, t.999,
  x−1220.646277/z−1542.297750/y0/yaw1.109618 turns to edge32760 and rotates into a
  stationary car at x−1220.898666/z−1546.454140/yaw2.356194. Initial penetration0;
  after50ms baseline penetration0.185079m. The nose-distance heuristic missed the
  rotating footprint. Candidate checks translation/rotation before accepting it.
- Existing overlap separation: on a broad runway fixture, an actor at relative
  x+2.75/z−.5/yaw7π/8 overlaps a car initially facing yaw0, speed1, steer.3.
  Forward-left for50ms deepens baseline penetration from.239693 to.251139m.
  The centre-normal rule does not measure full rotated-body penetration.
  Candidate SAT/circle-body contact checks reject increasing depth and permit
  sliding/separation. Regression passes at15/30/60/120Hz.

## Browser baseline log — incomplete

Brave Work on macOS, local Next development. Normal key controls only. The first
core fixture accepted First Day, walked restaurant corridors, collected order1,
exited and re-entered the same car. Initial helper (4.2m lookahead, 3m/s turn cap)
reached173.62m driven distance before two road-edge stops:

1. x103.79/z43.71/yaw−1.094, no nearby traffic; first reverse correction succeeded.
2. x102.55/z146.10/yaw−.780, no nearby traffic; diagnostic surface/elevation
   rejection. Actual roads at the second turn are8.6m wide, not a missing road.

Four raw contact onsets, two incidents, zero Recover, no payment/handover yet.
These are late-turn/whole-car boundary contacts, not unexplained clear-road stops.
A revised key helper uses6m lookahead and2.5m/s corner speed; results must be
measured separately and repeated identically for baseline/candidate. Do not
compare different helper versions as a handling improvement.

After a second test tab was opened, browser input/screenshot commands began timing
out and the baseline animation stopped advancing while its DOM stayed responsive.
The CSS viewport also changed to810×411. Keyboard menu actions worked, but elapsed
simulation time remained122.2841s. This interrupted run is not a completed journey.
One environment reload aborted that run. A fresh fixture then accepted keyboard interactions but stayed at elapsed0 after a one-second throttle hold; mouse input and screenshots still timed out. All six controlled clean journeys remain pending.

## Implemented candidate

- Richmond-owned rotated body contacts, grade separation and checked intermediate
  motion around the unchanged shared integrator. NPC movement checks both translation
  and rotation, rejects overlaps before accepting the turn, and retains its old edge
  and pose when blocked. Real widths, accelerations, steering limits and geography
  were not tuned to conceal failed driving.
- Full perimeter support and exact footprint-edge collision checks replace the old
  nine-point static predicate. Existing overlap can separate without increasing
  penetration. Recover remains an explicit fallback, with unchanged semantics.
- Navigation separates driving to parking, walking to an entrance, indoor corridors
  and return to the same parked car. Short advance-turn text replaces the driving
  prompt. An active order cannot be overwritten by a free-roam destination.
- Continue appears after save validation. Start Delivery Shift opens the order board;
  Explore Richmond opens the existing aerial camera; Open Airfield enables the
  fictional permission and surveys/routes toward the designated office connection.
  These entry buttons retain the career. Settings requires explicit confirmation
  to replace it. The map loaded for save validation is reused on start.
- Find Me, Find My Car, Whole City, six landmark shortcuts and Return to Player are
  visible in aerial mode. Drag orbits, right-drag/WASD/arrows pan, wheel/+/- zoom.
  Top down is still playable. Interior survey uses the exterior entrance, keeps the
  actual courier indoors and restores the prior play camera. Idle pan no longer
  cancels Find Me follow. Aerial consequences and clocks remain paused.
- Existing per-source input ownership is retained. A second canvas pointer cannot
  steal the active gesture. Cancel/lost capture release only the owning pointer;
  blur, hidden tab, orientation changes, panels and disposal clear held input.
  Focused touch buttons also accept held Enter/Space. Phone scene/controls remain
  separate grid regions, with one inert-background paused panel.
- Nearby actors survive district refresh instead of all respawning. New pedestrians
  leave entrance clearance, parked/moving cars reject overlap, and counts remain
  bounded. Interior camera checks use furniture heights instead of treating every
  obstacle as infinitely tall. Aerial courier/car labels and saved Lite DPR are fixed.
  These visual changes still require renderer comparison.

## Before/after browser result matrix

| Journey | Baseline this milestone | Candidate this milestone |
| --- | --- | --- |
| A: core delivery | Pickup, exit and same-car return; interrupted after173.62m; two explained boundary stops; one successful reverse correction; zero Recover; one environment reload; no handover/payment | Separate initial free-roam smoke drove8m with zero Recover/contact; not a measured A completion |
| B: mall/shop/departure | Not run | Not run |
| C: Terminal Takeout/bridge/terminal | Not run | Not run |
| D: Airport Lunch Run/office | Not run | Not run |
| E: office/apron/taxiway/runway/walk/return | Not run | Not run |
| F: regional Terra Nova or Steveston | Not run | Not run |

No clean before/after driving acceptance is claimed. The two baseline boundary
incidents are explained by late steering; the old clear-road incident remains
unreproduced. A revised ordinary-key helper was prepared but never ran while the
animation advanced. Initial fixtures are developer-only, with no career writes
and no mid-journey bypass. No candidate Recover or reset was used in its brief smoke.
The initial baseline retained cash20, health100, car100 and the collected order;
there was no payment. Candidate career save remained readable in the opening flow.
No app console error was observed before the control interruption; unrelated browser
extension warnings do not establish an app failure.

## Device, screenshots and performance evidence

Hardware: Apple M4,16GiB RAM, macOS; installed Brave application version
156.1.98.62, Work profile, local Next development. These are desktop observations,
not iPhone measurements. The candidate smoke preceded the last camera/population
polish and is not final-candidate performance acceptance.

| Scene/settings | Observed data | Limits |
| --- | --- | --- |
| Baseline core fixture: Lite,density1,Gentle,north-up top | HUD approximately60fps before interruption; simulation122.2841s at interruption | Original initial renderer ignored saved Lite DPR; no sustained frame distribution retained |
| Candidate aerial: normal quality,density1 | 60fps; DPR1.5;1521×779 render buffer;757 calls;168 geometries;14 textures;0 detail tiles;100 people;31 cars | Single scene sample; no sustained benchmark |
| Candidate after initial8m drive | 57fps; DPR1.5;1521×779;151 calls;214 geometries;15 textures;8 tiles;100 people;31 cars | Latest frame83.4ms during menu/loading transition; no p95 or memory/thermal measurement |

The original baseline renderer screenshots are retained outside the repository as
`baseline-core.png` and `baseline-core-turn.png` (the latter includes a panel).
Candidate aerial was visually observed but its screenshot was not saved before
capture stopped working. No consistent district before/after image set exists yet.
Do not substitute generated illustrations or old V0.1 images for this gate.

- Desktop browser: initial opening/aerial/Find Me/Return/F/short drive smoke only.
- Responsive emulation: final candidate portrait, landscape, narrow/large text,
  tablet, focus and overflow checks **not completed**. Existing V0.1 evidence is
  historical and cannot certify this candidate.
- iOS Simulator: **Not run**; app-control request timed out.
- Physical iPhone: **Not run**; the locked phone was not accessed or unlocked.
- Actual simultaneous touch, background/resume and rotation: **Not run**.
- Final-candidate map failure/retry, repeated route entry/disposal and WebGL context
  loss: **Not run** in the interrupted browser environment. Existing mechanisms and
  developer-only graphics-loss button are retained for the next acceptance run.

## Saves, data and automated checks

Save namespace/schema remain `asymmetri.richmond.save.v1`/version1. Representative
old saves retain cash, equipment, active collected orders, parked car and settled
transactions. Pickup identity, exactly-once payment, shopping, pause, airfield and
Gentle Streets regressions remain in the suite. Stronger footprint validation may
repair a formerly accepted but actually overlapping pose; it does not discard the
career or change its schema. Invalid saves still require explicit reset.

Immutable snapshot `v0.1-2026-10-30` is unchanged. City SHA-256 remains
`a9cac23e9143dc6bb6f72b9690283a3265eefba0a2f309905f2ac6ddfd1814dd`.
The tests verify all688 declared output hashes. Shared Vancouver physics/input,
other city saves, site grouping, public project copy and dependencies are unchanged.

Final local checks, Node24.10.0 matching `.nvmrc` major24:

- Richmond: **34/34 pass**, including actual wrapper journeys;264.975s.
- Vancouver/Surrey/core investment: **135/135 pass**;60.787s. The Next prebuild
  independently ran Surrey54/54 before Richmond.
- Ask UI and investment brief: **27/27 pass**;0.394s. Total unique targeted tests196.
- `npm run check`: pass after upstream reconciliation and final runtime edits;
  one pre-existing `tutorial-reader.tsx` navigation warning, zero errors.
- `npm run build:next`: pass (Turbopack); `npm run build`: pass (Vinext).
- `npm audit --omit=dev`: zero vulnerabilities.
- Sixteen local production-build route responses and Richmond/GIS navigation/entry
  copy checks: pass. Developer fixture markers are absent from production JS.
- `git diff --check`: pass. No snapshot, dependency or shared physics/input diff.

These builds retain existing Browserslist-age/Vinext classification warnings.
No dependency update was introduced to silence unrelated warnings. Automated motion
and HTTP checks are distinct from the incomplete browser matrix above. Two unrelated Trade integration scripts
were initially invoked without their required disposable synthetic server and
stopped at their environment assertions; they are not passed checks. The historical
compatibility fallback suite is not a test of this current candidate runtime.

## Release preparation and remaining gates

Candidate branch: `codex/richmond-polish-v02`, based on main `ac677c4`.
No main integration, PR, Linux artifact activation or production deployment is
claimed. The existing public Richmond release remains V0.1. No server mutation,
service restart, capacity claim or rollback rotation was made for V0.2.

Before release: restore working rendered browser control; repeat A–F with identical
fixtures/settings/helper version; require zero Recover/reset and unexplained stops;
complete phone/layout/multitouch, lifecycle, consistent screenshot and performance
checks; then reconcile current main and reserve a fresh integration/release window.
Keep physical-iPhone acceptance explicitly pending if it remains inaccessible.

Use the existing `website-linux-candidate.yml` for an exact accepted commit
(Node22.23.1/npm11.6.0 on Ubuntu24.04). Verify its source identity and archive hash;
never treat the local macOS build as the Linux deploy artifact. Refresh both hosts,
current runtime/build identities, RAM/disk capacity, protected route/asset hashes,
peer services and configuration immediately before staging. Preserve a complete
immediate runtime rollback before activation, then run private/public smoke and
live browser checks. The old V0.1 receipt and retained helpers are references,
not current capacity/health evidence. No deployment window is held while these
manual gates remain blocked.
