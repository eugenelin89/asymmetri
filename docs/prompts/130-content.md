# Prompt 130: GIS city display names

- Date: 2026-10-30
- Scope: content
- Goal: Apply the owner’s revised Vancouver and Surrey display names while preserving every existing URL.

## Original user request

> instead calling it "Vancouver in Progress", call it "Vancouver, City in Progress"

> "Surrey Adventure" to "Surrey, City of Adventure"

The existing request to deploy and verify the city links remains in scope. The
preceding GIS Apps release is already live; these are follow-up naming corrections.

## Scope

Update city display copy, metadata, accessibility labels and current guidance.
Preserve routes, assets, data snapshots, source links, saves and game behavior.

## Decisions

Use the shared city identity fields for GIS cards, descriptions and model-limit
headings. Surrey’s full name also supplies its page title, footer and game labels.
Keep short actions readable: Play Surrey and View Surrey source. Vancouver’s
existing short project name remains Vancouver; its GIS display label changes.
Historical prompt and release records retain their original wording.

## Implementation

Centralized the revised names and removed duplicate Surrey strings from game
accessibility labels. Documented the exact-source Linux build option for the
existing copy-only deployment procedure, with unchanged dependency/configuration,
route and asset gates, resource floors, private smoke checks and prior-build recovery.

## Engineering impact

No dependency, route, public asset, save-key or simulation changes. Screen-reader
names and Surrey metadata now match the requested display name. No private data,
tracking or product capability claims were introduced.

## Files changed

Shared site content and two Surrey accessibility consumers; README, current
content/architecture/development/testing guidance and Surrey project notices;
deployment guidance for the existing copy-only release path.

## Documentation updated

Current guidance reflects the requested names and explains shared identity fields.
The deployment addition records the reviewed isolated Linux build variation.

## Git diff summary

11 files changed, 45 insertions and 26 deletions. Copy and documentation only.

## Verification

- Node 24.10.0 satisfies `.nvmrc`; nvm is unavailable locally.
- `npm run check`, standard Next webpack build and Vinext build passed.
- All 29 Surrey tests passed through the standard build prerequisite.
- Production dependency audit: zero vulnerabilities; `git diff --check` passed.
- All 85 literal URL values in shared content are unchanged. No old display labels
  remain in active shared copy; changed-copy privacy/credential review passed.
- Browser checks at 320, 768 and 1440 CSS pixels: both GIS headings and Surrey H1
  fit without horizontal overflow. GIS-to-Surrey navigation resolves, new accessible
  game label is present, Labs keyboard focus is visible and no console errors appear.
- Pre-release public baseline: 16 routes, 68 tutorial/city asset checks and four
  legacy redirects pass. Production activation and post-release results will be
  recorded separately after successful Linux candidate acceptance.
- Existing tutorial lint warning and Vinext chunk/classification warnings remain;
  none prevents a successful check or build.

## Repository state after implementation commit

Clean main after implementation, ahead of origin by one commit. No unrelated work
included. Both implementation and this journal will be pushed together.

## Implementation commits

- `759cbf314679d4ed2895d75f9eae176222b77561` — Update GIS city display names without changing URLs

## Archive commit

`Record GIS city naming engineering journal`

## Lessons learned

Display names can change independently of stable public paths and saved-game keys.
Centralize reused names to keep metadata and accessibility copy consistent.

## Follow-up ideas

None beyond completing the already-authorized production release and verification.
