# Prompt 150: Orchard Commons minimum viable residence

- Date: 2026-10-31
- Scope: platform
- Goal: Extend UBC with a functional, sourced residence open house and validate it for the explicitly requested production release.

## Original user request

> Browser is now available

> Build Orchard Commons as the first genuinely explorable student residence in UBC Virtual Campus.

> Implement → Test → Validate → Commit → Deploy to Production → Verify → Report.

The user supplied a consolidated campus specification, an academic-interior and
residence addendum, and a narrower next-release Orchard MVR specification. The
latest scope requires both existing GIS footprint parts, one lobby/residential
floor, six connected singles in three bathroom pairs, two doubles with bathrooms,
working doors, common spaces, three fictional students, source links, actual
screenshots, regression tests and guarded automatic production deployment. The
broader campus and Sauder expansions remain later milestones. The romantic Easter
egg is explicitly deferred. No private attachment paths or generated attachment
filenames are retained here.

## Scope

Extend the existing `/labs/ubc` engine and visitor UI, preserve earlier campus
features and all city projects, and prepare an exact-source Linux release. Full
Orchard interiors, surveyed room replicas, photorealistic fidelity, live housing
data and real resident representations are outside this MVR.

## Decisions

- Preserve both source rings and a new immutable derivative; use the recorded
  accessible tertiary courtyard entrance and disclose that it is not the measured
  main front-desk entrance.
- Separate source podium outlines from interpreted upper towers. Historical 2014
  elevations inform heights; current as-built tower measurement remains unverified.
- Label one enlarged demonstration floor Level B and all bedrooms fictional.
- Share door angle with collision; pause an obstructed swing. Model an actual
  moving lift and stairs, without room/floor teleportation.
- Reuse the existing character/content system for three explicitly fictional guides.
- Keep original MIT geometry/textures and PDDL GIS; distribute no reference photos,
  plans, logos, real-student data or likeness assets.
- Follow the latest user's explicit deployment instruction under existing host,
  capacity, protected-route, peer-service and rollback rules.

## Implementation

Eight furnished rooms, five bathrooms, sixteen functional doors, furnished lobby,
corridor, lounge/snack kitchen, study area, stairs, lift, floor guide, directory,
map and Housing links. Room geometry loads/unloads deterministically. Maya, Leo and
Ari have fifteen sourced topics and follow-ups. A fidelity registry distinguishes
completed reconstructions, exterior context and future landmarks.

## Engineering impact

No new dependency, backend, tracking, persistent dialogue or separate renderer.
Dynamic interior collision and explicit floor-aware character routes extend existing
types. Batched windows/furniture and bounded lights limit rendering cost. The existing
`prebuild:next` hook now also runs UBC tests, including in the unchanged Linux workflow. City engines/data remain unchanged.

## Files changed

Residence/door/layout/mesh/exterior/content modules; engine/spatial/people/registry
integration; accessible floor guide and UI; source derivative/manifest/verifier;
new navigation tests; route/card copy; fidelity audit; eighteen real captures.

## Documentation updated

Project/main READMEs, architecture, content, local development, testing, asset and
rights notes, deployment scope and the full MVR report/gallery.

## Git diff summary

55 files changed, 4,593 insertions, 106 deletions. Most new lines are residence
geometry, tests and the geographic provenance derivative. Eighteen image artifacts
show actual rendering and browser interactions; no generated marketing imagery.

## Verification

- UBC 26, Vancouver 74, Surrey 54, Richmond 27, investment 7 and Python GIS 5 pass.
- TypeScript/lint pass; one existing tutorial warning. Production audit: zero findings.
- Standard Next webpack and Vinext/Cloudflare builds pass; diff/privacy scans pass.
- Pinned-source derivative checker reproduces five sections, entrance, source rings and digest.
- Browser entry, all eight rooms, connecting/double bathrooms, all three students,
  common spaces, stairs, lift in both directions and normal exit pass.
- Four seasons, weather/day/night, three camera modes and safe external link opening checked.
- Desktop/tablet/phone viewport checks; held touch walking/conversation and Escape focus return pass.
- Browser-discovered lift sill/arrival bugs fixed with an integrated regression test.
- Short samples show 60 FPS; sustained/physical-device performance remains unverified.
- Production baseline recorded, all protected HTTP/assets healthy, headroom above
  192 MiB memory / 6 GiB disk. Exact Linux candidate/activation is the next gate;
  this record does not claim deployment success.

## Repository state after implementation commit

`main`, clean, two commits ahead of the initial synchronized base after this
archive is committed. No branch, worktree or PR created; no unrelated edits.

## Implementation commits

- `3ef17580435b1a0acc25db59b058068b7b90c1ee` — Add Orchard Commons residence open house with eight walkable rooms.

## Archive commit

`Document Orchard Commons MVR implementation and validation`

The first unpublished commit pair was replaced locally after GitHub rejected a
workflow-file update because the existing credential lacks workflow scope. The
workflow is unchanged; UBC tests instead use the established build hook. No access
permissions were expanded and no remote history was rewritten.

## Lessons learned

Test lift boarding through the complete floor/collision update loop, including
approaching before arrival. Isolated platform movement tests missed a sill gap and
occupied-threshold deadlock. Browser walkthroughs and room-pair tests complement
each other. Separate historic design evidence from current measured geometry.

## Follow-up ideas

Obtain licensed current dimensions, improve materials/facades/vegetation, measure
physical-device performance, and expand one sourced residence floor at a time.
