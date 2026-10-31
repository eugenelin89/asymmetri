# Prompt 169: Case Western campus and seasonal soundscape

- Date: 2026-10-31
- Scope: design
- Goal: Adapt the UBC campus explorer to Case Western Reserve with sourced geography, enterable landmarks, campus characters, public profiles and a calendar-controlled Halloween experience.

## Original user request

> I want to build something exactly like UBC, same level of details, same logic, includeing Halloween edition, with professors and athletes built from staff directory websites and students from LinkedIn walking around their faculty, but for Case Western University.

> has to be as realistic as possible both interior and exterior. Famous landmarks must be the same. Popular buildings, residents, and lecture halls must be enterable.

> make sure for the holloween edition, you have many different monsters, chinese zombies, comic superheros, manga characters, robots walking around campus

> all the controls and functionalities must be the same as UBC, such as players can enter their own profile and it becomes a character in the game...etc.

> just like UBC, halloween edition should be able to turn off after season and we may switch theme later in different holidays.

> base on the calendar date, the game should select by default what make sense. for example, Halloween should start a week before Oct 31 to a week after Oct 31. Christmas (not yet available but will be available) should be default for month of December.

> Also, base students on LinkedIn profiles

> Like UBC, for Holloween edition there should be a Friday the 13 character chasing the player around with a knife

> play scary sound in the background, like wolf sound, and scary music and when nearby ghosts, make ghost sound like crying sound, screaming sound...etc. make it like in a scary movie.

> eta till full deployment?

> update eta to full deploymen every 10 minutes

The owner subsequently supplied multi-campus public-source research containing 500 CWRU names and study fields. The CWRU import uses only the intended university rows, source URLs and expected class years when supplied; contact columns and the private research attachment are excluded.

## Scope

Implemented the independent CWRU route, geographic snapshot, architectural reconstructions, public factual roster, self-profile lifecycle, calendar/theme controls, costume population, optional pursuer and original soundscape. Preserved the existing UBC and unrelated campus work. No deployment, hosted preview, production persistence activation or real participant profile publication was performed.

## Decisions

- Reuse the UBC control conventions while keeping CWRU modules, geographic data, routes, settings, cookie and profile storage isolated.
- Retain real OSM source outlines and recognizable landmark features; disclose procedural interiors, interpreted circulation, flat terrain and exterior-only wings instead of promising an exact digital twin.
- Import the supplied research with a field allowlist, stable IDs, deduplication and public-source audit. Preserve fallback team-roster citations where individual-page requests fail, and never import emails or portraits.
- Use limited public professional/education facts with generic original avatars and fictional movement/dialogue. Direct LinkedIn access was blocked, so indexed education self-reports remain explicitly unverified. No real whereabouts, room assignments, contact details, portraits or voice likenesses were collected.
- Interpret the requested Halloween interval as October 24–November 7 inclusive in Cleveland every year. Reserve all of December for future Christmas assets and retain Regular until that edition is available. Manual choices persist.
- Use original instanced procedural creatures and genre-inspired costumes. The Friday-the-13th-inspired hockey-mask pursuer has a prop knife, outdoor path pursuit and indoor shelter, without attacks/damage.
- Generate original music and creature cues with Web Audio. Require a player gesture, bound cue frequency, attenuate/pan nearby ghosts, and stop sounds on mute, regular mode, hidden tabs and disposal.
- Correct inherited panel dismissal focus: detect the open-to-closed transition, focus the canvas in walking modes and remove competing opener restoration from dialog cleanup. Preserve input typing guards and map focus behavior.

## Implementation

The campus includes 1,068 source footprints, 17 enterable building reconstructions and DiSanto Field. Detailed landmarks include Kelvin Smith Library, Tinkham Veale, Peter B. Lewis, Adelbert, Amasa Stone, think[box], Strosacker, Veale, Clarke and the Village. Clarke has six usable doors, stairs, a platform lift and a suite guide. The expanded roster contains 528 named people: 13 faculty, eight retained athlete records and 507 student records, plus one fictional guide. The 500 supplied rows enrich five existing people and add 495 distinct entries, with ten university models and two reserved player-profile models rendered at once. All supplied names were corroborated on university pages; 434 study fields were found in linked source text and 66 retain provided-research attribution. None of these checks proves current enrollment. Player-written profiles become walking characters and support editing, deletion, recovery and reporting. Halloween adds 16 creature/costume types and 128 distributed actors with quality-dependent visible caps, decorations, pursuit, eerie music, howls, cries and screams.

## Engineering impact

No dependencies were added. The explicitly requested profile backend adapts the existing durable Node filesystem store with separate CWRU boundaries and remains unavailable on unconfigured hosts. Original audio requires no files, external service or microphone. Keyboard/touch controls, focus, responsive layout, reduced motion and population controls remain available. Source licensing, public identity limitations and operator responsibilities are documented.

## Files changed

- CWRU route and four community API route modules; shared content card and sitemap entries.
- CWRU client, rendering, navigation, architecture, population, interactions, profiles, theme and audio modules, with focused tests.
- Pinned OSM data/anchors/manifest, original welcome map, source records and notices.
- Onboarding, architecture/content/development/testing/asset documentation, detailed implementation and profile-operations reports, and local screenshot evidence.

## Documentation updated

README and the project guide describe the actual controls and feature boundaries. Shared guides explain data ownership, local profile setup, calendar/audio behavior and verification. The asset manifest identifies OSM licensing, source-informed procedural assets and original sound synthesis. The implementation report records validation and reconstruction limits; the operations guide covers isolated persistence, ownership, moderation and durability.

## Git diff summary

86 files changed, 22,205 insertions and five deletions. Includes versioned geographic data and sanitized roster data.

The implementation adds the independent CWRU experience and its evidence while preserving unrelated work.

## Verification

Node 24.10.0 matched `.nvmrc`. Isolated TypeScript and ESLint passed, with only the existing tutorial-navigation warning. All 89 CWRU tests passed. Standard Next webpack and Vinext/Cloudflare builds passed with the expanded roster. Production dependency audit reported zero vulnerabilities. The staged diff whitespace check passed. Desktop, tablet and phone browser checks covered controls, interiors, calendar/audio settings, profiles and keyboard focus; a later Case Quad traversal with the expanded roster reported no console errors. Local HTTP exercised synthetic profile create/read/edit/recovery/delete and origin rejection, then removed fixtures. Test servers stopped.

The baseline was updated to the completed Campus and City menu release before committing. Exact-source Linux CI and production acceptance remain separate release work; no production deployment is claimed by this record.

## Repository state after implementation commit

Branch `main`, implementation `2332e7b4448dc02b02ad1088042a06e60cf45a63`, one commit ahead of `origin/main` before this archive. Unrelated UBC/student/review/analytics and Stanford work remains uncommitted and unstaged; shared package and content files retain only their other-owner working hunks. No branch, worktree or PR was created. The archive and implementation will be pushed together.

## Implementation commits

`2332e7b4448dc02b02ad1088042a06e60cf45a63` — feat(cwru): add sourced campus, public characters and seasonal exploration

## Archive commit

`docs: archive CWRU campus and Halloween implementation`

## Lessons learned

Source-outline wings and furnished cores require connected, collision-tested entrances; stair and lift openings must match rendered slabs. A calendar catalog must distinguish planned editions from available overlays. Audio needs explicit lifecycle cleanup. Dialog closure must restore game focus after unpausing without stealing focus from text inputs. Concurrent projects require isolated validation output and carefully scoped staging.

## Follow-up ideas

Future work may add verified architectural measurements and additional furnished rooms, refine cinematic sound timbres through listening sessions, and implement Christmas assets. Production deployment and profile storage provisioning remain separate authorized release work.
