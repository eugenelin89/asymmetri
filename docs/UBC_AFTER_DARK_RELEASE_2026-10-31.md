# UBC After Dark — production receipt

**Deployed and verified October 31, 2026 at 21:52:48 UTC / 14:52:48 Vancouver.**
Both [apex](https://asymmetri.co/labs/ubc) and
[www](https://www.asymmetri.co/labs/ubc) passed public acceptance. Final health at
21:54:01 UTC confirmed the exact source/build and recovery state. The owner
authorized autonomous completion and deployment. Later documentation commits do
not change the running source or build.

## Exact candidate

| Item | Verified identity |
| --- | --- |
| Implementation | `9a5872e5a409a04a7d847e1b3c19ba7c92c930b3` |
| Candidate / activated source | `f106770b8c6fff7db2e812c53d8623f871f61b99` |
| Linux Next build | `Al8RacnJ4uunt6U1i9VTC` |
| Linux workflow | [41244364287](https://github.com/eugenelin89/asymmetri/actions/runs/41244364287), successful attempt 1 |
| Artifact | `13059015894`, created 21:39:56 UTC |
| Node | Existing `v22.23.1`; unchanged during staging |
| ZIP SHA-256 | `deaefe27eca38a63bd5071628755dcacb11250411ea1ce1a1052969844939914` |
| Runtime tar SHA-256 | `43a390942a72395c8a4d127372fe047b5b610ef48a627e980c0d80eb8c0ef9d9` |
| Runtime tar size | 254,944,452 bytes; 899,763,936 uncompressed bytes |

Archive paths, links, checksums, source and runtime identity were verified before
and after transfer. An independent application-owned checkout received the exact
Linux artifact. No compilation, dependency installation or Mac runtime transfer
occurred on production. The scope gate accepted exactly 20 UBC-owned paths plus
documentation/root README changes. Shared routes, site copy, dependencies, GIS,
profile backend and runtime configuration were unchanged.

## Candidate experience

- A responsive Halloween welcome uses original inline SVG artwork and an edition
  choice before entry. Halloween defaults to October 24–November 7 inclusive in
  Vancouver, with the current-year visitor preference taking precedence. Normal
  seasons follow the calendar. Christmas remains unavailable, not implemented.
- Six original monster types supply 84 safe route placements in the full fixture,
  with quality/distance limits. Twenty-four comic, manga and robot costume
  visitors join them. Existing 29 interior decoration sets and two gateway
  pumpkins remain. These counts do not mean every actor renders simultaneously.
- One independently switchable original masked pursuer follows at 2.4 m/s,
  stops short, waits outside buildings and can be outrun at 5.5 m/s. It adds no
  damage, combat or score system.
- Original procedural audio supplies music, wind, howls and nearby ghost cries.
  Entry unlocks audio; mute, volume, hidden-tab suspension and cleanup are
  supported. No downloaded recordings or cloned voices are used.
- Six encounter-only alumni visitors share names and education from directly
  accessible self-authored LinkedIn graduation posts. These are self-reported
  education sources, not independently verified credentials or current-student
  claims. No photos, contact details or current-job claims were imported.
- Closing in-scene panels restores canvas focus so movement works immediately.
  Search/profile typing retains the input guard; map mode keeps its UI focus.

Coverage remains nine Level B reconstructed building interiors and five detailed
outdoor athletics venues. This release adds no campus geography or measured
architecture. It remains an independent, unofficial simulation. Third-party
fictional character identities belong to their respective owners; original
costume geometry does not imply endorsement. See the
[implementation report](UBC_HALLOWEEN_AFTER_DARK_2026-10-31.md),
[asset manifest](ASSET_MANIFEST.md) and
[local evidence gallery](validation/ubc-after-dark/README.md).

Concurrent CWRU and Stanford work was excluded from this candidate. Their owners
received the panel-focus requirement and root cause. This UBC receipt does not
claim their fixes were implemented, tested or deployed; those projects require
their own acceptance records.

## Validation completed

**Exact-source Linux CI:** all **304 tests passed**: UBC 134, Vancouver 74,
Surrey 69 and Richmond 27; zero failures, cancellations or skips. TypeScript and
lint passed, with the existing tutorial-reader navigation warning. Next.js
16.4.3 built 23 static pages. The production dependency audit found zero
vulnerabilities.

**Local:** isolated strict TypeScript, scoped UBC lint, 36 focused tests, Next
compilation and Vinext packaging passed. Compilation/type checking and scoped
lint passed again after the final focus correction. Browser checks at 1280 × 720,
768 × 1024 and 390 × 844 covered overflow, keyboard focus, audio unlock/mute/
resume and volume, edition switching, movement, map and pursuit escape. The final
focus checks confirmed the canvas active after Explore campus X, Escape from
search and Atmosphere backdrop dismissal; untargeted held keys moved immediately
in first- and third-person views. No browser warnings/errors were reported.
The gallery identifies local captures and the earlier cast screenshot's
pre-audio scope.

**Guarded candidate:** 17 routes, eight protected-host checks, 24 tutorial assets
and 124 legacy tutorial IDs passed. All 688 Richmond outputs and six UBC assets
matched; Vancouver/Surrey data and protected page content/links/canonicals were
preserved. The accepted UBC SSR change was the sole reviewed welcome-text
replacement; GIS content remained identical. Existing public profiles were read
without exposing private fields or publishing a test profile. Native image
optimization returned HTTP 200 with a 3,871-byte PNG. The temporary loopback
candidate stopped after smoke testing.

**Public before snapshots:** both hosts passed 17-route/24-tutorial-asset checks
before staging. These are baseline evidence, not post-activation acceptance.

**Public after activation:** both hosts passed 17-route/24-tutorial-asset
comparisons with protected content preserved and exact candidate UBC copy.
Seventy additional public route, redirect and geographic-asset checks passed.
Four read-only public-profile checks passed; no test profile was published.

**Live browser:** a fresh 1280 × 720 visit displayed the Halloween welcome and
loaded the scene, with cast members and the masked pursuer visible. Closing
Explore campus made the canvas the active element; an untargeted S key held for
1,500 ms visibly moved the visitor, with before/after evidence retained privately.
Atmosphere sound mute/resume and edition off/on controls worked, and the Map
control responded. At 390 × 844, content width remained exactly 390 pixels.
No warning/error logs were observed. This proves the tested flows, not a new tour
of every interior or visual inspection of every roster member.

The original live [welcome](validation/ubc-after-dark/live-welcome-desktop.jpg)
and [phone sound controls](validation/ubc-after-dark/live-sound-mobile.jpg) are
published separately from local captures. Physical audio was not listened to.
Observed live frame rate was approximately **19–23 FPS** on the shared machine
under load; this is not a sustained benchmark or evidence of the 60 FPS target.

## Capacity, retained recovery and activation

Fresh preflight at **21:44:44 UTC** confirmed baseline source
`8eba0e908c8e5c47c5ab46b82e868a6be754bdb5`, build `rtOqqaM__deGCW7i5raQm`,
five peer services, 56 configuration fingerprints, 13 unrelated virtual hosts,
Node and external profile storage. All 12 retention/staging guards passed with
services unchanged. Floors remained **192 MiB available RAM / 6 GiB free disk**.

| Phase | Available RAM / observed minimum (KiB) | Free disk / observed minimum (bytes) |
| --- | ---: | ---: |
| Preflight snapshot | 332,584 | 6,732,267,520 |
| Independent checkout | 518,312 | 7,731,408,896 |
| Artifact installation | 509,444 | 6,740,045,824 |
| Private smoke | 314,452 | 6,726,909,952 |
| Activation before snapshot | 442,952 | 6,726,860,800 |
| Activation after snapshot | 423,740 | 6,726,852,608 |
| Activation monitor | 396,340 | 6,726,852,608 |
| Final health | 415,880 | 6,726,606,848 |

Activation confirmed source `f106770b` / build `Al8RacnJ4uunt6U1i9VTC`, with
56 configuration fingerprints and peer services unchanged. The continuous monitor recorded four samples with zero errors. Final health
confirmed unchanged Node and profile hashes, five peer services, 56 configuration
fingerprints and 13 unrelated virtual hosts. There were zero post-activation
errors; the one old-runtime shutdown exit 143 was distinguished from new-runtime
errors. No DNS, TLS, proxy or shared-service policy was changed.

The older inactive `bbf194c3584637868bf92936da946485caca2929` /
`Ds3XoQLPUe8czRrb_7rcW` runtime was retained as an owner-held archive under the
documented lossless capacity procedure. Archive basename:
`asymmetri-rollback-before-ubc-v033-dialogue-20261031.tar.gz`; size
**406,906,880 bytes**; SHA-256
`45656963f6c6b128e9743973dfc7fa43cde8a1094f4840d5a86d3f475bae302e`.

The archive passed streaming/local SHA and size comparison, gzip and archive
identity checks, file/directory fsync, and full remote GNU tar content/metadata
comparison against the intact runtime. Only then was the expanded duplicate
retired. Post-retirement reread/gzip/fsync and a retirement-bound custody receipt
passed. No seventh server archive was uploaded. All six existing server archives
were rehashed before and after; none was removed or replaced. Retention completed
at **21:50:13 UTC**. Private custody receipts are retained on both sides; historical
recovery requires authenticated transfer, checksum verification and independent
extraction with ownership/ACLs/xattrs preserved.

The complete live 8eba runtime and prior immediate rollback
`f3e5a9fd530ca3acd28f9f8200d6668e79c03273` / `UvDOiPq9Ko5YmOkq4aC66` were
protected throughout staging. The successful whole-directory activation retained
the complete 8eba runtime as the new immediate rollback. Final health reverified
that complete tree, all six server archives and the owner-held bbf custody evidence. Recovery must restore a whole runtime and repeat health,
protected-content and profile checks. Never restore an older public-profile
store. Do not weaken capacity floors or substitute a different artifact.

## Remaining limits

Physical-device audio listening, sustained performance measurement and comprehensive screen-reader
acceptance remain outstanding. Browser audio state and scheduling tests do not
establish subjective headphone/speaker quality. A complete visual inspection of
every costume is not claimed. Existing reconstructed geometry and performance
limits remain; this release does not establish the 60 FPS target. Shared-project
focus fixes and the future Christmas edition are separate work.

Private credentials, signed artifact URLs, owner-storage paths and profile records
remain outside Git. Later documentation commits do not change the exact running
source/build recorded above.
