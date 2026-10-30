# Surrey V0.4 — Living Surrey · 2026-10-30

## Candidate scope

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
was downloaded.26 metadata/query responses total116,418 bytes. Two sample pixel
values83.019997/83.419998 prove small numeric access, not datum/native equivalence.
`public/surrey/v0.4-2026-10-30/terrain-review.json` preserves exact URLs and hashes.
Ground stays explicitly flat. Original V0.3 data SHA256 is
`e4cca4b8f8ace1296201f50f77c9bb1d0093365cbfdabeefabb91709a60cccdf`.

## Validation record (in progress)

44 Surrey tests passed: both new-case approaches/endings through collision movement,
old missions/encounters, migrated saves, corrupt new-state rejection, midnight/phase/
light activation, pause freezes, role schedules, bounded night population, threat
recovery camera sightline fitting and shared GPU/texture teardown. Repository checks pass:44 Surrey,59 Vancouver and7 investment tests; typecheck/lint
(one pre-existing tutorial warning), production audit (zero vulnerabilities),
Next and Vinext builds. No Richmond tests exist on the approved main965d5b9; Richmond
remains isolated and will integrate afterward.

Browser acceptance on desktop Brave: manually walked Tess→Mo→library notice→Eden→
Holland Park→Riley, chose the private-message ending, used station recovery and
returned to Tess. Case03 closed at$80 ($20 initial+$60 reward), trust1, one clue;
previous cases remained available. This also verifies recovery during the return
stage. The automated suite walks the full return leg. Clock naturally progressed
from afternoon through evening; Menu night/rest showed readable lit windows and
six active commuters from a24-actor daytime budget. Sampled59–60fps desktop; night
phone-sized aerial58–60fps. These are samples, not sustained thermal benchmarks.

Responsive browser checks: actual CSS390×844,320×567 and844×390 had no horizontal
overflow. Direction-button long press moved the character without page scroll;
Street/Aerial, Return to Player and compact Menu remained accessible. After warmup,
40 view switches retained110 geometries/45 textures with no growth over the second
20 switches and no browser error log. These measurements precede final candidate
verification and are not physical iPhone testing.

Night regression: completed the full original backpack pursuit and walked it back
for$35. Case03 stayed closed. Discovered Case02 and collected its stopped watch;
midnight advanced the day correctly. Reload/Continue restored exact position,
$115, closed Cases01/03, active Case02, all three inventory items and witness notes.
`npm run check` passes with one existing tutorial navigation warning, no errors.

## Limits and release gate

Physical iOS/Android multi-touch, thermal and battery acceptance remain outstanding.
No reliable terrain datum, measured individual storefront reconstruction, interiors,
transit boarding or full prop collision is claimed. Pedestrian and bus activity is
small, deterministic illustration. Audio is a nearby original performer motif, not
recorded city ambience. V0.4 will not claim production deployment before the exact
Linux candidate, protected routes, peer health and whole-runtime rollback are verified.

Richmond handed Surrey the bounded main/server release window while continuing
local acceptance; Vancouver V0.6 acknowledged. Journal139 is reserved for Surrey.
Fresh main remains965d5b9 and protected production is44654b3 /
`em5HpR-sbeh857iO3MUWB`. Fresh preflight:55 configuration fingerprints,13 peer
virtual hosts,416608KiB available memory and12929560576 free bytes. Runtime
staging has ample headroom; no older-runtime retirement is required.
