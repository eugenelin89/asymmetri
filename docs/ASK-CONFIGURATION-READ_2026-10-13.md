# Signed Ask configuration read — October 13, 2026

The owner-authorized BotSquad coordination requested adoption of the accepted
configuration-read amendment after the employee portraits release. This packet
vendors the exact nine canonical files from HQ merge
`00d9e82668dcfd39b25294d9a05a7f97e4d28295` (PR 87), manifest SHA-256
`5396443e475d3fe69825ef8af4e916a408b39452182e9c4828fa17b7faf37a84`.
The golden investment fixture and signature vector bytes are unchanged.

## Endpoint and authority

`GET /api/ask/v1/service/configuration` uses the existing empty-body HTTP signature
profile and `control_sync` permission. It rejects queries, bodies, content digests
and idempotency headers. Current key/scope/service/generation, expiry and held-state
checks apply before access and are repeated inside the configuration transaction.
It uses the reserved reconciliation lane and remains callable by authorized HQ
while visitor admission is disabled. Independent reconciliation and absolute HTTP
ceilings remain enforced. Responses are private/no-store and never set cookies.

The closed DTO includes the exact caller scope, configured limits, public roster,
privacy version, readiness flags, revision/hash and freshness. Configured admission
is reported false while claims or delivery are paused. Readiness does not depend
on queue occupancy or an existing control barrier. The read creates no barrier,
claim, transport receipt, session, model grant or financial authority. Freshness is
at most 60 seconds and is capped by scope, key and generation expiry.

## Revision persistence and recovery

Each generation/key has an independent last-observed stable digest stored in the
existing non-content `owner_audit` table. Exact action matching prevents callers
from sharing observations. Repeated reads and restarts retain revision/hash while
freshness advances. A stable-field change appends an observation and uses its
global increasing audit ID as the caller's revision. A→B→A configuration changes
therefore advance revision, while alternating different caller keys remain stable.
The stored digest excludes revision; the returned canonical hash includes revision
and excludes only the hash and freshness fields, as the protocol requires.

IDs are selected as text to avoid rounding. Appends require critical storage
headroom and stop at the safe integer boundary preserved by the existing recovery
projection. Failed validation/capacity rolls back the entire observation. Reads
whose configuration is unchanged do not append or touch the persistent revision.
No migration is added: existing rollback binaries still open the same database.

The existing explicit non-content backup projection retains these observations.
Restore remains held, retires old keys, and requires current control reconciliation
plus new finite generation authority. A stale backup can contain lower observed
revisions; this is not permission to accept a regression. HQ must retain independent
high-water marks keyed by service/generation/keyId. HQ acknowledged and corrected
its pending consumer implementation to use that identity after review found the
A→B→A caller mismatch. That coordination is not evidence of a deployed HQ consumer.

## Verification and rollout boundary

Focused synthetic tests cover exact/closed fields and no private path/key leakage,
closed intake, no new barriers/work, restart stability, stable-field changes,
alternating callers, authorization and expiry failures, malformed signed GETs,
replay, reserved quota, millisecond freshness, null subscription cost/policy,
capacity/integer bounds, and backup/restore with retired authority. The complete
receiver suite passed 247/247 plus all four capability cases. Exact canonical
package/type validation, receiver check/build, website type/lint and Vinext build
passed. Both production dependency audits report zero vulnerabilities. The existing
tutorial lint warning is unrelated. No website rendering or browser flow changed.

Independent read-only review found no blocking defect in the runtime/vendor diff
(`fcdc38def274d52f5a2610d2540091a87c1a69535b349d0343015b5e1756c9ef`)
and ten focused cases. The first full-suite run found the expected old OpenAPI
operation-count assertion (31); it now expects 32 and explicitly checks the new
operation. The initial wrong-method fixture also needed explicit zero-length
HTTP framing to reach the method check instead of the framing rejection.

This source packet does not add production keys, change flags/limits/roster,
approve a disclosure, establish provider/account eligibility or enable inference.
The public-service entitlement verifier remains absent and public Ask stays closed.
Production activation must preserve website portrait source/build, investment
scope/records, all private metadata/configuration and unrelated services, and retain
an exact code-only rollback. Its separate receipt records actual installed identity.
