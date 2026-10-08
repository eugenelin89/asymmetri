# Prompt 045: Simplify the homepage to a division gateway

- Date: 2026-10-08
- Scope: design
- Goal: Retain the first Asymmetri homepage section as a concise gateway, then validate, commit, deploy, verify and tag the release.

## Original user request

> # ASYMMETRI.CO — SIMPLIFY THE HOMEPAGE TO A SINGLE GATEWAY SECTION
>
> Update and deploy the homepage:
>
> https://asymmetri.co/
>
> This is a **focused homepage simplification**.

The supplied long request directed the following decisions:

- Use actual latest clean `main`; inspect local branch, HEAD, untracked files,
  worktrees, recent history and production before editing. Preserve unrelated work.
- Verify live source/build health and create an immutable pre-change rollback tag.
- Keep the existing Graphite + Teal hero, headline/support, equal Sports/Labs
  choices and direct Motion/BotSquad links. Preserve company architecture.
- Remove philosophy, both product showcases, common thread and large contact
  section. Add no replacement sections, imagery, slogans or animations.
- Remove the product-scroll action and hero scroll footer. Use design judgment
  between one About link and no hero actions. Keep current division descriptions.
- Make Contact useful through the existing central mailbox; retain the shared
  footer, Motion resources and useful historical Sports fragment compatibility.
- Remove unused homepage content, imports, components and styling without deleting
  facts or assets needed on dedicated pages. Fix obsolete product/contact anchors,
  including documentation and navigation. Keep accurate metadata and sitemap.
- Use responsive height without mobile clipping; inspect narrow/mobile/tablet/
  desktop/wide composition, links, keyboard/focus, overflow and browser errors.
- Run npm ci, check, both build paths, production audit and diff whitespace checks;
  do not run audit fix. Smoke-test Sports/Labs/About and protected Motion routes.
- Follow CLI/deployment guidance, build before service activation, preserve
  unrelated sites, verify exact production SHA/health/content, then push an
  immutable post-verification release tag. Report timing, rollback, changes,
  validation, commits, production health and remaining issues.

## Scope

Only the homepage composition and its now-unused presentation/content, shared
Contact link, optional footer contact target, About gateway link and associated
documentation changed. No product page content, hierarchy, public asset bytes,
dependencies, route configuration, backend or infrastructure changed.

## Decisions

- Keep `HomeCapability` unchanged and retain “Why Asymmetri →” as the sole hero
  action. Remove the entire hero footer line with the obsolete scroll link.
- Give the hero a responsive, capped viewport min-height with natural content
  growth. Preserve existing typography, tokens, division panel geometry and footer.
- Define the mailbox once in `content/site.ts`; retain `site.company.contactEmail`
  for existing consumers and reuse it for primary navigation.
- Preserve `/contact` → `/#contact` by placing the historical target on the existing
  homepage footer email only. This avoids a replacement section or routing change,
  and avoids duplicate contact IDs on Sports. Existing root Sports migrations and
  their no-JavaScript fallback remain unchanged.
- About's “Explore Sports and Labs” points to `/`. No current navigation expects
  the removed product showcase. Shared About origin content remains available.
- Remove `HomeWorkerFlow` and styles exclusively belonging to deleted homepage
  visuals. Its dedicated BotSquad counterpart uses different markup/styles.
- Preserve the existing accurate homepage metadata and all public image URLs.

## Implementation

One server-rendered gateway section now sits between the shared header/footer.
Sports, Labs, Motion, BotSquad and About are directly reachable. Product/philosophy
explanations remain on their dedicated pages. The compatibility component is the
only homepage-specific client interaction retained.

## Engineering impact

Less markup, content and CSS, with no dependency or architecture addition.
Essential navigation still works without JavaScript. Protected Motion source,
copy, IDs, original images, canonicals and public assets are unchanged. The release
uses the documented unchanged-dependency staged build and existing Node 22 runtime;
local validation used installed Node 24.10.0 matching `.nvmrc` (nvm unavailable).

## Files changed

- Homepage and global stylesheet: remove lower sections and obsolete selectors,
  retaining the gateway with responsive height.
- About and shared footer: update gateway destination and optional legacy email ID.
- Shared content: central mailbox reuse and removal of homepage-only fields.
- Homepage worker-flow component: removed after its sole consumer disappeared.
- Current documentation: gateway role, navigation, compatibility, visual intent,
  regression checks and unchanged asset usage.

## Documentation updated

README, Site Strategy, Content Guide and Architecture now describe the short
umbrella gateway. Testing covers the new composition and contact compatibility.
Deployment clarifies the preserved contact redirect; Visual Identity reflects
Home's all-graphite composition. Asset Manifest records removed homepage usage
while preserving earlier provenance and every public asset. Historical journals
and dated decision records were not rewritten.

## Git diff summary

Implementation: 14 files changed, 75 insertions and 395 deletions. Most deletions
remove homepage sections, their content and obsolete CSS; additions preserve
contact continuity and document the intentional gateway.

## Verification

- Baseline: local and production clean `main` at
  `322b67acd785735dd2ffac9c5c082c684fbee836`, equal to fetched origin/main.
  Existing unrelated exploration worktree preserved. Service active; loopback,
  apex and www homepage/division/About/protected routes returned HTTP 200.
- Pushed and verified annotated `website-pre-homepage-simplification-2026-10-08`
  at that exact production SHA. Running baseline build ID: `nBS32KHd75LYxFVAxe4wu`.
- `npm ci`: passed. `npm run check`: passed, with the existing tutorial navigation
  lint warning and no errors. Both production build commands passed. Initial
  sandbox port/network restrictions were resolved with approved execution access.
- `npm audit --omit=dev`: ran, exit 1, one high-severity Next.js dependency finding
  covering six advisories in unchanged 16.3.6. No audit fix or version changes.
  The [high-severity remote-image advisory](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4)
  states applications without remotePatterns are unaffected; this site has none.
  Reviewed cache advisories require Pages Router or a root catch-all, absent here.
  This is bounded applicability review, not a clean audit or complete security audit.
- `git diff --check`: passed. Source scans found no obsolete hierarchy, obsolete
  product-fragment link, credential material or new private identifiers. Diff review
  found no new personal data or unsupported claims.
- Browser: 320, 390, 768, 1024, 1440 and 1920 CSS pixels inspected. One main section,
  all five destinations, mailto Contact, no clipped descendants/overflow, reduced
  motion, skip link, keyboard disclosure/Escape/focus, legacy fragments, contact
  redirect and no-JavaScript navigation passed. No console/page errors.
- All nine local routes, six redirects, 45 referenced assets, internal anchors,
  metadata, canonicals, sitemap and robots passed HTTP/content checks.
- Browser DOM comparison against live baseline confirmed unchanged main copy and
  IDs on all eight dedicated pages; tutorial retains 104 descendant IDs and 52
  original-image links. Protected routes, public assets and runtime/configuration
  files have no source diff. About changes only its gateway href.
- Production build, activation and final release verification follow the archive
  commit/push. Final source/build IDs, tag, retained rollback paths and checks belong
  in the external release receipt and final response, not a self-referential commit.

## Repository state after implementation commit

Clean `main` at `730d16cf9a3a237ebb2be24f2051fffe46463364`, one implementation commit
above origin/main. No unrelated changes included. Archive commit and push follow.

## Implementation commits

- `730d16cf9a3a237ebb2be24f2051fffe46463364` — Simplify Asymmetri homepage into division gateway

## Archive commit

`Record homepage gateway simplification and validation journal`

## Lessons learned

An existing footer email can preserve historical contact links without retaining a
large contact section. Compare DOM text rather than rendered line breaks when
checking unchanged content across responsive browser contexts. Audit output can
change independently of a lockfile; report it accurately without broadening a
focused homepage release into unrequested dependency remediation.

## Follow-up ideas

Separate dependency maintenance should resolve the reported Next.js audit findings.
Server capacity remains limited; no old releases or unrelated files were deleted.
