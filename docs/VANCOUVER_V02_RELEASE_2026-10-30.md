# Vancouver V0.2 — Experimental release

Public experience: https://asymmetri.co/labs/vancouver

V0.2 activated at **10:24:16 UTC / 03:24 PDT on October 30, 2026**, under the
owner's explicit autonomous implementation/push/deployment authorization. The
project remains Vancouver, with **Vancouver in Progress** in the Labs submenu.
The [V0.1 record](VANCOUVER_RELEASE_2026-10-30.md) remains historical evidence.

## What improved

- A more legible miniature city: varied windowed facades, roof details, wider
  pavement and footways, crossings, lamps, mixed trees and water highlights.
  Original procedural details improve Science World's dome, Creekside's glass
  and green roof, Hinge's wetland, Habitat Island and Cambie Bridge supports.
  Warm lighting, static shadows and a detailed teal car add scale and depth.
- Driving now has smooth speed-sensitive steering, brake-before-reverse,
  bounded acceleration, a damped chase camera, wheel/body feedback, full-car
  clearance and short movement substeps. Nearby landmark spawns are validated
  for forward travel. Switching modes preserves position; reset returns to the
  chosen safe start. Ground driving excludes bridges and viaducts.
- Clear Explore/Drive modes, quick viewpoints, numbered markers, selected-place
  fly-to, Drive nearby, street/speed/gear HUD and a north-up minimap. Keyboard and
  held on-screen controls support desktop and small viewports. Expand city view
  fills the window, with focus containment and Escape/exit; it does not depend
  on native browser fullscreen.
- Lite graphics, capped/adaptive pixel ratio, static shadow updates, throttled
  React telemetry, hidden/offscreen animation suspension, explicit input cleanup
  and scene/GPU disposal. Context failure preserves readable place information;
  retry/restoration recreates the engine. No new dependency, backend or tracking.

## Geographic correction and rights

V0.1 road centre samples were not inside buildings, but finite pavement/footway
width exposed old footprint conflicts. V0.2 systematically trims illustrative
street clearance from 24 building parts (1,922.8 m²), retaining all 436 parts,
296 source road lines and 18 park parts. Full-body clearance and safe spawn
direction address additional driving failures. This does not establish surveyed
road widths or current building accuracy; narrow curves can still stop the car.

The separate snapshot `/vancouver/v0.2-2026-10-30/city.json` is 276,986 bytes,
derived from immutable V0.1 without new geographic downloads. Ground pavement
stays on existing land, water is not expanded, and the geographic extent is
unchanged. Its manifest records parent/output hashes and original City sources.
The refinement verifies its parent digest, retained parts, trim budget and
pavement/building/water separation before writing; changed geometry requires a
new version. Published V0.1 remains byte-identical and publicly accessible.

2015 footprints, the simplified 2002 shoreline, illustrative heights/widths,
flat terrain and artistic promenade/models remain explicitly disclosed. Original
code/models/textures are MIT; City-derived geometry retains OGL–Vancouver.
Source links and the independent-project disclaimer remain visible. No external
artwork, model pack, OSM data, photos or fonts were copied. See the project
[README](../projects/vancouver/README.md) and
[notices](../projects/vancouver/THIRD_PARTY_NOTICES.md).

## Source and runtime identity

- Implementation: `38c48ed` (city/UX/physics/data and affected documentation).
- Deployed source and implementation journal: `7990eabe022aed0ed28b477b07bc2d9ad457e1d6`.
- Next build ID: `LgdQfEvDuIcwEAl6_yxWS`.
- [Successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41039688700), artifact `12969722303`.
- Runtime tar: 253,988,056 bytes; SHA-256 `93246fb1f494878b6abbe19b4bd322dde0f35629634a5dbbcfa6e157735d7100`.
- Artifact ZIP SHA-256: `4561abbfbb317f817cdb7cba90449b04769ba8742ec8ce63feca773463d1576d`.

The exact SHA was built on isolated Ubuntu x86_64, Node 22.23.1/npm 11.6.0, with
pinned actions, the locked dependencies and no production credentials. Both
archive digests, source/build/runtime identity, member paths, application
ownership and clean checkout were verified. Candidate dependencies are
independent, without hardlinks to rollback runtimes. A guarded loopback candidate
passed before only `asymmetri.service` was restarted through a complete-tree swap.
Later documentation/journal commits do not change this compiled identity.

## Verification

Local Node 24 TypeScript/ESLint, Next webpack and Vinext production builds passed.
All **13 Vancouver tests** and **seven investment tests** passed. Exact-source
Linux CI repeated checks, Vancouver tests, production audit and Next build.
Production audit reported zero vulnerabilities; dependencies/lockfile did not
change in V0.2. The existing tutorial navigation lint warning and nonfatal stale
Browserslist/chunk-size notices remain. Targeted privacy/secret-field and diff
checks passed. No development-only audit cleanliness is claimed.

Tests cover preserved dataset/provenance, polygon holes, land/water/building
exclusions, full-car clearance across thousands of inland road samples, all six
safe starts and at least 30 metres of forward departure, steering, braking before
reverse, high-speed obstacle crossing prevention and 30/60 Hz consistency.

Browser inspection covered aerial movement, search/selection, fly-to, nearby
spawns, simultaneous steering/acceleration, brake/reverse/reset, full-window
expansion/Escape/focus, Lite and pause/resume. Three local pause cycles removed
all canvases and returned to the same 69 geometry/11 texture counts in aerial
mode. Actual Next route exit/return was checked locally and publicly: zero
canvases on Labs, one after returning. This complements code inspection of GPU
cleanup; it is not a driver-level memory-leak measurement.

Public desktop (1280px) sampled **60 FPS, 80 draw calls, 114,421 triangles at
DPR 1.6**. A 390px driving viewport sampled 60 FPS, 38 calls and 111,651 triangles;
local Lite driving used DPR 1. These are desktop-browser samples, not sustained
benchmarks or physical-phone results. Widths **320, 390 and 768px** showed no
horizontal overflow, with visible usable controls. Public keyboard acceleration
reached 24 km/h; held pointer acceleration/brake and reset worked. Current public
browser error/warning logs were empty. Physical phones, hardware multi-touch,
forced WebGL context loss and reduced-motion OS emulation were not tested;
reduced-motion/context-recovery branches were reviewed in code.

Owner-held before/after evidence includes `before-desktop-full.jpg`,
`before-drive.jpg`, `before-mobile.jpg`, `after-desktop-live.jpg`,
`after-drive-live.jpg` and `after-mobile-live.jpg`. Images and detailed private
receipts remain outside the public repository; the owner report links them.

All **13 public page checks** returned 200 and protected main content, links,
canonicals and tutorial assets matched the pre-release baseline. Loopback checks
preserved **124 tutorial IDs and 24 assets**, Motion privacy/support/tutorial,
Trade/Ask content, official video behavior, the 307 access redirect and legacy
redirect semantics. Native Linux image optimization returned 200. Another 22
public checks covered apex/www routes, redirect destinations and byte hashes for
both V0.1 and V0.2 city/manifest files. The submenu wording was verified in-browser.
The engine/data remain dynamically imported only by the Vancouver route; no
shared website dependency/import or runtime-service configuration changed.

At **10:27:26 UTC**, the website was active/running/enabled, with zero automatic
restarts. **Five peer services, 55 configuration hashes, the Node binary and
13 other virtual-host response baselines were unchanged.** Available memory was
385,852 KiB (about 377 MiB); disk free was 6,892,527,616 bytes (about 6.42 GiB).
The candidate smoke guard's minimum available memory was 305,728 KiB; its minimum
free disk was 6,892,593,152 bytes. Both mandatory floors remained satisfied.

The intentional stop caused the old wrapper to exit 143 (SIGTERM), producing one
shutdown warning. The new runtime has zero error entries after activation. No
service configuration was altered to suppress the warning.

## Recovery and storage

The complete immediately preceding V0.1 runtime is retained at
`/var/www/asymmetri-rollback-v01-20261030-e909c8d`, source
`e909c8da9121f9f9179dfb3d71d78e0621805a85`, build `At28nruWgLtaH0vOlV-pM`.
The earlier Vancouver `a27af82` and pre-Vancouver `cefacd5` complete runtimes also
remain on-server. Source, dependencies, matching builds and executable Next
entry points were checked. Activation had automatic restoration on failure;
no production restore was needed or rehearsed.

Ten older inactive website runtimes were retained losslessly in two private
owner-held archives to create candidate capacity: `4f0651a`, then a nine-runtime
bundle containing `6a194f0`, `7dcbf3b`, `87fed28`, `f9aee2d`, `e13a4ff`, `3584a07`,
`8ffba38`, `e9b5ab1` and `ff3c5f1`. Clean source/build identities, inactive status,
absence of configuration/process references, local/remote SHA-256, gzip integrity
and GNU tar's full contents/metadata comparison were verified before removing
only redundant uncompressed copies. The first archive is 279,613,440 bytes,
SHA-256 `1d92d504db2eb81e530d6234a02a5f8273966f5b1d616af1b32e0f0f8cc9e625`;
the bundle is 854,087,680 bytes, SHA-256
`dbd0d650f08f7ce53be1cd794e78c85eb25337028a6adb1c6dca4243dabab7f3`.
Their exact source/build inventory and custody receipts are retained privately.

Historical runtimes shared hardlinks, so their apparent directory sizes did not
represent reclaimable capacity. The bundle retains those internal relationships.
Restore the entire bundle into an empty directory with sufficient capacity,
verify identities, and prepare a separate selected candidate; partial extraction
can omit hardlink targets. Do not extract an old archive into the live tree.
For immediate rollback, use the complete on-server V0.1 directory and the
[documented guarded directory-swap procedure](DEPLOYMENT.md), preserving the
failed candidate and repeating protected/public/peer checks.

No Ubuntu, Nginx, TLS, DNS, Node binary or peer-service change occurred. The
existing retained-host exception and standing production Node 22 approval remain.
The 192 MiB available-memory and 6 GiB free-disk floors were not lowered.

## Remaining limitations and V0.3

This is bounded eastern False Creek with old source geometry and artistic
heights/widths. Bridge driving/elevation, walking, traffic, historical/proposal
layers and other neighbourhoods remain absent. Collision can still stop a car at
narrow bends or boundaries; reverse/reset is available. Full-window mode does
not hide the browser's native chrome. Context recovery and real touch hardware
still need deliberate device testing.

Prioritize physical-phone profiling and touch testing, clearer collision/junction
feedback and continuous driving routes, then current footprints/measured heights.
Treat bridge elevation as a separate connected-road model before expanding the
map or adding simulation complexity.
