# UBC Halloween After Dark — implementation notes

This follow-up gives the Halloween edition its own welcome screen, expands the
roaming creature designs, adds comic/manga/robot visitors, and supplies a
separately switchable masked pursuer. It
builds on the [landmarks and Halloween implementation](UBC_LANDMARKS_HALLOWEEN_2026-10-31.md).
It adds no campus geography or supported interiors: coverage remains nine
reconstructed building interiors and five outdoor athletics venues.

These notes describe the current implementation. Isolated local validation and
browser checks are recorded below. Final production availability for this
follow-up is pending. The earlier release
receipt applies only to its recorded version.

## Seasonal welcome

`projects/ubc/HalloweenWelcome.tsx` supplies an original inline SVG illustration
with a moon, stylized campus facade, trees, bats, pumpkins, mist and a ghost.
The 760 × 780 viewBox is responsive artwork, not a measured architectural view or
a screenshot of the three-dimensional campus. `campus.module.css` supplies the
dark palette, responsive composition and subtle animation. The illustration is
decorative (`aria-hidden`, non-focusable); the adjacent heading, explanation and
controls carry the meaningful information. CSS respects the operating system's
reduced-motion preference.

`Campus.tsx` selects this welcome from the same Halloween setting used by the
scene. It offers **Enter if you dare**, an explicit switch to the regular campus,
and the independent **Masked pursuer** checkbox. The regular welcome retains
**Start exploring** and offers the reverse edition switch. Three.js still loads
when the visitor enters the experience, rather than to draw the welcome artwork.

The existing year-scoped device preference is now resolved once in an effect
after hydration, before entry. The server and initial client render remain
deterministic. The entry button also invokes the initializer as a fast-click
fallback; its guard prevents a second initialization from replacing an explicit
choice. Changing the edition on the welcome marks initialization complete.

Calendar defaults use `America/Vancouver`, independently of the visitor’s local
time zone. Halloween is automatically eligible **October 24–November 7 inclusive
every year**. A current-year manual on/off choice still overrides the calendar;
it expires at the next Vancouver calendar year. The edition choice is saved on
the device, not in a public profile. The pursuer defaults on independently.

The regular campus now starts in the matching meteorological season: spring in
March–May, summer in June–August, autumn in September–November, and winter in
December–February. Winter starts overcast, without assuming snowfall. Visitors can
still change the atmosphere. Halloween applies autumn, overcast and 19:30;
turning it off restores the visit’s previous season, weather and time.

A small seasonal-edition registry reserves **December 1–31 for Christmas** with
availability explicitly false. Christmas scenery and behavior have not been
implemented or activated. Until that edition is supplied, December defaults to
the ordinary winter campus. This follow-up supersedes the initial release’s
shorter Halloween windows, while preserving deterministic server rendering.

## Campus creatures

`halloween.ts` retains 29 dispersed pumpkin, ghost and cobweb decoration sets
across the nine supported interiors and their available floors, plus two gateway
pumpkins. These counts are asserted with the complete campus collision fixture.
Its outdoor population now has six original procedural designs: werewolf,
lizard creature, jiangshi, zombie, vampire and ghost. Silhouettes, clothing, tails,
ears, capes and movement distinguish the figures. These are fictional seasonal
visitors, with no named-person identity, biography or dialogue.

Near figures use articulated legs where appropriate; distant figures use simpler
whole-body geometry. Movement varies by kind, including hopping jiangshi,
shuffling zombies and floating ghosts. Walking animation advances with accepted
movement, so a figure stopped by an obstacle does not keep walking in place.

Routes come from the existing pedestrian data. Placement checks the route centre
and body clearance against solid obstacles, source building footprints and floor
height, with initial figures at least 18 m apart. Moving figures yield to nearby
visitors and other creatures. The configured population limits are 24 on Low,
48 on Medium, 60 on Auto, 72 on High and 84 on Ultra; visible counts also depend
on safe placements, distance and the visitor's position. The complete campus
fixture, including all nine interiors, the baseball stadium and the five athletics
collision volumes, produces 84 safe placements: 14 of each kind. This is a fixture
population, not a claim that every figure is visible at once.

The overlay uses 20 shared instanced batches: three decoration batches and 17
creature body, leg and distance-detail batches. Halloween off hides the overlay;
population off hides and stops outdoor creatures while retaining decorations;
reduced motion freezes animation. Quality also controls distance and detail.
Repeated toggles reuse render objects, and the existing scene lifecycle owns
their disposal. No solid creature collision is added to the visitor's movement.

## Comic, manga and robot visitors

`halloween-heroes.ts` provides an expandable roster of 24 fictional visitors:
Spider-Man, Superman, Superwoman, Wonder Woman, Batman, Iron Man, Captain America,
Thor, Hulk, Black Panther, the Flash, Wolverine, Captain Marvel, Supergirl,
Doctor Strange, Deadpool, Naruto, Goku, Sailor Moon, Luffy, Astro Boy, and three
original robots: Atlas, Rivet and Pip. This is a representative roster, not every
comic character. Their original procedural costume models use recognizable
colours, masks, capes, hair and accessories without downloaded artwork or actor
likenesses. Third-party character identities remain their respective owners’
properties; the project does not claim an affiliation or endorsement.

These seasonal visitors reuse eligible source pedestrian routes and yield to
nearby people and monsters. A nearby label identifies one fictional visitor at
a time when interaction markers are on; they have no directory listing. They are
roaming decorative visitors, separate from the existing campus conversation
registry. The existing named educational guides keep their conversation options.

One shared batched costume mesh, instanced legs/boots, near/far detail and
nearest-first quality limits bound the rendering work. Low, Medium, Auto and
High/Ultra allow up to 8, 12, 16 and 24 nearby hero visitors respectively; lower
quality still permits encountering every roster member. Halloween/population off
hides them, and reduced motion freezes their walking. Their explicit disposer
releases the batched mesh's internal textures as well as geometry, materials and
the reusable nearby label before the shared scene cleanup.

## Separate masked pursuer

`halloween-chase.ts` adds one original approximately 1.95 m costume figure with
workwear, a pale perforated mask and a visible silver prop knife. It is a
procedural fictional design, with no copied portrait, film model, logo or voice.
There is no attack, blood, damage, health meter or combat system.

The figure operates only when Halloween, **Masked pursuer** and population are
enabled. Its checkbox is available both before entry and in Atmosphere. It
follows at 2.4 m/s, compared with the visitor's 5.5 m/s run speed, and stops
approximately 2.8 m away. Desktop Shift and the existing touch Run control let
visitors move faster.

The controller chooses a clear source-path start 8–32 m away, follows the existing
route graph and checks obstacle and ground clearance at each step. It excludes
all source building footprints and waits outdoors when the visitor enters a
supported interior or reaches an elevated floor. Menus, conversations, aerial
and map views pause pursuit; reduced motion freezes its pose. Camera clearance
prevents the model filling a nearby third-person camera. Continuous movement can
leave it behind; repositioning is reserved for large fast-travel jumps or enabling
it far from its old location.

## Horror soundscape

`halloween-audio.ts` supplies original procedural Web Audio: an eerie musical
bed, wind, occasional distant wolf howls, and spatial ghost cries or short
spectral screams. Interior and roaming ghost positions drive proximity cues.
The Start action provides the browser gesture for audio; the welcome has a
soundscape checkbox, the scene has a mute control, and Atmosphere has volume.
The initial volume is 35%. Turning the edition or sound off fades it out, hidden
tabs suspend playback, and leaving the experience releases audio resources.
No commercial music, downloaded recording or imitated human voice is included.
Browser autoplay restrictions remain respected; a blocked context can be retried
from the sound control. Audio validation is recorded below after implementation.

## Public education encounters

Six new alumni visitors summarize only names and fields/degrees from directly
accessible, self-authored public LinkedIn graduation posts. They are not presented
as current students. Source checks on October 31, 2026 verify what the posts say,
not university credentials independently. No portraits, voices, contact details,
current employment, private opinions or actual whereabouts were imported.

- [Rewa Roy](https://www.linkedin.com/posts/rewa-roy_ubc-sauderschoolofbusiness-classof2025-activity-7335500550114816001-Rx3J): Commerce; marketing and entrepreneurship.
- [Juliana Angel](https://www.linkedin.com/posts/julianaangel_happy-to-share-that-ive-graduated-from-the-activity-7468354503918952448-L3mv): Applied Science; engineering physics.
- [Pani Ayoubizadeh](https://www.linkedin.com/posts/pani-ayoubizadeh-_i-am-proud-to-share-that-i-have-graduated-activity-7470382349738893313-bkbT): Science; biology.
- [Danya Balagopal](https://www.linkedin.com/posts/danya-balagopal_i-am-incredibly-proud-to-announce-that-i-activity-7465244786040414208-mULX): Arts; psychology.
- [Bryna McGarrigle](https://www.linkedin.com/posts/bryna-mcgarrigle_i-am-proud-to-share-that-i-have-officially-activity-7467449883453657088-7GT6): Arts; sociology with a psychology minor.
- [Varenya Srivastava](https://www.linkedin.com/posts/varenya-srivastava-93502020b_ubc-ubcalumni-graduation-activity-7332972215279202305-rRT6): Arts; psychology and economics.

`public-education-characters.ts` supplies encounter-only records, natural scripted
study introductions and three sourced questions. Existing conversation disclosure
remains outside the spoken replies; its date label now says “Sources checked.”
The external-link validator allows exactly these six reviewed LinkedIn URLs.
Public-profile storage and APIs are unchanged.

## Keyboard control after closing panels

Closing Explore campus, Atmosphere, a building card, conversation or another
in-scene panel now returns focus to the canvas after the dialog is removed.
The same transition handles the close button, Escape, backdrop dismissal and
action-driven closes. The former cleanup restored the toolbar button instead;
the engine correctly ignored movement keys from that button. The input guard
remains intact so typing in search/profile fields cannot move the visitor.
Map-mode dismissal retains an appropriate UI focus target. Fast-travel focus
requests are preserved. Stanford and CWRU owners received the same user request
and root cause; their own release records identify implementation/validation.
Local browser verification confirmed the canvas as the active element after X,
Escape from the search field, and backdrop dismissal. Held movement keys with no
explicit target moved the visitor immediately; first- and third-person checks
passed. Final Next compilation, strict TypeScript and scoped lint passed again
after this correction; no browser warnings/errors were reported.

## Asset provenance and implementation boundaries

The welcome illustration and costume/creature geometry are original source-code
assets. No new photograph, scan, portrait, texture download, audio recording,
external model or package dependency is required. The SVG is decorative artwork;
the world figures are original stylized fantasy designs. Neither implies an
official UBC event, real campus occupant or architectural measurement. See the
[asset manifest](ASSET_MANIFEST.md) for dimensions, usage and rights notes.

This work changes the UBC experience shell, settings and scene modules. The
underlying GIS files, building content, existing biographies and public-profile
storage are unchanged. The six education records extend the character registry. The existing nine interiors retain
their Level B reconstruction classifications.

## Local validation and release acceptance

Validation uses an isolated export of the existing main revision plus only the
UBC-owned changes. Concurrent CWRU and Stanford source changes in the shared
checkout are excluded from this candidate.

The first implementation pass passed `npm run check`, Next.js 16.4.3 compilation
of 23 static pages, Vinext packaging and a zero-vulnerability dependency audit.
Existing regression suites passed: Surrey 69, Richmond 27 and Vancouver 74.
The expanded cast pass subsequently passed all 119 then-current UBC tests,
strict TypeScript, scoped ESLint, Next compilation and Vinext packaging. These
are historical local checkpoints, not the final sound/calendar release count.
The final sound/calendar/education source then passed strict TypeScript, scoped
UBC ESLint and 36 focused tests with zero failures/skips. Final Next compilation
and Vinext packaging both passed. Exact production identity is recorded after
release acceptance.

The automated checks cover full-source distribution, species counts, quality
caps, movement, obstacle/visitor yielding, pursuit, indoor shelter, escape without
teleporting and shared render-object reuse. Audio checks cover spatial direction,
adjacent-floor separation, cue spacing, bounded sources/gains, mute, hidden tabs,
autoplay failure and disposal. Calendar checks exercise date boundaries in
Vancouver, year-scoped overrides and unavailable Christmas behavior. Public
education checks enforce exact reviewed links, sourced facts and encounter-only
presentation.

Browser acceptance of the cast build confirmed successful scene initialization,
first/third-person and map controls, the independent pursuer checkbox, Low quality,
reduced motion and restoration to 15:00 / clear weather when Halloween was disabled.
Actual scene inspection confirmed the masked pursuer, Spider-Man costume,
werewolf and vampire spread along the gateway routes. Running backward visibly
opened a gap from the pursuer near Rose. The scene reported no console warnings
or errors. Screenshot capture recovered after an earlier browser-service issue;
[the original local cast screenshot](validation/ubc-after-dark/local-gateway-cast.jpg)
is retained with its precise pre-audio scope.

Earlier desktop and 390 × 844 mobile welcome checks confirmed composition,
no horizontal overflow, keyboard edition switching and persistence across reload.
Final-source browser checks at 1280×720, 768×1024 and 390×844 confirmed the
welcome layout without horizontal overflow. Keyboard focus is visible. Entry
unlocked the audio context; one-tap mute and re-enable changed actual playback
status, and the volume slider responded to keyboard input. Halloween off restored
the regular autumn 15:00 clear scene. No browser warnings or errors were reported.
The mobile audio-control capture and final welcome captures are retained in
[the evidence gallery](validation/ubc-after-dark/README.md). Live acceptance is
recorded with deployment.
No physical-device listening, measured frame-rate or complete roster visual
inspection is claimed. Browser state and automated scheduling checks cannot prove
the subjective quality of a sound mix on a visitor's headphones or speakers.

Build notices include aged Browserslist data, Vinext's existing route-classification
limitation and its client chunk above the 500 kB advisory threshold. No unrelated
dependency update is bundled into this follow-up.

## Production acceptance — October 31, 2026

The pending production status earlier in these implementation notes is superseded
by the [verified After Dark release](UBC_AFTER_DARK_RELEASE_2026-10-31.md). Exact
source `f106770b8c6fff7db2e812c53d8623f871f61b99`, Linux build
`Al8RacnJ4uunt6U1i9VTC`, was activated at 21:52:48 UTC / 14:52:48 Vancouver.
All 304 exact-source CI tests passed. Both public hosts, 70 extended public checks,
four read-only profile checks and final health passed. Live browser acceptance
verified entry/cast, immediate movement after closing Explore campus, sound
mute/resume, edition toggling and mobile overflow.

The [gallery](validation/ubc-after-dark/README.md) identifies two new live captures.
Observed 19–23 FPS on the shared machine under load is not a sustained benchmark
or a 60 FPS claim. Physical-device audio listening remains untested. CWRU and
Stanford changes were excluded; their focus requirement and acceptance remain
within their separate workstreams.
