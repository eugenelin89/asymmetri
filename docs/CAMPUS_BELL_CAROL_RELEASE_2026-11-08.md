# Christmas bell carol in production

The music went live on November 8, 2026 at 20:22 Vancouver time. With Campus sound enabled, entering a Christmas campus plays an arrival chime followed by a quiet eight-bar carol. The music continues indoors and outdoors. Rain stays silent. [UBC](https://asymmetri.co/labs/ubc) · [Stanford](https://asymmetri.co/labs/stanford) · [CWRU](https://asymmetri.co/labs/cwru)

## Release identity

| | Verified value |
| --- | --- |
| Music implementation | `21ab776424d916b6ee33db345ddef87bfbc29382` |
| Deployed source | `ba6528b75302fcb66a393df4bcf6d69fb17e7aae` |
| Linux build and runtime | `cgSIggsF1IJPAlAAHHgXb`, Node `22.23.1` |
| GitHub artifact | `13646510134`, [successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/42552262899) |
| Artifact ZIP SHA-256 | `bfb4dbe923b9435b99a371be9f8ecda9b130563e073a52ea38e7a7fc25844b4e` |
| Runtime tar SHA-256 on Mac and server | `4d6b361a44d92018740580e708d4f6554c6797490ef09a04dcb78abc63986f55` |
| Activation receipt at 03:22:17 UTC, November 9 | `18e4cf47cb8c268bc43f6c795e882d0156e62f3a9aa0a402c54d20fc719a5fe4` |

The only subsequent main commit at staging changed the interaction log. The exact-source workflow passed type and lint checks, Vancouver tests, the production dependency audit and the Next production build with its eight prebuild suites. An independent application-owner checkout passed loopback tests with isolated private stores before activation. The website and prune timer were stopped for the directory swap. Content digests of all five persistent stores matched across the swap.

## Public playback and health

Six browser visits entered through the ordinary Christmas welcome with sound enabled. The apex ran at 1440 pixels and www at 390 pixels. In all six, the browser measured nonzero master output when the carol played. The first bar started 3.00–3.27 seconds after the arrival chime. The second bar followed, and switching to Regular stopped scheduling the festive notes. The checks observed the actual browser audio graph. They generated no write requests or analytics sessions. Earlier physical iPhone checks covered the underlying chimes. [Music implementation and listening sample verification](prompts/207-design.md)

The candidate, public site and loopback passed the 16 page comparisons, four redirects, sitemap and robots checks. The four protected Motion routes retained their page content, tutorial anchors and canonical. All 800 public assets and 38 referenced Next bundles matched their digests on loopback, apex and www. Three profile projections and review reads passed on each origin. UBC and CWRU returned fresh station observations. Stanford returned the supported unavailable-weather response. Both Stanford-area station responses had empty descriptions and no reported cloud layers at the check.

Early browser visits encountered intermittent empty responses or closed connections while loading scripts. A subsequent run completed all six playback checks. One peer probe also differed transiently. Both the repeat and the post-cleanup comparison matched the 15-host baseline. Final checks confirmed 62 configuration files, five running store settings, the active prune timer and zero warnings or errors from the new website process. Final-health receipt at 03:27:04 UTC, SHA-256 `e207d94491e944ecae11609882a63b22f8dc24909e628b5376e1c8f835678c0b`.

## Recovery and capacity

The immediate rollback is the previous Christmas release at `/var/www/asymmetri-rollback-before-bell-carol-20261109`, source `8cb6504fcd10c3e8b8d9382507a1c7be3ffc526e`, build `vl3iIFSCGyHNX0l6fZ5xk`. A private startup on an available loopback port served its original three campus pages, four protected Motion pages, weather endpoint and static bundle from the retained tree. The first private port was still occupied. For restoration, drain the website and prune jobs, set the serving tree aside, move this complete rollback to the service working directory, start the site, verify both public hosts and resume the prune timer.

| Location | Initial free bytes | Free before cleanup | Free after cleanup | Measured gain |
| --- | ---: | ---: | ---: | ---: |
| Production | 10,061,078,528 | 8,501,219,328 | 8,758,165,504 | 256,946,176 |
| Development Mac | 65,216,847,872 | 64,687,292,416 | 65,227,063,296 | 539,770,880 |

Production cleanup removed the verified transfer, receiver script and empty fixture directories after confirming they were inactive. Three transfer metadata sidecars were also discarded during staging. The live runtime occupies 1,302,036,480 allocated bytes and the immediate rollback 1,301,680,128. Three earlier rollback trees remain at their previous locations (approximately 1.27–1.31 GB each). The recorded resource floors were 192 MiB available memory and 6 GiB free disk. Minimum available memory during private smoke was 273,260 KiB and during activation was 335,060 KiB. The lowest monitored disk reading was 8,497,483,776 bytes. Final health measured 8,758,140,928 bytes free.

The Mac cleanup removed the downloaded ZIP and tar, private script copies and browser test dependencies, together using 539,705,344 allocated bytes. The canonical checkout, listening sample and compact private release receipts remain. The previously registered absent worktree has no separate on-disk checkout. Twelve historical owner-held archives remain absent from their recorded Mac paths. The existing issue tracks reconciliation of their location and digests. [Recovery inventory follow-up](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6730534397)
