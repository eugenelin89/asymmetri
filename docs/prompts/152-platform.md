# Prompt 152: UBC campus life and visitor navigation

- Date: 2026-10-31
- Scope: platform
- Goal: Extend the functional campus preview with visitor navigation, encounter-only characters, campus activity, public profiles and researched public interiors.

## Original user request

> I am going to bed. you are authorized to make decision. please complete the project without me. good night

The continuing master specification requests an accurate, beautiful unofficial UBC
visitor environment, sourced GIS, public interiors, educational conversations,
seasons/weather, three camera modes and production validation. Consolidated
attachments expand Sauder and residences, with Orchard Commons as the earlier
minimum viable release. Follow-up instructions add third person, running, map
teleport/GPS, avatar appearance, and remove every character listing in favour of
natural encounters. They request official faculty/staff/varsity/alumni simulations,
Einstein near enterable Hennings, the owner's Christopher Lin self-profile, opt-in
public profiles published immediately with reporting/removal, animals, joggers,
cyclists, frisbee/soccer/baseball/basketball, enterable War Memorial Gym, an improved
Rose exterior, a stylized approximately 6′2″ Mitch Hodge character, sourced-number
blue/silver/yellow buses with passengers and road traffic. The user substitutes an
original bird drawing for the Thunderbird mark, requests Blue Chip and a historical
GVRSF fair in the Nest, and explicitly authorizes deployment when ready.

## Scope

V0.3 is a substantial functional research preview. It does not finish the full
photorealistic digital twin, every UBC department, expanded Sauder academic rooms,
or all residences. Seven buildings have Level B interiors. Existing unrelated
website content and immutable city/UBC snapshots remain unchanged.

## Decisions

- Discover identities only through nearby visible encounters; no roster or people
  directory, map pin, tracking or character fast travel.
- Use public professional and varsity facts with source dates/season labels;
  stylized original figures and neutral curated explanations, no copied portraits,
  voices, endorsements or private opinions. No LinkedIn student import.
- Publish only opt-in self profiles; immediate publication with owner capabilities,
  reporting and operator hide/restore. Christopher's seed/recovery file stays
  outside Git. Identity and affiliation remain self-described.
- Nest fair is a retrospective Great Hall 2404 Level 2 reconstruction with fictional
  projects. Official 2027 event location differs and is disclosed.
- Keep sourced West 10th geometry as isolated context; do not invent the connecting
  neighbourhood or claim continuous pedestrian guidance there.
- Reuse the established Three.js/Next deployment foundations without adding an
  application dependency. Preserve the prior production runtime for rollback.

## Implementation

First/third-person cameras, turn/run controls, safe map travel, GPS, saved appearance,
streamed educational characters, original vehicles/animals/sport activity, Hennings
and gym interiors, Rose exterior refinements, Blue Chip/fair, profile API/UI/store,
source collectors and provenance, and seventeen real browser captures.

## Engineering impact

Public Node filesystem persistence is explicitly requested and isolated to UBC.
Atomic private storage, hashed ownership tokens, safe public projection, CSRF/body/
rate limits and moderation protect the new publishing boundary. Streaming bounds
crowds; static geometry batches reduce draw overhead. Aerial near-plane correction
fixes surface flicker without clipping near-field walking geometry.

## Files changed

UBC camera/map/navigation, avatar, character/population, scene/architecture/activity,
traffic and source-data modules; four scoped API endpoints and profile components;
route/site copy; research refresh tools; regression tests and validation screenshots.

## Documentation updated

Root/module READMEs, architecture, assets, content, local development, testing,
deployment preparation, source notices, full implementation report, profile
operations and the browser gallery. Production receipt follows verified activation.

## Git diff summary

75 files changed, 19,005 insertions and 409 deletions. Most added lines are sourced
professional/athlete/transit records; no private profile data or credentials included.

## Verification

- UBC 44, Vancouver 74, Surrey 54, Richmond 27 tests pass (199 total).
- TypeScript/ESLint pass; one pre-existing tutorial navigation lint warning.
- Vinext and Next webpack production builds pass; production audit: zero findings.
- Browser desktop/phone/tablet navigation, profiles, interiors, conversations and
  map actions validated; new clean production-build tab has no console errors/warnings.
- Diff and changed-file credential scan pass. No runtime/recovery data tracked.
- Gym Auto snapshot 37 FPS/2,544 draw calls/2,491,208 triangles; no sustained or
  physical-device performance claim. Master visual-quality benchmark remains unmet.

## Repository state after implementation commit

Main at 6e7ce98b39d6de0a7e1ddbe389fe26ba6fbbdf1f, implementation committed; clean before this journal. Two commits
will be pushed together. Production is still V0.2 pending exact-source Linux CI
and guarded candidate verification.

## Implementation commits

- 6e7ce98b39d6de0a7e1ddbe389fe26ba6fbbdf1f — Build UBC campus life, visitor navigation and opt-in profiles

## Archive commit

`Record UBC campus life implementation journal`

## Lessons learned

Physical browser walkthroughs found lighting, canopy overlap, upper-floor circulation
and aerial depth issues that type checks could not expose. Keep source accuracy and
reconstruction limits visible; procedural geometry should not be advertised as an
exact replica. Test actual public-profile publishing separately from local avatars.

## Follow-up ideas

The implementation report prioritizes measured PBR/terrain assets, remaining faculty
coverage, expanded public interiors, animation/performance and continuous geography.
