# Prompt 129: Deploy GIS Apps and verify the existing city links

- Date: 2026-10-30
- Scope: deployment
- Goal: Publish the GIS Apps grouping and prove Vancouver and Surrey remain available at their existing URLs.

## Original user request

> Please deploy it and verify that the existing Vancouver and Surrey links still work.

Follow-up clarification:

> Also, for this page: [https://asymmetri.co/labs](https://asymmetri.co/labs)
> Instead of direct link to Vancouver and Surrey, should be link to GIS Apps instead

Status request during deployment:

> deployed?

## Scope

Coordinate publication of the already implemented GIS Apps change, independently
verify both public hosts, and record the release. The later Labs-card clarification
was already included in the tested implementation, so it required verification
rather than another code change. Existing footer city shortcuts remain available.

## Decisions

- Reuse the Greater Vancouver GTA project's already authorized Vancouver V0.4
  release, which contains the GIS implementation. One chat owned Linux candidate
  preparation, resource guards and activation; this chat performed independent
  baseline/public/browser checks. No competing server mutation or second restart.
- Preserve the exact `/labs/vancouver` and `/labs/surrey` paths, canonicals and
  retained data. `/labs/gis` is an additive category. Labs main content links to
  GIS Apps in place of individual city cards; BotSquad remains alongside it.
- Wait for the other chat's final release documentation and journal 128, then
  fast-forward before this task's receipt/journal commits. Reserve journal 129
  explicitly to avoid concurrent numbering conflicts.
- Keep exact runtime identity separate from later documentation-only Git commits.
  Runtime stays at `313dba3`, build `Zaa4FN3iARR31Yquw4Cij`.

## Implementation

The coordinated release activated successfully at 18:59:32 UTC / 11:59:32 PDT on
October 30. The live Labs menu and overview now discover GIS Apps; its cards open
the original city pages. The reconstruction discussion is publicly available.
The standalone release receipt records authorization, source/build/CI identity,
complete preceding-runtime recovery and independent acceptance evidence.

## Engineering impact

This task adds documentation, not another runtime change, dependency, service,
redirect, database, tracking mechanism or asset. The existing Node 22 approval,
isolated Linux build, complete-runtime swap and rollback procedures remain in
effect. Vancouver's separately authorized V0.4 changes are documented by that
project's release receipt rather than attributed to the GIS grouping.

## Files changed

- One GIS release receipt describing the live result and independent verification.

## Documentation updated

`docs/GIS_APPS_RELEASE_2026-10-30.md` records the GIS-specific deployment result
and links to the coordinated Vancouver V0.4 receipt for server/retention details.
No setup, content-authoring or deployment-procedure change was needed.

## Git diff summary

Implementation documentation: one file changed, 80 insertions, zero deletions.
No application or public-asset diff in this task.

## Verification

- Independently confirmed successful Linux workflow 41110651124 for exact source
  `313dba357ecc00f1de28b8db5d2c326ec9d1125e`, artifact 13003008184. The coordinated
  release's local checks, both builds, 79 tests and production audit passed.
- Before activation: 14 public page checks, 64 tutorial/map asset hash checks,
  and four redirect checks passed. GIS was correctly absent before release.
- After activation: 16 page checks and exact canonicals, 68 tutorial/map asset
  checks, sitemap and four redirects passed across apex and www. All earlier map
  files and tutorial assets match their baseline bytes. Surrey and protected
  Motion page main text/IDs remain unchanged.
- Explicit Labs-main assertion confirms the GIS category link and absence of
  separate direct city cards. GIS cards retain both original destinations.
- Live browser followed Labs → GIS Apps → each city, verified page headings,
  reconstruction content and the global Labs menu. No console errors observed.
  This does not claim a separate full gameplay or physical-device test campaign.
- SSH read-only checks confirmed clean production main, exact source/build,
  Node 22.23.1, service active/running and zero restarts. The complete preceding
  runtime has source `52f4451`, its expected build and executable Next entrypoint.
- `git diff --check` passed. Receipt/journal changes are documentation-only;
  another build or restart would not add runtime evidence.

## Repository state after implementation commit

Local `main` at `5c0ae7856143eda3edcf7015e1c71d0e491650ed`, clean working tree,
one commit ahead of `origin/main` at `2480452`. Deployment remains on the exact
tested source `313dba3`. The second journal commit and normal main push follow.

## Implementation commits

- `5c0ae7856143eda3edcf7015e1c71d0e491650ed` — `docs(release): record GIS Apps deployment and preserved city links`

The deployed GIS implementation is the prior task's `de88c45`; the coordinated
Vancouver implementation is `e1b97b6`, included in deployed source `313dba3`.
Those tasks retain their own engineering journals.

## Archive commit

`docs(journal): record GIS Apps deployment verification`

## Lessons learned

Serialize deployments across concurrent project chats. A passed build or pushed
commit does not mean a route is live; answer deployment-status questions from
fresh public checks. Compare page content separately from shared navigation and
verify immutable data hashes alongside successful page responses.

## Follow-up ideas

No additional change is committed or required by this request. Future GIS apps
should reuse the category and preserve the established city/data URLs.
