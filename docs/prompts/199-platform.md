# Prompt 199: Lean workspaces and deployment cleanup policy

- Date: 2026-11-08
- Scope: platform
- Goal: Require Codex to control disk usage during website development and to audit and safely clean up after every authorized deployment.

## Original user request

> update AGENTS.md on repo

Context supplied by the owner: the development and deployment systems have very limited disk space. Rebuildable artifacts should not be retained, duplicate local repos/worktrees should be avoided, and every deployment must end with cleanup and disk recovery where safe.

## Scope

Updated repository-wide Codex instructions in `AGENTS.md`. No changes to source code, active deployments, runtime data, worktrees, deployment scripts, production configuration, or other repositories. No actual disk cleanup was authorized or performed.

## Decisions

- Prefer one canonical checkout; review inactive worktrees, redundant checkouts and rebuildable artifacts before targeted deletion.
- Maintain a disk-cleanup inventory and document pending candidates in GitHub Issues, with before/after free-space measurements and actual recovered space.
- Make a post-deployment cleanup audit mandatory after successful, failed and rolled-back authorized deployment attempts.
- Preserve active website output and dependencies, a complete independently verified immediate rollback, unique/unpushed work, private stores, configuration, evidence and unrelated services.
- Follow existing rollback-retention approvals in `docs/DEPLOYMENT.md`; introducing an audit does not authorize deletion of protected rollbacks or production changes.
- Avoid broad destructive cleanup commands or deletion of files used by another Codex session.

## Implementation

Added a new `Disk Space, Build Artifacts, and Mandatory Cleanup` section immediately before the existing default Git workflow in `AGENTS.md`. It covers local and server storage, eligibility/safety checks, deployment audit/health verification, and mandatory reporting.

## Engineering impact

Codex is required to track storage consumption and safely remove inactive reproducible artifacts, with no new dependencies, executable behavior, external service or deployment. Direct-to-`main`, owner approvals and release safeguards remain intact.

## Files changed

- `AGENTS.md`: new storage and cleanup policy.

## Documentation updated

`AGENTS.md` is the documentation change. Its provisions refer to the existing `docs/DEPLOYMENT.md` and `docs/CLI_ACCESS.md` without modifying their historical release or rollback procedures. This journal records the owner request.

## Git diff summary

Implementation commit changed one tracked file with 73 added lines and no deleted lines. No source files, tests or dependencies changed.

## Verification

- Checked `eugenelin89/asymmetri` and confirmed that `main` was the GitHub default branch.
- Read the existing instructions, deployment retention requirements and journal format.
- Confirmed via GitHub API that the new policy exists on `main`, including required deployment audits, canonical checkout guidance, measured-recovery reporting, immediate rollback preservation and owner-approval boundaries.
- Reviewed GitHub implementation commit patch and confirmed only `AGENTS.md` changed.
- No local checkout, filesystem audit, build, lint, runtime test, physical-device check or production deployment was performed; this was documentation-only.

## Repository state after implementation commit

GitHub `main` pointed to `6346435130a3b42ec9048c31cb65b57489794533` after the policy commit, and the modified file was fetched from that branch. Local worktree status was not inspected because this update used GitHub's file API; no local worktree was used.

## Implementation commits

- `6346435130a3b42ec9048c31cb65b57489794533` — Require lean workspaces and post-deployment disk cleanup audits.

## Archive commit

Intended message: `Journal 199: document disk cleanup agent policy`

## Lessons learned

Disk hygiene must be routine and evidence-based. GitHub source recoverability does not imply that production data or executable rollbacks are disposable; measure free space instead of inferring recovery from directory sizes.

## Follow-up ideas

For a subsequent owner-authorized task, align future deployment runbooks/checklists with the new audit and inventory rules; inspect existing Mac/server storage before making cleanup decisions.
