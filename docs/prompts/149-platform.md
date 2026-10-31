# Prompt 149: UBC browser validation and walkthrough repairs

- Date: 2026-10-30
- Scope: platform
- Goal: Resume real browser acceptance of UBC Virtual Campus, fix observed defects and preserve reviewable evidence.

## Original user request

> Browser is now available

This resumed the browser work previously blocked during the UBC Virtual Campus
master request, summarized in journal 148. The earlier reply was:

> I’m away from computer. Will enable when I get home

## Scope

Exercised the local application in the in-app browser at desktop, tablet and
mobile widths. Fixed observed rendering, interaction and circulation defects.
Retained actual scene exports and browser screenshots. No deployment, hosted
preview, production configuration, dependency change or unrelated city edit.

## Decisions

- Reset the computer-use connection after the changed setting; used the available
  in-app browser instead of treating the stale disabled response as a new blocker.
- Kept immutable source geometry intact. Reduced the interpreted Nest central
  envelope to 76 m because its full bounding rectangle overlapped the Alumni Centre.
  Omitted ten trees from rendering inside reconstructed model envelopes; retained
  their source records and disclosed the discrepancy.
- Placed interior arrival points on the model-local exterior side. Nearby named
  guides pause and face visitors, making proximity activation reliable.
- Corrected field surface normals and disabled shadow casting on layered turf/clay
  while retaining received shadows. Other stadium structures still cast shadows.
- Made photo capture produce a visible PNG preview and explicit Save PNG link.
  Actual preview generation is verified; native browser download handling is not certified.
- Retained the research-preview classification. Measured samples, procedural visual
  limitations, partial manual coverage and untested physical devices remain explicit.

## Implementation

The walkthrough exercised Rose and Bookstore entrance/interior/exit routes, Nest
stairs to both upper galleries, the Sauder lobby, stadium field and grandstand,
both named guides, sourced answers, unsupported-question handling, directory,
map routing, information displays, four seasons, rain/snow, night and photo mode.
Twenty-five captures and their hashes/dimensions are committed with an evidence guide.

Additional repairs deduplicate directory records and facade signs, scroll new
dialogue answers into view, expose controls at narrow widths and remove a deprecated
Three.js shadow-mode warning. Visitor biographies retain factual summaries while
research caveats remain in the source documentation.

## Engineering impact

Changes remain UBC-owned and reuse the existing runtime. No new service, tracking,
portrait, voice or third-party asset was added. Collision tests use the actual Nest
envelope and neighbouring GIS buildings. Added assertions protect exterior arrival,
stair access, nearby guide pauses and upward turf normals. The original source
payload and other GIS project engines are unchanged.

## Files changed

- UBC engine, architecture, stadium and population modules repair scene behaviour.
- Campus UI, styles and registry improve photo capture, dialogue and discoverability.
- Existing architecture tests gain integrated regressions for observed defects.
- Validation directory adds 25 real captures, a manifest and evidence guide.
- Project and repository reports record results, source distinctions and remaining gaps.

## Documentation updated

Updated the comprehensive A–I implementation report, project README, testing guide
and asset manifest. Added the browser gallery and capture provenance. Journal 148
remains unchanged as a historical record of the earlier browser blocker.

## Git diff summary

Implementation: 39 files changed, 603 insertions and 72 deletions, including 25
binary captures. Changes are scoped to UBC source, regression assertions and
acceptance documentation.

## Verification

- Seventeen UBC Node tests and five Python source-integrity tests pass.
- Existing city regression suites pass; the final Next prebuild also passed
  Surrey's 54 and Richmond's 27 tests.
- TypeScript and lint pass with the pre-existing tutorial navigation warning.
- Final Next and Vinext production builds pass, preserving the existing routes.
  Existing bundle-size and Browserslist-data warnings remain disclosed.
- Production dependency audit reports zero vulnerabilities; dependencies did not change.
- Final browser warning/error list is empty. Capture hashes and sizes all verify.
- Desktop 1440 × 900, tablet 767 × 1024 and mobile 390 × 844 CSS-pixel layouts have
  no horizontal overflow. Keyboard dismissal/focus and on-screen movement were exercised.
- Final Auto observation near Sauder: 60 FPS, 513 draw calls, 1,740,385 triangles.
  A Low transition sample read 31 FPS, 304 calls, 712,531 triangles. These are
  instantaneous observations with a panel open, not sustained performance certification.
- External link safety attributes and destination research are verified. The in-app
  browser did not expose the new destination tab, so ordinary-browser new-tab flow
  remains pending. Physical phones and screen readers were not tested.
- Manual Nest descent/exit and close-up mound/dugout/bullpen journeys remain pending;
  those paths have automated continuous-collision coverage.
- `git diff --check` passes. The local preview was stopped and its browser tab closed.

## Repository state after implementation commit

Branch main, clean after implementation, one commit ahead of origin/main. Main
was fast-forward synchronized before edits. No deployment or production change.

## Implementation commits

- `bc2c127eb8b295fbb9981f1a9fdcef2faa08c069` — Fix UBC walkthrough issues and record browser validation evidence.

## Archive commit

Document UBC browser validation and remaining acceptance gaps in journal 149.

## Lessons learned

Passing isolated collision tests does not detect all overlaps with neighbouring
GIS assets. Browser navigation exposed issues in arrival orientation, visual
shadowing and interaction timing that source review did not establish. Preserve
separate claims for automated geometry, manual walkthroughs, visual fidelity and
physical-device performance. A source building's bounding rectangle is not its
architectural footprint.

## Follow-up ideas

Complete the remaining manual/device checks and sustained benchmarks, then improve
terrain, footprint-conforming landmark architecture, documented public layouts,
vegetation/crowds and real asset streaming. The current preview is not the finished
flagship V2, and code integration does not authorize a production release.
