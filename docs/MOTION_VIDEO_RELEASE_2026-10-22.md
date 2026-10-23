# Direct Motion video release — October 22, 2026

The owner explicitly requested deployment after the implementation in
[Prompt 110](prompts/110-design.md). Activation completed October 22 at
19:40:46 Vancouver / October 23 at 02:40:46 UTC. Both public hosts now render
the approved Motion YouTube preview and Play control directly, without a custom
Load video gate or autoplay. The page notice and October 22 privacy disclosure
explain that Google requests can begin before Play.

## Release identity

| Item | Verified value |
| --- | --- |
| Deployed source | `228b04d81be11c57bf76ce7eb88695527ed7ea1c` |
| Implementation | `6ddf39d3293c65f07f5f5697ecc4c4761624d8db` |
| Next.js build | `teqbPSsBXS18D5heaFJcf` |
| Build artifact SHA-256 | `a8f37441ccdd32b642a3b3b748ef70fe761e95b294fa1bd826bcfcfae1653fe3` |
| Build artifact bytes | `1573259` |
| Production Node | `22.23.1` |
| Website PID at acceptance | `2512136` |
| Service start | `2026-10-23 02:40:45 UTC` |
| Rollback directory | `/var/tmp/asymmetri-direct-video-rollback-20261022` |
| Rollback source | `c4cefd9d0cfea154c7dc0fc3064c982c866049bc` |
| Rollback build | `W4Yg_XIBAR3DSU1bd-kJJ` |

The production checkout is clean `main` at the compiled source. Subsequent receipt
and journal commits are documentation only and require no additional restart.

## Preparation and activation

Clean local `main` synchronized successfully. Production was clean and healthy at
the October 21 access release. The incoming range contained the direct video
implementation and documentation; package/lockfile, public assets, routing and
runtime configuration were byte-identical.

The existing Node 22 approval and retained-host deployment exception were reviewed
for this website-only release. Ubuntu 22.10 and the existing dependency graph
remain unchanged. Prompt 110 records the critical Next.js audit finding; this
deployment neither remediates it nor claims a clean dependency audit.

The reserved Linux builder used an independent copy of the unchanged dependency
tree, as its staging application owner. Node and native compiler hashes matched
production. `npm run check` and `npm run build:next -- --webpack` passed under the
proven 384 MiB heap cap. The existing tutorial navigation lint warning and
Browserslist data-age notice remain. All 458 committed source hashes matched
after building and in the production candidate. Artifact hashes and size matched
on builder, Mac and production.

Because routes, configuration, assets and dependencies were unchanged, production
used the documented copy-only staging model. Source and Git state were preserved
before activation. Candidate and rollback reuse unchanged dependencies through
hard links; no install or dependency mutation occurred. The prior `.next` was
moved into the rollback directory only after candidate acceptance. The live path
remained in place, `main` fast-forwarded to the exact approved source, and only
`asymmetri.service` restarted. The new process was ready in 351 ms; no rollback
was needed.

| Guard phase | Minimum available memory, KiB | Minimum free disk, bytes |
| --- | ---: | ---: |
| Linux build | 1017264 | 6533750784 |
| Production preparation | 342780 | 6559940608 |
| Artifact extraction | 339828 | 6551105536 |
| Candidate loopback smoke | 265688 | 6540718080 |

The unchanged builder floors were 384 MiB memory / 6 GiB disk; production floors
were 192 MiB / 6 GiB. No older rollback or unrelated file was removed for capacity.

## Acceptance and recovery

- Candidate: 12 routes, eight protected host/route combinations, both access
  redirects, 24 tutorial assets and all 124 prior tutorial IDs passed. Tutorial,
  Support, Trade and closed Ask main content matched the predecessor.
- Public HTTPS: 18 route/host checks passed, including direct player markup on
  apex and www, no autoplay, the new privacy disclosure, unchanged 307 access
  destinations and protected footer/context links. All 24 tutorial asset bytes
  matched and the exact tutorial www canonical remained.
- Live browser: the native thumbnail and Play control appeared without loading
  activation. Actual 390, 768 and 1440 CSS-pixel widths had no horizontal overflow
  or missing image alt attributes; loading left focus on the page body. No browser
  console errors were observed. Viewport overrides were reset.
- All 13 other virtual-host response baselines and 55 configuration fingerprints
  were unchanged. Nginx, Investment, Ask and inactive gunicorn identities were
  preserved. No private-service authority, data, OS, DNS or TLS change occurred.
- Final clean source/build identity, boot enablement and zero automatic restarts
  passed. Startup logs contained no new error. The final sample had 6,540,623,872
  bytes free and 375,560 KiB available memory.

Private operational receipts remain at
`/var/lib/asymmetri-direct-video-release-20261022/`. Verified artifacts, source
manifest, logs and browser evidence are retained outside Git under
`../deployment-retention/2026-10-22/motion-direct-video-release/`. The disposable
Linux builder was removed after retaining this evidence.

For emergency rollback, stop only the website, preserve the failed live directory,
restore the recorded rollback directory to `/var/www/asymmetri`, restart and
repeat protected/public checks. Its source, Git, assets and previous build are
preserved; its dependencies are hard-linked to the unchanged deployed tree.
Do not mutate either dependency tree in place. This is code/build recovery,
not a rollback of receiver data, service configuration or TestFlight responses.
