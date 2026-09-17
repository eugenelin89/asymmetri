# Prompt 020: Replace dark tutorial screenshots

- Date: 2026-09-16 (September 17 UTC)
- Scope: design
- Goal: Replace the dark September 14 pitching examples with genuine, brighter August 27 app screenshots.

## Original user request

> hold on, I need you to make some changes. I see that you used screenshot from Sept 14 pitches. They are too dark. Can you scroll down in the app and use Aug 27 pitches for screenshots.

## Scope

Continue the authorized tutorial work with a bounded media replacement. Preserve
the guide's layout, interactions, product facts, privacy policy, dependencies,
illustrations and deployment architecture. Existing authorization covers retained
in-app pitching media, read-only Mirroring, Git push and DigitalOcean deployment.
The existing Node 22 exception remains applicable to this tutorial correction.

## Decisions

- Use brighter original footage instead of adjusting exposure or retouching UI.
- Use August 27 Back IMG_7594 for pitch inputs, marking, analysis and evidence;
  pair it with August 27 Side IMG_7595 for marked-frame comparisons.
- Keep stable public asset URLs. Update intrinsic heights for the two input-control
  crops and alt text for the actual new frame numbers, result and dates.
- Filter Explorer temporarily to August 27 so list/chooser/comparison examples
  contain the requested day's footage. Create no Saved View or app record.
- Preserve the eleven screenshots showing other controls or actual August history
  and all four original physical-workflow illustrations.

## Implementation

Nine lossless PNG crops replace camera-view, throwing-arm, mark-ffc, analyze,
results-back, evidence, marked-history, choose-b and comparison. The Back pitch
has existing FFC 1,212/1,643 and an existing 7° toward-image-left trunk result.
The Side comparison uses existing FFC 456. These values were observed and retained,
not edited or recalculated. The previous September 14 footage is absent from
public tutorial images. Raw captures remain outside the repository.

## Engineering impact

Media and matching descriptors only; no route, component, stylesheet, dependency,
tracking, persistent tutorial state or infrastructure change. Responsive rendering
and direct original-image links use the same implementation. Public assets grow
slightly because the brighter scene contains more image detail.

## Files changed

- Nine existing tutorial PNG files.
- Central media dimensions and alt text in `content/site.ts`.
- Four provenance, coverage and privacy documents.

## Documentation updated

ASSET_MANIFEST records new dimensions, exact crop rectangles, hashes and the
replacement rationale. TUTORIAL_MEDIA names the final retained media and preserves
the original illustration prompts. TUTORIAL_REVIEW records capture scope,
restoration and bounded follow-up validation. WEBSITE_PRIVACY_AUDIT records the
same-authorized-media replacement. The historical prompt 019 is unchanged.

## Git diff summary

Implementation totals: 14 files changed, 110 insertions and 34 deletions, including
nine binary PNG replacements. This journal is excluded from those totals.

## Verification

- Started with clean main at `e72b6a650c228caa83827813947bc7dbc3dba0d0`;
  `git pull --ff-only origin main` succeeded.
- Mirroring resumed with the library already at August 27. Reviewed existing
  inputs/results, used Go to saved Frame and opened saved annotated evidence.
  No input selection, mark edit, analysis, profile/pitch edit, import, recording,
  Saved View write, Photos export or share action occurred.
- Explorer used an ephemeral custom date window and A/B pair. Leaving and
  reopening confirmed All saved history, Frames and empty A/B selections. Returned
  to the August 27 library; three of three Back results remained current. No
  forensic device-file audit is claimed.
- Node 24.10.0 matches `.nvmrc`; nvm is absent. TypeScript/ESLint, standard Next.js
  build, retained Vinext build through the Sites build helper, and whitespace
  checks passed. The existing Vinext route-classification notice remains.
- `npm audit --omit=dev` still reports four existing findings: one critical,
  two high and one moderate. No package/lockfile change or automatic fix.
- All nine replacement PNGs exactly match raw screenshot crop pixels. All 24
  public tutorial assets match manifest hashes, intrinsic dimensions and alt text.
  Crops and their page presentation were visually reviewed for privacy and clarity.
- All five route, internal-link, anchor, original-image, asset, sitemap and robots
  HTTP checks passed. Server HTML still includes all ten modules without hidden
  attributes; no script/layout behavior changed. Rendered scans exclude stale
  September media identifiers, old frame/value descriptions, private paths,
  location/time-zone details and restricted developer references.
- Tutorial checks at effective 320/390/768/1024/1440 CSS widths passed with no
  overflow, missing alt text or broken loaded images. Desktop marking, phone
  evidence and tablet comparison were visually reviewed. Deep links/focus and
  module navigation work; browser error log is empty. A stale preview viewport
  override was resolved using an isolated temporary QA tab. No new physical
  Safari/VoiceOver coverage is claimed.
- Motion repository remains clean and unchanged at
  `411238a2eaf82f60c7a229dfbb3d5ee7a5f6d6b7`.
- Production preflight found clean main at the starting website SHA, an active
  service, Node 22.23.1, 1.6 GB free disk, approximately 546 MiB available memory
  and 1.9 GiB free swap. Deployment follows both commits and push, with production
  checks/build before restart. This pre-push record does not claim deployment completion.

## Repository state after implementation commit

Website main is clean at `a6fa1d2ebaea5ef77f6db3bc6c217dfe3a9825d6`, one commit
ahead of origin/main. This journal is created separately, then both commits are
pushed normally. No unrelated user changes are included.

## Implementation commits

- `a6fa1d2ebaea5ef77f6db3bc6c217dfe3a9825d6` — Replace dark tutorial captures with August 27 pitches.

## Archive commit

`Record August 27 tutorial screenshot refresh`

## Lessons learned

Choose retained source footage for instructional visibility as well as convenient
navigation. A genuine capture can be technically faithful but too dark to teach
well. Prefer a better original clip over image manipulation, and keep metadata
aligned with each replacement's actual saved frame and result.

## Follow-up ideas

No additional work is required for this screenshot request. Broader optional
accessibility validation and existing dependency remediation remain separate
items recorded in the initial tutorial journal.
