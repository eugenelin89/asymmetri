# Prompt 159: Surrey V0.6 connected roads and transport freedom

This historical record was originally committed as journal 149 on the isolated
Surrey branch (`b6eae37`). It was relocated during the October 31 main refresh
because approved main independently used 149 for UBC. Its original implementation
and acceptance observations below are retained; subsequent acceptance belongs in
the follow-up journal.

- Date: 2026-10-30
- Scope: platform
- Goal: Expand Surrey from a short driving demonstration into a connected free-driving city, with GPS, traffic and a complete detour mission.

## Original user request

> CODEX — SURREY, CITY OF ADVENTURE V0.6: OPEN ROADS & TRANSPORT FREEDOM
>
> Implement the strongest connected driving experience that the actual geographic data can safely support.
>
> Do not stop at a proposal. Inspect the current code, implement the features, test the gameplay using ordinary controls, preserve existing work and deploy through the established safe release process.

The detailed attached brief requested the largest validated connected road
component, aiming for at least3–5km where real data supports it; unique length and
connectivity reporting; actual full-car surface/turn clearance; branching A* and
eight possible roadside destinations; free driving, rerouting, clear route and
safe parking/exit/re-entry; bounded traffic and simplified signals; a complete
new driving story with a meaningful alternate route; preservation of all four
old stories, saves, day/night state and aerial modes; and compact simultaneous
phone controls. Extra compact/sedan/SUV variety and full safe transit boarding
were optional after the core network. V0.3 and V0.5 data must remain immutable.
The owner required coordinated isolated work, all regression/build/audit checks,
ordinary-control desktop/mobile browser acceptance, guarded exact-source Linux
deployment or an exact blocker, complete rollback and live browser verification.
Earlier instructions retain the public name **Surrey, City of Adventure** and
address the iPhone problem of multiple panels covering gameplay.

## Scope

Surrey-owned runtime, controls, story, offline transport derivation, versioned
snapshot, scoped Surrey page/content and affected documentation. Existing main
was advanced from fec321b to approved ac677c4 without altering Vancouver or
Richmond code. No dependencies, shared physics/input, old snapshots, routes,
service configuration or deployment workflow changed.

## Decisions

- Derive133 source-connected segments with17,009m unique path geometry and17,154m
  unique source centrelines. Count geometric unions, not repeated trips. Validate
 478 directed transitions and56 branching intersections; exclude30 turns and66
  source segments. Remove the detached fragment left by corridor clipping.
- Validate stops for supported road rejoining as well as parked-body/foot-exit
  clearance. A return-route test exposed a King George stop that only fit while
  parked; the stricter inset corrected it. All outward and return routes pass.
- Preserve the compact's handling and dimensions. Its body receives accelerated
  polygon queries without weakening boundary/hole/sweep checks. Do not introduce
  larger vehicles without their own accepted footprints.
- Keep free drive as default. Route selection/recalculation never moves the car.
  Unreachable guidance retries only after repositioning, avoiding repeated work
  while a stopped player reads the message. Arrival requires stopping.
- Use a695.405m bounded traffic circuit with Low/Normal budgets and one clearly
  fictional signal cycle. Correct circuit direction to avoid opposing traffic
  trapping the original car route; maintain collision with people and vehicles.
- Add Nora's archive delivery, a fictional University Drive workzone and the
 1,192.607m alternate route instead of761.217m direct. Require actual driving,
  stopping, exiting and foot handoff; pay$85 once. Preserve old case independence.
- Keep map/status/details explicit on phones. Independent pointer/key ownership
  supports steering plus throttle. Clear Route retains focus; Menu replaces
  other overlays instead of stacking over Map.
- Preserve rail scenery and illustrative doors. Defer boarding because a full
  safe second-station access path is not verified. Terrain remains flat.
- Leave this candidate isolated and undeployed: the required rendered-browser
  acceptance could not be completed. This is a recorded blocker, not a passed
  manual check or a request for renewed deployment permission.

## Implementation

Versioned road graph, polygon mask, source receipts and connectivity report;
directed A*, compact GPS map/HUD and route lifecycle; Case05 and schema5 migration;
expanded traffic, shared signal phases, input ownership and overlay fixes.
V0.3 geography and V0.5 transport are byte-identical. All saves remain local under
the existing key. The candidate contains no new external runtime data service.

## Engineering impact

Routing validates incoming-edge turns instead of assuming centreline joins are
drivable. The offline pipeline checks exact source coordinate correspondence,
full compact footprints at0.15m, advertised routes/returns and geometric unions.
The runtime rechecks collisions and actual exits against nearby actors. GPU
route buffers dispose on replacement and share the existing scene/renderer.
Final snapshot is380,826bytes, SHA256
`53842626ecff589ef802e5d79a51862a6ee0697ddb296b2aa83aaff53ab1bc52`.

## Files changed

- Surrey simulation, vehicle/transport, navigation/input/signals, save boundary,
  population/scenery and transport rendering.
- Adventure, map, journal and CSS; only Surrey fields in shared site content.
- Three offline derivation/validation tools and the new V0.6 snapshot/report/manifest.
- Surrey regressions and project/source/release documentation.

## Documentation updated

README, Surrey README/changelog/notices, architecture, local development,
content, assets, testing and deployment docs reflect implemented capability and
its limits. `SURREY_V06_ACCEPTANCE_2026-10-30.md` records the browser blocker,
automated evidence, unchanged production identity and exact remaining gate.

## Git diff summary

Implementation:36files changed,1,927insertions and147deletions. Most additions
are source-derived connectivity evidence, the offline pipeline, local routing,
regressions and documentation. No generated build output or raw private cache
was committed.

## Verification

- 67Surrey +74Vancouver +27Richmond +7investment tests pass:175total. All four
  old stories and the new archive story complete with movement inputs. Walking
  test drivers route around stopped traffic without disabling collision or
  moving actors. Case05's saved/reloaded alternate drive has zero contacts.
- `npm run check` passes with one existing tutorial navigation lint warning;
  production audit reports zero vulnerabilities. Vinext and Next webpack builds
  pass. The Next prebuild repeats Surrey/Richmond suites.
- Both offline steps reproduce their output. Source count/hash/coordinate checks,
  inward/return routing, snapshot hashes, full-body clearance, closure avoidance,
  saves, signals, input ownership and resource disposal pass.
- 21local production route/asset checks returnHTTP200 with matching served
  dataset digests, GIS peer names and the protected tutorial canonical. Diff and
  added-content privacy scans pass. All old Surrey data and peer code unchanged.
- Browser UI handlers support keyboard start, destination selection, save/reload,
  aerial/ground switch and clearing. DOM map bounds fit390×844,844×390,820×1180
  and1280×720 without horizontal overflow. The phone Menu→Map→Menu sequence
  leaves one Menu dialog and zero maps; Clear Route preserves selector focus.
- Rendered manual acceptance remains blocked: mouse dispatch and screenshot
  capture repeatedly time out; held walking leaves the canvas at25.80,33.21 and
  elapsed0.00. Peer projects independently reported the same browser limitation.
  Manual driving, moving reroute, visual/lifecycle acceptance, real multitouch,
  physical iPhone and live post-release checks remain incomplete. No hidden
  state mutation or teleported mission completion was used as browser evidence.
- Temporary browser overrides were reset, owned tabs and local servers closed.
  Final source and receipts are retained in the owner's deployment-retention
  area. No server mutation or Linux activation occurred.

## Repository state after implementation commit

Branch`codex/surrey-adventure-v06`, based on approved main
`ac677c480cd8c4d2b966911688f5ad26ae344dbb`. Implementation commit below; clean
working tree before this journal. Vancouver cleared journal149 after147;
Richmond reserved/committed148 only on its isolated branch. No integration or
production window held. The two commits will be pushed to this feature branch.

Production was observed still serving source
`fcd2b900b512652a94af07571b841e823c61d2de`, build`VaAKfIoEAK5LbGri4K8V8`, active.
The V0.5 complete rollback remains unchanged. V0.5's subsequent live browser
acceptance in journal146 supersedes the brief's earlier failure statement.

## Implementation commits

- `a710517b3e21ef43d1f8b56f8175c2707c09c1eb` — Implement Surrey V0.6 connected roads and GPS candidate.

## Archive commit

`Document Surrey V0.6 implementation and blocked browser acceptance`

## Lessons learned

A parked vehicle fitting a polygon does not prove it can rejoin a road. Validate
return trips. Expanded traffic also changes walking test paths: preserve bodies
and navigate around them. Unique geometry and directed turn acceptance support
honest network claims; passing those checks is still distinct from rendered
human-control acceptance. Keep the known-good release serving when that gate
cannot be observed.

## Follow-up ideas

Complete ordinary-control desktop/mobile and physical-phone acceptance when
browser operation returns, then coordinate refreshed main, exact-source Linux
build, complete rollback and live verification. Additional vehicle footprints
and safe multi-station boarding remain optional future work.
