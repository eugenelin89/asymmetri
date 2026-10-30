# Prompt 131: Deploy GIS city naming corrections

- Date: 2026-10-30
- Scope: deployment
- Goal: Deploy the requested Vancouver and Surrey names and verify existing links.

## Original user request

> Please deploy it and verify that the existing Vancouver and Surrey links still work.

Follow-up naming instructions:

> instead calling it "Vancouver in Progress", call it "Vancouver, City in Progress"

> "Surrey Adventure" to "Surrey, City of Adventure"

## Scope

Complete the already-authorized naming release from journal 130. Preserve the
GIS Apps grouping, original city addresses, geographic assets and protected
Motion pages. No city features or unrelated services were changed.

## Decisions

Use the established copy-only release path because package/lockfile, runtime
configuration, app/component routes and public assets are identical. Obtain the
exact-source Node 22 Linux build from the successful isolated workflow; transfer
only its verified build and reuse unchanged installed dependencies. Preserve the
prior build and clean source history. No installation or compilation touches live
or linked dependencies. Coordinate one deployment owner across Greater Vancouver
GTA’s active city work; reserve journal 131 and hold competing main/server changes.

## Implementation

Activated source `69fae182033de1cb6928f4b4b0b35ef9e20a2f78`, build
`q8_M2Gb7kqFINS-9chdOm`, at 19:20:06 UTC / 12:20:06 PDT. Recorded exact workflow,
artifact hashes, recovery locations, resource measurements and public checks in
the naming release receipt. Updated the deployment guide’s current-release pointer.

## Engineering impact

Public display names changed without a URL migration. Previous build remains
available for application-owned recovery. The website alone restarted; Node,
proxy configuration, receivers, peer services and unrelated virtual hosts stayed
unchanged. No private credentials or visitor logs were recorded.

## Files changed

New naming release receipt and the deployment guide’s current-release summary.
Implementation and current naming documentation are covered by journal 130.

## Documentation updated

The release receipt distinguishes the activated source/build from later docs-only
commits, and explains why this copy-only rollback is suitable solely for unchanged
routes/assets/dependencies.

## Git diff summary

Deployment receipt implementation: two files changed, 98 insertions and four
deletions. The earlier naming implementation changed 11 files with 45 insertions
and 26 deletions, as recorded in journal 130.

## Verification

- Exact-source Linux run 41113565527 passed all checks, both city test suites,
  audit and standard Next build; downloaded ZIP and runtime archive hashes match.
- Guarded preparation, build transfer and private smoke acceptance passed above
  192 MiB available-memory and 6 GiB disk floors.
- Public apex/www verification: 16 pages, 68 asset/hash comparisons, four legacy
  redirects, city canonicals, sitemap, emitted city scripts and protected content.
- Main text and IDs remain identical after only intended label substitutions;
  all geographic snapshots and tutorial original assets remain byte-identical.
- Live browser followed both original city links and inspected new names, Surrey
  metadata/accessibility label and Labs overview/menu routing to GIS Apps.
- Final service active/running with zero restarts/errors; clean source and expected
  build; five peer services, 13 unrelated vhost responses and 55 configuration
  fingerprints unchanged. Node executable unchanged.
- Final available memory 409776 KiB; free disk 6932000768 bytes. Previous build
  retained. Detailed sanitized evidence is outside Git at the receipt’s locations.
- `git diff --check` passed. Docs-only receipt changes do not need another runtime
  build or activation; the full source checks already passed before deployment.

## Repository state after implementation commit

Clean main after the release-documentation commit, one commit ahead of origin.
This journal and the receipt will be pushed together. Production remains on the
verified naming source/build; no unrelated work is included.

## Implementation commits

- `759cbf3` — Update GIS city display names without changing URLs (journal 130).
- `6c70f1597344e10e33a599b888041c4efd9907b7` — Record deployed GIS city names and link continuity.

## Archive commit

`Record GIS naming deployment engineering journal`

## Lessons learned

A reviewed exact-source build can serve a small naming release without another
full dependency copy. Keep source identity, running build and rollback identity
separate, and preserve URL/content comparisons across releases.

## Follow-up ideas

None in this request. Future city feature releases remain separately authorized
and must coordinate shared source and production ownership.
