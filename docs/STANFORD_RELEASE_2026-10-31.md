# Stanford V0.1 production release — October 31, 2026

## Live runtime and scope

Activated at **23:03:45 UTC** and verified on [apex](https://asymmetri.co/labs/stanford) and [www](https://www.asymmetri.co/labs/stanford). Exact live source: `a69cb68c9f11942978fdec16ff2d0ddac04d88b6`; Linux build: `otCTTCCerr51Hh_vOJxBA`. Final server health passed at 23:07:00 UTC, followed by the completed browser checks. Later documentation commits do not alter this pinned runtime.

This initial artifact includes the 32 enterable landmarks, 12 outdoor venue groups, 1,402 simulated characters including 823 athletes and the 500 supplied student records, public player profiles, UBC-style controls, and automatic/manual Base and Halloween editions with original synthesized sound. Shared public reviews and private usage reporting are a separate Stanford-owned follow-up after the UBC-owned backend release; they are absent from this artifact. See [implementation and reconstruction limits](STANFORD_CAMPUS_2026-10-31.md).

## Source and artifact validation

Implementation `257bbb4` and journal 171 `a69cb68` were pushed before the exact-source [Linux workflow 41249589667](https://github.com/eugenelin89/asymmetri/actions/runs/41249589667), job 124680109678. TypeScript/lint passed with the existing tutorial-navigation warning, all **533 tests** passed (74 Vancouver, 69 Surrey, 27 Richmond, 134 UBC, 89 CWRU, 140 Stanford), the production audit found zero vulnerabilities, and the Next webpack build passed on approved Node 22.23.1. Local Node 24.10.0 validation also passed both Next and Vinext builds.

Artifact 13061085876 has ZIP SHA256 `50b630d5897f96463c2bba2016064162dbeeebda18c63282b2904f3f896c7ab3` (256,768,732 bytes). Runtime tar SHA256 is `af8552f9214238f88b40d0d7a3f327444c27f36915f3d393006b208293852e54` (256,768,295 compressed bytes; 912,503,147 expanded regular-file bytes). Archive paths and links, embedded source/build/Node identity and Linux x64 native Sharp were verified before transfer. A clean independent application-owned checkout received the Linux runtime through the deployment helper. No compilation or dependency installation occurred in the live tree; no Mac runtime was transferred.

## Acceptance and persistence

The private loopback candidate passed 19 routes, eight protected-host checks, 24 tutorial assets and 124 legacy tutorial IDs, 688 Richmond assets, six UBC assets, four CWRU assets, three Stanford geographic assets and PNG image optimization. It passed the synthetic profile create/read/edit/recover/delete lifecycle, cookie isolation and cross-origin rejection. The temporary port 3108 process was stopped after acceptance.

Both public hosts passed all 18 pre-existing routes and 24 tutorial assets each, preserving protected text, links, IDs and canonicals, UBC/CWRU content and the intended Stanford GIS-card addition. Stanford HTML matched the accepted candidate, all three geographic assets matched the exact Git hashes, and public profile reads exposed no ownership secrets and used no-store caching. One clearly synthetic live profile passed create/read/edit/recover/delete and cross-origin rejection, then was removed; prior profiles were preserved.

Live browser checks passed the automatic October 31 Halloween welcome, first/third-person held-key movement, focus restoration after panels, actual entry into Memorial Church Level 1, Base restoration and automatic Halloween re-selection, mute/volume controls, mobile profile form and map. The 390×844 layout had document width390 and zero broken images. The final console-error list was empty. Desktop welcome/interior and mobile form captures are in [the validation gallery](validation/stanford/README.md). Audio controls and synthesis tests were verified; subjective speaker audition and physical-device performance are not claimed.

New persistent store: `/var/lib/asymmetri-stanford-community`, owned by `django-user`, directory 0700 and `community.json` 0600. The setting `STANFORD_PROFILE_DIR` is supplied by `/etc/systemd/system/asymmetri.service.d/50-stanford-community.conf`, SHA256 `9dcf2077ee57570c8d204669ea80b4b900686a224e9a3dadd0597d85b538707a`. Preserve this directory and drop-in in successor baselines; never package profiles into runtime archives. Existing UBC/CWRU profile stores and settings were unchanged.

Final health confirmed active/enabled Asymmetri, zero restarts and zero post-activation errors. The earlier old-process exit 143 was the expected shutdown during the swap. Five peer-service states, 57 pre-existing configuration files, 13 virtual-host responses, the Node binary and both prior campus profile stores were unchanged. No Nginx change or unrelated service restart occurred.

## Capacity, retention and recovery

Continuous guards preserved 192MiB available RAM and 6 GiB free disk. Final health observed 385,052KiB available memory and6,487,097,344 free bytes. Free disk is close to the floor: the next release must budget its complete independent runtime before staging and use the existing verified archive-custody process if more space is required.

The complete immediate rollback is `/var/www/asymmetri-rollback-before-stanford-v01-20261031`, source `28b5521a9f7edd809b49d594b7a75eb64f3f66be`, build `H6dUdFnitvZI1P5BXdc9O`. The complete preceding menu runtime `/var/www/asymmetri-rollback-before-cwru-v01-20261031` remains (source `4f57af9`, build `9fGY4CtfRyxjVywNp8Hqf`), as does the older copy-only `previous.next` under `/var/tmp/asymmetri-campus-city-menu-20261031` (build `Al8RacnJ4uunt6U1i9VTC`). Stanford retired no runtime or archive.

Six older server archives and all three owner-held archive identities were reverified. The two CWRU-held full-runtime archives and their custody receipts remain as recorded in the [CWRU release receipt](CWRU_RELEASE_2026-10-31.md); the earlier historical owner archive also remains. Carry forward custody receipts rather than expecting retired expanded paths to exist.

Private server evidence: `/var/lib/asymmetri-stanford-v01-release-20261031` (0700). `baseline.json`, `local-owner-archives.json`, retention receipts, smoke, profile setup, continuous guards, `activation.json` and `final-health.json` contain the exact identities and checks. Owner evidence and the Linux artifact are retained in `deployment-retention/2026-10-31/stanford-v01` outside the repository. Prior custody evidence remains under `/var/lib/asymmetri-cwru-v01-release-20261031`.

For immediate recovery, verify the complete preceding source/build/dependencies and current profile data; stop only Asymmetri, retain the new runtime separately, swap the complete rollback into `/var/www/asymmetri`, remove only the matching new Stanford drop-in if reverting configuration, reload systemd and restart. Recheck both hosts and peers. Preserve all external profile directories and never overwrite legitimate submissions with old data. Extract older archives only into a new private location, verify identity, then consider a recovery swap.

## Remaining rollout

The server slot was released after initial live verification for UBC's shared review/analytics backend deployment. Stanford owns its subsequent frontend integration, exact-source validation and deployment. The ten-minute ETA heartbeat remains active until that stage is also live-verified. Christmas remains planned; December currently falls back to Base. Buildings, interiors and avatars are source-informed interpretations, with flat terrain and no current-enrollment, likeness, location or university-endorsement claim.
