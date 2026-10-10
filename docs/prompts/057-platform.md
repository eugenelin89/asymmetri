# Prompt 057: Cross-repository investment documentation refresh

- Date: 2026-10-09
- Scope: platform
- Goal: Synchronize current Asymmetri and BotSquad investment docs after INV-04 and identify a single canonical contract/roadmap without changing product runtime.

## Original user request

> please update docs so they are all fresh, up-to-date and not stale and properly cross references the other repo. Then, provide me with the next Codex prompt.

## Scope

This is a documentation-only, investment-integration and repository-routing maintenance request. It clarifies website/receiver ownership versus private HQ ownership, adds explicit counterpart links, fixes stale INV-04 status, and points future operators to accepted immutable evidence. It does not implement INV-05, deploy the website, start the receiver, create grants, change Ubuntu, revive INFRA-01, or establish a new RECOVERY-01 project. Historical evidence/journals are preserved.

## Decisions

- BotSquad owns the canonical nine-file contract v1.0 and the investment roadmap, decisions, future simulator/free-source/publisher/team work. Asymmetri owns the public website, private receiver, archive and synthetic UI.
- Keep contract pin `ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755` and manifest SHA-256 `7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`; the nine Git blobs match.
- INV-04 exists in source and local acceptance only. Installed schema-002 receiver predates the site's new visibility headers; future deployment requires compatibility and separate public exposure authority.
- Preserve Decision 029 US$0 incremental market-data budget, Decision 030 unsupported Ubuntu 22.10 exception, disabled real publisher/Ask, and distinct eventual operational backup/custody and public-ingress gates. Do not convert the withdrawn RECOVERY-01 proposal into a milestone.

## Implementation

Added `docs/BOTSQUAD_INTEGRATION.md` as a concise ownership, version, milestone, link, release and Codex routing index. Cross-linked it from Asymmetri README, AGENTS, architecture, deployment, receiver and local preview documentation. Updated the route inventory with INV-04 source-only/disabled Ask and corrected a stale 'future INV-04 dashboard' passage.

## Engineering impact

No source runtime, dependencies, assets, Git contract bytes, database schema, service configuration or active server code changed. No public release or HQ authority was created. Existing final technical/validation records remain historical evidence.

## Files changed

- README route and investment integration sections.
- AGENTS and architecture cross-repository ownership guidance.
- Receiver runbook, deployment and local-development cross-links.
- New integration map with current contract pin and activation boundaries.

## Documentation updated

- `AGENTS.md`: modified (4 additions, 0 deletions)
- `README.md`: modified (5 additions, 0 deletions)
- `docs/ARCHITECTURE.md`: modified (6 additions, 0 deletions)
- `docs/BOTSQUAD_INTEGRATION.md`: added (47 additions, 0 deletions)
- `docs/DEPLOYMENT.md`: modified (2 additions, 0 deletions)
- `docs/INVESTMENT_RECEIVER.md`: modified (4 additions, 2 deletions)
- `docs/LOCAL_DEVELOPMENT.md`: modified (4 additions, 0 deletions)

## Git diff summary

7 documentation files; 72 additions and 2 deletions per GitHub compare. No runtime code or private material included.

## Verification

- Checked both default-branch SHAs and read the current INV-04 acceptance/roadmap.
- Compared all nine vendored and canonical protocol Git blob SHAs: byte-identical in both repositories.
- Performed exact-anchor replacement checks, file-ending/trailing-space checks, documentation link/path review and GitHub change listing.
- No full local Node build, SSH check or new browser test is claimed for a documentation-only change.

## Repository state after implementation commit

Documentation implementation commit `84db878b0937b95d4819bf9909b34ec57bf40a93` is based on clean observed Asymmetri main `3d9e1ad55dc5ad1861393e63d05370a2a1a7b054`. This journal is the second Git commit; the two commits are pushed together through a fast-forward guarded ref update. No website production deployment is part of this request.

## Implementation commits

- `84db878b0937b95d4819bf9909b34ec57bf40a93` — refresh documentation, references and contract ownership map.

## Archive commit

Intended archive commit message: `docs: journal cross-repository documentation refresh`.

## Lessons learned

A completed but unpublished website milestone must not be described as a deployed product. The website and HQ require different Git/deployment workflows despite sharing one wire contract. Older implementation reports should remain immutable while living entrypoints reflect the current state.

## Follow-up ideas

INV-05 is next and belongs in the BotSquad project under a new separately selected task. Public ingress, source rights, recurring live-data backup policy and financial/Ask activations remain later independent gates.
