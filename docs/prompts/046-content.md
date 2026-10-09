# Prompt 046: Motion longitudinal tracking story and tutorial

- Date: 2026-10-08
- Scope: content
- Goal: Make Motion's repeated-measurement, history, context and evidence purpose clear, then validate and deploy it.

## Original user request

> ASYMMETRI MOTION WEBSITE + TUTORIAL — TRACK WHAT CHANGES
>
> Update, validate, commit, deploy, and verify the Asymmetri Motion public website and tutorial.
>
> Implement and deploy the product-story improvements now. Publish baseball-first metric names only when the current Motion source proves they are accepted normal-user terminology.

The supplied brief directs a focused product-story/tutorial clarification, not a
site redesign: lead with Measure / Track / Compare / Learn; explain one pitch,
repetition, history, changes alongside manual performance context and return to
exact evidence; retain human interpretation and correlation-versus-causation limits.
Review current website/live state and current Motion main/release/decisions before
editing. Preserve Graphite + Teal, navigation, family, imagery, video privacy,
protected routes, exact tutorial canonical, legacy hashes and original images.
Group measurements by event only under accepted normal-user terminology. Retain
Reference Study/Compare after personal history. Hitting inherits philosophy without
invented domain metrics. Add conceptual teaching within the existing ten tutorial
modules, update metadata/current docs, run all requested validation, use the normal
two-commit main workflow, deploy through approved SSH after a successful staged
build, verify production and create an immutable post-release tag. Reuse an existing
immutable exact-production rollback tag if available. Report source SHAs, the six-name
gate, validation, commits and production health. No attachment path or generated
attachment filename is retained.

## Scope

Website copy, two small server-rendered sections, scoped CSS, shared measurement
inventory, tutorial content and current documentation. The Motion repository is
read-only apart from fetching refs; its older checkout and unrelated scratch are
preserved. No iOS implementation, new measurement, Hitting inventory, cloud/Dual
View/Mechanics Lab claim, new media, dependency/configuration, route or policy change.

## Decisions

- Clean website main, remote and production started at `9d7022e02d5901bd6a1646e6590c3f738123e89d`.
  Reuse verified annotated `website-minimal-homepage-2026-10-08` as the immutable
  pre-change rollback marker; its remote peeled target matches the healthy live SHA.
- Motion fetched main `56c88a07ccda6360db241c00049da8781c109ef8`, release/1.2
  `571ee24b98bba4314d33c68733dc25ead1f9aa1a`, accepted 1.2 (2) binary
  `8a2f5e57836ee9ca981ef70fcc0845d3b38e13fd`. Rechecked immediately before commit;
  both runtime trees remain identical to the candidate. Distribution remains pending.
- Decision 77 remains the latest relevant measurement-presentation decision.
  Decision 89 adds future Dual View roadmap work, not a naming/release-scope revision.
  Stride Length, both Front Leg Block names, both Side Trunk Tilt names and Back
  2D Lateral Trunk Lean are all deferred. Publish the six current technical names;
  keep the two knee observations separate and Side trunk Developer-only.
- Use the implemented help label **Settings → About → Measurements**. Share
  `motionMeasurements` between the page and tutorial lists so terminology cannot drift.
- Manual type/velocity/location/result belongs beside exact observations. Context
  is not inferred from video, and a relationship does not establish causation.
  Source/mark/pose uncertainty and unavailable evidence remain explicit.
- Keep the eight-step practical loop, existing evidence chain and three levels of
  history comparison. Preserve Reference Study, Compare and sharing claims.
- Production has limited space. Its 52 MB serving build and 8.4 MB tracked source
  fit the documented unchanged-dependency staged method with hard-linked dependencies.
  Do not install into linked trees or remove older releases. Check capacity again
  before staging and retain source/Git metadata/previous build for recovery.

## Implementation

The hero now leads with Measure. Track. Compare. Learn. and a direct human-judgment
line. Track what changes explains one observation, repetition and history.
What Motion tracks groups accepted results by view/event. Workflow includes history,
comparison, context, evidence and learning. From one pitch to a pattern teaches
pair/history/period comparisons. Mechanics + performance gives supported questions
and one concise causation boundary. Limits lead with measurements and evidence.

Tutorial Start teaches why to repeat the workflow; Analyze adds what to track;
Saved Pitches adds Pitch Context; Explore History adds repeated-measurement questions
and context/evidence investigation. Ten modules and all previous IDs remain, with
five new subordinate steps. Metadata reflects the longitudinal purpose.

## Engineering impact

Small server-rendered content/layout changes. Shared typed content remains in
`content/site.ts`; the tutorial reader and video component are unchanged. No added
JavaScript dependency, tracking, account, storage, API or external resource. All
public asset bytes, utility-page bodies and route configuration are unchanged.
Existing responsive tokens, semantics and focus styles are reused.

## Files changed

- Motion page and global CSS: grouped measurement and performance sections,
  hero philosophy, existing editorial layouts and responsive measurement columns.
- Shared site content: story, event inventory, planned Hitting philosophy,
  tutorial additions and route metadata.
- README and current product/content/strategy/architecture/testing/tutorial docs:
  durable narrative, source evidence, terminology gate and verification boundaries.

## Documentation updated

README, Architecture, Content Guide, Motion Product Review, Site Strategy, Testing
and Tutorial Review explain the final structure and source gate. No Asset Manifest
or Tutorial Media update is needed because no asset, source label, caption or
original-image path changed. Deployment procedures remain unchanged.

## Git diff summary

Implementation: 10 files changed, 374 insertions and 53 deletions. Most additions
are public explanatory copy and source/validation documentation. The prompt record
is excluded from its own implementation summary.

## Verification

- Node 24.10.0 satisfies `.nvmrc`; nvm unavailable. Exact-lockfile `npm ci` passes.
- `npm run check`: pass; one pre-existing hash-navigation ESLint warning.
- `npm run build:next`: pass for final source. `npm run build`: pass with existing
  Vinext unknown-classification notice. `git diff --check`: pass.
- `npm audit --omit=dev`: one high-severity Next.js dependency entry, six advisories.
  No automatic fix. Highest-severity remote-image SSRF prerequisite is absent
  (`images.remotePatterns` is not configured); remaining advisories are reported,
  not certified mitigated. Unchanged framework remediation is a separate follow-up.
- Browser/DOM at 320, 390, 768, 1024, 1440 and 1920 CSS pixels: no horizontal
  overflow or clipped text. Visual review covers hero, metric groups, performance,
  Start, Analyze and history. Ten modules, deep links, history Back/Forward,
  Previous/Next, complete-guide and keyboard radio controls pass; visible 3px focus.
- No app console errors. Video is absent before deliberate Load; approved
  privacy-enhanced iframe has no autoplay; Close removes it and restores focus.
  Native playback quality was not rerun. Reduced-motion/print/no-JavaScript paths
  were inspected in retained source/server HTML, not through OS emulation.
- Local five-route HTTP checks pass; one H1, exact canonicals, footer/context links,
  hashes, alt text and 31 image URLs. Existing tutorial IDs and originals retained.
  Utility content/media/config/dependency equality checks pass. Changed-copy scans
  exclude future metric labels, private paths, credentials and prohibited references.
- Pre-change production: clean main, service active, loopback and five public routes
  on apex/www return 200. Post-commit deployment/verification receipts and final tag
  will be stored outside tracked source to avoid self-referential release commits.

## Repository state after implementation commit

Main is one implementation commit ahead of origin/main; working tree is clean
before this journal is created. No unrelated website changes or additional
worktree/branch/PR exists. The journal is the second commit; both are pushed before
the authorized staged production build/activation.

## Implementation commits

- `cfe3434` — Reframe Motion around longitudinal mechanics tracking.

## Archive commit

`Record Motion tracking story source gate and validation journal`

## Lessons learned

Product purpose can become clearer without promoting planned app labels or
implying scientific validation. A current decision is not necessarily current
normal-user release behavior; verify visibility, definitions, results, history
and export against the accepted binary. Existing immutable exact-production tags
can serve as rollback markers without moving or duplicating them.

## Follow-up ideas

Separate dependency-security maintenance for the audit findings. Revisit the six
deferred labels only after accepted Motion implementation/release evidence, keeping
two event-specific trunk records distinct. No such follow-up is implemented here.
