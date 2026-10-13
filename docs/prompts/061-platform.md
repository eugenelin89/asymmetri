# Prompt 061: Isolated private Ask receiver and recovery

- Date: 2026-10-13
- Scope: platform
- Goal: Implement and verify the dormant website-owned private Ask boundary without enabling public intake or genuine work.

## Original user request

> i will be away. you are authorized for everything you need.

The active owner-authorized work continues INV-REAL-01 website/receiver integration
and the separately scoped Ask BotSquad boundary in coordination with the producer
chat. Earlier public release authorization remains effective. The owner requested
independent reviews; both reviewers remained read-only. Authorization does not
establish genuine employee execution or cure the producer's account-401 hold.

## Scope

Implemented a separate private Ask HTTP/SQLite subsystem, dedicated service
verification, visitor ownership, immutable delivery receipts, privacy controls,
bounded evidence checks and non-content recovery. No website input, active Ask
service, model/research execution, new dependency, public asset, publication grant
or observed run was added. Strict shared-apex ingress and healthy HQ activation
remain unresolved integration work, not silently waived checks.

Also recorded the completed private investment-receiver installation at
`c2edfd50ed12ba576c06e6991091090b9ced3e31`, with actual Linux 207/207 and isolated
TLS 61/61 acceptance. It remains stopped/disabled and empty. The running website
identity and existing shared-vhost configuration were preserved.

## Decisions

- Keep private data and authority outside the public archive and its backup tree;
  reject overlap through resolved paths. Reuse the unchanged canonical v1 contract.
- Use secret-hash cookies, exact-origin/CSRF/current ownership and immutable whole
  question hashes. IDs and retries never recover credentials.
- Separate answer identity from delivery wrappers; retain minimal receipts after
  purge and make cancellation, deletion and expiry win over late bodies.
- Acknowledge delivered privacy controls before a final empty freshness barrier.
  Intake requires current full-permission authority and that fresh barrier.
- Bound each consumer generation to 24 hours, idle polling to a 60-second reply,
  and storage/request/traffic growth. Preserve a separate control allowance and
  disk headroom while retaining absolute DoS ceilings.
- Verify all original and ancestor contexts plus output evidence with one bounded
  visibility-witness batch. Preserve millisecond semantic ordering.
- Never back up private transcripts: use a fixed non-content SQL projection,
  retire restored sessions/authority, and require a separately supplied current
  privacy journal before release from hold. Reconciliation raises generation above
  both local and journal state; no authority is automatically granted.

## Implementation

All canonical browser/HQ Ask routes are implemented on a separately configured
loopback listener. Offline commands cover migration, diagnostics, verification
scopes, revocation, cleanup, non-content backup/restore, fencing and reconciliation.
The example is disabled with no roster and no approval. SQLite purge acknowledgment
includes WAL truncation; recovery never transiently copies raw bodies. Restores
support moved backups and an explicit archive-directory override.

## Engineering impact

Next.js and all public routes are unchanged. No package or lockfile changed. HQ
continues to own execution eligibility, route/model work, token/cost accounting and
provider uncertainty. Local focused tests are synthetic interface/privacy evidence,
not genuine activity, a public capacity result or production recovery custody.

## Files changed

- Separate Ask migration, disabled example configuration, private runtime modules
  and offline CLI under the receiver.
- Synthetic HTTP, archive-visibility, ancestry, recovery and retention tests.
- A detailed private boundary/runbook and updates to onboarding, architecture,
  local development, receiver/testing docs and the current release receipt.

## Documentation updated

`ASK-01-PRIVATE-RECEIVER.md` documents real commands, limits, privacy semantics,
operational custody and remaining gates. The INV-REAL-01 receipt now distinguishes
installed receiver source from this new private source milestone. The README's
stale statement about no website deployment was corrected to the existing release.

## Git diff summary

26 files changed, 2,004 insertions and 4 deletions. Most additions are the isolated
private subsystem and its acceptance tests. Canonical vendor files and public
website implementation are unchanged.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm is absent. Receiver TypeScript build passes.
- Focused private Ask tests: 20/20. Full receiver tests: 227/227, including canonical
  manifest integrity. Actual loopback networking was used with approved access.
- Root `npm run check` passes: no errors, one existing tutorial navigation warning.
- Root and receiver production dependency audits: zero vulnerabilities each.
- Staged `git diff --check` passes; targeted credential/private-key/attachment-path
  scan has no matches in the added source, tests and runbook.
- Two independent read-only reviews accepted the final dormant-source scope.
  Their findings drove lease/replay, retention-control, raw WAL, privacy quota,
  visibility-witness, byte-pagination, ancestor-context, timestamp and recovery
  fixes. Reviewers inspected source/test additions; actual test runs were by the
  implementation agent.
- No repeat Next.js build/browser audit was needed for this receiver-only change;
  the already released website and its earlier browser/route checks remain recorded
  separately. No public Ask, strict shared-apex or production Ask claim is made.

## Repository state after implementation commit

Main at `8c7a346a4509f793b270f1b73df34ad9d799ccdb`; implementation commit clean,
pending this separate journal commit and the authorized push. No unrelated work was
staged. The live website still runs the previously verified release, and the private
receiver still runs no listener.

## Implementation commits

- `8c7a346a4509f793b270f1b73df34ad9d799ccdb` — Implement isolated private Ask receiver and recovery boundary.

## Archive commit

`Record private Ask receiver engineering journal`

## Lessons learned

Privacy follows the full trusted history, not only citations in the current answer.
A valid single response and a valid multi-turn page have different byte bounds.
Recovery must preserve suppression and authority generations without reintroducing
private content, and copied backups must not depend on their former directory.

## Follow-up ideas

Complete committed-source HQ interoperability, strict shared-apex TLS routing,
private Linux operations verification, genuine healthy authority and the separate
visitor UI/privacy copy before public activation. Keep account-denial and budget
holds intact; fixtures cannot supply missing execution evidence.
