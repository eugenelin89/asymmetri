# UBC encounter, crowd and directory refinements

This release addresses four visitor reports: biography-first conversations,
clustered pedestrians, repeated building names and needing to click the scene
before walking after a location jump. It preserves the current geographic and
architectural coverage. The broader digital-twin limitations remain unchanged.

## Implemented behavior

- Approach a person and press E or tap Talk. Start with Hello, Who are you?,
  A question or Wave hello. Each action produces a response and relevant next
  choices; goodbye offers a return to exploration. The selected figure faces the
  visitor and waves, nods or gestures. Reviewed factual replies and source links
  remain separate from original scripted social responses. There is no live AI,
  impersonated voice, real-person participation or new personal claim.
- Identity appears after introduction inside the encounter. People remain absent
  from directories, map markers and fast-travel destinations. Optional typed
  questions use reviewed keyword topics; unsupported questions say so. The latest
  24 turns and introduction status remain in memory for the session. Participant
  profiles retain their own written answers and reporting controls.
- Source-route pedestrian arrivals have an 8 m initial separation, a local density
  cap, a 9 m exclusion around the visitor and a maximum of 12 streamed named
  characters nearby. Existing actors remain stable until distant. Ordinary
  walkers start along paths, rather than shared vertices. Collision-checked
  passing and short varied pauses reduce queues. Only the selected conversation
  partner stops for the encounter; nearby passersby continue.
- The source snapshot contains 605 distinct footprints and 425 source building
  groups, including 63 multipart groups. No duplicate IDs or exact repeated
  geometry were found. Directory grouping removes all importer-generated repeat
  listings without deleting any geometry. Crescent West becomes one result at
  5879 Gray Avenue, describing its seven footprints. Grouping uses source IDs,
  not name similarity, so unrelated same-named buildings cannot be merged.
- Visit entrance, Go here, Guide me and returning to an on-foot camera give the
  canvas keyboard focus. The location-jump path overrides the dialog's normal
  focus return. Ending a conversation also resumes scene focus. No pointer lock
  or extra scene click is required to walk.

## Code and verification

The implementation is isolated to `projects/ubc`: the conversation component,
pure dialogue reducer, directory grouping helper, scene/pedestrian integration,
styles and regression tests. No dependency, server endpoint, public GIS snapshot,
profile storage format, city engine or shared homepage feature changes.

The UBC suite passes all **53 tests**, covering action responses, follow-ups,
refusals, participant replies, history bounds, gestures/reduced motion, separation,
opposing pedestrians and directory groups, alongside existing navigation,
interior, source and community tests. TypeScript/ESLint passes with the existing
unrelated tutorial navigation warning. Production dependency audit: zero findings.
Vinext and Next webpack builds pass. Vancouver 74, Surrey 54 and Richmond 27
regression tests also pass: **208 tests in total**.

[Four actual browser captures](validation/ubc-conversations/README.md) show the
corrected directory, desktop/phone conversation and baseball-precinct path. Browser
acceptance verified identity discovery, waves, operations-research/healthcare
follow-up, management science, unsupported personal-opinion questions, goodbye,
reopening history, new-tab source attributes and focus after location jumps.
Phone (390×844), tablet (approximately 768×1024) and desktop (1280×720) CSS viewport
checks found no horizontal overflow; console errors/warnings were absent.
Local development intentionally had no public-profile storage configured; existing
production profiles and their persistence are not changed by this release.

Physical-device tests, sustained crowd load/FPS tests and a full accessibility
screen-reader audit were not performed. Passing checks do not establish
photorealism or a universally accurate campus reconstruction. The crowd remains a
bounded procedural simulation, not a live population or schedule.

Deployed and verified on October 31; see the
[production receipt](UBC_ENCOUNTER_RELEASE_2026-10-31.md) for exact source/build,
public checks, recovery and remaining validation limits.
