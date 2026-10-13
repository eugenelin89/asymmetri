# Prompt 075: Closed Ask operational safeguards and capability review

- Date: 2026-10-13
- Scope: deployment
- Goal: Complete website-owned Ask safeguards while preserving closed intake and the exact live investment.

## Original user request

> i will be away. you are authorized for everything you need.

The owner's standing release direction was to proceed to deployment and public
release when ready without another approval request. Authorized HQ coordination
requested completion of implementable Ask privacy, retention, backup/restore and
bounded-load safeguards on the existing host, preserving the live investment and
Motion. It also requested a consumer plan for the forthcoming canonical
subscription activity-capability amendment, with no vendoring before an accepted
hash and no fabricated paid-cap or public-service capability. The user separately
asked for the website URL; that was answered directly.

## Scope

The independent Ask service profile, disposable host acceptance, private
non-content recovery, documentation and proposed consumer plan. No website or
investment application change, new run, real question, canned answer, model turn,
new grant, paid-account setting, canonical vendor update or public notice entry.
No messages were sent to HQ; its existing coordination reads this chat and docs.

## Decisions

- Keep live intake disabled, empty content/authority tables and generation zero.
- Apply zero swap and zero core limits only to Ask. Verify the actual process,
  not just systemd configuration. A small checked launcher compensates for the
  observed systemd 251 core-filter defect without changing host-wide handling.
- Use fixed non-content backup projections and an isolated disabled/held restore;
  do not copy the raw live SQLite/WAL or restore over production.
- Preserve the exact existing investment publisher, run, signed records and
  website read environment. Permit unrelated legitimate append activity while
  comparing immutable prior records; do not hash a live whole database.
- Treat the proposed activity-capped subscription variant as a source plan only.
  Preserve strict modes, unknown cost, possible threshold overshoot/internal
  retries, and admission holds for absent usage or threshold breach. A new enum
  is not account eligibility or deployed enforcement evidence.

## Implementation

Installed a root-owned launcher and Ask-only drop-in. The actual service now has
core limits 0/0, mapping filter zero and swap maximum/current zero; unchanged
source 4daa713 runs as PID 2388788 from 21:08:26 UTC. The website, investment,
ingress, Nginx and gunicorn PID/start identities remain unchanged.

Added deterministic child SIGKILL fixtures at two backup phases and measured
concurrent owned reads followed by quota exhaustion, cancellation and HQ controls.
Retained failed and successful attempts plus bounded resource/public-health data.
Created an actual non-content recovery copy and verified a separate generation-2
held restore with disabled flags, no active key and valid integrity/FKs. Cold
source generation zero cannot satisfy positive-Sequence reconciliation; the copy
remains held, without inventing a generation or current journal.

The operational receipt records custody, root/operator access, retention defaults,
log limits, snapshot/backup exclusions and unverified off-host/combined-HQ gates.
The consumer review maps the precise proposed conditional policy to canonical
validation, receiver config, browser gates, disclosure and tests. The pinned
manifest and empty approved-notice registry are unchanged.

## Engineering impact

No dependency, rendering, routing or data-model changes. Ask's service process has
less memory spill exposure; a failed launcher filter check stops startup. The
constrained request test establishes measured fixture behavior, not a genuine
employee-throughput or billing guarantee. Same-host recovery is not independent
disaster-recovery custody or physical-media/provider erasure.

## Files changed

- Service example, checked launcher and isolated acceptance harness.
- Operational receipt and canonical capability review.
- Readiness/private receiver docs, testing/deployment guidance and README links.

## Documentation updated

Documented exact installed identities, rollback, evidence hashes, retained failed
attempts, measured bounds, actual backup/held restore, restart/generation sequence
and remaining gates. Corrected stale current-state references to repaired HQ
private authentication and the already-configured live investment. Historical
release records were not rewritten.

## Git diff summary

10 files changed, 473 insertions and 6 deletions. Most additions are operational
and consumer handoff documentation; implementation consists of a small launcher,
service-profile changes and focused synthetic acceptance. No generated output,
private receipt body or current journal record is included in its own summary.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; nvm is unavailable. Shell/JavaScript syntax,
  TypeScript/ESLint and whitespace checks passed, with the existing tutorial
  navigation warning. Application/dependency builds are unchanged.
- First isolated Linux pass: 28/29, exposing ignored core-filter configuration.
  The monitor's unsupported systemd swap property also failed its summary; this
  measurement stayed unknown. Both findings were retained and corrected.
- Corrected Linux pass: 29/29; peak measured memory 93,016,064 bytes, swap zero,
  minimum available host memory 291,332 KiB; 17 public health checks passed.
- Strengthened interrupted-restore assertion uses a valid final manifest digest
  and requires the incomplete-copy error. All three final fixtures passed again;
  five additional public probes succeeded, with zero measured swap.
- Eighty owned reads at six in flight returned 200; p50/p95/max 132/309/324 ms.
  After ordinary quota exhaustion, cancellation and signed HQ controls succeeded.
  No genuine model ran.
- A preflight roster guard initially checked the object instead of its workers
  array. It stopped before any production mutation; corrected preflight passed.
- Before/after 112 host observations matched: 104 verified HTTP results, four
  unchanged fallback certificate fingerprints and four known IPv6 TLS failures.
  Motion page hashes, tutorial canonical/hashes and 48 original-image reads matched.
- Actual Ask availability 200 disabled and session POST 503 UNAVAILABLE, both
  private/no-store with no cookie. Content, authority, full metadata and immutable
  investment baseline remained preserved after all probes.
- Actual recovery integrity/FKs, held/disabled state and owner-only modes passed.
  All disposable units/tools/uploads were removed. The 33-file private receipt
  manifest SHA-256 is 8b632a44221321984475f0a955be2ea26d9ab0fe9b033eb78d9980cd3ca8a689.
- Independently resolved HQ PR 85 merge 705ff31; its reported tests/source custody
  remain producer evidence, not an operational deployment by this repository.

## Repository state after implementation commit

Branch main, implementation db242e6aeaa61ae68686d47a3026fe492daf36e3; clean working tree before creating this
record, one commit ahead of the previously pushed 243e539. Only this task's changes
were included. The journal is committed separately and both commits are pushed.

## Implementation commits

- `db242e6aeaa61ae68686d47a3026fe492daf36e3` — Harden closed Ask memory and recovery operations.

## Archive commit

`Record closed Ask operations and capability review journal`

## Lessons learned

Read back kernel/cgroup state; accepted systemd syntax does not prove application.
Test interrupted restores with the correct manifest digest so a different failure
cannot mask missing incomplete-copy enforcement. Preserve actual failed attempts,
source/build/config distinctions, private backup exclusions and uncertainty.

## Follow-up ideas

Wait for the accepted canonical package before consumer changes. Close genuine HQ
custody/restore, account eligibility, finite usage enforcement, reviewed disclosure
and combined-workload evidence before opening Ask. Verify external snapshot and
off-host backup custody rather than inferring it from a local timer listing.
