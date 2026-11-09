# Three campus Christmas soundtracks

The three school-specific instrumentals went live at 04:55 UTC on November 9, 2026. With **Campus sound** enabled, entering each Christmas walk starts its own recording:

| Walk | Instrumental | Verified duration |
| --- | --- | ---: |
| [Stanford](https://asymmetri.co/labs/stanford) | Jingle Bells | 15.48 s |
| [CWRU](https://asymmetri.co/labs/cwru) | Rudolph the Red-Nosed Reindeer | 16.55 s |
| [UBC](https://asymmetri.co/labs/ubc) | Winter Wonderland | 16.64 s |

## Release and acceptance

Implementation `0fdcb66`, deployed source `22074253894a071baff9f2cd26a2147bf83800ab`, Next build `NuLNmWjI8mCQC6syMWWyY`, Node 22.23.1. The [Linux build and checks](https://github.com/eugenelin89/asymmetri/actions/runs/42563492904) passed. Artifact `13650687085` matched its ZIP fingerprint `sha256:5e21ab2cb14ff842c1152ae1586e82f2158411454242a3312f1bed5b10b1763c`. The verified original tar SHA-256 was `09b7604f10a52a962dd84d3def55f31cf2f5a12cb8ac6937bcc9434d80d23eb8`. The independently installed Linux production subset was 110,986,879 bytes, SHA-256 `7165a5dd034319415879f0ab0f1aaedfdc4a3d818e8755542bbcb92ff782c533`. The verified source provided Stanford’s master; both licensed masters were provisioned separately per the [asset manifest](ASSET_MANIFEST.md). The owner confirmed public-walk rights for UBC and CWRU.

Six fresh browser visits covered each school at desktop width on the apex and phone width on www. Each welcome fetched only its own recording on entry. Its bytes matched the approved fingerprint, it started a stereo loop with a nonzero signal, and changing to Regular stopped it. These were browser checks; no physical speaker measurement was made. Synthetic analytics were blocked.

The private candidate, loopback and both HTTPS hosts passed route, redirect, static and campus API checks. All 803 public assets and 38 referenced Next bundles matched on all three origins. The protected Motion pages, 15 peer host baselines, 62 configuration files, five persistent stores and the prune timer were preserved.

## Rollback and retention

The complete immediate predecessor remains at `/var/www/asymmetri-rollback-before-campus-carols-20261109`: source `84cf1ba52fd90750b7e293464f47cd0399066478`, build `FuLi6Rs2sXV_6kjbwUtgw`. It booted separately and served the four protected Motion pages, three campuses, weather and a static bundle. To restore, drain the website and prune jobs, preserve the serving tree, move the entire predecessor back to the service path, restart and test both hosts, then resume pruning. Keep private stores and configuration in place.

Before staging, the older inactive pre-bell-carol runtime (`8cb6504fcd10c3e8b8d9382507a1c7be3ffc526e`, build `vl3iIFSCGyHNX0l6fZ5xk`) moved to private owner-held storage as a complete lossless archive: 502,239,154 bytes, SHA-256 `c4596216ced90f1b9289f56b5b7b120e39198c7c80d95287af6a68a9545771da`. Both ends matched; the archive passed gzip validation and a full GNU tar comparison against the original. Clean identity, inactivity and absence of service references were rechecked before retiring only the verified duplicate. See [retention and restoration](DEPLOYMENT.md#compressing-an-older-retained-rollback-when-capacity-is-limited). Its checksummed archive and receipts are retained; the prior [archive-custody follow-up](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6732342172) remains unresolved.

## Disk and cleanup

| Operation | Before (free bytes) | After (free bytes) | Measured change |
| --- | ---: | ---: | ---: |
| Server: verified older directory retired | 6,745,026,560 | 8,046,706,688 | +1,301,680,128 |
| Server: disposable transfer, helper and empty fixtures retired | 7,226,392,576 | 7,337,414,656 | +111,022,080 |
| Mac: temporary CI packages, browser tooling and staging scratch retired | 63,972,950,016 | 64,631,324,672 | +658,374,656 |

Preflight free: production 6,745,993,216 bytes; Mac 64,090,583,040 bytes. Final production free: 7,337,385,984 bytes. The sampled minimums were 6,745,026,560 free bytes and 249,096 KiB available RAM, above the 6 GiB and 192 MiB floors. Directory allocation and actual free-space changes can differ owing to concurrent activity. The serving runtime (708,587,520 allocated bytes), complete immediate rollback (706,998,272 bytes), five earlier rollback directories, private recovery files and owner-held archive were retained. No backups outside this release were discarded.
