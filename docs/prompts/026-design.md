# Prompt 026: Asymmetri Work and balanced domain navigation

- Date: 2026-09-28
- Scope: design
- Goal: Introduce Asymmetri Work alongside Sport, retain direct product access and deploy the verified change.

## Original user request

> On the top menu, I feel a little "imbalanced"... We have Products, and then Sport. But Asymmetri Motion can be going thru Sport. I am wondering, if I should add another level above Bot Squad, similar to Sport? What do you think we should call it?

The proposed direction was Asymmetri Work for software and coordinated AI, paired
with Asymmetri Sport. Shared navigation becomes Work, Sport, About and Contact;
the homepage retains its product portfolio. Both products remain directly reachable.
A distinct Work page explains individual capability, coordinated AI and human
judgment without repeating BotSquad's detailed product page.

> I like that. Proceed to implement in production.

During implementation:

> server is being audited and cleaned.

## Scope

Add the Work domain page, matching Work/Sport menus, direct product links, supporting
metadata/sitemap and current documentation. Preserve Motion's release resources,
all product facts, optional videos, the Sport story and public media. Deploy to the
existing DigitalOcean service after the separate server cleanup finishes.

## Decisions

- Use `/work` for a real domain page and remove only its former portfolio redirect.
  Keep `/#products` and the deeper historical platform redirect.
- Put overview and product links in matching native disclosures, so visitors can
  go directly to BotSquad or Motion without first visiting a domain page.
- Use native details/summary for keyboard and script-free navigation. A small client
  enhancement adds outside-pointer dismissal and Escape with focus restoration.
- Present Work's direction/coordination/review sequence as a design approach, with
  no invented performance, autonomy, adoption or product availability claims.
- Reuse typed BotSquad facts and the Labs social raster; add no dependencies or assets.
- Preserve Motion policy/support/tutorial/product routes and the actual www app URLs.
- Pause server changes when the owner reports a concurrent audit. Resume only after
  that task completes and capacity/serving-build checks are repeated.

## Implementation

The new Work page explains useful capability, connected context and human judgment,
then introduces BotSquad using existing product facts. Shared navigation now has
Work and Sport disclosures plus About and Contact. BotSquad links back to Work;
the homepage and footer expose the new domain. The company origin copy names both
Work and Sport. The nine canonical pages appear once in the sitemap.

## Engineering impact

The new page remains server-rendered. Navigation links and native disclosure
behavior are present before hydration; enhancement owns only dismissal/focus.
Panels fit the mobile viewport and summaries retain 44px targets. No storage,
analytics, remote media, backend or dependency change was introduced. Existing
server packaging and production service configuration remain in place.

## Files changed

- New Work route and navigation component; shared header, portfolio/BotSquad links,
  centralized content, restrained CSS, sitemap and one removed redirect.
- Current brand, architecture, content, visual, testing, asset and privacy documents.
- Deployment guidance generalizes route-changing staged releases and records the
  verified archive preparation without claiming the original rollback was removed.

## Documentation updated

AGENTS project purpose; README; Architecture; Brand Strategy; Content Guide;
Deployment; Portfolio Redesign; Site Strategy; Testing; Visual Identity; Asset
Manifest; and the current Website Privacy Audit extension. Historical journals
remain intact. Separate server-maintenance documentation belongs to prompt 025.

## Git diff summary

The feature commit changed 21 files, with 413 insertions and 68 deletions. A narrow
rollback-documentation follow-up changed one file, with four insertions and two
deletions. The feature commit also captured small concurrent README/Deployment
maintenance edits; these were preserved and acknowledged in prompt 025 rather than
rewriting another task's subsequently published history. This journal is excluded
from its own implementation summary.

## Verification

- Initial main was clean and the fast-forward pull succeeded.
- Local Node 24.10.0 matches `.nvmrc`; dependencies and lockfile are unchanged.
- Final TypeScript/ESLint, Next.js build, Vinext build and diff whitespace checks pass.
- Production dependency audit retains four baseline findings, not introduced or
  remediated here: one critical, two high and one moderate.
- Local production HTTP checks pass nine real pages, 38 assets, internal anchors,
  canonicals and nine unique sitemap entries. Four legacy redirects return their
  expected 308 destinations; `/work` returns 200 with its actual content.
- Browser checks cover nine pages at 320, 390, 768, 1024 and 1440 effective CSS
  pixels: one H1, no horizontal overflow and no missing image alt attributes.
- At 320px the menu panel stays between x=16 and x=304; summaries are 44px tall.
- Enter, Space, Tab, visible focus, exclusive menu opening, Escape/focus restoration
  and outside-pointer dismissal pass. Direct Motion and BotSquad links navigate
  successfully. With scripts blocked by a local test proxy, the native disclosure
  opens and its product link still works.
- Reduced-motion emulation yields auto scrolling and zero summary transition;
  the temporary setting is restored. No error appears in final normal-page logs.
- Structured before/after comparison confirms Motion, policy/support, tutorial/media,
  BotSquad facts, video IDs, concept gallery and Sport narrative exports are unchanged.
  Protected route files, all public assets and dependency files are unchanged.
- Source and built JavaScript scans find no old video ID, private filesystem path,
  secret material or prohibited private sports reference.
- An older inactive rollback was archived and compared against every original file,
  with gzip integrity and SHA-256 recorded. The original was never removed. The
  separate completed cleanup provided sufficient space and preserved both copies.
- Production staging/build/activation/live checks follow this pushed journal. This
  pre-release record does not claim those future checks have completed.

## Repository state after implementation commit

Main is at `99be2583043b7372b01f5100edeba970814cc9bb`, one commit ahead of the latest
observed origin/main. The feature and separate maintenance commits are already on
the shared branch. Prompt 025 records maintenance commits `b479fb7` and `8139861`.
No branch, worktree or PR was created. The current production source was still
`735bbb249f918110f312b922b7030d69511ba177` during preflight. Journal commit/push and
independent production staging follow.

## Implementation commits

- `973f92e311dc612df2d080eaa332172582dc43d9` — feat: introduce Asymmetri Work and balanced domain navigation.
- `99be2583043b7372b01f5100edeba970814cc9bb` — docs: clarify rollback preservation after server cleanup.

## Archive commit

`docs: journal Work domain navigation and production release`

## Lessons learned

Pair domains at the same navigation level while keeping product access direct.
Native disclosures provide a resilient base for small enhancements. Concurrent
tasks in one checkout can change shared documentation between inspection and
staging; inspect exact staged hunks and coordinate commit timing. Never rewrite
another task's commits to repair that overlap. Recheck production capacity and
source identity after concurrent maintenance instead of relying on stale preflight.

## Follow-up ideas

Future Work products can reuse this domain structure when supported by actual
implementation. Dependency remediation remains separate reviewed maintenance.
