# Prompt 098: Renew the Trade receiver publication key

- Date: 2026-10-15 (America/Vancouver; activation occurred October 16 UTC)
- Scope: deployment
- Goal: Preserve the existing publication channel through the approved October 16 expiry with a verified backup and unchanged history.

## Original user request

> Approve receiver backup, interruption and renewal

The owner supplied this explicit structured reply to the question approving a
brief interruption of the Asymmetri.co Trade receiver, a consistent backup, and
renewal of its existing publication permission and signing key through October 16
at 4:40 p.m. Vancouver time. The preceding automatic approval review had rejected
the earlier broad authorization; that attempted operation executed no production
change. The explicit reply was verified directly in the coordinating chat before
retrying. The coordinator then confirmed a fresh supported publisher pause with
no pending or uncertain deliveries while HQ remained running.

## Scope

The existing receiver's finite publication authority, backup, verification and
operational documentation. Preserve the publisher, experiment, run, generation,
allowlist, limits, existing key interval, records and receipts. HQ owns its private
key, channel rotation, renewed consent and restart verification. No website build,
Ask authority, portfolio action, data category or dependency change is included.

## Decisions

The installed receiver forbids changing an existing key ID's validity interval.
Use its existing authorize command with a fresh Ed25519 public verification key
and the same generation, changing only scope key ID and expiry. Retain the old
key row and expiry. Pause and drain before updating the shared scope because
requests authenticated under its earlier value fail their final recheck.

The original key had expired before explicit approval arrived. HQ therefore
remained running with publication paused, allowing its owner to rotate the live
channel before attempting startup reconciliation under the replacement key.
No private signing material crossed to the receiver or repository.

## Implementation

Validated the preserved authorization file against the pinned schema and public
key fingerprint. Stopped only the receiver, took the installed CLI's consistent
backup, verified every backup file hash and confirmed backup did not change the
live logical database. Registered the replacement key and scope, checked every
protected table, and restarted only the receiver at 05:22:18 UTC.

Verified the backup by restoring it into a separate disabled directory with all
restored publishers disabled and keys revoked. The live receiver was untouched by
that restore. Retained private operational receipts outside Git and the web root.

## Engineering impact

Publication authority now expires October 16 at 23:40 UTC, generation 1. The
receiver gained one key and one authority audit entry; the shared scope and
archive revision changed as expected. All other 31 tables were unchanged. No
financial history, source sequence, visibility epoch, official run or quota reset
occurred. This is a verified host-local backup, not an off-server custody claim.

## Files changed

Receiver operations guidance and the integration/release handoff document.
Private backup, registration and validation receipts are operational artifacts
outside the repository; no key material is committed.

## Documentation updated

INVESTMENT_RECEIVER describes normal renewal, overlapping keys, interval checks,
the scope-change race and the distinction from fenced restore recovery.
INV-REAL-01-WEBSITE records the current receiver renewal, preserved history and
backup verification while retaining the initial October 13 activation as history.

## Git diff summary

Two implementation documentation files changed: 73 insertions and one deletion.
The change adds renewal guidance and evidence without changing runtime code.

## Verification

- Authorization schema, safe-integer interval and Ed25519 SPKI fingerprint pass.
  Only the scope key ID and expiry differ from the original scope.
- Disposable HTTP test used auth/database code hashes matching production:
  fresh old-key receipt GET and final recheck pass after same-generation rotation;
  new-key GET returns the identical receipt; old key is rejected at its original
  expiry while the new key remains valid. Pre-update in-flight auth is rejected.
- Consistent backup manifest digest:
  `ba1c42fe407f913fbe6c356ba4c35958f4abee4cca5da44f40b580cbe34e4ddd`.
  Three file hashes pass. Isolated restore passes full SQLite integrity and
  foreign-key checks, retains 17 events and 17 receipts, and remains fenced.
- All 31 protected tables match, including 17 events, 17 batches, one financial
  journal row, nonces and quotas. The old key row remains byte-for-byte identical.
- Receiver diagnostics pass. Website, Ask and Nginx service identities remain
  unchanged; only the receiver restarts.
- Public Trade status/events return HTTP 200, source sequence 1–17 with no gaps,
  and the unchanged HOLD revision-2 hash and receipt. Freshness remains distinct
  from this authority renewal.
- Receiver independently confirms the new-key heartbeat accepted at 05:24:29 UTC
  and new-key nonce records. At 05:26:45, history and authority still match the
  post-renewal snapshot. HQ separately reports live rotation, renewed consent and
  a clean restart at 05:24:52 using the new key/current grant for the old receipt
  anchor, without new model or market calls.
- git diff --check passes. No application build was required because runtime
  source, dependencies and website assets did not change.

## Repository state after implementation commit

Main at 56640c6b3d2cd21da8e8780c74863cc6f6050101, with implementation files clean
and this journal untracked; two implementation commits ahead of origin/main.
Commit this journal separately, then push the implementation and archive commits.

## Implementation commits

- d5ef668e7820e542c0979e09e82d27598f02e3cc — Document approved Trade receiver key renewal
- 56640c6b3d2cd21da8e8780c74863cc6f6050101 — Record verified HQ acceptance of the renewed publication key

## Archive commit

Record Trade receiver renewal engineering journal

## Lessons learned

Keep finite channel, grant and verification-key expiry aligned with the intended
session. An ordinary key rotation must retain receipts and old-key intervals;
scope expiry renewal does not justify resetting history or broadening permissions.
After an approval delay, refresh the drain signal and account for expired keys
before any restart. Treat a rejected action as unexecuted until read-back proves
otherwise, and verify explicit authorization before retrying it.

## Follow-up ideas

HQ reports its new-key heartbeat, current consent and clean restart complete;
the receiver independently confirms the matching heartbeat. No recurring renewal,
automatic authority extension or Ask activation is created.
