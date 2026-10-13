# Prompt 079: BotSquad hierarchy and navigation

- Date: 2026-10-13
- Scope: design
- Goal: Make the Labs → BotSquad → Research → Investment hierarchy clear and easy to navigate, with Ask beside Research.

## Original user request

> I would like to organize Asymmetri Labs this way. Asymmetri Labs has a project called BotSquad. Under the BotSquad unbrella, there is BotSquad research and some other things I have not thought of yet. BotSquad Investment is one of the projects under the unbrela of BotSquad Research. Make sure the pages are organized to reflect this, and can easily navigate around.

> where does Ask BotSquad fall under?

> looks good. Make sure its easily navigateable as well

> any changes just directly commit and deploy to prod. so far no one is looking at the site anyways so we can take adventage of this window to expidite the process

The owner accepted Ask directly under BotSquad, alongside Research. The previous
money-neutral investment introduction request is recorded separately in prompt 078.

## Scope

Public page organization, navigation, a Research hub and supporting documentation.
Existing routes and signed API paths remain stable. No undefined future areas,
visitor activation, new model authority or investment data changes are included.
The owner explicitly authorized production deployment after verification.

## Decisions

Use a shared server-rendered breadcrumb and area navigation. Keep the logical
hierarchy visible while preserving published Investment and Ask URLs. Make the
Labs project's primary action lead to the BotSquad overview. Place Research and
Ask near the top of that overview, with Investment nested under Research.

## Implementation

Added the Research page and centralized its copy and navigation paths. Integrated
shared navigation into the overview, Research, Investment, evidence pages and Ask.
Expanded the global Labs menu and the sitemap. Reused existing design tokens and
social imagery. Current areas have an underline, and links wrap on small screens.

## Engineering impact

No dependency, state, authentication or deployment architecture changes. Research
is indexable; Investment and Ask retain their existing noindex policy. Breadcrumbs
use static evidence-page labels to avoid exposing withdrawn record titles. The
approved privacy registry remains empty and Ask remains closed.

## Files changed

Page composition and sitemap; shared BotSquad navigation; investment page shells;
central content and CSS; repository guidance and documentation. Eighteen files.

## Documentation updated

README, AGENTS, architecture, content guide, testing, visual identity and asset
manifest describe the hierarchy and navigation. The dated hierarchy decision
records scope, stable URLs, authorization and source verification.

## Git diff summary

18 files changed, 285 insertions, 21 deletions. Most additions are the new Research
hub, shared navigation, centralized copy and documentation.

## Verification

TypeScript/ESLint, standard Next.js and Vinext builds passed. Fifteen Ask UI tests
and six investment tests passed. Existing dependency audits report zero production
vulnerabilities; dependencies did not change. The existing tutorial lint warning
remains. Browser checks at 320, 390, 768, 1024, 1440 and 1920 pixels found no
horizontal overflow. Labs menu keyboard opening, link access, Escape focus return,
44-pixel targets, current underline, breadcrumbs and area links passed. No browser
errors or missing alt attributes appeared. Eleven local routes, 35 image sources
and all ten sitemap destinations passed. Protected Motion pages and the exact
tutorial canonical passed. New copy was reviewed for private and unsupported
claims. A read-only source review found no blocking issue; its underline finding
was corrected before final validation. Production verification is a separate receipt.

## Repository state after implementation commit

Main at fd69a0c8dc7342a16900f4b71b7d762fc9f12a81; intended implementation committed, no unrelated changes included.
The two source commits will be pushed together before candidate deployment.

## Implementation commits

- fd69a0c8dc7342a16900f4b71b7d762fc9f12a81 — Organize BotSquad research and shared navigation.

## Archive commit

Record BotSquad hierarchy and navigation journal

## Lessons learned

Logical ownership does not require breaking established URLs. Ancestor breadcrumbs
and a small shared area menu support both hierarchy and quick cross-area movement.

## Follow-up ideas

Add other BotSquad areas only when the owner defines their purpose and evidence.
