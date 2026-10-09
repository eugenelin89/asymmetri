# Motion product marketing source review

Historical baseline reviewed September 16, 2026 for the website's homepage evolution and `/motion`.
This is an internal claims/provenance record, not a public paper or scientific
validation. No reference repository was modified, built, configured or released.


## Current authority, October 8, 2026: longitudinal product story

Governing philosophy: **Measure changes. Preserve the evidence. Investigate
relationships. Humans interpret.** The website teaches repeat use of the existing
projected 2D measurements; it does not claim validated repeatability, causal
performance effects, good/bad mechanics or coaching prescriptions.

Read-only source review fetched Motion `origin/main` at
`56c88a07ccda6360db241c00049da8781c109ef8` and `origin/release/1.2` at
`571ee24b98bba4314d33c68733dc25ead1f9aa1a`. The older local main checkout and its
unrelated scratch file were preserved. Accepted Motion **1.2 (2)** binary source
remains `8a2f5e57836ee9ca981ef70fcc0845d3b38e13fd`. Neither fetched ref changes the
iOS runtime tree from that candidate. The October 8 release installation ledger
records a development-signed in-place install, not TestFlight or App Store release;
distribution remains pending. Website status stays **Preparing for release**.

Reviewed the documentation map, current Project Context/Product Understanding,
V1.2 plan/readiness and candidate/distribution/Explorer validation records,
Decision Index, Decisions 50, 70, 77 and 87, and newer 88/89 roadmap context.
Decision 89 concerns future Dual View, not measurement renaming; this website
change adds no Dual View claims. No later accepted baseball-first presentation
or release-scope revision was found. Decision 77 remains the latest relevant
measurement-presentation decision, explicitly future and outside frozen V1.2.

### Mandatory terminology gate

Paths below are in the Motion repository under
`ios/AsymmetriMotion/AsymmetriMotion/`. Source evidence is shared by fetched main,
release/1.2 and the accepted binary's unchanged runtime tree.

| Public term | Motion source evidence | Current / future | Safe to publish as current? |
| --- | --- | --- | --- |
| Stride Length | `Features/Settings/MeasurementInformation.swift`, `Features/VideoPlayer/PitchAnalysisResultsView.swift`, `Models/ExplorerQuery.swift` still use ankle-span ratio; no accepted rename | Proposed name unaccepted; ratio is current | No. Publish **2D FFC Ankle-Span Ratio**, not physical stride distance or body-height percentage |
| Front Leg Block at FFC | Same definition/results files use **2D Lead-Knee Bend Angle**, FFC endpoint | Proposed name unaccepted; knee result is current | No. Publish current knee-bend name; no blocking-force/energy-transfer claim |
| Front Leg Block at Ball Release | Same files, separate Ball Release endpoint | Proposed name unaccepted; knee result is current | No. Keep separate current knee-bend result; no dynamic/continuous movement claim |
| Trunk Tilt at FFC | Decision 77; `Models/ExplorerQuery.swift:requiresDeveloperMode` retains Side FFC trunk gate | Future normal presentation; existing Developer-only science | No. Do not add a normal Side trunk card |
| Trunk Tilt at Ball Release | Decision 77; separate Side Ball Release trunk gate | Future normal presentation; existing Developer-only science | No. Do not merge/promote either endpoint |
| 2D Lateral Trunk Lean | Decision 77 future Back rename; current `MeasurementInformation.swift` uses **2D Trunk-Segment Orientation** | Future presentation | No. Publish current Back name at FFC |

`MeasurementInformation.definitions` contains the six normal results.
`ExplorerCoordinator.visibleMetrics` filters Developer-only results;
`PitchReviewMeasurement.publicMetrics` applies the same boundary to sharing.
The website's shared `motionMeasurements` inventory feeds both `/motion` and the
tutorial's Back/Side lists to prevent naming drift. Its two knee-bend results
remain separate event observations. Back shoulder/wrist orientation is not Arm Slot;
Shoulder–Hip Line Angle remains outside normal visibility and is not renamed to
3D hip–shoulder separation.

The actual help destination in `Features/Settings/SettingsView.swift` is
**Settings → About → Measurements**, not “Measurement Definitions.” Teach the
implemented control label while describing its purpose as technical definitions.

### History and context authority

Decision 70, the V1.1-03 Outcome-Aware Explorer ledger and current context/query/UI
source support manual Velocity with provenance, chart-relative Pitch Location,
Pitch Type and Pitch Result alongside exact observations in Chart/Table/A/B,
context filters and descriptive two-period questions. Inspect a contributing pitch
before assigning individual context to an aggregate. Do not imply automatic
velocity/outcome detection, causation or scientific longitudinal validation.
Existing evidence recovery/currentness rules remain; unavailable sources/evidence
are explicit. Reference Study and Compare retain their V1.2 claims after the main
personal-history story. Planned Hitting inherits the philosophy without an invented
measurement inventory.

### Website change and rollback

Before editing, website local main/origin/main and healthy production matched
`9d7022e02d5901bd6a1646e6590c3f738123e89d`. Existing annotated immutable tag
`website-minimal-homepage-2026-10-08` already identifies this exact live state;
its remote peeled target was verified and it is reused as the rollback marker.
Service and loopback were healthy, and Motion/tutorial/Sports/privacy/support
returned 200 on apex and www. No replacement or moved rollback tag is needed.

The update changes story, grouped text and metadata only: hero, one pitch →
repetition → history, the eight-step loop, evidence, three levels of comparison,
mechanics plus recorded context, and human interpretation. All public asset bytes,
video loading, routes, tutorial legacy IDs/originals, exact www canonical and utility
policy/support bodies remain unchanged. Validation and final source/build identity
are recorded in the prompt journal and external release receipt. The dated reviews
below remain historical provenance, superseded by this section where noted.

### Local verification, October 8

Node 24.10.0 matches `.nvmrc` (nvm unavailable). Exact-lockfile `npm ci`,
`npm run check`, `npm run build:next`, `npm run build` and `git diff --check` pass.
The unchanged tutorial reader retains one ESLint warning about its hash-only
`window.location.assign`; Vinext retains its unknown route-classification notice.
No dependency/configuration change or `npm audit fix` was made.

`npm audit --omit=dev` is **not clean**: one high-severity dependency entry for
Next.js 16.3.6, aggregating six advisories. The highest-severity
[remote-image SSRF advisory](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4)
requires remote image allow-listing; this repository has no `images.remotePatterns`.
The other cache/Draft Mode/development/metadata advisories remain reported; this
content task does not certify their mitigation or upgrade the unchanged framework.
Dependency remediation is separate from the product-story release.

Browser/DOM checks cover Motion and the tutorial at 320, 390, 768, 1024, 1440 and
1920 effective CSS pixels without overflow/clipped text. Rendered review includes
hero, event groups, performance, Start, Analyze and Explore History. Ten-module
navigation, deep links, Back/Forward, Previous/Next, radio-keyboard controls,
complete-guide mode and visible 3px focus pass. No app console errors appeared.
Reduced-motion and print/no-JavaScript behavior were verified in retained source
and server HTML; OS preference emulation and a full assistive-technology audit
were not performed.

HTTP checks pass for Motion/tutorial/Sports/privacy/support, their canonical values,
footer/context links, anchors, image alt text and 31 image URLs. All prior tutorial
IDs, original-image paths, public asset bytes and utility content remain unchanged.
Pre-activation DOM/source contains no player or remote media resource; deliberate
Load uses the approved no-autoplay privacy-enhanced iframe, and Close restores focus.
Native video playback quality was not retested. Changed public-copy scans exclude
future metric labels, private source paths, credentials and prohibited references.

## Current authority, October 7, 2026

See [company architecture/source review](COMPANY_ARCHITECTURE_2026-10-07.md) for
fetched Motion `83058e5`, V1.2 candidate/distribution truth and Decision 88.
The dated review below remains provenance for retained capabilities/imagery.
Its exclusions of manually entered context and Reference/Compare are superseded
by the accepted V1.2 implementation. Pitching remains preparing for release;
Hitting and the one Cloud-backed Team app are planned. No reference-subject science,
public availability, launch date, price or developer-only metric is promoted.

## Authority and current sources

Current inspectable implementation/tests precede accepted decisions, current
Product Understanding/Project Context/release material, roadmaps, the September 10
Revision 4.0 English white paper, then historical publications. The local Motion
reference's main ref was `c74cfaa30c17a6c4be96502205e6e8a653faf782`; the read-only
GitHub connector returned the earlier `314783401897c73fdb7c20a60e6ce3030b92e053`
for main and did not resolve the newer local commit. No claim of remote
synchronization is made. Current local implementation and accepted decisions
establish the marketed capabilities; the difference concerns later public-link
preparation, not a public Store launch.

Reviewed source corpus:

- `Asymmetri_Motion_Project_Context.md`, `docs/product/PRODUCT_UNDERSTANDING.md`,
  `FIRST_RELEASE_ROADMAP.md`, `MOTION_VOCABULARY.md` and relevant current sections
  of `MONETIZATION_AND_ENTITLEMENT_STRATEGY.md`;
- `docs/whitepapers/README.md` and the full September 10 English product white
  paper, Revision 4.0;
- accepted Decisions 48 (capture/setups), 50 (normal measurement visibility),
  51 (approved identity/iPhone family), with current 39/40/47/49 outcomes summarized
  in the current product/acceptance documents;
- `docs/product/MEASUREMENT_HISTORY_DEVELOPER_VISIBILITY.md`;
- `docs/design/v1-visual/README.md`, release-brand README and original assets;
- the September 10 See Your Pitch marketing README, Store metadata draft,
  screenshot plan, owner-decision packet and Privacy Audit;
- accepted published website Privacy/Support content and existing website audit.

Implementation spot checks covered `ExplorerQuery.requiresDeveloperMode`,
`ExplorerCoordinator.visibleMetrics`, Results presentation, native iPhone family
and iOS minimum in project settings, `PitchCaptureView`, `RecordingSetupView`,
camera capability errors, the on-device `AppleVisionPoseProvider`, and release
icon source/package identity. Existing acceptance evidence was read, not rerun;
this task validates the website, not the iOS app.

## Material differences from September 10

| Dated paper state | Current evidence | Website decision |
| --- | --- | --- |
| Guided Capture/Recording Setups deferred | Decision 48 and current context report implemented/accepted Back/Side guidance and local optional setups | Describe reuse of view/guide choices; no calibration or improved accuracy promise |
| All eleven stored families normally visible | Decision 50 and code filter five to Developer-only; six normal choices, three Back and three Side results | Say available projected 2D measurements; publish no metric count or restricted example |
| Exact-frame usability still pending | Fine adjustment and live gesture preview are accepted at bounded scopes | Explain scrub, fine-adjust and human confirmation; no automatic event detection |
| Broad iOS-first framing | Decision 51 targets native iPhone, iOS 17; final A Release icon approved | Explicit iPhone/iOS 17; no native iPad claim |
| Polish/hardening still ahead | Current context closes bounded hardening/capture/visual sprint; release preparation remains open | Preparing for release; no Store badge, download CTA, candidate-readiness or listing claim |
| Public utility pages pending in early preparation | Current local links and website utility pages exist | Link to existing `/privacy` and `/support`; preserve audited bodies |

Some older checkpoint paragraphs in current documents retain historical all-eleven
or deferred-capture language. Their newer accepted decisions and implementation
take precedence; the historical documents are not rewritten by this website task.

## Public claims and boundaries

| Marketing subject | Basis and public limit |
| --- | --- |
| Record/import | Supported rear-camera 240/120 fps modes, or Photos import. Hardware availability remains conditional. |
| Back/Side guidance | Actual framing guides and optional Recording Setups. Setup choices do not prove physical camera equivalence. |
| Marking | Human-confirmed Front Foot Contact, Ball Release and Side Setup Reference; exact frame and fine adjustment. |
| Analysis | View/input/landmark-dependent projected 2D geometry; Apple Vision on device. User-directed Pitcher Selection for ambiguity is not identity recognition. |
| Evidence | Saved annotated frames/landmarks/reference geometry; Save to Photos and system Share. No invented measurements in website visuals. |
| History | My Pitches, Explore, exact marked-frame review, supported measurement history/A/B and Saved Views. Differences are descriptive, not improvement or causal proof. |
| Local-first | No account; local records and optional profile; no app-owned analytics/tracking/advertising or Asymmetri upload/sync. Photos/iCloud/backups/sharing remain separate. |
| Release | Preparation remains open, with owner/account/media and acceptance work ahead. No verified public listing. No pricing fact is established. |

Normal inventory checked internally: Back trunk orientation at Front Foot Contact,
shoulder-upper-arm angle at Ball Release, shoulder-wrist orientation at Ball
Release; Side ankle-span ratio and lead-knee bend at Front Foot Contact/Ball
Release. The page does not enumerate these because the evidence relationship is
more useful and durable than a large numerical inventory.

Deliberately excluded: the five restricted measurements, automatic marking,
anatomical 3D/laboratory accuracy, velocity/location/outcomes, mechanics scores,
injury prediction, medical assessment, coaching recommendations, AI/Online Coach,
Cloud/accounts, team/multi-athlete workflows, companion cameras, whole-delivery
replay, final pricing, Store availability and private organization identities.

## Narrative translation and asset choice

“Keep more than the clip” translates the paper's disposable-video problem.
“From the number back to the pitch” translates exact observation/provenance into
a customer benefit. The semantic evidence list joins video, frame, human mark,
projected measurement, annotated evidence and history. The long-view section
connects a difference back to its actual pitches without implying improvement.
Scientific restraint and the human coaching principle are part of the product
story, not a hidden disclaimer.

The original product introduction used the approved A Release icon. The owner's
subsequent artwork refresh adopts Decision 52's pitcher-family default icon from
source snapshot `cd414dbb0d4eef913fa4058e629e7afaa23be68a`, superseding Decision
51's artwork choice only. Its packaged PNG is generated raster illustration,
not hand-authored vector geometry. The company photograph remains unchanged.
The screenshot audit did not establish a suitable current marketing capture;
generated engineering media and older tutorials are not automatically approved
product screenshots. Private retained-device media stays out. The asset manifest
records exact source paths, dimensions, processing, hashes and rights assessment.
No white paper, private repository link or internal decision appears in public UI.

## Maintenance

Recheck current implementation, accepted decisions and release state before
changing capabilities. A public Store CTA requires a verified listing and final
release facts. Any future public white paper needs a refreshed, approved artifact.
Keep utility policies audited separately; marketing changes do not justify
rewriting their substantive disclosures. No analytics, forms, accounts or new
dependency belongs to this content change.

## Website validation

Local runtime: Node 24.10.0 matches `.nvmrc`; nvm is unavailable. `npm ci`,
`npm run check`, `npm run build:next`, `npm run build` and `git diff --check`
pass. The retained Vinext route classifier reports unknown static/dynamic status,
its existing build limitation; both build outputs include `/motion`.

The standard Next.js production server returned 200 for all four content routes,
robots/sitemap and referenced assets. All internal links/anchors, six legacy 308
redirects, page titles, descriptions, canonical origins, Open Graph/Twitter and
product JSON-LD were checked. No Set-Cookie header, external script or form was
found. No application browser-storage/tracking code was introduced.

Browser DOM checks passed on all four routes at 320, 390, 768, 1024 and 1440 CSS
pixels: no horizontal overflow, one H1 each, no missing alt text or broken image.
Rendered review covered company/product heroes, the homepage introduction,
workflow/evidence/trust sections and utility articles across phone/tablet/desktop.
Keyboard checks verified skip-link focus and the product workflow link. The focus
ring now exceeds 4:1 on both white and ink. Motion teal/mineral text is 5.48:1,
primary product text 12.93:1. CSS review confirms reduced-motion disables smooth
scrolling, transitions and hover translation. No browser runtime errors appeared;
a development-only Fast Refresh warning does not occur in production review.
This is bounded browser/source verification, not a full assistive-technology audit.

Privacy/prohibited-reference scans of served source passed for private identifiers,
source-repository references, credentials, restricted normal-mode claims, internal
pricing, unsupported launch claims, tracking/form/storage code and public em/en
dashes. The audited utility bodies/renderer, original photograph and dependency
manifests remain byte-identical to baseline.

`npm audit --omit=dev` still reports four findings in the unchanged dependency
graph: Next.js critical, sharp high, nanoid high and baseline-browser-mapping
moderate. No automatic fix or dependency upgrade was run. This is not a clean
security audit; the existing website privacy audit records the known input-path
limitations. Dependency remediation remains a separate task.


## Tutorial extension, September 16, 2026

The subsequent tutorial request authorizes current retained pitching media in genuine
app captures and reads Motion snapshot `411238a2eaf82f60c7a229dfbb3d5ee7a5f6d6b7`.
Its purpose requires naming the six normal results and teaching the full normal
workflow, while retaining the interpretation limits above. It does not change the
marketing page's concise measurement treatment or release availability. See
`TUTORIAL_REVIEW.md` for the complete feature/visual matrix and exclusions.
