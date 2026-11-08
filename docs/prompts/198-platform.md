# Prompt 198: Initialize Matt Pocock skills for the website

- Date: 2026-11-08
- Scope: platform
- Goal: Configure the installed engineering skills to use the website's GitHub issue tracker and default triage labels.

## Original user request

> initialize the matpocock skills

> GitHub with defaults

## Scope

Repository instructions, issue-tracker settings, domain documentation conventions and GitHub labels.

## Decisions

The owner selected GitHub Issues and the five default triage roles. The reviewed setup uses one root glossary and a shared ADR directory as terms and decisions are recorded.

## Implementation

Added the Agent skills section and its three linked guides. Created four missing GitHub labels and reused the existing `wontfix` label.

## Engineering impact

Ticketing and triage skills can resolve the tracker and labels for this checkout. Domain-modeling skills can locate the project's vocabulary and decisions.

## Files changed

The root agent instructions link to the issue tracker, triage labels and domain guides in `docs/agents/`.

## Documentation updated

The issue tracker guide identifies the GitHub repository and ticket commands. The triage guide maps the five roles. The domain guide identifies the glossary and architecture decision conventions.

## Git diff summary

Four files changed with 35 insertions in the implementation commit.

## Verification

Verified access to the intended GitHub repository, read back all five configured labels, compared previously existing labels, resolved all four new Markdown links and checked the staged diff for whitespace errors.

## Repository state after implementation commit

Clean main, one commit ahead of origin/main.

## Implementation commits

- `5d863f952976474842b1033282f2afbe5283a7b6` — Configure Matt Pocock skills for the website repository.

## Archive commit

`Record Matt Pocock skills setup journal`

## Lessons learned

Compare configured labels with the live tracker so reruns preserve existing labels.
