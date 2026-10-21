# Sports and Motion v1.2 website release — October 21, 2026

The owner explicitly requested deployment after the Sports/Motion refresh. The
existing DigitalOcean website was activated at 19:22:15 UTC / 12:22:15 Vancouver.
This publishes the website explanation of Motion v1.2; the iPhone application
remains in private TestFlight testing with public App Store availability pending.

## Release identity

| Item | Verified value |
| --- | --- |
| Committed website source | `d910b3310ccc29153dcbcd19f694fe1bd18f23a5` |
| Content implementation | `08c95753133c8cf943dc30c0919138c56bb67cd3` |
| Next.js build | `iB59CwD3RhwJqKcC-I-2o` |
| Build artifact SHA-256 | `fc92c7949be7744acc9bf42176db781081a09815dd137fb49402f584d7057d3a` |
| Build artifact bytes | `1571106` |
| Production Node | `22.23.1` |
| Website PID at acceptance | `2492153` |
| Service start | `2026-10-21 19:22:14 UTC` |
| Complete rollback | `/var/www/asymmetri-rollback-20261021-ff3c5f1` |
| Rollback source | `ff3c5f15ce5f16e26d50fd9c334df54984ed8b3e` |
| Rollback build | `ixmGyTP4nsir7330ovmiA` |

The production checkout is clean `main` at the compiled source. Subsequent receipt
and prompt-journal commits document acceptance and do not require another build
or restart. The source review and local validation are recorded in
[Motion product review](MOTION_PRODUCT_REVIEW.md) and [Prompt 104](prompts/104-content.md).

## Build and activation

Production was clean and healthy at `ff3c5f1`. The incoming range contained only
the refresh and its journal; dependencies, lockfile, public assets, routes,
redirect configuration and runtime settings were unchanged.

The reserved Linux builder ran checks as its staging application owner, using
the exact production Node executable and matching Linux native compiler package.
The Node SHA-256 was
`93956de2e59480474a7b46571da1651180b1a050cdf32641ebec4ce6e478e068`.
Unchanged installed dependencies were hard-linked read-only, with no installation
or shared-file mutation. Builder npm was 11.19.0; production npm remained 10.9.8.

`npm run check` and `npm run build:next -- --webpack` passed. The existing tutorial
navigation lint warning and Browserslist data-age advisory remain. The builder
used the previously proven 384 MiB Node heap cap and the unchanged 384 MiB
available-memory / 6 GiB free-disk guard. Minimum available memory was 1,075,028 KiB
and minimum free disk was 8,829,849,600 bytes; peer services were unchanged.

All 449 tracked source files matched the committed manifest after building and
again in the production candidate. Artifact hashes matched on builder, Mac and
production. Only `.next` was transferred, excluding its disposable cache. The
production candidate was a clean application-owned clone with independent source
and build files and hard-linked unchanged dependencies. No compiler or dependency
installation ran on the website host.

| Production guard phase | Minimum available memory, KiB | Minimum free disk, bytes |
| --- | ---: | ---: |
| Candidate preparation | 377600 | 6896955392 |
| Artifact extraction | 364268 | 6893498368 |
| Candidate loopback smoke | 294152 | 6883160064 |

All exceeded the unchanged 192 MiB / 6 GiB production floors. The candidate used
the live website environment and application identity on temporary loopback port
3107. It was stopped after testing. Activation stopped only `asymmetri.service`,
renamed the complete old runtime to the rollback directory, installed the
candidate at `/var/www/asymmetri`, and started the existing service. The new process
was ready in 377 ms; it remained active with zero automatic restarts. The old
process reported exit 143 during the deliberate stop; this was not a startup
failure of the replacement. No rollback was needed.

## Capacity and retained recovery material

Initial free disk was 5,917,872,128 bytes, below the deployment floor. Following the
documented retention procedure, the older inactive
`/var/www/asymmetri-rollback-20261013-97b4087` was preserved in private durable owner
storage before retiring its redundant server copy. Current and recent rollback
runtimes were retained intact.

| Retained archive item | Verified value |
| --- | --- |
| Source | `97b4087b79c5f0f1472fd71dde86765489273400` |
| Build | `kcKfT0zA-jDnr0xVy1Suy` |
| Archive | `asymmetri-rollback-20261013-97b4087.tar.gz` |
| Bytes | `309903360` |
| SHA-256 | `09cf1577dd07909ff0f8c70cc455f6bac39e0810814ec561d819f1251daa0bd9` |

The complete archive includes Git, dependencies, assets and build output, retaining
ownership, modes, links, timestamps, ACLs and extended attributes. Local sync and
gzip integrity passed; streaming server and local sizes/hashes matched. GNU tar
compared every archived file and metadata against the still-present original
before retirement. The application owner removed the verified duplicate contents;
the administrator removed the empty entry from root-owned `/var/www`.

The archive and private receipt are in `../deployment-retention/2026-10-21/`
relative to the website checkout, outside Git, with private directory/file modes.
The server retention receipt is `/var/lib/asymmetri-motion-retention-20261021/`.
Restore using the checksum, ownership and empty-staging procedure in
[the retention guide](WEBSITE-ROLLBACK-ARCHIVES_2026-10-15.md). Do not activate this
historical pre-migration build as a current Trade rollback; the complete `ff3c5f1`
runtime and separately retained Trade compatibility fallback remain available.

## Acceptance

- Candidate: twelve routes, eight protected route/host combinations, all 24 files
  in the tutorial asset directory, all 116 existing tutorial DOM IDs, and four new
  tutorial step IDs passed. Privacy, Trade and closed Ask main text matched the
  serving version exactly.
- Public HTTPS: sixteen route/domain checks passed on apex and `www`, including
  Sports, Motion, Tutorial, Privacy, Support, homepage, Trade and Ask. Canonicals
  were preserved, including the tutorial's exact `www` canonical. Context/footer
  links and the four new tutorial hashes are present. All 27 observed public
  original-image/brand URLs matched committed bytes.
- Live browser: Sports, Motion and Tutorial at 390, 768 and 1440 pixels showed no
  horizontal overflow, broken loaded images or console errors. The new release
  status is visible. Tutorial deep links and module changes focus their targets
  and bring them into view. The desktop Motion preview is retained privately.
- All thirteen other discovered virtual-host responses matched their pre-release
  baselines, including one pre-existing 502 and two intentional 410 responses.
  Nginx, Investment, Ask and inactive gunicorn identities were unchanged; all 55
  recorded configuration fingerprints matched. Builder HQ identity also remained
  unchanged. No receiver, authority, database, OS, DNS, TLS or service definition
  was changed.
- After public checks the website remained active, clean and healthy, with
  6,883,069,952 bytes free and 364 MiB available memory at the sampled check.

Detailed private receipts remain under
`/var/lib/asymmetri-motion-release-20261021/`; the verified builder workspace is
`/var/tmp/asymmetri-motion-v12-20261021`. For website rollback, stop only the website,
preserve the current directory, restore the complete `ff3c5f1` directory to the
live path, restart, and repeat protected/public health checks. Do not restore
private data or configuration as part of this code rollback.
