# Prompt 115: City in Progress submenu label

- Date: 2026-10-30
- Scope: content
- Goal: Use City in Progress for the Labs submenu.

## Original user request

> actually, change to "City in Progress"

## Scope

Supersedes the prior Drive Vancouver submenu wording during release preparation.

## Decisions

Change the centralized navigation label only; preserve Vancouver's project name,
URL, footer identity and gameplay.

## Implementation

Updated `vancouver.navLabel` and its content-guide description.

## Engineering impact

Copy-only change, no dependency or behavior change. The superseded candidate was
not activated; the live original Vancouver release remains available while the
corrected build is prepared.

## Files changed

Shared site content and the content guide.

## Documentation updated

The content guide now names City in Progress as the submenu label.

## Git diff summary

2 files changed, 2 insertions and 2 deletions.

## Verification

TypeScript, ESLint and whitespace checks passed; the existing tutorial navigation
warning remains. A fresh exact-source Linux build and public menu verification
are required before activation.

## Repository state after implementation commit

Main; tracked implementation clean before this journal; normal push follows.

## Implementation commits

- 83275e575ad7357742053d77a65b09ddd5c95fb9 — Rename the Labs submenu City in Progress

## Archive commit

Record City in Progress navigation correction

## Lessons learned

Apply late wording corrections before production activation.

## Follow-up ideas

None added by this correction.
