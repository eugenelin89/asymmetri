# Investment archive receiver (INV-02)

INV-02 was implemented and validated locally; the separately owner-selected [INFRA-02](INFRA-02-RECEIVER-DEPLOYMENT.md) now installs it privately on the existing Ubuntu 22.10 host. It remains stopped/default disabled with an empty operational archive, no real publisher, HQ change, collected prices or Ask activation. Next.js remains the page-rendering system; its existing routes
and Vinext packaging do not start or import the receiver runtime.

## Contract and runtime

**Cross-repository guide:** [Asymmetri/BotSquad integration map](BOTSQUAD_INTEGRATION.md). The [BotSquad canonical investment roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md) owns milestone and source-of-truth responsibilities; Asymmetri owns this receiver and site implementation. INV-04 is accepted in source and local synthetic browser validation, not released to the live website.


`receiver/vendor/investment/v1/` is the exact nine-file contract 1.0 from
[eugenelin89/bot_messenger at ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755](https://github.com/eugenelin89/bot_messenger/tree/ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755/contracts/investment/v1).
Manifest SHA-256:
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
`vendor/source.json` records the pin. The checker verifies complete membership,
manifest/file hashes and independently regenerated TypeScript declarations.
Runtime has no GitHub dependency. Schema, signature, publication and content
validation helpers are MIT adaptations of that commit's conformance helpers;
`vendor/LICENSE.botsquad` preserves attribution. No Ask implementation was copied.

Receiver has an independent package and lockfile: better-sqlite3 13.0.3 (SQLite
3.53.4), AJV 8.20.0/ajv-formats 3.0.1, canonicalize 2.1.0, jsonc-parser 3.3.1.
TypeScript 5.9.3 builds it. Tested on macOS arm64 Node 24.10.0 and 22.23.1,
including the actual native SQLite module and all integration tests on both.
[INFRA-02 validation](INFRA-02-VALIDATION.md) records actual Linux ABI/filesystem/systemd tests and bounded shared-host measurements; larger live archives remain unproven.
No container, Redis, queue, cloud database or provider integration is introduced.

## Local setup (explicit, disposable)

From repository root, use `.nvmrc` Node 24 (or the separately tested Node 22.23.1):

```sh
npm --prefix receiver ci
npm run receiver:check
npm run receiver:test
npm run receiver:build
```

Installation/build/import/migration never creates a publisher or listener.
`npm run receiver:start` without `ASYMMETRI_RECEIVER_CONFIG` exits disabled.
`receiver/config/disabled.example.json` is a template, not an installed config.
For a manual isolated service, create a private directory outside the checkout,
copy this JSON to a private configuration file, set its `dataDir` to that real
absolute directory, and deliberately set `enabled:true`. Set authority to the
exact Host that local requests will send, e.g. `127.0.0.1:3101`. Then:

```sh
ASYMMETRI_RECEIVER_CONFIG=/absolute/private/config.json npm --prefix receiver run admin -- migrate
ASYMMETRI_RECEIVER_CONFIG=/absolute/private/config.json npm run receiver:start
```

No publisher exists initially: public archive reads are 404 and signed writes
fail authentication. Tests generate temporary Ed25519 identities in memory and
remove their directories; do not reuse them operationally. Stop with SIGTERM or
Ctrl-C. The CLI has an exclusive lock for serve/migration/cleanup/restore-fence;
after a process crash, verify the recorded PID is gone before removing a stale
lock. Never remove a live process's lock to run maintenance.

`lib/investment-archive.ts` exposes public contract types and safe route locations
for later server pages. It returns null unless an explicit loopback read origin
is supplied. It has no fetch/startup side effects, page wiring or signing ability.
The local authority must agree with that origin; a later proxy configuration must
be reviewed jointly. No `NEXT_PUBLIC_*` service configuration is needed.

## API implementation

All routes come from the pinned OpenAPI. Base `R` is
`/api/experiments/v1/experiments/{experimentId}/runs/{runId}`.

| Method / path | Behavior |
| --- | --- |
| POST `R/events` | Atomic EventBatch, 201 first acceptance / 200 identical retry |
| GET `R/receipts/{batchId}` | Signed current-authority PublicationReceipt lookup |
| POST `R/heartbeat` | Signed operational contact only; no financial mutation |
| PUT `R/content/{sha256}` | Signed bounded bytes; private ContentReceipt |
| GET `/api/experiments/v1/experiments/{experimentId}` | PublicExperiment |
| GET `R/status`, `R/snapshot`, `R/events`, `R/performance` | Named status, snapshot and collection DTOs |
| GET `R/discussions`, `R/discussions/{id}`, `R/decisions/{id}` | Metadata, bounded public contributions and decisions |
| GET `R/transactions`, `R/artifacts` | Bounded public projections |
| GET `R/artifacts/{id}/versions/{version}` | Published metadata or safe withdrawal state |
| GET `R/records/{kind}/{id}/versions/{version}` | Exact version, tombstone when hidden |
| GET `R/artifacts/{id}/versions/{version}/content` | INV-03 exact verified bytes; 404 absent, 409 unstaged/unpublished, 410 hidden |

17 contract operations are recognized. INV-03 implements exact downloads and human
artifact/discussion views; all public activation remains disabled.
Worker roster/activity events are queryable through EventPage, with durable typed
projection identities. There is no invented worker route. All output DTOs and
Problems are schema validated. `/api/ask/v1` is unimplemented and has no tables,
queue, sessions, questions, dispatch or authority in this service.

Public GETs use `max-age=0, must-revalidate` and visibility-sensitive ETags;
withdrawal invalidates old cursors/ETags and suppresses transitive dependencies,
including scalar financial/discussion/instrument references. Exact historical
versions stay immutable. A hidden latest revision never resurrects an earlier
revision of the same valuation. Missing data is represented explicitly; no market
calendar is installed and expected session stays null. Fresh heartbeats cannot
make market data fresh. Health is visible through PublicStatus freshness plus
private CLI diagnostics; there is no unauthenticated administrative health route.

## Trusted identity and authentication

Use the private local `authorize <absolute-json-file>` command only after separate
operational authorization. Input contains exactly `scope` (PublisherScope),
`publicKey` (Ed25519 verification PEM), `notBefore` and `notAfter` (Unix seconds).
Never copy HQ private keys here. Verification material is normalized to public
SPKI before storage. Publisher/experiment/run and key identities are immutable;
generation cannot decrease; revoked key IDs cannot be resurrected. `revoke-key
<keyId>` takes effect on fresh retries/receipt reads and pending commits. These
commands expose no HTTP admin route. Scope grants are never accepted from events.

RFC 9421 Ed25519 signatures bind exact method/authority/path, generation and, for
writes, content type, SHA-256 Content-Digest and idempotency key. The pinned narrow
profile rejects ambiguous serialization, unsupported components, duplicate raw
headers, changed bytes/targets, queries on signed routes, stale/future signatures,
wrong activation/revocation/scope and replay. Nonces survive restart. Current
scope/key/generation are rechecked immediately before every commit and signed
receipt response. Signing proves delivery authority, not analytical correctness.

A future Nginx proxy must preserve the explicitly configured Host, remove all
Forwarded/X-Forwarded-* headers, preserve request bytes and signed path, avoid
redirects/rewrites, reject ambiguous framing, and set matching body/time limits.
The receiver trusts no forwarded authority, accepts no transfer/content encoding,
and binds loopback only. INFRA-02 tested a disposable transparent Nginx proxy; its HTTP-layer profile failed duplicate Connection preservation. Exact public HTTP/TLS ingress remains unaccepted; no operational proxy was installed.

Decision 029: market-data acquisition/licensing budget is **US$0**. Receiver has
no vendor credentials, scraper, fetch of source URLs or paid-feed assumption.
`observed_paper` publication additionally requires a trusted local approval for
the exact frozen configuration hash in `publication_approvals`; publisher claims
and public URLs alone do not establish rights. No operational approval was made.
A future reviewed approval workflow belongs with permitted-source/live activation
work. Synthetic fixtures need no real source connection.

## SQLite, ordering and transaction boundaries

Migration 001 creates the public-only archive: experiments/runs/frozen config,
publishers/keys/audit, durable nonces/quotas, immutable events/batches/receipts,
record identities and dependency foreign keys, journal/order/valuation constraints,
versioned snapshots, current projections, discussion ordinals, content reservations,
private staging/artifact metadata, visibility audit, heartbeats and opaque cursors.
Migration records its checksum and rejects unexpected version/content drift. For
future versions, add a new numbered migration and extend the ordered migration
runner with tests; never edit an already deployed migration or silently recreate DBs.

SQLite uses WAL, FULL synchronous, foreign keys, 1s busy timeout and short
IMMEDIATE transactions. Body parsing, signature validation, complete bounded
financial validation and file reads occur outside batch transactions. A durable
revision fence detects intervening state changes before atomic event/projection/
receipt commit. No transaction spans network or long filesystem operations.

Journal sequence/hash/source-operation consistency, fixed-point arithmetic,
order transitions, evidence, roster, references, valuation sequence/revision,
frozen config and explicit data quality are validated. Delayed independent source
events are allowed; source gaps remain explicit. Current snapshot selection uses
valuation sequence and revision, never HTTP arrival. Prior versions remain
addressable. Official-run selection is reserved for an explicit future operator
decision; publication does not silently set that pointer.

Same request ID/target requires identical bytes; different bytes conflict. A new
batch cannot duplicate immutable events or source/financial identities. Successful
batch and receipt commit together. Retry with a fresh signature after uncertain
response, or read its signed receipt; never infer a new trade from transport
acknowledgment. SQL uniqueness plus optimistic revalidation converges concurrent
processes on one result. A transaction failure leaves no partial run or batch.

## Content and capacity

Data directory must already exist, be mode 0700, resolve outside checkout and be
owned by the intended non-root operator. CLI umask is 0077, DB/files 0600. Database,
CAS and directory symlink/hardlink surprises fail closed. Content uses generated
random temporary names and SHA-256 filenames, never publisher paths/URLs.

Streaming writes enforce Content-Length/size, flush the temp file, validate its
hash and conservative content format, then atomically rename on the same filesystem
and fsync both directories. A durable quota reservation precedes installation.
Private staging metadata and receipts follow byte installation. Crashes leave
private retryable objects, not published metadata. Retry after expired staging
restores the identical bytes while returning its original receipt. Metadata cannot
publish absent/corrupt/wrong-type bytes. No remote URLs are fetched. Text/plain,
restricted Markdown, JSON and CSV are limited to 128 KiB; normalized PNG to 4 MiB.
HTML, SVG, PDF, Office and arbitrary conversions are excluded.

Default limits (configuration can only change documented bounded numeric ranges):

- Event batch 1 MiB; heartbeat 16 KiB; header block 16 KiB, 64 raw header pairs;
  64 connections, 8 active requests, 600 requests/minute per process; 15s request
  timeout and 5s header timeout. Publisher writes/minute and bytes/day are durable.
- Event payload archive 64 MiB total; history validation capped at 16 MiB per run.
  This deliberately bounded initial implementation validates complete history.
  Growth beyond this needs measured indexed validation/capacity work before use.
- SQLite physical cap 4x archive budget (256 MiB default), with free-page accounting
  and 4–16 MiB reserved for nonce-protected reconciliation. New mutations fail
  before that reserve; accepted signed receipt reads remain usable (new write nonces can be denied).
- 100,000 immutable transport receipts total, including at most 50,000 operational
  heartbeat/upload receipts; 10,000 live nonces/cursors. No silent receipt pruning.
  Heartbeat's latest state is one row per publisher; historical receipt capacity
  exhaustion requires operator capacity review, not forgotten idempotency.
- CAS reservations/bytes 256 MiB; minimum filesystem free space 256 MiB; bounded
  offline cleanup scans at most 100 temp entries and 100 expired object records
  by default (hard maximum 1,000). Only unpublished objects older than 24h qualify;
  published/withdrawn artifact bytes are retained for integrity/history.
- Public pages default 50, maximum 100, roughly 1 MiB item budget; 2 MiB final JSON
  ceiling. Cursors bind path/filter/limit, fixed receiver watermark, restore and
  visibility epochs; 15-minute expiry. Use CURSOR_RESET recovery as in PROTOCOL.

Limits return safe explicit errors; they are not a promise of production sizing.
At defaults, reserve at least 1 GiB free storage plus independent backups and
website/build headroom. Proposed receiver RAM ceiling is 256 MiB with 128 MiB JS
heap. The minimum configurable archive payload budget is 4 MiB (16 MiB DB). Measure sustained real-sized synthetic archives with the website under load
on the actual selected host under the [OS exception review](INFRA-01-CANCELLATION.md#time-limited-unsupported-os-exception) before activation; the historical 1 GiB shared host may
need more RAM. There is no unbounded queue or automatic data deletion to recover
space. Journal metadata and pages consume capacity as well as payloads.

## Diagnostics, backup and uncertain outcomes

`admin -- diagnostics` reports migration, SQLite quick/foreign-key checks and safe
counts. Logs include generated request ID, contract code and status only; no bodies,
signatures, nonce values, filesystem paths or secrets. Alert in future operations
on repeated 401/403/409, 429 capacity/rate failures, 503, stale publication, disk
floor, DB/WAL growth, latency and RSS. None is installed by this milestone.

`cleanup` is offline only and bounded. Keep every referenced artifact even after
withdrawal. Stop admission before maintenance. On ENOSPC/corruption, retain all
files and receipts, stop new writes and investigate; do not erase history or
reinitialize a run. A DB-committed receipt is authoritative even if the socket died.

Backup procedure for a later authorized operator:

1. Disable publisher admission, stop receiver gracefully, verify no process/lock
   owner, checkpoint and close SQLite. Back up the **complete** private data
   directory (DB, any WAL/SHM, CAS, metadata) with ownership/modes and a separate
   copy of non-secret configuration. Never copy just an active SQLite main file.
2. Store outside the checkout/on a separate protected device or approved backup
   destination. Hash the backup files and record the code/schema version, epoch,
   journal/source watermarks, publisher generations and last accepted receipt.
3. Restore into a new isolated 0700 directory with `enabled:false`; use that code
   version's migrations/diagnostics. Check full SQLite `integrity_check`, foreign
   keys and each artifact's hash/type/size through Storage.read. Missing referenced
   bytes or schema mismatch blocks activation. Test the backup, not just its copy.
4. Run `restore-fence`: publishers disabled, all old key IDs revoked, local
   generations incremented, rights approvals removed and cursor epoch replaced.
   A stale backup cannot know a later live generation: reconcile with HQ and its
   durable outbox, then use a **fresh key ID/key and generation greater than every
   value seen on both sides**. Never automatically restore authority from backup.
5. Reapply any newer withdrawal/withholding actions from the current operator audit before exposing reads; an older backup must not republish withdrawn data. Compare watermarks and signed receipt history; replay only immutable uncertain
   batches with fresh signatures after explicit reauthorization. Existing batches
   return the same receipt; absent batches must pass full validation. Old cursors
   return CURSOR_RESET. Lost public archive history cannot cause HQ to rerun a trade.

INV-02 local tests use SQLite's backup API for a consistent isolated database snapshot,
copy CAS, validate every fixture object, fence authority, install a fresh disposable
key, reconcile exact original receipt/retry and verify cursor reset. Real process
SIGKILL tests cover pre/post-SQL commit and post-content-rename boundaries. These
do not simulate hardware power loss, filesystem corruption repair or offsite DR.

## Installed private service and future activation

`receiver/deploy/asymmetri-investment.service.example` is the hardened INFRA-02 installed-unit profile, without an Install target. See the [current installation/rollback record](INFRA-02-RECEIVER-DEPLOYMENT.md); the paragraphs below describe remaining real/public activation gates. It requires an explicit marker AND enabled config,
separate non-root identity/storage, loopback network restriction, memory/CPU/task
limits and filesystem isolation. It is not an activation script.

Before later activation, re-review the owner's [Ubuntu 22.10 exception](INFRA-01-CANCELLATION.md).
INFRA-01 stays cancelled; migration is an independent project. INFRA-02 accepted
actual Node22/Linux native compatibility, isolated ownership and systemd protection,
fsync/rename, migration 001, recovery, and bounded shared-host load. See the
[measured evidence](INFRA-02-VALIDATION.md); historical disk observations are not
current capacity guarantees. The unit is installed, static and stopped; config is
disabled and operational authority/data are empty.

Real/public activation still requires an accepted exact HTTP/TLS ingress design,
representative archive sizing, reviewed retention/backup custody and schedule,
finite publisher/key lifecycle and HQ reconciliation, verified source-publication
rights under Decision 029, completed feature gates and explicit owner authorization.
The tested HTTP proxy failed duplicate-header preservation; local stream transport
acceptance does not close that gate. Ask has separate storage/identity/budget gates.

Receiver-only rollback stops admission and its unit, restores compatible receiver
code and validated disabled config, and preserves additive DB/history and receipts.
An older backup restore uses the fencing/reconciliation procedure above. Never
roll back HQ trades from a website receipt or display error.

## Contract update procedure

Choose a reviewed canonical BotSquad contract commit, verify its whole manifest,
copy the complete versioned package and pin commit/digest together. Preserve old
version directories if compatibility requires them. Regenerate declarations and
run shared fixture/signature/named DTO tests plus receiver HTTP/SQL/recovery tests
on supported Node versions. Review semantic/migration/proxy compatibility and
both website builds before integration. Never locally weaken vendored schemas,
edit their hash manifest to bless drift, fetch contracts at runtime or use a
floating branch as production protocol.

## Deferred scope

INV-04's complete showcase UI is implemented in source and locally validated, but **not deployed or activated**. Remaining deferred work includes real HQ publisher/grants, official-run selection/activation controls, collectors/providers/calendar,
authoritative trading, real rights approval workflow, public activation and the entire
private Ask service. INV-02 provides REST/archive foundations; INFRA-02 adds stopped private-host installation and synthetic Linux acceptance.


## INV-03 current implementation

The [INV-03 runbook](INV-03-OPERATIONS.md) supersedes the earlier deferred-download
and receiver-backup procedures: exact-version downloads/human discussion views are
implemented; migration 002 adds owner controls and restore read holds. Signed transport
is separate from exact artifact publication rights. The [TLS record](INV-03-INGRESS.md)
accepts isolated actual-host TLS stream transport while keeping public shared-443
activation gated. [Validation](INV-03-VALIDATION.md) records measured capacity, private
installation, independent review and the still-unverified production backup custody.

## INV-04 read transport integration

The frozen v1 nine-file contract package and schema002 remain unchanged. Public
JSON reads now attach `X-Archive-Visibility`, a hash of archive/visibility epochs
computed within the same read transaction. Ordinary publications retain this value;
withdrawal/restore changes it. Website projections bracket related reads with this
witness, hide content on disagreement and revalidate open views on bounded timers.
ETag retains its existing content semantics and is not used as a visibility-only key.

First event pages may additionally attach `X-Archive-Latest-Cursor`. It is an existing
standard opaque cursor into the last window fitting both limit and byte ceiling,
with the same path/filter/limit binding, snapshot watermark, expiry and visibility
checks. It adds neither a canonical DTO field nor a new query or authority surface.
The client uses at most two event reads to catch up; explicit pagination remains
stable. Exact financial/visibility/security regressions are retained.

`receiver/test/showcase-fixture.ts` and the explicitly invoked local preview are
synthetic test tooling, excluded from normal receiver startup. The preview uses
only a disposable private archive and in-memory keys, revoked after each publication
exercise; it never reads operational credentials or seeds operational storage.
No production receiver source was installed by INV-04.
