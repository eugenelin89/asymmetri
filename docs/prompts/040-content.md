# Prompt 040: Simplify Labs as an open-source playground

- Date: 2026-10-07
- Scope: content
- Goal: Make Labs a brief, curious open-source playground, then deploy and tag the verified release.

## Original user request

> # ASYMMETRI.CO — SIMPLIFY ASYMMETRI LABS
>
> Update and deploy the **Asymmetri Labs** section of Asymmetri.co.
>
> Asymmetri Labs should feel like a playground for open-source experiments, not a corporate business division.
>
> Implement, validate, commit, deploy, verify, and tag the release.

The attached request required the latest main and production state to be inspected,
a verified immutable rollback tag before edits, and preservation of the selected
theme, company hierarchy, Sports, BotSquad detail, product truth and roadmap.
All current and future Labs projects must be open source; Sports has no blanket
licensing requirement. Remove the repeated approach/principles and philosophical
sections. Use the preferred brief hero, explicit open-source statement, “Currently
playing with” BotSquad, source/detail links, established MIT license and one closing
sentence. Keep a simple future-friendly project model, update metadata and current
documentation, and make only small homepage/navigation consistency edits as needed.
Run production builds, checks, audit and responsive/accessibility/link verification;
commit and push main using the existing journal policy; deploy through documented
access only after a successful staged production build. Verify service, loopback,
apex/www, protected Motion resources and exact source identity before creating the
new immutable release tag. Report progress/ETA, both tags, commits, validation,
production health and the exact recovery procedure. Historical records and private
attachment identifiers must not be copied or rewritten.

## Scope

Labs content, page structure and scoped CSS; one shared Labs description used by
the homepage; current-facing documentation; validated release operations. No company
or Sports redesign, BotSquad detail rewrite, dependencies, new public assets,
tracking, backend, runtime or infrastructure changes.

## Decisions

- Local main, origin/main and healthy production all began at
  `bc85e3a4425b1133dd848711573981c56f6a22c8`. Fetch/pull succeeded, production had
  no tracked/untracked changes and was neither ahead nor behind. Existing worktrees
  and recent commits were inspected; the theme exploration worktree was untouched.
- Created/pushed annotated `website-pre-labs-simplification-2026-10-07` at that
  verified live SHA and confirmed the remote peeled target before modifying source.
  The previous `website-dark-teal-theme-2026-10-07` tag remains unchanged.
- Used the owner's preferred copy directly. The optional extra paragraph and longer
  BotSquad explanation were unnecessary. Main content fell from 345 to 68 words.
- GitHub is the filled primary project action; the detail page and actual MIT
  license remain visible links. The server page has no product-specific access
  fields or hard-coded future license.
- A small explicit `LabsProject` type requires name, description, status and source;
  detail and established license links are optional. BotSquad remains the only
  entry, reusing its existing facts and URLs. No speculative projects or CMS.
- Retained Graphite + Teal and shared accessible controls. Removed only the unused
  Labs approach styles from shared selectors, preserving WorkerFlow declarations.
- Use the documented copy-only staged build with unchanged dependencies on the
  existing approved Node 22 server. Keep serving output intact until validation
  succeeds; retain rollback source/build evidence outside tracked source.

## Implementation

The hero says “A playground for ideas.” and “Everything we build in Labs is open
source.” A single “Currently playing with” section presents BotSquad, followed by
“More experiments will show up here when they're worth sharing.” Formal approach,
principles, repeated technical explanation and the philosophical closing are gone.
The shared homepage Labs description now says “A playground for open-source
experiments.” Navigation, Sports and BotSquad detail remain unchanged.

## Engineering impact

Less page markup and copy, a generic typed project list, no additional client code
or dependencies. All public asset bytes, Motion utility/tutorial content, product
truth, roadmap, video IDs/privacy behavior and route configuration are preserved.
The open-source commitment is explicitly limited to Labs. Source/license actions
use existing 44px-or-larger controls and visible keyboard focus.

## Files changed

- Labs route, central content model and scoped global CSS.
- README and brand, site strategy, content, architecture and visual-identity guides.
- Testing guidance and deployment release-marker documentation.

## Documentation updated

Current guidance records Labs as an open-source playground and Sports as product-
oriented sports technology. Architecture/content guidance explains optional project
links and evidence-based licensing. Testing/deployment guidance covers the removed
sections, source links and immutable markers. No public asset changes occurred,
so the asset manifest and historical source-review records remain unchanged.

## Git diff summary

Implementation: 11 files changed, 127 insertions, 133 deletions. The page loses its
formal multi-section presentation; current documentation records the simple rule.
This record is excluded from its own implementation summary.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; nvm is unavailable.
- `npm run check`, `npm run build:next`, `npm run build`,
  `npm audit --omit=dev` and `git diff --check` passed. Audit: zero vulnerabilities.
- The existing tutorial navigation lint warning and stale Browserslist data
  advisory remain. Vinext's existing static route-classification notice remains.
- Labs checked at actual 320, 390, 768, 1024, 1440 and 1920 CSS pixels; desktop,
  tablet and mobile visuals reviewed. No page overflow or visible clipped content.
- Mobile Labs disclosure opens by keyboard, Tab reaches its link, Escape closes it
  and restores summary focus. Project links have 44/56px targets and 3px focus.
  Existing reduced-motion rules disable smooth scrolling, transitions and movement.
- Homepage, Sports and BotSquad smoke-tested at 320, 768 and 1440px with no overflow,
  broken images, missing alt attributes or browser warnings/errors. Rendered text
  contrast checks passed; lowest across those routes was 5.28:1 (Labs 6.49:1).
- Local HTTP checks passed all nine pages and six redirects, expected canonicals,
  shared Motion footer links and 24 tutorial original-image links. GitHub source
  and MIT license destinations returned HTTP 200.
- Main HTML for BotSquad, Sports, Motion, Privacy, Support and Tutorial matched the
  existing live baseline exactly. All non-Labs content exports stayed identical;
  only `divisions` and `labs` changed. Public assets and route/runtime/package
  configuration are unchanged.
- Public-source scans found no obsolete Work/singular-Sport branding, credential
  patterns or stale `/labs#approach` references. New copy is owner-provided wording;
  no private organization, athlete, account or private application material is added.
- Before implementation, service was active and eight relevant routes returned 200
  on loopback, apex and www. Final production staging/activation, source/build
  verification and release tagging follow this journal push; exact results are in
  the external release receipt/final response, not asserted prematurely here.

## Repository state after implementation commit

Main at `0971d35f116f26f147d42f693d2902d15201fa0d`, clean before this journal.
Origin remained at the verified baseline pending the required two-commit push.

## Implementation commits

- `0971d35f116f26f147d42f693d2902d15201fa0d` — Simplify Asymmetri Labs around open-source experiments.

## Archive commit

`Record Labs simplification and release journal`

## Lessons learned

A short index can state its identity and make the source easy to reach while the
project page carries technical depth. Optional project fields prevent the first
entry's access model or license from becoming assumptions about future experiments.
Keep immutable source tags and verified running-build identity distinct.

## Follow-up ideas

None required. Add real future Labs projects only when ready to share, with their
actual source and any established license.
