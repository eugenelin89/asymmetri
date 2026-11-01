# UBC V0.5 foundation — implementation queue

November 1, 2026. [Adopted roadmap](UBC_ROADMAP.md),
[scorecard](UBC_FIDELITY_SCORECARD.md), [release gates](UBC_RELEASE_ACCEPTANCE.md).
This increment begins V0.5; it does not declare the milestone complete or deployed.

## Ordered queue

| ID | Work and responsible modules | Acceptance / dependency | Current state |
| --- | --- | --- | --- |
| F05-01 | Performance sampler (`performance.ts`), opt-in engine observations, standalone benchmark harness | Nine fixed views, raw intervals, warmup, invalid-run handling, exact source/snapshot metadata, actual baseline | Implemented; initial local browser evidence below |
| F05-02 | Targeted rendering/lifecycle work (`engine.ts`, `people.ts`, `scenery.ts`, shared disposal boundary) | Prioritize measured workload; compare like-for-like before/after; retain collision/audio/navigation | First bounded fix: reject out-of-range Orchard controls before occlusion walking; stadium improves from 41.04 to ~60 FPS across three post-fix runs; Orchard ~60 FPS, Nest still ~13 FPS |
| F05-03 | Limited real-elevation prototype (`spatial.ts`, `scenery.ts`, additive terrain module) | Source/datum/rights/tile verified; common terrain sampling for visual mesh and movement; seamless entrances/roads | Candidate sources identified; no elevation tile imported or prototype claimed |
| F05-04 | Ladner anchor/references, original model and virtual-time hands | Resolve conflicting dimensions, validate GIS placement; animated faces use selected Vancouver virtual time | Research started; model not implemented; final visual acceptance belongs to V0.7 |
| F05-05 | Koerner public-interior research (`registry.ts`, tracker; future bespoke module) | Documented public circulation and reference rights; no private-room reconstruction | Official layout and historic floor-plan sources located; implementation remains GIS-only |
| F06-01 | Stadium/Rose authentic-reference comparison (`stadium.ts`, `architecture.ts`) | Matched ground/aerial photos, prioritized mismatch backlog, rights ledger, walking/performance check | Official references found; new rendered views captured; paired architectural review pending |

Major `Campus.tsx` extraction waits for a specific measured or maintenance benefit.
This first increment leaves its audio, focus, conversations and visitor controls
intact. Engine diagnostics are optional and absent from ordinary visitor calls.

## Running the local benchmark

Use the repository Node 24 and installed lockfile dependencies:

```sh
npm run ubc:benchmark
```

Open the printed loopback URL (default `http://127.0.0.1:3045/`). The command
builds a minified Vite production-mode bundle under ignored `dist/ubc-benchmark`,
then serves it locally. It does not register a Next.js route or change production
hosting. `npm run ubc:benchmark:build` performs packaging without starting a server.
No dependency was added. Keep other builds/tests and CPU-heavy work stopped while
measuring. Stop the local server with Ctrl-C after saving evidence.

Enter actual hardware, OS, browser and power/thermal conditions. Select a fixed
quality (High/Medium/Low; Auto is deliberately excluded), canvas size and scene.
Use **Live performance** for timings and **Frozen visual reference** for captures.
**Population-off comparison** measures the effect of the population setting; it
is an experiment, not a performance result for the standard populated experience.
Select three repetitions for acceptance, then Run all scenes. Keep the tab visible
and viewport unchanged. Save JSON and each scene PNG. Cancellation, hidden tabs,
viewport changes, context loss, malformed samples and timeout fail the sample.

The fixture includes stadium grandstand, Rose cages, Orchard floor corridor, Nest
atrium, IKB Chapman approach, Main Mall, Koerner exterior, gateway and Halloween
at the gateway. `benchmark/scenes.ts` owns exact feet positions, yaw/pitch and
settings. PNG captures have the same camera FOV/eye height as walking. Live actors
move; use frozen mode for architectural before/after comparison and retain its
mode label. The Halloween fixture excludes audio/chase for comparability.

The exported report contains source SHA plus dirty-file list and source-file
hashes, immutable dataset hashes, preset/canvas/pixel ratio, first-frame engine
startup and data-fetch/parse time, raw intervals, FPS, p50/p95/p99/max intervals,
CPU update and render-submission time, complete-render draw calls/triangles
(including shadow passes), geometry/texture/program counts, and optional JS heap.
The warmup boundary frame is excluded. Large stalls retain their actual interval,
not the physics timestep clamp. CPU submission is not GPU execution time; JS heap
is browser-dependent and not renderer/GPU memory. Missing memory values stay null.

This harness measures the same scene engine with no-op React callbacks, no live
community profiles, no audio controller and no analytics. It cannot establish
full application loading, phone performance, human usability, or physical iPhone
audio behavior. Full visitor/browser acceptance remains a separate gate.

## Terrain source investigation

Sources reviewed November 1, 2026; these are research candidates, not imported
terrain or permission to relabel a synthetic patch as surveyed data.

- [City of Vancouver LiDAR 2022](https://opendata.vancouver.ca/explore/dataset/lidar-2022/) describes coverage including UBC Endowment Lands, with classified bare-earth returns and LAS tile downloads. Inspect the actual UBC tile polygon, metadata and datum before selecting; geographic proximity alone is insufficient.
- [LidarBC](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/topographic-data/lidarbc) and its [portal](https://storymaps.arcgis.com/stories/a461de7f8ac243cb847468a90269a23f) provide provincial collections under OGL-BC. Coverage/acquisition vary by block and still require inspection.
- [NRCan HRDEM](https://open.canada.ca/data/en/dataset/957782bf-847c-4644-a757-e383c0057995) and the [download guide](https://download-telecharger.services.geo.ca/pub/elevation/dem_mne/highresolution_hauteresolution/HRDEM_Download_Instructions.pdf) provide another candidate path. Verify local coverage, DTM versus surface-model selection, datum, resolution and license from the chosen record.

Prefer a small open-ground patch near the baseball approach, selected only after
source/entry checks. Pin raw-source checksum and preprocessing parameters outside
the runtime; commit a new versioned derived tile/manifest without overwriting
published GIS. Keep metre-space x-east/z-south consistent with existing UTM
transforms. Record an explicit vertical reference and local zero offset. Never
mix orthometric and ellipsoidal heights or building/vegetation returns as ground.

Before rendering, define one height sampler for mesh vertices, routes, sidewalks,
entrances, building bases, collision and camera support. Preserve local interior
floor coordinates relative to each building base. Test no-data, boundary joins,
below-grade Beaty and suspended floors separately. A blended seam is an explicit
transition approximation, not a measured surface. Keep the patch opt-in until
visual and ordinary-control walking tests pass; only then plan wider migration.
The existing Vancouver synthetic elevation proof is an engineering reference,
not a UBC terrain source.

## Ladner research conflict

The [Archives building entry](https://archives.library.ubc.ca/explore-ubc-archives-online/campus-history/campus-buildings/ladnerclocktow/)
records reinforced/poured concrete, 121 feet and 1968. The
[Archives FAQ](https://archives.library.ubc.ca/general-history/ubc-history-faq/)
says 140 feet and completion in 1969. These disagree. Record both and resolve
against a plan, measured source or other authoritative evidence before claiming
an accurate height. The [UBC Magazine history](https://magazine.alumni.ubc.ca/2020/best-of-2010-2020/features/clock-tower-and-the-anarchists)
supports its location west of the Main Library and design history. No reference
photographs were copied or rights inferred. Tower geometry, exact anchor,
clock-face proportions and surrounding paving remain to be established.

## Koerner reference packet

The [official layout](https://koerner.library.ubc.ca/locations-maps/layout/)
identifies rear elevators and study/service areas by level. The
[UBC accessibility guide index](https://wiki.prod.apps.ctlt.ubc.ca/Library%3AHelp_for_People_with_Disabilities/Koerner)
links historic floor plans, including [Floor 1](https://koerner-library.sites.olt.ubc.ca/files/2013/09/KoernerFloor1.pdf).
Those plans date from a 2013 path; they cannot prove present fixture placement.
[Campus Planning's ingress/egress map](https://planning.ubc.ca/sites/default/files/2024-08/File_AnnotatedSiteMap_KOER.pdf)
is a separate access reference. These are located references, not completed
measurements or cleared redistribution assets.

Initial reconstruction scope: public entrance/lobby, a source-supported reading
and stack area, documented public stairs/lift connections and service information.
Exclude staff/private rooms. Track each floor's known/illustrative boundary before
modelling; original procedural geometry may interpret references, while copied
plans/photos need suitable rights. Koerner remains Level C until a navigable
interior is actually implemented and accepted.

## Baseball comparison backlog

The [official stadium record](https://sportfacilities.ubc.ca/construction-news/completed-projects/baseball-stadium/)
identifies artificial turf, LED lighting, scoreboard, padded outfield boundary,
dugouts/bullpens, and a 480-seat grandstand with press box. The
[Rose facility page](https://sportfacilities.ubc.ca/baseball-tc/) provides photographs,
a virtual-tour link and four-cage/two-mound training-area information. Public
viewing does not grant image-reuse rights.

1. Match stadium field orientation/shape to pinned home-plate/mound geometry and authentic aerial views; retain source-model dimension discrepancies explicitly.
2. Compare grandstand silhouette, seating rows, press box and backstop/net support against ground views; prioritize recognizable large forms before props.
3. Compare Rose timber/roof/cladding/glazing and entrance transition; keep the walking gap/collision aligned.
4. Compare four cages, the separate pitching area, net density, lights, turf and equipment. Published zone dimensions are constraints, not a complete floor plan.
5. Refine approaches/vegetation and outdoor lighting after major forms pass; repeat performance and walking checks at each step.

This is a prioritized **review queue**, not a claim that all listed features are
missing or that an authentic-photo comparison has already passed. Existing
rendered captures and source links make the next comparison review concrete.

## First measured optimization

The baseline shows recurring CPU update spikes at the stadium. Source inspection
found that the 250 ms telemetry update runs `residence.canSee` for every Orchard
door/lift action before checking whether it is within the existing 2.8 m action
range. That visibility routine advances in 0.15 m steps through residence
colliders, so distant actions can trigger hundreds of metres of unnecessary work.

The first fix rejects residence actions at or beyond 2.8 m before that visibility
walk. These actions never have distant markers and the subsequent selection rule
already requires distance strictly below 2.8 m. Nearby visibility, vertical reach,
ranking, doors/lift collision and actual interaction behavior remain unchanged.
The before/after stadium measurements and Orchard acceptance are recorded in the
[validation gallery](validation/ubc-v05/README.md). This removes one identified
source of work; it does not claim the academic-core rendering target is met.
