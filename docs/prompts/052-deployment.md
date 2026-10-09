# Prompt 052: Recovery verification and archival Django retirement plan

- Date: 2026-10-09
- Scope: deployment
- Goal: Verify independent recovery and simplify the existing INFRA-01 rebuild by preparing archival Django retirement without changing production.

## Original user request

> INFRA-01 Continuation — Complete Recovery Verification and Prepare Existing Droplet for Ubuntu 24.04 Rebuild

The continuation required review of existing evidence and the owned BotSquad PR,
local private restoration where possible, isolated Ubuntu verification without
sensitive production payloads on BotSquad, all-site recovery, account/snapshot/image/
console/bootstrap checks, capacity analysis, a timed rebuild/rollback plan and
mandatory test cleanup. Distinguish actual private recovery, synthetic compatibility,
prepared commands and unperformed production acceptance. Preserve historical failure
records, exact live release, same Droplet/IP/DNS, snapshot budget/deletion conditions,
shared-site boundaries, read-only specialist roles and the existing Git/journal/PR
workflow. No destructive rebuild, live outage or INFRA-02 without separate approval.

The owner asked about the console screenshot:

> what is this for?

> do i need to log in? i don't know what pair of id/password to use

The response explained emergency Linux-console access versus normal SSH. Subsequent
read-only password-status inspection found root/admin password entries locked; no
password was guessed, requested, reset or exposed. Emergency login remains unresolved.

> # INFRA-01 Amendment — Retire Django and Simplify Ubuntu Migration
>
> Important change to the ongoing INFRA-01 work.
>
> The Django application currently hosted on the existing DigitalOcean Droplet is no longer needed. I would prefer to **retire it rather than migrate it as an active service** to Ubuntu 24.04.
>
> Please adjust the current work accordingly.
>
> ## Updated requirements
>
> 1. **Stop prioritizing full Django runtime restoration.** First determine whether it is still required for any other active application or service.
> 2. **Preserve Django before retirement.** Ensure its source code, SQLite database, media, settings, and necessary recovery information are securely archived off-server, with verified integrity and documented recovery instructions.
> 3. **Investigate PostgreSQL 14.** Determine whether the dormant PostgreSQL installation belongs to Django or another application. If no longer needed operationally, preserve its data in a verified archive rather than reinstalling it on Ubuntu 24.04.
> 4. **Retain the existing domain names and DNS records.** For the former Django website, recommend either a lightweight static retirement page or an HTTP 410 response. Do not change public behavior until I approve the retirement approach.
> 5. **Simplify the Ubuntu migration.** Remove unnecessary Django, Gunicorn, Python application, and PostgreSQL runtime installation requirements once their dependencies and archival obligations have been verified.
> 6. **Reassess server resources.** Estimate how much RAM, CPU, storage, and operational complexity the retirement would save. Determine whether the existing 1 GB RAM Droplet will be sufficient.
> 7. **Update documentation thoroughly.** Record the retirement decision, dependencies, archived data, service configurations, domains, recovery methods, and changes to INFRA-01 acceptance requirements.
>
> ## Safety boundaries
>
> - Do not delete Django or PostgreSQL data.
> - Do not stop or disable the live Django service yet.
> - Do not modify production Nginx or DNS yet.
> - Do not transfer sensitive production archives to BotSquad without explicit authorization.
> - Preserve the existing Droplet and IP address.
> - Preserve the approved DigitalOcean migration snapshot.
> - Do not perform the destructive Ubuntu rebuild without separate approval.
> - Do not start INFRA-02.
>
> Continue all other independent INFRA-01 work.
>
> Before performing the actual Django retirement, report its dependencies, preservation evidence, recommended domain behavior, and the precise service changes for my approval.
>
> The goal is to **simplify migration without losing valuable historical data or disrupting unrelated websites**.
>
> Please incorporate this change into the current execution plan rather than starting a separate milestone.

## Scope

Continued INFRA-01 recovery testing and read-only inventory, then incorporated the
retirement amendment. Prepared reviewable domain/service changes and archive recovery
instructions. Updated the existing BotSquad documentation branch/PR, preserving its
feature status and authority boundaries. No production retirement, configuration
change, service interruption, destructive rebuild, paid resource creation, snapshot
deletion, deployment or INFRA-02 work occurred.

## Decisions

- Link PG to the dormant draft through its settings, while retaining the **entire**
  cluster because ownership of every database was not enumerated. The live peer and
  other retained Django projects select SQLite; no other active consumer was found.
- Keep source/settings/static, consistent SQLite, full cold PG/configuration/WAL,
  exact package/source metadata and recovery instructions. Preserve shared users,
  groups, OS Python and certificates; application names do not imply exclusive owners.
- Add the previously omitted PG certificate/key dependency as an encrypted supplement,
  verify its key match and independent copy, and never send it to BotSquad.
- Replace full active Django/PG target runtime installation with archival acceptance
  after final frozen capture and retirement approval. Actual private PG runtime
  recovery remains an explicit limitation, not a claimed pass.
- Recommend a static HTML notice with HTTP 410 for the former Django site, retaining
  domains/DNS/TLS. Keep its original public behavior until approval. The dormant
  draft 502 response is a separate optional behavior decision.
- Stop and later disable **both** active socket and service in the proposed retirement
  sequence. Preserve data and original routing for rollback; no package purge.
- Retain the existing 1 GB plan provisionally with 2 GiB swap; measured idle/synthetic
  evidence supports this but does not prove whole-host peak or build capacity.
- Separate actual private Mac recovery from synthetic Linux runtime/ownership tests.
  Do not weaken privacy constraints to produce a stronger acceptance label.

## Implementation

Added an operator-only restoration helper that validates trusted ciphertext/member
manifests, safe paths, full content/membership, links and modes into a new case-sensitive
private destination. Explicit flags cover reviewed absolute links, special modes,
Linux ownership and audit-only extended metadata. It never executes restored files,
overwrites an existing directory, contacts the network or performs cleanup.

Added the retirement dependency/preservation/recovery/proposal document, revised the
active migration acceptance and run sheet, and prepended a current validation ledger
while preserving earlier evidence. Supporting onboarding/deployment/access/architecture/
maintenance/testing guidance and helper documentation now align. A private approval
sheet contains exact domains, units, paths, command sequence and proposed Nginx notice.

## Engineering impact

The future target becomes Node/Next, Nginx and surviving static/retired responses,
without unused Django/Gunicorn/application Python or PG installation. Actual production
is unchanged. Retirement removes roughly 36 MiB currently charged RAM and 20 MiB swap;
CPU savings were negligible during idle sampling. Omitting runtime reinstall avoids
approximately 115 MiB before dependency/version differences. Archived data is not disk
space reclaimed. The main benefit is simpler runtime maintenance and fewer writers.

## Files changed

Asymmetri: restoration helper and adversarial tests; operator helper instructions;
retirement proposal; migration/validation evidence and six supporting guides.
BotSquad: project memory, existing execution plan and investment guide/roadmap.
No website routes/content/assets/dependencies, receiver code or runtime grants changed.

## Documentation updated

The new retirement document owns dependencies, preservation, recovery, proposed
response/service changes and capacity estimates. Migration/validation distinguish
new acceptance from prior requirements. Earlier journals remain unchanged. BotSquad
links the exact Asymmetri implementation; its INV/INV-ASK status table, Decision 029,
contracts and prior feature validation are unchanged.

## Git diff summary

Asymmetri implementation: 12 files changed, 776 insertions, 42 deletions. This includes
341 lines for the new restoration helper/tests and detailed current recovery/retirement
guidance. BotSquad: 4 documentation files changed, 88 insertions, 9 deletions. This journal is excluded from both implementation summaries.

## Verification

- Clean Asymmetri main/ff-only preflight at 49adcf6; owned BotSquad branch 7453950 and
  PR #35 open/unmerged. No new Asymmetri branch, worktree or PR.
- Actual retained archive: 42,605 entries on encrypted case-sensitive Mac storage,
  preserving 66 collisions, content, hardlink inodes, symlinks and non-symlink modes.
  Numeric owners were audited, not applied; no ACL/xattrs found. Test volume noexec/
  nosuid/nodev; no retained binary executed. Temporary image/key removed afterward.
- Actual copied SQLite: network-denied Mac Python 3.12, Django checks, zero pending
  migrations, integrity/FKs and 10 read journeys pass. Read-only database unchanged,
  then removed; actual private Linux runtime restoration not claimed.
- Current production 216 non-DB application files match archived content/metadata;
  source/settings/static preserved, no configured uploads found. Final live-data
  checkpoint remains due at approved retirement because the service remains writable.
- Cold PG archive/control/config verification retained; supplemental certificate/key
  archive and independent same-Mac copy hash/decryption/key-pair checks pass. Real PG
  was never started. Synthetic PG 14.24 cold copy/checksums/restart/logical/amcheck pass.
- Synthetic Ubuntu Django: 16 request/form/CSRF/admin checks, integrity/FKs and 128
  collected static files pass. Original setuptools 59.6.0 fails on Python 3.12;
  isolated 68.2.2 adaptation passes on Mac and Linux; production pins unchanged.
- Exact pinned Next release rebuilt offline on Ubuntu. Combined Next/Gunicorn/Nginx
  passed 37 initial and 300 load requests within aggregate 512 MiB RAM / 256 MiB swap / 50% CPU
  bounds. In-unit kernel peak 130.71 MiB, zero swap/OOM/memory-limit events. CPU throttled;
  four-worker pool at 4 requests/second did not demonstrate sustained four-way concurrency.
- Production 16-sample/30.49-second read-only observation found 413.71–413.93 MiB available,
  no swap I/O/OOM, unchanged service identities. Invalid zero PSS samples excluded.
- UI verified Ubuntu 24.04 x64 and retained snapshot as choices for existing Droplet;
  form cancelled. Console encrypted transport worked; OS passwords locked. Original
  custom cloud-init user-data empty. No rebuild or credential reset.
- BotSquad cleanup at 19:24:58 UTC: 44,984 files/1,733,402,849 regular bytes removed; task
  processes/units absent; HQ identity/listeners/package inventory unchanged. No private
  payload transferred or host package installed. Mac plaintext/runtime cleanup verified.
- 16 Python tests: 14 pass/2 platform skips on default Mac; restorer 9 tests: 8 pass/1 inverse
  platform skip on case-sensitive Mac and Ubuntu. Separate synthetic Linux numeric
  owner fixture passes. Optimized-mode safety checks pass without assert reliance.
- Relative Markdown links and git diff --check pass. No app/dependency changes required
  another full local website build; exact live website Linux build evidence is recorded.
- Read-only security/capacity/roadmap review; corrected run-sheet socket shutdown,
  evidence-level wording, measured RAM versus swap and concurrency interpretation.
  Attempts and corrections remain in private receipts, not raw logs in this journal.

## Repository state after implementation commit

Asymmetri main at 2ee9f53bca5ce924ff0a383ce6e4ba66517b3251, clean before this journal,
one implementation commit ahead of origin/main. The owned BotSquad branch receives
documentation commit f4495ed56a878c4aa0642830843b0e60a5d82d77 and remains open for review in PR #35. Push Asymmetri main
after the journal commit; no merge, release, force push or production deployment.

## Implementation commits

- Asymmetri: `2ee9f53bca5ce924ff0a383ce6e4ba66517b3251` — Prepare Django retirement and verify INFRA-01 archival recovery.
- BotSquad: `f4495ed56a878c4aa0642830843b0e60a5d82d77` — Update INFRA-01 handoff for archival Django retirement.

## Archive commit

Record INFRA-01 recovery verification and retirement amendment journal

## Lessons learned

A socket is part of a service retirement boundary. Archival preservation, actual
application recovery, synthetic compatibility and whole-host acceptance are different
claims. Preserve all dormant database data when historical ownership is incomplete.
Same-Mac copies protect against server erasure but not loss of the Mac. Measure live
cgroup peaks while the unit exists; post-exit summaries can be misleading. Retiring
unused runtimes simplifies recovery without granting permission to delete their data.

## Follow-up ideas

No new milestone selected. Seek approval for the exact retirement response/service
changes and window, then capture final data. Resolve separate custody and emergency
console/bootstrap, finish surviving-site target acceptance and timed rollback, then
request the separately authorized destructive rebuild. Retain the snapshot until
post-rebuild recovery and healthy observation permit mandatory cleanup. INFRA-02 is
not started. Status: INFRA-01 RECOVERY PARTIALLY VERIFIED — SPECIFIC BLOCKERS REMAIN.
