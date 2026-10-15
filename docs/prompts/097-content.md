# Prompt 097: Document how to tail BotSquad logs

- Date: 2026-10-15
- Scope: content
- Goal: Publish practical read-only log-tailing instructions in the HQ investigation guide.

## Original user request

> can you document on how to tail logs

The human request was verified in the coordinating BotSquad chat. It continues the
owner-authorized public Trade/HQ documentation work and standing direct-commit and
deployment instructions. The coordinator supplied the verified service commands
and an incident-specific read-only activity helper, and cleared a serial Linux
build window while its separate investigation remained quiescent.

## Scope

One new `#tail-logs` section in `/botsquad/trade/hq-guide`, contents and troubleshooting
links, shared metadata and relevant website documentation. No HQ code, model calls,
source collection, controls, grants, receiver behavior or database writes. The dated
helper is documented, not added to or installed by this website repository.

## Decisions

Separate process diagnostics from domain evidence. The service journal establishes
startup/error context; SQLite audit events and stage summaries describe recorded
Trade activity. Neither establishes an accepted decision without matching proposal,
independent review and submission records. Counts alone do not prove approval.

Show the exact SSH commands for a live journal, the last 15 minutes of history,
the dated Trade follower and its `--once` mode. Explain the preconfigured alias and
required authorized access, command flags and Ctrl+C ending the viewer without
stopping the service. Explain UTC timestamps, the server's verified UTC timezone,
explicit `--utc` and the October 15 Vancouver conversion.

Label the October 15 helper as an incident-specific operator utility, not a
permanent product command or guaranteed future file. Explain its read-only connection,
two-second polling, bounded recent events, scope filter and change-only summaries.
Keep raw execution IDs, private state, receipts, credentials and prompts out of
the article. Preserve the screenshots as a historical observation checkpoint and
make no claim that the current renewal has completed.

## Implementation

Added the eighteenth anchored guide section with four keyboard-scrollable command
blocks and an interpretation table. Linked it from contents, pause troubleshooting,
escalation and version context. Clarified that the original failure screenshots
describe their capture checkpoint. Existing paths and Investment-to-Trade redirects
are unchanged.

## Engineering impact

Static server-rendered prose and metadata only. No new JavaScript, dependency,
asset, API, command execution from the browser, authentication or private data
access. The page explains operator actions without performing them.

## Files changed

- HQ article: section, four commands, evidence interpretation and cross-links.
- Shared HQ metadata: mention diagnostic output.
- README, ARCHITECTURE, CONTENT_GUIDE and TESTING: scope, privacy and verification.

## Documentation updated

The website guide is the deliverable. Repository documentation records its static
nature, explicit command-example boundary, eighteen contents targets and responsive
command-block checks. No asset-manifest change is required because public assets
are byte-unchanged and no screenshot was added to the website.

## Git diff summary

Six implementation files changed, 62 insertions and four deletions. This journal
is excluded from those totals.

## Verification

- Started on clean main and successfully fast-forward checked origin/main.
- Local Node 24.10.0 matches `.nvmrc`; nvm unavailable. TypeScript/ESLint passed
  with the existing tutorial navigation warning. Existing Ask/archive tests passed
  22/22 with loopback permission; an initial sandbox-only listener denial was
  resolved by rerunning with that permission. Dependency audit: zero vulnerabilities.
- Inspected the actual helper source; local and installed SHA-256 matched
  `c6c4dc628fd414e253c6c2a23a456c8d65d91dbcccd3a43886bbc0a9e4952a76`.
  Verified StandardOutput=journal, StandardError=inherit and Etc/UTC server timezone.
  Recent-history command, bounded journal follow and helper `--once` passed;
  expected state keys were checked without publishing raw output. Service identity
  was unchanged. Official OpenSSH and systemd manual sources support flag semantics.
- Computer Use preview: all eighteen sections and anchors, seven loaded images
  with alt text and all four exact command strings passed. Legacy HQ URL retained
  `#tail-logs` and landed at the correct section. Widths 320/390/768/1024/1440/1920
  had no page overflow; command blocks remained contained, labelled and focusable.
  Keyboard horizontal scrolling and visible focus passed. Browser errors: zero.
  Existing reduced-motion styles are unchanged.
- New public text scan found no raw operational IDs, addresses, keys or auth headers.
  No private outputs, source files or receipts were copied into the article.
  Generated development-only AGENTS/type-path drift was removed after stopping
  the local preview; intentional files alone were committed. Diff check passed.
- Reserved Linux Node 22.23.1 check, 22 regressions, Sites build and Next webpack
  build passed. All 268 input hashes matched. Build `9df2yTDCJN1aEVgdHGS1j`;
  artifact SHA-256 `0e7970d59025a8f36bac52415748a7efefbb5f559e0e4348225cd9d127e1cabe`.
  Guard minima: 955516 KiB available RAM and 16087662592 bytes free disk. HQ/Nginx
  service identities were unchanged; the shared build slot was released promptly.
- Fresh production preservation baseline: 148 observations, including 140 verified
  HTTP responses, four known unrelated IPv6 TLS failures and four fallback certificate
  fingerprints; 74 original-image observations. Private invariants captured separately.
  Candidate preparation, activation and final live readback follow push; their actual
  results belong in the external release receipt and completion report.

## Repository state after implementation commit

Clean main at `87aa7d55e413abbc8fe32d34f1ed1e5a5bd89db0`, one commit ahead of
origin/main. Commit this journal separately and push both before deployment.

## Implementation commits

- `87aa7d55e413abbc8fe32d34f1ed1e5a5bd89db0` — Document service and Trade activity log tailing

## Archive commit

Record log-tailing guide engineering journal

## Lessons learned

A usable operator guide explains what output proves, not just which command to run.
Keep incident helpers visibly dated and scoped. Test shell quoting as rendered in
the browser, and keep historical screenshots separate from changing live status.
Coordinate shared-host builds with active work rather than competing for resources.

## Follow-up ideas

A permanent supported activity follower would be a separate BotSquad feature. This
documentation does not commit to that feature or create a monitoring automation.
