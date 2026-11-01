# Prompt 194: Adopt the flagship roadmap and begin UBC foundation work

- Date: 2026-11-01 (Vancouver)
- Scope: platform
- Goal: Adopt the UBC flagship roadmap and begin its V0.5 foundation with reproducible measurements and a validated, bounded performance improvement.

## Original user request

> Pasted text contains the user's request.

The supplied UBC Virtual Campus flagship roadmap defines a 2026–2027-and-beyond
direction for Asymmetri Labs: realism and architectural accuracy before expansion,
recognizable geography and landscapes, enterable documented public spaces,
useful educational information, and a credible prospective-student visit.

Its planning sequence is V0.5 engine/performance/limited terrain; V0.6 stadium and
Rose architecture; V0.7 Ladner, Koerner, IKB and Main Mall; V0.8 academic interiors
and differentiated residence life; V0.9 landscape/cultural connections; V1.0
three optional visitor routes and first-time-user acceptance; V1.1+ measured
digital-twin/research possibilities. Realism is the primary track; seasonal
creativity remains secondary. Existing reference reconstructions must not be
called surveyed or photorealistic. Source, rights, real-person representation,
privacy, accessibility, immutable GIS, peer applications and complete rollback
remain explicit constraints. Deploy each completed, validated milestone promptly
through the existing safeguards, without waiting for later milestones.

The immediate queue requests actual performance baselines, a source-backed
limited terrain prototype, a working Ladner Clock Tower, Koerner public-interior
research, and authentic-reference baseball comparisons. It excludes another
bulk character import, generic building expansion or unrelated game mechanics.
The supplied baseline reports the deployed iPhone first-entry audio fix as
user-confirmed.

The user explicitly selected the following answer to whether this cycle should
adopt the roadmap and begin implementation or only save the roadmap:

> Adopt roadmap and begin V0.5 (Recommended)

## Scope

Adopt and operationalize the roadmap, implement local benchmark tooling, measure
nine existing views, remove a demonstrated CPU cost, and prepare a source-backed
implementation queue. This begins the foundation milestone; terrain, Ladner
geometry, Koerner interior construction, authentic-photo architectural acceptance
and physical-phone performance are not completed. No milestone deployment was
performed because its acceptance gates remain open.

## Decisions

- The existing public badge already reads “V0.5 — Campus community.” Preserve the supplied roadmap numbers as flagship planning identifiers and explicitly map completed milestones to a distinct next-unused public release number during release preparation. Do not overwrite the current badge or imply foundation acceptance.
- Keep the benchmark outside public routes and hosting. Use existing Vite dependencies, the real UBC renderer and pinned GIS, optional diagnostics, fixed cameras/settings and raw intervals. Distinguish CPU submission from GPU timing and resource counts from GPU bytes.
- Follow the measurements before refactoring large modules. The 250 ms telemetry loop walked residence occlusion across the campus to controls that already require a 2.8 m reach. Reject those distant controls before the walk, preserving nearby selection logic.
- Retain the initial failed pilot and explain its different canvas and first-RAF issue. Do not mix that pilot into the corrected comparison or discard slow valid samples.
- Keep named landmark implementation and A/B/C truth states unchanged. Research finds conflicting official Ladner height/date claims; record both instead of choosing an unsupported dimension. Koerner remains exterior-only and no elevation tile is imported.
- Remote main advanced during work with the separately requested roadmap publication and journal 193. Fast-forward and integrate this increment with that existing document, preserving its content and history. No peer runtime changes came from that integration.

## Implementation

Added a bounded frame sampler, three meaningful sampler tests, nine fixed camera
fixtures, live/frozen/population-off modes, explicit quality/canvas choices,
repeat sampling, invalid-run handling, source/input hashes, JSON and actual PNG
exports. The tool builds locally with `npm run ubc:benchmark` and has a build-only
command. The ordinary visitor engine does not enable diagnostics.

Recorded nine corrected baseline samples and five post-fix samples on an Apple
M4 / 16 GiB Mac. Stadium baseline was 41.04 FPS with 107.6 ms CPU-update p95 and
114 frame intervals over 50 ms. All three post-fix stadium runs were approximately
60 FPS, 1.5–1.6 ms update p95, with no intervals over 50 ms. Orchard remained
approximately 60 FPS. The Nest remained near 13 FPS despite lower CPU update
time; the fix does not meet the academic-core rendering target.

Added the fidelity scorecard, release gates, ordered implementation/research
queue, raw reports and screenshot gallery. Updated the adoption/release identity,
landmark tracker and owner-confirmed audio evidence.

## Engineering impact

One bounded runtime optimization and an optional diagnostics interface; no
dependency additions, public route, GIS mutation, new visitor tracking, storage,
character import or hosting change. Visual architecture and population quality
are unchanged. Benchmark data excludes the React shell, community network and
audio overhead; desktop viewport checks do not establish physical-phone results.

## Files changed

- UBC engine, new performance sampler/tests, benchmark UI/fixtures/runner and local build tool.
- Package scripts and project/root onboarding links.
- Adopted roadmap, scorecard, release checklist, foundation queue and machine-readable landmark metadata.
- Development, architecture, testing, deployment, audio confirmation and asset provenance documentation.
- Three measurement JSONs, twelve scene PNGs, one phone-layout screenshot and an explanatory validation gallery.

## Documentation updated

Documentation records actual commands, measurements, source/rights limits,
device limitations, the public-version collision, incomplete terrain/core
performance gates and immediate deployment policy for completed milestones.
Existing remote roadmap and journal 193 were preserved; historical receipts were
not relabeled as new acceptance.

## Git diff summary

Implementation: 38 files changed, 22,690 insertions and 31 deletions. Most inserted
lines are raw benchmark intervals and report metadata; binary captures are actual
renderer/browser evidence. This journal is excluded from those totals.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm was unavailable.
- `npm run check` passed TypeScript and lint with one existing tutorial navigation warning.
- `npm run build:next -- --webpack` passed, including 548 tests: Surrey 69, Richmond 27, UBC 157, CWRU 98, reviews 13, analytics 29 and Stanford 155.
- `npm run test:vancouver` passed 74 tests; **622 tests total**.
- `npm run build` passed Vinext packaging; its existing route-classification advisory remains.
- `npm audit --omit=dev` reported zero vulnerabilities; no dependencies changed.
- Local benchmark build and valid recordings completed without console errors. All twelve PNGs passed chunk CRC/completeness verification. Measured engine, sampler, runner, fixture, HTML and immutable-input hashes match the retained source.
- Standard Next preview loaded through ordinary controls, searched/visited Orchard and walked into its lobby. First/third-person, map and aerial worked. Desktop, 390 × 844 phone and 820 × 900 tablet layouts were inspected; phone/tablet widths matched the viewport, with no broken phone images or console errors. Full door/lift/stair walkthrough and physical-phone/audio acceptance remain open.
- Local stores were unconfigured; reviews correctly reported unavailable on this host. No production test writes, deployment or server administration occurred.
- Documentation links, all 18 landmark implementation/classification states and immutable `public/ubc` data were checked. Staged diff, private-path/credential scan and source-hash checks passed.
- The build-generated change to `next-env.d.ts` was replaced with the exact pre-existing bytes; that unrelated edit is excluded from both commits.

## Repository state after implementation commit

Main at `6f7b270a54838cdbfc691f19edd85898d549c7c8`, one implementation commit ahead
of the fetched `origin/main` at `bf0e9e1`. The only remaining tracked working edit
was the pre-existing `next-env.d.ts`. No branch, worktree, PR or merge commit was
created. Both commits are pushed after this separate journal commit.

## Implementation commits

- `6f7b270a54838cdbfc691f19edd85898d549c7c8` — feat(ubc): begin flagship foundation with measured performance tooling

## Archive commit

docs: archive UBC flagship foundation implementation

## Lessons learned

Measure raw frame intervals and separate CPU update from rendering before broad
optimization. An unreachable interaction can still consume substantial CPU if
reach is checked after occlusion. Preserve inconvenient valid results and keep
planning numbers distinct from an already-published release label. Refresh the
remote before closeout when parallel user-requested documentation may arrive.

## Follow-up ideas

Continue F05-02 academic-core CPU/GPU profiling and F05-03 licensed, datum-checked
terrain selection/prototype. Resolve Ladner dimensions, develop usable Koerner
references, and perform matched authentic-reference baseball review. Complete
the repeated physical-device and ordinary-control release matrix before
declaring the foundation milestone finished and deploying it.
