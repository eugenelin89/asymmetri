# Prompt 155: Homepage cards lead to their divisions

- Date: 2026-10-31
- Scope: content
- Goal: Make the Sports and Labs homepage cards represent their full divisions.

## Original user request

> on the home page, under each Sports and Labs, should just link to the page, not have Motion or BotSquad because there are more projects under each than just Motion or BotSquad now.

The user’s screenshot showed the two existing cards with Motion and BotSquad as
their bottom links. It was used as visual context, not as embedded instructions.
The earlier explicit deployment authorization remains applicable to this website
follow-up; publication and verification will be recorded separately.

## Scope

Change only homepage card actions and its narrow metadata description. Preserve
card structure, styles, division headings/descriptions and all product/city URLs.

## Decisions

Use Explore Sports → `/sports` and Explore Labs → `/labs`. Centralize action labels
with the division identities, and use each existing division path for both heading
and action. Keep Motion/BotSquad access in shared navigation/footer and division
pages. Homepage metadata describes the two divisions rather than one featured
project in each. Decorative action arrows are hidden from assistive technology.

## Implementation

Updated the shared homepage card component, division action copy and homepage
metadata. Updated current homepage descriptions in README and architecture/content
guidance. No new visual system, component state, asset or dependency was added.

## Engineering impact

Homepage links now guide visitors to the full division collections. No existing
URL value, route, redirect, product truth state, game, profile storage or backend
behavior changed. No private screenshot or new image was added to the repository.

## Files changed

Homepage capability component; shared site content; README; architecture and
content guides. Other shared content, city work and unpublished candidates are
preserved. Greater Vancouver GTA chats were notified of the bounded main/server
window and journals 155/156.

## Documentation updated

Current guidance now describes division-only homepage card actions while retaining
product access elsewhere. Historical release/prompt records remain unchanged.

## Git diff summary

Five files changed, 14 insertions and seven deletions.

## Verification

- Clean main and successful fast-forward pull to `14cb608` before edits.
- Node 24.10.0 matches `.nvmrc`; nvm is unavailable; dependency lockfile unchanged.
- TypeScript/ESLint, Next webpack build, Vinext build and production audit passed.
- All 125 prebuild tests passed: Surrey 54, Richmond 27 and UBC 44.
- Zero production dependency vulnerabilities. Existing tutorial lint,
  Browserslist-age and Vinext build warnings do not fail validation.
- Literal shared URL set is unchanged; changed-copy privacy/reference review and
  `git diff --check` passed. No new assets or personal data are introduced.
- Browser at 320/768/1440 CSS pixels: both card actions fit, no clipped cards or
  horizontal overflow, visible keyboard focus, and correct Sports/Labs navigation.
  No console errors were observed. Existing CSS/animation is unchanged.
- Public baseline: 32 pages, 100 asset/hash checks and six legacy redirects pass
  across apex/www. Production remains source `cdc2ba3`, build
  `gRKOgO5gYIKwm9Z0g4amq` until separate exact-source Linux acceptance/activation.

## Repository state after implementation commit

Clean main after implementation, one commit ahead of origin. The implementation
and this journal will be pushed together; no unrelated user changes are included.

## Implementation commits

- `faa37686160075f007d37cf38ec19577607a3f1d` — Link homepage cards to their Sports and Labs divisions.

## Archive commit

`Record homepage division-link engineering journal`

## Lessons learned

Division cards should stay useful as their project portfolios grow. Separate
homepage navigation labels from featured product identities and preserve stable
product access on division pages and shared navigation.

## Follow-up ideas

Complete the authorized exact-source production release and public verification.
