# Prompt 073: Executable investment receiver activation handoff

- Date: 2026-10-13
- Scope: deployment
- Goal: Give HQ a verified receiver baseline and executable activation sequence before real public-key and run materials arrive.

## Original user request

Standing owner authorization:

> i will be away. you are authorized for everything you need.

Authorized HQ coordination request:

> Continue the activation preparation from your last turn; it ended after read-only inspection with only the site URL, so no executable receiver readiness handoff is available yet. Complete the concrete inspection now and save the result in docs/INV-REAL-01-WEBSITE.md: current investment receiver identity/config/keys/publishers/read-enable state, exact authorize/approve-run/select-official command sequence, configuration input shapes, any tool-approval blocker, and required generation for a brand-new publisher. Do not deploy/rebuild unrelated source. HQ is about to cold-provision first observed portfolio on existing deployed code, then will send actual public-key/scope/configuration JSON. Keep Ask closed. You can report in your own chat/document; outbound messaging to HQ is not necessary.

## Scope

Read installed investment receiver controls, inspect its live database using SQLite
read-only/query-only access, verify relevant process settings and anonymous public
states, and document the exact operational handoff. No authority, run, configuration
or source was activated. No unrelated deployment, build, account probe, model turn,
market-data request, brokerage action or outbound HQ message was performed.

## Decisions

- Bind the handoff to the actual installed source, CLI hash, config hash, service
  identity and empty archive, rather than infer readiness from current local main.
- Require HQ's real public verification key, finite PublisherScope and complete
  canonical RunPublishedEvent. Do not invent operational IDs, times or credentials.
- A new publisher can start at generation string `"1"`, but delivery must match
  HQ's actual durable generation if cold provisioning/restart has advanced it.
- Correct the earlier inspection assumption: authorization, approval, selection
  and diagnostics do not acquire the exclusive maintenance lock. Backup still
  requires a stopped receiver and verified consistent snapshot.
- Select official only after signed ingestion and receipt reconciliation, using
  the exact expected previous official pointer; enable website reads separately.
- Preserve the owner's existing authorization and accepted Yahoo scope. Record
  HQ's retained reload-OFF evidence report under Decision 047 without inventing a
  fresh attestation or website account verification. Keep Ask closed.

## Implementation

Added an executable handoff section to the existing investment release document.
It captures the October 13 20:22 UTC baseline, input contracts and bounds, identity
and generation rules, owner CLI wrapper and command sequence, exact signed POST
route, selection readback, final server-only read settings, backup/rollback
boundaries and current access status. All operational values not yet supplied by
HQ are explicit placeholders rather than working sample grants.

## Engineering impact

Documentation only; no application behavior, dependencies, schema, assets,
accessibility or public content changed. The handoff distinguishes running
listeners from publication authority, receiver read holds from website read
configuration, and paper-portfolio activation from Ask eligibility.

## Files changed

The existing website investment integration/release handoff gained a current
receiver activation preparation record. This journal records the separate request.

## Documentation updated

`docs/INV-REAL-01-WEBSITE.md` now provides the concrete commands and required input
shapes that were missing from the prior read-only turn. Historical release evidence
remains intact; canonical schema/types and existing backup runbooks are linked.

## Git diff summary

Implementation: one file changed, 225 insertions. The added section contains the
live baseline, operational input/command contract and remaining real-material
handoff. No runtime or generated files were included.

## Verification

- Main was clean before work. Default sandbox denied writing Git FETCH_HEAD;
  approved escalation completed `git pull --ff-only origin main`, already current.
- SSH administrator inspection succeeded. Installed compiled CLI/database/run
  controls match the documented command behavior and generation constraints.
- Live receiver source c2edfd50, PID 2376449 and exact apex authority verified.
  Publishers, keys, approvals, experiments, runs, events, batches, nonces and
  content objects were empty. Migration 2, quick integrity and foreign keys passed.
- Actual website process had no investment environment variables; source d0c4543,
  build P7LP4PKXMUyZ96RJnAgcz and PID 2379577 remained unchanged.
- HTTPS investment, Ask and availability returned 200 without Set-Cookie.
  Investment remained unconfigured. Ask had no form and availability was disabled;
  its three admission/claims/delivery settings remained false with unchanged config
  hash and PID. This was not a new all-host release audit.
- Document shell blocks passed `bash -n`; local links resolved; its complete scope
  shape and generation rule matched the pinned schema. `git diff --check` passed.
- No unresolved tool-approval blocker prevented this preparation. No production
  mutation was attempted. No rebuild or full test suite was needed for this
  documentation-only change.

## Repository state after implementation commit

Main at c6d13167963983ee1e11c2257bf33e5f63d6c197; working tree clean and one commit
ahead of origin/main before adding this journal. The required push follows the
separate archive commit.

## Implementation commits

- `c6d13167963983ee1e11c2257bf33e5f63d6c197` — docs: prepare executable investment receiver activation handoff

## Archive commit

`docs: archive investment receiver activation preparation`

## Lessons learned

Read the installed command-specific lock behavior before prescribing service
stops. Receiver generation is scoped to publisher identity; an empty receiver
cannot establish HQ's current durable generation. Receipt lookup authenticates the
request and reconciles immutable publication data; avoid implying an independently
signed receipt response. Operational readiness needs concrete input files and
readback steps even when deployment authorization is already present.

## Follow-up ideas

Consume HQ's actual public-only materials, validate exact configuration/scope
binding, capture the consistent backup, then perform separately evidenced signed
activation and website read enablement under the existing owner authorization.
No new scope or recurring automation is created by this preparation.
