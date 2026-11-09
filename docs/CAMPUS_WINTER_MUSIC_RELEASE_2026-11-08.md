# Quiet instrumental “Winter Wonderland” on the Christmas campus walks

The approved 16.64-second instrumental started serving at 04:30 UTC on November 9, 2026. The same stereo master loops in the UBC, Stanford and CWRU Christmas walks. Enter with Campus sound enabled. Its quieter, even sleigh-bell pulse sits behind a softly struck bell melody. Rain stays silent.

## Release and licensed asset

- Implementation `ea8c111`; deployed source `84cf1ba52fd90750b7e293464f47cd0399066478`; build `FuLi6Rs2sXV_6kjbwUtgw`, Node 22.23.1.
- [Linux CI](https://github.com/eugenelin89/asymmetri/actions/runs/42561348804) artifact `13650260418`; ZIP SHA-256 `707d940c1806a311013912cdd7f5b6212dfef92b726d202236f3c82f38de4386`; original tar SHA-256 `d572d9d3a3c2d8166d9bcd76213bbe96e0d99affdc25f57430e1f9537a442d3b`.
- The independent Linux runtime was packaged from the verified artifact. It retains the Next build and target-platform production package bytes, including TypeScript for reading configuration. Development-only packages and optional musl variants were omitted on this x86_64 glibc host. Its 110,989,031-byte tar was SHA-256 `6dd49bb6e09dba089083a38878d25b7ccca13b2c08bb9c6a0eef1ab604217704` on both hosts. The independent private startup tested Next, protected routes, optimized images and campus APIs before activation.
- The owner confirmed that the license covers use of the song in the public campus walks. The [asset manifest](ASSET_MANIFEST.md) records the arrangement and recording source. A separately provisioned 392,968-byte file matched the approved local audition and the candidate, loopback and public responses. Fingerprint `fb595967e5b31ed6044b74bd49f050b708dee2ffcc2005dc231c0240236c40dc`. Private owner-held copies are retained on the Mac and server for future releases.
- Activation receipt SHA-256 `8d723d8c58c3093dc7ccbde0f8b37e8e8aa1d5d172855b584fc33ba685a38655`. Five private store digests matched across the swap.

## Verification and recovery

Local type and lint checks, all 33 shared campus tests, production dependency audit and Vinext build passed. The existing tutorial navigation lint warning remains. The Linux build passed its release suite. The earlier complete source `c64f99a` and build `pqCDGF7c0ilyWrtCRVrdN` are retained at `/var/www/asymmetri-rollback-before-winter-music-20261109`. To recover, drain the site and prune jobs, preserve the current release, restore this entire independently verified runtime at the service path, then restart the service, check public and protected campus and Motion routes, and resume pruning. Leave private configuration and persistent stores in place.

All six fresh public browser visits, covering each campus at desktop width on apex and at phone width on www, started the 16.64-second stereo loop on entry and stopped it when switching to Regular. Each measured a nonzero audio signal. These were browser checks, not a physical iPhone listening test. No synthetic public submissions were made.

All 801 public assets and 38 referenced Next bundles matched by digest on loopback and both public origins. The preceding runtime booted separately and served seven protected and campus pages, weather and a static bundle. The checks preserved five stores, 62 configuration files, the running prune timer and the 15 peer baselines.

## Space and cleanup

| Location | Preflight free bytes | Before cleanup | After cleanup | Measured free-space gain |
| --- | ---: | ---: | ---: | ---: |
| Production | 7,454,547,968 | 6,635,098,112 | 6,746,124,288 | 111,026,176 |
| Development Mac | 64,771,518,464 | 62,754,123,776 | 64,469,721,088 | 1,715,597,312 |

The host removed its private transfer archive, receive helper and empty test fixtures (111,026,176 allocated bytes). The Mac removed this release’s temporary dependencies, two build outputs and staging scratch (1,696,817,152 allocated bytes). Filesystem changes include concurrent activity. The approved master, current runtime, complete rollback and compact release evidence were retained.

The serving tree uses 706,998,272 allocated bytes. Its immediate rollback uses 1,302,405,120 bytes. Five earlier rollback trees remain. Twelve older archive files were absent at their recorded owner-held paths. Review their custody and budget the next independent release against the 6 GiB floor. No retained recovery copy was removed.

Final free bytes: 6,746,103,808. The 192 MiB memory and 6 GiB disk guards held. See the [existing archive-custody follow-up](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6730534397).

The final health receipt SHA-256 is `98f04b26bee84ecad7402b8d8123d551eb8133c01064dca9023643b5c45f644a`. No warnings or errors were found in the new server process journal.
