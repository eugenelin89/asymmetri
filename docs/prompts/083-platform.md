# Prompt 083: Signed Ask configuration reconciliation

- Date: 2026-10-13
- Scope: platform
- Goal: Adopt the accepted caller-scoped Ask configuration read while intake stays closed.

## Original user request

> Proceed with implementation, coordinate counterpart work directly where supported, perform verified releases when ready, and provide one unified result.

The owner designated BotSquad as the coordination entry point and authorized
continued implementation and verified production releases. HQ's accepted next
packet requested exact canonical commit 00d9e826, a signed configuration endpoint,
closed intake, preserved investment records/services and a separate release receipt.
The later direct employee-portrait request was completed and deployed first.

## Scope

Private receiver endpoint, exact canonical package, synthetic tests and current
documentation. No production keys, flags, limits, roster, disclosure or model grant.

## Decisions

Use existing GET signatures and control_sync permission in the reserved lane.
Persist each generation/key's stable digest in existing non-content owner audit;
derive revision from its exact textual ID without a database migration. Fail at
the safe integer boundary supported by existing recovery projection. Keep freshness
and control-barrier readiness out of revision history. Report admission false while
claims or delivery are paused. Configuration never establishes public eligibility.

## Implementation

Added the closed DTO endpoint, hash/revision/freshness construction, atomic authority
recheck, bounded observations and tests. The manifest is
5396443e475d3fe69825ef8af4e916a408b39452182e9c4828fa17b7faf37a84;
all nine files match HQ. Investment definitions/golden/signature vectors are unchanged.

## Engineering impact

No schema migration, dependency or website rendering change. Existing rollback
binaries can open the database; backups retain observation rows. Restored old
authority stays retired and HQ's independent high-water must reject regressions.
Review found HQ's pending checkpoint lacked keyId; HQ acknowledged and corrected
its uncommitted implementation to preserve alternating-caller semantics.

## Files changed

Receiver HTTP/HQ methods, ten focused tests and canonical operation-count assertion;
vendor package/pin; current onboarding, architecture, integration, readiness and
testing documentation; a dedicated configuration design/verification receipt.

## Documentation updated

Current canonical references identify HQ PR 87. The new receipt explains authority,
per-caller revision history, privacy, recovery and independent deployment gates.
Historical release and prompt records are unchanged.

## Git diff summary

19 files changed, 627 insertions and 28 deletions. Most additions are canonical
package contents, focused tests and the implementation receipt.

## Verification

Node24.10.0 matches .nvmrc; nvm is unavailable. Exact package/generated types,
receiver check/build, 247 receiver tests plus four capability cases, website
type/lint and Vinext build passed. Both production audits reported zero vulnerabilities;
whitespace check passed. Existing tutorial lint warning remains. The initial test
run found the stale 31-operation assertion and an incorrectly framed wrong-method
fixture; corrected runs passed without relaxing endpoint behavior. Independent
read-only review found no blocking source defect. Tests use disposable synthetic
stores only. Actual Linux deployment/capacity remains a separate receipt.

## Repository state after implementation commit

Main at a9b1ec5, only intended implementation/docs committed, awaiting this separate
journal and push. No branch/worktree/PR created; website portrait runtime unchanged.

## Implementation commits

- a9b1ec5 — Expose signed caller-scoped Ask configuration.

## Archive commit

Record signed Ask configuration implementation journal

## Lessons learned

Caller-scoped snapshots require caller-scoped consumer checkpoints. Preserve an
independent generation/recovery fence; a configuration read cannot replace control
draining or establish permission for inference.

## Follow-up ideas

Complete the isolated Linux suite and guarded Ask-only deployment, retain exact
rollback evidence, and coordinate actual HQ interoperability with intake closed.
