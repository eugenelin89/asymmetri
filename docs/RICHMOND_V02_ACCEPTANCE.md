# Richmond V0.2 — driving and exploration work in progress

Baseline: `1ce3b1e5f518d219d461ae6952927270a7f85f2c`, Richmond V0.1, isolated
`codex/richmond-polish-v02`. Current live runtime at rebaseline was Surrey V0.5
`fcd2b900b512652a94af07571b841e823c61d2de` / `VaAKfIoEAK5LbGri4K8V8`, including
Richmond V0.1. This document is local acceptance, not a release receipt.

Vancouver, Surrey and GIS Apps coordination messages were sent through chat tools.
Vancouver confirmed that its V0.6 manual candidate failed; its shared physics and
input exports stay unchanged. Surrey confirmed no transferable multi-pointer
certification. No main or server window is held during local experiments; current journal coordination is recorded below.
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

## Historical initial browser attempt — interrupted

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
One environment reload aborted that run. A fresh fixture then accepted keyboard interactions but stayed at elapsed0 after a one-second throttle hold; mouse input and screenshots still timed out. At that point all six controlled clean journeys remained pending; the current matrix below supersedes that status.

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
| A: core delivery | Oct31 completed1527.38m, pickup/parking/handover;3 reverse manoeuvres; one road-edge incident and one dynamic-actor junction incident;6 raw onsets;0 Recover/reset; cash37,1 delivery | Oct31 completed1525.01m, pickup/parking/handover;1 reverse; two contact incidents (older diagnostic ambiguity described below);11 raw onsets;0 Recover/reset; cash39,1 delivery |
| B: mall/shop/departure | Oct31 entered mall, bought kit, checked cameras, exited and drove same car41.76m;4 reverses; building/boundary/traffic incidents;0 Recover/reset; cash11,kit1 | Oct31 entered mall, bought kit, checked all cameras and exterior survey, exited and drove same car259.96m;3 reverses; one later bend incident with a nearby pedestrian (older diagnostic ambiguity);0 Recover/reset; cash11,kit1 |
| C: Terminal Takeout/bridge/terminal | Oct31 completed5919.79m, pickup/bridge/parking/walk/indoor handover;8 reverse controls including3 initial departure steps;62 raw onsets across explained incidents;0 Recover/reset; cash52,1 delivery | Oct31 completed5892.28m, pickup/bridge/parking/walk/indoor handover;7 reverse controls including3 departure steps;12 raw onsets, diagnostic caveat below;0 Recover/reset; cash54,1 delivery |
| D: Airport Lunch Run/office | Blocked after 4,247.10m; 19 reverse manoeuvres, zero Recover/reset; stopped before breakdown recovery | Drove6,161.03m, parked and entered office;12 reverse manoeuvres,0 Recover; unexpected navigation lost fixture before handover verification; incomplete |
| E: office/apron/taxiway/runway/walk/return | Completed3,378.66m, runway walk and same-car return;3 reverses,5 raw contacts,0 Recover/reset | Brave attempt interrupted; independent IAB attempt stopped864.21m after tool timeout,1 reverse,0 contacts/Recover; incomplete |
| F: regional Terra Nova or Steveston | Not run | Not run |

A, B and C have now completed in both versions; full A–F acceptance is not yet claimed.
Earlier interrupted attempts remain documented above. The old clear-road incident
remains unreproduced. Initial fixtures are developer-only, with no career writes
and no mid-journey state bypass. The regular candidate career remained readable
in the opening flow; fixture completion does not itself establish persistence.

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

Completed evidence is retained in `../richmond-v02-evidence/resumed-2026-10-31/`.
The resumed logs below contain the exact sample counts, viewport differences and
controller revisions. These limit causal before/after performance comparisons.

- Desktop browser: A–C completed in both versions; D baseline blocked and candidate
  handover interrupted; E baseline completed. See the matrix for current status.
- Responsive emulation: final390×844,320×567 and844×390 large-text layouts verified;
  scene/control intersection and horizontal overflow zero; visible touch targets
  at least43.9px. This is M4/Brave viewport evidence, not iPhone evidence.
- Aerial: whole-city clipping and labels corrected; six landmark actions preserve
  player/car/clock. Some early screenshots caught unfinished tile loading and are
  not final visual evidence. Camera return preserves interior and prior play mode.
- Modal keyboard focus, clock freeze, graphics-loss recovery and three Done/Continue
  cycles passed. Re-entry kept one canvas and the same career. Resource counts alone
  do not establish a heap-leak result. Failed-map-load/retry remains pending.
- iOS Simulator: **Not run**. Physical iPhone: **Not run**; the locked phone was not
  accessed or unlocked. Actual simultaneous touch remains **Not run**.


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

Earlier candidate checks, Node24.10.0 matching `.nvmrc` major24 (before the latest
camera, diagnostic and map follow-ups; final integrated checks remain pending):

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

Before release: finish the remaining A–F browser gates with documented comparable
fixtures/settings; require zero Recover/reset and unexplained stops;
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

## October31 resumption — still not released

Browser mouse, screenshots and animation temporarily became usable again. The
candidate branch remains separate from main. Later, old test tabs returned
`Debugger unattached`; a fresh tab in the same Brave provider restored access.
Surrey and Richmond serialize active browser/viewport blocks to avoid interference.
The homepage/UBC main releases advanced independently; no Richmond integration or
server window is held. Old journal148 now conflicts with an upstream UBC journal
and must be relocated to an unused coordinated number before merging main.

A fresh baseline core run used normal pickup/interior exit/same-car controls, then
6m-lookahead short key pulses. It reached264.97m with four explained boundary
incidents, three successful reverse corrections and zero Recover. It remains
incomplete, with no handover/payment. Offline pulse/gap experiments demonstrate
that automation key-release gaps affect turn clearance. This is not justification
to change shared handling or claim improved candidate driving. Future comparisons
must record the actual hold/read cadence and use consistent controls.

Responsive candidate evidence uses measured CSS dimensions, not just the viewport
request. In this browser, requesting390×844 yielded292×633 CSS pixels;520×1126
yielded390×844. At390×844, the canvas was390×546; at320×567 with Extra large text,
320×256; at844×390 with Extra large text,539.5×222.5. Each had zero control/canvas
intersection and no horizontal overflow. The narrow zoom buttons were enlarged
from30px to44px; the clickable status row was subsequently enlarged from36px to44px
(portrait recheck of that final8px change remains pending). Landscape targets all
measured at least44px. These are M4/Brave responsive checks, not physical iPhone or
multitouch evidence.

The map showed exactly one dialog, an inert canvas and contained keyboard focus.
Shift-Tab wrapped within it; elapsed remained185.968742 through the paused check.
Closing returned focus to the canvas. A First-person→Map→Return check retained
First person and the same parked car at150.99,29.81. Code review also corrected
Return to Player changing a non-aerial camera, and a stale aerial-paused message
after play resumes. No map data, saves or handling parameters changed in this pass.

Resumed screenshots/DOM receipts are retained outside Git under
`richmond-v02-evidence/resumed-2026-10-31`. The fresh candidate smoke observed60FPS
and a16.7ms frame; no sustained performance distribution is asserted. Physical
phone, simulator, actual simultaneous touch and full A–F acceptance remain pending.
Typecheck/lint passed after the small camera/phone corrections, with the same
pre-existing tutorial warning. Final production rebuilds are still required.

### Resumed phone, aerial and lifecycle checks

Final Extra large portrait checks measured390×844 with a390×504.5 canvas and
320×567 with a320.25×227.7 canvas. Every visible control was at least43.9px in
both dimensions (44px subject to fractional browser scaling); zero controls
intersected the canvas and neither document overflowed horizontally. The status
row's final44px change is included in these measurements.

Actual whole-city captures exposed depth artifacts: the street-level0.1m near
plane was retained while surveying from more than20km away. The candidate now
sets aerial near/far clipping from survey distance and restores street clipping
on return. This follows the depth-precision issue described in the
[Three.js camera guide](https://threejs.org/manual/pages/cameras.html). Whole City
also fits the actual camera aspect ratio, faces north and allows sufficient zoom
range for a tall phone viewport. Before/after captures show the layered surface
artifacts removed at the tested phone view. Label billboards now grow upward from
their anchor, use larger lettering, and clear the associated roof while surveying;
the ground geometry, footprints and vehicle rules are unchanged.

All six landmark shortcuts retained courier/car150.99,29.81 and exactly
224.435942s elapsed. These are camera flights, not driven journeys. Initial rapid
landmark captures include transitional district loading and must not be treated
as settled visual acceptance; stable representative captures remain to be taken.

The explicit developer graphics-loss button produced the expected paused error
and Retry action. Retry recreated the renderer with the same car, cash20,
health100 and frozen survey clock. Three Done→Continue cycles each showed one
canvas, the same career and empty held inputs. The initial resource sample was
31 geometries/10 textures before detail loading on each re-entry; this is a
bounded creation observation, not a full heap-leak or sustained-memory test.
No application console error was recorded. A Three.js loss-extension warning
occurred during deliberate already-lost-context disposal; unrelated extension
warnings were also present. Separate map-download failure/retry remains pending.

Typecheck/lint and the three selected existing camera/interior regressions passed
after the clipping/framing change. These are repeats within the existing suite,
not three additional unique tests. Final builds remain required after the later
label-height correction and upstream integration.

### October31 completed core delivery comparison

Both versions started at car150.9468,21.8100/yaw0.005 with seed18273, Lite,
density1, Gentle, reduced motion and north-up overhead. Normal keys accepted
First Day, walked the same restaurant corridor, collected order1, exited and
entered the same car. Driving followed the displayed map polyline with an
external numerical key planner; it never imported hidden world state into the
browser or changed the game's pose, cash, mission or clock. Short30s blocks ended
with ordinary braking and a paused map. The measured desktop viewport was1200×900;
candidate render buffer1134×648 at DPR1.

Baseline A completed1527.3846m and handed the order to Mei at elapsed215.9553s.
It had a road-edge drift at−63.45,254.39, and a dynamic-actor stop around
−758.30,260.31. Three ordinary reverse manoeuvres cleared/aligned the latter
junction. Six raw contact onsets represent those two incidents, not six distinct
unexplained stops. Cash finished37 with one delivery; repeat interaction did not
pay again. Zero Recover and zero resets during this completed run.

Candidate A drove1525.0068m and parked at−758.30,78.19 at elapsed196.5327s, then
walked around the car and handed over the order. One road-edge incident at
−594.22,358.14 cleared by driving8.36m straight; a second at−687.12,353.32 cleared
with S+A for1s, reversing3.16m. Eleven raw onsets belong to these two incidents.
The baseline's actor junction did not stop this run. Cash finished39 with one
delivery; immediate repeat E did not add another payment. Zero Recover/reset,
one reverse and zero unexplained stops. These results do not establish that every
past dynamic-actor configuration is fixed.

Comparison limits: the baseline planner initially chose coast/steer without
throttle when stationary after a correction; the external helper was corrected
to require a forward candidate below0.2m/s, and the candidate used that version
throughout. This is a QA-helper correction, not a game handling change. Key/read
overhead was median265ms baseline and305ms candidate, with candidate outliers up
to2.068s. The counts and times therefore must not be presented as a controlled
causal performance improvement. Both runs retained all incidents and manual
corrections, and neither used hidden movement or mission bypasses.

The239 baseline control-boundary samples reported56–60FPS, median60;217 candidate
samples reported52–61FPS, median60. Candidate sampled latest-frame durations were
median16.7ms,95th sample18.6ms and maximum233.4ms. These are sparse latest-frame
samples during local development, not an all-frame p95 or iPhone benchmark.

### October31 baseline mall visit

The initial mall fixture used the published parking point−37.54,−147.71 with
heading−2.064. The player entered normally, walked the central/east corridors to
Courier Supply and bought a9CAD recovery kit. All four cameras were exercised
inside. The baseline aerial camera showed the isolated interior against the sky,
rather than surveying the city; position/progression remained intact. The player
walked back out and entered the same parked car.

Departure to the access lane was possible but awkward. A first0.9s reverse moved
2.86m out from the frontage. The following forward turn touched the building at
−40.84,−147.45. S+D for1s backed clear, then another forward turn touched the
road edge at−39.67,−146.45. S+D for0.9s followed by straight forward motion
reached−36.89,−140.02, where opposing traffic209 stopped the car. The actor was
at−34.1072,−138.0290/yaw3.1349, speed0 on edge54300. S+A for0.7s gave room;
straight forward motion then reached−38.29,−128.66/yaw−0.098 on the access lane.

Result:41.7589m total driven, four ordinary reverse manoeuvres, three explained
incidents/six raw onsets, zero Recover/reset. Bag inspection still showed cash11,
one recovery kit and no completed delivery. This is a mall shopping/departure
check, not a claim to complete the separate Shopping Break mission or City Hall
journey. No active measured journey was modified by development hot reload.

Between A and B, matching read-only frame/resource metrics were added to the
frozen baseline. After B, nearby-actor diagnostics in both versions were expanded
to include pedestrians and an explicit vehicle flag. The frozen tree still
changes only initial fixtures/diagnostics, not gameplay behaviour.


### October31 candidate mall visit and baseline airport delivery

Candidate B used the same mall fixture, seed and Lite/density1/Gentle/reduced
settings. The actual viewport was1080×549 with a1014×519 render buffer, whereas
baseline B was1200×900/1134×648. A browser viewport capability followed the older
selected tab; closing that completed baseline tab restored reliable sizing. All
later acceptance uses one active test tab, navigating between local versions.

Normal walking reached Courier Supply, bought the9CAD kit, returned through the
entrance and re-entered the same car. All four interior cameras were exercised.
Aerial Find Me/Find My Car surveyed outside while interior player32.02,14.96,
car−37.54,−147.71 and elapsed23.0334 stayed fixed. Return restored the interior
and top-down camera. Departure used S+D900ms/brake600, then W+A900/brake600,
clearing the frontage without a contact. This planned manoeuvre used knowledge
from the baseline and is not a causal handling comparison.

The extended departure reached−34.85,75.62 and touched a road-edge bend. A first
S+D800ms reverse left the heading too far east and another forward attempt
stopped at−34.33,75.53/yaw.999. S+A1100ms reduced the heading to.081; W+A500,
W1300 and brake900 then cleared18.16m to−28.32,88.61/yaw.454. Nearby pedestrian5040
was visible in diagnostics, but the rejection was the surface sweep. Total259.965m,
three reverse controls including departure, one post-frontage boundary incident,
six raw onsets, zero Recover/reset. Bag retained cash11 and kit1. This is B,
not a completed City Hall or Shopping Break mission.

Baseline C accepted Terminal Takeout, walked around the parked car into Alexandra,
followed the visible restaurant corridor, collected Noodles order1, exited and
entered the same car500.01,−1408.14/yaw3.138. The route initially points south,
opposite the parked heading. S3800, S3000 and S+D1500 (with normal braking between)
backed to the driveway intersection at503.81,−1371.40/yaw4.593. These three reverse
controls were one planned departure, not a recovery. Normal road driving followed
the displayed polyline, stopping at its parking point rather than driving the
baseline's appended pedestrian segment to the terminal entrance.

C used external helper v3, which permits longer straight throttle holds only when
aligned and close to the displayed line. It never writes game state or reads a
hidden route. Both C versions use this helper. Blocks initially30s were extended
to43s, each ending with normal braking and a paused Map. They are not continuous
uninterrupted time trials. Key/read gaps varied, including periods around600ms
and steering-action outliers near953ms; comparisons must retain that limitation.

Baseline C incidents: traffic205 around397,−1372 cleared while steering forward;
a prolonged boundary-angle correction around268,−1918 generated28 raw onsets;
pedestrians36 at279.99,−1944.74 and38 at337.57,−2068.83 each needed S+A900ms then
forward clearance; the bridge-exit boundary at−242.06,−3074.38/yaw3.849 needed
S+A900ms; a straight-road contact after−1451 and a turnoff contact preceded the
sharp west turn at−2168.84,−2998.56, cleared by S+D1100ms. A later steering
overshoot at−2334.37,−2994.08/yaw5.303 cleared with S+A900ms. At−2356.34,−2999.69,
the planner kept trying to rotate against the boundary; ordinary straight W1500ms
moved12.4m clear without another reverse. These are explained contacts, not a
claim of frictionless driving. The bridge deck reached y8 and descended normally.

Baseline C parked at−2672.84,−3109.00/yaw4.054 after5919.7902m, elapsed671.4682.
F exited the same car; normal W+A29000ms and A3200ms reached the terminal entrance.
Inside, W+D12480ms and D1765ms reached Evelyn. E completed the order for32CAD
(cash52, one delivery); repeat E did not pay again, and Bag recorded Terminal
Takeout delivered. Eight reverse controls total, zero Recover/reset. No application
console error; only unrelated extension warnings were captured. Actual CSS1200×900,
render1134×648,DPR1. Evidence includes the full trace, bridge renderer capture,
completion screenshot and payment receipt outside Git. Candidate C remains underway.

Surrey's final correction passed its live browser gate and handed the browser back
with the viewport reset. It owns the final main/server receipt, followed by queued
UBC work. Richmond has not reserved main/server or deployed. Current fetched main
isbbf194c; upstream has no Richmond or shared Vancouver physics/input changes.
The resumed candidate typecheck/lint passed again with only the existing tutorial
navigation warning; diff whitespace checks passed.


### Candidate Terminal Takeout completion and evidence-driven follow-ups

Candidate C matched the fixture, seed, desktop1200×900/render1134×648/DPR1 and
helper v3. Normal controls repeated pickup, exit and same-car return. The same
three-step reverse departure ended503.71,−1371.38/yaw4.571 without contact. It
passed the baseline's initial traffic and prolonged bend correction. At339.33,
−2067.21 with pedestrian8028 nearby, straight W1100/brake800 moved6.7m clear
without reversing. Pedestrian14030 at476.61,−2752.94 required S+D900 plus forward;
that bypass reached the west road edge and S+A1100 plus forward realigned it.
Stopped cross-street car33202 at−1572.98,−2907.17/yaw3.139 needed S+A700 then
forward. Pedestrian37028 near−2173.85,−2959.75 needed S+A700 then forward, after
which the person resumed walking. Seven reverse controls total, including the
three initial departure controls. No Recover/reset or mid-journey state writes.

Candidate C crossed the bridge at y8, descended through the access loop and
parked−2672.43,−3109.43/yaw4.288 at elapsed570.2133 after5892.2797m. F exited;
W+A29000/A3500 reached the terminal, and the same indoor W+D12480/D1765 approach
reached Evelyn. Payment34CAD left cash54 and one delivery. Repeat E did not pay
again. No application console error; captured warnings were browser-extension
messages. The bridge screenshot showed health96/car91, so this is not an
undamaged journey. Different live traffic histories and key/read delays prevent
causal conclusions from completion time, reward or reversal differences.

Actual C play exposed two additional issues, corrected only after the completed
receipt was saved (no active measured journey was hot-reloaded):

1. `stepCar` carries a previous `blocked` flag while a car is stationary. The
   checked wrapper treated that inherited flag as a new surface rejection during
   braking, overwriting an actor-contact label. It now clears only that stale
   incoming flag before the unchanged integrator, which still marks every fresh
   rejected motion. A regression first contacts a real full-body actor, brakes
   without moving/inventing a surface contact, then reverses cleanly. The wrapper
   also records the failed support point and checks the rejected midpoint when
   describing a genuine surface sweep. Movement rules, dimensions and geometry
   are unchanged.
2. At bridge113.53355,−2924.54637, the map's first1.43m segment projected the car
   onto the road centre. Advance guidance incorrectly announced that positioning
   segment as “Turn right.” Guidance now starts at the projection while the
   displayed route keeps the full line. The real bridge reproduction and retained
   left/right junction examples pass.

Five focused regressions passed, including prior15/30/60/120Hz separation,
whole-body/grade separation, the two new cases and navigation leg separation.
Typecheck/lint passed with the existing tutorial warning; diff whitespace passed.
Full integrated suites/builds remain pending.

Development diagnostics now retain the first-contact kind, full car pose, elapsed
and nearby actor states across braking. The same read-only record was added to
the frozen baseline before D; baseline gameplay is unchanged. Earlier candidate
A–C traces did not preserve that first-contact frame, so their post-brake generic
“surface/elevation sweep” labels cannot by themselves prove a road-boundary cause.
In particular, B's bend had pedestrian5040 nearby and C's listed actor-adjacent
stops must not be claimed as purely geometric on that label alone. Normal escape
manoeuvres and positions remain valid evidence. Retained rounded-pose offline
replays can help diagnose but are not a replacement for an exact browser contact
record; final reporting must preserve this limitation and follow up as needed.

UBC subsequently reported livef3e5a9f/buildUvDOiPq9Ko5YmOkq4aC66 and is implementing
an owner-requested entrance change frommain995b87f with tentativejournals165/166.
Richmond explicitly acknowledged no main/server/journal reservation, requested the
final receipt, and retains Brave ownership while UBC uses IAB. Fetch the actual
latest main/runtime before Richmond integration; none of these are Richmond release
identities.

### Baseline Airport Lunch Run: blocked, not a clean pass

Normal controls accepted Airport Lunch Run, walked from terminal parking through
the café corridors, collected the correct order, exited and re-entered the same
car. The initial car was−2672.74,−3109.41/yaw−2.245; seed18273,
Lite/density1/Gentle/reduced motion/top-down, CSS1200×900/render1134×648/DPR1.
The displayed office road route was5968.15m. Baseline on-foot navigation after
the pickup showed the vehicle route instead of the short return to the car.

The baseline stopped at−965.70,−2084.30/yaw−.657 after4247.0990m, elapsed879.7780,
with car condition12.83, still carrying the order. This is **blocked/incomplete**,
not an office delivery. There were19 reverse manoeuvres,68 raw contact onsets,
zero manual Recover/reset, and no application console errors. The test stopped
before the existing condition-zero automatic breakdown recovery could activate.
The developer recovery counter only counted manual recovery in this build;
condition and pose continuity were separately checked to exclude an automatic
repositioning. No state injection, repair, recovery or reset was used.

Meaningful incidents included opposing cars213 and210 on the elevated access
road; pedestrians47 and15 near the exit; moving car204; heading overshoots at the
eastbound turn−2109,−2909 and straight−1819,−2909; a QA steering stall at the turn
−844,−2905; the sharp bend−896,−2782; opposing car201 at−924.33,−2509.52; and
pedestrian34 at−963.32,−2096.02. Passing pedestrian34 to the east succeeded after
retreating, but the following correction crossed to the west road boundary and
reduced condition below the pre-recovery guard. Several reverse manoeuvres were
corrections after the external key planner overshot; they do not establish that a
human must perform the same manoeuvres. Full poses, inputs and first-contact
snapshots are retained in the external `office-baseline-mpc.json` trace.

The external controller was v3 initially, v4 after1033.78m and v5 after2195.37m.
These changes only reduced timed-key steering intervals and adjusted estimates
of observation latency; they did not change game handling or inject game state.
Candidate D uses v5 from the start. Starting pose/seed/settings/route are matched,
but this helper difference and live actor timing prevent causal comparisons of
elapsed time or aggregate contact/reversal counts. A browser-control timeout
during reverse13 executed the queued inputs before pausing Map; reconnection
verified the resulting pose and preserved the same journey without reloading.

Candidate D has already verified the corrected short on-foot route back to the
same terminal car after pickup. The public-road drive remains in progress.

### Candidate Airport Lunch Run: drive and entrance verified, handover interrupted

Candidate D used the same starting pose/seed/settings and displayed road route,
with external timed-key helper v5 throughout. Normal café pickup, terminal exit and
same-car return passed. On exit the candidate correctly showed a short walking
route back to the parked car, unlike the baseline vehicle loop.

The candidate drove6161.0292m and parked−2281.96,−1281.06/yaw1.787 at
elapsed1170.0774. Twelve reverse manoeuvres total, zero Recover or intentional
reset. The final contact count was124 raw onsets; repeated steering against one
boundary produces many onsets and is not that many distinct incidents. Car
condition70.12. F exited to−2282.54,−1283.69; normal D1500/S2200/A900/E walked
around the car and entered the office. Last verified interior pose0,15,
goal11,−10, elapsed1174.7774; car and order remained intact.

Before an indoor handover receipt could be verified, a subsequent normal-key
sequence unexpectedly ended on `/labs/gis`. Browser Back returned the Richmond
opening screen; the isolated fixture (which intentionally does not save a career)
was lost. The user was unsure whether they had interacted with that tab. Cause is
**unassigned**, not asserted to be user action or a game defect. This is one
environment navigation/state-loss interruption, not a completed delivery or a
zero-reset end-to-end acceptance pass. No payment or duplicate-payment claim is
made for D. Captured logs showed only extension warnings, not an explanatory
application error. The full route trace and interruption outcome are retained in
`office-candidate-mpc.json` outside Git.

Meaningful candidate stops/corrections: eastbound road-edge turn−2184,−2911
(reverse1), person13042 (reverse2), opposing traffic18209 (reverse3), sharp turn
−844,−2905 (reverse4), the next diagonal bends (reverse5/6), crossing traffic26201
(reverse7). Subsequent rear-corner boundary contacts at−937.81,−2479.23 and
−972.21,−2365.17 both cleared with straight forward motion and no extra reverse.
A2.307s browser-control overhead on a nominal W+D500 input preceded an opposite
edge heading overshoot at−971.63,−2254.59 (reverse8); do not attribute that input
timing distortion to game handling. The southwest junction−892,−2216 needed
reverse9. Person42027 on the office road required an attempted bypass then a
longer retreat/wait (reverse10/11), after which the pedestrian crossed and driving
resumed. Reverse12 aligned into office parking. No unexplained physical trap was
observed; these facts do not imply effortless driving.

At−1318.78,−1497.74, near the historical unexplained stop, the first-contact
snapshot identified moving traffic31200 at−1322.47,−1494.59, speed7. Forward
control subsequently continued without reverse/recovery. The same moving car
briefly contacted the candidate again near−1589,−1332 and cleared. This identifies
the cause of **today's** contacts; the old incident's missing actor state still
prevents a definitive retrospective diagnosis.

### Airfield acceptance underway and map readability follow-up

Baseline E initially exposed an unmeasured setup race: operating the developer
selector before React hydration selected the core fixture and emitted a details
`open` hydration warning. It was discarded before any driving. After verified
selection, E started at office parking−2280.67,−1281.08/yaw1.582, Open Airfield
enabled, seed18273/Lite/density1/Gentle/top-down. Toggling Lite off/on corrected
V0.1's initial DPR bug before measurement: actual CSS1200×900/render1134×648/DPR1.

The first northbound approach stopped at−2287.37,−1304.54, east of the published
apron footprint. Source inspection diagnosed the footprint edge; the connection
was not missing. A normal retreat and westward correction entered the apron at
−2291.78,−1310, with two reverse manoeuvres total including initial departure.
The candidate map now draws the existing apron boundaries and gold authored
connection, with concise west-to-taxiway guidance. No geometry was changed.

The external airfield test planner reads the visible SVG airfield paths, plans
along those displayed lines and sends ordinary keys. It does not import hidden
world state or alter the game route/position. The outgoing baseline reached
runway08R/26L, stopped−1923.68,−2120.56 after1690.20m, then F/W2500 walked8.5m,
S2500 returned and F re-entered the same unchanged car. A forward U-turn began
the return journey without contact. Only the initial approach's two raw onsets
were present, zero Recover/reset. Another browser-control timeout interrupted
the detailed outgoing key trace; reconnection verified the same stopped runway
pose without reload. This limitation is recorded in the trace. The baseline return then completed, as recorded below; candidate E remains pending.

UBC completed landmarks/Halloween release at main7711e84, live8eba0e9/build
rtOqqaM__deGCW7i5raQm, receipt166. Richmond fetched that main without integration.
UBC then reserved another narrow release window and journals167/168 for an
owner-requested welcome hero. Richmond acknowledged and holds no shared window.
Refresh the subsequent receipt before Richmond integration/deployment.


### Completed baseline Open Airfield return and isolated candidate restart

Baseline E completed3,378.6572m at elapsed556.6271, parked−2281.20,−1282.81,
yaw6.473, condition95.21. Three reverse manoeuvres total, five raw contact onsets,
zero Recover/reset and no application console errors. The third reverse corrected
a return-heading overshoot at−2556.14,−1690.33 after1.294s control overhead on a
nominal W+D250 input. Straight forward motion then cleared the boundary. The rest
of the taxiway/apron/fictional connection return was clear. Runway walking and
same-car re-entry were verified before this return. The complete outcome and trace
are in `airfield-baseline.json`; the outgoing timeout leaves a detailed-key-trace
gap, not an unverified endpoint or a reload. Actual renderer images include
`baseline-E-taxiway-third.jpg`, `baseline-E-runway-walk.jpg` and
`baseline-E-complete.jpg`.

The first candidate E attempt in Brave had two initial reversing manoeuvres and
four approach contacts, then a third reverse while correcting a controller path
excursion reached the apron boundary (fifth onset, condition96.49). It is retained
paused at−2329.58,−1305.50/yaw3.289,133.20m, zero Recover. Repeated control stalls
and browser-focus changes prevented a dependable measured continuation; no cause
is assigned to the user. This attempt is **incomplete**, not a passing zero-reset
journey. The isolated IAB retry starts afresh from the same fixture and has a
separate `airfield-candidate-iab.json` trace. It must not be spliced into the Brave
attempt or presented as a like-for-like browser performance comparison.

UBC acknowledged using IAB only and stopped a superseded validation build to
reduce host contention. CWRU was also contacted about its browser/build activity.
No Richmond main/server window is reserved. Several active campus renderers and
local builds make contemporaneous low frame samples unsuitable for attributing
a Richmond regression; repeat a quiescent scene for final performance reporting.


### Final bounded map and phone follow-up

The independent IAB E attempt reached864.2072m, elapsed285.5028, car
−2476.52,−1857.16/yaw1.101. One ordinary reverse to depart the office, zero
contact onsets, zero Recover, no application console errors. A short driving
block timed out and reset the tool session; reconnection verified the same car
stopped with Map paused. This is **incomplete** before runway walking/return,
not a clean E pass. The recorded outcome precedes later HMR resets for UI edits.
No mid-journey state transfer or debug movement was used.

The nearby map now covers300m, while the minimap retains900m and Richmond region
retains the full bounds. The scope buttons change only the map extent, preserving
player/car pose and elapsed0 in the office fixture. Existing apron polygons and
gold connection are drawn without changing immutable geometry. Player/car/goal
labels have separate vertical offsets to avoid their previous overprint when
standing beside the car. Loading/error states disable the panel toolbar, and
keyboard shortcuts cannot open a blank panel before the engine is ready.

IAB responsive390×844 verification: Nearby streets and Richmond region controls
are44px high; zero horizontal overflow. Closing Map restores the unobstructed
390×537.43 canvas at y90; zero visible button/select intersection. The actual
renderer exposed a further oversized40m-wide airfield sign across the road, so
it is shortened to14m and anchored at the apron, with runway labels reduced from
65m to24m. These are procedural sign changes, not geometry/collision changes.
Evidence: `phone-map-nearby-final.jpg`, `phone-playing-final.jpg` and
`map-scope-final.json`. `phone-playing-signs-final.jpg` verifies the reduced sign
and clear road at the same390×844 office view. Aerial pause and fictional-airfield
notices are combined to avoid the observed narrow-screen overlap.

The available Simulator app again timed out on access, so Simulator remains
**Not run**. No physical phone access or unlock occurred. The final A–F gate,
representative district comparison set, failed-map-load/retry and actual
multitouch remain incomplete; short UI checks do not substitute for them.


### Integration handoff at the final local follow-up

Fresh origin/main remains7711e84ad86ecb3318dc2cc472a1514269c1f220.
UBC confirmed it still owns the main/server window and journals167/168 for its
expanded welcome/Halloween follow-up; live remains8eba0e9. Case Western has169/170.
Stanford has been contacted about171/172 and the proposed Richmond173/174 pair
(old branch-only148 relocation plus this follow-up). Confirmation is pending;
these numbers are not a main/server reservation. Do not integrate Richmond over
that work, or treat this old-base candidate build as a tested combined release.


### Follow-up validation status before the implementation checkpoint

The original final checks above predate this follow-up. The full current local
regression command and final typecheck/lint are running under severe shared-host
load; do not infer success from the absence of output. A branch-only exact-source
Linux workflow may validate this checkpoint independently; it does not activate
production or satisfy the incomplete browser-play gates. The follow-up journal
will record actual final outcomes and source/build identities.

Latest short IAB visual checks captured the settled YVR aerial view (six loaded
tiles,136 geometries,19 textures,274 draw calls) and whole-city view. At390×844,
the viewport/rendered canvas is390×537/DPR1. Individual sampled rates ranged from
11fps in the loaded YVR view to18fps in whole-city survey while other local campus
scenes/builds were active. These are desktop IAB responsive samples under
contention, not sustained distributions, a controlled regression result, or iPhone
performance. The single survey/fictional-access notice no longer overlaps another
badge. Screenshots: `phone-yvr-aerial-final.jpg` and
`phone-aerial-whole-city-final.jpg`. Both test viewport overrides were reset; the
IAB test tab was closed and the two Richmond development servers were stopped.
