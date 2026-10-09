# INFRA-02 — Private investment receiver installation

Owner-selected scope, October 9, 2026: install the accepted INV-02 receiver on the
existing Ubuntu 22.10 Droplet and validate with disposable synthetic data. Public
publishing and real HQ traffic remain disabled. See [acceptance](INFRA-02-VALIDATION.md)
for measured results and the distinction between installation and activation.

## Source and independent installation

Receiver runtime source: `a38696e9efb4d55dff1835d4dbb674454332170d`, whose entire
`receiver/` subtree is identical to accepted INV-02 implementation
`457f9354b3f8daf5c4c75b8f5ac1946433da3ce0`. The hardened installed systemd unit is
tracked separately in this INFRA-02 change and identified by its file hash in the
acceptance record. Acceptance utilities are test tooling, not runtime features.
The live Next.js checkout/build/dependencies are an independent release and were
not synchronized with current main for this installation.

Contract 1.0 remains the exact nine-file package from BotSquad
`ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755`; manifest SHA-256
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
No migration or canonical contract was changed. The receiver lockfile pins
better-sqlite3 13.0.3 (SQLite 3.53.4), AJV 8.20.0, ajv-formats 3.0.1,
canonicalize 2.1.0 and jsonc-parser 3.3.1. Runtime installation uses
`npm ci --omit=dev --ignore-scripts`, separately from website dependencies.

| Item | Installed boundary |
| --- | --- |
| Code | `/opt/asymmetri-receiver/receiver`, root owned, receiver group; directories 0750/files 0640 |
| Source receipt | `/opt/asymmetri-receiver/SOURCE_COMMIT` |
| Runtime | Existing `/usr/bin/node` 22.23.1 x64; npm 10.9.8; no global package/library changes |
| Identity | `asymmetri-investment`, dedicated system user/group, no login/home or supplemental application groups |
| Configuration | `/etc/asymmetri-investment/config.json`, root:receiver 0640; directory 0750 |
| Data | `/var/lib/asymmetri-investment`, receiver owned 0700; SQLite/files 0600 |
| Unit | `/etc/systemd/system/asymmetri-investment.service` |
| Address when explicitly started | `127.0.0.1:3101`, authority `127.0.0.1:3101` |
| Schema | Migration 001; repeatable initialization, zero operational authority/data |

## Default stopped state and confinement

The installed unit has **no `[Install]` section**, so `systemctl is-enabled`
reports `static`, not the literal word `disabled`. There are no enablement links or
activation dependencies. `enabled:false` in configuration and an absent
`/etc/asymmetri-investment/explicitly-enabled` marker independently prevent startup.
Installed does not mean privately running, publicly reachable or accepting real
publisher traffic. Do not create a marker or grant from these instructions alone.

The [template](../receiver/deploy/asymmetri-investment.service.example) preserves
NoNewPrivileges, PrivateTmp/PrivateDevices, ProtectSystem=strict, ProtectHome,
loopback-only address-family/IP rules, 256 MiB memory, 128 MiB V8 heap, 50% CPU and
32 tasks. INFRA-02 adds empty capability sets, 64 MiB maximum receiver swap,
kernel/control-group restrictions, no namespace creation/set-ID/realtime changes,
and a three-attempt/60-second restart limit.

`ProtectSystem` alone prevents writes but not private reads. Empty read-only
mounts hide `/var`, `/run`, `/opt` and `/srv`; only the root-owned receiver tree
and its own writable archive are bound back. Home directories, unrelated site
roots/backups/PG state/sockets and Nginx/TLS/SSH/private-key configuration are
unreadable. Probe evidence verifies these rules inside an identically confined
unit, zero process capabilities, loopback operation, and denied non-loopback TCP
with an independently successful unconfined control. This is actual host evidence,
not an inference from `systemd-analyze security` alone.

## Administration and explicit maintenance

Use the established `ssh webadmin` administrator route for receiver ownership and
unit operations. Its sudo policy runs root commands; to execute offline application
commands as the receiver user, use `sudo -n runuser -u asymmetri-investment -- ...`.
The existing `ssh asymmetri` helper remains specific to the website and is not a
receiver deployment helper. Do not run receiver npm as root or as `django-user`.

For an authorized offline diagnostic, after verifying the receiver is stopped:

```sh
sudo -n runuser -u asymmetri-investment -- env \
  ASYMMETRI_RECEIVER_CONFIG=/etc/asymmetri-investment/config.json \
  /usr/bin/node /opt/asymmetri-receiver/receiver/dist/src/cli.js diagnostics
```

`migrate`, `cleanup` and `restore-fence` use that same explicit configuration and
an exclusive lock. Prefer a temporary oneshot unit derived from the installed
protection profile for maintenance; remove only its marker condition, change the
command and set `Restart=no`. Do not broaden the production unit to run a test.
Diagnostics opens SQLite and is an operator action, not a public HTTP endpoint.

Graceful stop releases the CLI lock and closes SQLite. SIGKILL leaves
`receiver.lock`; automatic retry intentionally fails closed. Stop the unit first,
read the recorded PID, verify it no longer exists and that no archive process is
running, preserve diagnostics, then remove **only that verified stale lock**.
Run integrity/foreign-key checks before an explicit restart. Never erase a live
lock, database or accepted receipt to make a failed process start.

## Nginx evidence and activation gate

No production Nginx server block, TLS setup, firewall, DNS or address was modified.
The tested proxy was a separate non-root process on loopback using its own config,
PID and temporary paths. It was stopped after validation.

The installed nginx 1.22 HTTP proxy **failed** the strict duplicate-header profile:
it normalizes duplicate `Connection` headers before upstream verification. All
other tested signed-header/authority/body/idempotency cases passed, but this HTTP
profile is **not accepted for real or public traffic**. Do not remove the failing
assertion or treat ordinary HTTP forwarding as equivalent to raw-header preservation.

The already-installed stream module passed raw-byte-preserving local transport
acceptance. It forwards the original method, authority, path, headers and body to
the receiver without HTTP normalization; receiver rejection and size limits remain
authoritative. A bounded proxy idle timeout closes incomplete requests. This proves
private Linux/Nginx transport, **not production HTTP/TLS ingress**. Before activation,
review an exact ingress design that preserves or rejects ambiguous original requests,
then repeat real TLS/signature/framing tests without weakening the contract.

## Consistent receiver backup and restore

No paid snapshot or backup subscription was created. Historical encrypted recovery
archives remain preserved; they do not contain this new receiver. No recurring
receiver backup policy has been activated. Review retention, independent custody,
encryption, recovery-point/time objectives and an actual schedule before live data.

For an explicitly authorized receiver backup:

1. Stop new publisher admission and the receiver/proxy; verify no listener/process
   or live lock remains. Keep operational configuration separately protected.
2. Checkpoint and close SQLite through the matching code. Copy the **complete**
   private data tree, including any WAL/SHM and CAS, with ownership/modes. Never copy
   an active main database file alone. Use the SQLite backup API only with an
   explicitly coordinated consistent CAS snapshot and write-admission boundary.
3. Record source/unit/lockfile/schema hashes, all regular-file hashes, source/journal
   watermarks, restore/visibility epochs and last accepted receipts. Protect this
   manifest and backup outside the public root and checkout.
4. Restore into a new 0700 directory with disabled config, verify every file hash,
   migration 001 checksum, full SQLite integrity/FKs and all referenced CAS content
   hash/type/size. Validate the restored copy, not merely the source backup.
5. Run `restore-fence`: disable publisher scopes, revoke old key IDs, increment
   generations, clear rights approvals and reset cursor epoch. Reconcile newer
   withdrawal/withholding controls before exposing any reads. Old authority must
   stay denied; any future reauthorization needs a new key ID/key and a generation
   above all receiver/HQ history, plus explicit owner authority.
6. Reconcile exact durable receipts/outbox uncertainty. A transport retry may recover
   the original receipt; it must never create a second financial effect or cause HQ
   to rerun a trade. Preserve event/receipt history and control audit.

Tests cover complete stopped-directory copying, hash equality, restored CAS,
withdrawals and newer withholding, alongside the existing backup/restore signature,
receipt/cursor fence and real process-kill cases. They do not establish hardware
power-loss behavior, offsite disaster recovery or an adopted production retention policy.

## Receiver-only rollback

Stop the receiver and any task-owned proxy, verify listener absence, and preserve
failure evidence plus the entire SQLite/CAS history. Restore only the last compatible
receiver code and validated disabled configuration; verify schema/hash/integrity
before any separately authorized restart. For this first installation the safe
fallback is the installed, stopped and unactivated service. Removing installation
files is unnecessary. Never swap/restart the main website, restore an entire host,
drop financial history, delete retained backups or change Ubuntu for a receiver failure.

## Unsupported OS and remaining scope

Decision 030 on [BotSquad PR35](https://github.com/eugenelin89/bot_messenger/pull/35)
was reviewed before mutation. Ubuntu 22.10 has had no normal security updates since
[July 20, 2023](https://lists.ubuntu.com/archives/ubuntu-announce/2023-July/000293.html).
The owner authorizes this private installation under the existing exception.
Confinement reduces exposure but cannot repair vulnerabilities in the shared kernel,
OS or installed nginx. A future Ubuntu project remains independent; INFRA-01 stays
cancelled. Re-review the exception before later deployment/new public exposure.

Public activation still needs accepted HTTP/TLS ingress, sustained representative
archive sizing, approved backup/retention and custody, finite current publisher
scope/key lifecycle, real HQ reconciliation, market-source/redistribution rights
under Decision 029's US$0 limit, completed feature gates and explicit owner activation.
No INV-03, Ask, market-data collection, real investment run or HQ publisher started.
