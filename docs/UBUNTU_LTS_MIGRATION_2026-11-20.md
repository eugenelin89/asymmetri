# Ubuntu LTS and NGINX migration acceptance

The owner-authorized migration completed November 20, 2026 in Vancouver
(November 21 UTC). Production is online on Ubuntu 24.04.5 LTS, kernel
`6.8.0-149-generic`, with Ubuntu NGINX `1.24.0-2ubuntu7.21`. The original
Droplet, IPv4/IPv6 addresses and server plan remain unchanged.

This is a sanitized operational receipt. Private host inventories, provider
identifiers, configuration, archive manifests, checksums, logs and recovery keys
remain in the owner's restricted off-server backup directory, outside Git.

## Authorization and scope

The owner requested a supported LTS upgrade, patched NGINX, backups verified
before changes, and preservation of all websites. The owner approved up to US$5
for temporary snapshots and a rehearsal Droplet, conditional on removal after
migration; then explicitly approved the production cutover and permanent cloud
cleanup at their respective action times. The temporary resources are deleted.
Exact accrued charges were not independently reconciled against the invoice.

The owner chose to finish Ubuntu/NGINX first and deferred Next.js 16.4.6.
Application source, product behavior, publisher authority and Ask activation were
not changed. The October INFRA-01 cancellation remains a historical decision;
this work was separately authorized.

## Security result

Ubuntu's advisories for [CVE-2026-123007](https://ubuntu.com/security/CVE-2026-123007)
and [CVE-2026-123633](https://ubuntu.com/security/CVE-2026-123633) identify Noble
package `1.24.0-2ubuntu7.20` as fixed. Installed revision `.21` supersedes it;
the package changelog includes both fixes. The running master executable was
hashed against the installed patched executable after startup and again after
cleanup. Configuration validation passes. Existing HTTP/2-disabled configuration
was preserved. Upstream `nginx -v` alone does not identify Ubuntu backports.

The preceding Java assessment found no installed/bundled Java runtime or loaded
JVM and no required AVX-512 CPU capability. No Java application patch was needed.
This migration is not a forensic compromise assessment or a claim that every
application dependency is current.

## Backups, rehearsal and cutover

The retained recovery set uses authenticated age encryption. Verification covered
ciphertext hashes, authenticated decryption, source stream hashes where captured,
gzip integrity and complete archive membership. The inventory-only export has
authenticated decryption but no independent source-stream hash.

| Retained recovery component | Verification and purpose |
| --- | --- |
| Original full filesystem export, about 9.76 GB encrypted | 356,696 members; complete authenticated archive verification; Linux restoration used for rehearsal. Virtual filesystems, runtime mounts and swap excluded; EFI captured separately. |
| Final frozen application/configuration checkpoint, about 2.23 GB encrypted | Writers stopped before export; 66,359 members; actual isolated Linux restore, per-file content, ownership, mode and link checks before production rebuild; restored state checked again on production. |
| Initial live-state and consistent SQLite exports | Actual restoration, SQLite integrity and application foreign-key checks; an existing system package-cache foreign-key issue was classified separately from application data. |
| Dormant PostgreSQL logical export | Original cold cluster restored in an isolated PostgreSQL 14 environment; seven databases dumped using a private Unix socket without TCP; dump, decryption and hash verified. Original dormant files retained. |
| LTS recovery supplement, about 126 MB encrypted | New OS configuration, boot/EFI files, package metadata, administrative helpers, Python environment and four new consistent database copies; 14,663 members verified. This is a configuration supplement, not a full post-migration disk image. |

The temporary Ubuntu 24.04 rehearsal server restored the existing applications,
data and retained rollback material. Original normal application IDs were
preserved; three service identities were remapped to avoid LTS system-account
collisions. Django's Python 3.12 environment used the existing package pins and
passed application checks and the unapplied-migration check. The existing Node
22.23.1 runtime and exact application dependencies/build were retained.

Rehearsal included a normal reboot, website acceptance, independent rollback
startup and the provider recovery ISO with a read-only disk mount, followed by
normal disk boot. The prepared image preserved original SSH host keys and
administrator/deployment access while allowing fresh provider networking.

At the approved cutover, writers stopped at 01:05:04 UTC. The final checkpoint
was captured, verified and actually restored on rehearsal before rebuilding the
original Droplet. The final fresh state was then transferred directly to
production and verified before reopening the original firewall and maintenance
timers. No new application source release was activated.

## Acceptance

- All 132 public HTTP(S) cases across 15 configured hostnames matched accepted
  behavior after reopening and again after final cleanup. Protected Motion pages
  on apex and `www`, redirects, tutorial canonical and assets were preserved.
- All 1,564 inventoried static assets across 11 trees matched original bytes.
  Sixty non-200 response bodies differed only in the NGINX version footer;
  explicit normalization confirmed equivalent content. Existing retired 410
  responses and legacy draft 502 responses were preserved, not newly introduced.
- A forced IPv6 probe matched all 102 cases belonging to IPv6-capable virtual
  hosts. Five legacy IPv4-only virtual hosts had no AAAA records and no IPv6
  listeners in their original configuration; forced IPv6 was not an acceptance
  claim for those hosts. Their normal public DNS checks passed.
- All six application/proxy services and provider monitoring agents are active.
  Certificate renewal and analytics-pruning timers are active. All seven
  certificate dry-run renewals, including deploy hooks, succeeded.
- Administrator sudo, deployment confinement (`NoNewPrivs: 1`), original host
  keys and root authorized-key content were verified. Temporary transfer access
  and listeners were removed. The monitoring unit is root-owned.
- Serving source remains `bf1b35ef629b585b63b059d37990b6bc7d871e1e`, build
  `WLdvYhQk6e_xmMSuHhT2Z`. The complete immediate rollback remains source
  `a2080a4`, build `sJUaqd9JvJTL_VHz-vUbr`; six routes passed an independent
  private-port startup, then the proof process was stopped.

These checks establish the tested routes, assets and operational behavior, not
exhaustive authenticated or interactive journeys for every peer application.
Investment and Ask retain their existing static/manual-start unit policy; after
a planned reboot, explicitly start and health-check them without changing their
intake or publisher authority.

## Cleanup and retained recovery

The rehearsal Droplet and both temporary migration snapshots were permanently
deleted after the owner's explicit confirmation. The provider UI showed only
the original production Droplet and no Droplet snapshots. Screenshots remain
with the private receipts. Deletion stops further charges for those resources;
the original production plan remains.

Production cleanup removed only reviewed inactive restore scratch, duplicate
migration configurations and temporary manifests. Filesystem available space
increased from 3,691,327,488 to 6,935,691,264 bytes: a measured gain of
3,244,363,776 bytes. A later small recovery-metadata cleanup gained 2,744,320
bytes; final available space was 6,938,390,528 bytes. Services, patched binary,
serving/rollback build identities and public behavior were checked afterward.

Final Mac cleanup removed task-created inactive `node_modules` and `.next`, two
plaintext SQLite restore-test copies, failed tiny exports and redundant temporary
PostgreSQL recovery tools. Available space increased from 44,018,110,464 to
45,390,114,816 bytes: a measured gain of 1,372,004,352 bytes. Earlier verified
download-chunk cleanup measured a separate gain of 11,809,628,160 bytes. These
are separate filesystem observations, not an exact attribution of all concurrent
APFS activity. Private receipts distinguish `du` sizes from available-space gains.

All accepted encrypted archives, recovery keys and receipts remain with the
owner. Production retains its serving runtime, complete immediate rollback,
older retained archives/runtimes, persistent data, configuration and historical
logs. Those protected items were not candidates for retirement under this task;
there are no unresolved disposable cleanup candidates requiring a new retention
decision. These are point-in-time backups, not a newly configured recurring
backup service. Preserve their keys and matching manifests together for recovery.

## Local verification and follow-up

Local dependency installation under the documented Node 24/npm 11 environment
and `npm run check` passed, with one existing lint warning. Prebuild game/campus
tests passed. Default Turbopack stalled and was stopped; the Webpack build
compiled/prerendered but exited nonzero at the existing Next.js security guard.
The production dependency audit reported one moderate Next.js advisory, no high
or critical findings. The requested 16.4.6 patch was deferred; a complete local
build command is therefore **not recorded as passing**. No generated candidate
was deployed. Finish that application update as separate authorized work.

The remaining tracked changes are operational documentation only; whitespace,
local links and private-information checks apply without rebuilding the unchanged
application. Future recovery must use the matching age archive tools in the
private recovery set. The historical `ops/infra/restore_archive.py` CBC helper
does not read these new archives.
