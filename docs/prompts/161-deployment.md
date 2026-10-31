# Prompt 161: Surrey V0.6 release and live-guidance correction

- Date: 2026-10-31
- Scope: deployment
- Goal: Safely activate Open Roads and correct a GPS defect found by fresh live play.

## Original user request

> CODEX — SURREY, CITY OF ADVENTURE V0.6: OPEN ROADS & TRANSPORT FREEDOM
>
> Do not stop at a proposal. Inspect the current code, implement the features, test the gameplay using ordinary controls, preserve existing work and deploy through the established safe release process.

The continuing brief requires expanded connected roads, free driving, destination
navigation and rerouting, safe car continuity, bounded traffic, a complete new
mission, preserved saves and earlier cases, compact phone views, exact offline
geography, all checks and ordinary browser acceptance. Coordinate the shared
main/server window, preserve protected pages and complete rollback, then repeat
fresh live browser verification. Physical iPhone acceptance remains separate.
The public name remains Surrey, City of Adventure.

## Scope

Initial V0.6 activation, preservation evidence and a narrowly scoped correction
for one wrong instruction discovered in the live drive. The correction is locally
validated; its independent Linux follow-up release is still pending. No unrelated
OS, DNS, TLS, database, peer configuration, backend or dependency changes.

## Decisions

- Keep the shared release window serialized with UBC, Richmond and homepage work.
- Archive older inactive complete runtimes only after byte verification on the Mac,
  GNU tar comparison to the original, and a verified root-only server copy. Preserve
  current live and its immediate complete predecessor throughout staging.
- Derive guidance from the same cleaned vertices as the accepted curve. A tiny
  source lattice kink must not suppress the real junction turn when driven backwards.
- Preserve route coordinates, vehicle handling, collision and immutable geography.
- Normalize only the wall-clock export timestamp in the aerial freeze assertion;
  continue comparing all simulated fields.

## Implementation

Initial source f6fb80a activated at 17:36:56 UTC, Linux build CM8fyU1dZ-i0htGXG2LZB.
Private and public preservation checks passed, then fresh live save/drive/turn/
exit/re-entry/aerial checks exposed an incorrect right onto City Parkway where
the route actually turns left onto Central Avenue. The new correction reuses the
collision-checked cleanup for guidance and adds an exact-pose regression.

## Engineering impact

GPS instructions now match the validated return route. The external roundRoad API
and accepted geometry are unchanged. No source data, dependencies, private user
state or peer-game implementation changes. Protected public profiles remain in
external storage and were only read through their public projection.

## Files changed

Surrey navigation and tests; README/changelog; testing, deployment, acceptance
and new production receipt documentation. Evidence artifacts remain outside Git.

## Documentation updated

The release receipt records exact initial identity, guarded activation, protected
routes/assets, retained rollbacks and the live-discovered defect. Acceptance and
README distinguish the local correction from its still-pending follow-up release.

## Git diff summary

Implementation 0a0b58f: 8 files, 212 insertions and 29 deletions. Most additions
record release evidence; navigation/test changes share route cleanup and cover
reverse guidance. This journal is excluded from its own totals.

## Verification

- Check, Vinext and Next pass; final local build 8dsjjVRnAM7huIqnmH2s-.
- 69 Surrey, 27 Richmond and 53 UBC tests pass in the final Next prebuild; combined
  with unchanged main-refresh 74 Vancouver and 7 investment, 230 regressions pass.
- Exact offline network and connectivity report bytes reproduce. Accepted reverse
  route remains 875.8905295002417 m; original detour guidance regression passes.
- The first full run found only the one-millisecond savedAt mismatch; the corrected
  assertion and full rerun pass. Existing tutorial lint warning is unchanged.
- Fresh local ordinary-control replay walks to and enters the original car, drives
  Central Avenue and City Parkway and triggers six moving reroutes. Correct left
  onto Central Avenue is visible at 94.40,-22.55, heading -.009. The retained later
  stationary sample has seven total reroutes. No Recover or hidden-state injection.
- No application console errors; installed wallet-extension warnings are separate.
- Initial Linux workflow 41224593852 passed exact-source checks, audit and build.
- Initial private smoke: 17 routes, eight protected host checks, 24 tutorial images,
  124 IDs, all 688 Richmond outputs, six UBC assets, geographic hashes and profile
  projections. Both-host public comparisons and 70 extra public checks pass.
- Initial activation preserves five peers, 56 config fingerprints, 13 virtual
  hosts and Node. Final service active/running/enabled with zero automatic restarts.
- Correction staging preflight and older Orchard rollback retention pass; live
  V0.6 and immediate UBC predecessor remain complete. Follow-up activation pending.
- Physical iPhone, real multitouch/backgrounding and sustained phone FPS/thermals
  remain unverified; prior browser-sized phone layout evidence is retained.

## Repository state after implementation commit

Dedicated branch codex/surrey-adventure-v06 at 0a0b58f, clean before this journal.
Origin main remains initial live source f6fb80a and is an ancestor. No force push,
PR or unrelated changes. Surrey owns main/server window; UBC works separately and
waits. Richmond owns the browser block during Linux preparation.

## Implementation commits

Earlier implementation commits are recorded in journals 159 and 160: a710517,
9c105ec, e3f8be2, 500d69d and 01cf789. This follow-up implementation is 0a0b58f.
Initial activation used journal commit f6fb80a; it is not a new code change here.

## Archive commit

Record Surrey V0.6 activation and guidance correction gates.

## Lessons learned

Fresh live gameplay found an instruction defect that route reachability alone
cannot detect. Test both traversal directions and share path preparation rather
than approximating it in a second guidance pass. Distinguish export timestamps
from the simulated clock when asserting a complete pause.

## Follow-up ideas

Complete the authorized exact-source follow-up Linux candidate, guarded activation
and fresh live correction verification, then record journal 162 and hand back the
shared release window. Extra car footprints and train boarding remain deferred.
