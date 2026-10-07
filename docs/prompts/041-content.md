# Prompt 041: Rebuild the BotSquad project page

- Date: 2026-10-07
- Scope: content
- Goal: Explain BotSquad's persistent-team experiment with verified current capabilities, concrete workflows and honest limits, then deploy and tag the release.

## Original user request

> ASYMMETRI.CO — REBUILD THE BOTSQUAD PROJECT PAGE
>
> Update and deploy: https://asymmetri.co/botsquad
>
> Implement, validate, commit, deploy, verify, and tag the release.

The large user-supplied request required a focused content, information-architecture and
presentation rebuild, not a company redesign or BotSquad product change. Review latest
website and BotSquad authority, inspect clean main/worktrees/production, and push an
immutable exact-production rollback tag before editing. Preserve Graphite + Teal,
protected Motion resources, privacy and the approved deliberately loaded introduction.

Explain the origin, persistent-worker model, long-term goal, validated Atlas/Maya/Turing/
Linus/Ada/Grace/Scout reference organization, current talk/discussion/research/software/
browser/history/evidence workflows, and four design principles. Use a clearly labelled
illustrative Motion Hitting scenario. Explain proposed Asymmetri Motion, website and future
Labs uses without claiming shipped Hitting work, broader engineering support, publication
authority, unattended autonomy or business outcomes. Give concrete Ubuntu bootstrap and
private SSH-tunnel access steps. Expose source, setup, white paper and roadmap links.

Separate current capabilities, Personal Operator / Daily Driver focus, deferred directions
and illustrations. Centralize copy, update metadata/schema and current-facing docs. Run
npm ci, check, both builds, production audit and whitespace checks; inspect mobile/tablet/
desktop, keyboard, diagrams, links, video and related routes. Follow routine production
access, preserve rollback material, build before activation, verify exact revision/service/
HTTPS/protected routes, and push an immutable post-verification release tag. Report progress
and a final source/validation/Git/release account. This summary omits private attachment
identifiers and preserves the decision-complete request.

## Scope

Website only. BotSquad reviewed read-only at remote main
`968a0e2b8c96eb1f1bde397227f4fab8e4e30c76`. No Motion or BotSquad source edits, private
HQ access, company architecture change, new dependency or infrastructure change.

## Decisions

- Use README/current state/accepted validation for capability; roadmap and Decision 026 for
  current priority; white paper for design and reference hierarchy. Its old status passages
  do not override current authority.
- Lead with the concrete team question, then explain the goal and persistence. Use a real
  reference organization and a labelled possible workflow instead of a generic fake task.
- State one-company/eight-worker/two-execution limits, bounded Node engineering and
  fixture-only browser-write acceptance. The Motion iOS app build is not supported by
  inference from a generic engineering claim.
- Explain potential Asymmetri use and qualify the real pilot as one supervised unmerged
  documentation action plus review, with no app change or business benefit established.
- Keep static semantic diagrams and native anchors. Reuse existing tokens and video
  component. No private screenshots, new imagery, external fonts or animation.
- Pre-change rollback marker: `website-pre-botsquad-page-rebuild-2026-10-07`, remotely
  verified at `024338b4b07b85b3297c92ddea11b497e997c388` before edits.
- Use the documented copy-only staging method because dependencies/assets/configuration
  are unchanged and production has roughly 990 MiB free. Preserve exact source, Git
  metadata and previous build; no cleanup of older releases or live dependency installation.

## Implementation

New page sequence: hero/index; goal; persistence/reference team; current capabilities and
evidence; design ideas; illustrative Motion workflow; building Asymmetri; setup; under the
hood; Today/Current focus/Later; human control; approved introduction. All substantive
copy lives in the project-specific `botsquad` object. Software/source schema retains MIT,
Ubuntu, repository and publisher, with verified TypeScript/Node stack facts.

## Engineering impact

Server-rendered nested/ordered lists preserve reading order and mobile reporting lines.
Native index anchors retain existing public fragments. The page contains about 1,460
main-content words, broken into short sections, diagrams and scan-friendly groups.
No new client state or dependencies. Homepage BotSquad description and Labs source CTA
inherit updated central copy; their layouts stay unchanged. Motion content and all asset
bytes, package/config files, routing and shared navigation are unchanged.

## Files changed

- BotSquad page, worker hierarchy/example components and scoped CSS: new structure/visuals.
- Central content: verified copy, role descriptions, current limits, links and metadata.
- README and strategy/content/architecture/testing/asset/deployment docs: maintenance rules.
- Dated BotSquad source review: revision, precedence, claim boundaries and rollback baseline.

## Documentation updated

README, BRAND_STRATEGY, SITE_STRATEGY, CONTENT_GUIDE, ARCHITECTURE, ASSET_MANIFEST,
TESTING and DEPLOYMENT, plus BOTSQUAD_PAGE_REVIEW_2026-10-07. Historical journals and
company decisions retain their original records. No white-paper duplication.

## Git diff summary

Implementation: 14 files, 552 insertions, 200 deletions. Replaced abstract product framing,
expanded the central content model and semantic diagrams, and documented source truth and
release preservation. This journal is excluded from those totals.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm unavailable. `npm ci` succeeded without lockfile edits.
- `npm run check`: passed after correcting the new index's type name to existing `NavItem`.
  The existing tutorial navigation lint warning remains; no errors.
- `npm run build:next`: passed; `npm run build`: passed. Existing Browserslist data and
  Vinext route-classification notices remain.
- `npm audit --omit=dev`: zero vulnerabilities. Full install reported development-tree
  findings; no audit-fix or unrelated dependency remediation was performed.
- `git diff --check`: passed. Public-source scans found no credential/private-reference,
  obsolete brand, internal milestone-number or em/en-dash additions.
- Browser: 320, 390, 768, 1024 and 1440 effective CSS widths; no horizontal overflow or
  clipped main descendants. Mobile nested team and desktop/tablet hierarchy/workflow
  visually reviewed. Lowest checked normal-text contrast 6.49:1.
- Mobile Labs menu opens by Enter, closes by Escape and restores visible teal focus.
  Native page anchors resolve; no stale fragment, broken image or browser console error.
- Video before activation: no iframe or remote script/image/preconnect element. Keyboard
  Load creates the approved privacy-enhanced E5r_lOecC-M player without autoplay. Player
  renders native controls; Close removes it and restores Load focus. Network resource
  timing is unavailable through this browser adapter; DOM/source loading behavior is verified.
- Reduced-motion CSS inspected: smooth scrolling, transitions and animation disabled;
  new diagrams introduce no movement. Essential page copy is present in initial server HTML.
- Source/setup/white-paper/roadmap/license URLs: HTTP 200; setup fragment matches README.
- Local HTTP: all nine routes, six redirects, correct canonicals/schema/footer links and
  all 24 tutorial originals pass. Motion, privacy, support and tutorial main HTML match
  the pre-change production output exactly.
- Labs/home smoke tests at 320/768/1440: no clipping, overflow, missing-alt/broken image
  or console error. Homepage differs only by the centralized BotSquad description.
- Production deployment/health and release-tag results follow this archive commit and
  belong in the external release receipt and final report, not a self-referential SHA edit.

## Repository state after implementation commit

Clean `main` at `097fb939285bacebf69d17f56835b2016deea609`, one implementation commit
ahead of origin/main before this journal. The existing unrelated design worktree was
inspected and left untouched. No new branch, worktree, PR or merge.

## Implementation commits

- `097fb939285bacebf69d17f56835b2016deea609` — Reframe BotSquad around its open-source experiment and capabilities

## Archive commit

Record BotSquad project-page rebuild and release journal

## Lessons learned

A capability list needs the limits of the actual execution environment beside it. Current
README/acceptance records can supersede a white paper's old status without making its
design ideas obsolete. A concrete reference scenario is useful only when clearly separated
from a claim that the scenario happened.

## Follow-up ideas

None committed. Revisit public capability and roadmap copy when accepted source evidence changes.
