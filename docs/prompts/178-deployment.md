# Prompt 178: Deploy UBC student encounters, reviews and private play reporting

- Date: 2026-10-31
- Scope: deployment
- Goal: Safely activate the exact tested UBC community candidate while preserving peer campuses, private data and complete rollback custody.

**Production accepted:** activation completed at 2026-10-31 23:44:07.435516 UTC;
desktop/mobile browser acceptance passed; final health passed at
2026-11-01 00:02:50.772045 UTC, still October 31 in Vancouver. The release owner
will fill only the deployment-documentation commit and diff fields below.

## Original user request

> ok I am going to bed. you are authorized to make any decision. deploy it right away when you are done.

> for work on the other colleges, don't do it yourself. message the respective thread to do it on their colleges so each thread focuses on its own work.

Standing release authorization applies to the validated community work recorded
in journal 177. This journal records deployment and custody decisions rather than
repeating the supplied research or private attachment paths.

## Scope

Exact-source Linux artifact verification; isolated candidate checkout, streaming
transfer and production smoke; two private community stores; four narrowly
scoped service configuration additions; scheduled analytics cleanup; complete
runtime rollback and post-release acceptance. New interface and recording
integration is UBC-only. Shared API support for CWRU/Stanford does not activate
their frontend features; each campus owner controls that rollout.

## Decisions

The candidate remains `704a9b3bfc2a3eafcac0360f490af01aafbf56ff`, built from
application implementation `6de99d2b2a9f130c2f5fd29d1c9fd19ddcc504f7` plus the
separate journal 177. Newer documentation-only commits may exist on main, but
every intervening commit is checked before any staging checkout. Runtime
changes, deletion, divergent ancestry and runtime-edit/revert sequences stop
the release. The isolated tree resets to the exact tested candidate.

Local artifact approval is distinct from full release approval. Successful
exact-SHA CI, fresh API ZIP digest, safe archive members and embedded source,
Node and build identities are mandatory. Server actions additionally require
the reviewed live baseline, resource and custody gates. The artifact streams
into isolated application-owned staging while its remote digest is computed;
only a matching complete stream can be accepted. No server build is performed.

A separate user-authorized disk cleanup changed historical archive locations
during preparation. This workstream's optional precheck stopped before any
archive/retirement action. Pinned cleanup evidence reconciles nine verified
owner-local archive copies plus three existing owner-only archives. The prior
live Stanford runtime and immediate CWRU rollback were preserved. Historical
custody, not continued residence on the production disk, is the requirement.
The temporary shallow-source study was abandoned; the full independent clone
and original capacity gates remain in use.

The 192 MiB available-memory floor, 6 GiB free-disk floor, 120 MiB prospective
margin and 80 MiB smoke heap were retained. After a validation header-case bug
and a guarded memory failure, private smoke was reorganized sequentially:
HTTP/image checks, candidate shutdown, readiness, then standalone prune. These
helper corrections do not change the frozen application artifact.

## Implementation

The prepared runtime adds all 500 supplied UBC identities as 498 new student
records plus two deduplicated existing characters. Discovery stays encounter-only,
with natural study dialogue, varied simulated appearance, GIS-derived placement
and a twelve-actor streamed pool. Eleven records have documented source checks;
489 retain supplied-research labels. No claim of verified current enrollment or
real-world movements is made.

UBC receives public visitor reviews with immediate publication, browser-owned
edit/removal and private reporting/moderation. Private usage reporting measures
browser capabilities and sessions, not people, with approximate bounded active
duration. A visible notice, GPC/DNT, opt-out and browser-owned erasure apply to
the current hostname. No typed content, coordinates, fingerprint or profile/review
identity join is collected. Raw connection/browser metadata expires after 30
days and session summaries after 90 days, applied at the next cleanup; outages,
hosting logs and retained backups have separate operational limits.

**Activation result: successful.** Four configuration additions and the two
application-owned mode-0700 private review/analytics directories were installed
at 23:43:40.715766 UTC. The exact source/build became healthy after activation
from 23:43:49.363408 to 23:44:07.435516 UTC. The daily prune timer was enabled and
its first execution passed. Desktop/mobile browser acceptance and complete final
server health passed. The next scheduled prune was verified as November 1 at
03:30 UTC.

## Engineering impact

Persistent Node-backed stores remain outside all checkout and public directories,
with 0700 directory and 0600 file permissions. No package dependency, ingress or
peer-service change is required. Runtime swaps drain the pruner and preserve all
three existing profile stores plus any newer reviews/analytics. The full prior
Stanford runtime becomes the next immediate rollback; rollback cannot overwrite
newer private visitor data or remove existing campus drop-ins.

## Files changed

Application changes belong to the already committed 59-file journal-177 scope.
This deployment record adds the accepted release receipt and deployment/testing
status documentation. Four production review/walking/privacy
captures have been added to the validation documentation with updated validation
README and asset attribution. Private helpers, custody receipts, signed URLs and
visitor data are not repository artifacts.

- `README.md`
- `docs/ASSET_MANIFEST.md`
- `docs/DEPLOYMENT.md`
- `docs/TESTING.md`
- `docs/UBC_CAMPUS_COMMUNITY_2026-10-31.md`
- `docs/UBC_STUDENT_IMPORT_2026-10-31.md`
- `docs/UBC_COMMUNITY_RELEASE_2026-10-31.md`
- `docs/validation/ubc-community/README.md`
- `docs/validation/ubc-community/live-reviews-desktop.jpg`
- `docs/validation/ubc-community/live-reviews-mobile.jpg`
- `docs/validation/ubc-community/live-walking.jpg`
- `docs/validation/ubc-community/live-privacy.jpg`

## Documentation updated

The accepted release receipt, implementation/deployment status and operational
validation notes distinguish local, CI, private smoke, production HTTP and
browser results. Validation README and asset attribution describe four production
captures. All documentation preserves the UBC-only rollout boundary.

## Git diff summary

Deployment documentation: 12 files changed, 314 insertions and 10 deletions, including four binary browser captures. The earlier application basis was 59 files changed, 7,271 insertions and 24 deletions, followed by journal 177. This summary excludes the current journal.

## Verification

- Final isolated local validation passed 592 tests, TypeScript/ESLint, Next
  webpack, Vinext and the production dependency audit. Existing tutorial
  navigation/build advisories were recorded; no physical-device testing is claimed.
- Exact candidate Linux CI run `41250567424`, job `124683041491`, passed 585
  tests and built artifact `13060883276` on Node `v22.23.1`. Seven local-only
  investment tests explain the count difference.
- Accepted artifact identity: BUILD_ID `sEPpfQJeW_TCHMYdvJXV0`, ZIP SHA-256
  `291de2416f46a85e832abbc1312682f8abd55b748e67179332277770b7d71c94`, tar SHA-256
  `a7aa1d6c6b00cc5834a07855c6752941d73de6a6ac72beead4577d3011d8326a`.
- Fresh baseline at 23:27:49 UTC records 58 configuration files, 800 public
  assets, 15 peer hosts and three profile stores. Source/build are
  `a69cb68c9f11942978fdec16ff2d0ddac04d88b6` / `otCTTCCerr51Hh_vOJxBA`.
- The full-clone descendant policy passed six local fixtures. The reconciled
  custody checker passed seven tests plus independent review.
- Remote artifact guard passed: minimum available memory 418400 KiB and free
  disk 11653263360 bytes.
- First smoke: header lookup bug corrected. Second smoke: resource guard stopped
  overlapping validation work. Neither attempt activated production. Revised
  sequential smoke passed locally and remotely. The remote guard recorded
  272024 KiB minimum available memory, 11649781760 bytes minimum free disk and
  unchanged protected service identities. Private readiness, empty profile/review
  fixtures and image-optimizer HTTP 200 passed.
- Activation receipt confirms exact candidate/build, preserved complete Stanford
  predecessor, enabled prune timer and successful first prune. Before/after
  snapshots were 411944/371012 KiB available memory and
  11649720320/11564892160 bytes free disk; these are not continuous minima.
- Earlier final-health attempts stopped on public-asset TLS EOF, remote
  disconnection or socket timeout. Bounded private-checker retry handling passed
  nine injected transport tests, without changing the application artifact.
- The third final-health attempt passed all 18 protected routes and 800 assets
  on each of loopback, apex and www, then stopped in the nonpublishing review
  validator because its single-header lookup missed a separate `Vary: Cookie`
  header after Next's own variation header. A direct server probe verified the
  correct application header. The checker was corrected to collect all variation
  tokens and independently validated. The failed aggregate attempt remains
  distinct from the later complete successful run.
- Production browser acceptance passed at 1280×720 desktop and 390×844 mobile;
  the mobile review form had no horizontal overflow and no review was published.
  Recording was disabled before play, then its original enabled preference was
  restored after reload. Original Halloween and viewport settings were restored.
  The 3D scene loaded at the UBC letters; closing Explore campus focused the
  canvas and W for 1.4 seconds moved immediately, verified in a screenshot.
  The directory showed one Crescent West entry for seven footprints and no
  character list. Privacy details opened a new tab with `noopener noreferrer`;
  controls remained visible and the console contained no errors or warnings.
  Four reviewed production captures now support these checks in the repository:
  desktop reviews and walking at 1280×720, mobile reviews at 390×844, and privacy
  at the restored native 413×598 viewport. This is responsive browser validation,
  not a physical-device or audible-playback test.
- A journal check initially included the predecessor's expected SIGTERM exit 143
  from the same wall-clock second. Exact boot identity and monotonic service-start
  filtering corrected that false positive; six focused fixtures passed. The
  final scan examined eleven entries, excluded five before startup, and found
  six new entries with zero errors, warnings or unreadable messages.
- Complete final health passed at 2026-11-01 00:02:50.772045 UTC: all 18 routes
  and 800 assets on each loopback/apex/www target; all 15 peer-host behaviors;
  nonpublishing review checks and 30 analytics boundary/bootstrap probes;
  actual running private-store paths and permissions; timer success, enabled/
  active state and the November 1 03:30 UTC next run; twelve archive-custody
  records and all three profile stores. Owner archive attestation was refreshed
  at October 31 23:59:17 UTC. Minimum available memory was 284504 KiB and free
  disk 11596201984 bytes. Both complete predecessor runtimes remain preserved.

Synthetic reviews and valid play-session fixtures belong only to disposable
validation stores. Production acceptance published zero test reviews and created
zero synthetic play sessions. The absent review data file is expected; its
private directory and the existing analytics data file passed permission checks.

## Repository state after implementation commit

The application implementation and journal-177 candidate were committed and
pushed on main. Newer documentation-only Stanford commits were allowed while
the runtime candidate stayed frozen. Other-campus work remains owned by its
respective thread and is excluded from this deployment's implementation scope.

Deployment documentation committed as `0c1b2a955ea5a53b3b69034de2db9fcbd100ca56` on shared `main`, after the other owners' already committed integrations. Only the twelve explicit documentation/evidence paths were staged. Uncommitted CWRU/Stanford work, the separate UBC privacy-card-removal follow-up and generated `next-env.d.ts` were excluded. The index was empty before scoped staging; both documentation commits are pushed together. The production runtime remains frozen at `704a9b3` regardless of newer main source.

## Implementation commits

- `6de99d2b2a9f130c2f5fd29d1c9fd19ddcc504f7` — `feat(ubc): add student encounters, reviews and private play reporting`
- `0c1b2a955ea5a53b3b69034de2db9fcbd100ca56` — `docs: record verified UBC community release`

The deployed-candidate journal commit is
`704a9b3bfc2a3eafcac0360f490af01aafbf56ff`; this identifies the frozen artifact
source and is not a new application implementation commit.

## Archive commit

`docs: record UBC community deployment in journal178`

## Lessons learned

Reconcile shared-host changes before acting on stale retention assumptions.
Pin archive custody independently of its physical location. Keep artifact-only
download approval separate from deployment approval. Serialize memory-intensive
private validation phases instead of relaxing safety floors. Compare an exact
runtime candidate even when separately owned documentation advances main.

## Follow-up ideas

CWRU and Stanford owners can integrate the shared interfaces after their own
validation. Broader student-source refresh, physical-device checks and a private
authenticated reporting interface remain separate future work. None is a
claim that the current release already provides it.

The owner subsequently requested removing the privacy card everywhere. That
change is tracked separately as follow-up 183 and coordinated with the CWRU and
Stanford owners. It is outside frozen source `704a9b3`; this journal's interface
captures accurately record the accepted release rather than the later redesign.
