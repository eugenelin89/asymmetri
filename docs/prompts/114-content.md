# Prompt 114: Drive Vancouver submenu label

- Date: 2026-10-30
- Scope: content
- Goal: Show Drive Vancouver in the Labs submenu.

## Original user request

> For the sub-menu under labs, instead of just "Vancouver", change to "Drive Vancouver"

## Scope

The shared Labs submenu label and its content documentation.

## Decisions

Centralize a separate navigation label so the project identity and existing URL
stay consistent with the already deployed experiment.

## Implementation

Added `vancouver.navLabel` and used it in the Labs submenu, including the shared
mobile menu.

## Engineering impact

Copy-only change. No new dependency, route, data or application behavior.
Deployment continues under the owner's explicit overnight release authorization.

## Files changed

Shared site content and the content guide.

## Documentation updated

The content guide identifies the navigation label and its editing location.

## Git diff summary

2 files changed, 4 insertions and 1 deletion.

## Verification

TypeScript and ESLint passed with only the existing tutorial navigation warning.
Git whitespace checks passed. The isolated Linux build and public verification
will run before activating this update.

## Repository state after implementation commit

Main; tracked implementation clean before this journal. Both commits are pushed
normally; no branch, worktree or force push.

## Implementation commits

- badf97f3f7f320592e26274f6bdf00fc6bb85973 — Label the Labs submenu Drive Vancouver

## Archive commit

Record Drive Vancouver navigation request

## Lessons learned

A project name and its navigation action can have distinct centralized labels.

## Follow-up ideas

None added by this wording change.
