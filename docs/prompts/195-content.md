# Prompt 195: Use Virtual Worlds in Stanford navigation

- Date: 2026-11-02
- Scope: content
- Goal: Keep Stanford category labels aligned with the shared Virtual Worlds name and stable destination.

## Original user request

> i like Virtual Worlds. Change it.

The user-visible request is preserved in the root owner's journal193. The root owner delegated Stanford's breadcrumb and two in-game category labels to this campus owner, with serialized commits and no independent deployment.

## Scope

Stanford's breadcrumb, in-game return-link accessibility label, Project information badge and project documentation. The shared category record and other campus changes remain owned by their respective chats.

## Decisions

Read the category name and destination from the existing `gisApps` export in `content/site.ts`. Preserve the uppercase presentation of the breadcrumb and badge and the existing `/labs/gis` route. Avoid introducing another hard-coded public name.

## Implementation

Both Stanford UI components import the shared category record. The breadcrumb and return link use its path; the breadcrumb, return-link accessible name and information badge use its name. The Stanford README explains this shared content boundary.

## Engineering impact

This change affects labels only. No gameplay, audio, seasons, profile storage, reviews, analytics, dependencies, assets or route changes are included. The previously accepted iPhone Silent Mode behavior remains intact.

## Files changed

The Stanford route page and campus shell supply the updated labels. The Stanford project README documents their shared source.

## Documentation updated

The project README records the centralized category naming and stable URLs. Historical release receipts and journals remain unchanged.

## Git diff summary

Three files changed, seven insertions and three deletions. This journal is excluded from its own totals.

## Verification

- Scoped diff whitespace check passed. No hard-coded `GIS APPS` or `GIS Apps` labels remain in the two Stanford UI files.
- Focused ESLint passed for both changed Stanford TSX files on Node 24.10.0, matching the repository Node 24 requirement.
- Shared category type/lint and responsive local-preview validation are recorded by the root owner in journal193. No duplicate complete test/build run was started; exact-source combined CI is coordinated by the root owner.
- No new production deployment or live rename verification is claimed. The shared owner reported staging blocked by the established disk headroom floor; this task did not mutate the server or remove files to bypass it.

## Repository state after implementation commit

Main at 36f751b62f604c63501361c42941ea2764a95dfd, one local implementation commit ahead of `origin/main` at CWRU194 (`5727b59`). The fast-forward pull was already up to date. The root193 and CWRU194 commits preceded Stanford's exclusive index handoff. Only the three Stanford-owned implementation/documentation files were staged. Generated `next-env.d.ts` remained untouched and uncommitted; no branch, worktree or pull request was created. The implementation and journal pair will be pushed together before releasing the index to the root owner.

## Implementation commits

- 36f751b62f604c63501361c42941ea2764a95dfd — content(stanford): use shared Virtual Worlds labels

## Archive commit

docs: archive Stanford Virtual Worlds labels

## Lessons learned

Read public category identity from its shared content record while keeping campus ownership and stable destinations intact. Serialize the shared Git index even for small edits.

## Follow-up ideas

Complete coordinated exact-source validation and resolve shared staging capacity before publishing the category rename.
