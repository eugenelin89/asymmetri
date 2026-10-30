# Prompt 132: Keep BotSquad areas inside BotSquad

- Date: 2026-10-30
- Scope: content
- Goal: Simplify the Labs submenu without removing BotSquad pages or changing URLs.

## Original user request

> BotSquad Research, BotSquad Trade, and Ask BotSquad should be removed from sub-menu as they should be just under BotSquad

The ongoing website deployment authorization remains applicable to this follow-up
navigation correction. Greater Vancouver GTA city chats are coordinating shared
source and deployment windows.

## Scope

Remove three global Labs submenu entries. Preserve BotSquad’s overview, area
navigation, directory, breadcrumbs, established hierarchy, pages and deep links.

## Decisions

The global Labs menu contains Asymmetri Labs, BotSquad and GIS Apps. BotSquad’s
own navigation retains Overview, Research, Trade and Ask. Trade remains within
Research; this request simplifies menu presentation without reorganizing routes.

## Implementation

Removed exactly three references from `site.navigation` in shared content.
Updated current content guidance and the hierarchy document’s navigation description
with the October 30 decision. Historical acceptance records were not rewritten.

## Engineering impact

No URL, route, asset, dependency, game, receiver, Ask-availability or tracking
change. No new abstraction, component code, animation or tests were needed.
All 85 literal shared URL values are identical; the runtime diff contains only
the requested three menu-entry removals.

## Files changed

Shared navigation content, the content guide and BotSquad hierarchy guidance.

## Documentation updated

Both guides distinguish the global BotSquad entry from its retained internal areas.

## Git diff summary

Three files changed, seven insertions and seven deletions. Runtime code removes
three lines; all additions are explanatory documentation.

## Verification

- Clean main and successful fast-forward pull before edits; no unrelated changes.
- Node 24.10.0 matches `.nvmrc`; nvm is unavailable.
- TypeScript/ESLint, Next webpack build, Vinext build and all 29 Surrey prerequisite
  tests passed. Production dependency audit reports zero vulnerabilities.
- `git diff --check` passed. Removed navigation references introduce no private
  content, unsupported claims, new URLs or assets.
- Browser at 320/768/1440 CSS pixels: the open menu has precisely the three retained
  entries, no horizontal overflow, and no offscreen menu links. Enter/Escape work
  with restored visible Labs focus. Research, Trade and Ask links within BotSquad
  each reach their original page; no console errors were observed.
- Public pre-release baseline: 24 pages, 68 asset/hash checks and six redirects
  across apex/www, including a legacy Trade path and preserved query. Ask’s
  existing inherited apex canonical is recorded unchanged, not silently corrected.
- Existing tutorial lint, Browserslist-age and Vinext chunk/classification warnings
  do not fail checks. No dependency update was included for these warnings.
- Exact-source Linux acceptance, activation and post-release checks follow in a
  separate release receipt and journal.

## Repository state after implementation commit

Clean main, one implementation commit ahead of origin. Push this journal together
with implementation; city projects hold competing shared-file/server mutations.

## Implementation commits

- `eff2c72d0413517f7141bafa3e10f3d03432f404` — Keep BotSquad areas within BotSquad navigation.

## Archive commit

`Record Labs submenu engineering journal`

## Lessons learned

The global menu can identify projects while each project retains its own area
navigation. Removing shortcuts must not remove the pages or their internal links.

## Follow-up ideas

Complete the already-authorized production release and link verification.
