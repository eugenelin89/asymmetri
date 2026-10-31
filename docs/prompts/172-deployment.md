# Prompt 172: Deploy the initial Stanford campus

- Date: 2026-10-31
- Scope: deployment
- Goal: Activate the exact validated Stanford campus artifact and verify production while preserving the shared site and peer services.

## Original user request

> eta till full deployment?

> update eta to full deploymen every 10 minutes

The subsequent user heartbeat explicitly directed continued Stanford deployment within shared-release coordination, keeping unfinished shared modules out of the initial artifact and keeping updates active until both the initial campus and later Stanford-owned reviews/private-reporting integration are deployed and verified.

## Scope

Initial Stanford production deployment, profile persistence, exact-source Linux validation, live acceptance, rollback retention and release documentation. The UBC-owned shared backend and Stanford's subsequent frontend integration remain a separate rollout stage.

## Decisions

Pin the released runtime to journal171 source `a69cb68`, excluding uncommitted shared components. Use an independent application-owned checkout and Linux CI runtime, preserve all prior campus stores, and add only the scoped Stanford persistence setting. Release the server slot after public acceptance, while keeping the ten-minute heartbeat active for the remaining stage.

## Implementation

Activated source `a69cb68c9f11942978fdec16ff2d0ddac04d88b6`, build `otCTTCCerr51Hh_vOJxBA`, at 23:03:45 UTC. Provisioned the private Stanford profile directory and service drop-in. Verified both public domains and stored exact artifact, retention, private-smoke, activation, live and health evidence. The initial campus is available at https://asymmetri.co/labs/stanford.

## Engineering impact

No application changes or new dependencies in this documentation commit. Production now serves the previously committed campus and isolated profile backend. Existing services, protected pages, configuration and UBC/CWRU profiles were preserved. The whole preceding runtime remains available for recovery; no older runtime or archive was retired.

## Files changed

The release receipt and deployment/testing/asset guides record source identity, checks, preservation and capacity. Stanford implementation/operations documentation and the repository overview now distinguish the live initial release from pending shared features. Three unretouched public browser captures and their gallery document desktop and mobile acceptance.

## Documentation updated

README, deployment guide, testing guide, asset manifest, Stanford implementation and community operations, release receipt and validation gallery. Operational evidence is retained privately outside the repository; credentials and participant data are excluded.

## Git diff summary

11 files changed, 58 insertions and 7 deletions, including three JPEG proof captures. Changes are confined to Stanford release truth states and evidence; concurrent CWRU source edits and generated next-env changes remain unstaged.

## Verification

Exact-source Linux CI passed 533 tests, TypeScript/lint, zero-vulnerability production audit and Next webpack build. Artifact hashes, safe archive members, embedded source/build/Node identity and Linux native Sharp passed. Private acceptance passed 19 routes, protected host/asset checks and a synthetic profile lifecycle. Both public hosts preserved 18 prior routes and 24 tutorial assets each. Live Stanford page/assets matched the candidate and the public profile lifecycle passed with its synthetic fixture removed. Browser checks covered automatic/manual editions, movement/focus, Church Level1, mute/volume, mobile form/map, no horizontal overflow and no console errors. Final server health passed at 23:07:00 UTC with zero restarts/post-activation errors, unchanged peers/configuration/profile stores and retained recovery evidence. Documentation whitespace checks passed. No additional application rebuild was required for this documentation-only commit.

## Repository state after implementation commit

On main at `d5ebd3c`, ahead of origin by the release documentation commit. UBC shared source `704a9b3` is preserved in main but is not the initial live runtime. Concurrent CWRU work and generated next-env changes remain unstaged. The journal commit and both commits will be pushed without force.

## Implementation commits

- `d5ebd3c` — docs(stanford): record verified initial production release
- The deployed application itself was committed previously as `257bbb4`, followed by journal171 `a69cb68`.

## Archive commit

`docs: archive Stanford initial production deployment`

## Lessons learned

Rebaseline the newly provisioned Stanford store and drop-in before a successor release. Preserve owner-held archive custody rather than expecting retired expanded paths. The final free-disk margin above 6 GiB is small, so calculate the next independent runtime budget before transfer. A live initial campus does not complete the separate shared-feature rollout.

## Follow-up ideas

Complete the authorized Stanford reviews/private-usage integration after the UBC shared-service deployment; keep periodic ETA updates until live acceptance passes for that stage.
