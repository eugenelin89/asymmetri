# Surrey V0.4 — Living Surrey · 2026-10-30

**Live:** https://asymmetri.co/labs/surrey (also verified on `www`). Activated
2026-10-30 at 22:26:21 UTC through the guarded whole-runtime workflow.

- Runtime source: `0a73d7cc32ea5b6662a5c775a227684297edd04d`.
- Linux build: `-btiWXzoBuaN8Yg_3rBIy`; Node `v22.23.1`.
- Successful CI: https://github.com/eugenelin89/asymmetri/actions/runs/41137334392.
- Full immediate rollback: `/var/www/asymmetri-rollback-before-surrey-v04-20261030`,
  source `44654b31afc61a17667c3fff48f88bc5094a2a3d`, build `em5HpR-sbeh857iO3MUWB`.
- Artifact SHA256: `61f1b6df6f63bb5c057dbc06db90628210bf55cf14cce7b934b72ba14f222c14`.

## Released scope

Surrey retains its public name and `/labs/surrey` route, GIS Apps navigation and
Three.js/Next engine. The isolated `codex/surrey-adventure-v04` branch starts from
965d5b9 (approved Vancouver V0.5 main). Published city snapshots are unchanged.

The release adds a saved accelerated clock, four day phases, smooth sky/sun/fill
changes, emissive window masks and lamp/shop illumination, stable visibility,
role/time pedestrian schedules, bounded crossing/wait/threat states, original
opt-in marimba sound, a complete adult missing-person investigation with two
approaches and privacy/reunion endings, dialogue variants and small useful trust
consequences. Phone controls remain compact with safe-area insets; map/help pause
simulation. Ground-camera smoothing now rechecks the sightline. No dependency,
external runtime map/audio/AI service, account or telemetry was added.

## Geographic decision

Fresh bounded official metadata and numeric queries still fail to establish the
2025 DEM vertical datum, geoid and accuracy. DEM EPSG26910 is horizontal only;
sample LAS EPSG3157 and metre units do not prove the DEM datum. No full quadrant
was downloaded. 26 metadata/query responses total 116,418 bytes. Two sample pixel
values 83.019997/83.419998 prove small numeric access, not datum/native equivalence.
`public/surrey/v0.4-2026-10-30/terrain-review.json` preserves exact URLs and hashes.
Ground stays explicitly flat. Original V0.3 data SHA256 is
`e4cca4b8f8ace1296201f50f77c9bb1d0093365cbfdabeefabb91709a60cccdf`.

## Validation record

44 Surrey tests passed: both new-case approaches/endings through collision movement,
old missions/encounters, migrated saves, corrupt new-state rejection, midnight/phase/
light activation, pause freezes, role schedules, bounded night population, threat
recovery camera sightline fitting and shared GPU/texture teardown. Repository checks pass: 44 Surrey, 59 Vancouver and 7 investment tests; typecheck/lint
(one pre-existing tutorial warning), production audit (zero vulnerabilities),
Next and Vinext builds. No Richmond tests exist on the approved main 965d5b9; Richmond
remains isolated and will integrate afterward.

Browser acceptance on desktop Brave: manually walked Tess→Mo→library notice→Eden→
Holland Park→Riley, chose the private-message ending, used station recovery and
returned to Tess. Case03 closed at $80 ($20 initial + $60 reward), trust 1, one clue;
previous cases remained available. This also verifies recovery during the return
stage. The automated suite walks the full return leg. Clock naturally progressed
from afternoon through evening; Menu night/rest showed readable lit windows and
six active commuters from a 24-actor daytime budget. Sampled 59–60fps desktop; night
phone-sized aerial 58–60fps. These are samples, not sustained thermal benchmarks.

Responsive browser checks: actual CSS 390×844, 320×567 and 844×390 had no horizontal
overflow. Direction-button long press moved the character without page scroll;
Street/Aerial, Return to Player and compact Menu remained accessible. After warmup,
40 view switches retained 110 geometries/45 textures with no growth over the second
20 switches and no browser error log. These measurements precede final candidate
verification and are not physical iPhone testing.

Night regression: completed the full original backpack pursuit and walked it back
for $35. Case03 stayed closed. Discovered Case02 and collected its stopped watch;
midnight advanced the day correctly. Reload/Continue restored exact position,
$115, closed Cases01/03, active Case02, all three inventory items and witness notes.
`npm run check` passes with one existing tutorial navigation warning, no errors.

## Limits

Physical iOS/Android multi-touch, thermal and battery acceptance remain outstanding.
No reliable terrain datum, measured individual storefront reconstruction, interiors,
transit boarding or full prop collision is claimed. Pedestrian and bus activity is
small, deterministic illustration. Audio is a nearby original performer motif, not
recorded city ambience. The private candidate browser tunnel was denied by the
existing SSH policy; no configuration was changed. Exact candidate HTTP checks
passed privately, and the production browser check passed immediately after activation.

Richmond handed Surrey the bounded main/server release window while continuing
local acceptance; Vancouver V0.6 acknowledged. Journals139–140 record implementation and final focus acceptance.
The initial approved main was 965d5b9 and pre-release production was 44654b3 /
`em5HpR-sbeh857iO3MUWB`. Fresh preflight: 55 configuration fingerprints, 13 peer
virtual hosts, 416608KiB available memory and 12929560576 free bytes. Runtime
staging has ample headroom; no older-runtime retirement is required.

Final keyboard acceptance found a menu focus escape: setting actions returned
focus to the canvas. Settings now retain menu focus; Escape closes map/help before
opening Pause, and view switches are disabled while those overlays pause the city.
Map/help now focus their dismissal control and constrain Tab to the open overlay.
Final production-browser acceptance passed: settings retain menu focus, Map/Help
focus their dismissal control, Tab stays inside Help, and Escape closes each
overlay and returns focus to the canvas. No browser errors were recorded.
Typecheck/lint and both production builds pass after this correction. The exact
0a73d7c Linux candidate includes it; the superseded55cc153 artifact was not deployed.

## Production acceptance

The 254,165,036-byte Linux artifact (896,330,891 uncompressed bytes) passed ZIP,
tar and remote stream hashes, safe-member validation, exact source/build identity,
and an independent owned checkout. No on-server build or dependency install ran.
Private checks passed 15 routes, 24 tutorial assets, 124 retained tutorial IDs,
protected host links, image optimization and preserved Surrey/Vancouver datasets.

Continuous checkout, transfer and smoke guards passed without service changes.
The lowest measured available memory was 247,584 KiB during the private smoke;
activation minimum was 388,900 KiB. All phases stayed above 192 MiB available RAM
and 6 GiB free disk. Activation recorded six samples and zero guard errors.
No older runtime was retired. The complete earlier Surrey V0.3 rollback also
remains at `/var/www/asymmetri-rollback-before-vancouver-v05-20261030`.

Public checks passed 15 routes and 24 tutorial assets on both apex and `www`,
comparing protected content, links, canonical and anchor identities against the
pre-release baseline. Another 42 checks passed redirects and immutable/new data
hashes. GIS Apps shows Living Surrey alongside unchanged Vancouver V0.5. Richmond
is still isolated and was not part of this deployment. All 55 config hashes,
13 peer virtual-host responses and peer process/start identities were unchanged.
The website is active/enabled with zero automatic restarts and no post-activation
error entries; the old process's expected shutdown exit143 is separately recorded.
Final capacity: 393,168 KiB available RAM and 11,874,291,712 free bytes.

Live browser Continue migrated the actual V0.3 save: exact position
`25.71,-19.36`, $20, 100 health/stamina, empty inventory and original mission
availability remained intact; Case03 and the new clock were added. A held phone
direction control moved to `25.71,-28.36` without scrolling. At actual CSS
390×844, expanded Street/Aerial controls, Menu and Return to Player are visible,
large status/journal/map panels are closed by default, and no horizontal overflow
or browser errors occurred. Night rest showed lit windows and six pedestrians;
60fps was sampled on desktop Brave at this viewport, not a physical-device claim.
The viewport override, local preview and failed private tunnel were cleaned up.

## Retained evidence and handoff

Local release retention: `deployment-retention/2026-10-30/surrey-v04/` in the
owner's Asymmetri workspace. It contains the verified Linux ZIP/tar, source/build
receipt, terrain responses, local check/build logs, public baselines/comparisons,
server receipt archive, live migration observations and phone-sized Street/Aerial
screenshots. Server receipts: `/var/lib/asymmetri-surrey-v04-release-20261030`.
The release receipt and journal141 are documentation-only successors to the
activated source. Hand the main/server window back to Richmond after their push;
next unreserved journal is142. Vancouver V0.6 remains isolated.
