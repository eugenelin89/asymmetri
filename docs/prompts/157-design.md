# Prompt 157: Interactive encounters and natural campus navigation

- Date: 2026-10-31
- Scope: design
- Goal: Make UBC conversations responsive, disperse pedestrians and remove directory/input friction.

## Original user request

> I don't like how the interaction with another person work right now. Instead of just displaying a page about that person, I don't want that. I want it more interactive. Like, there should be options of what you can do or say to that person. And once picked the action, the person would respond to the action, for example, answer the question.

> the people in school should be more naturally spread out rather than all standing together which is a little unnatural

> why so many Crescent West? Are they duplicates?

> can you fix all that looks like duplicates?

> Also, I find that when I jump to a location, I need to grab the scene before I can walk. I think that is a little unintuitive. Do you know what I mean?

## Scope

Four related UBC visitor-experience corrections. Existing authorization to finish
independently and deploy remains applicable. This commit changes no geographic
snapshot, public profile persistence, city engine, external service or dependency.

## Decisions

Use curated action/response choices and original gestures, preserving verified
registry facts and simulation labels. Keep characters discoverable only through
encounters. Bound dialogue history to 24 turns in memory. Retain participant-written
answers and reporting controls. Spread source-route arrivals, make pedestrian
passing collision-aware and pause only the selected conversation partner.

All 605 GIS footprints are distinct. The importer splits 63 source records into
multiple objects; grouping by the original source ID yields 425 building groups
without deleting any map geometry or conflating unrelated same-named places.

A location jump deliberately returns keyboard focus to the canvas after modal
cleanup. Ordinary non-travel dialog dismissal still restores the opener.

## Implementation

Added conversation UI/state modules and a building-directory helper. Integrated
wave/nod/talk reactions, camera framing, follow-up choices, unsupported-question
responses, source details and session history. Added pedestrian spacing/density
limits and passing behavior. Corrected focus after travel and on-foot camera
switching. Audited all repeated building names, not only Crescent West.

## Engineering impact

No dependencies, network AI service or new biographical assertions. Accessibility
retains labelled controls, keyboard focus, modal trapping, optional motion and
safe external links. Population remains procedural; no real schedules or tracking.

## Files changed

UBC shell/engine/people/styles; new conversation and building-group modules and
tests; updated project README and four shared documentation sections; implementation
report and four real browser captures with an evidence guide.

## Documentation updated

Architecture explains state, crowd behavior and source grouping. Content guidance
separates social scripts from factual replies. Testing records functional coverage.
The asset manifest records the four unretouched application captures. The UBC report
states acceptance and outstanding physical-device/performance limitations.

## Git diff summary

23 files changed, 1,365 insertions and 231 deletions, plus four PNG artifacts. The
old biography-first conversation markup is replaced by a dedicated component.

## Verification

208 tests pass: UBC 53, Vancouver 74, Surrey 54, Richmond 27. TypeScript/ESLint,
Vinext and Next webpack builds pass; the existing tutorial navigation warning is
unchanged. Production dependency audit reports zero vulnerabilities; diff and
scoped prohibited-reference checks pass.

Browser checks cover wave, introduction, selected question and follow-up,
unsupported private opinion, goodbye/reopening history, source-link security,
phone/tablet/desktop overflow and scene focus after directory/map jumps. No console
warnings/errors. Physical-device and sustained performance checks remain unmeasured.

## Repository state after implementation commit

Main at `797237c`, clean and one commit ahead of refreshed `origin/main` at `f7230c7`.
The separately completed homepage release was fast-forwarded before committing;
its Sports/Labs fixes remain included. Its shared release window is released.

## Implementation commits

- `797237c` — Make UBC encounters interactive and improve crowd and navigation flow.

## Archive commit

Record UBC encounter refinement engineering journal.

## Lessons learned

Multipart GIS geometry is not a directory identity. Modal focus restoration must
respect an explicit return to a keyboard-driven world. Nearby pedestrian detection
must not freeze every passerby as though a conversation had begun.
