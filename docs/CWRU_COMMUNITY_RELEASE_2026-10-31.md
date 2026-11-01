# CWRU community and clearer running controls — production release

## Verified runtime

Activated **November 1, 2026 at 00:28:14 UTC** (October 31 in Vancouver). CWRU is live on [apex](https://asymmetri.co/labs/cwru) and [www](https://www.asymmetri.co/labs/cwru), source `b3601b31fa5bfe296496046a1f6f911e5f16e4df`, build `xMZDEUQlNPy6b48OwpOC3`. Final server acceptance passed at **00:32:19 UTC**. Subsequent source/documentation commits do not change this frozen runtime.

This completes the larger running instructions (journal 179), CWRU reviews and private play reporting (180), and requested privacy-panel removal (182). The same immutable artifact includes each owner's reviewed Stanford integration/removal and UBC/shared privacy-page removal. Each campus owner performs its own live UI acceptance. This release does not include the separately requested iPhone Silent Mode audio change.

## Source and artifact validation

[Linux workflow 41255821757](https://github.com/eugenelin89/asymmetri/actions/runs/41255821757), job 124698643526, passed exact-source TypeScript/ESLint, all 585 tests, production audit with zero vulnerabilities and the Next webpack production build on approved Node 22.23.1. The only lint warning was the existing tutorial navigation warning. The suites cover 74 Vancouver, 69 Surrey, 27 Richmond, 144 UBC, 89 CWRU, 13 reviews, 29 analytics and 140 Stanford tests. Earlier CWRU Node 24.10.0 local checks, Vinext builds, review lifecycle and reporting privacy tests remain documented in the integration report.

Artifact 13063731088: ZIP SHA256 `cd3cee0bbe945d1a82e58a4ce9a561468f151fdedf86fb1a90a4c6edd04aa820`; runtime tar SHA256 `dcdef925358e577ea8360ca85190bbcecd67057079ced65bbf49bbf458d6b50e`. The tar contains 256,899,807 compressed bytes and 913,237,510 expanded file bytes. Source, Node version, safe archive entries, build identity and checksums were verified locally and after authenticated transfer. No production build or dependency install ran on the live host.

The new checkout was independently cloned without hardlinks and frozen to exact b360 before later source pushes. Eight net runtime paths differed from accepted predecessor 704; all matched the respective owners' validation hashes. Shared APIs, persistence implementations, all profile handlers, dependencies and existing public assets were unchanged. Superseded 039 was retained as evidence and never deployed.

## Live acceptance

Loopback, apex and www each passed 18 page checks, 800 public asset digests and 40 static build assets, plus protected Motion content, tutorial IDs/canonical, compatibility redirects and sitemap. The private staged build also passed all three campus profile/review projections, analytics readiness, standalone pruning and Linux image optimization using isolated private fixtures.

CWRU desktop 1280×720 and phone 390×844 checks verified automatic Halloween entry, a 17px “Hold Shift to run” hint, and an 88px phone Run target with 18px RUN text. Shift+W was exercised with CANVAS focused; this does not claim measured travel speed. Project information has no Play privacy panel or recording checkbox, retains the separate noopener policy link, and returns focus to CANVAS when closed. Reviews loaded, the empty phone review form had no horizontal overflow, and closing it returned focus to Write a review. Console errors were empty. Original scene settings were preserved; the temporary tab was closed and viewport reset. Browser emulation is not physical-device certification.

Public API checks used reads, deliberately rejected requests and cookie-only bootstrap without echoing a capability. No synthetic production review or play session was created. For browser gameplay acceptance, the shared release owner temporarily opted the test browser out using its existing loaded UI. The owner confirmed all gameplay checks finished, but the old temporary control tab was no longer available before restoration. The test IAB browser may therefore retain its opt-out; no restoration is claimed. This affects that test browser, not fresh visitors’ defaults. No hidden browser-state workaround was used. Review create/edit/remove and recording/opt-out/deletion behavior were tested earlier against disposable local stores; this release does not repeat valid synthetic writes in production.

The first final-health attempt stopped on a dropped HTTPS connection during an asset GET. The application remained healthy with the same process and zero restarts. The private checker was corrected to retry this transport class, bounded to three GET attempts; five fault-test groups cover transient disconnect/read/reset/timeout recovery, exhaustion, certificate rejection and strict HTTP status handling. Original helper and failure evidence were preserved. The full retry passed without changing deployed source, configuration or services.

## Data, resources and recovery

All three private profile directories/dropins, shared review/analytics directories and four existing backend configuration hashes were preserved. No backend configuration was installed or removed. Both website and pruning writers were drained for the whole-runtime swap, and shared store bytes were compared before restarting. The new runtime passed health checks before successful pruning and restoration of the enabled, active daily timer; its next run was 03:30 UTC. The oneshot prune service is not claimed to be enabled.

Final acceptance confirmed 15 peer virtual hosts, unchanged peer services/configurations and Node binary, all private ownership/modes, and the same website process. The current-process journal contained six entries, zero errors and zero warnings; five predecessor-shutdown entries were correctly excluded using boot identity and monotonic start time. Final-health minimums were 300,324 KiB available RAM and 10,327,392,256 free bytes. Every guarded phase remained above 192 MiB / 6 GiB; the lowest smoke sample was 290,972 KiB.

The complete immediate predecessor 704 / build `sEPpfQJeW_TCHMYdvJXV0` is retained at `/var/www/asymmetri-rollback-before-cwru-community-20261031`. Earlier complete Stanford and UBC rollback trees remain. All 12 owner-held archives (4,389,163,356 bytes) were reread, SHA256/gzip verified and fsynced, with original custody and authorized server-cleanup transfer receipts carried forward. This rollout retired no runtime or archive. Historical core-release paths removed by the separately authorized disk cleanup must not be assumed to exist; use the current inventory.

For rollback, first verify the complete704 tree and current data; drain the timer/pruner and website, preserve the current runtime separately, swap the verified predecessor into place, then restart and check both hosts before resuming compatible maintenance. Keep all existing shared/profile configuration and private stores. Never copy an older or empty store over legitimate submissions.

Private evidence resides under owner `deployment-retention/2026-10-31/cwru-community/coordinated-rollout` and server `/var/lib/asymmetri-cwru-community-release-20261031`. The accepted final-health receipt SHA256 is `aee258897483632ea35d168346184d524c5a5fb070e120341bb1f55b0d53385b`. It pins activation, guards, independent checkout, shared-data preservation, public checks, maintenance, resource floors and archive custody. CWRU live screenshot evidence is retained privately; no visitor data was published in documentation.

## Remaining work

CWRU iPhone Silent Mode audio support is a separately requested, separately validated follow-up (reserved journal 187). It is absent from this artifact. Campus geometry, inferred interiors, generic character appearance and public-source enrollment limits remain as described in the [core release](CWRU_RELEASE_2026-10-31.md).
