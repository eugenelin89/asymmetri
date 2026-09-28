# Prompt 025: Server disk cleanup and science-fair retirement

- Date: 2026-09-28
- Scope: deployment
- Goal: Recover server disk space while preserving active websites and retire the science-fair project as explicitly authorized.

## Original user request

> go into the server for asymmetri.co and aggressively audit and clean the disk to clear out room.

Follow-up messages, in order:

> what is the running relay service for?

> yes, I know what it is, it is for Christopher's science fair back in April. Is it taking up a lot of space?

> remove them then

> relay can be stopped and removed as well.

> science fair source and results taking how much space?

> remove them as well. important code already in github

## Scope

Audit filesystem capacity, caches, deployments, package revisions, logs, process
references, and hosted-site health. Clean verified disposable storage. Explain the
relay and its footprint, then remove the environment, relay process, and remaining
project under the owner's successive authorizations. No website application release,
OS upgrade, reboot, database deletion, or unrelated-site removal was performed.

## Decisions

- Preserve active website dependencies, source, builds, databases, swap, certificates,
  the complete latest Asymmetri rollback, and its compressed archive.
- Remove package download caches before touching project files. Delete only generated
  files from old Asymmetri copies after confirming history and absent live references.
- Account for hard links: staging dependencies shared inodes with the retained rollback,
  so removing their old paths did not reclaim a second full dependency tree.
- Use snap's revision-specific removal for eight disabled revisions and then remove
  only unreferenced snap cache files; keep current revisions and seed data.
- Rotate and vacuum archived journals once; retain recent logs without adding a timer
  or changing persistent logging policy.
- Inspect the relay source and explain that its HTTP queues use Python's standard
  library. The 5.3 GiB environment mainly held unrelated training dependencies.
- After explicit authorization, stop the identified relay, remove its environment,
  and replace both proxy targets with HTTP 410 while preserving TLS and host routing.
- After the owner reviewed the remaining 874 MiB and confirmed important code was on
  GitHub, delete that exact project directory, including local history and results.
  Do not claim that every result was independently verified on GitHub or backed up.

## Implementation

Recovered approximately 12.8 GiB. Root filesystem usage fell from 99% to 46%;
available capacity rose from 316,329,984 to 14,081,327,104 bytes (about 13.1 GiB).
The retired project's entire directory is absent and port 8080 is no longer listening.
The two former relay endpoints return HTTP 410. Original proxy configurations and
package-version metadata remain in a small root-only administrative backup.

## Engineering impact

No Asymmetri source, dependency, build, asset, or application process change was
needed. Nginx was validated and gracefully reloaded for relay retirement; Asymmetri
and Buildclub application PIDs stayed unchanged. Research execution would require
recovering source and recreating dependencies. The local research results were
intentionally deleted, not archived. Other websites retain their previous behavior.

## Files changed

Server changes comprise verified cache/generated-output removal, disabled snap
revision removal, the retired science-fair project, and two relay proxy location
blocks. Repository changes document maintenance, recovery inputs, and the correct
executable rollback location. No website implementation files belong to this task.

## Documentation updated

Added Server Maintenance and corrected Deployment's description to reflect final
project removal. Small README/Deployment crosslinks and rollback-path edits made by
this task were captured concurrently in another task's Work-navigation commit;
those changes were preserved without rewriting that task's work.

## Git diff summary

Dedicated implementation: 2 files changed, 87 insertions and 1 deletion. Most content
is the maintenance receipt and cleanup boundaries. Shared documentation changes
captured by the concurrent commit are noted separately below; its website changes
are outside this task. This journal is excluded from its own summary.

## Verification

- Initial local main was clean and its fast-forward pull succeeded.
- Metadata-only disk audit covered directory sizes, large files, inodes, deleted-open
  files, service identities, listeners, runtime paths, and package/revision state.
- Old July source was clean and an ancestor of production. No process or startup
  references pointed to the obsolete generated deployment output.
- Live build/lockfile and retained rollback build hashes matched before and after
  cleanup; the rollback Next executable and build remained available.
- Nginx configuration validation passed before reload and afterwards.
- All eight then-live Asymmetri pages plus robots/sitemap returned HTTP 200 on apex
  and www; the protected Motion routes were included before and after cleanup.
- Other checked hosted sites retained baseline status. The draft site returned HTTP
  502 before maintenance and remained an unrelated existing issue.
- Both former relay health endpoints returned HTTP 410; the process and listener
  were absent. No other live process referenced the project before its deletion.
- Website health checks passed again after final project removal.
- git diff --check passed. Application build/lint tests were not rerun for this
  documentation-and-server-cleanup task; application source and dependencies were
  unchanged by it. The parallel website task owns its own validation and release.

## Repository state after implementation commit

Local main at b479fb71699a42997768a5833436e237c9fd998d, two commits ahead of the
last observed origin/main; the other commit belongs to concurrent website work.
Only this task's documentation was included in its dedicated implementation commit.
The serving application remained on its previous release during this cleanup.
No branch, worktree, or pull request was created. Journal commit and push follow.

## Implementation commits

- b479fb71699a42997768a5833436e237c9fd998d — docs: record server disk cleanup and science-fair retirement.
- Concurrent 973f92e311dc612df2d080eaa332172582dc43d9 contains this task's small
  README/Deployment crosslinks and rollback-target updates alongside the other
  task's website implementation. That commit was not created by this task.

## Archive commit

`docs: journal server cleanup and science-fair removal`

## Lessons learned

Measure physical recovery with df because hard-linked trees distort per-directory
size totals. Check runtime source and active references before deleting a large
Python environment. Explain remaining unique research data separately from caches;
record explicit authorization before deleting it. Shared-checkout tasks can capture
one another's documentation edits, so use narrowly scoped commits and inspect HEAD.

## Follow-up ideas

The pre-existing draft-site HTTP 502 remains outside this task. No recurring cleanup,
OS lifecycle change, or automatic research recovery is promised by this maintenance.
