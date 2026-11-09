# Sleigh bells on the three Christmas campuses

Light sleigh bells went live at 20:46 Vancouver time on November 8, 2026. With Campus sound on, entry plays a short shake. The bells jingle occasionally indoors and outdoors. The earlier carol and pitched display phrases were removed. Rain stays silent. [UBC](https://asymmetri.co/labs/ubc) · [Stanford](https://asymmetri.co/labs/stanford) · [CWRU](https://asymmetri.co/labs/cwru)

## Release identity

| Item | Verified value |
| --- | --- |
| Audio implementation | `93207455d943dbaec980126789ddeeba98aedaaf` |
| Deployed source | `c64f99a22b8d07abad61adc417cf55b00999f3dc` |
| Linux build | `pqCDGF7c0ilyWrtCRVrdN`, Node 22.23.1 |
| CI artifact | `13648540249`, [Linux workflow 42557537875](https://github.com/eugenelin89/asymmetri/actions/runs/42557537875) |
| ZIP SHA-256 | `a827ebb7e79867e559b8fa840d4f48643e7c6b6f59e4c8e2fd802e466b49f3fe` |
| Runtime tar SHA-256 verified on both hosts | `885fc005e4202c162a8e606f7b93f0549359d61bb900be3585e407cb771dc1ad` |
| Activation receipt, November 9 at 03:46:23 UTC | `6be2109dbacc18fdb92cffefe5591433a3a38cc6e0963a16e15252115ae0ea89` |

The development Mac passed the shared atmosphere tests, TypeScript, ESLint with the existing tutorial navigation warning, the production dependency audit and the Vinext build. A real browser audio render produced a short entry shake and a second shake away from the displays, with digital silence between them in calm rain. The Linux workflow passed the type/lint checks, Vancouver tests, audit, prebuild suites and optimized Next build. The independent server checkout used that exact artifact. Its loopback smoke test used isolated stores. All five persistent store digests matched across the production swap.

## Public verification

Six fresh browser sessions entered the ordinary Christmas welcomes on the apex (desktop width) and www (phone width). Each detected the same four metallic resonances on all three clapper impacts, measured signal on the sleigh-bell audio bus and observed the next shake 9.56–11.95 seconds later. All six runs observed only the new resonances among the scheduled oscillators. Switching to Regular succeeded on each campus. There were no page exceptions, analytics writes or synthetic public submissions. These checks measured the live browser audio graph. The owner received the public links immediately after activation for listening on their own device.

The three origins passed 16 page comparisons, four redirects, sitemap and robots checks, including the protected Motion pages, the tutorial canonical and its existing anchors. All 800 public assets and 38 referenced Next bundles matched on loopback, apex and www. Profile and review reads passed for all three campuses. UBC and CWRU had current observations and Stanford returned its supported unavailable-weather response.

## Recovery and cleanup

The previous complete runtime at `/var/www/asymmetri-rollback-before-sleigh-bells-20261109` is source `ba6528b75302fcb66a393df4bcf6d69fb17e7aae`, build `cgSIggsF1IJPAlAAHHgXb`. It booted on a separate loopback port and served its seven checked Motion and campus pages, weather endpoint and a prior static bundle. For recovery, drain the website and prune jobs, set aside the live tree, restore this whole checkout at the service working directory, then restart and verify the site and resume the prune timer. Keep private stores and configuration in place.

| Location | Initial free bytes | Free before cleanup | Free after cleanup | Measured gain |
| --- | ---: | ---: | ---: | ---: |
| Production | 8,758,005,760 | 7,197,773,824 | 7,454,703,616 | 256,929,792 |
| Development Mac | 65,215,328,256 | 63,372,599,296 | 64,871,792,640 | 1,499,193,344 |

Production removed the inactive transfer, receiver helper and empty smoke-test fixtures. The serving runtime uses 1,302,405,120 allocated bytes and the verified immediate rollback uses 1,302,097,920. Four earlier complete rollback trees remain at their documented locations (1.27–1.31 GB each). The twelve older owner-held archives remain absent at their recorded Mac paths. Reconcile custody before retiring protected copies. [Historical archive follow-up](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6730534397)

Post-cleanup health at 03:49:42 UTC verified all 15 peer baselines, 62 configuration files, five private-store settings, the active prune timer and zero new-process warnings or errors. Final free disk was 7,454,679,040 bytes, about 1.01 GB above the 6 GiB floor. This release needed approximately 1.56 GB to stage. A comparable future release needs about 550 MB more free space or a smaller staging footprint. The 192 MiB available-memory floor held throughout. Final receipt SHA-256 `4d075ff56fece9e8c020286173d82d915987ddcd51ee78ccdf8530985f0e2205`.

On the Mac, cleanup removed the temporary dependency installation (809,250,816 allocated bytes), Vinext output (131,739,648) and test/transfer scratch (539,725,824) after verifying they were inactive. Filesystem gains also reflect concurrent activity. Retained the canonical checkout, existing developer state and compact private release evidence. The old absent worktree registration represents no additional checkout on disk.
