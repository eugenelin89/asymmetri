# Prompt 019: Comprehensive interactive Motion tutorial

- Date: 2026-09-16 (verification continued September 17 UTC)
- Scope: design
- Goal: Publish a source-grounded, responsive normal-V1 tutorial with authentic app screenshots and honest physical-workflow illustrations.

## Original user request

> ASYMMETRI.CO — BUILD A COMPREHENSIVE INTERACTIVE ASYMMETRI MOTION TUTORIAL

The large supplied request directs website-only implementation of `/tutorial`,
using the current Motion repository as a read-only source of truth. Audit current
source, accepted decisions, normal feature inventory, capture safety guidance,
design assets and historical tutorials before drafting. Inspect the existing site
and production architecture first; preserve its design and deployment boundaries.

Teach the complete normal V1 path through ten modules: Start, Record or Import,
Set Up the Pitch, Mark the Moments, Analyze, Inspect Evidence, Saved Pitches,
Explore History, Profile & Settings, and Troubleshooting. Include Record/Import
and Back/Side choices, exact manual marks, spatial Pitcher Selection, six normal
projected 2D results, evidence, descriptive history and comparison, profile history,
settings and help. Exclude developer workflows, hidden measurements, diagnostics,
engineering/release tools and unsupported scientific or commercial claims.

Use fresh iPhone Mirroring screenshots for safely reachable software states. The
owner expressly authorizes retained in-app pitching media for this tutorial.
Prefer read-only navigation, crop unrelated private/system content, preserve actual
UI and values, and document the actual preservation scope. Do not recreate physical
pitching activity merely to obtain screenshots. Instead create original, clearly
labelled teal/mineral physical setup illustrations with abstract phones and no fake
controls, results, calibration, values or ideal-mechanics implication. Inventory
every public asset, source, processing, dimensions, role and privacy/rights basis.

Implement module navigation, Previous/Next, counts, stable step/module hashes,
direct jumps, accessible touch/keyboard controls, complete-guide browsing and
essential no-JavaScript content. Keep choices ephemeral. Add contextual links from
Motion and Support, a footer Tutorial link, sitemap entry and the explicit www
canonical. Add no analytics, tracking, cookies, forms, accounts or database.

Validate five routes at 320, approximately 390, 768, 1024 and 1440 CSS pixels;
exercise interactions, keyboard/focus, no-JavaScript behavior, media fidelity,
privacy, claims, reduced-motion behavior, console, metadata, links and assets.
Run the repository checks, both applicable builds and privacy scans. Update affected
documentation, use the two-commit journal workflow, push main without force, then
deploy through the documented DigitalOcean process. Protect unexpected production
work, build before restart, verify health and live content, and do not alter
DNS/Nginx/TLS/OS/Node/firewall. Report source, assets, coverage, omissions, device
scope, verification, Git state and actual release result.

Follow-up instructions:

> Phone is locked and available

> feel free to import new videos if you have to

> the tutorial page should also be responive so that can be easily viewed on an iPhone.

After the documented production-runtime exception was presented:

> Deploy using existing Node 22

## Scope

Only the website repository changed. The existing company design, utility-page
renderer, privacy copy, brand assets, product release truth state, dependencies,
lockfile and Vinext/Worker packaging remain intact. Current source overrides old
tutorial wording. No extra video import or physical recording was needed.

## Decisions

- Keep tutorial copy, normal product facts, media descriptors and external URLs in
  `content/site.ts`. Compose semantic server-rendered panels in the route; a small
  client reader handles hashes and in-memory choices.
- Render all content in server HTML. Hydration enables one-module reading and
  branch filtering; complete-guide mode exposes every path. Exact step links
  reveal their branch and move focus to the destination.
- Use a compact two-column module index and single-column reading on phones,
  fluid imagery, 16px body text and at least 44px tutorial targets. Wider screens
  use a sticky index and editorial text/image layout.
- Publish 20 original-pixel screenshot crops, two ImageGen physical setup images
  and two authored SVG diagrams. Clearly distinguish App screenshot from
  Instructional illustration and offer original images in a new tab.
- Do not capture private Athlete Profile fields or mutate pitches to obtain
  extra screenshots. Explain all normal capabilities in prose; document omitted
  visual states explicitly. No fabricated substitute UI.
- Keep interpretation descriptive and projected 2D. Do not imply anatomical 3D,
  reliable automatic event detection, verified identity, ideal mechanics, injury
  prediction, calibration or scientific validation of improvement.
- Record the owner-approved, deployment-specific Node 22.23.1 exception. Local
  validation remains Node 24.10.0; production must pass checks/build before restart.

## Implementation

The tutorial has ten modules and 38 steps. It covers recording and saved Recording
Setups, orientation/framing, conditional HFR, import/permissions/iCloud/duplicates,
pitch inputs, Side Setup Reference, FFC and Ball Release, exact-sample controls,
Pitcher Selection, explicit analysis, six normal results, evidence export, saved
pitches and deletion, Explorer marked frames/A-B, measurements and representations,
all four Questions, filters/date windows/aggregation, Saved Views, profile defaults
and dated body history, settings/help and eight troubleshooting disclosures.

Twenty screenshots use the installed 1.0 (1) app and authorized retained footage,
principally September 14 IMG_8802/IMG_8801, with real August IMG_7330/IMG_7594 chart
and table observations. Only lossless cropping was applied. Private profile data,
system chrome, unrelated material and time-zone/location context were excluded.
No values, landmarks or UI were altered. Physical visuals are original instructional
assets, not app evidence. Full provenance and exact generation prompts are in
TUTORIAL_MEDIA.md and ASSET_MANIFEST.md.

## Engineering impact

No dependency, server state, API, analytics, persistent progress or data-collection
addition. The client component accepts server-rendered panels, allowing native
links and disclosures to work when scripts are unavailable. Existing focus and
reduced-motion tokens remain in force. Tutorial source and assets are delivered
through the same existing Next.js deployment; no infrastructure change is needed.

## Files changed

- New tutorial route and focused reader; appended tutorial styles; centralized
  structured copy and media; Motion/Support/footer links; sitemap inclusion.
- Twenty-four local public tutorial assets, approximately 2.2 MB total.
- Source/coverage review, capture/generation provenance and affected site documents.

## Documentation updated

README, site strategy, architecture, content guide, visual identity and testing
describe the new route, progressive enhancement, mobile behavior and visual-source
rule. The asset manifest records all 24 files and hashes. Product/privacy review
documents distinguish this expressly authorized tutorial use from the earlier
reconstruction policy. Deployment documentation adds tutorial verification and
the renewed runtime exception. TUTORIAL_REVIEW contains the preflight, inventory,
capture matrix, exclusions, preservation scope and detailed acceptance record.

## Git diff summary

Implementation totals: 42 files changed, 976 insertions and 25 deletions, including
22 binary image additions and two SVG additions. The work adds a dedicated tutorial
and its evidence/documentation, with small links and metadata changes to existing
pages. This record is excluded from those totals.

## Verification

- Exact lockfile install, `npm run check`, `npm run build:next`, retained
  `npm run build` and `git diff --check` passed on Node 24.10.0. Vinext retains its
  existing static/dynamic classification notice.
- `npm audit --omit=dev` still reports four existing findings: one critical, two
  high and one moderate. No dependency or lockfile change, and no automatic fix.
- Production-built HTTP checks passed for all five routes, internal links and
  hashes, original-media links, 24 assets, robots and five sitemap entries.
  Tutorial title/canonical are correct; 48 module/step IDs are unique.
- All five routes checked at 320/390/768/1024/1440 effective CSS widths: no horizontal
  overflow, one H1, useful alt text and no broken loaded images. Phone controls
  and text, tablet evidence and desktop layouts were visually reviewed.
- All ten module jumps, Previous/Next, Back/Forward, branch choices, deep links
  and focus, complete-guide mode, keyboard troubleshooting and original-image
  links passed. Fresh production-preview console checks have no errors.
- With scripts blocked by a temporary external verification proxy, all ten modules
  and 38 steps remain available; native navigation/disclosures work. Existing
  reduced-motion CSS was checked without changing the owner's OS preferences.
  This is bounded browser/source QA, not a complete VoiceOver or physical Safari audit.
- All final PNGs match their source crop pixels; dimensions and asset records
  match. Public content scans found no private identity/path/repository, restricted
  feature or tracking reference. Privacy copy is unchanged; Support only adds the
  authorized tutorial link. No external script, form or Set-Cookie header appeared.
- Motion remains clean and unchanged at
  `411238a2eaf82f60c7a229dfbb3d5ee7a5f6d6b7`.
- Mirroring used existing pitches, marks, results, evidence, Explorer, profile and
  Settings. Temporary Explorer selections and open/cancel sheets were used; the
  app returned to My Pitches. No Record/Import/Analyze/Set/Move/Clear/Delete,
  profile edit, Saved View creation, Photos save or Share action occurred. No
  forensic persistence comparison is claimed.
- Production preflight: clean main at the starting SHA, no divergence, active
  service, 1.6 GB disk free, about 513 MiB available RAM and 1.9 GiB free swap.
  Node 22.23.1 use is explicitly approved for this release. Deployment follows
  both commits and push; no deployment completion is claimed in this pre-push record.

## Repository state after implementation commit

Website main was clean after implementation commit
`f2109272ace8bf1ed42a1222d6681c58bb7c14f9`; origin/main remained at the starting
`f41d12c259344d907911c480a41454f778e2b627`, one implementation commit behind.
The journal is created separately, then both commits are pushed normally.

## Implementation commits

- `f2109272ace8bf1ed42a1222d6681c58bb7c14f9` — Build responsive interactive Motion tutorial with authentic media.

## Archive commit

`Record Motion tutorial engineering journal`

## Lessons learned

Retained media and read-only software navigation can teach a complete workflow
without manufacturing device states. Clearly labelled original physical diagrams
fill the real-world setup gap. Native server content plus a small interactive
reader keeps the same guide accessible on narrow phones and without JavaScript.

## Follow-up ideas

Optional future safe captures could add dedicated Side Setup/Results, Ball Release,
capture/import and Pitcher Selection views. Current prose covers those functions;
private Profile fields remain deliberately uncaptured. Existing dependency findings
need a separate reviewed remediation task. Physical Safari/VoiceOver testing remains
an additional accessibility check beyond the completed browser QA.
