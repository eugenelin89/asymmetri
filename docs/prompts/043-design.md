# Prompt 043: Illustrated BotSquad worker portraits

- Date: 2026-10-07
- Scope: design
- Goal: Give each Meet BotSquad worker a distinct illustrated face inside the existing card.

## Original user request

> I want to put up some faces for "Meet BotSquad". Generate faces for each employee similar style as attached. And put the face inside each box that contains employee name and position.

Two owner-supplied illustrated headshots accompanied the request as visual style
references. The source images remain untouched and unpublished; their filenames and
the complete generation prompt set are recorded in `docs/BOTSQUAD_PORTRAITS.md`.

## Scope

Seven new fictional portraits for Atlas, Maya, Turing, Linus, Ada, Grace and Scout,
plus their rendering and minimal card styles. Preserve the company theme, public copy,
roles, reporting hierarchy, owner node, examples, links, video and protected Motion routes.
Publication follows the same existing staged production workflow as the preceding update.
No product, dependency, routing, infrastructure or unrelated site changes are included.

## Decisions

- Generated each portrait separately with the built-in image tool, using both supplied
  images only as style references. No CLI/API fallback or outside stock media.
- Kept crisp outlines, warm neutral backgrounds, shaded facial planes and realistic
  adult proportions consistent across the set. Faces, hairstyles and glasses distinguish
  the characters without inventing biographies or portraying them as human employees.
- Preserved each full square composition. The 1254×1254 PNGs are retained outside public
  source; 384×384 WebP exports total 131,666 bytes, using existing Sharp at quality 86.
- Stored all image paths, intrinsic dimensions and meaningful alt text in `content/site.ts`.
- Used the existing Next.js Image component, lazy loading and an 80px size hint. Explicit
  dimensions reserve space; portraits do not add focus stops or browser JavaScript.
- Added an 80px portrait beside each card's stacked name/role. Responsibilities remain
  below, and the existing nested-list diagram and Graphite + Teal styling remain intact.
- Verified clean local/remote/live main at `299a5617b3f69d66841926c01f5e4cedf2b6ed36`.
  Created and remotely verified immutable rollback tag
  `website-pre-botsquad-portraits-2026-10-07` at that revision.
- The release adds only new portrait assets; pre-existing assets and runtime/dependency
  configuration remain unchanged. Preserve old source/Git/build before activation, and
  validate the exact pushed candidate as the application owner without a live install.

## Implementation

Every named worker card includes its own portrait, readable name, role and existing
responsibility. Atlas still leads Maya/Turing/Scout; Linus/Ada/Grace remain under Turing.
No portrait is invented for the owner. The portrait identities are illustrations of AI
workers; no new disclaimer or removed public caveat is reintroduced.

## Engineering impact

Seven small local image assets and one presentation extension. No added dependency,
client component, animation, analytics, external resource, state or interaction.
The shared Worker type now requires a portrait. All face image metadata is centralized.
Existing public URLs, product truth and privacy-conscious video behavior are unchanged.

## Files changed

- Public BotSquad image directory: seven optimized portraits.
- Central content, WorkerFlow and global CSS: portrait metadata and card presentation.
- Asset manifest, content guide and portrait record: provenance, rights assessment,
  dimensions, processing, alt text, prompt set and future maintenance.

## Documentation updated

`ASSET_MANIFEST.md` records every new public asset. `BOTSQUAD_PORTRAITS.md` retains the
exact shared/individual prompts, generated source IDs and processing details.
`CONTENT_GUIDE.md` explains the portrait fields and fictional-character boundary.
No setup, architecture, runtime or deployment procedure changed.

## Git diff summary

13 implementation files changed, 151 insertions and 12 deletions, including seven new
binary image files totaling 131,666 bytes. The changes are the portraits, their card
presentation and documentation. This journal is excluded from its own diff summary.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm remains unavailable from the verified local setup.
- `npm run check`: passed, with only the pre-existing tutorial-navigation lint warning.
  An initial spread-prop alt warning was resolved by spelling out the Image props.
- `npm run build:next` and `npm run build`: passed. Existing Browserslist and Vinext
  route-classification notices remain. No dependency install or audit fix.
- `npm audit --omit=dev`: one high-severity finding in existing Next.js 16.3.6, exit 1,
  as in the preceding release. Package and lockfile remain unchanged.
- `git diff --check`: passed. Added-source credential/private-path/prohibited-branding
  scans passed. Generated portraits contain no text, marks or private product content.
- All seven image outputs were inspected against the two references and in the cards.
- Browser widths 320, 390, 768, 1024, 1440 and 1920: zero page/descendant or role-label
  overflow. All seven images load with nonempty alt text and an 80px displayed width.
  Mobile/tablet/desktop screenshots confirm legible cards and unchanged hierarchy.
- No missing local anchors, added focus stops, browser warnings or console errors.
  Native menu Enter/Escape and 3px focus outline work; reduced-motion styles unchanged.
- Local HTTP: nine routes and six redirects pass; all seven direct and optimized portrait
  URLs return image responses. All 24 tutorial originals remain healthy.
- Homepage, Labs and all four protected Motion routes have main HTML identical to the
  saved live baseline. Existing canonical and footer checks pass.
- Production preflight: clean main matches remote, prior build `WIqkL6JZ4mFiKMIB_yQaz`,
  service active, homepage/Labs/BotSquad and protected routes healthy on loopback/apex/www.
- Exact deployment results and final source/build/tag identities belong in the external
  release receipt after activation; this record does not claim future verification.

## Repository state after implementation commit

Main at `fdaf5f45aabdb0c994395989acb58620ef974c0f`, clean and one commit ahead of origin/main.
Only intended files were staged. This journal is a separate commit before pushing both.

## Implementation commits

- `fdaf5f45aabdb0c994395989acb58620ef974c0f` — Add illustrated portraits to the BotSquad team

## Archive commit

`Record BotSquad portrait generation and release journal`

## Lessons learned

Consistent framing and background make independently generated portraits feel like one
set. Keep illustrated identities separate from product facts, and verify the narrow
tablet branches as well as the stacked phone layout. Retain source artwork and prompts
while shipping only optimized public assets.

## Follow-up ideas

No new features or portrait variants are committed. The existing Next.js audit finding
remains a separate dependency-maintenance item.
