# INV-03 — Artifact and discussion archive operations

This milestone adds exact artifact versions, discussion views and owner controls to
contract 1.0. It authorizes a private compatibility installation on the existing
Ubuntu 22.10 host. It does not authorize a website release, public ingress, real
publisher, market collector, paper-trading activation or Ask. [Validation](INV-03-VALIDATION.md)
records actual results; [ingress](INV-03-INGRESS.md) separates loopback acceptance
from shared-port activation.

## Implementation boundary

`receiver/` remains a separate Node 22/24 process with SQLite and private CAS.
Migration 001 is unchanged. Additive 002 adds registry states, exact artifact rights
approvals, correction releases, immutable owner audit, read holds, future-event
suppressions and global denied-content hashes. No grant or publisher is created.
The pinned BotSquad contract commit/manifest remains unchanged.

Registered, awaiting_publication, published, failed, withheld, superseded and
withdrawn are represented. Registry entries remain accounted for when details are
hidden, using safe generic titles. Immutable historical versions are available by
exact identity; dependent evidence never silently advances to a corrected version.
Worker, owner and system contributions retain distinct actors. Topic order,
reply-to links, evidence/challenges, synthesis, dissent, unresolved issues and
closure persist; closed topics reject later contributions or a second closure.

Uploads validate strict UTF-8, format/size, JSON structure, CSV cells and normalized
RGBA8 PNG dimensions/chunks/inflation. Trailing compressed PNG payload is rejected.
The original verified bytes retain their actual hash. HTML, SVG, archives, office
files and PDF are unsupported. Markdown is escaped React text with a small heading/
HTTPS-link subset; no raw HTML or remote images execute. Text/Markdown/JSON/CSV are
at most 128 KiB; PNG at most 4 MiB. Sources carry provenance, URLs, retrieval/publication
times, rights and limitations. A valid signature never grants source-use rights.
Observed-paper artifact metadata requires both approved run configuration and an
exact locally approved metadata hash. Decision 029 remains US$0; real source selection
and automation/derived-publication rights belong to INV-06.

## Human pages and private configuration

The new server pages are under `/botsquad/investment`, including
`/artifacts/{artifactId}/versions/{version}`, `/discussions/{discussionId}` and
`/records/{kind}/{recordId}/versions/{version}`. They retain company header/footer,
BotSquad navigation, exact evidence links and separate discussion pagination.
They are dynamic, noindex and default to no published experiment. No full INV-04
dashboard or working Ask is added. No public assets or dependencies are added.

Only trusted server environment may set `ASYMMETRI_INVESTMENT_READ_ORIGIN` to an
HTTP 127.0.0.1 origin, plus `ASYMMETRI_INVESTMENT_EXPERIMENT` and
`ASYMMETRI_INVESTMENT_RUN`. The receiver's configured authority must match that
origin's host/port. Local fixture previews additionally set
`ASYMMETRI_INVESTMENT_EVIDENCE_MODE=synthetic_fixture`, preserving the banner even
on unavailable/withdrawn/invalid pages. This flag cannot relabel a fixture as real.
Leave these unset in production until separately authorized. There is no browser
credential, SQLite import, arbitrary URL fetcher or remote image fetch.

The local `/content` handler rechecks exact metadata, bounds bytes, verifies SHA256,
then rechecks visibility. Artifact HTML rechecks metadata after byte/reference
reads. Responses use no-store, nosniff, safe generated download filenames and a
restrictive content policy. Previously transferred bytes cannot be recalled.

## Owner-only controls

Run local CLI commands through the dedicated application identity and explicit
`ASYMMETRI_RECEIVER_CONFIG`, following the [installed service runbook](INFRA-02-RECEIVER-DEPLOYMENT.md).
There is no public administration endpoint and publisher scopes cannot withdraw,
approve rights or release corrections.

| Command arguments | Effect |
| --- | --- |
| `withdraw EXPERIMENT RUN EVENT withheld\|withdrawn` | Immutable control; invalidate visibility epoch/cursors; suppress dependents and known byte aliases |
| `registry-state EXPERIMENT RUN ARTIFACT STATE` | Account for nonpublication states; withdrawn is terminal |
| `approve-artifact EXPERIMENT RUN PRIVATE_METADATA_JSON` | Bind review to exact immutable metadata and version |
| `release-correction EXPERIMENT RUN EVENT` | Owner-reviewed replacement may cross only its own supersedes edge, never arbitrary evidence edges |
| `export-controls` | Protected current suppression snapshot; store its digest independently |
| `reconcile-controls PRIVATE_SNAPSHOT_JSON VERIFIED_SHA256` | After restore, reconcile current controls before read hold is released; publisher fencing remains |

Withdrawal does not delete bytes. It blocks new metadata under hidden registrations,
known denied hashes, and suppressed future events recovered from older backups.
Downloads recheck controls before headers and between 16 KiB chunks, with a 15-second
absolute deadline and revision-based revalidation. New reads never reuse cached
content. A specific incident may require deletion of prohibited bytes and affected
backup sets under owner-approved retention/legal requirements; preserve minimal
hash/control audit, never arbitrary mass deletion or an assumption of remote erasure.

## Consistent backup and recovery

1. Stop admission and the receiver; confirm process/listener absence and no live lock.
   `backup DESTINATION` obtains the same exclusive lock as serve/cleanup. It copies
   private CAS/staging, uses SQLite's backup API, verifies full integrity/FKs and all
   published content, captures disabled config, current controls, watermarks, migration
   checksums and runtime/lockfile fingerprints. Every regular file is SHA256-hashed;
   symlinks/hardlinks are rejected. Directory/file fsync completes before success.
2. Preserve the returned canonical manifest digest in a separate trusted recovery
   record. Copy the root-owned unit/config and exact source receipt alongside the
   encrypted backup; those host files are outside the receiver archive's authority.
3. Package the consistent directory with a local tar utility. `node
   deploy/encrypted-backup.mjs seal INPUT_TAR OUTPUT PRIVATE_KEY_FILE` streams
   AES256-GCM; the key file must be exactly 32 bytes and private. Keep keys separately.
   The matching `open` authenticates before a final filename is published. Both
   directions use exclusive private `.partial-` files, fsync and atomic no-overwrite
   publication. Interrupted partial files are never restore inputs; authentication
   failure removes them. The ciphertext ceiling is 1 GiB (plaintext at most that
   minus 36 bytes), checked before sealing; oversized backups fail explicitly.
   Never extract a partial or unauthenticated file.
4. `restore BACKUP_DIRECTORY NEW_DATA_DIRECTORY VERIFIED_MANIFEST_SHA256` verifies
   all hashes and schema, creates a durable `RESTORE_INCOMPLETE` marker, copies into
   a fresh 0700 directory, immediately fences authority, then performs full integrity/
   FK/content checks. Startup refuses an incomplete target. Success removes the marker
   only after fsync; config remains disabled, reads held and old keys revoked.
5. Supply the independently preserved **current** control snapshot, including controls
   newer than the backup. Unknown future targets remain suppressed during replay.
   Do not substitute an old backup's controls as proof that no later withdrawal exists.
   Reconcile before reads; rights approvals and reviewed correction releases are not
   restored as permission. Explicitly review them again.
6. Compare simulated/real HQ outbox watermarks and each uncertain batch's immutable
   digest/receipt. Existing batches return the original receipt; conflicting bytes fail.
   Missing batches require full validation and fresh finite authority. Any future new
   grant uses a fresh key ID and generation above both systems' history. Never rerun
   a financial action because a website receipt was lost. Real HQ integration is INV-07.

The CLI API assumes an owner-controlled private filesystem. Copying an active CAS
or bypassing the exclusive lock is not the documented backup procedure. Interrupted
or failed restores remain inactive for diagnosis; do not remove the marker merely
to start a service. Repeat a verified restore into a new directory.

## Proposed live-data retention and custody — not activated

| Decision | Ready-to-approve proposal |
| --- | --- |
| Frequency / RPO | Daily while publication is stopped briefly, plus before schema/release/control changes; 24h maximum ordinary data RPO |
| Withdrawal RPO | Export current controls after every owner visibility action; no restored reads without a current independently verified control ledger |
| RTO | Target 2h after host availability and key access; timed rehearsal required before claiming the target met |
| Encryption / key custody | AES256-GCM, fresh nonce per archive; separate password-manager/offline recovery-key custody; no keys in Git, task logs or backup media |
| Copies | Encrypted host-local staging, encrypted Mac copy, plus an owner-selected independent device/location; verify hashes/decryption at each destination |
| Retention | 7 daily, 4 weekly, 3 monthly successful sets; prune only after independent copy and restore check; incident/legal requirements may shorten prohibited-content retention |
| Restore cadence | Monthly synthetic drill; quarterly representative private restore after live approval; always after schema changes |
| Monitoring | Daily last-success/age/free-space check; notify owner on failure or age>26h; no schedule or notification channel activated here |
| Cost | US$0 incremental software/storage services using approved existing capacity; independent device availability/cost must be chosen by owner |

Current custody is **unverified**. A subsequent owner-approved Mac cleanup deleted
both historical INFRA-01 backup sets and their recovery records/keys; the temporary
cloud snapshot had already been deleted. The old retention statements are historical,
not evidence of recoverable copies now. This milestone's synthetic drills are not
production backups. No authorized independent destination was available, and no
new snapshot/subscription/schedule/upload was created. Durable production backup
custody and final retention choices remain explicit owner-action gates.

## Private-install rollback

Preserve root-owned previous receiver code, disabled configuration and the complete
empty schema 001 operational archive before compatibility installation. Check exact
source hashes and Node 22 native module loading, then migrate offline. End with
schema 002, empty authority/data, disabled configuration, absent marker, inactive/static
unit and no listener. Do not restart the website, Nginx, Django or PostgreSQL.

For this empty private installation only, a failed acceptance may restore the preserved
empty 001 archive and prior compatible code after verifying no data/grants were accepted.
Once history exists, do not downgrade SQLite or discard events: retain 002 and use a
compatible corrected release, or a validated fenced recovery. No public rollout is implied.
