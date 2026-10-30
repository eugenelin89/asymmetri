# Prompt 144: Surrey V0.5 playable driving and coordinated release candidate

- Date: 2026-10-30
- Scope: platform
- Goal: Ship a complete walk–drive–park–deliver experience while preserving the living city, phone interface, saves and peer applications.

## Original user request

> CODEX — SURREY, CITY OF ADVENTURE V0.5: VEHICLES, TRAFFIC & SKYTRAIN
>
> Walk around Surrey → Enter a car → Drive through the city → Park → Exit → Continue the adventure.

The large brief requests one functional original compact car, safe nearby entry and
stopped exit, acceleration/brake/reverse/steering/handbrake/recovery, full-body swept
collision on source-validated roads, a connected scenic route and complete driving
delivery. Preserve Street Adventure/Aerial Explore, exact aerial pause, all previous
cases and local saves. Add bounded yielding traffic and moving elevated train scenery;
boarding is optional only if a complete safe journey exists. Keep phone controls
compact, test real browser driving and narrow/landscape layouts, and explicitly avoid
claiming physical-phone acceptance. Work in isolation, coordinate Vancouver/Richmond,
preserve immutable snapshots and protected routes, then use the guarded Linux release
workflow or report an exact blocker. Retain the confirmed Surrey public name.

## Scope

Surrey code, one small transport snapshot, route copy and affected documentation.
No shared-engine refactor, dependency changes, new account/backend/telemetry, terrain
invention, train boarding, OS/network/database or peer-service changes.

## Decisions

- A conservative Central Avenue / City Parkway slice offers a complete validated
  drive. Other rendered streets remain walking/scenery areas for this release.
- Derive the mask offline from pinned V0.3 pavement and named-road corridors, minus
  buildings, medians, curbs and closed source surfaces. Retain all published bytes.
- Use a 4.16×2.04m oriented body, complete polygon-boundary tests and 120Hz swept
  substeps. Stop safely on conflict; preserve cargo/checkpoints during recovery.
- Keep occupancy inside Street Adventure and use the existing renderer. Aerial
  freezes exact car/traffic/train state; reload restores a stopped occupied car.
- Keep three lightweight traffic actors on one coherent circuit and three original
  train cars on one connected elevated chain. Signal proximity slows traffic;
  pedestrian/vehicle conflicts yield. No citywide signal-phase network is claimed.
- Explicit schema2/3→4 migration retains the old storage key and all earlier state.
- Richmond held the release window until its final main2618089 handoff. Rebase onto
  that approved main, preserve Richmond's prebuild test gate, then reserve journals
  144/145 for Surrey. Vancouver acknowledged no competing reservation.

## Implementation

Enter/exit car, arcade handling, safe road mask/recovery, chase camera, cyan route,
km/h display and held compact touch pedals. Case04 transports a projector from Jules
to Quinn for $55 once, requiring actual route traversal, parking and on-foot delivery.
Original car/train models, continuous rail motion and side-platform lights improve
city activity. Browser evidence prompted spaced railway columns off paved roads and
camera fitting around supports. Resource teardown now also disposes line geometry.

## Engineering impact

Pure Surrey vehicle/transport modules remain testable independently of rendering.
Traffic budgets and shared geometry keep the scene bounded. New validated local save
fields preserve old cases, money, inventory, settings and trust. Menu/map/help hide
movement controls while paused; speed changes do not spam an ARIA live region.
No Vancouver/Richmond source or public data changes are introduced by this commit.

## Files changed

Vehicle/transport/model modules and offline derivation; simulation/save/input/camera/
pedestrian/resource integration; compact HUD, map and journal; versioned transport
JSON/manifest; tests; Surrey route metadata and project/repository documentation.

## Documentation updated

Project README, changelog and third-party notices describe controls, provenance,
limits and migration. Repository architecture, local development, content guide,
testing, deployment and asset manifest record current responsibilities. V0.5 release
record separates completed local acceptance from pending production activation.

## Git diff summary

Implementation: 32 files changed, 908 insertions and 61 deletions. Added the bounded
transport system and documentation while retaining Richmond's parallel additions
when resolving append-only documentation conflicts during rebase.

## Verification

- Integrated Node24 checks pass with one existing tutorial lint warning.
- 54 Surrey, 27 Richmond, 59 Vancouver and 7 investment tests pass (147 total).
- Production audit: zero vulnerabilities. Next webpack and Vinext builds pass.
- Offline transport regeneration is byte-identical; old Surrey/Vancouver/Richmond
  assets and peer code have no diff. New-content path/credential scan is clear.
- Actual Brave keyboard playthrough: continue old save ($115, completed Cases01/03,
  active Case02), accept delivery, walk to car, enter, drive and turn, park, exit,
  hand to Quinn, receive $55. Balance170 and original inventory/cases survive.
- Aerial froze pose/speed/time exactly at 47km/h; return/brake and two reloads retained
  car/mission state. No pose/save injection or recovery completed the delivery.
- 390×844, 320×567 and 844×390 browser checks: controls within viewport, no horizontal
  overflow, held reverse/acceleration/handbrake worked without page scroll. Road edge
  stopped the car; recovery/exit preserved completion and money. Journal shows all
  four cases. Physical-phone tests remain outstanding.
- Refreshed production baseline matches Richmond runtimebe6fc3b/buildgIRztyRG7Pdh1DR3AAHQR.
  55 configuration hashes, 13 peer hosts, service identities and capacity are recorded.
  Both public hosts pass baseline 16-route/24-tutorial-asset checks.
- Browser-control infrastructure timed out after the completed local acceptance;
  post-build/live browser verification is pending recovery. No production swap yet.

## Repository state after implementation commit

Isolated `codex/surrey-adventure-v05`, implementation866f2fe on approved main2618089.
Clean after the implementation; no unpublished peer changes included. Main/server
window is assigned to Surrey. Exact Linux candidate and guarded activation follow.

## Implementation commits

- `866f2feed06a83016707e46bcc89b2a08136259b` — Add playable Surrey driving, projector delivery, traffic and train scenery.

## Archive commit

`Archive Surrey V0.5 driving acceptance and coordinated integration`

## Lessons learned

Geometry sampling alone cannot establish camera usability beneath elevated tracks.
The real browser drive exposed dense support columns, while model-level teardown
coverage exposed line resources omitted by a mesh-only disposer. Both were fixed
before production preparation. Responsive viewport evidence remains separate from
physical-device acceptance and from protected production-route checks.
