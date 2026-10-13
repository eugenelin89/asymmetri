# Prompt 060: Explicit receiver run controls

- Date: 2026-10-13
- Scope: platform
- Goal: Approve exact observed configurations and select official runs without manual SQL.

## Original user request

> i will be away. you are authorized for everything you need.

The authorized BotSquad coordination requested continued receiver operational
controls and private Ask source after the website release. This slice implements
the two missing local run controls; it does not activate real authority or Ask.

## Scope

Owner-only receiver CLI, transactional approval/selection, signed integration tests
and operating instructions. Canonical contract, migrations, dependencies and public
HTTP operations remain unchanged.

## Decisions

Bind approval to existing experiment/run/configuration-hash storage. Require
observed mode, non-fixture kind, owner-approved status and an approval record;
ordinary signed ingestion retains full event validation. Use an explicit expected
previous pointer for official selection so stale operators cannot overwrite a
newer choice. Preserve history and the restore read hold.

## Implementation

`approve-run` validates a canonical local run event and idempotently records its
frozen configuration approval/audit. Conflicting configurations fail closed.
`select-official` requires visible, locally approved, observed/official publication,
checks the prior pointer and atomically changes selection/audit/visibility epoch.
The CLI `-` argument denotes an expected absent prior selection.

## Engineering impact

No public administration endpoint or automatic publisher activation. Fixtures and
private trials cannot become official. Repeated approval produces no duplicate audit.
Unknown/stale selection, withdrawal and restore holds leave the pointer unchanged.
Website environment selection remains a separate operation.

## Files changed

New run-control module and five focused integration tests; two CLI operations;
README, receiver/current handoff/operations/testing documentation.

## Documentation updated

Document command arguments, exact approval meaning, compare-and-set recovery and
activation boundaries. Correct remaining current-guide descriptions of the now-public
website; historical acceptance documents remain unchanged.

## Git diff summary

8 files changed, 230 insertions and 10 deletions. Additive receiver operations/tests
and aligned documentation; no unrelated cleanup or source asset changes.

## Verification

Node 24.10.0 matches `.nvmrc`; nvm absent. Receiver TypeScript check/build pass.
Complete receiver suite passes 206/206 before the final additional replacement test;
rebuilt final focused suite passes 5/5. Canonical nine-file manifest unchanged.
Receiver production dependency audit reports zero vulnerabilities; diff check passes.
Two independent read-only reviewers accepted the slice. The requested extra two-run
replacement test proves stale expected selection preserves pointer, audit and epoch.
No operational approval, selection, run or publisher was created.

## Repository state after implementation commit

Main at `be844e8`; implementation committed, separate journal pending. Only intended
files staged. Normal push follows this journal; no branch/worktree/PR/force-push.

## Implementation commits

- `be844e8a695fe0e8a2df1ca31fdd1ba2c03bf299` — Add explicit observed-run approval and official selection controls.

## Archive commit

`Journal explicit observed-run receiver controls`

## Lessons learned

Configuration approval is distinct from accepting an event, provisioning a publisher
or selecting the website's default run. An atomic expected pointer makes an uncertain
operator retry detectable while preserving all published history.

## Follow-up ideas

Install receiver compatibility while stopped and empty, then implement the separate
private Ask subsystem. Prepare strict ingress and actual current-generation scopes
only against accepted producer readiness.
