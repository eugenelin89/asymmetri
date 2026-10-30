# Prompt 143: Publish the verified Richmond preview

- Date: 2026-10-30
- Scope: deployment
- Goal: Activate the tested Richmond preview with complete rollback and verified phone layout.

## Original user request

> I am going to be away for about an hour. phone is available and locked. deploy when ready.

This explicitly authorized deployment after the implementation and acceptance
gates. The preceding Richmond brief and iPhone obstruction request are summarized
in journal 142. No phone unlock or physical-device test was inferred.

## Scope

Richmond's exact committed website runtime, narrow GIS Apps integration, complete
previous-runtime retention, private/public checks and release documentation.
No OS, Node version, proxy, DNS, TLS, peer service, account or unrelated draft
change. The live phone was untouched.

## Decisions

- Reused the existing isolated Linux workflow and standing Node 22/SSH access.
- Built exact source `be6fc3b` on Linux; the reviewed journal was its only
  difference from main during staging. No Mac dependencies or live compilation.
- Kept Surrey V0.4 source/build intact as the full immediate rollback.
- Used continuous 192 MiB available-memory / 6 GiB free-disk guards through
  checkout, artifact transfer, private smoke and activation.
- Serialized main/server ownership with Vancouver, Surrey and GIS Apps chats.
- Reported browser viewport evidence separately from physical-phone acceptance.

## Implementation

Activated Richmond on both public hosts at 23:02:00 UTC through the guarded
whole-directory swap. Runtime source is `be6fc3bc069cd77b54240846b27166027b333d3b`,
build `gIRztyRG7Pdh1DR3AAHQR`. Full rollback is
`/var/www/asymmetri-rollback-before-richmond-v01-20261030`, source `0a73d7cc`,
build `-btiWXzoBuaN8Yg_3rBIy`. The exact Linux CI run is 41140933816.

## Engineering impact

The deployed preview adds the connected delivery world, mall and YVR interiors,
both airport missions, fictional airfield, independent saves and unobstructed
phone layout. Existing protected routes, city implementations/saves and peer
services remain intact. No dependency addition, retention deletion or broader
infrastructure change was necessary.

## Files changed

- `docs/RICHMOND_RELEASE_2026-10-30.md`: exact source/build/rollback, actual
  journeys, data/licences, private/public/live acceptance and remaining limits.
- `docs/DEPLOYMENT.md`: points to the current Richmond runtime receipt.
- `docs/RICHMOND_HANDOFF.md`: replaces the pending publication checkpoint with
  actual authorization, activation and final handoff evidence.

## Documentation updated

The release receipt separates source, journal, CI artifact and running build
identities. Historical checkpoint evidence remains clearly historical. It records
physical-device, handling, localization and payload limits without implying that
the implemented mall or airport features remain roadmap-only.

## Git diff summary

Release documentation: three files, 180 insertions and 11 deletions. The prior
implementation is archived separately in journal 142: 723 files, mostly immutable
geographic tiles. This journal is excluded from its own diff totals.

## Verification

- Local final suites: 27 Richmond, 59 Vancouver, 44 Surrey and 7 investment;
  typecheck/lint, Next/Vinext builds, zero-vulnerability production audit.
- Exact Linux CI passed checks, Vancouver regression, audit and Next build
  including Richmond/Surrey prebuild tests.
- Verified 254,268,453-byte runtime archive, safe members, source/Node/build
  identities, local hashes and matching remote stream digest.
- Private acceptance: 16 routes, eight protected-host checks, 24 tutorial assets,
  124 retained tutorial IDs, existing city data, image optimization and all 688
  Richmond outputs. Minimum smoke available memory 231,568 KiB; all floors met.
- Public acceptance: 16 routes and 24 tutorial assets per host, protected content/
  links/canonicals/anchors unchanged, plus 52 redirect and immutable-data checks.
- Live browser: GIS Apps discovery, correct initial state, held phone control
  movement, parked-car continuity, one focus-contained map, Escape and no browser
  errors. Actual CSS 390×844 and 844×390 had zero canvas/button overlap and no
  horizontal overflow. Viewport reset; local preview stopped.
- Final health: 421,028 KiB available RAM, 10,747,117,568 free bytes, active/enabled
  service, zero automatic restarts and zero post-activation error entries.
  All 55 config fingerprints, 13 peer vhosts, peer process/start identities and
  Node binary hash unchanged. The old process's expected exit143 is recorded.
- Complete current/immediate rollback and older retained runtimes remain. No
  physical iPhone multitouch, thermal or battery claim is made.

## Repository state after implementation commit

Dedicated branch `codex/richmond-delivery`; release-doc commit `7cbc3e3` follows
implementation `be6fc3b` and journal `6dfc765`. Remote main was `6dfc765` before
this documentation pair. Push the receipt and this journal without force, then
hand the serialized window back with exact main/runtime/rollback identities.
No local implementation changes remain outside the documented commits.

## Implementation commits

- `be6fc3bc069cd77b54240846b27166027b333d3b` — Richmond game, data, phone controls and implementation docs; deployed runtime.
- `7cbc3e3` — Verified Richmond production release and complete Surrey rollback receipt; documentation only.

## Archive commit

`Archive Richmond production acceptance and coordinated handoff`

## Lessons learned

Keep runtime and documentation identities distinct. Whole-runtime rollback,
hash-verified artifacts and live baseline comparisons preserve the neighbouring
city projects while adding a new route and dataset. Real browser journeys and
phone-layout measurements complement, rather than replace, deterministic tests.

## Follow-up ideas

Physical-device acceptance, smoother tight junctions/traffic, additional rendered
regional drives, fuller localization and a smaller first map download are preview
refinements. The released core, mall and airport loops have actual local-browser
completion evidence.
