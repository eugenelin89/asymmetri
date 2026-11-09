# Christmas campus production release

The UBC, Stanford and CWRU Christmas walks went live on November 8, 2026 at 19:00 Vancouver time. Activation checks finished at 02:00:20 UTC on November 9. Rain is silent. Snowfall covers lawns and base ground for the duration of the current snow conditions. Snow depth and melting history are not simulated. [UBC](https://asymmetri.co/labs/ubc) · [Stanford](https://asymmetri.co/labs/stanford) · [CWRU](https://asymmetri.co/labs/cwru)

## Build and activation

- Feature commit `f67ac01a14efb97488e0169fbb15c272bee8d61d`. Deployed source `8cb6504fcd10c3e8b8d9382507a1c7be3ffc526e`, Next build `vl3iIFSCGyHNX0l6fZ5xk`. The two later commits on main at staging changed only the interaction transcript.
- Exact-source Linux CI passed the type and lint checks, Vancouver tests, production dependency audit and Next production build. Artifact `13643054282` used Node `22.23.1`, matching the host. [Linux build 42546715249](https://github.com/eugenelin89/asymmetri/actions/runs/42546715249)
- Archive ZIP SHA-256 `6fecb534c3a8a2c7b5de3565c23dee8935272e9730e438489691be35dc94d7a0`. Runtime tar SHA-256 `529b8fb1d11befd6d266698b478a271a8c1ca4d85deb297c96b97469760c85cb` matched after transfer.
- An independent application-owner checkout served the candidate on loopback using isolated fixture stores. After that check, the release stopped the website and prune timer, compared the five persistent stores across the directory swap, then started the new build and resumed the enabled timer. Activation receipt SHA-256 `54f4bb0b449b9208fd1b1dc260f9496496519759daf53945025c4f873eaed1d9`.

## Public acceptance

On loopback, apex and www, 16 pages, four redirects, sitemap and robots passed. Checks included the four protected Motion routes, the www tutorial canonical, existing tutorial anchors and original assets, both BotSquad entry points, campus privacy and all three community/review read endpoints. All 800 public files and 38 referenced Next bundles matched their SHA-256 digests on each origin. A TLS connection closed during the first public asset scan. The repeat completed all 2,514 digest comparisons.

Fresh browser contexts exercised all three public welcomes on each hostname at 390, 820 and 1440 pixels. All 18 checks opened in Automatic Christmas, showed the campus-local clock and current station condition, and returned to Christmas after ending a Halloween replay. Keyboard focus and horizontal fit passed. No page exceptions or write requests occurred. The private packet retains two public screenshots. The pre-release local acceptance separately covered 18 physical iPhone walks, Christmas audio and controlled snow rendering. [Device and visual acceptance](CAMPUS_CHRISTMAS_2026.md#acceptance)

| Campus | Nearby station at activation | Observation UTC | Scene weather |
| --- | --- | --- | --- |
| UBC | Vancouver International (YVR) | 01:00 | Partly cloudy |
| Stanford | Palo Alto (KPAO) | 00:47 | Clear |
| CWRU | Cleveland Burke Lakefront (KBKL) | 01:20 | Cloudy |

All three weather endpoints returned HTTP 200 with `Cache-Control: no-store` and identified the cached observation on repeat. An unsupported campus returned 404. Post-cleanup checks verified all 15 peer hosts against baseline, 62 configuration files, the five live private-store settings, the active prune timer and the running source/build. The new website process logged zero warnings or errors through 02:04:55 UTC. Final-health receipt SHA-256 `d89b5bfb7a023d66a80cb5ec774a4bde45e6ee29d5ab6fa57d96ba35a8d0e3e0`.

## Recovery and cleanup

The previous production checkout, its dependencies and its complete Next build are at `/var/www/asymmetri-rollback-before-campus-christmas-20261109`, source `a73eec24f2c81f5fe514c4ff2872a7d46bc12cf4`, build `dmqK2Psv92J2yUeGDoMK2`. It booted independently on a private port and served the three prior campus pages, four protected Motion pages and a prior static bundle. A request for the new weather endpoint returned the expected former 404. To restore it, drain the website and prune jobs, set aside the current tree, move this complete checkout back to the service working directory, restart, verify both hostnames and resume the timer. Keep persistent stores and configuration in place.

Production initially had 11,364,130,816 bytes free. Before staging, a one-time reclaim of cold website memory restored headroom above the 192 MiB available-memory floor. The 6 GiB disk floor also remained in force. Private smoke reached a minimum of 249,212 KiB available, activation 326,660 KiB, and the full public asset pass 222,000 KiB.

| Filesystem | Free before cleanup (bytes) | Free after cleanup (bytes) | Measured gain (bytes) | Removed |
| --- | ---: | ---: | ---: | --- |
| Production | 9,804,603,392 | 10,061,537,280 | 256,933,888 | Verified transfer, receiver script and empty isolated fixture directories |
| Development Mac | 65,159,712,768 | 65,699,540,992 | 539,828,224 | Downloaded ZIP, extracted tar, temporary browser dependency and release scratch |

Production retained the serving runtime (1,301,618,688 allocated bytes), its immediate rollback (1,305,575,424), and the November 2 and October 31 rollback trees (1,274,503,168 and 1,272,676,352). Final health measured 10,061,516,800 bytes free. On the Mac, the initial free-space reading was 64,659,185,664 bytes. Scratch used 539,787,264 allocated bytes before removal. The free-space numbers are filesystem observations and can also reflect concurrent activity. The canonical checkout and compact evidence packet remain. A pre-existing worktree registration points to an absent directory and its branch is on the remote. It occupied no separate checkout space.

The November 2 inventory lists 12 owner-held historical archives. All 12 were absent from their recorded Mac paths at this audit. Current custody remains unverified until their present location and digests can be checked. The release deleted no historical archives or rollback trees.
