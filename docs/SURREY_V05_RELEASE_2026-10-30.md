# Surrey V0.5 — On the Move · 2026-10-30

**Live:** https://asymmetri.co/labs/surrey (also verified on `www`). Activated
2026-10-30 at 23:20:24 UTC through the guarded whole-runtime workflow.

- Runtime source: `fcd2b900b512652a94af07571b841e823c61d2de`.
- Linux build: `VaAKfIoEAK5LbGri4K8V8`; Node `v22.23.1`.
- Successful CI: https://github.com/eugenelin89/asymmetri/actions/runs/41143061313.
- Artifact SHA256: `8690e9537824d1039ec70192ba033958d9596f302fe10ebbd82c422f7dc495b5`.
- Complete immediate rollback: `/var/www/asymmetri-rollback-before-surrey-v05-20261030`,
  source `be6fc3bc069cd77b54240846b27166027b333d3b`, build `gIRztyRG7Pdh1DR3AAHQR`.
  This preserves Richmond V0.1, Vancouver V0.5 and Surrey V0.4 together.

## Scope and provenance

Isolated `codex/surrey-adventure-v05` started from `9e5f4cad` and rebases onto the
approved Richmond receipt `2618089`. Richmond code/assets and its prebuild test gate
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

54 Surrey tests pass, including all 44 earlier tests and 10 new vehicle/transport
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

## Production verification and recovery

Integrated Node 24 check (one existing tutorial lint warning), 54 Surrey, 27 Richmond,
59 Vancouver and 7 investment tests pass: 147 tests total. Production audit reports
zero vulnerabilities; Next webpack and Vinext builds pass. Offline transport
reproduction is byte-identical. Peer code/data and old snapshots have no diff.
The exact-source Linux Node 22 candidate passed its independent workflow, including
both Surrey and Richmond prebuild test gates.

Private candidate: 16 routes, eight protected host checks, 24 tutorial images, 124
retained tutorial IDs, native image optimization, all 688 Richmond outputs and every
Surrey snapshot passed. Protected visible content, including Richmond and Vancouver,
matched the preceding runtime. Public apex and www each passed 16-route/24-image
comparisons, plus 56 additional geographic, city-copy and redirect checks.

Capacity floors were 192MiB available memory and 6GiB free disk. Independent checkout,
artifact extraction and private smoke guards all passed. The smoke minimum was
248,468KiB available and 9,619,771,392 free bytes. Activation continuously checked
capacity and peer/config identity, with automatic whole-runtime restoration on
failure. No guard fired. Only Asymmetri restarted; all 55 configuration hashes,
13 peer virtual hosts, peer service identities and the Node binary remained unchanged.
Final health at 23:21:19 UTC: 343,152KiB available, 9,619,501,056 free bytes, active/
running/enabled service, zero automatic restarts and zero post-activation errors.
The one old shutdown entry is the expected exit143 during the controlled swap.

Server evidence is retained in `/var/lib/asymmetri-surrey-v05-release-20261030`.
The rollback directory retains the entire previous source, `.next` and `node_modules`.
To restore it, stop only Asymmetri, move the current tree to a new retained failed
candidate path, rename that rollback tree to `/var/www/asymmetri`, restart Asymmetri,
and repeat protected-route/service/capacity checks. Never replace only `.next` or
delete earlier complete runtimes. No OS, DNS, TLS, database or peer-service changes
were made. Later documentation commits do not change the running source/build.

## Live browser recheck

Completed October 30 by 23:35 UTC on the deployed apex route after reconnecting
following a browser restart. The prior browser-control interruption is resolved.
Continued the existing site save, walked to the car and entered through ordinary
controls. Held phone acceleration moved the car from (20.00, -68.25) to (26.39, -68.25);
Handbrake stopped it. Aerial Explore retained car pose, zero speed, elapsed 220.93
and city time 1372.97 exactly; Street Adventure resumed correctly. Landscape held
reverse moved it to (24.99, -68.25) and Handbrake stopped it again. Reload and Continue
restored that occupied pose, heading 1.571 and speed 0; all four cases remained
available, with $20, health 100, stamina 100 and no inventory items in this site's
save. This production-origin save is separate from the completed local delivery
save described above; the full delivery was not repeated on production.

Live CSS viewports 390×844, 320×567 and 844×390 retained one canvas, contained controls
and no horizontal overflow. Held controls left page scroll unchanged. Portrait and
landscape screenshots are retained with the release evidence outside Git. No page
console errors were recorded; warnings came from an unrelated browser extension.
The game was paused and the temporary viewport override reset, confirmed at
1800×915. These checks close the live visual recheck recorded as unavailable in
journal 145. They required no runtime change or additional deployment.

## Remaining acceptance limits

Physical iOS/Android testing remains outstanding. Citywide car navigation, train
boarding, terrain elevation, interiors and full decorative-prop physics are not
claimed. Nearby cars stop safely; there is no graphic impact or damage system.
