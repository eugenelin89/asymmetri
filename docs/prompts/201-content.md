# Prompt 201: Christmas calendar correction and seasonal replay

- Date: 2026-11-08
- Scope: content
- Goal: Record the corrected Christmas dates and the agreed replay vocabulary during discovery for website issue #5.

## Original user request

> /grill-with-docs issue #5

The owner answered the first three interview questions in sequence.

> preferably using some trusted weather report

> my mistake. update the issue please. should be until December 31, not Jan. 31.

> Yes, allow deliberate seasonal replay

## Scope

Updated the [Christmas edition issue](https://github.com/eugenelin89/asymmetri/issues/5), its existing discovery note and the website glossary. The live campus behavior and deployment remain separate work.

## Decisions

- Automatic Christmas runs from November 8 through December 31, 2026 inclusive by campus-local date. Regular resumes at local midnight on January 1, 2027.
- A visitor can deliberately replay a holiday outside its scheduled dates and return to Automatic.
- A trusted weather report is preferred. The provider and the lifetime of visitor selections remain open.

## Implementation

Revised the requested window, schedule, acceptance criteria and suggested verification work on GitHub. Updated the discovery note's UTC boundary examples for January 1. Added concise glossary entries for campus edition, Automatic and seasonal replay.

## Engineering impact

Future tests can distinguish a deliberate replay from a stale holiday preference. The January 1 transition applies separately in Cleveland, Vancouver and Stanford.

## Files changed

The root glossary defines the three agreed Virtual Worlds terms.

## Documentation updated

The glossary holds vocabulary. The issue holds the season dates and pending design decisions.

## Git diff summary

One file added, 18 insertions. GitHub issue edits are tracked separately from the repository.

## Verification

Read back the issue body and discovery comment and verified their updated contents. Checked that both used the corrected end date throughout. The staged glossary passed `git diff --cached --check`. The repository change contains Markdown only.

## Repository state after implementation commit

`main` was clean, one commit ahead of `origin/main` at `8565d48`.

## Implementation commits

- `27258f4476acffcd831fc07b521bb90f595eed02` — Define campus editions and deliberate seasonal replay.

## Archive commit

Journal 201: record Christmas calendar and replay decisions

## Lessons learned

Changing the edition cutoff requires updating the long-running session tests as well as the dates shown to visitors. An answer correcting the calendar leaves the lifetime of an explicit Regular choice open.
