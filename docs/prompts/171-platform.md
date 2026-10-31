# Prompt 171: Stanford campus exploration and seasonal editions

- Date: 2026-10-31
- Scope: platform
- Goal: Add an independent sourced Stanford campus with UBC/CWRU controls, public visitor characters, and calendar-based base/Halloween editions.

## Original user request

> based on the UBC and Case Western thread in this project, build one for stanford. It has to have a base edition, and then a Holloween edition. Make sure it is at least at the same level of details as UBC and CWRU but should even be more realistic and detailed. Make sure all the famous buildings are enter-able and details must study what you can find photos and images on the internet so it is as details as possible. Make sure real professors are walking around based on staff directory. Make sure all the athletes are also walking around their venues based on their NCAA Div 1 athlete directory. Make sure famos profs like Fei Fei Li, Andrew Ng, Chris Manning, and famous alumni are all waking around campus. For the Hollween edition, lots of ghost, mosters from various cultures, zombies, chinese zombies, Super Heros from Comics, Manga characters, monsters, robots are roaming around campus.

The user additionally required parity with UBC controls and personal public characters; seasonal themes that can be turned off; Halloween by default October 24–November 7 and a reserved December Christmas window; student characters based on public LinkedIn profiles; a Friday-the-13th-style masked pursuer; scary background music, wolf howls and nearby ghost cries/screams. The user requested a deployment ETA and updates every ten minutes. Later owner-provided student research supplied 500 Stanford records for import without contact details or portraits. Shared review and private analytics components are coordinated follow-on work owned by the UBC chat. Stanford owns its later campus integration, testing and deployment after those components are committed; they are not included in this implementation candidate.

## Scope

Stanford source, geography, architecture, characters, interactions, seasonal sound, profile backend, validation evidence, its GIS card/sitemap entry, focused test hook and affected documentation. Other campus implementation and uncommitted shared features remain outside this commit. This record describes source implementation; production activation requires a separate verified release receipt.

## Decisions

- Use public OSM geometry and linked official/architectural/photo references for original procedural models. Distinguish observed forms from interpreted room layouts, generic furnishings and flat terrain.
- Provide 32 enterable landmarks and 12 outdoor venue groups, retaining the separate Redwood City rowing/sailing waterfront at its real source location.
- Use generic authored avatars with public professional/academic facts and simulated walking routes. Keep source seasons, review status and current-enrollment limits explicit; do not imply real whereabouts or endorsement.
- Preserve UBC-style first/third person, orbit/map, search/guidance, encounters, personal appearance/public character ownership, photo mode, accessibility and quality controls in an independent Stanford namespace.
- Make holiday overlays modular and calendar-aware in Stanford time, with manual override and an unavailable Christmas placeholder. Use original procedural monster/costume geometry and Web Audio synthesis rather than downloaded art, scores or voices.
- Compile collision-checked placement/routes/navigation before runtime and stream nearby models within quality budgets. Retain low-quality and reduced-motion controls.
- Keep private visitor data outside source/build/rollback directories and separate from other campuses. No dependency additions or infrastructure changes are part of the source implementation.

## Implementation

The campus contains 4,581 mapped building parts, 29,635 surfaces, 7,144 trees, 3,291 pedestrian routes, 156 entrances and 3,398 road parts. Landmark models include Church, Quad, Hoover, libraries, arts/music, engineering, residences and athletics. Branner has working demonstration room doors and a lift; Hoover has an 18-flight route to its viewing deck.

The registry includes 823 unique athletes with 855 memberships across 32 published roster pages covering 36 varsity programs, 39 faculty, 18 alumni, six historical figures, 515 student-kind entries and one fictional guide. All 500 supplied student rows are represented through 499 additions and one evidence-based athlete merge. Final source-inspection figures: all 500 supplied references inspected (498 official profiles, one personal portfolio and one public LinkedIn excerpt); 137 of 138 supplied completion years corroborated, with one explicitly uncorroborated. A credential/name parsing error was corrected while preserving the supplied spelling and stable ID. Current enrollment remains unverified.

Halloween adds 22 monster types, original comic/manga/robot costume visitors, pumpkins, bats, interiors and moonlight. A switchable masked pursuer carries a prop knife, stops short, waits outside interiors and causes no damage. Original sound generates music/wind/bells/howls and spatial ghost cries, with gesture unlock, mute/volume, hidden-tab suspension and base-edition fade.

## Engineering impact

Independent route/content/data ownership; strict TypeScript and existing dependency set; isolated profile API/cookie/store; source-bound precompiled navigation and collision assets; asynchronous scene construction, culling and adaptive rendering; panel focus restoration and input guards; source/privacy disclosures and encounter-only characters. The reconstruction is stylized, not surveyed or photorealistic. Browser audio telemetry does not establish subjective speaker quality, and shared-host frame rates are observations rather than performance certification.

## Files changed

- Stanford route and community endpoints, centralized Stanford copy, GIS discovery and sitemap.
- Stanford scene, architecture/venues, controls, profiles, characters/importers, holiday/audio/pursuit modules and focused tests.
- Versioned OSM source snapshot, provenance, original procedural assets and compiled simulation data.
- Local screenshot evidence, project/operations guides and shared architecture/content/testing/development/asset/deployment documentation.
- Stanford test script and standard Next prebuild hook only; unrelated pending shared scripts excluded.

## Documentation updated

Root README, architecture, local development, content guide, testing, asset manifest and deployment guide explain ownership and operational boundaries. Stanford implementation/evidence, public-profile operations, project README, third-party notices and screenshot gallery record source evidence, limitations and actual validation.

## Git diff summary

101 files changed, 92203 insertions(+), 3 deletions(-). The change adds the independent campus and its evidence, with small Stanford-only integration edits; existing campus implementations are unchanged.

## Verification

The final isolated candidate preserves committed CWRU/menu source 28b5521 and excludes unfinished shared modules. TypeScript/ESLint passed with the pre-existing tutorial navigation warning. Vinext and standard Next webpack builds passed. All 459 prebuild tests passed (Surrey 69, Richmond 27, UBC 134, CWRU 89, Stanford 140). The Stanford suite includes all 32 landmark entrances against complete campus collision, route/cache provenance, architecture/stairs, sports seating, Branner doors/lift, date windows, pursuit/sound and community ownership/security. A separate final source review confirmed 500 supplied references, 137/138 years and one stable-ID name correction, with no emails/private paths. Local production HTTP checks passed 8 pages, 20 static assets, 3 exact-hash Stanford geographic assets, GIS/sitemap integration, protected footer links, tutorial canonical and public profile feed/no-store projection. Earlier browser acceptance covered desktop/tablet/mobile, focus/movement, seasonal choices, map/profile form, photo PNG preview, Church entry, reduced motion and sound state/cue telemetry with no console errors. A disposable local profile lifecycle fixture passed and was deleted. Audit reported zero production vulnerabilities on the unchanged dependencies. The validation gallery and implementation report record hardware/audio/geometry limits. Final staging reviewed exactly 101 intended paths and passed whitespace checks. One extra end-of-file blank line was removed from builder.ts; all three model-bound caches were regenerated and all 140 Stanford tests passed again. This whitespace-only correction did not change runtime behavior. The exact pushed source receives its own Linux CI build before any deployment.

## Repository state after implementation commit

Branch main. Implementation commit 257bbb4d0c398f2a8c32e8fd3ec4fbef541004f9. The implementation is one commit ahead of the previously synchronized origin/main. Concurrent UBC reviews/analytics/student changes remained unstaged and untouched. The exact integrated candidate preserves the committed Campus and City navigation and CWRU source. No Stanford production activation is claimed by this record.

## Implementation commits

- 257bbb4d0c398f2a8c32e8fd3ec4fbef541004f9 — feat(stanford): add sourced campus exploration and seasonal editions

## Archive commit

`docs: archive Stanford campus implementation and validation`

## Lessons learned

Keep source review distinct from current enrollment and simulation distinct from real attendance. Regenerate every source-bound cache after data/model changes. Use isolated committed-baseline validation during shared-checkout work and stage only owned changes. A successful build is separate from production deployment and live acceptance.

## Follow-up ideas

The Christmas edition, surveyed terrain/interiors, sustained physical-device performance and subjective audio acceptance remain future work. Shared reviews and private analytics require their own committed source and coordinated release.
