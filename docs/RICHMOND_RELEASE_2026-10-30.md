# Richmond Learns to Drive V0.1 — October 30, 2026

**Live:** [Richmond Learns to Drive](https://asymmetri.co/labs/richmond), also
verified on `www`, under [GIS Apps](https://asymmetri.co/labs/gis).
Activated at **23:02:00 UTC / 16:02 Vancouver time**.

- Exact runtime source: `be6fc3bc069cd77b54240846b27166027b333d3b`.
- Linux build: `gIRztyRG7Pdh1DR3AAHQR`; Node `v22.23.1`.
- [Successful exact-source CI](https://github.com/eugenelin89/asymmetri/actions/runs/41140933816).
- Runtime archive SHA-256:
  `890ff3a751330d333df908827b8611076f92cc3da22c0770d29c3901af038803`.
- Complete immediate rollback:
  `/var/www/asymmetri-rollback-before-richmond-v01-20261030`, source
  `0a73d7cc32ea5b6662a5c775a227684297edd04d`, build `-btiWXzoBuaN8Yg_3rBIy`.

## Authorization and integration

The owner explicitly instructed **“deploy when ready”** after the implementation
and local acceptance. The locked phone was not accessed or treated as test
evidence. Existing SSH, Node 22 and retained-host arrangements were reused;
no OS, proxy, DNS, TLS, service configuration or unrelated infrastructure changed.

The dedicated `codex/richmond-delivery` branch was reconciled with Surrey V0.4
main `9e5f4ca`. Implementation `be6fc3b` and journal `6dfc765` were pushed to main
before server preparation. The exact Linux runtime is from `be6fc3b`; the only
following difference at staging was the reviewed journal 142. The independent
candidate verified that ancestry and the exact allowed documentation difference.
Subsequent release/journal commits are documentation-only successors.

Vancouver, Surrey and GIS Apps owners received actual tool messages. Surrey
returned the serialized window after V0.4; Richmond reserved journals 142/143.
Vancouver V0.6 and Surrey V0.5 remained isolated during activation. The current
live baseline was inspected rather than inferred from an old receipt.

## Released scope and accuracy

V0.1 is a playable preview with connected Richmond/Sea Island source geography,
33 authored anchors, eight authored orders plus generated offers, driving and
parking, walking, four cameras, local economy/saves, bounded crowds/traffic and
optional encounters with Gentle Streets. Richmond Centre has a walkable original
interior, two exits and usable shops. YVR has a walkable terminal and operations
office, both airport delivery missions, shops, and a fictional Open Airfield
connection to source-aligned aprons, taxiways and runway surfaces.

The [coverage matrix](../projects/richmond/README.md) distinguishes interactive
destinations from exterior geography. The entire OSM-derived database is ODbL;
original code/procedural artwork is MIT. Heights, façades, widths and bridge
elevations include approximations. Interiors and airport access are original
fiction, not current floor plans or operational/security guidance. No external
runtime GIS service, account, telemetry, backend or dependency was added.

The immutable snapshot includes 34,540 ways, 59,361 footprints and 686 detail
tiles. All 688 declared outputs matched two independent offline compiles and the
public copy. City SHA-256:
`a9cac23e9143dc6bb6f72b9690283a3265eefba0a2f309905f2ac6ddfd1814dd`.

## Gameplay and local verification

Final reconciled suites: **27 Richmond, 59 Vancouver, 44 Surrey and 7 investment
tests passed**. Typecheck/lint, Next and Vinext production builds passed; production
audit found zero vulnerabilities. The existing tutorial navigation lint warning,
Browserslist age warning and large-chunk notice remain. No failing gate was
waived. The initial mistyped investment test path was corrected to its existing
package script before continuing.

Continuous vehicle tests traverse every required regional anchor and all eight
authored delivery road legs, with source-node bridge connectivity and full-body
collision. They traverse full included runway lengths. Corridor tests cover the
mall, terminal, office and both mall exits. Economy/save/encounter tests enforce
correct inventory, exactly-once payments, bounded consequences and recovery.

Actual local browser acceptance completed:

- Core restaurant pickup → same-car drive → park customer handover, $14 once.
- Mall pickup, $28 insulated-bag purchase, interior reload, exit/same-car return.
- Terminal Takeout from Richmond to YVR, terminal handover, $34 once.
- Airport café pickup and $5 meal/$12 repair purchases; same-car return.
- Airport Lunch Run to the enterable operations office, $36 once, ending at $59.
- Office gate → apron → about 1.2 km connected taxiways → about 360 m of 08R/26L
  → stop/walk/camera switches/same-car re-entry → taxiways/gate/public-road return.

Public-road browser driving used reversing and bounded local recovery. The
airfield excursion used ordinary reversing without Recover. These are completion
checks, not claims of flawless handling. No direct state injection or camera
teleport completed a journey. Full regional journeys were not all repeated in
the rendered browser. Detailed evidence is in [the handoff](RICHMOND_HANDOFF.md).

Real local WebGL context loss and missing-map responses were exercised; Retry
restored rendering and state, and withheld immutable bytes were restored/hash-
verified. Focus containment, Escape, reload continuity and one-canvas recreation
passed. Pure tests cover invalid saves and optional threat variants; those were
not all exercised manually during this session.

## Phone layout and live browser

Phone controls occupy separate grid areas outside the canvas. Full map, orders,
status and settings open as one paused dialog with inert background controls.
Landscape reserves side gutters. Dynamic viewport and safe-area CSS preserve the
main playing rectangle. Large text, tablet and desktop checks had no overflow.

Live Brave on macOS, with actual CSS viewport measurements:

| Viewport | Canvas | Overlapping game buttons | Horizontal overflow |
| --- | --- | --- | --- |
| 390 × 844 portrait | 390 × 545.62 | 0 | No |
| 844 × 390 landscape | 538.75 × 236.20 | 0 | No |

A 1.2-second held direction button moved the live character from z 21.80 to
17.72 while retaining the car at x 150.95/z 21.81, $20 and 100 health. Map opened
one dialog; initial Shift+Tab stayed within it and Escape returned to play.
GIS Apps → Play Richmond opened the correct live route with existing city cards
preserved. No browser errors were recorded. The viewport override was reset and
the local preview stopped. Live first-load data took noticeable time; the loading
message remained usable.

Local gameplay mostly sampled 58–60 FPS, with occasional 53; the live start sampled
60 FPS after loading. These are desktop browser observations. **Physical iPhone
multitouch, thermal and battery behavior remain unverified.** Other limits include
tight-junction handling, simple local traffic, partial localization, stylized
architecture and a roughly 39 MB initial city file. No surveyed accuracy claim.

## Deployment evidence

The 254,268,453-byte Linux runtime archive (896,712,476 uncompressed bytes) passed
ZIP and tar hashes, safe-member validation, exact source/Node/build checks and a
remote stream digest. Git and runtime extraction used an independent application-
owned checkout. No compilation or dependency installation ran on production.

Fresh preflight: 378,016 KiB available memory and 11,873,882,112 free bytes.
Continuous checkout, artifact and private-smoke guards passed; the lowest measured
available memory was 231,568 KiB during smoke. Every phase stayed above 192 MiB
available RAM and 6 GiB free disk. Activation recorded six samples and zero guard
errors. No older runtime was deleted or archived for capacity.

Private checks passed 16 routes, eight protected-host checks, 24 tutorial assets,
124 retained tutorial IDs, existing city data, image optimization and all 688
Richmond output hashes. Public checks passed 16 routes and 24 tutorial assets on
each host, comparing protected content/links/canonicals/anchors against baseline,
plus 52 redirect and immutable/new-data checks.

Final health at 23:03:59 UTC: 421,028 KiB available memory and 10,747,117,568 free
bytes. Website active/enabled, zero automatic restarts, zero post-activation error
entries. The preceding process's expected shutdown exit143 is separately recorded.
All 55 configuration fingerprints, 13 peer virtual-host responses, peer process/
start identities and Node binary hash remained unchanged. The complete immediate
Surrey V0.4 rollback and earlier retained runtimes remain available.

## Retained evidence and next work

Private owner storage:
`deployment-retention/2026-10-30/richmond-v01/` in the Asymmetri workspace, including
verified Linux ZIP/tar, source/build receipt, public comparisons, server-receipt
archive and browser images. Server receipts:
`/var/lib/asymmetri-richmond-v01-release-20261030`.

Next refinements: physical-device acceptance, smoother tight turns/traffic,
broader rendered regional journeys, localization and smaller initial map payload.
These are limitations of the released preview, not unimplemented airport or mall
features. Return the shared main/server window after the receipt/journal push.
