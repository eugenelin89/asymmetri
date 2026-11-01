# UBC V0.5 initial performance evidence

November 1, 2026. Local development evidence; V0.5 is in progress and this is
not a production release receipt. [Runbook](../../UBC_V05_FOUNDATION.md).

## Environment and interpretation

Apple M4, 16 GiB, macOS 26.6.2 (25G83), Codex in-app Chromium 156. High quality,
populated live simulation, clear autumn at 15:00, fixed camera, five-second
warmup and at least thirty seconds of raw RAF intervals per sample. The desktop
canvas is 1280 × approximately 720 CSS pixels, with a 1663 × 935 drawing buffer
at the browser's approximately 1.3 device-pixel ratio. Actual sizes and browser
identity are retained per sample. AC power and low-power-mode off were checked
during this session; the initial operator label predates that check. Display
refresh and thermal state were not independently verified.

This is one available engineering machine, not a supported minimum-spec or
physical-phone acceptance test. No builds/tests ran concurrently with timed
samples. Engine callbacks are no-ops; React UI, network community and audio
overhead are excluded. CPU render submission is not GPU timing. Geometry/texture
counts are not GPU memory; optional JS heap is a browser estimate.

The reports identify the pre-commit parent SHA and dirty source-file SHA-256
hashes, including the engine and fixture. Those hashes, rather than the parent
SHA alone, identify the code measured. All three immutable GIS input hashes are
included. A later documentation commit does not change the recorded measurement.

## Baseline

[baseline.json](baseline.json) contains all nine valid samples before the
residence-distance optimization. Each view has one sample, so this survey finds
priorities and does not satisfy the three-repetition release protocol.

| Fixed view | FPS | Frame p95, ms | CPU update p95, ms | CPU submission p95, ms | Mean draw calls | Mean triangles |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Stadium grandstand | 41.04 | 100.0 | 107.6 | 4.0 | 933 | 781,008 |
| Rose training hall | 60.00 | 16.8 | 20.7 | 4.3 | 962 | 772,519 |
| Orchard corridor | 59.97 | 16.8 | 3.7 | 4.7 | 1,094 | 2,808,242 |
| Nest atrium | 13.44 | 83.4 | 15.6 | 13.7 | 1,903 | 2,459,189 |
| IKB Chapman approach | 13.88 | 83.4 | 39.3 | 10.5 | 630 | 1,810,825 |
| Main Mall | 14.56 | 83.4 | 33.8 | 11.5 | 668 | 1,678,171 |
| Koerner GIS exterior | 27.30 | 50.0 | 32.5 | 8.6 | 514 | 1,592,586 |
| Gateway | 35.36 | 33.4 | 21.9 | 7.7 | 1,421 | 2,680,058 |
| Halloween gateway | 27.28 | 50.1 | 23.9 | 8.7 | 1,633 | 2,676,406 |

Draw/triangle counters include shadow passes. CPU update p95 and frame p95 need
not describe the same frame. Stadium telemetry spikes led to the bounded
occlusion fix. The slow academic-core views and high rendering load warrant
separate CPU/GPU profiling and controlled shadow/quality/population comparisons;
the present counters cannot prove which GPU operation dominates.

[initial-diagnostic.json](initial-diagnostic.json) preserves the earlier pilot:
two valid samples with a narrower canvas and an invalid Orchard sample caused by
the first RAF sharing an earlier timestamp during scene replacement. The harness
now drops that first observation and fixes the requested canvas dimensions.
The pilot is excluded from all comparison tables, not silently discarded.

## Actual rendered captures

These unretouched PNGs came from the renderer's capture function after each
baseline sample. They are live-mode frames, so actor positions differ. They do
not establish authentic-photo architectural comparison, as-built dimensions or
completed interiors. Koerner remains GIS-only; Orchard is representative.

- [Stadium: grandstand, backstop and field](stadium-baseline.png)
- [Rose: reconstructed indoor training hall](rose-baseline.png)
- [Orchard: demonstration-floor corridor and shared spaces](orchard-baseline.png)
- [Nest: reconstructed atrium and suspended lounge](nest-baseline.png)
- [IKB: Chapman-level approach](irving-baseline.png)
- [Main Mall: busy outdoor academic core](main-mall-baseline.png)
- [Koerner: current generic GIS exterior](koerner-baseline.png)
- [Gateway: UBC entrance-letter view](gateway-baseline.png)
- [Halloween: populated seasonal gateway](halloween-baseline.png)

Original application geometry and PDDL-derived UBC geography; no source
photograph, private profile, credential or real-person portrait is reproduced.
These files are documentation evidence, not deployed promotional assets.

## First optimization: residence action distance guard

[after-distance-guard.json](after-distance-guard.json) records three stadium
repetitions and one Orchard/Nest follow-up each, with the same fixed settings,
canvas and input hashes as the baseline. Source engine SHA-256:
`d6257774abf3b5747d98d1f05565efaf31d5b76e2ecfba454d8674fdf42388f5`.

| Scene / repetition | FPS | Frame p95, ms | CPU update p95, ms | CPU submission p95, ms | Frames >50 ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| stadium 1 | 60.00 | 16.8 | 1.6 | 5.5 | 0 |
| stadium 2 | 60.00 | 16.8 | 1.6 | 5.7 | 0 |
| stadium 3 | 60.00 | 16.8 | 1.5 | 6.0 | 0 |
| orchard 1 | 60.00 | 16.8 | 1.4 | 5.1 | 0 |
| nest 1 | 12.83 | 83.4 | 1.5 | 9.8 | 386 |

At the stadium, the baseline had 114 intervals over 50 ms; all three post-fix
samples had none. CPU update p95 fell from 107.6 ms to 1.5–1.6 ms, with approximately
60 FPS instead of 41.04 FPS. Orchard remained approximately 60 FPS. The Nest
remained slow (12.83 FPS versus 13.44 in its single baseline), despite CPU update
p95 falling to 1.5 ms. One run on either side cannot establish significance of
that FPS variation; it does establish that this fix has not met the Nest target.
No geometry, lighting, shadow, population or quality reduction was made.

The fix moves the existing 2.8 m reach rejection ahead of distant Orchard
occlusion walks. Nearby controls retain the existing visibility/vertical/ranking
logic. This is evidence for a bounded CPU improvement on this machine, not a
cross-device performance or full V0.5 acceptance claim. Before-side repetition
and remaining scene/device coverage are still required for release acceptance.

Post-fix captures: [stadium grandstand](stadium-after.png),
[Orchard corridor](orchard-after.png), [Nest atrium](nest-after.png).
All remain unretouched 1663 × 935 live-mode captures; actor positions can differ.

## Verification of this increment

- Node 24.10.0 matches the repository's Node 24 requirement.
- `npm run check`: TypeScript and lint pass with the existing tutorial navigation warning.
- `npm run build:next -- --webpack`: passes, including 548 tests across Surrey (69), Richmond (27), UBC (157, including three new sampler tests), CWRU (98), reviews (13), analytics (29) and Stanford (155).
- `npm run test:vancouver`: 74 pass. Total across the above suites: **622 passing tests**.
- `npm run build`: Vinext production packaging passes. Its existing route-classification advisory remains.
- `npm audit --omit=dev`: zero vulnerabilities. No dependency changes.
- Benchmark build and all recorded valid samples completed without browser console errors. Full PNG checksums/chunk CRCs verify the nine baseline exports.
- The ordinary Next production preview loaded through the default visitor engine path. Directory search and Visit entrance reached Orchard; keyboard movement entered the lobby. First/third-person, map and aerial controls worked. Desktop, 390 × 844 phone and 820 × 900 tablet layouts were inspected; phone/tablet document width matched the viewport, with no broken phone images or browser console errors.
- [Phone visitor controls at Orchard](visitor-phone.jpg) is an unretouched 390 × 844 screenshot. This smoke test is not a complete door/lift/stair walkthrough or physical-device acceptance. Existing automated residence geometry/interaction tests pass; the full ordinary-control release journey remains pending.
- Local review, profile and analytics stores were deliberately unconfigured; reviews displayed the expected unavailable-on-this-host state. No production writes or deployment occurred.
- New documentation links resolve, all 18 landmark implementation/classification states are retained, and `public/ubc` is unchanged. The unrelated pre-existing `next-env.d.ts` edit was preserved after build generation.

During closeout, remote `main` advanced with the separately requested roadmap
publication (`0a96949`, journal `bf0e9e1`). This increment was integrated after
those documentation-only commits, preserving their roadmap content and journal.
The benchmark source hashes continue to identify the earlier measured working
source; runtime code did not change during this integration.
