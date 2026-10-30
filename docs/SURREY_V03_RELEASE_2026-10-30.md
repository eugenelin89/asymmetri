# Surrey, City of Adventure V0.3 — City Reconstructed

Candidate for [the existing Surrey route](https://asymmetri.co/labs/surrey).
Implementation is on `codex/surrey-adventure-v03`, integrated with shared main
`1727292`. The recent public name and Labs menu are preserved. Production
activation is recorded below only after the exact Linux candidate passes.

## Player-visible changes

Street Adventure and Aerial Explore have persistent labelled buttons, an explicit
active state, guarded V shortcut, contextual instructions, and dismissible help
whose preference survives reload. Both perspectives use one scene and renderer.
Switching preserves the character and pauses street activity in the air.

The owner's iPhone photographs showed stacked panels covering the city. Phone
play now opens in the expanded view. A compact objective and two mode buttons
remain visible; health, stamina, inventory and settings move into the paused Menu.
Map and aerial tools open on request and have close controls. Touch movement and
Return to Player sit along the lower edges. Opening a panel does not reset the
story. No dependency, account, analytics or runtime external service was added.

## Geography and architecture

The new immutable snapshot is `public/surrey/v0.3-2026-10-30/`: city JSON is
3,003,834 bytes, SHA-256
`e4cca4b8f8ace1296201f50f77c9bb1d0093365cbfdabeefabb91709a60cccdf`.
V0.1 city JSON remains 2,224,370 bytes with SHA-256
`e40173b2355e695e7117dfeb3fd060417ad14af960408931912fdf3be39bf9ec`.
The fixed extent, inherited collision geometry and story anchors are preserved.

128 road surface polygons, 660 in-service curb features, 92 in-service median
features and 262 paths supplement the inherited streets and sidewalks. Source
classifications have no arterial/collector labels; this is not evidence that all
arterial geometry is absent. Only uncovered reaches receive reconstructed
corridors. 131 road widths use paired-curb derivation, 68 retain lane estimates.
Proposed curbs/medians are excluded. Crosswalk paint is derived, not surveyed.
Topology-preserving centimetre snap rounding prevents invalid serialized slivers;
independent checks verify coverage, holes, paint containment and surface separation.

All 786 retained building parts have verified metre units and a native-coordinate
facility/geometry match to official records. None is labelled verified measured:
survey dates, measurement method, accuracy and roof statistic remain unknown.
Native matching avoids a roughly 1.28 m default WGS84 transformation discrepancy;
the inherited rendering frame stays fixed for save/collision compatibility.
3 Civic Plaza's source height is no longer clamped to 160 m.

Terrain explicitly stays flat. The 2025 DEM metadata and small archive/header
reads establish 0.5 m pixels and horizontal CRS, but not a reliable vertical datum
for this integration. The full 2.38 GB quadrant was not downloaded. Building
GROUND_ELEVATION is not substituted for terrain. The manifest records this limit.

Deterministic procedural building profiles, batched facades, plain roof caps,
nearby roof/door/balcony details, street signs and landmark-specific models improve
the scene. Central City/SFU, City Hall, the library, station and Holland Park use
documented primary-reference cues. These are artistic reconstructions; no surveyed
facade/material/roof accuracy is claimed. Wide aerial views cull people while
keeping YOU and story markers. The existing licence and original-code MIT terms
are documented in the project notices and source manifest.

## Save compatibility

The `asymmetri.surrey.save.v2` key and version-2 schema remain. A validated V0.1-map
save migrates explicitly to the new map ID, preserving missions, evidence, money,
encounters, settings, runtime and position. Only an invalid position is relocated
to nearby walkable ground. A real prior browser save restored both cases closed,
$158 and six inventory entries. Help dismissal uses a separate local key.

## Local acceptance

Node 24.10.0 matches `.nvmrc`; no lockfile change. TypeScript/ESLint pass, with the
existing tutorial navigation warning. All 35 Surrey, 43 Vancouver and seven
investment tests pass; production audit reports zero vulnerabilities. Standard
Next.js webpack and Vinext builds pass. Three independent Shapely geometry tests
pass and the offline reconstruction reproduces city JSON byte-for-byte from the
retained, checksum-pinned source cache. `git diff --check` passes.

Ordinary Brave browser controls against a local production preview, without debug
teleport or save injection, verified:

- Fresh backpack case: Alex, transit slip, Sam and Jo, dropped bag, station
  recovery preserving progress, and return to Alex for the $35 reward.
- Mystery scene and watch, parcel tag collection, and both evidence entries in
  Journal. Full mystery conclusions and all encounter branches remain covered by
  the simulation suite and V0.2 browser acceptance.
- V ignored in dialogue, pause, Journal and the landmark selector; Journal
  Shift+Tab wraps to its last control. Help dismissal persists and Menu reopens it.
- Menu, map close, aerial tools close, landmark selection and Return to Player;
  mode switching does not teleport. Route exit removes the canvas; reload offers
  Continue. Mobile buttons retain 44–48 px primary touch targets.
- Actual CSS viewports 320×740, 390×843/844, 767×1024, approximately 844×390,
  plus desktop: no horizontal overflow. Phone screenshots show the compact HUD.
  This is desktop viewport/input emulation, not a physical iPhone after-test.
- Eighty view switches preserve position and progress; geometry/texture counts
  stabilize after the initial warm-up. Typical bounded samples are near 60 fps.
  Final wide aerial character culling yields 62 draw calls in the phone preview
  sample. Counts vary with view and adaptive DPR; no phone endurance claim.

Reduced-motion CSS and renderer branches were reviewed, not tested by changing
the user's OS preference. Browser console review excludes unrelated wallet
extension warnings. Local development's 127.0.0.1 HMR origin restriction was handled
by using the production preview, without weakening development-origin settings.
Screenshots, source receipts and logs are retained outside Git in owner storage.

## Release status and safeguards

Latest observed live baseline: source `17a24b4bc2568a40973de2fd2a8fdd497d7a9ea2`,
build `Njs40iFKI-ZTrJ7cLD-h9`. A full independent Linux runtime is required;
the prior menu-only build-copy exception does not apply to this feature release.
The current live runtime and immediately preceding feature runtime remain
recoverable. Capacity must remain above 192 MiB available memory and 6 GiB disk
free through staging and activation. Any older-runtime retirement requires a
verified owner-held lossless archive and inactivity/configuration checks first.

Production receipt, exact Linux source/build identity, protected-route checks,
peer-service/configuration checks and rollback location are pending activation.

## Remaining limits

Physical iOS/Android multi-touch and sustained thermal/battery testing remain.
Terrain is flat; building measurement provenance is incomplete; decorative props
do not have full collision. There are no interiors, transit boarding, vehicles or
new story systems. Saves remain browser-local and origin-specific.

Next work: physical phone acceptance, verified vertical datum/terrain integration,
and measured landmark facade details within the existing extent.
