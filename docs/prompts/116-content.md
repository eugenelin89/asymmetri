# Prompt 116: Vancouver in Progress submenu label

- Date: 2026-10-30
- Scope: content
- Goal: Show Vancouver in Progress in the Labs submenu.

## Original user request

> actually, use "Vancouver in Progress"

## Scope

Supersedes City in Progress before the pending production update.

## Decisions

Retain the separate centralized navigation label and the existing Vancouver
project name, route, footer and application.

## Implementation

Changed `vancouver.navLabel` to Vancouver in Progress and aligned the guide.

## Engineering impact

Copy-only change with no new dependencies or application behavior. Earlier label
candidates were not activated. Public deployment follows the standing release
authorization and resource/rollback safeguards.

## Files changed

Shared site content and the content guide.

## Documentation updated

The content guide reflects the final requested label.

## Git diff summary

2 files changed, 2 insertions and 2 deletions.

## Verification

TypeScript, ESLint and whitespace checks passed, with the existing tutorial
navigation warning. The final source receives a new Linux build and menu checks
before activation.

## Repository state after implementation commit

Main; tracked implementation clean before this record; normal push follows.

## Implementation commits

- 25a9ae23c06b6960c0281851388246898252a397 — Name the Labs submenu Vancouver in Progress

## Archive commit

Record Vancouver in Progress navigation wording

## Lessons learned

Keep the live release stable while revising an unactivated candidate.

## Follow-up ideas

None added by this copy change.
