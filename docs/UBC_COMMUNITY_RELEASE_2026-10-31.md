# UBC campus community release

**Status: deployed and accepted.** Production activated at
2026-10-31 23:44:07.435516 UTC. Final health passed at
2026-11-01 00:02:50.772045 UTC, still October 31 in Vancouver.

## Candidate and scope

| Item | Verified value |
| --- | --- |
| Application implementation | `6de99d2b2a9f130c2f5fd29d1c9fd19ddcc504f7` |
| Exact tested release candidate, including journal 177 | `704a9b3bfc2a3eafcac0360f490af01aafbf56ff` |
| Linux BUILD_ID | `sEPpfQJeW_TCHMYdvJXV0` |
| Production Node | `v22.23.1` |
| Linux CI run / job | `41250567424` / `124683041491` |
| Artifact ID | `13060883276` |
| Fresh artifact ZIP SHA-256 | `291de2416f46a85e832abbc1312682f8abd55b748e67179332277770b7d71c94` |
| Runtime tar SHA-256 | `a7aa1d6c6b00cc5834a07855c6752941d73de6a6ac72beead4577d3011d8326a` |
| Compressed / expanded runtime bytes | `256889386` / `913253361` |

The [exact-source Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41250567424)
completed successfully. The application commit changes 59 scoped files; the
separate journal-177 commit is included in the tested candidate. There are no
dependency additions or changes to existing public assets in this release.

New frontend features are integrated into **UBC only**. Shared review and
analytics APIs support UBC, CWRU and Stanford, but each other campus's owner is
responsible for its own integration, tests and deployment. A tested CWRU draft
was handed to its owner and removed from this candidate. Existing CWRU/Stanford
pages, assets and public profiles remain protected; API support is not a claim
that their new interfaces or recording are enabled.

## Visitor-facing changes

The student import covers all 500 supplied UBC identities: 498 new encounter-only
records and two existing rowing characters enriched without duplication. It
retains 76 study-program labels and uses 37 GIS department anchors with routes
along actual pedestrian source edges. Up to 12 streamed student actors are
instantiated at a time, in addition to the existing cast. Rotation respects
visibility, distance and active conversations. Names and simulated positions are
not added to the destination directory.

Introductions and study follow-ups use natural wording. The information section
keeps source confidence visible: 11 records have documented checks, including
two search-index checks; the other 489 remain supplied research. This does not
establish current enrollment. The importer excludes contact columns and portraits;
models, routes and movements are original simulations, not measured appearances
or real whereabouts.

The review section above UBC's footer offers 1–5 stars, optional text, a chosen
display name, rating distribution, sorting, pagination, editing, removal and
reporting. Reviews describe the virtual experience. Publication is immediate;
one review per browser/campus is controlled by a separate HttpOnly capability.
Reports stay private and do not automatically remove reviews. Private moderation
supports hiding, restoring and removal. No fabricated production reviews are
included or needed for acceptance.

Private play reporting starts only after exploration begins. Visible, on-screen
play with recent input contributes bounded server-timed activity; hidden,
off-screen and idle play pauses collection. It records a random first-party
browser capability, campus sessions, connection IP and basic User-Agent metadata.
It does not record input text, conversations, positions or fingerprints, or join
records to public profiles or reviews. Cookie-only bootstrap and cross-tab Web
Locks protect ownership and deletion; unsupported privacy coordination disables
optional collection.

Counts mean **recorded browsers and sessions, not verified people**. Cleared
cookies, multiple devices and separate apex/www hostnames can count one person
more than once; shared browsers can represent several people. Concurrent tabs
can overlap duration, so totals are not person-hours or proof of attention.
GPC/DNT, a visible opt-out and browser-owned removal are supported. Preferences
and removal apply to the current website hostname, not every origin or device.

Raw IP/User-Agent fields expire 30 days after session start; pseudonymous session
summaries expire after 90 days. Cleanup applies on the next accepted operation,
private report or scheduled prune. A daily schedule can lag by its interval and
outages need catch-up. Hosting logs and retained backups have separate retention.
The production timer is enabled and active, its first prune completed successfully,
and the next scheduled run was verified as November 1 at 03:30 UTC.

## Completed validation

- Final isolated local validation passed **592/592 tests**: UBC 144, reviews 13,
  analytics 29, CWRU 89, Stanford 140, Surrey 69, Richmond 27, Vancouver 74 and
  investment 7. Local Node was `v24.10.0`, matching the repository's Node 24 line.
- TypeScript and lint passed, with the existing tutorial-navigation warning.
  Next webpack and Vinext builds passed; the production dependency audit found
  zero vulnerabilities. Existing browser-data-age and build advisory messages
  were recorded separately from errors.
- Exact committed-source Linux CI passed **585/585 tests** and its production
  build. The seven additional investment tests account for the local total.
- Earlier local browser validation covered review post/edit/remove/report,
  sorting and reload; natural student conversations and source links; no
  recording before entry, activity, opt-out, removal and cross-tab preferences;
  phone 390×844 and tablet 768×1024 layout. Checks involving the removed CWRU
  draft are historical test evidence, not candidate feature coverage.
- The private full-clone policy passed six disposable Git fixtures: exact-head
  and documentation-only descendants pass; runtime changes, divergent ancestry,
  documentation deletion and runtime-edit/revert sequences fail before checkout.
- The updated archive-custody checker passed seven focused tests and independent
  review. Local sequential-smoke lifecycle fixtures and the final remote smoke
  both passed. Remote smoke confirmed private readiness, three-campus empty
  profile projections, empty review fixtures and image-optimizer HTTP 200.

Production browser acceptance passed at **1280×720 desktop** and **390×844
mobile**. The mobile review form had no horizontal overflow. No review was
submitted. Privacy recording was disabled before entering the 3D scene, then the
original enabled preference was restored after reload; the original enabled
Halloween setting and viewport were also restored.

The 3D experience loaded at the UBC entrance letters. Opening Explore campus and
closing its panel returned focus to the canvas; holding W for 1.4 seconds moved
the visitor immediately, verified in a screenshot. The directory displayed one
Crescent West destination representing seven footprints and no character list.
Privacy details opened a new tab with `noopener noreferrer`, and the relevant
controls remained visible. Browser console checks found no errors or warnings.

The release owner retained the production screenshots in the validation
documentation after checking that they contain no raw visitor data:

| Capture | Dimensions |
| --- | --- |
| [Desktop reviews](validation/ubc-community/live-reviews-desktop.jpg) | 1280×720 |
| [Mobile reviews](validation/ubc-community/live-reviews-mobile.jpg) | 390×844 |
| [Immediate walking](validation/ubc-community/live-walking.jpg) | 1280×720 |
| [Privacy controls](validation/ubc-community/live-privacy.jpg) | 413×598, native viewport after the override was reset |

These are responsive browser checks, not physical-device validation; no
physical-device or new audible-playback claim is made. Final server health
also passed for the unchanged application artifact.

## Protected baseline, archive custody and staging

The refreshed baseline at **2026-10-31 23:27:49 UTC** records 58 configuration
files, 800 public assets, 15 peer hostnames and all three profile stores. The
then-live Stanford runtime is source
`a69cb68c9f11942978fdec16ff2d0ddac04d88b6`, build
`otCTTCCerr51Hh_vOJxBA`. Its existing immediate CWRU predecessor remains source
`28b5521a9f7edd809b49d594b7a75eb64f3f66be`, build
`H6dUdFnitvZI1P5BXdc9O`.

A separately authorized server-disk cleanup changed historical archive
locations while this release was preparing capacity checks. This workstream's
optional archive precheck stopped before performing any archive or retirement.
The cleanup owner's evidence confirms nine removed server archive copies have
verified retained owner-local copies; together with three existing owner-only
archives, custody covers twelve historical archives. The older menu runtime was
removed by that separate cleanup. The live Stanford runtime and immediate CWRU
rollback, profile data, configuration and served sites were preserved. The
release plan was reconciled to pinned custody receipts rather than treating
missing server paths as lost backups or recreating them unnecessarily.

The earlier shallow-checkout capacity study was not adopted. With reconciled
capacity, staging uses the independent full `--no-hardlinks --no-checkout`
clone. Newer main commits may only add/modify documentation; the runtime remains
pinned to the exact candidate. Source scope, candidate identity and existing
public assets are checked separately. Runtime transfer streams through checksum
verification and isolated extraction without a compressed server spool. A
failed checksum cannot be accepted for activation.

The artifact-transfer guard passed with minimum available memory **418400 KiB**
and minimum free disk **11653263360 bytes**. The established floors remain
192 MiB available memory and 6 GiB free disk, plus the 120 MiB prospective
staging margin. No lower floor or margin was adopted.

## Smoke corrections, activation and final acceptance

The first private smoke attempt exposed a validator response-header casing bug;
the checker was corrected to use the response header interface. A later attempt
hit the memory guard while HTTP candidate checks and private readiness processes
overlapped. The guard stopped that attempt; no production activation had occurred.

The revised private smoke runs HTTP and image-optimizer checks first, stops the
candidate process, runs isolated readiness, and finally invokes the standalone
prune CLI after readiness exits. The same 80 MiB Node heap and resource floors
remain in force. The readiness and cleanup changes affect private validation
helpers, not the tested application artifact.

Final sequential remote smoke passed for the exact candidate and BUILD_ID. Its
guard exited zero with no guard failure and unchanged protected service
identities, minimum available memory **272024 KiB** and minimum free disk
**11649781760 bytes**.

Installed persistent additions are two application-owned private directories,
`/var/lib/asymmetri-campus-reviews` and
`/var/lib/asymmetri-campus-analytics`, two website environment drop-ins, and one
analytics prune service/timer pair. The four configuration files were installed
at **23:43:40.715766 UTC**; both directories were verified application-owned mode
0700. Final health verified the running store configuration and analytics file's
mode-0600 permissions. The review data file remains absent because acceptance
published no reviews; its private directory is ready. The daily schedule is
03:30 UTC with persistent catch-up. The timer is enabled and active, the first
prune passed, and its next run was verified as November 1 at 03:30 UTC.
Existing campus settings remain protected baseline.
There is no Nginx, peer service or OS change in this release plan.

Activation ran from **23:43:49.363408 to 23:44:07.435516 UTC**. The exact source
`704a9b3bfc2a3eafcac0360f490af01aafbf56ff` and BUILD_ID
`sEPpfQJeW_TCHMYdvJXV0` became healthy at loopback. Available memory/free disk
were 411944 KiB / 11649720320 bytes before activation and 371012 KiB /
11564892160 bytes afterward; these are receipt snapshots, not continuous minima.

The immediate rollback after activation is the complete fresh Stanford
predecessor at `/var/www/asymmetri-rollback-before-ubc-community-20261031`.
Deployment/rollback must preserve newer profile, review and analytics records
and stop/drain pruning around runtime swaps. Only this release's verified
configuration additions may be removed during rollback; existing campus
drop-ins and historical owner custody must remain intact. The activation receipt
confirms the rollback source/build match that predecessor.

Earlier final-health attempts stopped on public-asset transport interruptions,
including TLS EOF and remote disconnection/socket timeout. Bounded retry handling
was added to the private checker and passed nine injected transport tests; the
application artifact did not change.

The third final-health attempt passed all **18 protected routes and 800 public
assets on each of loopback, apex and www**, then stopped in the nonpublishing
review validator. That validator read only the first `Vary` header, which Next
uses for its own response variation, and missed a separate `Vary: Cookie` header.
A direct server probe verified the required cookie variation is present. The
checker was corrected to collect every `Vary` header and compare tokens, with
focused validation. The application remained unchanged. A later journal check
initially included predecessor shutdown messages from the same wall-clock second,
including the expected SIGTERM exit 143. The final checker uses the exact boot
identity and monotonic service-start boundary; six focused fixtures passed.
These failed validation attempts remain recorded separately from the successful
final run.

The complete final-health run passed from **2026-11-01 00:00:17.074606 to
00:02:50.772045 UTC**. All 18 protected routes and 800 assets passed on each of
loopback, apex and www. Nonpublishing reviews and 30 analytics boundary/bootstrap
checks passed without creating a production review or synthetic play session.
All 15 peer-host behaviors, the three profile stores, existing configuration,
running private-store paths and permissions, and both complete predecessor
runtimes were preserved.

Historical custody was refreshed at **2026-10-31 23:59:17 UTC** and all twelve
owner-held archives were verified. Final minimum available memory was
**284504 KiB**, with minimum free disk **11596201984 bytes**. The bounded journal
scan inspected eleven entries, excluded five preceding service start, and found
six current-process entries with **zero errors, warnings or unreadable messages**.

## Acceptance ledger

| Required acceptance | Result |
| --- | --- |
| Sequential loopback smoke and private readiness | Passed |
| Four configuration files installed and verified | Passed |
| Exact source/build activated and healthy | Passed loopback, apex and www |
| Prior runtime preserved as complete immediate rollback | Passed activation checks |
| Prune execution, enabled state and next scheduled run | Passed; next run November 1, 03:30 UTC |
| Loopback/apex/www protected routes and assets | Passed: 18 routes and 800 assets per target |
| Peer behavior and complete final acceptance | Passed: all 15 peer-host behaviors preserved |
| Actual running private-store configuration and file permissions | Passed; empty review store correctly has no data file |
| Nonpublishing review/analytics API probes | Passed; zero published test reviews or synthetic play sessions |
| Bounded new-process journal review | Passed: six new entries, zero errors/warnings |
| Final archive-custody and three-profile preservation checks | Passed: twelve archives and all three profile stores |
| Production browser acceptance | Passed desktop/mobile, review/privacy controls, directory and immediate walking; no review submitted |
| Deployment documentation commit and journal 178 | Release owner records final commit identities separately |

Future work remains with the respective owners: CWRU/Stanford frontend rollout,
broader student-source re-verification, physical-device acceptance and any
authenticated operator dashboard. None is implied complete by shared backend
capability or this release.

After this candidate was frozen, the owner requested removing the privacy card
across campuses. That interface change is coordinated separately as follow-up
183 with the respective campus owners. It is not included in source `704a9b3`;
the privacy-card screenshots and checks above accurately document this accepted
release and are not evidence of the later removal.
