# Prompt 092: BotSquad Trade public wording

- Date: 2026-10-14
- Scope: content
- Goal: Rename the public project to BotSquad Trade and its desk to Live Trading Desk.

## Original user request

> Change to "Live Trading Desk". And for site-wide, change the wording from Investment to Trade.

> Once you are done, message Bot Squad project in Codex to run a test to confirm the change in wording does not break anything.

The supplied screenshot identified the existing desk heading. Standing owner
instructions authorize direct commits and production deployment after checks.

## Scope

Website-authored copy, global/local navigation, accessible labels, metadata and
current hierarchy documentation. Existing routes, anchors, typed contracts,
receiver code, published records, employee portraits and Ask availability stay
unchanged. No producer or financial operation is authorized by the rename.

## Decisions

Use BotSquad Trade for the project and the exact heading Live Trading Desk,
without the previous leading article or punctuation. Use trading where needed
for grammatical descriptions. Preserve /botsquad/investment and every evidence
URL so existing references and integrations continue to work. Publisher-authored
historical titles and evidence are immutable and are not rewritten as marketing.
The exact desk title is centralized in investmentShowcase.deskTitle.

## Implementation

Updated shared labels, Research discovery copy, archive/methodology/run metadata,
Ask evidence links and explanations, section kickers, desk heading and accessible
region label. Current documentation now names the project BotSquad Trade and
explains compatibility with retained technical identifiers.

## Engineering impact

Presentation only. No dependencies, styles, assets, endpoints, environment variables,
data, permissions, publisher authority or availability controls changed. Existing
keyboard behavior and responsive structure are retained.

## Files changed

Shared content; three route metadata files; five showcase/archive/Ask components;
AGENTS, README, architecture, content guide and hierarchy documentation.

## Documentation updated

Current hierarchy and writing guidance reflect the owner’s new name. Historical
prompt records and technical integration names remain intact.

## Git diff summary

14 implementation files changed, 61 insertions and 43 deletions. The changes are
public terminology substitutions plus the centralized heading and naming guidance.

## Verification

- Local Node 24.10.0 matches .nvmrc; nvm is unavailable. TypeScript/ESLint pass,
  with the existing tutorial navigation lint warning. Existing Ask/archive tests
  pass 21/21; production dependency audit reports zero vulnerabilities.
- Linux Node 22.23.1 production-compatible check, Vinext and Next webpack builds
  pass in the reserved isolated workspace. An initial command stopped before
  compilation because npm was not on PATH; the corrected command uses the existing
  npm installation. No package or runtime was installed.
- Build guard retained at least 970,500 KiB available RAM and 23,193,542,656 free
  disk bytes, with live HQ/Nginx identities unchanged. Build ID:
  aBksLocO-vnFQ0pzvx3CE. All 247 source input hashes match after compilation.
- Runtime package excludes build caches; SHA-256:
  85377818929e52a067bee768ca3e3b2ee59f9509d12fdcd383d91599dd7a743c.
- Source scans found no remaining website-authored Investment wording apart from
  retained technical paths/identifiers. Every BotSquad route string in the changed
  source is unchanged. Public-edit privacy/prohibited-reference scans and
  git diff --check pass. No new public assets were introduced.
- Production baseline captured 112 route observations, including 48 original image
  checks and the four known unchanged IPv6 TLS failures. Private service/configuration
  and archive baselines are retained outside Git. Deployment, responsive browser
  verification and the requested BotSquad follow-up occur after this source record;
  their results belong in the external release receipt and completion report.

## Repository state after implementation commit

main at c4a4aa23c7f076c8a4d4e8c41d78416ed194ceb2, clean after implementation and one
commit ahead of origin/main. This journal is committed separately, then both
commits are pushed before staging the verified production artifact.

## Implementation commits

- c4a4aa23c7f076c8a4d4e8c41d78416ed194ceb2 — Rename public BotSquad investment wording to Trade

## Archive commit

Record BotSquad Trade naming journal

## Lessons learned

A public rename can preserve durable links and signed history. Keep display copy
separate from contract identifiers and verify the exact production build inputs.

## Follow-up ideas

The owner requested an independent BotSquad integration check after deployment.
No URL migration or data rewrite is proposed.
