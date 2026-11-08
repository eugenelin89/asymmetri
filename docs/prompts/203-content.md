# Prompt 203: Settle the campus edition migration and finish Christmas discovery

- Date: 2026-11-08
- Scope: content
- Goal: Record the owner's Round 3 approvals and check for outstanding product decisions before asking whether to start the specification.

## Original user request

> **Round 3 — Approved, with one clarification to #2.**
>
> Approve **#1, #3, #4, #5 and #6** as recommended.
>
> **#2 — Legacy preferences:** Preserve explicit Regular choices made under the new Christmas edition system through December 31, 2026. However, migrate ambiguous pre-Christmas CWRU `regular` preferences to Automatic, just like the old UBC and Stanford Halloween toggles. Turning Halloween off previously should not unintentionally prevent Christmas from appearing.
>
> Preserve existing sound, volume and accessibility preferences.
>
> Record these decisions in Issue #5, continue `/grill-with-docs`, and identify any remaining discovery questions. Stop for my approval before `/to-spec`

The local skill-link target has been redacted.

## Scope

Close the outstanding questions from the [Christmas edition discovery](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6728635616). The owner retains approval of the specification, implementation and release stages.

## Decisions

- Apply Automatic to ambiguous pre-Christmas preferences on all three campuses, including CWRU’s old `regular` value. A new explicit Regular selection survives across visits until the end of December 31, 2026 on the campus calendar. Carry sound, volume and accessibility preferences through migration.
- Use the approved 90-minute observation window and shared 15-minute refresh interval. A fresh nearby alternate can supply a report. When neither station has one, stop weather effects and continue the campus clock and sunlight.
- Reloading or leaving a campus ends a replay. Tab switching, locking the phone, opening Photo and crossing midnight continue it. On a new visit the saved edition applies and atmosphere starts Live.
- Replay retains the active atmosphere. The Halloween evening is a Simulated preset. Staging conditions in Photo keeps them in effect when walking resumes. Weather ambience continues in Regular according to conditions and the visitor’s audio preferences.
- Run paired iPhone checks on each walk, with three runs per edition. Aim for 30 FPS and flag an increase over 10% in the median p95 frame time for review. Exercise touch entry and first-tap audio with Silent Mode on. Missing device results remain pending.

## Implementation

Updated the issue body and acceptance criteria and published the approved decisions. Linked the earlier CWRU proposal to its correction. Checked the agreed behavior against the prior rounds. No further owner-level product question surfaced.

## Engineering impact

An ambiguous historical value can no longer suppress the planned Christmas default. The discovery record explains how future tests can distinguish the old value from a new explicit Regular choice, including repeat visits and preference expiry. Runtime work is still pending.

## Files changed

Added two terms to the Virtual Worlds glossary.

## Documentation updated

The glossary defines Campus visit and Simulated atmosphere. The issue holds the migration, weather, audio and device acceptance details.

## Git diff summary

One glossary file changed, with twelve insertions.

## Verification

Read back the issue body and both affected comments from GitHub. Confirmed the issue kept its existing labels. Checked the staged Markdown for whitespace errors. Application builds and device tests apply to the future implementation.

## Repository state after implementation commit

The clean `main` checkout was one commit ahead of `origin/main` at `662e6d8`.

## Implementation commits

- `0b4b449660b5afd466b3baa5426202232fed4424` — Define a campus visit and simulated atmosphere.

## Archive commit

Journal 203: record Round 3 approvals and discovery outcome

## Lessons learned

A saved value can have more than one origin. An old value called Regular could mean a visitor had merely turned Halloween off. Make a new explicit choice distinguishable before giving it cross-visit effect.
