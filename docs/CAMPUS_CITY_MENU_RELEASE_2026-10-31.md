# Campus and City submenu — production receipt

Deployed and verified **October 31, 2026 at 22:07:44 UTC / 15:07:44 Vancouver**.
The global Labs submenu now says **Campus and City** and continues to open
[`/labs/gis`](https://asymmetri.co/labs/gis). The hub title, Labs category card and
footer retain GIS Apps. Every existing URL remains unchanged.

## Exact release

| Item | Verified identity |
| --- | --- |
| Implementation | `d4c71a65f62aed285133bbabe6eb429cee1ce737` |
| Candidate / activated source | `4f57af9f7d3827d49166e29bffe680c77f4132e2` |
| Linux build | `9fGY4CtfRyxjVywNp8Hqf` |
| Runtime | Existing `v22.23.1` |
| Linux workflow | [41246009677](https://github.com/eugenelin89/asymmetri/actions/runs/41246009677), successful |
| Artifact | `13059670274` |
| ZIP SHA-256 | `b95de45c8ee9f4688f760199deb04f81aca5e61a6c8477ec3dfe130da416b524` |
| Runtime tar SHA-256 | `01c298931196dc7addce463fa7f188af0df661a559524c9d3ad3b0acab16c9bd` |
| Transferred Next-only tar SHA-256 | `5a745334a39e2630d0c957d563042932386bb72221f1aab31f152c23fb6af29a` |

The user authorized deployment earlier in this website workstream. UBC explicitly
handed over the main/server window after its After Dark release and journal 168;
CWRU agreed to defer its integration. This release contains one navigation-label
change plus documentation. Concurrent campus, student and review work in another
checkout was excluded.

## Validation

- Local focused TypeScript using repository options, scoped ESLint, production
  dependency audit and diff checks passed. Executing baseline/edited content and
  normalizing the single label proved that every other exported value is identical.
  A redundant broad local baseline typecheck was stopped during Mac contention;
  no separate full local build is claimed for this label-only change.
- Exact-source Linux CI passed full TypeScript/ESLint, Vancouver tests, the Surrey,
  Richmond and UBC prebuild suites, the production audit and Next webpack build.
  No dependency or framework integration changed.
- ZIP/tar checksums, embedded source, Node and build identity passed before transfer.
  Only the verified Next output was transferred; existing unchanged dependencies
  were hard-linked in the temporary workspace. No installation or compilation ran
  in the live directory or linked dependency tree.
- Guarded private smoke passed **17 routes, eight protected-host checks and 738
  assets**. Main text, IDs, canonicals, sitemap entries and existing links matched
  the serving release; only the header label changed. The candidate then stopped.
- Both-host public before/after comparisons passed **32 pages, 106 asset checks
  and six permanent redirects**. Vancouver, Surrey, Richmond, UBC, BotSquad and
  Motion routes remain reachable. Tutorial IDs, original images, exact www
  canonical and protected footer/context links are preserved. The legacy Trade
  redirect retains suffix and query context.
- Live browser checks at **320, 768 and 1440 CSS pixels** showed the new label
  without horizontal overflow. Keyboard focus had a visible 3 px outline;
  Enter followed the menu link to `/labs/gis`. The page still says GIS Apps and
  its Vancouver/Surrey card URLs are unchanged. No console errors were observed.
  The temporary viewport override was reset. No new animation, asset or CSS was
  introduced; this is not a new gameplay or physical-device acceptance claim.

The initial preparation scope check stopped before creating the workspace because
the preceding UBC receipt also updated root README. That documentation-only diff
was reviewed, the failed receipt retained, and preparation rerun successfully with
README accepted. Application, route, asset, configuration and capacity safeguards
were unchanged.

## Runtime health and recovery

Fresh preflight matched prior source `f106770b8c6fff7db2e812c53d8623f871f61b99` /
build `Al8RacnJ4uunt6U1i9VTC`. Private smoke observed minimum
**268,340 KiB available RAM / 6,566,842,368 free disk bytes**.
All successful preparation, transfer and smoke guards preserved service identities.
Activation changed only Asymmetri, with **56 configuration fingerprints, five peer
services, 13 unrelated virtual hosts and Node unchanged**.

Final health at **2026-10-31T22:10:40.219989+00:00** confirmed active/running service, zero automatic
restarts and zero post-activation error entries, with **415,992 KiB
available RAM / 6,566,490,112 free bytes**. The existing **192 MiB / 6 GiB**
floors were maintained. Refresh capacity before any later release.

The immediate copy-only rollback is the preserved `Al8RacnJ4uunt6U1i9VTC` build:

`/var/tmp/asymmetri-campus-city-menu-20261031/previous.next`

Its corresponding source is `f106770b8c6fff7db2e812c53d8623f871f61b99`. Stop only
Asymmetri, move the current `.next` aside, restore this preserved `.next` as the
application owner and start the service; then repeat health and protected-route
checks. Dependencies, public files and all other application code are identical.
Preserve Git history and both builds; do not reset the production checkout.

The complete older 8eba runtime remains at
`/var/www/asymmetri-rollback-before-ubc-v041-welcome-20261031`;
the complete f3e5a9f runtime and all retained archives are untouched. Consult the
[After Dark receipt](UBC_AFTER_DARK_RELEASE_2026-10-31.md) for exact historical
archive custody and recovery, including the owner-held bbf archive. This menu
release performs no retention deletion, profile-store mutation or infrastructure
change. Later documentation commits do not change its running source/build.
