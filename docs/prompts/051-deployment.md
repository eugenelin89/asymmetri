# Prompt 051: Same-Droplet migration preparation, snapshot and Linux rehearsal

- Date: 2026-10-09
- Scope: deployment
- Goal: Prepare a recoverable Ubuntu 24.04 rebuild of the existing Droplet/IP without erasing its disk or interrupting production.

## Original user request

> INFRA-01 Continuation — Rebuild Existing Droplet Instead of Creating a Replacement

> INFRA-01 Amendment — Snapshot Approval, Mandatory Cleanup, and Detailed Migration Documentation

The large requests selected a clean Ubuntu 24.04 LTS rebuild of the **existing**
DigitalOcean Droplet, retaining its identity, IP addresses, domains, applications,
data and existing behavior. They authorized safe preparation and independent
recovery tests, superseded the replacement-host/DNS-cutover strategy, and prohibited
erasure, production outage and INFRA-02 without later explicit authorization.

The continuation required review of previous commits and open BotSquad PR #35,
preservation of historical evidence, all 15 named host configurations plus default
behavior, and the 198-request reference baseline. Required recovery classes include
the exact live Next release, peer Django/SQLite, dormant PG 14, retained/static
files, Nginx/TLS, accounts, schedules and operating configuration. Test independent
copies and a compatible Linux environment; macOS builds or archive readability
alone cannot establish recovery. Verify cloud identity, IP/DNS/networking, emergency
console, SSH bootstrap and host-key handling. Prepare ordered operations, realistic
downtime evidence and snapshot rollback with no surviving original live disk.

The amendment explicitly approved necessary snapshot storage up to US$1.50/month,
required pricing/size/completion verification, and retained application-consistent
off-server exports. It mandated deletion of migration snapshots only after healthy
accepted migration, preserved data/IP/sites/access, documented observation and tested
independent recovery; verify exact deletion and cessation of storage accrual. It also
required detailed actual inventory, backup, chronological attempts/corrections,
restore outcomes, final configuration, downtime and completion evidence. Secrets,
private records and sensitive inventories must stay outside Git. Update Asymmetri
runbook/validation/supporting docs and the two-commit journal, plus the owned BotSquad
PR without changing Decision 029 or investment feature statuses. Use read-only
specialists and one writer. Report remaining gates without claiming migration.

Subsequent user replies:

> signed in

> try using botsquad, "ssh botsquad"

> can you just "ssh asymmetri" or "ssh asymmetri-admin"

> make sure clean up botsquad after use

These enabled authenticated cloud inspection and bounded testing on an existing
Linux host. Existing SSH permissions were used without renewed setup approval.
Cleanup was performed and verified. A separate specific private-payload transfer
question remained unanswered after automatic approval review rejected that transfer.

## Scope

Revised the active same-Droplet runbook and related documentation; rechecked live
production read-only; created the approved live snapshot; tested independent backup
copies locally and public pinned website source in an isolated Linux sandbox; updated
the existing BotSquad handoff. No rebuild, outage, DNS/firewall/SSH-policy change,
replacement Droplet, production app release, receiver activation or INFRA-02 work.

## Decisions

- Preserve the original proposal and initial validation as historical evidence;
  clearly supersede its replacement host, DNS switch and old-live-host assumptions.
- Keep the exact production release `745a92c676bcbe85c3aa675a1099d26321f1c1e2`.
  Newer repository main is documentation evidence, not a migration deployment target.
- Create a live snapshot under the existing approval without stopping production.
  Its 11.23 GB size implies US$0.6738/month before tax at the verified rate. This is
  supplemental crash-consistent rollback evidence, not the final frozen checkpoint.
- Require aggregate snapshot storage to remain within the cap. Mandatory deletion
  follows at least the documented healthy observation period, all acceptance and
  tested **current post-rebuild** recovery, rather than relying on stale old-OS exports.
- Keep backup passphrase and trusted hashes independent of the disk to be erased.
  Same-Mac copies prove independence from production but not separate-device custody.
- Do not conceal the retained-file restore failure: macOS case folding cannot
  represent 66 Linux filename collisions. Full archive verification still passes;
  exact Linux tree restoration remains required.
- Use task-only mount/PID/network namespaces, non-root execution, dropped capabilities,
  resource limits and separate public dependency acquisition on the authorized host.
  Do not modify BotSquad services, packages, data or persistent configuration.
- Respect automatic approval review's private-transfer block. No sensitive archive
  payload was sent; Django/PG/private configuration recovery remains incomplete.
- Treat successful SSH and console transport/login prompt separately from a verified
  emergency administrator shell. No password reset or security relaxation was made.

## Implementation

The runbook now contains an authority matrix, original inventory, secure recovery
classes, actual snapshot/cost evidence, network and access requirements, isolated
rehearsal contract, ordered unexecuted production steps, failure/rollback rules and
post-acceptance cleanup requirements. Validation records the actual continuation
chronology, failed/corrected attempts and Linux cleanup before preserved initial
evidence. Supporting onboarding, deployment, architecture, access and maintenance
guidance now points to the same-Droplet strategy and outstanding recovery gates.

## Engineering impact

No application behavior, architecture, dependency, accessibility or deployment was
changed. The resource effect is one approved temporary paid snapshot. Public-source
Linux testing consumed bounded existing-host resources and removed all task files
afterward. Production versions, source/build, service identities and DNS remained
unchanged. Private receipts, scripts, encrypted archives and recovery material stay
outside source control with restricted permissions.

## Files changed

The migration runbook and validation ledger contain the substantive operational
work. README, architecture, deployment, CLI-access and server-maintenance documents
align their current guidance. The separate BotSquad commit updates project memory,
investment README/roadmap and the existing execution-plan handoff only.

## Documentation updated

These seven Asymmetri documents are the implementation. The original journal 050
was not rewritten. BotSquad links are pinned to this continuation's implementation
commit; its INV/INV-ASK status table, contracts and Decision 029 are unchanged.

## Git diff summary

Asymmetri implementation: **7 files changed, 577 insertions, 203 deletions**. Most
changes replace the active migration procedure while retaining original evidence.
BotSquad continuation: **4 files changed, 68 insertions, 18 deletions**. This prompt
record is excluded from both implementation summaries.

## Verification

- Clean Asymmetri main and ff-only pull at f75f6f2; owned BotSquad branch matched
  bc97c88 and PR #35 remained open/unmerged before editing.
- Verified account Droplet identity against metadata, assigned IPv4/IPv6/VPC, SFO3,
  existing resource plan and absence of attached cloud firewall. DNS queries repeated
  for all 15 entries; no published AAAA or assigned-address PTR answers observed.
- Completed snapshot row showed 11.23 GB/SFO3; Activity recorded 2 minutes 8 seconds.
  Numeric image ID/minimum restore disk and final frozen recovery remain pending.
- Independent copied ciphertext hashes/decryption passed without production access.
  SQLite integrity/FK/canonical data matched; site/configuration, PG files and public
  access files extracted/verified on Mac. Retained exact-tree extraction failed on
  case collisions; full decrypt/gzip/tar verification passed. Linux metadata/runtime
  and whole-host recovery were not inferred from those tests.
- Isolated Ubuntu 24.04.5 x86_64 / Node 22.23.1: pinned Next 16.3.6 checks, production
  build, native Sharp operation, startup and 22 application requests passed. Existing
  tutorial warning only; exact www tutorial canonical retained.
- First Linux build exhausted 900 MiB RAM/256 MiB swap. Successful retry retained
  900 MiB RAM and allowed 1536 MiB swap, completing the offline test unit in 219.421 s.
  Combined 1 GiB production capacity remains unverified. Other failed attempts and
  minimal test-only corrections are preserved in the validation record.
- No private payload transfer or Django/PG runtime restoration occurred. Official
  Python/PG package acquisition verification is not runtime recovery acceptance.
- BotSquad cleanup at 18:37:09 UTC removed 36,650 files / 1,592,376,700 regular bytes.
  Task directory absent; no task processes/running units; HQ service identity/start
  time and network listeners unchanged; no host packages installed.
- Production 198-request comparison passed with zero differences after snapshot;
  service identities/start times, source/build, peer source state and Nginx syntax
  unchanged. No production maintenance outage occurred.
- Local Node 24.10.0 `npm run check`, seven infrastructure-helper tests, changed
  Markdown relative links and `git diff --check` passed. No application/dependency
  edit warranted a second local build; the exact production source built on Linux.
- Read-only specialists reviewed recovery, Ubuntu/capacity, snapshot/network/access
  and roadmap boundaries. Final review corrected the swapfile command to fail safely
  on existing files/symlinks and clarified Droplet ID versus account identity.

## Repository state after implementation commit

Asymmetri main at f2964bdef68779b7c5d6e4d136821c78e30e7cb4, clean before this journal,
one commit ahead of origin/main. No feature branch, worktree or Asymmetri PR created.
BotSquad's existing isolated branch at 745395055293cfb1604816909ff3db7ac3cb5f9b was
pushed; PR #35 remains open for review. Push Asymmetri main after the journal commit.

## Implementation commits

- Asymmetri: `f2964bdef68779b7c5d6e4d136821c78e30e7cb4` — Document INFRA-01 same-Droplet recovery preparation and rehearsal.
- BotSquad: `745395055293cfb1604816909ff3db7ac3cb5f9b` — Update INFRA-01 handoff for same-Droplet recovery gates.

Initial preparation commits 50fb207/f75f6f2 and BotSquad bc97c88 remain historical.

## Archive commit

Record INFRA-01 same-Droplet continuation engineering journal

## Lessons learned

Archive verification, filesystem extraction, application startup, whole-host recovery
and live production acceptance are different evidence levels. Same-Droplet erasure
removes all on-disk rollback releases; recovery must exist independently. Limited
memory makes swap preparation a prerequisite, but one successful isolated build does
not establish combined production capacity. Cleanup requires verified absence and
unchanged host state, not merely issuing a deletion command.

## Follow-up ideas

No additional workstream selected. INFRA-01 remains blocked until private recovery,
case-sensitive files, Django/PG/Nginx/TLS/access/schedules, independent custody, target
bootstrap/image/snapshot details, emergency shell and capacity/timed run sheet pass.
Only then seek explicit maintenance-freeze/outage and same-Droplet rebuild approval.
Post-migration observation, current recovery tests and mandatory snapshot deletion
remain future completion gates. INFRA-02 is not started.
