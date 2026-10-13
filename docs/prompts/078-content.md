# Prompt 078: Focus the investment introduction on evidence

- Date: 2026-10-13
- Scope: content
- Goal: Remove the money-status disclaimer from the introductory team panel.

## Original user request

> Don't need this part. Readers don't need to know its simulated money. We on

> W don't need to say its real money or simulated money

The screenshot identified the introduction beside “The team is the experiment.”
The later clarification requested wording without specifying real or simulated money.

## Scope

The identified introductory paragraph, centralized copy and its editing guide.
This steering was incorporated into the already authorized staged website release.

## Decisions

Replace the disclaimer with: “Follow the team’s research, discussions and decisions.
Inspect the evidence behind each conclusion.” Keep that text in content/site.ts
as purposeDescription rather than hard-coding product copy in the component.

## Implementation

The showcase team panel now renders purposeDescription. Its introduction no longer
labels the money or transactions.

## Engineering impact

Copy-only presentation change; no investment data, accounting, API, authority,
dependency, asset, styling or Ask gate change.

## Files changed

Centralized site copy, the showcase component reference and the content guide.

## Documentation updated

CONTENT_GUIDE identifies the purposeDescription field and its editorial purpose.

## Git diff summary

3 files changed, 5 insertions and 2 deletions.

## Verification

Whitespace check and targeted source assertions passed: the component reads the
central field and the old money/transaction disclaimer is absent from the panel.
No new implementation-mirroring test was added for this reversible copy edit.
Production build and public browser read-back are part of the active staged release
and are not claimed by this source-only record. No Mac heavy build overlapped
Motion’s native test; the protected local disk floor remains in effect.

## Repository state after implementation commit

Main at a73fdd6edec8cbcdbb2c6ce2e0b6a85e658e8708, clean and one commit ahead of
origin/main. Clean main was fast-forward checked before editing.

## Implementation commits

- a73fdd6edec8cbcdbb2c6ce2e0b6a85e658e8708 — Focus investment introduction on teamwork and evidence

## Archive commit

Record investment introduction copy journal

## Lessons learned

Keep the introduction focused on what the reader can inspect and centralize
editable copy. Source acceptance and actual public deployment remain separate.
