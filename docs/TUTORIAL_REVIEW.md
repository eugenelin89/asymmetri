# Motion tutorial source and coverage review

Review date: September 16, 2026 (capture session continued into September 17 UTC).

## Preflight

Website: clean `main`, local and `origin/main` at
`f41d12c259344d907911c480a41454f778e2b627`; fast-forward pull succeeded.
Existing `/`, `/motion`, `/privacy`, `/support`, sitemap and robots were reviewed.
The local website and Motion page were inspected before editing. Production uses
DigitalOcean, Next.js on loopback port 3001, systemd and Nginx. Vinext/Worker
packaging remains separate. Local Node 24.10.0 matches `.nvmrc`; nvm is absent.

Read-only Motion snapshot: `411238a2eaf82f60c7a229dfbb3d5ee7a5f6d6b7`.
Current source and accepted decisions take priority over historical tutorials.
Reviewed Project Context; PRODUCT_UNDERSTANDING, FIRST_RELEASE_ROADMAP,
MOTION_VOCABULARY; Decisions 48, 50, 51 and current pitcher-family identity;
GuidedCaptureV1Plan; physical-device preservation documentation; V1 visual README;
current release/support and Store metadata; longitudinal-explorer tutorial;
capture/guide geometry, Guided review, subject-selection, profile, settings and
Explorer source. Installed app About reports 1.0 (1).

Mirroring initially required a locked phone. The owner confirmed availability
before the capture session. The owner separately permitted importing videos if
needed; retained material was sufficient and no import was performed.

## Normal feature inventory and visual plan

This checklist established the content scope before drafting. All rows are
covered in tutorial prose; visual omissions are deliberate, not missing features.

| Tutorial step / capability | Visual type | Source | Interaction needed | Privacy risk / handling |
| --- | --- | --- | --- | --- |
| My Pitches, acquisition entry, reopening | AUTHENTIC APP SCREENSHOT | Current retained app | Open library | Crop profile header; authorized pitching thumbnails only |
| Back / Side camera position, orientation, physical recording | GENERATED INSTRUCTIONAL ILLUSTRATION | Original ImageGen, current guidance and palette | None on device | Abstract screens, generic adult, no identity or fake app UI |
| Full body and framing guides | GENERATED INSTRUCTIONAL ILLUSTRATION | Original SVG from current CaptureGuide geometry | None | Label diagram; no calibration or values |
| Saved Recording Setups, HFR, permissions | NO IMAGE NEEDED | Current capture and setup source | None | No recording or device permission changes |
| Import, limited access, iCloud, duplicates | AUTHENTIC APP SCREENSHOT | Import button in current library | Open library only | Do not open unrelated Photos library |
| Camera View / Throwing Arm / Review Pitch Inputs | AUTHENTIC APP SCREENSHOT | Existing Pitch Details | Review navigation | No saved values changed |
| Setup Reference, FFC, Ball Release, exact controls | AUTHENTIC APP SCREENSHOT | Existing FFC mark | Go To saved sample | FFC demonstrates shared controls; no Set/Move used |
| Pitcher Selection, Edit/Clear | NO IMAGE NEEDED | Current selection source and decision | None | No ambiguous pitch needed, no region edited |
| Explicit analysis and six normal Results | AUTHENTIC APP SCREENSHOT | Existing current Back result | View Results | No Analyze run; no value invented or changed |
| Evidence, Save to Photos, Share | AUTHENTIC APP SCREENSHOT | Existing annotated image | Expand details | Authorized retained footage; no export/share invoked |
| Marked frames, A/B, original navigation | AUTHENTIC APP SCREENSHOT | Explorer | Temporary selection and navigation | Authorized retained pitching media only |
| Measurement chooser, Chart, Table, Evidence | AUTHENTIC APP SCREENSHOT | Explorer | Change representation | Real stored values retained; captions describe partial views |
| Questions, filters, dates, Saved Views | AUTHENTIC APP SCREENSHOT | Explorer | Open/cancel sheets | No persistent view saved; crop timezone/location context |
| Athlete Profile fields and dated history | NO IMAGE NEEDED | Current profile UI/source | View and dismiss | Real profile contains private details; no public capture |
| Settings, Privacy, Support, version | AUTHENTIC APP SCREENSHOT | Current Settings/About | Open and dismiss | Crop unrelated lower settings and system chrome |
| Troubleshooting and interpretation | NO IMAGE NEEDED | Current support/source | None | No deletion/reinstall instruction as routine remedy |

## Coverage and exclusions

Ten modules cover both Record/Import paths and Back/Side views, saved Recording
Setups, exact manual marking, spatial Pitcher Selection, six normal projected 2D
results, evidence export, saved observations, all four descriptive Explorer
questions, date/view/arm filters, all three representations, marked-frame A/B,
Saved Views, profile history and settings/help.

Decision 50 excludes Shoulder–Hip Line Angle, Side trunk endpoints, Side elbow
endpoints and developer comparisons from normal teaching. No Classic workflow,
event locator, debug fixture, engineering provenance, diagnostics, release tooling
or developer switch is exposed in the public tutorial.

No normal feature is intentionally omitted from prose. Dedicated screenshots of
Side Setup/Side Results/Ball Release, capture, Photos selection and Pitcher
Selection are omitted: the available safe FFC/Back/evidence captures teach shared
controls without changing marks, creating observations, drawing regions or showing
unrelated Photos. Athlete Profile has no screenshot because of private fields.
There is no fabricated substitute screen. Explorer Evidence uses the existing
annotated-image example and text rather than claiming a captured Evidence-tab state.

## Device interaction and preservation scope

Read-only navigation opened retained observations, existing saved FFC, Results,
evidence, Explorer, profile and Settings. Explorer A/B selections, representation
changes and open/cancel sheets were temporary. Returned to My Pitches; no Record,
Import, Analyze, Set, Move, Clear, Delete, profile editing, Save View, Photos export
or Share action was invoked. No newly created pitching footage or Photos side
effect was needed. No persistence byte comparison was performed: preservation is
based on the actual action scope, unchanged displayed saved state and repository
checks, not a claim of a forensic device audit.

## Verification and release

Completed verification and release observations are recorded in the implementation
journal. Asset-by-asset provenance, crop geometry and generation prompts are in
ASSET_MANIFEST.md and TUTORIAL_MEDIA.md. These documents are repository review
records, not public route content.


## Local acceptance

Node 24.10.0; exact lockfile install, TypeScript/ESLint, standard Next.js and retained
Vinext builds succeeded. Vinext reports its existing static/dynamic classification
limitation. The unchanged production audit has four findings: one critical, two
high and one moderate (Next.js, sharp, nanoid, baseline-browser-mapping). No
unrequested dependency remediation was applied.

Production-built HTTP checks cover five content routes, metadata, robots, sitemap,
all original media links and all 24 tutorial assets. All internal anchors resolve;
48 module/step IDs are unique. Privacy content is identical to baseline and Support
adds only the tutorial link. No Set-Cookie header, external script or form appears.
Final PNG pixels match the original lossless crops and every intrinsic dimension
matches the manifest. Public content scans found no private identity/path/repository,
restricted feature or tracking reference.

Browser checks at 320, 390, 768, 1024 and 1440 effective CSS pixels cover all five
routes: no horizontal overflow, one H1, useful alt text and no broken loaded image.
Visual review covers phone text/controls, tablet evidence and desktop setup/start.
All module jumps, Previous/Next, browser Back/Forward, step deep links with focus,
Record/Import and Back/Side, complete-guide mode, native troubleshooting keyboard
operation and original-image new-tab behavior pass. Focus is a visible 3px blue
outline; body text is 16px and tutorial controls have 44px minimum targets.
The existing reduced-motion CSS disables smooth scrolling/transitions/hover motion;
this is source verification, not a change to the owner's OS preference.

With scripts blocked by a temporary local verification proxy, all ten modules and
38 steps remain visible, both branches are present, and native module links and
troubleshooting disclosures work. The proxy is outside the repository and not part
of the deployed application. Fresh production-preview console checks have no errors.
A development-only transient prop mismatch during coordinated file edits and stale
preview after the dev-server switch were resolved before production verification.
This is bounded browser/source QA, not a full VoiceOver or physical Safari audit.

Production preflight found clean `main` at the website's starting SHA, no divergence,
a running service, 1.6 GB free disk, approximately 513 MiB available memory and
1.9 GiB free swap. The existing Node 22.23.1 runtime differs from `.nvmrc`; the
owner explicitly approved its use for this tutorial deployment per DEPLOYMENT.md,
requiring successful production checks/build before restart and no Node change. No
production source, dependency, configuration or service mutation preceded approval.
