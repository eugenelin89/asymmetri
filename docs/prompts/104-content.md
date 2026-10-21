# Prompt 104: Refresh Sports and Motion for v1.2

- Date: 2026-10-21
- Scope: content
- Goal: Align Sports, Motion and related product help with accepted Motion v1.2 and the current family roadmap.

## Original user request

> Update the website for Sports and Motion based on Asymmetri Motion v1.2 to make sure everything is up-to-date and not stale.

## Scope

Updated public Sports/Motion content, shared family states, tutorial/support guidance
and affected maintenance documentation. Preserved existing images, measurement
definitions, protected routes and policy content. No product-repository edits,
new assets, dependencies, deployment, hosted preview, app distribution or public
beta invitation. The local browser preview was stopped after verification.

## Decisions

- Read the latest release branch independently from future-development main.
  Motion's October 20 release ledger supersedes older main/roadmap descriptions
  of paused distribution. Accepted 1.2 (4) has owner-only TestFlight acceptance;
  public App Store release remains pending. Public copy retains Preparing for
  release and explains private testing without publishing internal identifiers.
- Verify Pitching against accepted binary source
  `ab69695fbcb43f3b10809f7e31c0e596b5a85fd3`; fetched release documentation is
  `3d3f42ddf82028e67e86c51b3fb0f6b303988fcc`. Their complete iOS trees match.
  Main `1fe5de98af4248f6c7ffc23a3c7241af6d1e7286` supplies Hitting evidence only.
- Change Hitting from Planned to In development. Its implemented review tools
  do not establish normal scientific validity or public availability. Keep Team
  planned and clarify planned Dual View outside v1.2.
- Preserve the longitudinal product story and eight existing public measurement
  entries. Add current source-time, manual-alignment and paused saved-comparison
  detail, plus All history defaults without changing saved-filter semantics.
- Preserve all ten tutorial modules and existing hashes. Add subordinate Notes,
  personal PDF review, Reference Study and Compare instructions. Keep older
  screenshots as labelled examples rather than replacing genuine evidence.
- Browser QA exposed a smooth-scroll race after tutorial module visibility
  changes. Resolve hash navigation immediately after the new layout, retaining
  focus on the requested step. This bounded repair supports the new deep link
  and existing tutorial links.

## Implementation

Sports now describes v1.2 reference review and deliberate sharing. Motion's hero
and shared family state the current release status; its study section links to
the new tutorial instructions. Release copy derives from the Pitching family
detail. Explore, tutorial and Support distinguish new All-history investigations
from Saved Views with retained ranges. Local-storage copy includes Notes, Context,
References and saved comparison configurations. The existing Privacy Policy is
byte-equivalent at the content-object level.

## Engineering impact

Content remains centralized in `content/site.ts`, with server-rendered page
composition. The only client behavior change makes tutorial hash scrolling
immediate after module changes. No CSS, runtime integration, dependencies,
tracking, accounts, data stores, public assets or infrastructure changed.
Existing motion-reduction rules and visible keyboard focus remain intact.

## Files changed

- Shared product content and Motion composition: release/family truth states,
  study explanation/link, tutorial steps and Support recovery guidance.
- Tutorial reader: immediate hash scrolling after module visibility changes.
- README and architecture/content/brand/site/testing guides: current states,
  source authority, navigation behavior and applicable regression expectations.
- Motion and tutorial source reviews: dated evidence map and preservation scope.
  The October 7 company record adds a pointer to current evidence while keeping
  its original review and rollback history.

## Documentation updated

README, Architecture, Brand Strategy, Content Guide, Site Strategy and Testing
now agree with the October 21 evidence. Motion Product Review records exact
release/development refs and source locations; Tutorial Review records the four
new subordinate steps and scrolling repair. Asset Manifest, Local Development
and Deployment are unchanged because assets, commands and hosting did not change.

## Git diff summary

Implementation: **12 files changed, 198 insertions, 65 deletions**. Most changes
are product copy and its evidence documentation; two small component changes
expose the release/study content and repair tutorial destination scrolling.

## Verification

- Node v24.10.0 matches `.nvmrc` major 24; nvm is unavailable. Existing dependencies
  were reused, with no install or lockfile change.
- `npm run check`: passes strict TypeScript and ESLint, retaining one existing
  warning about `window.location.assign` in the tutorial branch selector.
- Default `npm run build:next`: blocked by the documented Turbopack CSS subprocess
  socket permission failure, including one permission-enabled retry. The documented
  `npm run build:next -- --webpack` fallback passes. `npm run build` passes Vinext.
  Both builds and check were repeated successfully after the scrolling repair.
  Existing Browserslist age and Vinext static-classification notices remain.
- `npm audit --omit=dev`: zero vulnerabilities after allowing registry access.
- `git diff --check`: passes; final implementation diff reviewed.
- Content invariants: all 53 prior tutorial module/step hashes retained, four
  additions unique, ten modules preserved, exact www tutorial canonical unchanged,
  all tutorial media definitions and eight measurement entries unchanged, shared
  release status consistent, Privacy Policy content unchanged and no public asset diff.
- Browser: Sports, Motion, tutorial and Support checked at 320, 390, 768, 1024,
  1440 and 1920 CSS pixels. No horizontal overflow or clipped inspected text/link
  bounds; one H1 each; no browser warnings/errors. Desktop hero, tablet study and
  mobile family/tutorial screenshots inspected. Existing synthetic concepts and
  earlier-build screenshot disclosures remain clear.
- Interaction: new study link selects Explore History and focuses its step;
  complete-guide mode exposes ten modules and all added steps. After the repair,
  Reference Study remains visible on mobile; Compare, Share and existing History
  Dates deep links land visibly at 320/768/1440 widths. Keyboard activation and
  the existing solid 3px focus indicator pass. Reduced-motion handling was inspected
  in unchanged CSS; OS preference emulation was not performed.
- Local HTTP: home, Sports, Motion, tutorial, Support and Privacy return 200 with
  correct canonicals, one H1, protected footer links and image alt attributes.
  Internal fragment targets resolve; 31 rendered-image/original-image requests
  return 200. Protected Motion pages return 200 under both apex and www Host
  headers locally. This is not a new production deployment or public-host check.
- No-JavaScript HTML: all ten tutorial modules and the four added steps are
  present without hidden module/step attributes. Initial probe assumptions about
  a trailing root canonical slash and framework-level hidden markup were corrected
  after inspection; the actual canonical and module-level checks pass.
- Added public copy scanned/reviewed for private identifiers, credentials,
  development URLs, superseded branding and athlete/source-organization references.
  No new external destination, sensitive record or private artifact is published.
- Cleanup: owned preview stopped; temporary browser tab closed and viewport
  override reset. Standard ignored build output remains local. Available disk
  remains approximately 18 GiB. No iOS build, device operation or temporary Motion
  checkout was created; its original branch and untracked scratch file are intact.

## Repository state after implementation commit

Website `main`, clean after implementation commit. Preflight had four existing
commits ahead of origin with no working-tree changes; fast-forward pull succeeded.
The implementation leaves main five commits ahead before the journal commit.
Existing commits were preserved, not amended or recreated. The normal push follows
the separate journal commit; no feature branch, worktree, merge or PR was created.

## Implementation commits

- `08c95753133c8cf943dc30c0919138c56bb67cd3` — Refresh Sports and Motion for v1.2

## Archive commit

`Record the Sports and Motion v1.2 refresh journal`

## Lessons learned

Use the release branch's current distribution ledger for release truth and the
future-development branch for roadmap implementation. Date old evidence explicitly.
A focused browser check must verify that a deep-link destination is on screen,
not merely that its hash and focus are correct. Keep old image URLs and product
resource links stable while updating explanatory text.

## Follow-up ideas

Deploy through the existing release workflow only on an explicit publication
request. Change public availability or offer beta access only when new release
evidence and authorization support it.
