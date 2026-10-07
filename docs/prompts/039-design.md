# Prompt 039: Promote Graphite + Teal to production

- Date: 2026-10-07
- Scope: design
- Goal: Promote the selected Theme B visual identity and deploy the verified main revision while preserving the website's content, assets and product continuity.

## Original user request

> Use **Theme B — Graphite + Teal** from the completed local theme exploration as the selected production visual identity for Asymmetri.co.
>
> Source exploration branch:
>
> `design/dark-theme-exploration-20261007`
>
> Current exploration HEAD:
>
> `cc5998fc49fe0071c2d3c44a8ba462dba58a4c87`
>
> Existing known-good production baseline tag:
>
> `website-visual-identity-update-2026-10-07`
>
> Do not move or overwrite that tag.
>
> ## Goal
>
> Promote Theme B into the production website while preserving the current company architecture, content, routes, Motion identity, BotSquad content, privacy behavior, and existing assets.
>
> Theme B is:
>
> - dark graphite base;
> - light neutral content surfaces where appropriate;
> - teal as the primary Asymmetri accent;
> - Sports and Labs use the same umbrella visual system rather than separate corporate colors;
> - Motion keeps its existing product-specific teal identity and genuine screenshots/assets unchanged.
>
> Key Theme B palette from the exploration:
> ```less
> Main background       #0C1111
> Raised dark surface   #141B1A
> Soft dark surface     #1A2321
>
> Primary light text    #F3F6F4
> Secondary text        #A5B2AE
> Dark borders          #293633
>
> Light surface         #F5F7F5
> Dark text             #101514
>
> Primary teal          #00A99D
> Bright teal           #29C7B9
> Deep teal             #00766F
> Soft teal             #DDF4F0
> ```
>
> Use teal primarily as an accent. Do not overuse pale teal surfaces or drift into a healthcare/institutional appearance.
>
> ## Important
>
> Do not simply merge the entire experimental branch blindly.
>
> Inspect the exploration diff and bring across only the production-relevant Theme B implementation.
>
> Remove or exclude all local-only exploration machinery, including:
>
> - theme selectors;
> - query-based theme switching;
> - comparison pages;
> - review-only routes/tools;
> - experimental screenshot galleries;
> - anything intended only for A/B/C comparison.
>
> Keep the exploration branch and its commits intact as historical design evidence.
>
> ## Before changing main
>
> Verify:
>
> - current `main`;
> - origin/main;
> - production HEAD;
> - worktree state;
> - existing rollback tag;
> - no concurrent/unrelated work will be overwritten.
>
> The existing rollback tag must continue to point to the previous known-good production version.
>
> ## Implementation
>
> Promote Theme B cleanly into the normal production CSS/design-token system.
>
> Update production-facing documentation such as `docs/VISUAL_IDENTITY.md` so Theme B becomes the current visual authority.
>
> Do not rewrite historical exploration records.
>
> Preserve:
>
> - Asymmetri → Sports / Labs architecture;
> - `/sports`;
> - `/labs`;
> - `/motion`;
> - `/botsquad`;
> - `/about`;
> - `/tutorial`;
> - `/privacy`;
> - `/support`;
> - legacy redirects;
> - Motion App Store continuity;
> - current copy and product truth.
>
> ## Validation
>
> Run the normal production checks:
> ```arduino
> npm ci
> npm run check
> npm run build:next
> npm run build
> npm audit --omit=dev
> git diff --check
> ```
>
> Then visually inspect at minimum:
>
> - `/`
> - `/sports`
> - `/labs`
> - `/motion`
> - `/botsquad`
> - `/about`
> - `/tutorial`
> - `/privacy`
> - `/support`
>
> Check desktop, tablet and mobile.
>
> Verify:
>
> - no overflow;
> - no contrast regressions;
> - keyboard/focus states;
> - navigation;
> - images;
> - videos;
> - dark/light section transitions;
> - Motion screenshots remain unchanged;
> - no experimental theme selector remains.
>
> ## Git
>
> Commit the production Theme B implementation cleanly to `main`.
>
> Push `main`.
>
> Do not force push.
>
> Report the exact production commit SHA.
>
> ## Deploy
>
> Follow the existing documented deployment process in:
>
> - `docs/CLI_ACCESS.md`
> - `docs/DEPLOYMENT.md`
>
> Use routine deployment access.
>
> Do not touch unrelated sites.
>
> Build successfully before restarting the Asymmetri service.
>
> ## Production verification
>
> Verify:
>
> - production HEAD matches pushed `main`;
> - `asymmetri.service` active;
> - loopback healthy;
> - public HTTPS healthy;
> - all major routes load correctly;
> - protected Motion URLs remain intact;
> - legacy redirects work;
> - no new service/browser errors.
>
> ## Post-deployment tag
>
> Once production is verified healthy, create a new annotated immutable tag such as:
>
> `website-dark-teal-theme-2026-10-07`
>
> If that tag already exists, use a unique suffix rather than overwriting it.
>
> Suggested annotation:
>
> `Verified Asymmetri.co production release using the selected Graphite + Teal visual identity.`
>
> Push the tag to origin.
>
> Do not move the old rollback tag.
>
> ## ETA updates
>
> At the beginning provide an ETA and current phase.
>
> Then provide progress/updated ETA approximately every **15 minutes** until completion.
>
> ## Final report
>
> Report:
>
> - previous rollback tag + SHA;
> - Theme B implementation commit;
> - final `main` SHA;
> - deployed production SHA;
> - new production tag;
> - validation results;
> - production health;
> - any remaining issues.
>
> Proceed autonomously through implementation, validation, deployment and verification.

## Scope

CSS, browser theme-color metadata and current documentation only. No merge of the
exploration branch; no changes to routes, component markup, copy, product truth,
public asset bytes, dependencies, configurations or client privacy behavior.

## Decisions

- Confirmed local main, origin/main and healthy production at
  `c35ed81cd71bcfa0a96fd510e74046cff1a92386`; verified clean main and exploration
  worktrees, successful fast-forward pull, and the old tag's local/remote target.
- Promoted selected styles into normal semantic tokens and existing component
  rules. No review runtime, selector, query switch, screenshot gallery or
  experimental route is present in the production source.
- Sports and Labs share graphite/teal. Light reading contexts provide neutral
  surfaces and deeper accessible teal for links/actions. Pale teal remains limited
  to existing Motion areas. Motion's independent tokens prevent accidental future
  umbrella changes from recoloring its identity.
- Preserved all 53 tracked public assets. Existing social exports/favicons retain
  the preceding palette by the explicit asset-preservation requirement; the
  current visual authority clearly distinguishes these from CSS tokens.
- Kept historical exploration journals and commits intact. Journal IDs 036–038
  exist on that branch, so this production request uses 039.
- Deployment uses the existing application-owner helper through routine SSH,
  independently copied dependencies, an isolated checked/built candidate, and a
  complete rollback snapshot before stopping only the Asymmetri service.

## Implementation

Graphite default surfaces, shared teal accents, neutral reading sections and
surface-aware text/actions/focus now reproduce the selected exploration. Browser
chrome uses graphite. Documentation names Graphite + Teal as current authority.

## Engineering impact

No new dependencies, JavaScript, persistence, tracking, backend or external asset
loading. Layout, mark geometry, media behavior, company hierarchy and product truth
remain unchanged. Existing reduced-motion CSS is retained and strengthened to
remove transitions/animation. The selected accessible light-context teal is deeper
than the primary accent, preserving text/button contrast.

## Files changed

- Global CSS and the one browser-theme-color metadata value.
- README and visual, architecture, brand, site strategy and content guides.
- Asset manifest, testing guidance and release documentation.

## Documentation updated

Current documents now agree on the shared palette, independent Motion tokens,
retained static artwork and immutable release markers. Historical prompt records
and dated source decisions were not rewritten.

## Git diff summary

Implementation: 11 files changed, 323 insertions, 265 deletions. Most changes are
palette/context rules and replacing obsolete current palette descriptions.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm unavailable locally.
- `npm ci`, `npm run check`, `npm run build:next`, `npm run build`,
  `npm audit --omit=dev` and `git diff --check` passed. Audit: zero vulnerabilities.
- Existing tutorial navigation lint warning and stale Browserslist data advisory
  remain; no dependency changes were made to address unrelated warnings.
- A sandbox worker-port failure was cached by Turbopack. Preserving the failed
  build directory and rebuilding with permitted worker access resolved it.
- All nine routes at actual 1440, 768 and 320px: 27 audits passed for document
  overflow, clipped descendants, rendered text contrast, image alt text and loaded
  image health. Lowest measured text ratio was 5.28:1. Browser logs were empty
  before optional third-party playback. Desktop/tablet/mobile screenshots reviewed.
- Compared text/background/top-border/fill computed colors for every header,
  main-content and footer element on all nine routes against the selected Theme B
  reference: identical values and element counts.
- Keyboard Sports/Labs menus, Escape, native links, 3px focus and 48px menu links
  verified on mobile. Complete tutorial view passed the same audit. Deferred
  Motion concept images loaded when scrolled into view.
- Both approved video IDs loaded only on explicit activation; close removed the
  iframe and restored focus. Existing privacy disclosures and external links remain.
- Public content differs only in theme-color metadata; assets, components, route
  sources, tutorial IDs/original URLs, package files and configuration are unchanged.
  Public-source obsolete-brand, credential-pattern and exploration-machinery scans
  returned zero matches.
- Pre-deployment apex/www checks: all nine routes HTTP 200 and all six legacy
  redirects correct (30 checks). Tutorial canonical remains exact www.
- Server baseline is active and loopback healthy with no new application errors.
  Final production activation/verification and tag creation occur after this
  journal commit is pushed; exact results belong in the external release receipt
  and final response, avoiding a self-referential deployment commit.

## Repository state after implementation commit

Main at `7dac60dcbfcf935223a1f135b8104a13dc3e75e6`, clean before this journal.
Origin still at the verified baseline until implementation and journal are pushed.
The exploration branch remains at its original `cc5998f` tip.

## Implementation commits

- `7dac60dcbfcf935223a1f135b8104a13dc3e75e6` — Adopt selected Graphite and Teal production identity.

## Archive commit

`Record selected Theme B production promotion journal`

## Lessons learned

Compare computed styles as well as screenshots when integrating an experimental
cascade into production tokens. Preserve product-specific palette independence
and keep immutable source markers alongside a complete runtime rollback copy.

## Follow-up ideas

None required for this release. Any future social-export recoloring is separate
asset work and must retain provenance and explicit scope.
