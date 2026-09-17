# Prompt 018: Product section navigation and placement

- Date: 2026-09-16
- Scope: design
- Goal: Give Product a plain label, direct menu access and a later place in the homepage narrative.

## Original user request

> I don't like "**Our first product**". How about just "Product". Also, Product should be accessable from the menu. Also, I think Product section should be the last section at the very bottom, what do you think?

After the recommendation to place Product after Story and Approach, immediately
before the closing contact section, the owner confirmed:

> sounds good. make it so. proceed.

## Scope

Homepage section order, shared navigation and product labels, with affected
documentation. This continues the authorized website publication and existing
Node 22 production exception from the same conversation. No product-source,
asset, dependency, infrastructure or utility-policy changes.

## Decisions

Use Story → Approach → Product → Get in touch for both navigation and homepage
order. The owner accepted keeping the human-coaching contact close last.
Replace the former Motion menu item with Product at `/#product`, retaining four
links and avoiding redundant destinations. The section's existing Explore button
continues to open the detailed `/motion` page.

Use “Product” for the homepage eyebrow. Remove “Our first product” from the hero
sentence and use “An Asymmetri Labs product” on the Motion page for consistency.
Product capabilities, release status and other narrative copy remain unchanged.

## Implementation

Moved the existing Product section after Approach and before Contact. Added the
stable `product` anchor and `tabIndex={-1}` so menu navigation can focus it without
adding a stop to the normal Tab sequence. Existing header scroll padding keeps
the destination visible. Shared navigation labels and URLs remain centralized.

## Engineering impact

Server-rendered markup and copy only. No CSS, client JavaScript, dependency or
asset change. Both root-page and cross-route links reach the same section.
Existing styles, image optimization, metadata and route handling remain intact.

## Files changed

- Homepage composition and central navigation/product copy.
- README, architecture, content guide and site strategy describe the new order
  and distinguish the Product section from the detailed Motion page.
- Testing guidance adds cross-route Product anchor and Explore-button checks.

## Documentation updated

Current guidance now records the agreed placement and four-link navigation order.
No asset-manifest update is needed: image files, provenance and public roles are
unchanged. Historical prompt records are preserved.

## Git diff summary

Implementation: 7 files changed, 62 insertions and 45 deletions. Most homepage
changes move existing markup without rewriting it. This journal is excluded.

## Verification

- Clean `main` at `54fe3ff30195d58a0ba69abed03c606fd96b6965`; fast-forward pull
  succeeded before edits. Node 24.10.0 matches `.nvmrc`; nvm unavailable.
- TypeScript/ESLint, standard Next.js build, retained Vinext build and whitespace
  checks pass. The existing Vinext route-classification notice is unchanged.
- Local production checks pass for all four pages, internal links/anchors,
  metadata/social assets, sitemap, robots and legacy redirects.
- Browser confirms hero → Story → Approach → Product → Contact. Product links
  from Motion, Privacy and Support return to `/#product`, with focus on Product.
  Explore opens `/motion`. Keyboard activation and visible focus pass.
- Responsive checks at 320, 390, 768, 1024 and 1440 CSS pixels find no horizontal
  overflow. The 320px header fits all four 44px-high links. Product images load;
  desktop, tablet and mobile Product layouts were visually reviewed. The anchor
  aligns below the sticky header. Browser console has no errors.
- Reduced-motion CSS remains unchanged and disables smooth scrolling, hover
  translation and transitions. Public privacy/prohibited-reference scans pass.
  Privacy/Support content, assets and package files are unchanged.
- Production audit retains four existing findings: one critical, two high and
  one moderate. No automatic dependency fix is included.

## Repository state after implementation commit

`main` at `fdf9e61d8b9726fdf2fe18b7988c89571e0eb469`, clean before this journal
and one commit ahead of `origin/main`. No unrelated work, branch, worktree or PR.
Deployment follows the two commits; live verification is reported after it occurs.

## Implementation commits

- `fdf9e61d8b9726fdf2fe18b7988c89571e0eb469` — Move Product below Approach and add section navigation.

## Archive commit

`Record Product section placement journal`

## Lessons learned

Match menu labels and order to the page's actual structure. A direct anchor makes
a lower Product section easy to reach while keeping the company story coherent.

## Follow-up ideas

No additional changes proposed for this request.
