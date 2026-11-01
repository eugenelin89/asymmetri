# UBC flagship fidelity scorecard

Adopted November 1, 2026. Owner: Asymmetri Labs / UBC workstream.
[Roadmap](UBC_ROADMAP.md) · [release gates](UBC_RELEASE_ACCEPTANCE.md) ·
[machine-readable tracker](../projects/ubc/landmark-fidelity.json).

Do not collapse implementation, validation and live release into one percentage.
A sourced footprint, an attractive image and a navigable interior establish
different facts. `pending` is not a pass. Keep historical evidence tied to source.

| Dimension | Current evidence / gap | Flagship acceptance |
| --- | --- | --- |
| Geography | Pinned UBC footprints, paths and entrances; runtime overlays for selected landmarks | Compare priority anchors against documented GIS; keep source hashes, units, transform and known offsets |
| Architecture | Original reference reconstructions; Koerner GIS-only; Ladner absent | Dated reference/capture pairs at matching ground and aerial viewpoints; record silhouette, proportions, materials, entrances and surroundings individually |
| Interiors | Nine supported Level B reconstructions, including Orchard's demonstration floor and four IKB levels | Ordinary-control entry, public circulation and exit; source-backed public coverage; label representative/private-space substitutions |
| Terrain | General ground flat; local floors/ramps only | Source-backed limited-area elevation with continuous roads, sidewalks, entrances, collision and camera; documented datum and residuals |
| Desktop rendering | Local V0.5 harness now measures raw frame intervals; baseline is provisional | Target 60 FPS on a declared capable device/preset; report p50/p95/p99, >50 ms counts, draw calls, triangles, load times and resource counts across three runs |
| Mobile rendering | No sustained physical-phone baseline | Target 30 FPS on named supported phones; same scenes/settings, browser/OS, thermal/power conditions and three runs; desktop viewport emulation does not qualify |
| Memory / lifecycle | Three geometry/texture/program counts and optional browser heap in harness; no GPU byte accounting | Repeated entry/exit and scene teardown; investigate growth with browser tools; do not call resource counts GPU memory |
| Navigation | Existing map, routing and free exploration | Three optional V1.0 tours completed end-to-end by first-time users, with free exploration retained |
| Stability | Existing physics, floors, doors, conversations, audio and navigation tests | Relevant tests plus actual browser walking, no critical crashes, clipping traps or dead ends; preserve source datasets and other apps |
| Education | Reviewed source registry, uneven person-record verification | Every important fact has source/date/rights/classification/limitations/module; correction/removal path; no invented consent or real whereabouts |
| Accessibility | Existing keyboard/touch/reduced-motion support; broader acceptance incomplete | Desktop/tablet/phone keyboard/touch/focus and reduced-motion checks on affected flows |
| Release | Public V0.5 Campus community plus audio patch; flagship V0.5 foundation in progress | Exact tested source/build, live verification, complete immediate rollback and protected-route/peer checks |
| User acceptance | V1.0 visitor study not performed | Prospective/first-time visitors can find, enter and understand the campus without developer help |

## Architectural comparison record

For each priority landmark, keep source URL, date accessed, photographer or
publisher, reuse terms, view direction and approximate camera location. Public
access is not a license to redistribute photographs. Prefer a link when rights
are unclear. Archive only assets with appropriate rights.

Record each feature as `not assessed`, `mismatch`, `reference-supported` or
`measured`. Attach an actual rendered screenshot, list deviations, explain any
estimated dimensions and record the reviewer/date. Reference-supported does not
mean surveyed/as-built. A/B/C interior classification retains its existing meaning:
A is verified as-built, B is reference reconstruction, C is exterior-only.
No existing UBC interior is newly promoted to A by this roadmap.

First comparison order: stadium and Rose; Ladner/Koerner/IKB; entrance/Main Mall;
Sauder/Nest/Bookstore/residences; landscape/cultural destinations. Keep
performance and walking checks alongside architectural judgments.

## Benchmark protocol

Use `npm run ubc:benchmark` and follow [the foundation runbook](UBC_V05_FOUNDATION.md).
The current fixture fixes nine poses, canvas size, quality, season, weather and
virtual time. Use live mode for performance and frozen mode for visual comparisons;
do not compare those modes as if their workloads were equal. The Halloween
fixture disables chase/audio to isolate rendered seasonal load; record separate
full-experience audio/chase checks before release.

Five seconds of warmup precede at least thirty seconds of sampling. Save three
valid repetitions on each reference device. Report every run and variability;
do not average away long stalls or discard an inconvenient valid sample. Hidden
tabs, resized viewports, context loss and cancellations invalidate the run.

The Apple M4 / 16 GiB macOS host used during this increment is an available
engineering test machine, not an accepted minimum-spec device. Exact browser and
viewport are in exported reports. Power mode/refresh/thermal state must be
verified before making a hardware acceptance claim. Supported physical phones
remain to be selected and tested; do not invent device results.

The existing 60/30 FPS targets are goals. A release review must explicitly accept
any measured deviation; passing unit tests does not silently waive performance.
