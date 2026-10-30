# Surrey V0.5 — On the Move · 2026-10-30

**Candidate in validation.** Production remains on the preceding approved runtime.
Richmond released the integration/server window after its verified V0.1 activation.
Surrey owns the next bounded window and journals144/145; no V0.5 activation has
occurred. Refreshed approved main is26180893335ca37b04361fc516f177c6aaa36eaa. Public destination remains https://asymmetri.co/labs/surrey.

## Scope and provenance

Isolated `codex/surrey-adventure-v05` started from9e5f4cad and rebases onto the
approved Richmond receipt2618089. Richmond code/assets and its prebuild test gate
remain intact. The first
compact car is playable with safe enter/exit, progressive acceleration/brake/reverse,
speed-dependent steering, swept oriented-body collision, chase camera and compact
held touch controls. Driving stays inside the validated Central Avenue / City Parkway
slice; free driving remains available. A complete fictional projector delivery
requires Jules→car→ordered driving route→park→exit→Quinn, paying $55 once.

Three bounded traffic cars yield to pedestrians and vehicles, slow near source
signals and use distance/device update budgets. This is a short coherent circuit,
not a citywide signal network. Three original train cars shuttle on one connected
chain with station/end dwells; station platforms/lights are improved. No boarding.

The 17,135-byte transport snapshot is derived offline from pinned V0.3 receipts.
SHA256 `262287b51014c66c617b684f05db0e772a90fe00b2aff029259ea98c05f44627`
reproduces exactly. Route218.2977m; traffic92.2725m; rail811.8312m. Full-footprint
sampling supplements runtime boundary and swept checks. Ground remains flat;
rail deck centre8.2m remains illustrative. Original map SHA256
`e4cca4b8f8ace1296201f50f77c9bb1d0093365cbfdabeefabb91709a60cccdf` is unchanged.
No dependency, account, upload, mapping backend or shared-engine refactor is added.

## Acceptance evidence

54 Surrey tests pass, including all44 earlier tests and10 new vehicle/transport
regressions. They cover full-body and tiny-hole/sweep collision, source-connected
route clearance, frame-rate handling, safe enter/exit/recovery, digital-input delivery,
old-save migration/reload, exact aerial freeze, traffic/pedestrian spacing, train
continuity/dwell, actual transport GPU teardown and rail-support placement.

Desktop Brave normal-controls playthrough: continued an existing V0.4 save with
$115, completed Cases01/03, active Case02 and three inventory items. Walked to Jules,
accepted the projector, walked to the car, pressed E, drove Central Avenue and
steered left onto City Parkway using W/A/D/Space. Paused at47km/h in Aerial Explore:
car97.51,-116.10,yaw3.055,speed12.93 and elapsed1341.25 remained exact. Returned and
braked, followed all51 route checkpoints and parked at100.02,-210.92. Exited safely,
walked to Quinn and delivered for$55. Balance170, cargo removed, Case04closed, all
earlier state retained. No recovery or test-state mutation completed the route.

A reload mid-drive retained the occupied parked pose/checkpoints; another reload
after completion restored the occupied car and closed delivery. Browser testing
exposed overly dense railway pillars obscuring the turn; supports now have24m
spacing, stay off pavement, and participate in camera sightline fitting. Actual
transport resource testing exposed missing Line disposal; shared car/train and
route/track resources now dispose exactly once.

Responsive browser sizes390×844,320×567 and844×390 have no horizontal overflow and
all driving controls remain inside the viewport. Held reverse moved the car4.07m;
Handbrake stopped it, page scroll stayed unchanged. Landscape held Go/Handbrake and
view switching also worked. These are browser viewport checks, not physical iPhone
multi-touch, battery or thermal certification. Driving into the road boundary stopped
the car; the touch Recover action returned it to a clear route pose. Safe exit
and Journal showed all four cases, $170 and the three original inventory items.

## Release gate and limits

Local check (one existing tutorial lint warning),54 Surrey/59 Vancouver/7 investment
tests, production audit (zero vulnerabilities), Next webpack and Vinext production
builds pass. Offline transport reproduction is byte-identical; earlier geographic
snapshots and Vancouver code have no diff. Exact-source Linux/private/public release
checks follow integration with Richmond. Before
activation refresh live source/build, peer/config identities and capacity; preserve
an immediate complete runtime rollback. Only the existing Asymmetri service may
restart. No OS/DNS/TLS/database or peer-service changes.

Physical iOS/Android testing remains outstanding. Citywide car navigation, train
boarding, terrain elevation, interiors and full decorative-prop physics are not
claimed. Nearby cars stop safely; there is no graphic impact or damage system.
