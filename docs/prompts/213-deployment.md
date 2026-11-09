# Prompt 213: Audit and reclaim website storage on the Mac and production host

- Date: 2026-11-09 UTC
- Scope: deployment
- Goal: Reclaim inactive website storage on both hosts and verify the deployed site, recovery copies and peer services.

## Original user request

> Perform a comprehensive disk-space audit, aggressive safe cleanup, and final disk-space audit for `eugenelin89/asymmetri`.
>
> Cover both the **local development Mac** and the **DigitalOcean production server**.
>
> Follow `AGENTS.md`, `docs/DEPLOYMENT.md`, `docs/CLI_ACCESS.md`, and the mandatory disk-cleanup policy.
>
> ### Phase 1 — Before-Cleanup Audit
>
> 1. Measure actual free disk space in bytes and GiB on both systems.
> 2. Identify the largest directories and disk consumers.
> 3. Inventory Git repositories, branches, worktrees, build outputs, dependencies, caches, staging directories, temporary files, deployment copies and rollback archives.
> 4. Verify GitHub push status, active processes, deployed source/build identity, production health and rollback integrity.
> 5. Classify each cleanup candidate as safe to delete, protected, or requiring further approval.
>
> ### Phase 2 — Aggressive Cleanup
>
> **I authorize aggressive removal of verified safe, inactive and reproducible files.**
>
> Apply these principles:
>
> - Maintain one canonical development checkout.
> - Remove obsolete worktrees, duplicate repositories and redundant local copies after verifying clean, pushed state and no active use.
> - Remove inactive, rebuildable `.next`, `dist`, `node_modules`, test outputs and caches.
> - Remove obsolete deployment staging directories, temporary builds, transfers and disposable artifacts.
> - Remove redundant files already recoverable from GitHub or reproducible from documented build procedures.
> - Review old rollback directories and archives against the approved retention policy.
>
> **Never delete** the active production runtime, complete verified immediate rollback, persistent databases, user data, credentials, unique/unpushed work, protected archives or files used by active processes.
>
> Do not force deletion when safety or retention is uncertain. Never use indiscriminate recursive cleanup.
>
> ### Phase 3 — After-Cleanup Audit
>
> 1. Measure free disk space again on both systems.
> 2. Report **actual bytes and GiB recovered**, not merely estimated directory sizes.
> 3. List removed directories and their sizes.
> 4. List large retained items and why they remain.
> 5. Verify production website health, other hosted services and rollback integrity.
> 6. Confirm that the repository and GitHub state remain correct.
> 7. Identify any further cleanup opportunities requiring my approval.
>
> ### Documentation
>
> Publish the complete before/after audit, cleanup results, remaining candidates and verification evidence to the relevant GitHub Issue.
>
> Follow the required engineering journal and timestamped prompt/response logging policies.
>
> Do not modify application functionality, redeploy, restart services or change backup retention.
>
> **Complete all three phases in this session. Stop only if a proposed deletion requires additional approval.**

The owner clarified while the audit was running:

> i am no longer using anything for this project. its deployed and i am done. be as aggressive with your cleanup as you can to free disk space

## Scope and decisions

The operator confirmed that local development was finished. The cleanup used the existing lossless older-runtime retention procedure on production, preserving the active and immediate-predecessor releases in full. The Mac retained the canonical checkout, separately provisioned recordings and private retention materials. The npm cleanup selected public tarballs matching the project's lockfile. Git repacking explicitly preserved unreachable objects. Temporary files with uncertain recovery value remain.

## Implementation and engineering impact

Five expanded rollback directories became individually verified server-side archives. Sixty-one October transfer, cache and staging targets passed individual checks and were removed. The [audit receipt](../WEBSITE_STORAGE_AUDIT_2026-11-09.md) lists the size of each removed directory, archive checksums, capacity measurements and remaining candidates. User-facing application functionality, configuration, dependencies and service activation were outside the maintenance work.

## Files changed and documentation updated

The audit records the measured results for both systems. The deployment and server maintenance guides link to the new recovery inventory so an operator can distinguish expanded and archived releases. The complete sanitized report was also [published on the existing custody issue](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6733061607).

## Git diff summary

Three documentation files changed, with 63 insertions. The implementation commit contains the maintenance receipt and two recovery-guide entries.

## Verification

The production filesystem gained 4,400,189,440 bytes. Mac free space gained 2,565,910,528 bytes during the audit, with 223,031,296 bytes of change across the two website cleanup windows. Production checks compared 22 results on three origins, 15 host baselines, 62 configuration fingerprints, live and rollback assets, intact service process identities and the complete predecessor runtime fingerprint. Archive and Git integrity checks passed. The unresolved historical custody gap remains documented on issue #5. Documentation whitespace validation passed. Application tests/builds were unnecessary for these maintenance-only changes.

## Repository state after implementation commit

Clean canonical main at `82cbe48b4bf20cac1712819c7a8c6aab5deee08f`, one commit ahead of the previously verified GitHub main. One physical checkout, six local branches and all original Git object IDs preserved.

## Implementation commits

- `82cbe48b4bf20cac1712819c7a8c6aab5deee08f` — Record website storage audit and verified rollback archive locations

## Archive commit

`Journal 213 — record website storage maintenance`

## Lessons learned

Keep a current list of recoverable archives and verify their present custody before relying on historical records. Compare whole-volume measurements with the smaller cleanup-window measurements when other work is using the same Mac.
