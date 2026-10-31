# Prompt 153: Correct UBC public-profile routing

- Date: 2026-10-31
- Scope: platform
- Goal: Make requested opt-in profiles work through public website ingress without changing shared service boundaries.

## Original user request

> I am going to bed. you are authorized to make decision. please complete the project without me. good night

This continues the V0.3 implementation and explicitly authorized deployment recorded
in journal 152. Immediate profile publishing, reporting/removal and the owner's
Christopher Lin self-profile remain authorized.

## Scope

Move the four UBC endpoints and their clients/cookie path. Preserve all scene
features, private profile data, shared raw ingress, Nginx rules and peer services.

## Decisions

Public verification caught the existing ingress rejecting unknown `/api/` families,
which private Next candidate tests had not exercised. Restore V0.2 while preparing
a corrected independent Linux candidate. Use `/labs/ubc/community-api/` through the
ordinary website backend; do not expand shared service routing authority.

## Implementation

Relocate handlers unchanged, update client requests and ownership cookie scope,
assert the cookie path in the security test and show a readable unavailable message
if a proxy ever returns a non-JSON response. Add actual snow/rain and initial public
scene captures, explicitly identifying the subsequently rolled-back activation.

## Engineering impact

No dependency or peer-service change. Profile storage persists independently of
release swaps. Public recovery/write checks now complement loopback candidate tests.

## Files changed

Four route relocations, profile client/HTTP/test and campus fetch, architecture and
operations documentation, the implementation report and three browser screenshots.

## Documentation updated

Architecture, deployment, community operations, asset manifest, V0.3 report and
validation gallery reflect the endpoint family and observed verification limits.

## Git diff summary

17 files changed, 38 insertions and 13 deletions; four exact handler renames and
three PNG additions. Private credentials and profile data are not tracked.

## Verification

Vinext and Next webpack builds pass. UBC 44, Surrey 54 and Richmond 27 tests pass
again; Vancouver's 74 tests passed for the scene implementation and will run in the
exact-source Linux workflow. TypeScript/lint pass with the existing tutorial
navigation warning; audit reports zero production vulnerabilities. Actual local
production HTTP create, public projection, ownership, CSRF, edit, recover, report
and deletion pass at the new paths. Diff and credential scans pass.

The first local rebuild found stale generated Next development route types after
the relocation. Only that generated type cache was cleared; the full build/check
sequence then passed. No source diagnostic was suppressed.

## Repository state after implementation commit

Main at be4090dc6d8f9f3d024b8c323b2cd6820519e9f1, clean before this journal; one implementation commit ahead of origin. Production
is restored to V0.2 while the corrected Linux artifact is prepared. Final activation
will receive a separate verified receipt.

## Implementation commits

- be4090dc6d8f9f3d024b8c323b2cd6820519e9f1 — Route UBC profiles through the website ingress

## Archive commit

`Record UBC profile routing correction journal`

## Lessons learned

A private candidate proves the app responds; only the public origin proves the
shared ingress forwards that endpoint. Preserve the restrictive shared namespace
and verify recovery as well as reads through both deployed hostnames.

## Follow-up ideas

Keep the documented V0.3 visual/source completeness limits and prioritize the five
improvements in the implementation report.
