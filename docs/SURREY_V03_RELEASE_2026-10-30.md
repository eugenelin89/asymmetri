# Surrey, City of Adventure V0.3 — City Reconstructed

Live at [the existing Surrey route](https://asymmetri.co/labs/surrey). Guarded
activation completed **October 30, 2026 at 20:28:29 UTC / 13:28 PDT**.
Implementation is on `codex/surrey-adventure-v03`, integrated with shared main
`1727292`. The recent public name and Labs menu are preserved.

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
  sample. The final additional 80-switch run stabilized at 82 geometries and 29 textures
  after warm-up, with one canvas and unchanged position/progress. Frame samples
  during rapid switching ranged roughly 36–60 fps on the shared desktop GPU.
  Counts vary with view and adaptive DPR; no phone endurance claim.

Reduced-motion CSS and renderer branches were reviewed, not tested by changing
the user's OS preference. Browser console review excludes unrelated wallet
extension warnings. Local development's 127.0.0.1 HMR origin restriction was handled
by using the production preview, without weakening development-origin settings.
Screenshots, source receipts and logs are retained outside Git in owner storage.

## Verified Linux release

[Workflow run 41122339319](https://github.com/eugenelin89/asymmetri/actions/runs/41122339319)
passed for exact source `248c0a5c382abeba98c601081f2624064dd43a30`.
Artifact `13008089612` contains Node 22.23.1, Next 16.4.3 and Three 0.186.1;
Next build ID **`VnQohiF4lOLKTwiRVOpzn`**. ZIP digest, inner tar checksum, source
identity, archive paths and links were verified before staging. The retained tar
is 254,138,167 compressed bytes / 896,255,828 uncompressed file bytes, SHA-256
`fe101264a87b5de2abcfeea9ac7484e314127ce4f3e928338a80d0f74947e9e7`.

The full independent Linux runtime was staged outside the live tree and activated
with a whole-directory swap. No live dependency install/build, peer service,
configuration, database, receiver, DNS or TLS change occurred. The final release
record and journal are documentation-only commits after the tested runtime source.

## Production acceptance

- Private candidate: 15 routes, eight protected host/path checks, 124 tutorial IDs,
  24 tutorial assets, Motion video/access behavior, Ask/Trade and unchanged
  Vancouver main content. Surrey V0.1 remains byte-identical; the new city and
  manifest match committed bytes. All eight published Vancouver data files match.
- Native Sharp image optimization returned HTTP 200 and a valid PNG.
- Public apex and www: 14 routes each returned HTTP 200 and protected content,
  links, canonicals and tutorial assets matched the pre-release baseline.
  A further 38 data/redirect/route checks passed, including the new and legacy
  Surrey snapshots on both hosts and existing Vancouver snapshots.
- Live browser: Continue restored the prior V0.2-origin save at `25.80,29.43`,
  $20 and the available first case, with explicit migration confirmation.
  Phone play expanded, help dismissed, Menu showed full status, Return to Player
  recentered exactly, and Street/Aerial switching preserved position/progress.
  The actual 390×844 CSS viewport had no horizontal overflow and the game error
  log was empty. One sampled aerial view rendered 58 draw calls near 59 fps at
  adaptive DPR 0.75. Desktop browser emulation is not a physical phone after-test.
- Five preparation guards passed. Minimum available memory was **261.9 MiB**;
  minimum free disk was **6.3886 GiB**, above the 192 MiB / 6 GiB floors.
  Continuous activation monitoring sampled six times with no violations.
- Final health: website active/running/enabled, zero restarts and zero
  post-activation error entries. The old process's expected shutdown exit-143
  entry is accounted for separately. Five peer services, 55 configuration hashes,
  13 unrelated virtual-host responses and the Node executable were unchanged.
  Final available memory was 371.3 MiB and free disk 6.3886 GiB.

## Retention and recovery

Before staging, an older inactive Surrey V0.1 runtime was streamed losslessly to
owner storage, checksum/gzip verified and fully compared against its remote tar.
Its source is `883ebfe5d81a191b9d73e6fd183ec2d589d88be6`, build
`Ph1NW42c_br8k4AmOXJQ4`; archive size 277,667,840 bytes, SHA-256
`a1d0d0aa288902f009836a00fda04e9ce05139065cf6ecf8c78a450740abcf00`.
Only that inactive, unreferenced directory was retired after validation, freeing
1,028,407,296 bytes. The live runtime and immediate prior feature runtime stayed
intact throughout. The pre-V04 runtime remains at
`/var/www/asymmetri-rollback-before-v04-20261030`.

The complete immediately preceding live runtime, source
`17a24b4bc2568a40973de2fd2a8fdd497d7a9ea2`, build `Njs40iFKI-ZTrJ7cLD-h9`,
is retained at **`/var/www/asymmetri-rollback-before-surrey-v03-20261030`**.
It includes executable Linux dependencies. Automatic rollback was armed and not
needed; no deliberate production rollback drill was performed.

For rollback, verify source/build, clean trees, executable dependencies, resource
floors and peer/configuration fingerprints. Stop only `asymmetri.service`, move the
current whole runtime to a new retained failure location, move the verified prior
runtime to `/var/www/asymmetri`, start that service and repeat protected/public/peer
checks. Never overwrite retained runtimes or reset their source in place.

Remote receipts: `/var/lib/asymmetri-surrey-v03-release-20261030`. Owner-held
artifact, older-runtime archive, source cache, screenshots and logs are retained
outside Git under `deployment-retention/2026-10-30/surrey-v03/`. Artifact expiry on
GitHub is transport retention only. The feature branch and main were pushed
normally without force; Vancouver and Richmond integration windows were serialized.

## Remaining limits

Physical iOS/Android multi-touch and sustained thermal/battery testing remain.
Terrain is flat; building measurement provenance is incomplete; decorative props
do not have full collision. There are no interiors, transit boarding, vehicles or
new story systems. Saves remain browser-local and origin-specific.

Next work: physical phone acceptance, verified vertical datum/terrain integration,
and measured landmark facade details within the existing extent.
