# Prompt 033: Sports/Labs company architecture and production release

- Date: 2026-10-07
- Scope: design
- Goal: Publish the Asymmetri umbrella with peer Sports and Labs divisions, a truthful Motion family and current BotSquad positioning, with immutable before/after release evidence and safe rollback.

## Original user request

> ASYMMETRI.CO — COMPANY ARCHITECTURE REDESIGN + PRODUCTION DEPLOYMENT
>
> Implement it, validate it, commit it, push it, deploy it, tag it and verify production.

The owner supplied a detailed architecture and release brief. Decision-oriented
summary of the complete request:

- Work autonomously through implementation, validation, two commits, push and the
  existing DigitalOcean production deployment; a proposal alone is insufficient.
- Fetch website, Motion and BotSquad upstreams. Treat supplied SHA anchors as review
  references, preserve unrelated work and edit only the website repository.
- Before editing, inspect the actual live branch/source/build/worktree/remote and
  service health. Create, push and verify an immutable annotated tag on the exact
  healthy production commit. Never overwrite an existing tag.
- Replace the Labs → Work/Sport hierarchy with Asymmetri → Sports/Motion and
  Labs/BotSquad. This is branding, not a new legal entity. Use plural Sports.
- Evolve the existing visual identity and retain strong copy, authentic photography,
  founder story, product visuals, concepts, videos and privacy patterns. Explain
  the shared philosophy without inventing a common technical platform.
- Create real `/sports` and `/labs` division pages, simple Sports/Labs/About/Contact
  navigation and direct product links. Redirect `/sport` and `/work`; preserve
  useful historical fragments. Keep `/motion`, `/tutorial`, `/privacy`, `/support`
  functional on apex and www, with exact www tutorial canonical and original URLs.
- Read current Motion authority, especially Decision 88 and current release records.
  Model separate individual Pitching/Hitting applications and exactly one Team app
  with Pitching/Hitting/Baseball entitlements, shared account/organization/roster/
  Athlete identities/Cloud, finite storage and continuity on entitlement upgrade.
  Keep names/statuses centralized. Separate implemented candidate, active development
  and roadmap; no unsupported availability, prices or dates. Enterprise and deeper
  Mechanics Lab follow Hitting/Team. Preserve current pitching workflow/evidence/
  Notes/history/Reference Study/Compare/local data/scientific limitations.
- Read current BotSquad authority, Personal Operator decisions, validation and the
  investment/Ask planning documents. Describe an experimental open-source MIT
  self-hosted Labs project with persistent workers, tasks/conversations/groups,
  artifacts/review, operator control and current access. Reconcile stale mobile/web
  development promises. Do not advertise planned experiments as active products,
  public hosted SaaS, unlimited autonomy, perfect memory or guaranteed outcomes.
- Update About, typed content semantics, metadata/schema/canonicals/sitemap and
  relevant current documentation. Preserve historical records and privacy boundaries.
- Keep approved video IDs, first-party posters, deliberate loading, disclosure,
  privacy-enhanced embeds and external fallback. No stock assets, new font/UI library,
  tracking, backend, infrastructure redesign or unrequested product implementation.
- Run applicable checks, both builds, audit, diff checks and responsive/accessibility/
  privacy/link/route verification. Deploy through documented application-owner
  access; Node 22 has standing production approval. Inspect before synchronizing,
  preserve production-only changes and never reset/clean to force a match.
- Verify exact deployed SHA/build, service, loopback, HTTPS, routes/redirects, protected
  Motion URLs and logs. Create/push/verify a separate immutable release tag only after
  successful activation. Prove the old tag is fetchable and give an exact safe
  rollback procedure; retain failed-release evidence if rollback becomes necessary.
- Report baseline first, then source review, architecture, truthful products,
  preservation, actual validation, commits/tags, production state and remaining issues.

## Scope

Only website code, editable content, current documentation and existing social-image
sources/exports changed. Product repositories were read-only references. Existing
DigitalOcean deployment is explicitly authorized. Sites hosting, infrastructure,
product activation, dependencies and unrelated websites are outside scope.

## Decisions

The exact live source was clean `main` at
`679f3378701af6b04557c0bebff15120f21e3754`, equal to fetched origin/main. The running
build `wDUsxJLdjZbrqjgrftfuX` and prior publication records agreed. Service, loopback
and protected pages on both hosts passed before implementation.
`website-pre-architecture-redesign-2026-10-07` was annotated, pushed and remotely
peeled to that SHA at 17:46 UTC. Baseline malformed Server Action request errors
were recorded separately from ordinary-page health.

Motion upstream `83058e58c2f9e63133aff23b791760d8e2788331` confirms the accepted
V1.2 candidate, pending distribution and no public release. Hitting/Team have
accepted plans but no active implementation. Public states are Preparing for
release / Planned / Planned; the vocabulary also supports current and in-development
states when evidence changes. The internal October target is not published.

BotSquad upstream `968a0e2b8c96eb1f1bde397227f4fab8e4e30c76` confirms Personal
Operator daily reliability and the preferred private SSH-tunnel browser. Native
iOS/no-tunnel access is deferred. Investment and Ask remain unadvertised planning.
Website reviewed source is the exact baseline above; all three anchors remained
current when fetched. Detailed authority is in the company architecture record.

The two divisions are visible as peer links in the home hero. Sports evolves the
original photo/story/coaching page; Labs evolves useful software-work explanations
with an extensible project list. A server-rendered MotionFamily component uses one
central model on Sports and Motion. Nested entitlement rows make one Team app clear.

The route-changing release uses the documented complete isolated candidate. The old
source, dependencies, public files and build will be retained together. Source-level
rollback uses the immutable tag and staged deployment, or explicit revert commits
if restoring main; destructive resets were removed from the current runbook.

## Implementation

Implemented the Asymmetri lockup and organization/suborganization schema, peer
navigation, division pages, permanent compatibility redirects, updated About and
product affiliations, truthful family/statuses, study/review detail, BotSquad access
and experimental positioning, and matching metadata/social previews. Preserved
approved imagery, videos, concepts, scientific limits and utility continuity.

## Engineering impact

No dependency or runtime change. Main pages and family remain server components;
existing small client components provide disclosures, legacy fragments, tutorial
reading and deliberate video loading. No new persistence, forms, tracking or API.
Existing visual tokens, reduced-motion rules, keyboard focus, native details and
semantic document structure remain. App-support policy substance is preserved.

## Files changed

- Content and route composition: typed division/home/family/project data, nine
  canonical page compositions, sitemap, redirect rules and organization metadata.
- Shared visuals/navigation: company wordmark, real division link diagram, Motion
  family, scoped CSS and existing helper references.
- Social assets: three existing previews and their SVG sources; all original
  photography, Motion/tutorial assets, logo variants and favicon fallbacks retained.
- Current documentation and source-review/rollback decision record.

## Documentation updated

README, AGENTS purpose, architecture, content guide, brand/site strategy, visual
identity, asset manifest, testing and deployment now describe the owner-directed
hierarchy and release behavior. Added the dated company architecture/source review.
Marked prior portfolio/Motion review authority historical with current pointers.
CLI access and local commands remain accurate and unchanged. Historical journals
were not rewritten.

## Git diff summary

Implementation: **38 files changed, 1,123 insertions and 824 deletions**, including
three changed PNG exports. Most content churn is semantic relocation/renaming and
replacement of superseded current architecture documentation. The old Sports route
is detected as a rename; Work becomes Labs with an explicit redirect. This journal
is excluded from its own implementation diff summary.

## Verification

- Node v24.10.0 matches `.nvmrc` (24); nvm unavailable. `npm ci --no-fund` succeeded;
  package and lockfile unchanged.
- Final `npm run check`, `npm run build:next`, `npm run build` and `git diff --check`
  passed. Next's initial sandbox port restriction required the approved normal-host
  build. Stale generated route types were regenerated after route moves. Final
  build/check outputs are clean; Vinext's existing static-classification notice remains.
- `npm audit --omit=dev` **did not pass**: five inherited vulnerable package entries
  (one critical, three high, one moderate), unchanged dependency set. Next, Sharp,
  nanoid, source-map-js and baseline-browser-mapping require separate remediation.
  No automatic audit fix or deployment-time package changes.
- HTTP verification passed nine pages, six exact 308 redirects, all 39 discovered
  image/social/original URLs, titles/canonicals, nine unique sitemap entries, permissive
  robots, organization hierarchy schema, footer links and internal anchor targets.
  GitHub source/license, Google policy and both approved video URLs returned 200.
- Responsive DOM checks covered all nine routes at 320, 390, 768, 1024 and 1440 CSS
  pixels: no overflow, one H1, no missing alt or visible broken images. Reviewed
  desktop/mobile home and family, tablet family, Sports and Labs appearance.
- Enter/Space, Tab, Escape/focus restoration, exclusive disclosure and outside click
  passed. Skip link focuses main; controls measure 44 CSS pixels. New text color
  pairs exceed 4.5:1 (5.26–15.08 measured). Existing reduced-motion CSS inspected.
- Tutorial: all ten module links focus their destination; step deep link, complete
  guide (all ten), Next and browser Back/Forward passed. Data/module/step/original
  media comparisons are unchanged except title affiliation. Server HTML retains
  all content and native navigation; a separate JavaScript-disabled browser session
  and OS reduced-motion emulation were not run.
- Both exact approved privacy-enhanced players appear only after Load; no iframe,
  remote thumbnail/preconnect or external media element appears before Load. Native
  player controls/durations were observed; Close removes player and restores focus.
  Full uninterrupted playback and forced provider-block simulation were not certified.
- Root story/approach/product fragments migrate to Sports; product/contact homepage
  fragments remain. `/sport#story` and `/work` resolve correctly in the browser.
- Support data unchanged. Privacy has only three current umbrella-name substitutions;
  audited commitments/date unchanged. No forbidden old division names or secret-like
  strings found in current public source. Authentic image bytes unchanged. Browser
  error/warning log was empty during site checks.

Production staging/activation and the post-success tag follow this archive commit
and push. Actual running SHA/build ID, directory paths, public checks, tag targets
and rollback receipt are recorded outside source to avoid self-referential commits.
Do not interpret this pre-deployment journal as a claim that activation already ran.

## Repository state after implementation commit

Clean `main`, one commit ahead of origin/main at the baseline; no unrelated source
changes. Product working trees were not changed. The immutable baseline tag is
already on origin. This archive becomes the second commit, then both are pushed.

## Implementation commits

- `e9d84a369b09945f6e1f412342d3ebaeb852d894` — Restructure Asymmetri around Sports and Labs

## Archive commit

`Document Sports and Labs architecture release journal`

## Lessons learned

Brand structure, source acceptance and distribution availability are different
facts. Central names/statuses and one explicit Team model make upcoming product
work editable without another company redesign. A tag proves source identity;
a complete preserved build/dependency/public directory enables immediate rollback.

## Follow-up ideas

Remediate inherited dependency advisories with a separately reviewed compatibility
change. Update product states only when accepted implementation/distribution evidence
changes; future names, prices, storage allowances and dates remain undecided.
