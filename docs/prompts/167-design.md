# Prompt 167: UBC After Dark welcome, campus cast and horror soundscape

- Date: 2026-10-31
- Scope: design
- Goal: Give the seasonal campus a distinctive welcome and an interactive, optional Halloween atmosphere.

## Original user request

> For holloween edition, this page should say something about Halloween, haunted...etc. Use creativity to make this page look like a beautiful holloween edition.

> also, i want a scary "Friday the 13th" chasing the player around with a knife

> Also, lots and lots of monsters like wolf-man, lizard man, and chinese style zombies, western style zombies, vampires...etc

> i also want spiderman, superman, super woman, and all the comic heros walking around campus

> batman, the hulk, wolverine, and japanese manga characters, robots...etc

> base on the calendar date, the game should select by default what make sense. for example, Halloween should start a week before Oct 31 to a week after Oct 31. Christmas (not yet available but will be available) should be default for month of December.

> just search LinkedIn for those with UBC in their profile and use the name and what they studied

> play scary sound in the background, like wolf sound, and scary music and when nearby ghosts, make ghost sound like crying sound, screaming sound...etc. make it like in a scary movie.

> After clicking on "Explore campus" and exit, focus was no longer on the game and wsad won't work without explicity clicking on the game. this behavior is kind of confusing. please fix, and make sure all the other colleged (Stanford, CWRU) would fix or prevent this bug

These successive requests extend the existing campus. Earlier user instructions authorize autonomous decisions and deployment after validation.

## Scope

UBC's welcome, seasonal settings, original procedural figures and audio, six public education encounters, source links and validation documentation. Existing campus geometry, nine navigable interiors, profile service and other applications remain unchanged. Concurrent CWRU/Stanford work is excluded from the implementation commit.

## Decisions

The welcome uses original responsive SVG artwork and semantic controls. Halloween is the default October24–November7 inclusive in Vancouver; a current-year manual choice wins. December is reserved for future Christmas support but cannot enable an unavailable edition. Ordinary seasons follow Vancouver's calendar.

Eighty-four route-checked monsters and24 comic/manga/robot costume visitors have distance/detail caps and shared rendering. The original masked pursuer stops short, waits outdoors and can be outrun; the user can disable it independently. No combat, injury or score system is added.

Original Web Audio supplies eerie drones, wind, howls and nearby ghost cries/screams. Entry unlocks playback, while mute, volume, hidden-tab suspension and cleanup bound resource use. Same-floor distance checks prevent cues through adjacent ceilings.

Six directly accessible self-authored LinkedIn graduation posts provide names/degrees/fields for alumni encounters. They are not represented as currently enrolled students. No portrait, personal likeness, contact details or private biography is imported; exact reviewed source URLs accompany scripted conversations.

## Implementation

The welcome, calendar, monsters,24 costumes, optional pursuer and original soundscape integrate into the existing exploration shell. Population, reduced-motion and edition controls continue to work. All panel-close transitions return keyboard focus to the scene, preserving the input guard and map UI focus. Stanford/CWRU owners received the matching requirement and root cause. Six education-based alumni records reuse existing encounter/conversation routing; source-date labels now say Sources checked.

## Engineering impact

No dependency, server API, authentication, persistent public-profile schema or underlying GIS change. New controllers use shared instancing/batching, bounded audio scheduling and explicit disposal. Deterministic initial server rendering avoids hydration mismatches. Existing navigation, public-profile and campus conversation behavior is preserved.

## Files changed

UBC experience shell, settings/types, scene integration and CSS; original welcome component; monster, pursuer, costume and audio modules/tests; education records and exact-source URL validation; conversation metadata label. Project guide, root onboarding link, asset provenance, implementation report and scoped visual evidence accompany the implementation.

## Documentation updated

README points to the After Dark report. UBC's guide describes controls/calendar/coverage. The report and asset manifest distinguish original illustrations and models, self-reported education sources, actual tests, local screenshots and remaining physical-device limits.

## Git diff summary

28 files changed, 2718 insertions(+), 122 deletions(-)

The changes add seasonal rendering/audio controllers, reviewed education encounters,
calendar defaults, panel focus restoration and implementation evidence.

## Verification

Isolated final-source strict TypeScript, scoped UBC lint, 36 focused audio/calendar/education/core/conversation tests, Next.js production compilation and Vinext packaging passed. After the focus correction, scoped lint, strict TypeScript/Next compilation and Vinext packaging passed again. Earlier unchanged suites passed69 Surrey/27 Richmond/74 Vancouver; the cast checkpoint passed119 UBC tests. Dependency audit reported zero vulnerabilities. Existing Browserslist, Vinext chunk/classification and tutorial-navigation notices remain documented.

Browser checks passed at1280×720,768×1024 and390×844: no horizontal overflow, visible keyboard focus, sound unlock/mute/resume, keyboard volume adjustment, edition reset, first/third-person movement, map, pursuit escape and scene initialization. Final focus checks proved canvas focus and immediate untargeted held-key movement after Explore campus X, Escape from search, and Atmosphere backdrop dismissal. No browser warnings/errors were observed. Exact-source Linux CI/deployment acceptance follows in journal168.

No physical-device audio listening, measured FPS or complete roster visual inspection is claimed.

## Repository state after implementation commit

Main at 9a5872e5a409a04a7d847e1b3c19ba7c92c930b3. Concurrent unrelated CWRU/Stanford edits remain uncommitted and excluded. Remote remained7711e84 before this pair; only the reviewed UBC implementation and this journal are pushed. Deployment is a separate operation and journal168 records its actual result.

## Implementation commits

- 9a5872e5a409a04a7d847e1b3c19ba7c92c930b3 — Add UBC After Dark cast, calendar and horror soundscape.

## Archive commit

`docs: record UBC After Dark implementation in journal167`

## Lessons learned

Treat calendar eligibility separately from feature availability. Preserve live audio status rather than only the requested toggle. Use supporting-floor heights for spatial cues. Keep snapshot provenance precise when features change during validation. Stage shared documentation by ownership so parallel projects do not enter an unrelated release.

## Follow-up ideas

Implement the reserved Christmas edition, evaluate the mix on physical phones/headphones, and expand distinctive creature animation and campus sound occlusion. These are not completion claims or new commitments.
