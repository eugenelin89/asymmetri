# Surrey V0.6 — Open Roads: production receipt

Initially activated October 31, 2026 at **17:36:56 UTC / 10:36 PDT**, at
`https://asymmetri.co/labs/surrey`. The user explicitly authorized this release
after validation. Shared main/server work was coordinated with UBC, Richmond and
the homepage owner; Richmond browser blocks were serialized separately.

The [local acceptance record](SURREY_V06_ACCEPTANCE_2026-10-30.md) records the
17.0 km connected network, eight roadside destinations, full compact-body
validation, GPS/rerouting and complete Case05. It preserves the October 30 browser
blocker and the subsequently completed October 31 ordinary-control journey.

## Current follow-up identity

The guidance correction activated at **18:11:57 UTC / 11:11 PDT**. Current runtime:

- Source: `bbf194c3584637868bf92936da946485caca2929`.
- Next build: `Ds3XoQLPUe8czRrb_7rcW`.
- Node: `v22.23.1`, existing server binary unchanged.
- Linux workflow: `41227403025`; artifact: `13052162642`.
- ZIP SHA-256: `bef1d08f09a9b8838314c56dfd9b9bda7a620d5d5295de6cc3c2119520728cdd`.
- Runtime tar SHA-256: `fed0ad81e71eb54a3414ba911adceafb9024a69eb2984500b8911be4cec5710c`.

## Initial identity

- Source: `f6fb80a5394cbc8deb88af81cb8c584918ea06f9`.
- Next build: `CM8fyU1dZ-i0htGXG2LZB`.
- Node: `v22.23.1`, existing server binary unchanged.
- Linux workflow: `41224593852`; artifact: `13050962212`.
- ZIP SHA-256: `335239603db6f58b5d19de30fd2a150a86b48f834561de68be303e417bde68ea`.
- Runtime tar SHA-256: `639cac5786b3bd47108db9ac3d034c1a54d3d93c8d121cab6a3afac8e56198a8`.

An independent application-owned checkout received the verified Linux runtime.
macOS dependencies are never copied into production. Later documentation-only
commits do not change the runtime's exact source identity.

## Initial release acceptance

- Local: 229 regressions pass (68 Surrey, 74 Vancouver, 27 Richmond, 53 UBC,
  7 investment); TypeScript/ESLint, audit and both builds pass. Only the existing
  tutorial navigation lint warning remains. Offline network/report bytes reproduce.
- Local browser: ordinary controls completed the full Case05 journey, 1,238.3 m
  driving across five streets, moving reroute, clear/free drive, stop, exit, Mina
  handoff, single $85 reward, reload and same-car re-entry. Aerial preserves state
  and freezes simulation. Source-boundary contacts cleared through normal reverse;
  no Recover, save injection or collision bypass completed the mission.
- Final local screenshots and layout checks at CSS 390×844, 844×390, 320×567,
  820×1180 plus desktop driving verify compact controls and explicit map access.
  There is no horizontal overflow. Focus/keyboard/menu cleanup passed, one canvas
  remained after reload, and application console errors were absent.
- Linux CI: exact reviewed lockfile, checks, Vancouver suite, production audit,
  Next build and Surrey/Richmond/UBC prebuild suites passed before packaging.
- Private candidate: 17 routes, eight protected host checks, 24 tutorial images,
  124 tutorial IDs, source-matching Surrey/Vancouver data, all 688 Richmond outputs,
  six UBC assets, homepage division links and native image optimization passed.
  Existing opt-in public-profile projection and anonymous ownership checks passed
  without writing profile data or using a recovery credential.
- Public: both hosts passed 17-route and 24-tutorial-image comparisons. Protected
  text, IDs, links, canonical and image hashes match pre-release receipts; the
  intentional Surrey/Labs/GIS release copy changes are excluded from text equality.
  Seventy additional public redirect/copy/asset checks passed, including both-host
  immutable Surrey snapshots and the new V0.6 network/manifest/report hashes.
- Fresh live browser: an existing occupied-car save resumed at 24.99,-68.25.
  Ordinary controls drove through the Central Avenue–City Parkway turn to
  94.54,-24.20, selected Central City, triggered moving reroutes while deliberately
  departing the selected path, cleared the route, safely exited and re-entered,
  and switched to aerial with the same car. Compact portrait rendering was clear.
  This live pass exposed one remaining reverse-route instruction defect: a tiny
  raw source kink reported a right onto City Parkway instead of left onto Central
  Avenue. The corrected follow-up is now activated; its separate browser verification
  is recorded below.

Physical iPhone and real simultaneous multitouch were not tested. Actual mobile
app backgrounding, sustained FPS/thermal behavior and full screen-reader testing
remain unverified. Desktop FPS samples are not a phone performance claim. One
compact car remains accepted; Sedan/SUV and train boarding are deferred because
full footprint and safe station-access acceptance are incomplete.

## Guidance correction and follow-up activation

The corrected local build `8dsjjVRnAM7huIqnmH2s-` passes check, Vinext, Next and
69 Surrey tests; the combined preserved suites total 230. Guidance now uses the
same cleaned vertices as the accepted route, with an exact-pose regression and
unchanged pinned network/report bytes. A fresh ordinary-control local drive from
the original car spawn to City Parkway triggered six moving reroutes and correctly
showed “Left onto Central Ave” at 94.40,-22.55, heading -.009.

The first full test run also exposed a one-millisecond export timestamp mismatch
in the existing aerial test. Its assertion now normalizes only `savedAt` while
continuing to compare every simulated field. The final complete run passes.
Follow-up Linux workflow `41227403025` passes, including 74 Vancouver, 69 Surrey,
27 Richmond and 53 UBC tests, checks, zero production vulnerabilities and Next.
Artifact `13052162642` has source `bbf194c3584637868bf92936da946485caca2929`,
build `Ds3XoQLPUe8czRrb_7rcW`, unchanged Node `v22.23.1`, ZIP SHA-256
`bef1d08f09a9b8838314c56dfd9b9bda7a620d5d5295de6cc3c2119520728cdd` and tar SHA-256
`fed0ad81e71eb54a3414ba911adceafb9024a69eb2984500b8911be4cec5710c`.
Its independent checkout, archive source/path/link verification, guarded transfer,
private smoke and activation pass. Private acceptance repeats all 17 routes,
eight protected host checks, 24 tutorial images, 124 tutorial IDs, 688 Richmond
outputs, six UBC assets, all Surrey/Vancouver hashes and public-profile checks.
All 15 HTML route bodies match current live text, including Surrey/Labs/GIS;
all old and V0.6 Surrey asset bytes match. Native image optimization passes.

Private smoke stayed above 261,076 KiB available memory and 6,927,147,008 bytes
free disk. Activation retained the complete initial V0.6 runtime, changed only
the website runtime, and preserved all peer service identities and 56 configuration
fingerprints. Final health at 18:12:08 UTC confirms active/running/enabled with
zero automatic restarts, 13 unrelated virtual hosts unchanged, unchanged Node,
external profile-store modes 0700/0600, complete rollback and verified archives.
Available memory was 404,676 KiB, disk free 6,927,118,336 bytes. No post-activation
error occurred; the earlier exit 143 is the expected controlled shutdown.

Both apex and www pass all 17-route/24-tutorial-image comparisons, with no
intentional text exclusions for this correction. Seventy additional redirect,
copy and asset-hash checks pass.

Fresh live browser acceptance after the correction passes:

- Reload and Continue restore the occupied car at 94.54,-24.20, heading .012.
- Select Central City from Map while aerial, return to Street Adventure: the
  visible instruction is **38 m · Left onto Central Ave**, matching the route.
- Actual CSS 390×844 portrait and 844×390 landscape show the compact view selector,
  one GPS strip, explicit Menu and driving controls with an open central view.
  Neither layout overflows horizontally. Full-frame viewport screenshots were
  saved at capture time; no image retouching was used.
- Aerial keeps the car and selected destination; simulated clock 587.30 and
  elapsed 387.00 remain frozen. A second reload/Continue retains that same car,
  Central City destination, aerial mode and clock. Exactly one canvas is present.
- No application console warnings/errors; installed wallet-extension warnings
  are separate. Rendering snapshots include 23.1, 42.2 and 43.7 FPS; cold loading
  and the shared Mac's memory pressure affect samples, so these are not sustained
  performance or physical-phone measurements.

The final browser block and viewport were handed back to Richmond. Local preview
servers and completed preview tabs were closed; the public game remains available.
Evidence includes `live-browser-final.json`, `live-reload-final.json`, portrait,
landscape-driving and landscape-aerial screenshots in the correction retention
folder. Physical-device limitations above remain explicit.

## Initial activation safeguards and health

Continuous guards kept the existing 192 MiB available-memory / 6 GiB free-disk
floors. Private smoke reached 266,744 KiB available memory and 7,343,226,880 bytes
free disk. Activation's monitor reported five samples, no errors and at least
389,756 KiB available memory. No OS, DNS, TLS, database, peer-service policy or
Node binary change was made.

The final health check at 17:37:12 UTC verified exact source/build, clean live
source, active/running/enabled service with zero automatic restarts, all five peer
service identities, 56 configuration fingerprints and 13 unrelated virtual hosts.
Memory was 427,164 KiB available; disk had 7,343,185,920 bytes free. Profile directory
and file modes remain 0700/0600. No post-activation error was recorded; one prior
process exit 143 is the expected controlled shutdown. Both historical archives and
the complete immediate rollback were reverified.

## Recovery

The current complete immediate predecessor is expanded at
`/var/www/asymmetri-rollback-before-surrey-v06-guidance-20261031`: source
`f6fb80a5394cbc8deb88af81cb8c584918ea06f9`, build `CM8fyU1dZ-i0htGXG2LZB`, with
its own executable dependencies. Its GPS defect is documented above, but the
complete original V0.6 remains available for immediate runtime recovery.

The earlier complete UBC predecessor also remains at
`/var/www/asymmetri-rollback-before-surrey-v06-20261031`: source
`526213d283cba5e70b192cc295e8ccdd3271467c`, build `ujW5iepUV_ni0g_OH7ONo`.
Activation and final health verify the immediate predecessor's completeness.

Private profile storage at `/var/lib/asymmetri-ubc-community` stays outside release
directories. Rollback must not replace it. Stop only asymmetri.service, retain the
failed runtime separately, restore the verified complete predecessor, start the
service and repeat protected/peer/profile checks. No rebuild or dependency install
should be required for immediate rollback.

## Historical runtime retention

The capacity preflight had approximately 6.52 GiB free. Two older inactive runtime
trees were losslessly archived to make staging headroom above the unchanged 6 GiB
floor. Archives preserve ACLs/xattrs and were streamed to the Mac, fsynced and
compared with the still-present originals before retiring their expanded copies.
A second root-only server copy passed SHA-256 verification. Current live and its
immediate complete predecessor, UBC profile data and other retained rollbacks were
preserved. These original historical paths are now archives:

| Archive basename | Source / build | SHA-256 |
| --- | --- | --- |
| `asymmetri-rollback-before-richmond-v01-20261030.tar.gz` | `0a73d7cc32ea5b6662a5c775a227684297edd04d` / `-btiWXzoBuaN8Yg_3rBIy` | `83eb8b9ce32f7c59708f6e52913e5de386aa77976c8ac194daa7dc045ea2aeca` |
| `asymmetri-rollback-before-surrey-v05-20261030.tar.gz` | `be6fc3bc069cd77b54240846b27166027b333d3b` / `gIRztyRG7Pdh1DR3AAHQR` | `945a436effa5f21cb9b5a5d591e14c12614726de9f0be405b9a4d3e52431f996` |

Archives and JSON receipts are retained under the root-only
`/var/lib/asymmetri-surrey-v06-release-20261031` and the owner's October 31 Surrey
Mac deployment-retention folder. Historical recovery first verifies the checksum,
capacity and member paths, then extracts GNU tar with `--acls --xattrs -xpf` into
an empty independent directory, preserving numeric ownership. Verify the full
source/build/runtime before considering activation.


For correction staging, one additional older inactive tree was losslessly archived:
`asymmetri-rollback-before-ubc-orchard-v02-20261031.tar.gz`, source
`fcd2b900b512652a94af07571b841e823c61d2de`, build `VaAKfIoEAK5LbGri4K8V8`,
326,947,672 bytes, SHA-256
`be4a7ef8c0c60690b7368a3e7baca32d9ed8f527dba2fac9165d08f2c89e47fa`.
The original expanded path is retired; both complete copies passed checksum and
GNU tar ACL/xattr comparison before retirement. The initial V0.6 and immediate
UBC predecessor stayed expanded throughout. The correction archive and receipts
are in `/var/lib/asymmetri-surrey-v06-guidance-release-20261031` and the owner's
October 31 `surrey-v06-guidance` Mac retention folder. These supplement, rather
than replace, the initial release evidence directory and two archives above.
