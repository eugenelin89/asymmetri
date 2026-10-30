# Surrey Adventure V0.1 production release

Surrey Adventure is live at <https://asymmetri.co/labs/surrey>. Activation completed
October 30, 2026 at 16:52:39 UTC / 09:52 PDT. This is a playable, fictional City
Centre adventure, with one complete backpack mission and an optional danger event.
The second mystery is a future mission hook. See the [project guide](../projects/surrey/README.md)
for controls, architecture, geographic assumptions, licences and roadmap.

## Exact release identity

| Item | Verified value |
| --- | --- |
| Implementation | `22ded9f` |
| Deployed source | `883ebfe5d81a191b9d73e6fd183ec2d589d88be6` |
| Linux Next build | `Ph1NW42c_br8k4AmOXJQ4` |
| Runtime | Node `22.23.1`, Next `16.4.3`, Three.js `0.186.1` |
| Feature branch | `codex/surrey-adventure-v01` |
| Successful CI run | [41091571023](https://github.com/eugenelin89/asymmetri/actions/runs/41091571023) |
| CI artifact | `12994736532` |
| Runtime tar SHA-256 | `666d4154966b676835c1de0902b3da739e4878e042c51b04679b485573a6220c` |

The existing workflow ran Surrey tests through `prebuild:next`, with no workflow
permission or credential change. The Linux archive was independently downloaded,
hash-checked, inspected for unsafe members, and streamed into a separate,
application-owned checkout. Nothing was built or installed in the running tree.

Main concurrently received Vancouver's final deployment journal `0b11a32`.
Merge `34dabb3` preserves that journal byte-for-byte alongside the Surrey commits;
it differs from the tested source only at `docs/prompts/121-deployment.md`. Both
the feature branch and main were pushed normally. Production remains at the
exact artifact source above; this receipt and subsequent journals are also
documentation-only and do not imply another runtime build or deployment.

## Acceptance

- Local checks: TypeScript/ESLint; 17 Surrey, 25 Vancouver and seven investment
  tests; production audit with zero vulnerabilities; standard Next and Vinext
  production builds; source/data reproducibility and `git diff --check`.
  Only the existing unrelated tutorial-reader lint warning remained.
- Linux CI: checks, Surrey and Vancouver tests, audit and production build passed.
- Isolated server: 12 baseline routes, eight protected host/path combinations,
  124 tutorial IDs, 24 tutorial assets, native Sharp optimization HTTP 200,
  preserved Motion video/form behavior, Ask/Trade content and canonical URLs.
  Surrey's page, Labs entry, sitemap, 786-building dataset and manifest passed.
  Vancouver main content and all three published dataset versions were preserved.
- Public apex and www: 13 routes each returned HTTP 200; protected main content,
  IDs, links, canonicals and all 24 tutorial assets matched the pre-release baseline.
  Surrey assets matched the committed hashes. Six Vancouver asset hashes per
  host and the Motion access redirect also passed.
- Browser: the full live mission was completed using ordinary keyboard input:
  Alex, transit slip, pursuit, backpack recovery, return and the one-time $35 reward.
  CASE CLOSED and the final $55 balance were visibly verified. Sampled rendering
  was about 60 FPS, with one canvas, eight textures and no application console errors.
  The completion screenshot and browser evidence are retained outside Git.
- Local browser acceptance covered 320×740, 390×844, 767×1024, 844×390 and
  1280×900 without horizontal overflow; held touch movement, sprint, camera,
  map, pause/resume, Lite mode and route departure/re-entry. Route departure
  removed the canvas. Automated tests cover both mission solutions, actual
  collision movement, deterministic danger, retries and recovery.

## Production preservation and capacity

All guarded preparation stayed above 289.1 MiB available memory and 6.398 GiB
free disk, exceeding the unchanged 192 MiB / 6 GiB floors. The activation monitor
sampled capacity and peers throughout the swap. The 16:52 UTC health check found
389.9 MiB available memory and about 6.543 GiB free disk, an enabled/running
website, zero restarts and zero post-activation error entries. The old process's
intentional-stop exit-143 journal entry is accounted for separately.

Five peer service identities, 55 configuration hashes, 13 unrelated virtual-host
responses and the Node executable remained unchanged. No OS, proxy, TLS, DNS,
database, receiver or unrelated service changes were made. The existing retained-host
exception and Node 22 authorization remain the deployment basis.

Capacity came from lossless archival of four older inactive website runtimes:

| Archive | SHA-256 |
| --- | --- |
| `asymmetri-desk-order-rollback-20261023.tar.gz` | `6c8d60f6831bc145328116389410de3ad4f16ab02d997786eccfc28d79e6cf5b` |
| `older-website-runtimes-surrey-capacity.tar.gz` | `c4962298d1e7759aaa8ca7fa805a9ea26af60ea8533b12ed3baff6629487564a` |

The latter contains the October 21 `41dc0ab`, `d910b33` and `88ba5ab` runtimes.
Each archive passed SHA-256, gzip and full remote tar comparison, then source/build,
clean-tree, open-file and configuration-reference checks before remote retirement.
Shared hard-linked dependencies explained the first archive's small space recovery.
Archives and receipts remain in owner storage under
`deployment-retention/2026-10-30/surrey-v01/`; no backup was merely assumed complete.

## Recovery

The complete preceding Vancouver V0.3 runtime remains at
`/var/www/asymmetri-rollback-v03-20261030-8d0530e`, source
`8d0530e65dabf23266f892cf3aef2b3b55e6733d`, build
`Y3ReGxnH5WDkIJA_b0D-G`, with its executable Linux dependencies.
V0.2, final V0.1 and pre-Vancouver runtimes also remain intact on-server.

Activation used the guarded complete-directory swap with automatic restoration
on acceptance failure. No rollback was needed; a rollback drill was not performed.
For a later rollback, recheck current/previous identities, clean trees, runtime
completeness, capacity and peer/configuration fingerprints first. Stop only
`asymmetri.service`, rename the current tree to a new retained failure path,
rename the verified V0.3 tree into `/var/www/asymmetri`, start the service and
repeat protected-route/public/peer checks. Never reset Git, overwrite a retained
runtime, restore an old database or change receiver authority for website rollback.

Remote evidence is under `/var/lib/asymmetri-surrey-v01-release-20261030`.
Matching receipts, Linux artifact, archives, browser evidence and screenshot are
retained by the owner outside the repository. CI's seven-day artifact retention
is transport, not the recovery archive.

## Known limits and next work

This is a flat, bounded arcade map with stylized architecture and unverified
source height units/observation dates. Some furniture is decorative. There are
no interiors, vehicles, saves, terrain or complete second investigation. Browser
viewport checks do not establish physical-phone, multi-touch, battery or thermal
performance. Forced GPU loss and long-session behavior need further acceptance.

Prioritize richer source-backed landmarks and street detail, physical-phone
input/performance testing, then a second complete investigation with stronger NPC
avoidance. The project's V0.2–V1.0 roadmap remains future work.
