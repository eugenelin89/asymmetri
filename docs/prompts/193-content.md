# Prompt 193: Rename the category to Virtual Worlds

- Date: 2026-11-02
- Scope: content
- Goal: Use the owner's chosen Virtual Worlds name consistently across the shared category and UBC navigation.

## Original user request

> i like Virtual Worlds. Change it.

The owner chose this name after asking for a replacement for the Campus and City Labs submenu.

## Scope

Update shared category identity, menu, hub, Labs card, metadata, footer and UBC labels. Stanford and Case Western owners receive the same requirement and own their page and in-game label edits. Preserve all destination URLs and existing application behavior.

## Decisions

Use the existing `gisApps` content record as the single public category name rather than leaving the menu and hub with different labels. Keep the technical identifier and `/labs/gis` route to preserve links and canonicals. Adjust the brief hub introduction and descriptions to include both campuses and cities. Retain historical deployment receipts and journals.

## Implementation

The shared name is Virtual Worlds. Navigation and the Labs card action derive it from the content record. UBC's breadcrumb, return-link accessibility label and information badge use that record. Current documentation reflects the new public category name.

## Engineering impact

This is a content and label change. No route migration, redirect, dependency, asset, gameplay, storage, analytics or permission change was introduced. Other campus source edits are coordinated through their respective threads as requested.

## Files changed

The shared site content, UBC route and shell, root README, architecture/content/testing guides and UBC roadmap.

## Documentation updated

Current category naming and verification guidance now say Virtual Worlds while retaining technical GIS terminology and existing URLs. Dated historical receipts remain unchanged.

## Git diff summary

Eight files changed, 45 insertions and 44 deletions. This journal is excluded from its own totals.

## Verification

- Node 24.10.0 matches the repository's Node 24 requirement. Full TypeScript and ESLint passed, with only the existing unrelated tutorial navigation warning. Diff check passed.
- Local Next webpack preview rendered the new heading, Labs submenu, footer and browser title. Canonical remains `https://asymmetri.co/labs/gis`; destination cards retain their routes.
- Desktop 1280, phone 390 and tablet 768 CSS-pixel widths had no horizontal overflow. Keyboard Tab reached Virtual Worlds with a visible 3 px focus outline; Enter followed its unchanged URL. Console errors were absent. Real desktop/phone screenshots were saved and the temporary viewport was reset.
- The standard Vinext development entry failed in its worker's schema compilation with a dynamic-code-generation error before serving a page. The documented Next development alternative started successfully; no dependency or worker configuration was changed for this content request.
- Exact-source production CI and other campus owners' label commits follow separately. No production deployment is claimed.

## Deployment constraint

A read-only server check found the healthy source still at `38d4326`, build `4JfgZCh6OpnpuPeTAjb1A`. Only 17,780,736 bytes remained above the existing 6 GiB disk floor; the current Next output alone uses 33,693,696 bytes. Safe staging requires more headroom. No server mutation, cleanup, rollback removal or safety-floor reduction was performed. Prepare the tested source before any separately reviewed capacity remedy.

## Repository state after implementation commit

Main at `42797046e75cc049e5b99989818994fceabd6475`. The initial fast-forward pull succeeded. Only the eight owned files were staged; concurrent campus-owner edits and generated next-env changes were left untouched. No branch, worktree or PR was created. Commit operations are serialized with the other campus owners.

## Implementation commits

- 42797046e75cc049e5b99989818994fceabd6475 — content: rename campus and city category to Virtual Worlds

## Archive commit

docs: archive Virtual Worlds category rename

## Lessons learned

A category rename should update the shared identity so navigation, metadata and destination context agree. Keep descriptive geographic terminology and stable routes separate from the chosen public brand.

## Follow-up ideas

Include the other campus owners' scoped labels, complete exact-source CI and resolve staging capacity before publishing. The new name is currently verified locally, not on the production site.
