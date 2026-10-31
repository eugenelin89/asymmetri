# UBC natural character dialogue

The visitor reported that introductions sounded like biography and verification
reports, then requested more natural interactions for every character. This
change separates spoken dialogue from source and reconstruction metadata.

## Behavior

All 976 existing static character records have a short `introduction`, including
260 faculty/staff records, 705 season-labelled athletes, four alumni, Einstein,
Mitch Hodge, Greg Werker, Benoit-Antoine Bacon and three fictional residence guides.
This count describes the current registry, not complete coverage of UBC personnel.
Participant profiles also receive a concise introduction from their submitted
name and affiliation category. Their authored answers remain unchanged; an optional
interest area does not become an asserted department or university appointment.

Mitch introduces himself with: “I’m Mitch Hodge. I’m a coach with UBC Baseball.”
Faculty and alumni explain their public roles and work conversationally. Athletes
retain their roster year in speech, so historical rosters do not imply current
team membership. Maya, Leo and Ari use short names; their fictional classification
remains in the optional information panel.

Hello, waves, thanks, repeated greetings and goodbye now have direct spoken
responses, with gestures shown separately. Typed social phrases—including “Hi,
who are you?” and “Who are you, please?”—use the same actions as the buttons.
Recognition is limited to complete phrases; a compound question about private
opinions still goes through the unsupported-question path. The duplicate Einstein
identity topic also reveals the encounter identity consistently.

Routine answers no longer include verification reports, model-height notes,
endorsement disclaimers or construction details about the software. A concise
“Scripted conversation” label remains outside speech. Full biography, permissions,
walking-behavior notes, source links and verification dates are available in
“About this simulation”; answer sources remain optional. There is no live AI,
voice imitation, real-person participation or fabricated personal opinion.
The greeting and first-person factual paraphrases are authored dialogue, not quotes.

## Content and source review

The official [Mitch Hodge profile](https://gothunderbirds.ca/sports/baseball/roster/coaches/mitch-hodge/4204)
was reopened October 31 and lists Assistant Coach. His detailed attribution and
model permissions remain in metadata. [Greg Werker’s faculty profile](https://www.sauder.ubc.ca/people/greg-werker)
and [professional biography](https://www.advancinghealth.ubc.ca/team-member/greg-werker/)
support his role, teaching and research summaries. The [UBC president’s biography](https://president.ubc.ca/about-the-president/)
and official indexed president pages support Bacon’s role. A direct biography
fetch encountered UBC browser verification; official indexed content was available.
The remaining facts reuse the already recorded source snapshots without refreshing
or modifying public GIS, faculty, athlete or profile data.

## Validation and release

The UBC suite passes 56 tests, including every static introduction, typed/button
identity parity, restrained unsupported answers and unchanged participant text.
Existing source, season, follow-up, movement, interior, community and navigation
checks remain in place. A review caught and corrected an overly specific generated
community affiliation and identity-topic discovery inconsistency.

Local browser checks verified Mitch’s button/typed introductions, facility answer,
follow-up choices, brief uncertainty, thanks, goodbye and optional metadata.
Phone (390×844), tablet (768×1024) and desktop (1280×720) viewports had no horizontal
overflow. Keyboard focus stayed inside the conversation, safe source links retained
new-tab security attributes, and the compiled preview logged no warnings/errors.
[Actual compiled-preview screenshots](validation/ubc-natural-dialogue/README.md)
show the new introduction. No physical-device or sustained performance test is claimed.

On Node 24.10.0, TypeScript/ESLint, Vinext and Next webpack builds passed; the
production dependency audit found zero vulnerabilities. The existing unrelated
tutorial-navigation lint warning remains. Local regression suites passed UBC 56,
Vancouver 74, Surrey 68 and Richmond 27 (225 total) against main `f6fb80a` plus
this change. The compiled local build is `lZ3MPUIolgdW6iU5_LrEC`; later Surrey
integration and Linux release checks are recorded separately. No new architecture,
geography, population, asset dependency or profile-storage format is introduced.

The completed Surrey handoff was integrated from main `bba7a13` without conflicts;
its delta changes only Surrey guidance/tests and documentation, with no UBC or
shared runtime edits. Production publication is pending this change’s exact-source
Linux build and guarded acceptance. Source or local preview alone is not a deployment.
