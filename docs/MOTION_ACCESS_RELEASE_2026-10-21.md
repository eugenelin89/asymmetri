# Motion TestFlight access website release — October 21, 2026

The owner explicitly requested deployment after the access-link implementation.
The existing DigitalOcean website was activated at 21:34:54 UTC / 14:34:54 Vancouver.
`https://asymmetri.co/motion/try` and its `www` equivalent now return HTTP 307 to
the published Google Form. Two Motion actions, one Sports action and the October
21 privacy disclosure are live. This collects requests; it does not issue
TestFlight invitations or establish external beta availability.

## Release identity

| Item | Verified value |
| --- | --- |
| Deployed source | `c4cefd9d0cfea154c7dc0fc3064c982c866049bc` |
| Access implementation | `db53ada9eaad1beeefb7609d1181588d8b3459f6` |
| Next.js build | `W4Yg_XIBAR3DSU1bd-kJJ` |
| Build artifact SHA-256 | `210e21bd05e396f4c7e94da17aae274d640fc4ad40a1e56a2738d4259ef7e70b` |
| Build artifact bytes | `1575665` |
| Production Node | `22.23.1` |
| Website PID at acceptance | `2496785` |
| Service start | `2026-10-21 21:34:53 UTC` |
| Complete rollback | `/var/www/asymmetri-rollback-20261021-88ba5ab` |
| Rollback source | `88ba5ab9a8ffc18143b4f7fe2ede42a83ceefae3` |
| Rollback build | `eEsB8N3JHETEB_dDr1C7y` |

Production is clean `main` at the compiled source. Later receipt and journal
commits record acceptance and need no new build or restart. Implementation and
local checks are in [Prompt 108](prompts/108-content.md).

## Preparation, build and activation

Local `main` was clean and fast-forward synchronization succeeded. Production was
clean and healthy at the selected-video release `88ba5ab`. Only the access change
and its journal were incoming. Packages, lockfile, public assets, operating system,
runtime, infrastructure and receiver configuration were unchanged.

This uses the owner's standing Node 22 approval and documented retained-host
exception. Ubuntu 22.10 remains the existing host; this release does not resolve
its unsupported status. Scope, compatible Linux runtime, resource capacity,
least-privilege operation, recovery and preservation were reviewed for this
website-only activation. No OS upgrade, receiver change or authority activation
is included.

The reserved Linux builder ran as its staging application owner with the exact
production Node executable and matching native compiler. Node SHA-256 was
`93956de2e59480474a7b46571da1651180b1a050cdf32641ebec4ce6e478e068`; native compiler
SHA-256 matched production at
`89fbdf990c4f0fdcf95c56463a026bbbc405e0b0970e6a0d8d12d50b773d97cd`.
Unchanged dependencies were copied independently. No installation, shared-file
mutation or compiler operation ran in the live website tree.

Linux `npm run check` and `npm run build:next -- --webpack` passed using the proven
384 MiB heap cap. The existing tutorial navigation lint warning and Browserslist
data-age notice remain. Builder supervision retained the 384 MiB memory / 6 GiB
disk floors; minimum available memory was 1,045,476 KiB and minimum free disk
6,885,310,464 bytes. Peer services did not change.

All 455 committed source hashes matched after building and in the production
candidate. Build artifact hashes matched on builder, Mac and production. Only
verified `.next` output, excluding disposable cache, was transferred. The
application-owned production candidate used independent Git, source, dependencies
and build files, as required for redirect changes.

| Production guard phase | Minimum available memory, KiB | Minimum free disk, bytes |
| --- | ---: | ---: |
| Candidate preparation | 401560 | 6918828032 |
| Artifact extraction | 406200 | 6815481856 |
| Candidate loopback smoke | 311192 | 6805123072 |

All exceeded the unchanged 192 MiB / 6 GiB production floors. The temporary
candidate ran as the application owner with the existing website environment on
loopback port 3107, then stopped after smoke checks. Activation stopped only
`asymmetri.service`, retained the complete old directory and renamed the verified
candidate into place. The new process was ready in 251 ms, remained active and
had zero automatic restarts. Exit 143 belongs to the deliberate stop of the old
process. No rollback was needed.

## Verified archive retention

Initial free disk was about 6.745 GB, insufficient to copy dependencies while
maintaining the 6 GiB floor. One older inactive rollback was preserved in durable
private owner storage using the documented streaming archival procedure before
retiring only its duplicate server directory. The current release and recent
complete rollbacks stayed intact.

| Archive item | Verified value |
| --- | --- |
| Original directory | `/var/www/asymmetri-rollback-20261013-d0c4543` |
| Source | `d0c454314d646b74895f4d9e3e4a014c63c666a6` |
| Build | `P7LP4PKXMUyZ96RJnAgcz` |
| Archive | `asymmetri-rollback-20261013-d0c4543.tar.gz` |
| Bytes | `323840000` |
| SHA-256 | `351238e264b237c7bf365d7bdb68a18cfa0c2eb50ac2b55b63a68e42f6e6c5b7` |

The full archive retains Git, dependencies, assets, build output, ownership,
modes, links, timestamps, ACLs and extended attributes. Local sync, gzip integrity,
streaming server/local size and hash equality, and full GNU tar content/metadata
comparison passed before retirement. The application owner retired the verified
duplicate contents and the administrator removed the empty directory.

The archive and private receipt are under `../deployment-retention/2026-10-21/`
relative to this checkout, outside Git. Verify the hash before restoring into an
empty application-owned staging location. This historical pre-Trade build is not
the immediate rollback for the present website. Retention is not a full-system
backup or new independent disaster-recovery certification.

## Acceptance and recovery

- Candidate: twelve routes, eight protected route/host combinations, both 307
  destinations, three CTA placements, policy date and all 24 tutorial assets
  passed. All 124 previous tutorial DOM IDs remained. Tutorial, Support, Trade
  and closed Ask main content matched the serving predecessor.
- Public HTTPS: eighteen route/domain checks and 27 public asset byte comparisons
  passed. Both clean access URLs return the exact public Google Form with 307.
  Six legacy Sport/Work/Investment redirect checks retain 308 on both domains.
  Canonicals, footer/context links and the exact tutorial `www` canonical remain.
- Live browser: Motion and Sports at mobile, tablet and desktop sizes had no
  horizontal overflow, broken loaded images or website console errors. Actual
  CSS widths were checked because the existing per-site browser zoom affects
  viewport requests. Keyboard focus and the privacy disclosure were inspected.
  Following the live CTA reached the published form; no response was submitted.
  Initial Motion HTML contains no iframe; the optional video is still deliberate.
- All thirteen other virtual-host response baselines and all 55 configuration
  fingerprints were unchanged. Nginx, Investment, Ask and inactive gunicorn
  identities were preserved. No OS, DNS, TLS, service definition, private data,
  Google sharing permission, app distribution or outreach setting changed.
- Final source/build identity, clean working tree and `django-user` ownership
  passed. The final sample had 6,804,856,832 bytes free and 345,716 KiB available
  memory. The bounded service log showed successful startup without a new error.
- The disposable builder was removed after retaining source/build receipts and
  artifact checks; its free disk returned to 8,471,130,112 bytes. Browser viewport
  overrides were reset and the live page remains available for review.

Private scripts and receipts remain at
`/var/lib/asymmetri-access-release-20261021/`; local evidence is outside Git.
For an emergency code rollback, stop only the website, preserve the failed current
directory, restore the complete `88ba5ab` directory to `/var/www/asymmetri`, restart
and repeat protected/public checks. The prior website predates `/motion/try`;
the published form itself remains independent. Do not roll back private responses,
receiver state or configuration with website code.
