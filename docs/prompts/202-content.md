# Prompt 202: Confirm weather sources, seasonal preferences and Christmas walks

- Date: 2026-11-08
- Scope: content
- Goal: Record the owner's Round 2 decisions in website issue #5 and continue discovery.

## Original user request

> **Round 2 — Approved, with clarifications**
>
> **1. Weather sources — Approved.**
>
> Use Environment and Climate Change Canada for UBC and NWS for Stanford and CWRU. Prefer reliable nearby station observations over simulated conditions.
>
> Display the station name, observation time and data freshness. Make clear that the observation is from a nearby station, not necessarily the exact campus.
>
> If observations become stale or unavailable, display "Weather unavailable." The real local clock and solar lighting must continue functioning independently.
>
> **2. Seasonal preferences — Approved.**
>
> An explicit Regular selection should persist across visits through December 31, 2026. Holiday replay (Halloween or Christmas) should last only for the current visit, then restore the previous persistent selection.
>
> Automatic Christmas runs November 8–December 31, 2026. Regular resumes January 1, 2027.
>
> **3. Decorated campus walks — Approved.**
>
> Use the three proposed routes:
>
> - UBC: Gateway → AMS Nest atrium
> - Stanford: Oval → Main Quad → Green Library
> - CWRU: Kelvin Smith Library → Tinkham Veale commons
>
> Each route should have substantial Christmas decorations visible during daylight, extensive decorative lighting after sunset, and a festive indoor destination.
>
> Preserve walkability, existing campus geometry and mobile performance.
>
> Continue `/grill-with-docs`. Record these decisions in Issue #5 and identify any remaining unresolved questions. Do not advance to `/to-spec` without my approval.

## Scope

Round 2 of the campus Christmas design interview closed three decisions. Round 3 remains in `/grill-with-docs`. The owner reserved the transition to `/to-spec` for explicit approval.

## Decisions

- UBC uses Environment and Climate Change Canada observations. Stanford and CWRU use U.S. National Weather Service observations. Show the station, observation time and freshness, identify the station as nearby, and display “Weather unavailable.” if a report is stale or unavailable. The actual campus clock and solar lighting continue.
- The campus-local Christmas window runs from November 8 through December 31, 2026. Regular persists across visits through December 31. A holiday replay lasts for the current visit, then restores the previous persistent choice subject to expiry.
- The three decorated walks connect UBC Gateway to the AMS Nest atrium, Stanford Oval through Main Quad to Green Library, and CWRU Kelvin Smith Library to the Tinkham Veale commons. The approved scope includes day and night treatments, festive interiors, walkability, existing geometry and mobile performance.

## Implementation

Updated the [issue body](https://github.com/eugenelin89/asymmetri/issues/5) and acceptance criteria. The [Round 3 discovery note](https://github.com/eugenelin89/asymmetri/issues/5#issuecomment-6728572737) lists proposals for weather delivery and freshness, legacy preferences, visit boundaries, simulated atmosphere, sound, and physical-phone acceptance.

## Engineering impact

The design now distinguishes a current campus clock from weather availability, and a persistent edition choice from a temporary replay. Existing preferences sometimes encode multiple actions with the same value. The migration remains a product decision. The changes cover documentation only.

## Files changed

Updated the website glossary with the agreed meaning of Live atmosphere and the lifetime of a seasonal replay.

## Documentation updated

The glossary holds the vocabulary. The GitHub issue holds provider and route details, expected behavior and open questions.

## Git diff summary

One glossary file changed, with eight insertions and one deletion.

## Verification

Read back the full issue body and Round 3 note from GitHub and compared them with the intended text. Checked current campus preference formats, Photo controls, and the UBC physical-phone scorecard. The staged glossary passed `git diff --cached --check`.

## Repository state after implementation commit

The clean `main` checkout was one commit ahead of `origin/main` at `5e17712`.

## Implementation commits

- `c02b35dd9a38ae4c9e9e07bec076df88dac228bd` — Clarify live campus atmosphere and replay lifetime.

## Archive commit

Journal 202: record Round 2 campus Christmas decisions

## Lessons learned

Specify an observation's age using the time it was measured. Describe legacy edition preferences using only the distinctions the saved data can actually support.
