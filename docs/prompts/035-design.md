# Prompt 035: Mineral, Sports and Labs visual identity

- Date: 2026-10-07
- Scope: design
- Goal: Differentiate Asymmetri.co through a coherent mineral/teal/slate identity and deploy a verified, recoverable release.

## Original user request

> ASYMMETRI.CO — VISUAL IDENTITY DIFFERENTIATION UPDATE
>
> Update and deploy the production Asymmetri.co website.
>
> This is primarily a visual identity refinement, not a company-architecture redesign.
>
> Implement, test, commit, push, deploy, verify and tag the release.

The large attached request requires autonomous repository and live-state review,
a permanent annotated tag at the exact healthy old production commit before edits,
design review for differentiation from asymmetry.co, implementation, responsive
and accessibility validation, required checks, commit/push, production deployment,
verification and a second immutable release tag. Use latest origin/main and preserve
unrelated work; never reset, force-push or move existing tags. Provide an initial ETA,
regular progress reports and a completion report with actual evidence and rollback.

Design direction: replace warm cream/orange with a cool mineral umbrella; strengthen
teal Sports/Motion and slate Labs/BotSquad as peer worlds in one shared system.
Use semantic tokens and a deliberate surface hierarchy, review controls/links/selection,
and strengthen the homepage division moment without wholesale redesign. Preserve
fonts, scale, spacing, genuine photos/screenshots/icons, diagrams, video components,
privacy-conscious loading, product truth and architecture. Do not imitate the comparison
site. Update relevant documentation/social previews and asset provenance. Check all
nine routes at narrow/larger mobile, tablet, desktop and wide desktop, including menus,
Motion family, diagrams, footer, contrast, focus, images and overflow. Preserve protected
Motion routes, exact tutorial canonical/hashes/originals and legacy redirects. Run npm ci,
check, both builds, production audit and diff check without audit fix. Deploy only through
approved routine SSH/application-owner access, stage/build before activation, verify
source/build/service/HTTP/logs/browser, retain recovery assets and tag only verified output.

## Scope

Company and division presentation, semantic CSS/Tailwind tokens, inline logo palette,
SVG favicon and three existing social previews; supporting documentation and journal.
No company/product restructuring, copy claims, dependencies, routes, visitor state,
external fonts, generated athlete imagery or product application changes.

## Decisions

- Verified clean local/live main at `699c7b22007174300d63673162515165139e43c7`, equal
  to fetched origin/main. No other active website chat or additional worktree.
- Before edits, verified active service and HTTP 200 for all nine canonical routes on
  loopback, apex and www. Running build ID `AyEDp9ZuN3pQsxvo2BvjC`.
- Created/pushed annotated `website-pre-visual-identity-update-2026-10-07`; remotely
  verified its peeled target is that exact old SHA. Never move/delete this marker.
- Preserve local system typography and page sequence. Equal labelled teal/slate
  division panels, fine branch rules and circle/square indexes express the hierarchy.
- Mineral `#EEF3F2`, near-white `#F8FAF9`, ink `#10201D`; umbrella teal `#007A70`,
  Sports `#006B64` / `#E4EFEC` / `#133B37`, Labs `#35465E` / `#E8EDF3` / `#202C3D`.
  Orange is retired from active styles/artwork; historical logo/icon fallback bytes stay.
- Sports retains real photography and Motion evidence. Labs uses connected semantic
  rows on near-white within slate fields, with a deep slate poster/review section.
- Motion media is byte-identical. CSS context changes only the surrounding presentation.
- Use only routine `ssh asymmetri`. Unchanged routes/dependencies permit staged build
  activation inside the existing application-owned live directory. Preserve a complete
  independent pre-activation snapshot including source, assets, dependencies and build.

## Implementation

Shared surface/ink/brand/division tokens replace warm literal colors and the second
Tailwind palette. Scoped theme values drive existing controls, diagrams and section
fields; global navigation retains umbrella branding. HomeCapability retains native
links and equal division ordering with direct Motion/BotSquad links. The inline mark
uses token-driven fill. Short division labels and browser theme color are centralized.
Existing vector social sources and SVG favicon are recolored; PNG exports use Sharp.

## Engineering impact

No new dependencies, client JavaScript, server state, tracking, routing or public
capability claims. Shared tokens improve palette maintenance. Rendered contrast
checks identified company teal on About's Sports field at 4.44:1; giving that section
Sports context raises it above AA. Dark sections receive bright-teal focus rings.
The established reduced-motion rule remains intact. Deployment leaves infrastructure,
Node 22, shared services and unrelated sites unchanged.

## Files changed

- Shared CSS, Tailwind configuration, route button classes and Sports theme scope.
- Homepage hierarchy, inline Logo and centralized division/browser-theme metadata.
- Current favicon and original company/Labs/Sports social SVG/PNG artwork.
- Onboarding, design/brand/site/content/architecture/asset/testing/deployment guidance.

## Documentation updated

README introduces the system; Visual Identity records exact tokens and contrast;
Brand/Site Strategy explain differentiation; Content/Architecture document scope
and ownership; Asset Manifest records source, dimensions, roles and preserved media;
Testing adds wide-desktop and contrast checks; Deployment documents staging and
complete snapshot recovery using the routine account without administrator access.
Historical journals retain their original decisions and colors.

## Git diff summary

Implementation: 27 files changed, 533 insertions and 222 deletions, plus three PNG
binary updates. Most text churn replaces legacy CSS colors with semantic tokens.
No protected media, tutorial/player logic, package/lockfile or redirect changes.

## Verification

- nvm is unavailable; active Node `v24.10.0` matches `.nvmrc` major 24. npm `11.6.0`.
- `npm ci`: pass; existing tsconfck deprecation notice, no dependency changes.
- `npm run check`: pass, zero errors; one existing tutorial internal-navigation lint warning.
- `npm run build:next`: pass, all canonical pages statically rendered.
- `npm run build`: pass, retained Vinext/Cloudflare build. Existing route-classification
  notice and stale Browserslist-data warning; no package updates performed.
- `npm audit --omit=dev`: zero vulnerabilities. `git diff --check`: pass.
- 54 production-build browser route/width combinations at 320, 390, 768, 1024, 1440,
  1920 effective CSS pixels: no overflow/clipped descendants, broken loaded images,
  missing alt or text-contrast failures; one H1 per page. Minimum measured normal-text
  ratio 4.66:1. Screenshots reviewed across widths; homepage full-page comparison made.
- Keyboard Enter/Space menus, Tab links, Escape focus restoration, exclusivity and
  outside dismissal pass at 320px. All ten tutorial modules and complete-guide mode
  pass after navigation settles, with expected hashes, visible panels and focus.
- Both videos initially have no iframe or remote embed/preconnect markup. Deliberate
  Load uses the two approved youtube-nocookie IDs; Close restores poster/button focus.
  Full third-party network telemetry and playback are not asserted by this check.
- Reduced-motion CSS reviewed; no new animation introduced. Initial server HTML retains
  all copy/IDs/links, native disclosures and tutorial content for no-JavaScript access.
- HTTP comparison with pre-update production proves identical main text, IDs and links
  on all nine routes. Canonicals, labelled footer links, all tutorial originals, robots,
  sitemap and current social/favicon routes pass. Six legacy routes return expected 308s.
- Protected authentic media/player/tutorial/dependency/redirect paths are unchanged.
  Secret, obsolete-division and tracking/storage source scans return zero matches.
- Ordinary page browsing returns no console errors. Baseline service log contains
  historical malformed Server Action errors from earlier releases; latest prior startup
  is healthy. Do not misclassify historical entries as new release failures.
- Production staging/activation, final SHA/build ID, HTTP/browser/log results and the
  post-verification release tag are recorded in the external completion receipt after
  execution, avoiding a source commit that claims its own future deployment success.

## Repository state after implementation commit

On main at `da2a2cdb10337b4ff87aac5f017c285b7bc8ea3e`, clean working tree before
this record, one commit ahead of origin/main. Next dev's generated AGENTS/next-env
changes were reviewed and restored; they are not part of the design. Push both
implementation and archive commits before deployment. No branch/worktree/PR created.

## Implementation commits

- `da2a2cdb10337b4ff87aac5f017c285b7bc8ea3e` — Refine Asymmetri identity with mineral, Sports and Labs palettes.

## Archive commit

`docs: archive visual identity differentiation release request`

## Lessons learned

Contrast must be checked in the actual section context. A teal that passes on
mineral can fail on a slightly darker Sports field. Use resolved division tokens,
verify effective browser widths and wait for focus/scroll/navigation to settle
before judging interactive behavior. Preserve source tags and complete runtime
snapshots as complementary rollback evidence.

## Follow-up ideas

No additional product or architecture work is included. Existing non-blocking tooling
warnings can be reviewed separately when maintaining the framework baseline.
