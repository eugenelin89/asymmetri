# My Music playback modes — November 15, 2026 UTC

The owner requested shuffle, Repeat 1, Repeat All and immediate deployment. The
prior preference for a minimal personal-use utility and focused validation remained
in effect. Implementation and the preparation journal were pushed directly to main;
no branch, worktree or PR was created.

## Delivered behavior

Shuffle toggles the visible queue between a random order and folder/name order,
keeping the current track and playback position. Repeat cycles **Off → 1 → All →
Off**. Repeat 1 uses native audio looping; Repeat All wraps the current queue,
including shuffle order. Previous/Next follow that order and bypass Repeat 1.
Automatic playback skips failed tracks until a manual retry or folder reload; an
all-failed queue terminates even in Repeat All. Controls expose labels and pressed
states and wrap at narrow widths. Settings last for the tab, with no saved account
preferences. No server endpoint, dependency, public asset or navigation change.

## Source and verification

Implementation `a122f41`; preparation journal/deployed source
`e476ee04ecef52d31bde1e3d3c5be819929f74db`.
[Exact-source Linux CI](https://github.com/eugenelin89/asymmetri/actions/runs/43663693621).

Node 24.10.0 matches `.nvmrc`; nvm is unavailable. TypeScript/ESLint, Next webpack,
Vinext, eight focused regressions, production audit and whitespace checks passed.
One existing tutorial lint warning remains; zero production vulnerabilities.
The broad prebuild suite was not repeated locally; the existing Linux CI pipeline
runs its normal build gates. Browser acceptance confirmed Repeat 1 restarting the
same track after an end seek, Repeat All wrapping the shuffled queue's last track
to its first, and shuffle toggling without interrupting the stream. Repeat Off
cleared native loop. The controls fit the measured 416px CSS viewport without
overflow. Owner-provided URLs, filenames and recordings are excluded from source
and public receipts.

## Activation and rollback

Activated **2026-11-15T01:44:48.758993Z** (17:44 November 14 Vancouver), build
**`Z1m4fuMWS4SYDNJKPZb6U`**, Node **22.23.1**, exact source `e476ee0`.
Artifact **256,951,283 bytes**, SHA-256
`dac379bda969dea2699b8d16c30ad121835316e0cfd42d68a678c12c66989441`. Source, Node and build identity/checksum matched locally and on
the server before the independent candidate was activated.

The candidate and activated release passed existing route and My Music control
checks on loopback, apex and www. A fresh public browser visit loaded the 27-track
acceptance queue and confirmed working Shuffle and Repeat state cycling. All 803
public assets, 62 configuration fingerprints, 15 peer-domain baselines and five
persistent stores were preserved. The prune timer resumed active/enabled. Current
website process logs reported zero errors and warnings after cleanup.

The complete immediate rollback is
`/var/www/asymmetri-rollback-before-mymusic-modes-20261115`, source
`b0b40d63b0941bf4be91fe90c325d91d8aee562a`, build `K5uU0ihPv4IdxvodDcxwn`.
It independently started and passed 29 route / 45 bundle checks after activation.
Use the documented whole-directory rollback procedure, draining the website/prune
timer, retaining the failed/current directory, restoring this complete predecessor,
checking both hosts and resuming pruning. Minimum guarded memory was **230,156 KiB**;
minimum disk free was **6,792,073,216 bytes**, above the unchanged 192 MiB / 6 GiB
floors. No resource-guard bypass or memory intervention was needed.

## Capacity preparation and retention

The opening production filesystem snapshot reported 7,518,990,336 free bytes.
The documented older-runtime retention procedure preserved the inactive
`/var/www/asymmetri-rollback-before-labs-navigation-20261114` as a lossless archive
at `/var/backups/asymmetri-mymusic-modes-20261115/asymmetri-rollback-before-labs-navigation-20261114.tar.gz`.
Original source `17dc03f957723ac95de6d42405dab1f9a24b2de2`, build
`GJigN8VBK-fezdQvZSZsm`; archive **461,574,948 bytes**, SHA-256
`34f11cd86780a097c1a1bb3648e84b523db961477337302d57e3607079ee0d30`.

Clean source/build identity, process inactivity, gzip integrity, full tar comparison
and checksum were established before retiring the expanded contents. Application
ownership prevented removal of the empty parent from root-owned `/var/www`; root
then verified it was empty, rechecked archive integrity/checksum and removed only
that parent. The current serving runtime and immediate rollback remained complete
and independently owned throughout. No recovery data or retention period was removed.
To restore the older version, verify this checksum, extract the complete archived
directory as the application owner into empty staging and follow the existing
whole-directory recovery procedure.

The former runtime's du estimate was **1,311,039,488 bytes**. Free space after
retention was **8,368,316,416 bytes**, a measured **849,326,080-byte** net increase
from the opening snapshot; that interval includes concurrent filesystem activity.
The final empty-parent removal measured **4,096 bytes** (8,368,312,320 →
8,368,316,416). These df measurements are distinct from du size estimates.

## Post-release cleanup

Opening Mac free space: **63,884,795,904 bytes**. One canonical checkout
was present; dependency/build directories were recreated solely for active checks.
After stopping the owned preview and checking tracked files and open handles,
removed exact local `node_modules`, `.next`, `dist`, `tsconfig.tsbuildinfo` and
`.wrangler/deploy`. Their respective du estimates were `node_modules` 808,726,528 bytes; `.next` 536,977,408 bytes; `dist` 133,005,312 bytes; `tsconfig.tsbuildinfo` 286,720 bytes; `deploy` 4,096 bytes.
The lockfile/source and verified builds establish reproducibility.

| Cleanup window | Free before, bytes | Free after, bytes | Measured recovered bytes |
| --- | ---: | ---: | ---: |
| Local inactive validation outputs | 62,282,289,152 | 63,778,844,672 | 1,496,555,520 |
| Local verified CI transfer | 63,538,589,696 | 63,795,527,680 | 256,937,984 |
| Production transfer and empty fixtures | 6,792,073,216 | 7,049,060,352 | 256,987,136 |

The local transfer du estimate was **256,958,464 bytes**. Local cleanup gains
across both windows total **1,753,493,504 bytes**.
Production cleanup followed activation, public health and independent rollback;
it removed the exact checked transfer and empty staging fixtures/parent. Its helper
was retained with private release evidence. Final post-cleanup production free
space was **7,049,035,776 bytes**, with healthy peers and unchanged recovery
identities. These filesystem measurements differ from du estimates and include
concurrent activity; retained archives and the new independent runtime still use disk.

The serving runtime (1,318,666,240 bytes by du), complete immediate rollback
(1,318,379,520 bytes by du), three earlier complete runtimes, all retained archives,
private configuration, persistent stores and release evidence remain. No new cleanup
blocker or owner retention decision arose. Existing historical custody/scratch
questions remain under [Issue #5](https://github.com/eugenelin89/asymmetri/issues/5).
Canonical source, original public media and unrelated local caches were preserved.
