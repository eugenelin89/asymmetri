# CWRU V0.1 production release — October 31, 2026

## Runtime and scope

Activated at **22:32:09 UTC on October 31, 2026** and verified on [apex](https://asymmetri.co/labs/cwru) and [www](https://www.asymmetri.co/labs/cwru). Live source is `28b5521a9f7edd809b49d594b7a75eb64f3f66be`, Linux build `H6dUdFnitvZI1P5BXdc9O`. Final health passed at 22:37:38 UTC. Documentation commits after this receipt do not change the frozen live runtime. Shared reviews and play reporting are a separately requested follow-up; they are not included in this artifact.

The independent `/labs/cwru` release includes the source-mapped University Circle campus, 17 enterable reconstructions, 528 named public-source characters plus a fictional guide, player-created public characters, and the automatic/manual Halloween edition. It preserves the Campus and City menu, UBC After Dark and existing UBC profiles, the city applications, BotSquad and the protected Motion routes.

The student expansion imports 500 supplied research rows, enriches five existing records and adds 495 distinct names. All supplied names were corroborated on public university pages; 434 study fields were found in linked text and 66 retain provided-research attribution. These checks do not prove current enrollment. Original avatars and movement are fictional. At most ten university characters and two community characters render at once. See [implementation details and reconstruction limits](CWRU_CAMPUS_2026-10-31.md).

## Exact-source validation

Implementation `2332e7b4448dc02b02ad1088042a06e60cf45a63`; journal 169 `28b5521a9f7edd809b49d594b7a75eb64f3f66be`. The latter is the exact release source. Linux workflow [41247247782](https://github.com/eugenelin89/asymmetri/actions/runs/41247247782), job 124673126189, passed TypeScript/lint, all 393 tests (74 Vancouver, 69 Surrey, 27 Richmond, 134 UBC and 89 CWRU), production audit with zero vulnerabilities, and the standard webpack production build. Node 22.23.1 matches the approved production runtime. Local Node 24.10.0 also passed the CWRU suite and both Next/Vinext builds.

Artifact `13060220413` produced build `H6dUdFnitvZI1P5BXdc9O`. Its ZIP SHA-256 is `37dd2974b58947057617047054eaac3e441b9f589597057f7ce2be991466653b`; the runtime tar SHA-256 is `95a472696b588ffb2bc800d3b8de022196c5d0009ffd95185416bbb2a31f2aea` (255,194,712 compressed bytes, 901,137,338 expanded file bytes). ZIP/tar hashes, safe archive paths, exact source and Node version were verified before transfer.

The production host did not compile or install dependencies in the live tree. The independent application-owned checkout and transferred Linux dependencies/build were verified against the exact source and artifact hashes. Other chats’ uncommitted student/review/analytics/Stanford work was excluded.

## Persistence and acceptance

The new private store is `/var/lib/asymmetri-cwru-community`, owned by `django-user`, directory mode 0700 and `community.json` mode 0600. The service setting is `/etc/systemd/system/asymmetri.service.d/40-cwru-community.conf`, SHA256 `c211803a41330f8413bc11519626226bb1a2bab5ecafb08d1dab50490fbed3ab`, supplying `CWRU_PROFILE_DIR`. Future deployments must preserve this setting and store independently of the source/runtime. Existing UBC settings and data were unchanged. Both private candidate and public profile create/read/edit/recover/delete, ownership-cookie isolation and cross-origin rejection passed. Only explicitly synthetic fixtures were used and removed; no real participant profile was created.

The private candidate passed 18 routes, 8 protected host checks, 24 tutorial assets and 124 legacy tutorial IDs, 688 Richmond assets, 6 UBC assets, 4 CWRU assets and image optimization. Public apex and www comparisons passed 17 routes and 24 tutorial assets each, exact protected content/links/IDs/canonicals, unchanged UBC, and the intended CWRU GIS card. CWRU HTML and asset hashes matched the candidate on both hosts; profile feeds remained private-cache-disabled and exposed no ownership secrets.

Live browser checks verified the automatic Halloween welcome, keyboard walking, Regular restoration, sound preview/runtime, mute control, reduced motion, a 390×844 phone layout without horizontal overflow, and actual entry into Kelvin Smith Library Level1. The final console-error list was empty. Automatic Halloween and sound defaults were restored. [Welcome](validation/cwru/live-welcome.jpg), [phone controls](validation/cwru/live-phone-sound.jpg) and [library interior](validation/cwru/live-library-interior.jpg) are unretouched evidence. A new expanded-roster conversation was not completed in this live browser pass; source-bounded dialogue is covered by the automated suite.

Final health confirmed the application active/enabled with zero restarts, zero post-activation error entries, unchanged peer services, 13 virtual hosts, 56 prior configuration files, Node binary and UBC profile store. The sole earlier journal error was the expected old-process exit 143 during the swap. No Nginx change or unrelated service restart occurred.

The temporary private candidate process used only loopback port 3107 and was stopped after acceptance. The local preview was also stopped. Browser emulation does not certify physical-device performance or subjective audio quality.

## Capacity, retention and recovery

Continuous guards retained the 192 MiB available-memory and 6 GiB free-disk floors. Final health observed 405,172 KiB available memory and 7,770,398,720 free bytes. Two older inactive expanded runtimes were streamed directly to private owner storage, verified with SHA256, gzip, safe archive paths, recorded source/BUILD_ID and complete GNU tar comparisons, then retired only after custody receipts. The six existing server archives and the earlier owner-held bbf archive remain verified.

| Retained full runtime | Source / build | Owner archive SHA256 |
| --- | --- | --- |
| `asymmetri-rollback-before-ubc-v04-landmarks-20261031.tar.gz` (407,367,680 bytes) | `f3e5a9fd530ca3acd28f9f8200d6668e79c03273` / `UvDOiPq9Ko5YmOkq4aC66` | `37fcc8e16df18624ea198b37524c9ecebe65df36142513c138077ab33bf93fe6` |
| `asymmetri-rollback-before-ubc-v041-welcome-20261031.tar.gz` (409,600,000 bytes) | `8eba0e908c8e5c47c5ab46b82e868a6be754bdb5` / `rtOqqaM__deGCW7i5raQm` | `8ec42ac10df83c164f058da35f4b90bcca2ad01b66580b215f330316d76ea76c` |

These two archives are owner-held, not additional on-server archives. The `.owner-custody.json`, `.retired.json`, stream and continuous-guard receipts identify each location and verification. Successor deployments must carry these custody records forward instead of expecting the retired expanded paths to remain.

The previous live menu source was `4f57af9f7d3827d49166e29bffe680c77f4132e2`, build `9fGY4CtfRyxjVywNp8Hqf`. Its complete runtime is retained as the immediate CWRU rollback at `/var/www/asymmetri-rollback-before-cwru-v01-20261031`. The preceding menu copy-only recovery build remains `/var/tmp/asymmetri-campus-city-menu-20261031/previous.next`, build `Al8RacnJ4uunt6U1i9VTC`, with source `f106770b8c6fff7db2e812c53d8623f871f61b99` recoverable from the retained Git database and unchanged dependencies.

Private evidence is retained in owner storage under `deployment-retention/2026-10-31/cwru-v01` and on the server at `/var/lib/asymmetri-cwru-v01-release-20261031`. It includes source/artifact hashes, baseline and public comparisons, archive/custody receipts, continuous guards, smoke, activation and final-health evidence. This receipt does not introduce an off-site backup service.

For immediate rollback, verify the preceding runtime source/build/dependencies and current profile data first; stop only `asymmetri.service`, retain the current CWRU runtime separately, swap the complete preceding tree into `/var/www/asymmetri`, remove only the hash-matching new CWRU dropin if restoring the prior configuration, reload systemd, then restart and verify both hostnames and peer services. Preserve the external CWRU and UBC profile directories. Never restore old profile data over legitimate submissions.

Older owner-held archives include full source/Git/dependency/build trees, verified SHA256/gzip and complete GNU tar comparisons before retirement. Restore an archive into a new private location and verify its recorded source/BUILD_ID before any recovery swap; never extract over live.

## Remaining limits

The campus is a source-informed procedural reconstruction, not photogrammetry or a surveyed digital twin. Several academic interiors are interpreted teaching spaces, higher Clarke floors and source-context wings are exterior-only, terrain is flat, and exact campus-wide room geometry is not claimed. Christmas remains planned; December falls back to Regular until its assets are implemented. No current enrollment, real whereabouts, likeness or university endorsement is asserted.
