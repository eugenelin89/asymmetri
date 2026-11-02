# Prompt 194: CWRU Virtual Worlds category labels

- Date: 2026-11-02
- Scope: content
- Goal: Use the shared Virtual Worlds category identity throughout CWRU navigation.

## Original user request

> i like Virtual Worlds. Change it.

The owner chose the replacement for Campus and City in the coordinating UBC chat and required each campus chat to own its campus changes. Root owns shared identity and journal 193; CWRU owns this scoped follow-up. The requested scope includes the page breadcrumb, in-game return-link accessibility label and Project information badge.

## Scope and decisions

Consume `gisApps.name` and `gisApps.path` from the existing shared content record. Preserve uppercase presentation for the breadcrumb and badge. Keep `/labs/gis`, `/labs/cwru`, metadata and all gameplay, audio, profiles, reviews and analytics behavior unchanged. Do not deploy independently or alter other owners' work.

## Implementation and engineering impact

The CWRU route imports the central category identity for its breadcrumb. The client shell uses the same identity for the return link and information badge. This removes three hard-coded category labels without changing component behavior, dependencies, assets or storage.

## Files changed and documentation updated

The CWRU page and campus shell contain the three label changes. The CWRU project README records their central ownership and unchanged destination. Root's shared content and architecture documentation records the broader category rename.

## Git diff summary

Three files changed, 7 insertions and 4 deletions. This journal is excluded from its own totals.

## Verification

Node 24.10.0 matches the repository requirement. Scoped ESLint and diff checks passed; no obsolete category label remains in the CWRU public page or campus shell. Root's shared TypeScript/ESLint check passed. No new tests or broad gameplay suite were added for these text substitutions.

The shared Next preview rendered the CWRU Virtual Worlds breadcrumb with `/labs/gis`. Checks at actual 1280, 768 and 390 CSS-pixel widths found no horizontal overflow. Keyboard navigation focused the category link with a 3 px outline, and Enter opened the unchanged hub. Browser zoom was preserved; viewport dimensions were checked against actual CSS width after an initial undersized view fell below the existing 320 px body minimum. The temporary tab was closed and viewport override reset. The local review backend is unconfigured; no review, profile or gameplay action was submitted. In-game label substitutions were checked in source; no new gameplay acceptance is claimed.

Root's combined hub checks cover the shared menu, footer, category title and keyboard behavior. Exact-source production CI and coordinated deployment remain separate. The production capacity audit currently blocks staging; CWRU performed no server mutation, cleanup or deployment.

## Repository state after implementation commit

Main at `374cf07f6289a52460306d6c33a41fe03c9cd94e`, after root's pushed journal 193. Root explicitly released the exclusive index slot to CWRU. Only the three owned files were staged; Stanford edits and generated next-env changes remain untouched. Commit this journal separately, push without force, then release the index directly to Stanford for journal 195. No branch, worktree, PR or merge was created.

## Implementation commits

- `374cf07f6289a52460306d6c33a41fe03c9cd94e` — content(cwru): use shared Virtual Worlds category labels

## Archive commit

`docs: archive CWRU Virtual Worlds label update`

## Lessons learned

Read the shared category identity wherever public navigation names appear, including accessibility labels and in-game context. Verify actual CSS viewport dimensions when the browser has an existing zoom preference, and keep commit ownership serialized across campus chats.

## Follow-up ideas

The coordinating owner will include this source with Stanford's follow-up, run exact-source CI and resolve capacity before any release. These CWRU labels are locally verified and committed, not yet verified on production.
