# Motion App Store website release — November 11, 2026

Asymmetri Motion is publicly available on the [Apple App Store](https://apps.apple.com/us/app/asymmetri-motion/id6825059131). The owner requested the website update and immediate deployment on November 11 in Vancouver. Apple’s listing corroborated iPhone support and iOS 17 or later.

## Website behavior

Motion and Sports show **Available now** and three **Download on the App Store** actions linking directly to Apple. Product metadata, family copy, tutorial disclosure and the introduction-video description no longer say the pitching app is awaiting release. Hitting remains **In development**, and Team remains **Planned**.

`/motion/try` retains HTTP 307 compatibility and now opens the same Store listing. `/privacy#testflight-access` retains previous-request handling and deletion contact. No form responses, app binary, public asset, measurement claim, price, dependency or infrastructure configuration changed.

## Source and verification

Implementation `768702f`; archive `17dc03f`; deployed source `17dc03f957723ac95de6d42405dab1f9a24b2de2`. The [exact Linux build](https://github.com/eugenelin89/asymmetri/actions/runs/43135658725) runs the existing checks, regression suites, production audit and webpack Next build under Node 22.23.1. Local Node 24.10.0 matched `.nvmrc`; nvm was absent.

Local validation passed 572 regression tests, TypeScript/ESLint, Next and Vinext builds, a zero-vulnerability production audit and whitespace review. One existing tutorial-reader navigation lint warning remains. The final copy correction was rebuilt after the initial suite. Browser checks covered Motion/Sports at 390, 768 and 1440 pixels, no horizontal overflow, useful image alt text, visible keyboard focus and a successful navigation to Apple. No Motion console warnings/errors appeared. Existing reduced-motion styles were inspected; physical-device and OS-level reduced-motion testing were not performed for this copy/link update.

## Release identity and health

Activated at **2026-11-12T01:48:02.512750+00:00** (November 11, 17:48 Vancouver). Next build **`GJigN8VBK-fezdQvZSZsm`**, Node **22.23.1**. GitHub artifact `13906959884` contained the matching source SHA and runtime version. Its tar SHA-256 was verified locally and again on production: `f737901495215bf3274ffadc4254d56d0095459ffa8d957b85f584563819aee3` (256,907,908 bytes). Linux validation passed **646 tests** and a zero-vulnerability production audit.

The private candidate and activated release passed 22 route/redirect/robots/sitemap checks, campus read APIs, weather's available/unavailable states, retained audio and image optimization. All **803 public assets** and **38 referenced build files** matched on loopback, apex and www. Four protected Motion routes, tutorial IDs/original-image links, exact www canonical, privacy/support links and the exact App Store 307 destination passed. Fourteen separate off-host checks and fresh live browser visits confirmed the public result.

The immediately preceding runtime independently started on port 3139 and served seven protected/campus pages, weather and a static bundle. All **15 peer-host baselines**, **62 configuration files**, five persistent stores/settings and the prune timer were preserved. Current-process service logs contained **zero errors and zero warnings** after cleanup. Acceptance completed at 2026-11-12T01:50:17.646285+00:00.

## Rollback and retention

The complete previous source, dependencies, public assets and build remain at `/var/www/asymmetri-rollback-before-motion-appstore-20261112`: source `22074253894a071baff9f2cd26a2147bf83800ab`, build `NuLNmWjI8mCQC6syMWWyY`. Restore with the existing whole-directory procedure: drain the website and prune service/timer, retain the current tree, rename the predecessor into `/var/www/asymmetri`, restart, verify loopback and both public origins, and resume pruning.

Preserve the earlier pre-campus-carols runtime and all retained archives. The [November 9 storage audit](WEBSITE_STORAGE_AUDIT_2026-11-09.md) and [Issue #5 recovery follow-up](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6732342172) retain the unresolved older archive-custody inventory. Unproven historical scratch remains untouched. No retention change, OS upgrade, peer-site change or publisher/Ask activation formed part of this release.

## Capacity and cleanup

Opening available space was 65,659,752,448 bytes on the Mac and 11,558,912,000 bytes on production. `du` estimates identified generated outputs separately from `df` filesystem gains. The Mac had one canonical checkout and initially no build or dependency trees.

| Cleanup window | Free before, bytes | Free after, bytes | Measured gain, bytes |
| --- | ---: | ---: | ---: |
| Mac: inactive local builds/dependencies | 63,709,810,688 | 65,196,097,536 | 1,486,286,848 |
| Mac: verified CI download and task scratch/logs | 64,946,851,840 | 65,204,457,472 | 257,605,632 |
| Server: verified transfer and empty fixtures | 9,994,788,864 | 10,251,730,944 | 256,942,080 |

Removed exact local generated paths `.next/`, `dist/`, `node_modules/`, `tsconfig.tsbuildinfo` and `.wrangler/deploy/` after checking they were untracked, reproducible and had no open file handles. The development environment had not existed before this task and no preview process remained. Temporary artifact/helper/log files under the task's private scratch directory were removed after their results were summarized here. Existing Wrangler state, canonical Git checkout, approved local audio masters and user package caches were retained.

On production, retired only `/var/tmp/asymmetri-motion-appstore-20261112/runtime.tgz` and the empty isolated `fixtures/` directory after activation, public checks and independent rollback acceptance. The script checked exact identity, digest and open handles, then removed the empty staging parent. Private release receipts and verification helpers remain as recovery evidence.

Final available space: **Mac 65,204,457,472 bytes** and **server 10,251,710,464 bytes**. The server's minimum sampled available memory was **213,456 KiB** and minimum free disk was **9,994,788,864 bytes**, above the unchanged 192 MiB/6 GiB floors; no guard failed. The serving tree allocates 1,306,320,896 bytes; the complete immediate rollback 716,849,152 bytes; the pre-campus-carols rollback 706,998,272 bytes. These and older recovery archives remain protected. No new cleanup blocker or owner decision is required. Existing archive-custody limitations remain in the linked audit/Issue.

Measured free-space changes can include concurrent filesystem activity and differ from `du` allocations. Production's overall free space decreased because the release retains a new independent serving runtime and the complete predecessor. Local cleanup-window gains likewise are not the full-session net change.

