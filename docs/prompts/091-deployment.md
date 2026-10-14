# Prompt 091: Verified close-amendment production release

- Date: 2026-10-14
- Scope: deployment
- Goal: Record the authorized compatible receiver/website deployment and its preservation evidence.

## Original user request

> any changes just directly commit  and deploy to prod. so far no one is looking at the site anyways so we can take adventage of this window to expidite the process

The owner-authorized investment coordinator supplied the normally merged canonical
pin and explicitly requested final commits/push and guarded deployment after all
cross-repository validation passed. HQ agreed to hold its existing loop until the
website returned stable readiness, avoiding overlapping restart/reconciliation.
No renewed owner confirmation was needed.

## Scope

Deploy the already tested receiver and website from `7dcbf3b`, verify the existing
archive, private Ask state, public routes and portraits, and record the outcome.
This journal covers the deployment receipt; source implementation and detailed
validation are also recorded in prompt 090. HQ activation and live trading
outcomes remain separately owned operations.

## Decisions

Keep the approved Node 22.23.1 runtime and reuse unchanged dependencies without
installation or changes to shared inodes. Prepare isolated application-owned
candidates from pushed main; verify all 247 final source entries and build hashes.
Activate the compatible receiver first, then the website. Preserve all existing
data/configuration, publisher generation and Ask closure. Require old-code schema
compatibility before any receiver rollback; never restore data to fit old code.

## Implementation

Website and investment receiver now run source
`7dcbf3bea400f6a71d01927bc174d97692ee4e78`; website build is
`8OlCVsyW02asPY8CIxRly`. Receiver PID 2414008 started at 16:02:27 UTC and website
PID 2414113 at 16:03:44 UTC. Both were healthy with zero automatic restarts.
Ask remains on source `6a194f0`, PID 2407630, with its original closed configuration.

The stable readiness checkpoint at 16:06:35 UTC preserved source sequence 6,
journal sequence 1 and journal hash
`fe3d8a28951b7569aa2b541690ad73bf0fdefceabe2d62a4155827e70e139523`.
Its six original events, one financial entry, publisher generation 1, archive
epoch and migrations were unchanged. The complete stopped archive and unchanged
configuration are retained privately, together with both old runtime trees.

## Engineering impact

The deployed contract accepts the approved prospective close extension while
retaining original records and legacy behavior. Publication remains distinct
from actual employee execution and accounting. No Ask intake, credential,
permissions, shared-server configuration, dependency or public asset changed.
No rollback was needed. The current main branch can advance with documentation
without requiring another service restart.

## Files changed

A new production receipt records exact identities, guard results, archive/Ask
preservation, public checks, readiness handoff and rollback limits. README and the
integration, deployment and source acceptance documents link that receipt and
replace stale current-release references while preserving historical evidence.

## Documentation updated

`docs/INVESTMENT_CLOSE_RELEASE_2026-10-14.md` is the actual release receipt.
`docs/INVESTMENT_CLOSE_RECOVERY_2026-10-14.md` remains the source/test record.
The deployment guide identifies the older website's potential fail-closed behavior
once the new status field is published. Asset documentation is unchanged because
no image bytes changed.

## Git diff summary

Release documentation: 5 files changed, 156 insertions and 3 deletions. Earlier
functional implementation: 27 files changed, 698 insertions and 30 deletions,
recorded separately in prompt 090. Neither summary includes this journal.

## Verification

- Exact canonical package matches merged HQ `fbd26f5`; generated types rechecked.
  All 247 final source entries matched the pushed candidate. Both production
  dependency lockfiles were identical to the prior runtime.
- All required build and source checks passed as detailed in prompt 090, retaining
  the earlier failed socket precondition and stopped compiler as separate evidence.
  Exact producer native HTTP/SQLite checks passed 2/2 before deployment.
- Production candidate passed nine routes, including live investment reads,
  portraits, closed Ask and protected Motion resources. Preparation, candidate and
  manifest guards all retained the 192 MiB available-RAM / 6 GiB disk floors and
  unchanged live peer identities.
- Stopped SQLite backup was checkpointed and closed before copy; all six manifest
  entries matched, integrity/foreign keys passed, ownership/modes retained. There
  were zero stored content objects at this checkpoint. Configuration copy matches
  the captured pre-release hash. This is host-local custody.
- Private state checks preserved Ask metadata/empty tables/configuration, publisher
  scope/keys/approvals, all original events/batches/financial rows and unrelated
  service identities. Archive epoch/schema matched the stopped copy.
- After activation, all 112 route observations matched baseline: 104 verified HTTP
  results, four existing IPv6 TLS failure fingerprints and four fallback
  certificate fingerprints. Both hosts preserved protected Motion content,
  tutorial canonical/fragments and 48 original image reads.
- Eight optimized/original employee image checks and six hierarchy page checks
  passed. Production browser showed loaded 96-by-96 Atlas/Maya portraits, shared
  navigation, no document overflow and no console warnings/errors.
- Receiver and website health completed in 4.36 and 2.01 seconds respectively,
  with zero automatic restarts. Stable readiness and exact identities/watermark
  were sent to the authorized coordinator before its separate HQ restart.
- Documentation link targets and whitespace checked; no runtime change is made
  by this release receipt or journal.

## Repository state after implementation commit

`main` at `9a3ff4f6ce761630a640ac4ac781765d53a27eec`, clean before this journal and one documentation commit ahead
of `origin/main` (`7dcbf3b`). Production remains on `7dcbf3b`; no documentation-only
redeployment is needed. No unrelated user work was committed.

## Implementation commits

- `b79d7a7d5058260f0f7c81aaf5ad881887ede5e6` — Support the October 14 investment close amendment
- `9a3ff4f6ce761630a640ac4ac781765d53a27eec` — Record verified close-amendment deployment

The earlier separate source journal is `7dcbf3bea400f6a71d01927bc174d97692ee4e78`.

## Archive commit

Record close-amendment deployment journal

## Lessons learned

A compatible consumer must be live before publishing new optional fields. Preserve
application and authority boundaries through staged checks, explicit readiness and
separate upstream activation. Keep recovery evidence scoped: code rollback must
not reset accepted history, and a host-local backup is not off-host custody.

## Follow-up ideas

Observe HQ's separately authorized workflow and actual published outcomes in its
own operational record. No additional service change is required by this release.
