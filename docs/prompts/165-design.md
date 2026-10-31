# Prompt 165: UBC landmarks, athletics and Halloween edition

- Date: 2026-10-31
- Scope: design
- Goal: Add a gateway arrival, source-based landmark interiors and athletics detail, and a reusable Halloween edition enabled for this week.

## Original user request

> Is there the big UBC sign on 10th and Wesbrook?

> Make sure it is there. And have the player start from there

> Beaty Biodiversity museum should be able to see the big whale skeleton from outside. Search Internet for images and make it realistic. Should be able to enter the museum

> Make sure the exterior and interior of Irving K. Barber Learning Centre is as realistic as it can get

> Make the soccer fields beside baseball field realistic. Thunderbird stadium needs to be more realistic. The track and field beside rose training centre needs to be realistic and make sure people are jogging on the track

> Now, I want to add the “Halloween Edition”. This should be able to be turned off after Halloween season but turned on again next year. I want to decorate all the interior that can go in as haunted with ghosts. And monsters walking around the campus. The time and weather should be fall evening with a scary ambience like full moon and dark clouds.

> Halloween edition should be on by default for this week

Standing user authorization to complete decisions and deploy remains in force. This record covers implementation; a separate release receipt will record actual deployment.

## Scope

Added the six requested areas of work to the existing campus without replacing its character conversations, profiles or city applications. Geographic coverage remains mixed-detail and reference-based. No new external model or photograph is redistributed.

## Decisions

- Research places the letters at University Boulevard and Wesbrook Mall. Use the official pedestrian island, original silver letter geometry and a connected walkable arrival.
- Use the narrow Main Mall Beaty pavilion footprint, transparent glazing and an original approximately 26m whale skeleton; support negative floor elevations and genuine descending ramps.
- Reconstruct public Irving spaces from its official footprint, public floor maps and architectural references. Preserve explicit Level B interpretation status and restricted-space boundaries.
- Source-align three soccer fields, the eight-lane track and existing Thunderbird Stadium. Model supported stands and activity; do not render future proposals as completed.
- Keep Halloween an additive layer with 29 spaced decoration sets across nine interiors, two gateway pumpkins, clear-route creatures, moonlight and dark clouds. Reuse six instanced batches and honour motion/population controls.
- Default on October31–November6 inclusive in Vancouver for2026; subsequent annual default October25–November1. A current-year manual local preference wins. Turning off restores the preceding atmosphere within the visit.

## Implementation

The visitor starts facing the entrance letters. Beaty and Irving increase supported building interiors to nine. New source-based athletics geometry includes24 simulated soccer players and12 track joggers. Halloween can be toggled year-round through Atmosphere and turned off from photo mode. The public UBC badge and GIS Apps card describe V0.4 and nine interiors.

## Engineering impact

Introduced additive anchor/layout/model modules, convex ground openings for the museum and below-grade floor support. Added source/collision/movement/environment tests. No dependency, authentication, profile backend, service configuration or published GIS snapshot changes. Browser preferences remain local. Existing independent app boundaries are preserved.

## Files changed

UBC architecture, landscape, environment, registry and engine integration; new gateway/Beaty/Irving/athletics/Halloween modules and tests; UBC route/card copy; provenance and implementation documentation; eight actual browser screenshots and gallery.

## Documentation updated

Root/project READMEs, architecture/content/testing guidance, asset manifest, third-party notices, landmark fidelity registry and the detailed landmarks/Halloween implementation report. Production remains pending in this commit.

## Git diff summary

48 files changed;4361 insertions and88 deletions, plus eight screenshot binaries. Changes are scoped to the campus and its public card/documentation.

## Verification

- UBC99, Surrey69, Richmond27 and Vancouver74 tests passed:269 total.
- TypeScript/ESLint passed with the existing tutorial navigation warning.
- Vinext and Next production builds passed; local Next build qwey2Xqf7rk9-KesME5qs. Final V0.4 copy verified in emitted Vinext bundles.
- Production dependency audit:0 vulnerabilities. Whitespace checks passed.
- Browser checked the gateway, outside-visible Beaty whale, both museum ramp flights, Irving entry/stairs throughLevel3, moving jogger, final aerial field lines, stadium stands and interior Halloween ghost.
- Phone390×844/tablet820×1180 controls had no horizontal overflow; keyboard Space toggles the edition. Fresh-origin production preview defaulted to Halloween. No console errors/warnings in final captures.
- Physical-device testing is outstanding. An Irving development observation was about12FPS/559draws/1.817million triangles; this does not meet or certify the target60FPS. Full-campus architectural fidelity is not claimed.
- Scoped public-source/privacy scan found no new credential/private-path/tracking/profile references. Historical documentation exceptions remained unchanged. Captured images contain no embedded metadata.

## Repository state after implementation commit

Main at 05b600242227a0bd44d6ec8b0258573db51fc66b; clean immediately after the implementation commit, ahead of origin/main by one. No unrelated user changes were staged. Push follows the separate archive commit.

## Implementation commits

- 05b600242227a0bd44d6ec8b0258573db51fc66b — feat(ubc): add landmark interiors, athletics and seasonal Halloween edition

## Archive commit

`docs: record UBC landmarks and Halloween implementation`

## Lessons learned

Validate subpixel sports markings at aerial distances as well as on foot. Below-grade interiors require both collision-floor handling and real ground openings. Multi-level seasonal placements must avoid stairs and low ceilings. Keep automatic defaults separate from explicit visitor preferences.

## Follow-up ideas

Improve measured terrain, near-field vegetation and facade fidelity; optimise interior frame time; conduct physical-device walkthroughs; continue sourced room-by-room accuracy reviews. These are not completed claims.
