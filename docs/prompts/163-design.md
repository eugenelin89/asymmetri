# Prompt 163: Natural dialogue for every UBC character

- Date: 2026-10-31
- Scope: design
- Goal: Make character introductions and interactions sound conversational while keeping source notes available separately.

## Original user request

> For answering “who are you” the reply should be more natural. For example, it should just be “I am Mitch Hodge, I am a coach at UBC Baseball”. No need to say virtual character or not confirmation of current assignment etc.

> For all the characters the interactions need to be more natural .

The supplied phone screenshots showed long audit/model explanations inside Mitch's
spoken answer. They informed the fix but were not copied into the repository.
The earlier explicit instruction to deploy after completion remains in effect.

## Scope

Dialogue and presentation across the existing character registry, including public
profile presentation. No new people, geography, geometry, movement system,
dependencies, profile fields or stored participant data.

## Decisions

- Introductions are explicit spoken text, not concatenated titles and biographies.
- Natural first-person dialogue remains scripted, not an authentic quotation or
  live response. Full biography, permissions, behavior notes, sources and dates
  move into optional About this simulation. Speaker labels use names.
- Preserve source roster years and historical accomplishments without turning
  historical athletes into current team members. Preserve participant-written
  answers verbatim and avoid inferring a university appointment from an interest.
- Typed greetings and bounded identity phrases share the button actions, including
  polite wrappers and the selectable Einstein identity topic. Unsupported compound
  questions retain the honest fallback.
- Respect Surrey's active shared release window. Finish locally, receive the
  verified handoff, then refresh main before committing and publishing.

## Implementation

All 976 static records have natural introductions and revised routine answers.
Mitch says “I’m Mitch Hodge. I’m a coach with UBC Baseball.” Faculty/staff, athletes,
alumni, historical guests, university leaders and fictional students receive the
same separation of speech and provenance. Hello, waves, thanks and goodbye have
direct replies; returning visitors receive an appropriate greeting. Public
profiles derive a short name/role introduction without rewriting submitted topics.

## Engineering impact

Added required `Character.introduction`; updated registry constructors and profile
presentation. The pure reducer recognizes complete social phrases and normalizes
identity topics. The existing panel/focus/gesture/history system remains. No new
AI service, backend schema, data snapshot or asset dependency.

## Files changed

Character types, registry/content constructors, conversation reducer/panel and
regression tests; UBC project and architecture/content/testing documentation;
dedicated report and two actual compiled-preview screenshots with attribution.

## Documentation updated

`UBC_NATURAL_DIALOGUE_2026-10-31.md`, project README, architecture, content guide,
testing guide, asset manifest and the natural-dialogue evidence gallery.

## Git diff summary

18 files changed, 388 insertions and 105 deletions, plus two JPEG screenshots.
Changes are scoped to UBC dialogue and its supporting documentation/evidence.

## Verification

- UBC 56, Vancouver 74, Surrey 68 and Richmond 27 local tests passed (225 total)
  against `f6fb80a` plus this change. TypeScript/ESLint, Vinext and Next webpack
  builds passed; zero production dependency audit findings. One pre-existing
  unrelated tutorial-navigation lint warning remains.
- Compiled preview build `lZ3MPUIolgdW6iU5_LrEC`: ordinary travel/walking to Rose,
  short introduction, polite typed identity, facility answer, follow-ups, honest
  uncertainty, optional source/model notes, thanks/goodbye and history passed.
- Desktop 1280×720, phone 390×844 and tablet 768×1024 checks showed no horizontal
  overflow. Keyboard focus stayed in the dialog; source links retained safe new-tab
  attributes. Compiled preview console had no warnings/errors. Screenshots are
  actual JPEG bytes, dimensions verified, with no retouching or private data.
- Content review corrected profile affiliation inference, duplicate identity-topic
  discovery and polite identity phrases. All static follow-ups resolve; routine
  answers no longer contain the identified audit boilerplate.
- Reopened official Mitch and Werker sources; official presidential information
  confirmed through available indexed UBC pages when a direct fetch challenged.
- Refreshed completed Surrey main `bba7a13` without conflicts. Its changes are
  isolated Surrey guidance/tests and docs; UBC source was unchanged. Exact Linux
  release checks follow separately; local completion is not deployment.

## Repository state after implementation commit

Main at `d7066ac`, clean before this journal, one implementation commit ahead of
origin `bba7a13`. Surrey handed main/server ownership to UBC. Push implementation
and this journal together; journal 164 is reserved for the final release receipt.

## Implementation commits

- `d7066ac` — Make UBC character introductions and conversations natural.

## Archive commit

Record natural UBC dialogue engineering journal

## Lessons learned

Source rigor belongs in the information layer; dialogue needs independently
authored spoken copy. Typed and selectable introductions must share discovery
state. A public-profile interest field must not become an inferred appointment.

## Follow-up ideas

Broader grounded conversational topics and physical-device usability checks remain
separate future work; no unverified claims or live AI dependency was added.
