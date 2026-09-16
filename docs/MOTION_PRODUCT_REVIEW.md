# Motion product marketing source review

Reviewed September 16, 2026 for the website's homepage evolution and `/motion`.
This is an internal claims/provenance record, not a public paper or scientific
validation. No reference repository was modified, built, configured or released.

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

Use only the original approved A Release icon and unchanged company photograph.
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
