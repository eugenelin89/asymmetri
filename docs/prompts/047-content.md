# Prompt 047: Baseball-first Motion measurement presentation

- Date: 2026-10-08
- Scope: content
- Goal: Publish the owner-approved baseball-first measurement names on Motion and its tutorial without changing scientific meaning or the existing product story.

## Original user request

> Update and deploy the public Motion measurement presentation on https://asymmetri.co/motion. Also review /tutorial for terminology consistency where these same measurements are presented to normal users. Implement, validate, deploy, verify, and tag the update.

The attached request explicitly overrides the earlier website-only terminology
gate, even if the frozen V1.2 binary still uses technical labels. It asks for eight
view/event entries: Side Front Foot Contact has Stride Length, Front Leg Block
and Trunk Tilt; Side Ball Release has Front Leg Block and Trunk Tilt; Back Front
Foot Contact has 2D Lateral Trunk Lean; Back Ball Release keeps 2D Shoulder–Upper
Arm Angle and 2D Throwing-Side Shoulder–Wrist Orientation. Do not rename either
arm result Arm Slot. Use the supplied positive descriptions explaining observation,
event and repeat tracking, with one concise general methods note.

Preserve scientific definitions, formulas, provenance and persisted identities;
keep every view/event result distinct. Update normal tutorial instructions and
tracking questions, retaining relationship ≠ causation. Preserve Measure / Track /
Compare / Learn, the longitudinal story, period comparisons, evidence return, human
interpretation, Reference Study, Compare, family, privacy and current visual design.
Do not redesign the pages, restructure the tutorial or modify the Motion app repository.

Use current clean main, inspect production and recent commits, establish an immutable
rollback at the actual deployed SHA, update current-facing documentation, and leave
historical records intact. Run check, both builds, production audit and diff hygiene;
do not fix audit findings or change dependencies. Check mobile/tablet/desktop,
longer descriptions and tutorial hashes. Use the documented production process,
inspect disk, preserve rollback material, build before activation, verify Motion,
tutorial, privacy and support on the live hosts, then create and push the requested
immutable release tag. Report names, copy, tutorial consistency, validation and
Git/production/rollback identities. Provide an initial ETA and progress updates.

## Scope

Website shared copy and current-facing guidance only. No route, layout, style,
component, media-byte, dependency, runtime, application-science or app-repository
change. Deployment uses the existing DigitalOcean Next.js/systemd process.

## Decisions

- The explicit owner naming decision supersedes the former website gate. It does
  not assert a binary update, App Store release or scientific validation.
- `motionMeasurements` remains the shared source for both public inventories.
  The existing scientific mapping is documented for all eight event/view entries.
- Use the requested descriptions and a short Settings → About → Measurements note.
  Preserve all separate Front Leg Block and Trunk Tilt endpoints and distinct Back lean.
- Tutorial Analyze, history questions and captions use the same names. Retained
  screenshot alt text describes the genuine older UI; captions bridge old labels
  without retouching evidence. Version disclosure now mentions measurement labels.
- Keep the prior product source review as explicitly superseded historical evidence.
  Remove the stale gate from current code, README, architecture, content and testing guidance.
- Audit remediation remains separate. No npm audit fix, dependency upgrade or
  additional app/product capability is included.

## Implementation

Updated all eight entries and the section introduction/note, replaced vague tracking
questions with baseball-facing names, added both Side trunk event entries, and
changed tutorial counts/instructions to five Side and three Back measurements.
Existing rendering and navigation consume the updated inventory unchanged.

## Engineering impact

Content-only rendering change with no new client code, storage, external requests,
assets or architectural boundaries. Existing accessibility and responsive behavior
remain. The longer descriptions fit the existing grid and tutorial reading column.

## Files changed

- Shared content: measurement inventory, product questions, tutorial instructions,
  history questions and three retained-image captions/version disclosure.
- Current documentation: README, architecture, content guide, product and tutorial
  reviews, site strategy and testing guidance.

## Documentation updated

The product review records owner authority, eight unchanged scientific mappings and
verified pre-change release. Other current guidance now describes this presentation
instead of requiring the superseded gate. Historical journals/capture evidence are
preserved. No asset manifest change is needed: original bytes, paths, dimensions,
alt text and rights are unchanged; caption wording is documented in the tutorial review.

## Git diff summary

Implementation: 8 files changed, 127 insertions and 50 deletions. Changes are limited
to shared copy and its documentation; no route/component/style or dependency diff.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; nvm is unavailable.
- `npm run check`: passes, with the existing tutorial hash-navigation ESLint warning.
- `npm run build:next`: passes. The first run hit a sandbox port restriction; an
  approved retry reused the cached failure. Moving failed generated `.next` aside
  and building with required process/port access succeeds; no source workaround.
- `npm run build`: passes; existing Vinext route-classification notice remains.
- `npm audit --omit=dev`: exits 1 for the unchanged high-severity Next.js dependency
  entry comprising six advisories. The initial sandbox network failure was retried
  with registry access. No dependency remediation was attempted.
- `git diff --check`: passes.
- Browser layout/DOM checks: 320, 390, 768, 1024, 1440 and 1920 effective CSS pixels
  for both routes, all eight entries, no overflow or clipped measurement text.
  Desktop/tablet/mobile screenshots reviewed, including long descriptions and
  tutorial questions. No browser console errors appeared.
- All ten module jumps, Previous/Next, Back/Forward, Side/Back radio keyboard
  arrows, 3px visible focus, fresh step hashes and complete-guide mode pass.
- Reduced-motion rules and all-content server/no-JavaScript path remain intact
  on source/HTML inspection; OS-level preference emulation was not performed.
- All nine pages, robots, sitemap and favicon return HTTP 200 locally. One H1,
  expected canonicals and protected footer links pass. All 26 linked Motion
  original images return 200. Tutorial IDs/original URLs and policy/support
  article text equal the pre-change production baseline.
- All public assets, route/component/style files, configs and dependencies are
  byte-identical to the prior source. Changed-copy privacy/prohibited-reference
  review found no private identities, paths, credentials, new URLs or obsolete branding.
- Before edits, production was clean main at
  `fd65c46c16588903bb74198f1988cafff8d8b20c`, build `3sb31Jjj0R0QRPODTe0e_`.
  Service active; protected routes returned their real articles on both hosts.
  Rollback tag `website-pre-motion-measurement-names-2026-10-08` was created,
  pushed and its remote peeled target verified.
- Production had 261 MB free. The existing complete archive of an older inactive
  September 28 rollback passed gzip integrity, stored SHA-256 and full tar content
  comparison. No active process or service/config reference used its duplicate.
  Following documented retention, only the verified uncompressed duplicate was
  removed; its archive/checksum and current/immediate rollback material remain.
  Free space rose to 1.2 GB. Exact paths/checksum are in the external release receipt.
- After this journal is pushed, production candidate check/build, smoke tests,
  activation, live verification and the final release tag are recorded in the
  external receipt and completion report. They are not claimed complete here.

## Repository state after implementation commit

Clean `main` at `2341515f5fd4b54977c3c7eea1166df09feb394d`, one commit ahead of
`origin/main` before this separate journal. Only intended files were staged.
Both commits will be pushed normally; no feature branch, worktree, PR or force push.

## Implementation commits

- `2341515f5fd4b54977c3c7eea1166df09feb394d` — Use baseball-first Motion measurement names

## Archive commit

Record Motion measurement presentation and validation journal

## Lessons learned

Explicit owner presentation decisions can supersede an older website naming gate
without rewriting scientific definitions or implying a frozen binary has changed.
Keep shared inventories event-specific and explain older screenshot vocabulary in
captions. Verify retained archives before recovering disk space from duplicates.

## Follow-up ideas

The existing Next.js advisory and broader server capacity planning remain separate
maintenance work, not commitments or dependency changes in this release.
