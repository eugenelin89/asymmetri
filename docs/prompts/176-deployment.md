# Prompt 176: Deploy and verify the Campus and City submenu

- Date: 2026-10-31
- Scope: deployment
- Goal: Publish the submenu rename while preserving every existing URL and peer application.

## Original user request

> for the submenu "GIS Apps", change to "Campus and City"

The earlier explicit deployment request and Greater Vancouver GTA coordination
instruction cover this related website follow-up. Journal 175 records the label
implementation; this record closes the authorized release.

## Scope

Deploy the single navigation-label change from exact-source Linux CI. Keep the
GIS Apps hub/card/footer names, all routes, assets, application code, dependencies,
configuration and profile storage unchanged. Exclude unpublished campus/review/
student work held in other checkouts.

## Decisions

Wait for UBC's frozen release and journal 168, then take its explicit handoff.
CWRU agreed to hold integration for this menu-only release. Use the existing
copy-only deployment path, verified Linux output and unchanged linked dependencies.
Retain the immediately previous Next build and all older complete recovery trees.

## Implementation

Source `4f57af9f7d3827d49166e29bffe680c77f4132e2`, Linux build
`9fGY4CtfRyxjVywNp8Hqf`, activated at 22:07:44 UTC / 15:07:44 Vancouver.
The submenu displays Campus and City and opens the unchanged `/labs/gis`.

## Engineering impact

No route migration, new dependency, gameplay change, backend activation or profile
mutation. No DNS, proxy, TLS, Node or peer service configuration change. Application
file/Git operations used the existing owner and deployment helper. No production
compilation or linked-dependency installation occurred.

## Files changed

Added the exact release/verification/recovery receipt and updated the deployment
guide's current-runtime pointer. This documentation commit does not change the
running source or build. No screenshot or new public asset was added.

## Documentation updated

`CAMPUS_CITY_MENU_RELEASE_2026-10-31.md` records source/build/artifact hashes,
validation, capacity and rollback. `DEPLOYMENT.md` identifies the current release
and points historical recovery questions to the retained After Dark receipt.

## Git diff summary

The release documentation commit changes two files: 104 insertions and seven
deletions. The earlier implementation changed two files: five insertions and
three deletions. This journal is excluded from those totals.

## Verification

- Exact-source Linux workflow 41246009677 passed check, city tests, production
  audit and Next webpack build. Artifact 13059670274 passed ZIP/tar/source/Node/
  build verification; the transferred Next subset checksum also matched.
- Private smoke: 17 routes, eight protected-host checks, 738 assets; existing main
  text, IDs, canonicals, sitemap entries, footer/context links and route URLs intact.
- Both public hosts before/after: 32 pages, 106 assets and six redirects passed,
  including Vancouver, Surrey, protected Motion routes and legacy Trade context.
- Live browser at 320/768/1440 CSS pixels: menu fits, no horizontal overflow,
  visible keyboard focus, Enter opens `/labs/gis`, retained title/city links,
  no observed console errors. Temporary viewport override reset.
- Initial preparation stopped on the preceding UBC README receipt update. That
  documentation-only change was reviewed and failure evidence preserved before a
  successful repeat; runtime scope and resource guards were unchanged.
- Final health at 22:10:40 UTC: active/running, zero automatic restarts/errors,
  415,992 KiB available RAM and 6,566,490,112 free bytes; 192 MiB / 6 GiB floors
  maintained. Five peer services, 56 configuration fingerprints, 13 virtual hosts
  and Node unchanged. Immediate old build verified in the rollback workspace.
- `git diff --check` passed. No broader gameplay or physical-device acceptance is
  claimed. Source/body assertions and existing suites cover this copy-only change.

## Repository state after implementation commit

Clean main after release-documentation commit, one commit ahead of origin. This
journal will be committed separately and both documentation commits pushed. Live
source stays at `4f57af9`; later documentation commits do not require a restart.

## Implementation commits

- `d4c71a65f62aed285133bbabe6eb429cee1ce737` — Rename Labs submenu to Campus and City.
- `f7fbea0afc9a8776e075c55e9fd203c0b69f8558` — Record verified Campus and City menu deployment.

## Archive commit

`Record Campus and City submenu deployment journal`

## Lessons learned

Coordinate a concrete handoff boundary so a small navigation request can finish
without publishing unrelated work. Preserve independent menu labels and URLs,
exact-source build provenance and bounded rollback across shared releases.

## Follow-up ideas

No remaining work for this request. Later campus releases should preserve the new
submenu wording and refresh actual runtime identity/capacity before staging.
