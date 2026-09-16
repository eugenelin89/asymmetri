# Prompt 016: Introduce Asymmetri Motion

- Date: 2026-09-16
- Scope: design
- Goal: Evolve the existing Labs website into credible product marketing for Motion while preserving its identity and human coaching story.

## Original user request

> ASYMMETRI.CO — INTRODUCE ASYMMETRI MOTION AND EVOLVE THE WEBSITE INTO A PRODUCT MARKETING SITE

The detailed user request was supplied as a large attachment. Its complete
decision-oriented summary follows; no private attachment path or generated
filename is retained.

- Work only in the website repository. Treat the Motion repository as a read-only
  product reference, with no modifications, builds, configuration, releases or
  Git mutations there. Follow the website's main-branch/two-commit policy.
- Begin with branch/HEAD/remote/worktree preflight, current routes and deployment
  architecture, source differences, and a rendered local baseline before edits.
  Read the current website implementation and relevant brand/content/asset/
  architecture/testing/deployment guidance, plus Privacy, Support and metadata.
- Review the September 10 full English white paper and its index, current Motion
  Project Context, Product Understanding, First Release Roadmap, vocabulary,
  accepted decisions, V1 visual/release-brand material, existing marketing,
  Store metadata/screenshots, privacy/support/release and monetization context.
  Current implementation/tests and accepted decisions override dated narrative.
- Revalidate implemented Guided Capture/Recording Setups, Decision 50's five
  Developer-only measurements, native iPhone/iOS 17 scope and current release
  preparation. Do not advertise the historical all-eleven normal inventory.
- Preserve “Better evidence for better pitching,” the founder's human origin,
  authentic pitching photograph, Labs visual identity, coaching support principle
  and “Great coaching stays human. Better evidence makes it stronger.” This is
  an evolution, not a new design or generic SaaS landing page.
- Introduce Motion as the first real product. Use “See your pitch more clearly”
  and pitching video/projected 2D analysis for iPhone. Explain the useful gap
  between disposable slow-motion clips and laboratory systems without equating
  them. Make inspectable evidence the differentiator, not AI or a metric count.
- Homepage sequence: retained company hero with current support copy, substantial
  Motion introduction and Explore CTA, founder story with a product transition,
  current Capture / Understand / Improve, human-coaching close and contact/footer.
  Keep sensor experiments as founder history, outside current Motion features.
- Create `/motion` as the detailed product page. Include platform/release state,
  the everyday-video problem, a five-step record/import → mark → analyze → inspect
  → revisit workflow, a readable semantic evidence-chain diagram, saved history
  and supported comparisons, scientific limitations, bounded local-first privacy,
  roles for pitchers/coaches/parents, and a restrained release/contact CTA.
- Verify HFR hardware conditions, Photos import, Back/Side guides/setups, Camera
  View/Throwing Arm, human-confirmed Setup Reference/Front Foot Contact/Ball
  Release with fine adjustment, Pitcher Selection, projected 2D results, annotated
  evidence/Photos/share, My Pitches, optional profile, Explore/A/B/Saved Views.
  Do not turn every implementation fact into an unstable feature inventory.
- Explain camera/perspective and estimated-landmark limits, human marking and
  truthful unavailable results. No anatomical 3D, calibration/accuracy promises,
  medical/injury claims, mechanics scores, causal improvement or automatic coaching.
  Exclude Developer features and future velocity/outcome, Cloud/account/team,
  companion-camera, whole-delivery replay and AI/Online Coach ideas.
- State only source-backed local-first facts. No account, local app records and
  Apple Vision on-device do not mean data never leaves the phone. Photos, iCloud,
  backups and chosen sharing remain separate. Preserve audited utility content.
- Copy only approved A Release icon source/export with complete provenance. Audit
  interface media for rights, private data, current normal UI and fixture context.
  Prefer the icon and explanatory diagram if no screenshot clearly qualifies.
  Never copy private retained-device captures, athlete footage or identities.
- Preserve paper/near-black/white, restrained orange, system/Avenir typography,
  generous space, grids/dividers, accessible responsive behavior and minimal
  chrome. Nest restrained Motion teal/mineral cues inside the company identity.
  No fake dashboards, metrics, testimonials, logos, stock media or heavy animation.
- Centralize copy/facts/URLs, use server components and semantic HTML/CSS, avoid
  unnecessary JavaScript/dependencies, and use no public em/en dashes. Add no
  analytics, tracking, waitlist, email collection, forms, accounts or database.
- Keep the homepage company-focused; give Motion specific SEO/social metadata,
  accurate optional SoftwareApplication schema and a sitemap entry. Primary nav:
  Motion, Story, Approach, Get in touch. Keep utility links quiet in the footer.
  Do not expose private repositories or automatically publish the dated paper.
- Update affected current docs and their truth-state model: verified V1 capability,
  experimental scientific interpretation and future direction. Preserve historical
  prompt records. Record every public asset change and source boundary.
- Run npm ci, checks, Next.js and documented alternate production build, audit,
  diff/whitespace checks, all content/metadata routes, 320/390/768/1024/1440 layouts,
  keyboard/focus/headings/reduced-motion/contrast/assets/console/privacy checks.
  Report existing dependency findings; do not perform broad automatic upgrades.
- Proceed autonomously. Stop only for real safety/privacy/source/owner decisions
  or unexpected unrelated work. Commit implementation/docs, archive separately,
  push normally and deploy only through the existing DigitalOcean procedure.
- Deployment is explicitly authorized after validation/push. Inspect production,
  verify the exact commit and preserve unexpected changes. Build before restart;
  verify service and public HTTPS routes/metadata. Do not change infrastructure,
  Node, DNS, Nginx, certificates, packages or firewall. Request interactive console
  access only when needed. Report exact commits, checks, assets, claims, deployment
  and genuine remaining actions, without claiming success before live verification.

## Scope

Company/product content, `/motion`, shared navigation through content, assets,
metadata/sitemap, scoped CSS/accessibility and affected website documentation.
No product-app changes, data collection, backend, new dependency or hosting path.
Production deployment follows these commits and is reported separately after
actual verification; it has not happened at archive creation.

## Decisions

Preserved the hero, original image, first three founder paragraphs and closing
principle. The final story paragraph now arrives at Motion. The homepage adds one
product section; `/motion` carries the detail. Numbered workflow rows and a semantic
six-stage evidence list explain the product without a fake app UI or card wall.
Teal/mineral is limited to product presentation. Public release state is preparing
for release; no Store badge, price or measurement count is published.

Current accepted capture/visibility/device decisions override stale white-paper
and checkpoint paragraphs. Local source main ref was newer than the connector's
remote response; `MOTION_PRODUCT_REVIEW.md` records that limit without claiming
remote synchronization. The substantive marketed features are supported by
inspectable implementation and accepted decisions. No reference Git state changed.

## Implementation

Homepage sequence: hero, Motion introduction, Story, Approach, Contact. Product
sequence: hero/platform/status, video gap, workflow, evidence, history, limits,
local-first privacy, coaching close/release CTA. Added Motion to primary nav and
the sitemap. Added product canonical/social metadata and bounded SoftwareApplication
JSON-LD. Company metadata/social text now acknowledges Motion.

## Engineering impact

Server-rendered content only. Existing Next.js/DigitalOcean and Vinext packaging
remain intact. Added one small shared EvidenceChain component, typed product
content, SVG identity and identical packaged PNG for social consumers. No custom
client interaction. Keyboard review led to focusable main targets and a stronger
blue ring, plus removal of hover translation under reduced motion.

## Files changed

- Application: homepage, new Motion page, shared stylesheet, root metadata/sitemap,
  evidence list component and central content.
- Assets: approved Motion SVG/PNG copies and updated company social-preview text.
- Guidance: repository truth-state rule, README, site/brand/content/visual strategy,
  architecture, testing/deployment routes, asset manifest, privacy audit addendum
  and a dedicated product source/claims review.

## Documentation updated

Current docs now describe the implemented product separately from public release
availability and scientific interpretation. The source review preserves precedence,
normal visibility, exclusions, screenshot assessment and validation. Asset records
contain exact provenance, dimensions, hashes and rights context. Deployment docs
include the new route in health checks. Historical prompt records are untouched.

## Git diff summary

Implementation totals: **22 files changed, 1,224 insertions and 161 deletions**,
including a 33,571-byte PNG. Most additions are the product page/content/CSS and
source/claims documentation. The journal itself is excluded from these totals.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm unavailable. npm ci, check, build:next, build
  and diff whitespace checks pass. No new lint warnings.
- Local standard production server: four content routes plus sitemap/robots/assets
  return 200; internal links/anchors and six legacy 308 redirects pass. Titles,
  descriptions, canonicals, social fields and schema match visible content.
- All four pages at 320, 390, 768, 1024 and 1440: no overflow, one H1 each, complete
  alt attributes and no broken images. Visual review covers key marketing sections,
  diagrams and utility layouts; production browser has no runtime errors.
- Keyboard skip link and workflow navigation pass. Focus contrast exceeds 4:1 on
  white/ink; product teal/mineral text is 5.48:1. Reduced-motion CSS reviewed for
  smooth scrolling, transitions and transforms; no full screen-reader audit claimed.
- Privacy/prohibited-reference/credentials/tracking/public-dash scans pass. Original
  photograph, utility bodies/renderer, package manifest and lockfile are unchanged.
- Production dependency audit retains four known findings: one critical, two high,
  one moderate. No automatic fix. No iOS build or app acceptance was performed.

## Repository state after implementation commit

Branch `main`, implementation `08f9d094d9beae06ff4db71abaf7b1e515273bdd`.
Clean working tree before creating this record, one commit ahead of origin/main
at starting `a4e3ea607c49f1ed1e05b94eea8029b747d46917`. Fast-forward pull succeeded
before edits. No unrelated changes, branch/worktree or pull request.

## Implementation commits

- `08f9d094d9beae06ff4db71abaf7b1e515273bdd` — Introduce Asymmetri Motion product marketing.

## Archive commit

`Record Motion product marketing engineering journal`

## Lessons learned

Current product documents can contain valid historical checkpoints that disagree
with newer accepted decisions. Resolve the feature against code and current
policy rather than averaging the claims. An approved generic icon and semantic
explanation can be more honest and useful than an outdated or private screenshot.
Implemented capability, scientific interpretation and public availability are
three separate facts.

## Follow-up ideas

Replace preparation messaging with an App Store CTA once a real listing is
verified. A future public white paper needs a refreshed approved edition. Address
the existing dependency audit findings in their own tested change.
