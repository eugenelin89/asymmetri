# Prompt 136: Verify and release Surrey V0.3

- Date: 2026-10-30
- Scope: deployment
- Goal: Safely activate the tested Surrey reconstruction and clear phone UI.

## Original user request

> I find on the iPhone, the main playing view is blocked by multiple sub views...

Completion of the V0.3 brief's explicit commit, push, guarded production release
and validation requirements, including the iPhone photographs and retained public
name documented in journals 134–135.

## Scope

Exact Linux candidate, private staging, protected-route checks, full-runtime
activation, retention, live acceptance and release documentation. No unrelated
infrastructure, database, service configuration, receiver, DNS or TLS changes.

## Decisions

- Integrate the latest shared main and serialize release with Vancouver/Richmond.
- Require a full independent Linux runtime and whole-directory rollback; the
  preceding navigation-only copy exception cannot cover this feature release.
- Recover space only from a verified older inactive runtime, preserving both the
  live runtime and immediate previous feature runtime.
- Keep explicit memory/disk floors and peer/configuration fingerprints through
  preparation and activation. Record physical-phone testing as outstanding.

## Implementation

Linux workflow 41122339319 passed for source
`248c0a5c382abeba98c601081f2624064dd43a30`. Artifact digest, inner tar, source,
archive paths/links and Node identity were verified. The private candidate passed
before activation at 20:28:29 UTC / 13:28 PDT. Live build is
`VnQohiF4lOLKTwiRVOpzn`. No automatic rollback was needed.

## Engineering impact

The new phone layout and reconstructed city are public on the unchanged Surrey
route. Existing saves migrate and remain browser-local. Main and the feature
branch contain the release; the final receipt/journal are documentation-only and
do not replace the tested runtime source with an unbuilt commit.

## Files changed

V0.3 release record now contains exact Linux/source/build identities, hashes,
capacity measurements, protected/public acceptance and recovery instructions.

## Documentation updated

`docs/SURREY_V03_RELEASE_2026-10-30.md` is the detailed acceptance and recovery
record. Historical releases remain historical and were not rewritten.

## Git diff summary

Release receipt commit: one file, 74 insertions and 15 deletions. Earlier runtime
changes and their verification are summarized in journals 134 and 135.

## Verification

35 Surrey, 43 Vancouver and seven investment tests; TypeScript/ESLint (one existing
warning); production audit; Next.js webpack and Vinext builds; independent geometry
checks and byte-for-byte data reproduction. Fresh browser play completed the
backpack case, collected mystery evidence and verified save migration, modal guards,
phone/tablet/desktop layouts and repeated view switching.

The private Linux candidate passed 15 routes, eight protected host checks, 124
tutorial IDs, 24 tutorial assets, unchanged Vancouver content and native Sharp.
Public apex/www each passed 14 routes and protected-baseline comparisons; 38
additional data/redirect/route checks passed. The live browser restored the old
save, showed the migration message, switched views, opened Menu and recentered
without moving the player. No game console errors were observed.

Five preparation guards passed, with minima 261.9 MiB available memory and
6.3886 GiB free disk. Six continuous activation samples had no violations. Five
peer services, 55 configuration files, 13 unrelated virtual-host responses and
the Node binary were unchanged. The website is active/running/enabled with zero
restarts and zero post-activation error entries.

## Repository state after implementation commit

Branch `codex/surrey-adventure-v03`, clean after receipt commit `8aae644` except
this subsequently created journal. Runtime source `248c0a5` was already pushed to
main and feature branch. Receipt and journal follow with normal pushes, no force.

## Implementation commits

- `f58a1ec` — Reconstruct Surrey V0.3 and clear the mobile playing view.
- `0cd0817` — Keep Surrey touch controls usable in short landscape views.
- `8aae644` — Record verified Surrey V0.3 production release.

## Archive commit

Record Surrey V0.3 deployment engineering journal

## Lessons learned

Verify the exact Linux artifact, preserve a whole executable rollback and do not
infer free capacity from directory size alone. The older Surrey V0.1 runtime was
losslessly archived, fully compared and then retired, freeing 1,028,407,296 bytes.
The immediately preceding live runtime remains intact at
`/var/www/asymmetri-rollback-before-surrey-v03-20261030` with source `17a24b4`
and build `Njs40iFKI-ZTrJ7cLD-h9`; the pre-V04 runtime also remains on server.
Retain owner-held artifacts beyond GitHub transport expiry.

## Follow-up ideas

Physical iPhone/Android touch and endurance acceptance, reliable terrain datum
integration and measured landmark facade details. These are not claims of this
release. Concurrent city work may resume after the release-window handoff.
