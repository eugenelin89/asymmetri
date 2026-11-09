# Website storage audit, November 9, 2026 UTC

## Measured available space

| Filesystem | Before, bytes (GiB) | After, bytes (GiB) | Net change, bytes (GiB) |
| --- | ---: | ---: | ---: |
| Mac APFS Data | 64,605,745,152 (60.169) | 67,171,655,680 (62.558) | +2,565,910,528 (2.390) |
| Production root | 7,337,226,240 (6.833) | 11,737,415,680 (10.931) | +4,400,189,440 (4.098) |

Opening readings were taken at approximately 05:14 UTC. Closing readings followed the production health checks and removal of local audit scratch at approximately 05:32 UTC. Available blocks came from `df -k` on the Mac and `df -B1` on Linux. The Mac volume also gained space before any website deletion. The two Mac cleanup windows gained 194,301,952 B (0.181 GiB) and 28,729,344 B (0.027 GiB), respectively, or 223,031,296 B (0.208 GiB) combined. Other activity contributed to the full-session Mac delta. Directory sizes below are allocations from `du` unless described as file lengths. Filesystem deltas also reflect concurrent writes, compression and block sharing.

## Mac inventory and cleanup

- The canonical checkout occupied 292,612 KiB initially and approximately 266,392 KiB after repacking. Git used 126,832 KiB, public assets 93,220 KiB and documentation 59,360 KiB. There was no local website `node_modules`, `.next`, `dist` or coverage tree. The tracked `build/` is packaging source. No duplicate website checkout appeared in the developer, projects, managed-worktree or system temporary roots inspected.
- Clean `main` fast-forward checked against live GitHub at `0057ba3`. Six local branches were inventoried. Five matched published same-name heads. The sixth, `fix/website-security-dependencies`, is an ancestor of GitHub main. All six were retained. The 13 GitHub branch heads were read without changing them. The absent October worktree pointed to the published `58933be` feature branch. Its index matched HEAD, its reflog commits were reachable on GitHub, and its directory and open handles were absent. Git pruned only its 60 KiB registration.
- Deleted `tsconfig.tsbuildinfo` (308 KiB) and `.wrangler/deploy/` (4 KiB), which contained only a generated pointer to an absent build. Removed 527 cached public npm tarballs with URL and integrity matching the committed lockfile, totaling 186,272,619 bytes of payload. The per-user cache began at 304,732 KiB. All 527 selected cache keys were verified absent and 145 other keys remained. A future install can download the selected packages again.
- Repacked the Git object database with unreachable objects explicitly retained. It fell from 126,156 to 100,296 KiB. The sorted set of all 6,515 object IDs and the digest of refs matched before and after. Full Git integrity verification passed. No branch or tracked asset was deleted.
- The largest surveyed Mac areas included Applications (26.18 GiB), system Library (25.35 GiB), the user's Library (11.95 GiB), Codex (11.08 GiB), Movies (2.83 GiB), and developer checkouts (1.96 GiB). Time Machine listed no local snapshots. These are scoped observations of readable areas, not a complete APFS accounting. Xcode and Codex were running. Personal data, other projects, release/validation media, toolchains and app state were protected. Private temp roots associated with Motion and other projects were excluded. No application was closed.
- Private deployment retention began at 492,628 KiB. The 502,239,154-byte pre-bell-carol archive passed gzip verification and matched recorded SHA-256 `c4596216ced90f1b9289f56b5b7b120e39198c7c80d95287af6a68a9545771da`. Both separately provisioned campus tracks in the checkout matched the asset manifest. Wrangler acceptance evidence and local SQLite state (112 KiB combined) remain protected.

## Production inventory and cleanup

Initial directory allocations included `/var` 10,467,248 KiB, `/var/www` 8,079,120 KiB, `/usr` 2,157,944 KiB, `/home` 1,886,008 KiB, `/var/lib` 1,632,228 KiB and `/opt` 558,092 KiB. Temporary space started at 125,696 KiB under `/var/tmp` and 97,728 KiB under `/tmp`. At close, `/var/www` occupied 1,773,204 KiB, `/var/tmp` 25,888 KiB and `/tmp` 15,084 KiB. The new protected archive directory occupied 2,174,696 KiB. The 2 GiB swap file, operating-system caches/logs, active and peer-site dependencies, separate Ask/ingress/receiver components, stores, configuration and backups were protected. Seven website release checkouts existed initially. The live and immediate predecessor each have one main branch and one physical worktree. Other repositories serving or backing unrelated sites were retained.

Five inactive older releases are now lossless, root-private archives in `/var/backups/asymmetri-website-audit-20261109/`. Each archive uses the original directory basename plus `.tar.gz`. Its sibling `.sha256` and `.json` record recovery identity and verification. Compression ran as application owner, one directory at a time, with the 6 GiB disk and 192 MiB available-memory floors monitored during archiving and comparison. Gzip validation, full GNU tar comparison with ACL/xattr options, SHA-256, sync, mount, process, configuration and source/build checks preceded each exact expanded-directory removal. All five sources are ancestors of the verified GitHub main. The five archives total 2,226,803,517 bytes. Their original directories allocated 6,457,257,984 bytes.

| Expanded directory retired under `/var/www` | Source | Next build ID | Directory bytes | Archive bytes | Archive SHA-256 |
| --- | --- | --- | ---: | ---: | --- |
| `asymmetri-rollback-before-ubc-audio-startup-20261031` | `33e4b65` | `25l0J7p1X18xCpT0DdKZ1` | 1,272,676,352 | 428,238,100 | `2dd2fdee40586f93d31ea55ea1c536892a4121a1602d1ea15126749e05fd2667` |
| `asymmetri-rollback-before-virtual-worlds-20261102` | `38d4326` | `4JfgZCh6OpnpuPeTAjb1A` | 1,274,503,168 | 428,841,763 | `48b5a0f504223339277ca0350981d1da16134ef375e31fc9c07b43668ceaad8c` |
| `asymmetri-rollback-before-campus-christmas-20261109` | `a73eec2` | `dmqK2Psv92J2yUeGDoMK2` | 1,305,575,424 | 457,564,332 | `011bb017179670a932490e6b8a7161bb67174ae87ecc2dcabad40082debce901` |
| `asymmetri-rollback-before-sleigh-bells-20261109` | `ba6528b` | `cgSIggsF1IJPAlAAHHgXb` | 1,302,097,920 | 455,955,411 | `c8afc65d69877dc3d91dfcceec7adeebe2c787c39f5eabdafa90a19b673259ed` |
| `asymmetri-rollback-before-winter-music-20261109` | `c64f99a` | `pqCDGF7c0ilyWrtCRVrdN` | 1,302,405,120 | 456,203,911 | `4a68d6f5c030770bc3cf456f50709506af13743ac589d9a0005573db570f2676` |

For an older recovery, verify the checksum from the private archive directory, extract through the application-owner procedure into an empty staging location, verify Git SHA, owner and build ID, and follow the documented complete-directory recovery procedure. The serving runtime and immediate predecessor remain expanded and independent.

| Additional staging directory removed | Allocated bytes |
| --- | ---: |
| `/var/tmp/asymmetri-services-fcc9522/receiver` | 33,525,760 |
| `/var/tmp/asymmetri-ask-candidate-4daa713/receiver` | 33,497,088 |
| `/var/tmp/asymmetri-ask-20261013/receiver/node_modules` | 31,662,080 |
| `/var/tmp/asymmetri-services-fcc9522/npm-cache/_cacache` | 462,848 |
| `/var/tmp/asymmetri-ask-candidate-4daa713/npm-cache/_cacache` | 462,848 |
| `/tmp/asymmetri-contract-npm-cache/_cacache` | 462,848 |
| `/var/tmp/asymmetri-access-transfer-20261021` | 4,096 |
| `/var/tmp/asymmetri-youtube-transfer-20261021` | 4,096 |
| `/var/tmp/asymmetri-motion-video-transfer-20261021` | 4,096 |

The two full receiver staging copies and the third dependency tree matched durable application trees by recursive content comparison. Each of the three cache paths was a task-specific npm content cache. The three October transfer directories were empty. In addition, 38 temporary helper, manifest and log files (409,600 allocated bytes) matched retained release evidence exactly. A complete Git transfer bundle (17,326,080 bytes) verified against history reachable from published main. A compressed Node executable (43,974,656 bytes) matched the installed executable after decompression. Every member of its dependency transfer (20,254,720 bytes) matched the installed tree. Eleven other source/helper transfers (4,780,032 bytes) passed member-by-member comparisons. Exact paths and sizes are in the private `staging-cleanup.json` and `transfer-cleanup.json` alongside the archives. Handles, process mappings and service references were rechecked per target. All 61 temporary targets were confirmed absent. They had allocated 186,830,848 bytes in aggregate.

## Verification and retained candidates

- Production stayed at `22074253894a071baff9f2cd26a2147bf83800ab`, build `NuLNmWjI8mCQC6syMWWyY` (692,040 KiB). The immediate rollback stayed at `84cf1ba52fd90750b7e293464f47cd0399066478`, build `FuLi6Rs2sXV_6kjbwUtgw` (690,428 KiB). Each had clean source, its own Git database and installed Next executable. The last release independently boot-tested this rollback at 04:56 UTC. This audit verified all 801 rollback public assets against that release baseline, separate inodes, and matching before/after full runtime fingerprints covering 13,706 dependency, build and public files (SHA-256 `ab563de0bff1136488d22f49963ca532b37e605a51ea40791307e863614f1822`). The five new archive hashes were rechecked.
- At baseline and close, all 22 page, redirect, robots and sitemap checks matched the approved smoke result on the application loopback, apex and www, including Motion, privacy, support and the tutorial's www canonical. A separate off-host HTTPS probe from the Mac returned 200 for the homepage and four protected routes on each public host. The three campus recordings matched on all three origins. The serving tree matched the 803 approved asset digests. All 62 release configuration hashes matched. Five private store directories retained their restrictive permissions and the prune timer remained active and enabled.
- All 15 configured hostnames matched the previous release's HTTP/HTTPS baseline, including 15 HTTP redirects, 12 HTTPS 200s, two retired-relay 410s and the pre-existing draft-site 502. The website, Nginx, peer application and active buildclub workers retained their process identities and start times. Nginx syntax validation passed. The two historical failed test-fixture unit records remained at their opening baseline. No deploy, restart or retention change was performed.
- The November 2 inventory's 12 older owner-held archives remain absent at their recorded paths. Mac indexed-name searches found no matches. Their custody remains unresolved. Do not count them toward recovery. The five newly archived older releases and the verified November 9 owner-held archive are separate from those 12.
- Remaining temporary October bundles, rehearsal directories, synthetic smoke stores, release logs and receipts without a proven equivalent were retained. Additional deletion would require an identified authoritative copy or a specific disposal decision. Retiring the older verified recovery archives would require an explicit change in retention.
