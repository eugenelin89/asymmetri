# Labs navigation release — November 14, 2026

The owner requested removal of BotSquad from site menus and the Labs page, preservation of every existing page, and immediate deployment with repository publication.

## Delivered behavior

The global Labs menu contains Asymmetri Labs and Virtual Worlds. The company footer no longer lists BotSquad. `/labs` features Virtual Worlds without a BotSquad card or metadata reference. Its social preview is text-only because the existing shared artwork contains BotSquad lettering; that artwork remains byte-identical at its original URLs for other pages.

All BotSquad pages and internal navigation remain accessible directly. The complete App Router path inventory, sitemap, same-suffix Investment-to-Trade redirects, public assets, dependencies, protected Motion pages, tutorial anchors/original images and exact www tutorial canonical are preserved. No receiver, publisher, Ask, campus backend, persistent store, OS, DNS, TLS or proxy configuration changed.

## Source and validation

Implementation `87b273d`; preparation journal and deployed source `4ee0a2651e9b6dafc34d9fe5cd460ebef9d71927`. Work was committed and pushed directly to main, without creating a branch, worktree or PR.

Node 24.10.0 matches `.nvmrc`; nvm is unavailable. Locked installation, 572 prebuild regression tests, TypeScript/ESLint, standard Next webpack and Vinext builds, production audit and whitespace checks passed. The final metadata adjustment received a fresh check and Next build. Production audit reports zero vulnerabilities. One existing tutorial-reader navigation lint warning remains; development-only audit findings were not remediated in this unchanged-dependency release.

Local browser checks covered actual CSS widths 320, 390, 768, 1024, 1440 and 1920 without horizontal overflow. The browser viewport control required correction for the session's scaling; reported DOM widths, rather than requested viewport values, establish the tested sizes. Keyboard Tab, visible focus, Enter, Escape/focus restoration and outside-pointer dismissal passed. No site-origin browser errors were observed; unrelated extension warnings were excluded. Existing reduced-motion CSS was inspected; OS-level preference and physical-device checks were not performed.

[Exact-source Linux CI](https://github.com/eugenelin89/asymmetri/actions/runs/43651921057) passed checks, Vancouver and prebuild regressions, the zero-vulnerability production audit, and the Node 22.23.1 Next webpack build. The artifact source SHA, runtime version and SHA-256 were checked locally and again on the host before application-owner extraction. Archive size: 256,819,851 bytes. SHA-256: `90a4f0415059bc39d7f491a99c197a6f42c537d757c9ba5abb98e689c3424c0d`.

## Activation and acceptance

Activated at **2026-11-14T23:22:20.671509Z** (15:22 Vancouver). Build **`E2OJu4pokkUqFe7kdJQ7W`**, source **`4ee0a2651e9b6dafc34d9fe5cd460ebef9d71927`**, production Node **22.23.1**.

The independent application-owned candidate passed 29 page/redirect/robots/sitemap checks, unchanged main content and identifiers outside Labs, expected global-link removal, BotSquad-free Labs HTML/social metadata, campus read APIs and weather, three original soundtrack hashes, referenced bundles and image optimization. The first acceptance attempt incorrectly treated internal article headers as global navigation; the parser was corrected to exclude headers inside main. The original baseline was retained and all other baseline fields were verified unchanged before retry. No application change was needed for that checker correction.

The activated release matched on loopback, apex and www. All 803 public-asset digests, 62 configuration fingerprints, 15 hosted-domain baselines and five persistent stores were preserved. The daily prune timer resumed active and enabled. A separate Mac check passed 24 public page/menu/protected-link/same-suffix query-redirect checks. Fresh public browser visits confirmed the Labs menu, page and social metadata on both hosts. Current website-process logs contained zero errors and zero warnings after cleanup.

## Capacity safeguard and rollback

The first staging guard stopped before baseline or activation because available memory was below the unchanged 192 MiB floor. A single bounded 96 MiB request to the website's own cgroup `memory.reclaim` restored headroom: measured MemAvailable rose from 186,184 to 294,096 KiB. Its PID and memory-event counters were unchanged; no service restart, memory-limit change or other service intervention was used. This uses the kernel's [targeted reclaim interface](https://docs.kernel.org/admin-guide/cgroup-v2.html), rather than a global cache flush. All subsequent guarded phases stayed above the unchanged 192 MiB/6 GiB floors; minimum sampled available memory was 230,064 KiB and minimum free disk 8,558,866,432 bytes.

The complete immediate predecessor remains independently runnable at `/var/www/asymmetri-rollback-before-labs-navigation-20261114`: source `17dc03f957723ac95de6d42405dab1f9a24b2de2`, build `GJigN8VBK-fezdQvZSZsm`. It independently started on a separate loopback port and passed all 29 route checks, 45 referenced-bundle checks, campus reads and soundtrack checks after activation. Follow the whole-directory rollback procedure: drain the website and prune service/timer, retain the current tree, rename the predecessor into the serving path, restart, verify both public hosts and resume pruning. No older rollback or archive was retired.

## Cleanup audit

Opening free space: Mac **64,965,840,896 bytes**; production **10,124,075,008 bytes**. One canonical local checkout was present. Initial local dependency/build trees were absent; this task created them for validation.

| Cleanup window | Free before, bytes | Free after, bytes | Measured recovered bytes |
| --- | ---: | ---: | ---: |
| Mac generated outputs and verified artifact | 62,620,905,472 | 64,351,129,600 | 1,730,224,128 |
| Production transfer and empty test fixtures | 8,558,866,432 | 8,815,722,496 | 256,856,064 |

After stopping the owned preview and checking tracked-file status and open handles, removed the exact local `node_modules`, `.next`, `dist`, `tsconfig.tsbuildinfo`, `.wrangler/deploy` and task-specific downloaded artifact directory. Their `du` estimates were respectively 813,428,736; 501,309,440; 132,960,256; 327,680; 4,096; and 256,827,392 bytes. The public lockfile/source and verified Linux CI artifact establish reproducibility. The canonical checkout, existing Wrangler state, approved media and unrelated user caches remain.

On production, checksum and inactivity checks preceded removal of the 256,819,851-byte transfer and empty isolated fixture directories. The staging parent was removed. The serving runtime, complete immediate rollback, both older complete rollbacks, retained archives, configuration, persistent stores and private release evidence remain. Final post-cleanup health and peer checks passed; production free space at that check was **8,815,710,208 bytes**.

Free-space gains are measured filesystem changes, not sums of `du` estimates. The overall session includes a newly retained production runtime, package downloads and concurrent filesystem activity. Retained allocations are 1,307,533,312 bytes for the serving runtime, 1,311,039,488 bytes for the immediate rollback, and 716,849,152 / 706,998,272 bytes for the two earlier complete rollbacks. No new cleanup blocker or retention decision arose; the previously documented missing historical archive-custody issue remains in [the November 9 audit](WEBSITE_STORAGE_AUDIT_2026-11-09.md) and [Issue #5](https://github.com/eugenelin89/asymmetri/issues/5). Unproven historical scratch remains retained under that existing inventory.
