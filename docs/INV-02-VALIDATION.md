# INV-02 local acceptance — 2026-10-09

**Accepted locally. Default disabled; no production deployment or access.**
This record accompanies the implementation commit; the authoritative BotSquad
INV-02 record links its exact final SHA. [Runbook](INVESTMENT_RECEIVER.md) contains
API/configuration/storage/recovery details and explicit later deployment gates.

## Baselines and scope

Asymmetri began on clean, fetched main
`1232d1cbbe642a10a2455c2ed9c601174e548d2a`, with no other worktree/writer ownership.
BotSquad documentation worktree began at
`b57c41ab423d4f21ddd14bbdba576649336fe935`. Its contract bytes matched accepted
`ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755` exactly. No canonical contract/runtime
changes. Decisions 027/028/029 and required current documents reviewed. Only INV-02
implemented; current infrastructure observations were taken from documentation.
No SSH, production user/service/disk/package/proxy/key/HQ change or preview occurred.

Contract v1.0 manifest SHA-256:
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
Exact nine-file vendor package, 47 root DTOs, 18 event types and shared signature
vector; all 31 OpenAPI operations remain in the immutable contract. Receiver
recognizes the 17 investment operations; public artifact downloads are explicitly
unavailable until INV-03, and none of the 14 Ask operations is implemented.

## Commands and outcomes

| Command / environment | Result |
| --- | --- |
| `npm --prefix receiver install` (locked dependencies) | Native driver installed locally; receiver audit clean |
| `npm run receiver:check` | Pass, strict TypeScript |
| `npm --prefix receiver test` | **183/183 pass**, 0 fail/skip; exact vendor/hash/type regeneration, compile and tests; Node24.10.0 macOS arm64 |
| Node22.23.1 `--test receiver/dist/test/*.test.js` | **183/183 pass**, 0 fail/skip, same macOS arm64 host |
| Native better-sqlite3 13.0.3 smoke on both Node versions | Pass, SQLite3.53.4 |
| `npm run check` | Pass; only pre-existing tutorial-reader Next navigation lint warning; no new receiver warnings |
| `npm run build:next` | Pass, Next16.3.8, existing protected routes generated |
| `npm run build` | Pass, Vinext0.0.50/Cloudflare packaging; existing static-analysis route-classification notice |
| `npm audit --omit=dev` | Pass, 0 production vulnerabilities after minimal Next patch |
| `npm --prefix receiver audit --omit=dev` | Pass, 0 vulnerabilities |
| `git diff --check` | Pass |
| CLI serve without configuration environment | Expected exit1, explicit disabled message; no listener/authority |

Node24 matches `.nvmrc`; nvm is unavailable on this Mac. A temporary official
Node22.23.1 archive was checked against published SHA-256 and used without changing
the system runtime. The same native dependency loaded on both runtimes. Runtime
and unit tests do not install production services. Builds remain local.

The initial root audit found one high-severity Next16.3.6 dependency finding
covering six advisories. Applied the smallest available patched release16.3.8
and aligned eslint-config-next, keeping the lockfile synchronized. Both builds,
check and production audit passed again. Advisory basis includes upstream
[SSG/ISR cache poisoning](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676)
and [image optimization SSRF](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4).
This updates repository pins; no installed server was patched.

## Evidence coverage

- **Contract:** exact manifest and file membership, generated declarations,
  every root DTO/required field/unknown field, all publication event variants,
  unsupported versions, duplicate JSON keys, bad UTF-8/surrogates, excess nesting,
  canonical JSON/fixed-point math, shared Ed25519 vector and independent WebCrypto
  verification. Ask DTO schema checks verify vendored shapes only, not an Ask service.
- **HTTP/security:** real loopback requests; current scoped Ed25519 signatures,
  altered bytes/method/path/authority/generation, missing/bad signatures/digests,
  signed-query rejection, ambiguous raw/mixed-case headers via TCP, framing/encoding,
  nonce replay after restart/process death, signature/key/scope expiry, key activation,
  revoked key, wrong run/event class and commit-time revocation. Signed receipt reads
  cannot bypass present authority. Error bodies are bounded/no-store and safe.
- **SQLite:** repeat/empty migration with no authority/run, immutable event SQL
  triggers, first/retry/conflicting/repackaged batches, concurrent same-process and
  **separate-process** duplicate convergence, FK/full integrity, source conflicts,
  atomic rollback and **SIGKILL before/after commit/before response**. Committed
  receipt and nonce remain; retry/receipt reconcile without duplicate events/trades.
- **Financial:** synthetic BUY/HOLD/rejected orders, order transition/version links,
  journal/source operation/hash continuity, missing dependency rejection, immutable
  config, exact decimals, negative/inconsistent balances, invalid postings, dividends,
  split rational entitlement and ticker history. Newer/older/corrected/partial
  valuations select honest current public state and preserve exact old versions.
- **Public reads:** actual named DTO routes, empty/missing/unavailable/tombstones,
  fixed-watermark bounded pages, cursor filter/epoch/expiry/reset, freshness independent
  of heartbeat, no private fields, ETag revalidation, transitive scalar dependencies,
  effective instrument changes and no resurrected hidden current revision/order/status.
- **Artifact:** safe types/hash/size, identical upload, bounded private storage,
  interrupted TCP upload, write failure, metadata without bytes, corruption/symlink,
  orphan cleanup, **SIGKILL after atomic rename**, retry after expired staging and
  no public hash-addressable content. Downloads intentionally return unavailable.
- **Capacity:** payload/type limits, publisher quotas, receipt reconciliation separate
  from write budgets, finite operational receipts and physical DB reserve. Near-full
  database denies new public cursors/writes while authenticated old receipt GET works.
- **Restore:** consistent isolated SQLite backup plus CAS copy, full SQL/FK checks,
  every referenced fixture hash/type/size read, new epoch, revoked/disabled old
  authority, fresh disposable key/generation, exact original receipt/retry and cursor
  reset. Documented reconciliation also preserves newer withdrawal controls.
- **Rights:** only synthetic source data used; observed-paper claims without trusted
  approval fail. Deleting a test approval during asynchronous validation prevents
  commit. No real approval or market source connection exists.

## Independent reviews and corrected findings

One implementation/integration owner; three read-only specialists. Security,
recovery and acceptance/test reviewers inspected corrected sources and both
183/183 logs and returned **no remaining blocking findings** for local INV-02.

Resolved findings: scalar dependency withdrawal; newest hidden order/status and
valuation fallback; hardlink crash window (changed to atomic rename); checkout
`..runtime` ancestry; SPKI-only verification storage; expired staging receipt
restoration; metadata/cursor reserve bypass and bounded nonce/receipt state;
revision-based decision ordering; effective instrument dependency; rights approval
commit race. Each material finding has a focused regression. Early copied-test
wrapper/type/library errors, synthetic restore clock mismatch and a Node22 test
working-directory assumption were corrected before final passes. Added test lint
warnings were removed. None of these fixes changes vendored contract bytes.

## Limits and next milestone

Not run: Linux/systemd/Nginx/TLS interoperability, production traffic, sustained
large-archive/shared-host load, hardware power-loss, real offsite backup recovery,
real market data, HQ workers/publication or Ask execution. No UI/visual changes
were made. SIGKILL proves process-crash recovery only. Current capacity is explicitly
bounded; resource sizing must be measured before deployment.

INV-02 acceptance A02/A06/A07/A09 is met for the authorized local synthetic scope.
INV-03 may begin as a **separately requested local implementation** using this
receiver. It is not automatically started. Production still needs supported OS,
fresh capacity/RAM checks, Linux native/runtime/proxy testing, independent identity,
verified backup/restore and explicit configuration/activation. Decision029's US$0
source and publication-rights review gates future observed data; Ask is independent.
Historical INV-01 root-disk96% is superseded by documented October9 cleanup, not by
new server validation in this task.
