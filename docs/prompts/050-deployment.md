# Prompt 050: INFRA-01 Ubuntu LTS migration preparation

- Date: 2026-10-09
- Scope: deployment
- Goal: Prepare a recoverable fresh-LTS migration of the shared production host while preserving every existing site and respecting resource/cutover gates.

## Original user request

> Asymmetri Infrastructure — INFRA-01: Ubuntu LTS Migration and Existing-Site Acceptance

The owner supplied a detailed INFRA-01 execution request. Audit the entire existing
DigitalOcean server, verify all hosted websites and protected Motion routes, record
source/build identities independently of newer GitHub main, prepare verified backups
and a fresh Ubuntu 24.04 LTS replacement, and preserve services, credentials, data,
networking and existing failures/retirement states. Evaluate 26.04 only on technical
merit. Do not directly upgrade unsupported 22.10 to 24.04 or boot the old snapshot
as the replacement LTS system.

The request authorizes safe preparation and existing-resource work, but requires
separate explicit approval for new cloud costs, production traffic changes,
service disruption and destruction. Complete independent work before reporting a
gate. Never infer authority from elapsed time or available administrator access.
Prepare deterministic final synchronization, single-writer cutover, post-cutover
acceptance and rollback that preserves newer writes. Keep the old host until a
separate retention/destruction decision. Use read-only specialists with one primary
writer. Keep secrets and private inventory outside Git.

Update Asymmetri operational documentation and its two-commit engineering journal;
push main without deploying it. Use BotSquad's separate isolated documentation
branch/PR process to distinguish INFRA-01 from later owner-selected INFRA-02. Preserve
investment contracts, statuses, Decision 029's US$0 market-data rule and private HQ.
Do not start INFRA-02, generate its prompt, activate the receiver, begin INV-03,
redesign the website, buy resources or claim migration completion from local tests.
The final report must name one of the supplied bounded outcomes.

## Scope

Current production inspection, DNS/TLS/HTTP baselines, encrypted off-server
selected-file/data exports, isolated SQLite restoration, migration/cost/cutover/
rollback design, a reusable read-only HTTP comparison helper, local source checks,
independent review and both repositories' documentation handoff.

No target provision, paid snapshot, production routing/DNS/firewall/SSH change,
service restart, website release, cleanup, receiver/HQ change or destructive action.
The original Ubuntu 22.10 host remains live. Full runtime restoration and LTS staging
are unresolved acceptance gates, not completed phases.

## Decisions

- Prefer a fresh Ubuntu 24.04 amd64 Droplet in the original region, with 2 GiB RAM
  provisionally recommended. Public price is $12/month before taxes/overage; exact
  image/size/account availability and charges remain unverified while signed out.
- Preserve production website SHA 745a92c and its actual build. New main's Next patch
  and disabled receiver are not silently deployed through an OS migration.
- Inventory all 15 named hosts through redacted public groups and restricted exact
  operator records. Retain inactive draft 502 and retired relay 410 behavior.
- Preserve the peer Django production-only settings overlay and SQLite separately
  from source repositories. Preserve the cleanly stopped PostgreSQL 14 cluster and
  other retained user environments without reviving them or copying native binaries
  into a new runtime. PG14's approaching support end requires later consideration.
- Use consistent SQLite backup API, encrypted transfer, private restoration and
  integrity/FK/canonical-data comparison. Do not label tar checks as runtime restore.
- Keep recovery key/checksum custody and all-host restoration as explicit pre-cutover
  gates. Never permit two authoritative writable database copies.
- No renewed Node22 runtime permission requested; established approval still applies.

## Implementation

Added the migration runbook, evidence-level validation ledger and an operator-only
Python/curl baseline comparator. The comparator preserves TLS and Host/SNI under
controlled resolution, records status/redirect/content/markup/resource contracts,
rejects credential-bearing URLs and transport failures, and keeps private evidence
outside Git. No website runtime dependency or product behavior changed.

Read-only production work accounted for OS/APT/packages, boot/storage/time,
services/listeners, all Nginx sites, certificates/renewal, host firewall, ownership,
source overlays, databases, scheduled work and retained projects. Encrypted backups
cover selected site/configuration/TLS material, consistent SQLite, cold PG14 and
retained non-serving user environments/public access mappings. The source host and
its complete immediate-predecessor website rollback remain available.

BotSquad receives a separate infrastructure checkpoint table, guide/memory links
and a narrow execution plan, pinned to the Asymmetri implementation evidence.
INFRA-02 remains planned and unselected; feature milestone statuses are unchanged.

## Engineering impact

New operations documentation and read-only verification tooling only. No package,
application, asset, client interaction, persistence, publication or authority change.
Sensitive operational material is stored in restricted local administrator storage,
with encrypted archives. Neither client nor server SSH private keys were copied.
Existing cloud charges and possible ordinary transfer usage are not an audited bill.

## Files changed

- Added migration and validation records, and linked them from onboarding,
  architecture, access, deployment, maintenance and testing documentation.
- Added the HTTP evidence helper, focused tests and usage documentation under ops.
- BotSquad's separate branch changes only Project Memory, investment guide/roadmap
  and its documentation execution plan.

## Documentation updated

README, Architecture, Deployment, CLI Access, Server Maintenance and Testing now
point to the owner-selected migration and accurately retain unsupported live-OS
status. The two new INFRA-01 documents own detailed phases, sources, costs, backup
qualifications and outstanding gates. Local development/runtime/product documentation
needs no behavior change. Historical journals and existing investment contracts stay
unchanged.

## Git diff summary

Asymmetri implementation: 11 files, 767 insertions. This adds preparation/evidence
and an operator helper with seven focused tests, without changing serving code.
BotSquad implementation: four documentation files, 92 insertions. Its existing
investment status table remains byte-identical. This journal is excluded from its
own summary.

## Verification

- Started on clean synchronized Asymmetri main at 66a882d; normal ff-only pull passed.
- Inspected real Ubuntu 22.10/kernel 5.19/x86_64 host, SFO3, 1 vCPU, 956 MiB RAM,
  2 GiB swap and approximately 44% disk use. Final source/build and three primary
  service PIDs/start times matched; approximately 13.55 GiB remained available.
- Recorded 198 TLS-verified HTTP(S) requests and 15 externally verified certificates.
  Final 198-request comparison had zero differences, including protected Motion
  routes, tutorial assets and expected 502/410 behavior.
- SQLite isolated restore passed full integrity/FK checks and deterministic schema/
  data comparison. No private records were printed. Raw byte/dump differences across
  backup/runtime versions were investigated rather than treated as proof of loss.
- Configuration/site archive: 1,815 source-verified entries; PG14: 2,404;
  retained user environments: 42,605. Decrypt/gzip/tar checks and source hashes,
  modes, owners and links matched. Two extra historical authorized public keys
  were separately encrypted and archive-verified. No full-host or PG runtime
  restoration claim is made.
- Initial configuration tar exit 2 was one nonexistent optional public-key path.
  The complete stream passed integrity checks, corrected independent source
  inventory exited 0 with exactly the same members, and every member matched.
  Acceptance is qualified selected-file recovery, not an unqualified successful
  initial export. A separate empty first SQLite attempt is not accepted as backup.
- Node24.10.0 matches .nvmrc; nvm unavailable. Check, Next build and Vinext build
  passed. Existing tutorial lint, route-classification and Browserslist notices
  remain. Audit initially lacked sandbox DNS; authorized network rerun found zero
  production vulnerabilities. No dependency change was made.
- Seven helper tests pass. Independent reviewers reproduced a resource-reference
  false-pass; added selected resource/metadata/form hashing and regression coverage,
  then recaptured and compared the complete baseline.
- Diff whitespace, local links and focused private-reference scans passed.
  BotSquad's execution-plan template whitespace was corrected before commit.
- Read-only Linux/recovery/security, LTS/cost/acceptance and roadmap reviewers found
  no remaining blocker for preparation, while preserving all actual migration gates.

Not validated: new-host Linux compatibility, fresh LTS application startup, full
critical-state runtime restoration, cloud recovery/account configuration, every-site
candidate browser acceptance, TLS renewal on the target or production cutover.

## Repository state after implementation commit

Asymmetri main is at 50fb207, clean before creating this journal and one commit
ahead of origin/main. This journal is the separate second commit; both will be
pushed together. Production remains independently pinned to 745a92c.

BotSquad uses its isolated feature/infra01-documentation-handoff branch at bc97c88,
from freshly fetched origin/main 5ad0466. Its existing primary and other worktrees
are untouched. Branch publication and its normal documentation PR follow evidence
publication; no BotSquad runtime deployment or main integration is implied.

## Implementation commits

- Asymmetri: `50fb207ffbd752ebd1d3d2a0e35c3612826b16dd` — Prepare INFRA-01 LTS migration and verified site baselines.
- BotSquad: `bc97c881a83e969d3f21ed56bf07c93b958588a9` — Document separate INFRA-01 and INFRA-02 checkpoints.

## Archive commit

`Record INFRA-01 preparation engineering journal`

## Lessons learned

Application rollback is not server recovery. A clean public repository can omit a
peer application's production settings and mutable state. HTTP200 and reachable
old assets can miss broken markup references. Backup format validation, source
comparison, application restoration and live migration acceptance are different
levels of evidence; preserve that distinction in every follow-up.

## Follow-up ideas

Only within new explicit approval: verify authenticated cloud console/account and
candidate availability; approve exact resource/backup costs; protect independent
recovery custody; provision/rehearse fresh LTS and all retained critical data; then
seek distinct traffic/write-freeze approval. Keep old-host rollback until separately
authorized retirement. INFRA-02 is not selected or started by this handoff.
