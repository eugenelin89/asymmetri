# ASK-01 private receiver boundary

October 13, 2026. Private source implementation and synthetic acceptance only.
The public `/botsquad/ask` page still accepts no questions. There is no production
Ask database, service, visitor intake, employee authorization, or model execution.
Owner authorization covers implementation and verified deployment; the producer's
account-401 hold and strict shared-apex ingress requirement remain effective.

## Ownership and contract

BotSquad HQ owns employee eligibility, route selection, model/research execution,
real execution provenance, accounting, provider uncertainty and its durable privacy
journal. This repository owns browser sessions, private admission, claims, answer
receipts, privacy controls and private response delivery. Website rate caps do not
substitute for HQ token, cost, deadline or duty-cycle enforcement. No website code
executes a model, buys credits, fetches visitor URLs, or creates publication grants.

The nine canonical v1 files remain byte-identical to manifest
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
The implementation serves their `/api/ask/v1/` routes through a separate HTTP
listener and SQLite database. It never opens the public archive database. It reads
public evidence only through an explicitly configured loopback HTTP adapter.
Public archive backup cannot contain the Ask directory: configuration rejects
identical or nested directories in either direction, including symlink aliases.

## Private lifecycle

- Session secrets use 256 random bits and a Secure, HttpOnly, SameSite=Strict,
  `__Host-` cookie. Only its hash is stored. Mutations require exact HTTPS Origin,
  current session ownership and CSRF. Reads also require same-origin context.
  Session/question/conversation IDs and idempotency keys are not credentials.
  Lost initial cookies are not recoverable by replaying a creation ID.
- Questions have an immutable whole-object canonical hash. Byte-identical retries
  cannot create another question or consume the one-outstanding-question allowance.
  A conversation has at most eight completed turns, including the current one;
  follow-ups bind the latest owned answer and at most seven prior turn IDs.
- Only dedicated Ed25519 Ask service keys are accepted. Investment publisher keys
  cannot authorize Ask. Permissions, key/scope expiry, generation, nonce and exact
  signature are checked before idempotency and again after asynchronous evidence
  checks. Signature epochs are integer seconds; semantic timestamps retain
  millisecond precision.
- A consumer generation lasts at most 24 hours from first authorization. Keys and
  scopes cannot extend that window. Advance the generation explicitly before it
  expires, after HQ reconciliation; never automatically grant authority. Advancing
  retires old keys and transport caches. A new key cannot revive a retired key ID.
- Claims have at most 90-second leases, further bounded by question, raw-retention,
  key and scope expiry. Expired cached leases cannot replay after renewal. Lease
  expiry never resets an uncertain provider outcome or authorizes a second model
  execution. HQ must enforce its own durable request/execution identity.
- Answer identity is the immutable canonical answer, separate from the delivery
  wrapper. A duplicate wrapper or new delivery request returns the same receipt;
  changed content conflicts. Minimal signed receipt lookup survives body purge.
  Cancel/delete/expiry wins over late delivery and produces a body-free receipt.
- Privacy sync pages contain at most 100 controls. Acknowledgments must name
  controls actually delivered to the current generation. Only an empty final page
  with every current control acknowledged creates a freshness barrier. A new
  control invalidates the barrier. Available/admission also requires a current
  full-permission key and a fresh barrier, so a disconnected consumer pauses intake.
- Reads and delivery revalidate original context, answer evidence, and owned
  ancestor contexts/evidence. The adapter allows only exact public transaction,
  order, decision and artifact versions at a fixed loopback origin. It requires
  matching identities, published content and a consistent 64-hex visibility
  fingerprint, including a final witness. Two requests maximum run concurrently;
  all verification shares a five-second/eight-MiB budget. It never follows links.
  Failed or withdrawn evidence withholds output. Private ownership/suppression is
  checked again after the final await.
- Conversation pages are bounded by turn count and serialized bytes; cursors
  retain a fixed watermark and ownership/epoch/expiry binding. One valid turn
  fits in the 512-KiB response bound. Public archive/feed/export routes never
  expose private questions, answers, cookies or transcripts.

## Capacity, retention and truthful availability

The example configuration is disabled, contains an empty roster and synthetic-only
limits. Actual enabled flags require owner-approved limits and a named roster.
Production activation additionally needs verified genuine employee eligibility,
healthy HQ authorization, budgets, privacy notices and strict ingress acceptance.
No example fixture is an employee or approval record.

Local admission limits are at most 100 sessions/day globally, 10 sessions/network
bucket/hour, 20 conversations/session/day, 200 conversations/day, 50 questions/day
globally (or the configured lower execution limit), five questions/session/hour,
20/session/day, and 20/network bucket/hour. The network bucket is an HMAC of the
**direct peer** and UTC day, never a stored IP or trusted forwarded address. A local
proxy conservatively shares one bucket. Configured canonical limits additionally
bound queue, history, request/answer size and retention. These are admission bounds,
not measurements of actual model usage.

The HTTP listener permits eight active requests, with ordinary traffic limited to
six, and 64 connections. Ordinary traffic has 120 requests/minute; authenticated
privacy/control operations have a separate 180/minute allowance. Absolute safety
ceilings of 1,200 requests/peer/minute and 2,400 globally still apply. These reserves
are not a promise of availability under an unlimited attack. Raw duplicate headers,
forwarded authority, framing ambiguity, unsupported upgrades and pipelined second
requests fail closed. Logs contain request ID, safe code and status only.

The database caps at 64 MiB, with ordinary admission stopped below 56 MiB and
critical reconciliation allowed below 63 MiB. Disk headroom is separately enforced.
Transport request IDs are retained through the configured suppression horizon;
40,000 ordinary/50,000 total receipts are hard fail-closed limits. Idle claim replies
specify **60 seconds**; do not poll every five seconds. The 24-hour generation window
and deliberate generation advance bound normal idle receipt growth. HQ should sync
privacy before a claim/execution and before delivery, respecting the freshness
window. Old generations remain unauthorized even after receipt compaction.

Cleanup runs before requests and every 30 seconds while serving, plus an offline
CLI command. Raw expiry generates a durable privacy control. Suppression retains
minimal IDs, hashes, receipts and deadlines for the configured 7–30 days. Repeated
cancel/delete does not extend deadlines or append unlimited controls. SQLite uses
secure deletion, and an outer purge transaction must complete a truncating WAL
checkpoint before a successful acknowledgment. `purgeBy` allows 60 seconds; a busy
checkpoint fails the response and is retried by cleanup. This covers the managed
SQLite/WAL files, not physical-media erasure or unmanaged third-party copies.

All JSON is private/no-store/noindex. Availability reports disabled for held or
non-admitting configurations, paused without current authority/fresh privacy sync,
and available only within those local gates. It does not certify model output,
scientific validity, public publication or a successful paid execution.

## Offline commands

Build with `npm run build --prefix receiver`. The CLI is
`node receiver/dist/src/ask/cli.js COMMAND ...`, with an explicit private
`ASYMMETRI_ASK_CONFIG` path. Start from `receiver/ask.config.example.json` and create
the two separate private data directories first. Do not put live configuration,
questions, backups or keys in the repository. A public verification PEM belongs
inside a private owner-supplied scope file; the website never needs HQ's secret key.

Every command takes the same exclusive `ask.lock`; stop the service for owner
operations. Never remove a lock until its recorded process is verified stopped.
No production systemd unit or automatic schedule is introduced in this milestone.

| Command | Result |
| --- | --- |
| `migrate` | Create/check only `ask.sqlite` and its independent migration checksum. |
| `diagnostics` | Safe counts, quick integrity/FK check, held/generation/key status. |
| `serve` | Requires `enabled:true`; listen only on the configured loopback address. |
| `authorize SCOPE_FILE` | File contains exactly `scope`, `publicKey`, `notBefore`, `notAfter`; install an Ask verification scope without changing activation flags. |
| `revoke-key KEY_ID` | Revoke one Ask key and audit its hash. |
| `cleanup` | Apply expiry, purge raw bodies and truncate WAL. |
| `export-controls` | Export non-content privacy receipts plus service/generation/capture time; protect the output as private. |
| `backup EMPTY_DESTINATION` | Write a non-content recovery projection and return its canonical manifest digest. |
| `restore SOURCE EMPTY_DESTINATION EXPECTED_DIGEST [PUBLIC_ARCHIVE_DIR]` | Verify a recovery copy, optionally rebase the archive path, write a disabled destination config, retire sessions/authority and hold. |
| `restore-fence` | Purge current raw content, retire sessions and authority, reset cursors and hold. |
| `reconcile-controls CURRENT_JOURNAL EXPECTED_DIGEST` | Apply a separately retained current journal, then lift the recovery hold while leaving authority revoked. |

## Recovery and custody

Ask backups are **non-content recovery journals**, not transcript backups. A fixed
SQL projection copies identities, immutable answer receipts and privacy controls;
question, status, context and answer bodies are never copied, even to an interrupted
backup. The projection also replaces session hashes. It is fenced before its
manifest is finalized. Completed backups contain a hash-verified database and
configuration; an `INCOMPLETE` marker forbids restore. Protect directories as 0700
and files as 0600. No encrypted off-host backup custody or recurring production
backup policy is claimed by local tests.

Restore verifies the expected manifest and each file, checks SQLite integrity/FKs,
rebases a moved backup and persists a disabled `config.json` in the new directory.
Provide `PUBLIC_ARCHIVE_DIR` on a different host/layout; it must already exist and
remain separate. `RESTORE_INCOMPLETE` blocks interrupted startup. Restored sessions
are invalid, all bodies absent, keys revoked and consumer generation advanced.
Original minimal accepted-answer receipts retain their identity.

Before release from hold, the owner must obtain a **current**, independently kept
privacy journal from the authoritative source, not the stale backup. Its capture
time must be within five minutes; the exact digest is supplied out of band. The
command validates contents and scope but cannot independently prove the operator's
freshness claim. If current custody cannot be established, keep the service held.
Reconciliation advances the generation above both local and journal generations;
a subsequent grant must advance again. Newly imported unknown-question controls
still reach HQ. No restored content is reopened, even for a question omitted from
the current journal. HQ must reapply its own durable privacy controls after its
restore; a website acknowledgment does not prove HQ body purge.

## Acceptance and remaining integration

`npm run receiver:test` includes synthetic HTTP tests for ownership/CSRF, duplicate
admission, dedicated signatures/replay, status precision, immutable answer retries,
lease bounds, withheld evidence, ancestor withdrawal across pages, cancellation
races, raw expiry, privacy pagination, quota reserves, Unicode byte pagination,
SQLite/WAL purge, non-content/moved backup, retired sessions and current-generation
recovery. Test fixtures are explicitly synthetic and create no genuine work.
Independent read-only reviews drive fixes; test evidence is recorded in the prompt
journal. No stress/power-loss/production Ask or real employee execution result is
implied by these focused tests.

Committed Ask source `8c7a346a4509f793b270f1b73df34ad9d799ccdb` passed all 227
receiver tests on actual Ubuntu/Node 22.23.1 in an isolated directory. This is
runtime acceptance, not an operational Ask installation.

Remaining: production shared-apex HTTPS routing (isolated source acceptance is
documented in [the ingress record](INV-03-INGRESS.md)), producer interoperability
against a committed website source, private installation/operations proof, genuine healthy HQ
eligibility and cost authority, and the separately implemented visitor UI/privacy
copy. Keep public Ask disabled until these have concrete verification. Neither a
normalizing HTTP proxy nor a fixture relabelled as genuine satisfies activation.
