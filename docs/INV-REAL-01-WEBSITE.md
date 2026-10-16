# INV-REAL-01 — Website integration and release handoff

Date: October 13, 2026 (America/Vancouver). **Website publicly released and verified.
Real HQ publication, official selection and website read enablement verified.**
The live page shows the initial configured portfolio, not completed market results.
HQ reports repaired private
authentication; the [current readiness update](ASK-04-READINESS.md#repaired-private-authentication)
separates that repair from remaining authority, eligibility and genuine acceptance.
This investment
handoff supersedes the next-milestone descriptions in historical INV-04. Its
97b4087 deployment details describe the initial release. The later
[closed Ask production-path release](ASK-04-RELEASE_2026-10-13.md) supplies current
website identity d0c4543. The activation below connects that unchanged build to
the real public archive; Ask remains closed.

## Authority and scope

The owner requested that the BotSquad INV-REAL-01 chat route website work to the
Asymmetri.co project and document the overnight work. The owner subsequently said:
“just proceed to deployment and public release when ready. no need to ask me for
approval.” That authorization covers a verified release; it does not establish
producer readiness, genuine records or a completed forward trial.

The owner reports direct Yahoo confirmation for the complete personal,
noncommercial hobby project, including automated research, simulated investing and
publication through the owner's personally registered website. The owner retains
permission/compliance responsibility. This is owner-reported confirmation; no
independent written verification is claimed. No additional Yahoo licensing
investigation or provider-rights approval milestone is required. Preserve normal
technical provenance, integrity, rate limits, access-denial handling and point-in-time
accounting. No real trades, paid data or credit purchase/reload is included.

## Receiver key renewal — October 16 UTC

At **2026-10-16 05:22:18 UTC** (October 15, 22:22 Vancouver), the existing
receiver registered a fresh public verification key and extended the same
publication scope through **2026-10-16 23:40 UTC** (October 16, 16:40 Vancouver).
The owner explicitly approved the brief interruption, consistent backup and
renewal after automatic approval review rejected the earlier broad authorization.
That rejected attempt executed no production change. HQ subsequently paused and
drained publication while remaining running; the prior key had already expired.

Only the scope key ID and expiry changed. Publisher, experiment, run, generation
`1`, policy, the exact 11 event types, JSON content type, 12 writes/minute and
16,777,216 bytes/day remain unchanged. The new public SPKI DER SHA-256 fingerprint
is `0df11622f0cf02f93cbdc8cd2c38efa374f30e03e84dfda058f210187c27a9f5`;
its validity starts `2026-10-15T23:16:53.000Z`. The old key row and its original
October 15 expiry remain identical. Private signing material stayed on HQ.

The authorization packet SHA-256 is
`50ad087eb084ec131b511ddfeba63982a5a97ad7a8b967f51ceb27d03692bc7f`.
Before registration, the installed CLI produced a consistent stopped-receiver
backup, canonical manifest digest
`ba1c42fe407f913fbe6c356ba4c35958f4abee4cca5da44f40b580cbe34e4ddd`.
All three backup files matched their hashes. An isolated restore passed full
SQLite integrity and foreign-key checks, retained all 17 events and receipts,
and remained fenced with publishers disabled and keys revoked. The original
backup hashes remained unchanged. This verifies a host-local recovery copy;
independent off-server custody and recurring retention are not established.

Registration changed only the publisher scope, added one key and one authority
audit entry, and incremented the archive revision. All 31 other tables were
identical, including 17 events, 17 publication receipts, the one-entry financial
journal, nonces, quotas, run configuration and official selection. The archive and
visibility epochs did not change. Receiver diagnostics passed after registration.

The receiver alone restarted at 05:22:18 UTC, PID `2435099`. Website, Ask and Nginx
service identities remained unchanged. Public Trade status/events returned HTTP
200 with continuous source sequence 1–17, no source gaps, and the same HOLD
revision-2 event hash and receipt. No source code, dependency, website build,
financial action or Ask authority changed.

The receiver accepted HQ's replacement-key heartbeat at **05:24:29 UTC**. Readback
at 05:26:45 verified new-key nonce records and unchanged authority, events,
receipts and financial journal. The HQ coordinator separately reports completed
channel rotation and renewed consent, followed by an actual clean restart at
05:24:52 UTC: receipt/status reconciliation used the new key and current grant
against the retained batch anchor. HQ reports no new model or market requests.

A disposable HTTP test with production-matching auth/database code verified
same-generation overlap: fresh old-key receipt reads and final rechecks succeed
after registration; both keys return the original receipt; the old key is rejected
at its original expiry while the new key continues. Requests authenticated before
the shared scope changes fail final recheck, confirming the need to drain first.

## Initial production activation — October 13

At **2026-10-13 20:32:33 UTC**, the real finite publisher scope and exact observed
run configuration were installed and read back successfully. HQ delivery was
still held, with no experiment/run/event/batch, official pointer or website reads.
HQ then enabled signed delivery; the completed activation receipt follows below.
Ask remained closed throughout. This supersedes the empty-authority preparation
baseline later in this document.

The supplied authorization and canonical run-event files matched SHA-256
`551985183859be12e6d977b720e43af37f7d1f145f4f433d46c30a342e22a29d`
and `f05e12e098a6462ace575f121637d4bf473250a9c56ee684459606379469c2a9`.
Both pass pinned contract validation. Scope/event/configuration identity and policy
bindings, Ed25519 public-only key type, finite expiry, and canonical configuration
hash were checked. No private signing key was transferred or stored here.

| Installed control | Verified value |
| --- | --- |
| Public experiment | `16496aa38732845beeea0a75f4614b93136be792accbb4e0` |
| Public run | `0f6ea49caee91243f2f028a8ddde55abaa68faaaa2de453c` |
| Exact configuration hash | `4658b4d6b435595e6ab15151713eb6a284d7ea29217d6786120868963da52fe3` |
| Scope generation | `1`, matching HQ's supplied durable channel generation |
| Key fingerprint | Public SPKI DER SHA-256 `9043fffc8146d90d69bd4f60dd26f1782e31024fbd1bb9ce23f1396896f7556b` |
| Key / scope expiration | `2026-10-15T23:40:00.000Z` |
| Delivery bound | 12 writes/minute; 16,777,216 bytes/day; exact 11 event types; JSON content capability required by v1, with no HQ content jobs or artifact event authority |
| Approval recorded | `2026-10-13T20:32:32.560Z` |
| Authority counts | One publisher, one unrevoked key, one publication approval |
| Publication counts at authorization | Zero experiments, runs, events, batches, nonces and content objects; later ingestion is recorded below |

The frozen public run is `official` / `configured`, with USD 100,000 cash capital,
an annual public horizon ending `2027-01-01T01:00:00.000Z` and 251 configured
sessions. This is distinct from HQ's current finite October 14–15 operating
authority. Its initial execution budget is 16; future renewals cannot reset the
portfolio or silently rewrite this frozen configuration. No elapsed session,
decision, market observation, employee execution or investment result is claimed.
HQ reports its first real collection is scheduled October 14 at 11:45 UTC.
This is the first scheduled full prospective paper session, not a Yahoo restriction
on reading already available data. HQ reports activation at 20:28 UTC (13:28
Vancouver), after the October 13 regular close and this method's morning decision
cutoff. Integration tests and current-data diagnostics need not wait for October
14; they cannot be backdated as a qualifying prior decision or market result. The
existing finite epoch remains limited to its approved October 14–15 requests.
This explanation changes no schedule, receiver generation, portfolio or clock.

### Backup and unchanged-service evidence

Before authorization, the unchanged investment receiver alone was gracefully
stopped. The matching installed CLI created a consistent SQLite/CAS backup at
`/var/lib/asymmetri-investment-backups-20261013/before`, canonical manifest digest
`1fc9d3227a111f147379dbe5a7a655660cde0249c1d2f991db6554c68ca397bc`.
The backup's hashes, full SQLite integrity, foreign keys and content references
were verified by an actual isolated restore into the sibling `restore-check`
directory. That copy is fenced with reads held and no publisher authority.
The live empty archive's counts and metadata remained identical across backup.

Investment restarted at `20:31:53 UTC`, PID `2385469`, still source
`c2edfd50ed12ba576c06e6991091090b9ced3e31` and the same configuration hash.
Website PID `2379577`, Ask PID `2384365`, ingress PID `2375255` and Nginx PID `826`
were unchanged. Ask's configuration hash also remained unchanged. No source,
package, website build or unrelated service was deployed or rebuilt.

Protected host configuration/unit/source receipts, backup/restore results and
authority readback are in the root-owned private directory
`/var/lib/asymmetri-investment-activation-20261013`. This establishes a verified
host-local pre-activation backup, not a recurring backup schedule or independent
off-server recovery custody. No old archive is to be copied over subsequently
accepted financial history.

Actual owner CLI commands completed in order: `diagnostics`, `authorize` with the
verified authorization file, and `approve-run` with the canonical event. SQLite
integrity and foreign keys passed afterward. No tool approval blocked activation.

### Signed publication, selection and website activation receipt

HQ delivered five real public events at **20:34:09 UTC**: `run.published`,
`team.published`, `discussion.opened`, `paper.ledger_transaction` and
`portfolio.snapshot`, plus a separate heartbeat. The receiver's stored immutable
snapshot receipt matches HQ's reported acknowledgement exactly:

- Batch `01aa74b9817207fc097eaab2191f6f0d7c0a7b89e8abdcbf`; receipt
  `db63be6e-4861-411b-a6aa-aebd5db7875a`.
- Body digest `e9550227f66ecb5f7673adf65aa8f4f345a47d57a02502fda82e11d55cfd7a5f`.
- Source watermark `5`, journal sequence `1`, no source gaps; journal hash
  `fe3d8a28951b7569aa2b541690ad73bf0fdefceabe2d62a4155827e70e139523`.

The public experiment's official pointer was verified null. The owner CLI
`select-official` then succeeded with expected predecessor `-`, and public readback
confirmed the exact run and a changed visibility witness at **20:35:50 UTC**.
The first read-only verification query mistakenly referenced `event_json`; SQLite
rejected it before selection. Inspection confirmed the actual `body_json` column;
the corrected readback passed. No run or financial record was modified by that
failed query.

The existing website source **`d0c454314d646b74895f4d9e3e4a014c63c666a6`**, build
**`P7LP4PKXMUyZ96RJnAgcz`**, was reused without rebuild or source deployment.
Root-owned `/etc/systemd/system/asymmetri.service.d/20-investment-read.conf`
contains only these server runtime settings:

```text
ASYMMETRI_INVESTMENT_READ_ORIGIN=http://127.0.0.1:3101
ASYMMETRI_INVESTMENT_READ_AUTHORITY=asymmetri.co
ASYMMETRI_INVESTMENT_EXPERIMENT=16496aa38732845beeea0a75f4614b93136be792accbb4e0
ASYMMETRI_INVESTMENT_RUN=0f6ea49caee91243f2f028a8ddde55abaa68faaaa2de453c
```

Drop-in SHA-256 is
`52a4c20eb2a914569b212b4a5624f8123bbcb633b369692ea25d0f58c8323f1f`.
The effective unit passed `systemd-analyze verify`. Only the website restarted
for this read configuration: **PID `2386085`, active since 20:36:55 UTC**.
The actual process environment, unchanged source/build and populated HTTPS page
were verified at **20:37:00 UTC**. Investment PID `2385469`, Ask PID `2384365`,
ingress PID `2375255` and Nginx PID `826` remained active and unchanged.

Final acceptance at **20:39:29 UTC** verified:

- Seven public API DTOs pass the installed canonical schema, bind the exact
  experiment/run, provide valid visibility witnesses and set no cookies. Public
  `run.published` recomputes to the exact approved configuration hash above.
- Exact-run, methodology, real discussion and initialization record/receipt pages
  return HTTPS 200 with connected archive content.
- The live UI shows Atlas/Maya, configured status, USD 100,000 starting capital,
  the real initialization journal and no decisions or employee contributions.
  The initial snapshot is **partial** because an exact benchmark closing mark
  does not yet exist. `/snapshot` correctly returns null for the last *complete*
  valuation; `/performance` and exact records preserve the partial observation
  and USD 100,000 cash. Unavailable equity/returns remain gaps, not zero results.
- The UI's `Next authorized review: Unconfigured` is the absence of a published
  `run.status` schedule record. HQ's reported future collection schedule is not
  inferred into the public contract. A heartbeat proves transport contact only;
  publication/market freshness remains `unknown` before qualified observations.
- Actual browser CSS widths 320, 390, 780 and 1440 have no horizontal overflow or
  broken images. Keyboard Enter toggles the frozen configuration, its exact hash
  is visible, and focus has a visible teal outline. No console warning/error was
  observed. Temporary viewport overrides were reset. No new reduced-motion or
  assistive-technology audit is claimed for this configuration-only activation.
- The 112 before/after observations comprise **104 verified HTTP responses,
  four fallback-certificate fingerprints and four pre-existing IPv6 TLS failures**.
  All match the baseline. The four known certificate mismatches are not counted
  as healthy HTTPS. Eighteen receiver/Ask/Nginx configuration hashes are preserved.
- Both hosts' protected Motion routes return 200. Tutorial canonical/hash links
  and all 48 original-image responses/hashes match the baseline. Existing shared
  host statuses, including draft 502 and relay 410, remain unchanged.
- Ask availability stays 200/`disabled`, no cookie; a real session POST returns
  503/`UNAVAILABLE` without a cookie or session. Its session/question/answer/key/
  claim/nonce tables remain empty. No approved Ask disclosure or authority changed.

The private 29-file evidence manifest SHA-256 is
`5b6dceaeda23b27324244afa8c00088ded655c2182c2c15fbc103f1a66f65ff5`.
This proves initial publication and public read integration, not market collection,
genuine employee turns, completed forward sessions or sustained operating capacity.

### Configuration-only rollback

The exact guarded rollback is retained with the receipt:

```sh
sudo -n python3 /var/lib/asymmetri-investment-activation-20261013/website-enable.py rollback
```

It checks the current source/build and exact task-owned drop-in, removes only that
read configuration, reloads systemd, restarts the same website build and verifies
the truthful unconfigured state. It does not rewind SQLite, revoke authority,
erase immutable records or operate Ask/ingress/Nginx. Holding HQ publication or
revoking its key is a separate scoped action if a publication fault requires it.
Re-review this guard after any subsequent website or configuration release.

## Executable receiver activation handoff

Read-only inspection completed **2026-10-13 20:22:17 UTC**. This section is a
preparation receipt, not an activation receipt. No administrative mutation or
publication was performed; production code and services were left in place.
HQ is preparing the first prospective
observed portfolio on deployed `d262a8dff59ab82587bd6444b083e5e9b7603cf0`, with
October 14–15 sessions, USD 100,000 virtual capital and its existing eight-equity
plus SPY defaults. Those intentions are not a substitute for the actual frozen
configuration, scope or event. No run/publisher/key ID has been invented here.

HQ reports strict private account/eligibility verification passed after the owner
repaired login, and its retained authentic reload-OFF evidence remains valid under
Decision 047. That decision permits up to 31 days for this recurring observed
purpose, bound to the same account and the original confirmation time/evidence
hash. This is not a new attestation or a website-side account check. Ask remains
subject to its separate integration and authority.

### Verified live state

| Boundary | Observed value |
| --- | --- |
| Investment source | `c2edfd50ed12ba576c06e6991091090b9ced3e31`, from `/opt/asymmetri-receiver/SOURCE_COMMIT` |
| Process | `asymmetri-investment.service`, active; PID `2376449`, started `2026-10-13 17:18:09 UTC`; user/group `asymmetri-investment` |
| Installed CLI | `/opt/asymmetri-receiver/receiver/dist/src/cli.js`; SHA-256 `daf816260866315689c92b36e8416054e14d5e7fd79469d088c4929b46180503` |
| Configuration | `/etc/asymmetri-investment/config.json`, root:asymmetri-investment 0640; SHA-256 `298998720d18bf8e3d029658f398e748784c7ff76813b1f1e7ec5684167a5c4c` |
| Listener and signed authority | `enabled:true`, `127.0.0.1:3101`, exact authority `asymmetri.co` |
| Private store | `/var/lib/asymmetri-investment`, receiver-owned 0700; database `archive.sqlite` |
| Configured bounds | Archive 67,108,864 bytes; per run 16,777,216; content 268,435,456; minimum free disk 268,435,456 |
| Schema and integrity | Migrations 1 and 2; SQLite `quick_check: ok`; no foreign-key violations |
| Authority | Zero publishers, publisher keys, publication approvals, authority-audit or control-audit rows |
| Publication | Zero experiments, runs, events, batches, nonces and content objects; therefore no official selection |
| Receiver read hold | `recovery_control.reads_held=0`; revision `0`, visibility epoch `1`; an empty archive has no public run to return |
| Website | Source `d0c454314d646b74895f4d9e3e4a014c63c666a6`, build `P7LP4PKXMUyZ96RJnAgcz`; PID `2379577`, started `19:08:30 UTC` |
| Website read enablement | No `ASYMMETRI_INVESTMENT_*` entries in the actual running process environment; HTTPS investment page returns 200 and **Public archive not configured** |
| Ask preservation | PID `2384365`, started `19:38:30 UTC`; configuration SHA-256 `ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c` unchanged; admission, claims and delivery false; archive origin null |

Anonymous apex HTTPS checks returned 200 for investment, Ask and Ask availability.
All three set no cookie. Ask had no form; availability returned `state:disabled`
with `Cache-Control: private, no-store`. These are narrow readiness checks, not a
new all-host release verification. No unrelated source was deployed or rebuilt.

### Materials HQ must supply

Supply the real public-only handoff with file hashes and the current durable HQ
generation, keeping signing private keys and account credentials on HQ. The two
receiver inputs are different JSON documents:

1. **Authorization document**, at most 16,384 UTF-8 bytes, with exactly four
   top-level keys: `scope`, `publicKey`, `notBefore`, `notAfter`. `publicKey` is the
   actual Ed25519 verification PEM, normalized by the receiver to public SPKI.
   The validity values are safe-integer Unix seconds with `notBefore < notAfter`.
   Current signed traffic must fall within that interval and before scope expiry.
2. **Run approval document**, at most 262,144 UTF-8 bytes: the complete canonical
   `RunPublishedEvent` preview that HQ will publish, not just its configuration,
   not an EventBatch and not HQ's private portfolio configuration. The receiver
   validates its schema and configuration hash before recording approval.

The authorization shape, expressed as types rather than fabricated material, is:

```ts
{
  publicKey: string; // Real Ed25519 public PEM only.
  notBefore: number; // Unix seconds.
  notAfter: number;  // Unix seconds, exclusive.
  scope: {
    publisherId: string; keyId: string; experimentId: string; runId: string;
    eventTypes: string[]; contentTypes: string[];
    publicationPolicyVersion: string; expiresAt: string; enabled: boolean;
    generation: string; writesPerMinute: number; bytesPerDay: number;
  };
}
```

All scope fields are required; extra fields are rejected. IDs follow
`^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`. `expiresAt` is UTC ISO time, seconds or exactly
three fractional digits followed by `Z`. Event types must be the exact authorized
subset of the contract's 18 types, with 1–18 unique entries. Content types require
1–5 unique entries from `text/plain`, `text/markdown`, `application/json`,
`image/png`, `text/csv`. Decision 047's events-only publisher advertises
`application/json` to satisfy this v1 constraint while keeping HQ's content-job
allowlist empty; this is not website authority to stage artifacts. Writes per
minute must be 1–60; bytes per day 1–1,073,741,824. Use the actual finite HQ grant,
not those schema maxima as default budgets. Exact definitions remain in the
[pinned schema](../receiver/vendor/investment/v1/schema.json) and
[types](../receiver/vendor/investment/v1/types.d.ts).

The event's required top-level keys are `schemaVersion`, `eventId`, `experimentId`,
`runId`, `sourceSequence`, `type`, `occurredAt`, `recordedAt`, `actor`,
`publicationPolicyVersion`, `evidenceMode`, `references`, `payload`.
`schemaVersion` is `1.0`, type is `run.published`, and evidence mode must be
`observed_paper`. Its payload contains exactly `title`, `purpose`, `objective`,
`runKind`, `state`, `configuration`, `configurationHash`, `startsAt`, `endsAt`,
`previousRunId`. Use `runKind:official` for this intended official run; approval
also supports `private_trial`, but selection cannot promote it to official later.

`payload.configuration` is the complete pinned `RunConfiguration`: versions and
methodology hash, universe/instrument records, capital and USD currency, benchmark
and calendar conventions, provider/feed and opening definition, execution/cutoff/
slippage/commission/accounting rules, risk limits, cadence/session count, finite
execution budgets, publication policy/heartbeat/staleness/outbox limits, data
delay/attribution/rights references, approval and limitations, opening wait bound.
Preserve HQ's exact decimal strings and values. It must have
`configurationStatus:owner_approved`, a non-null `approvalRecordId`, and
`configurationHash` equal to the receiver's SHA-256 of canonical JSON for the
configuration (`canonicalHash` in `receiver/src/schema.ts`). An ordinary file hash
does not replace that canonical configuration hash. Match experiment/run/policy
identities across the authorization, event and configuration before admission.
This exact configuration approval is not a renewed Yahoo investigation.

### Generation and identity rule

For a genuinely new publisher, the receiver's minimum valid generation is the
string **`"1"`**. The schema requires a positive decimal string of 1–18 digits;
`0`, numeric `1`, signs and leading zeroes are invalid. There is no receiver-wide
generation floor in this empty database. Use HQ's **actual current durable
publisher generation**, which may already exceed 1 after cold provisioning or
restart; the signed `BotSquad-Generation` must match it exactly. Do not reset HQ
to 1 or invent a generation to fit this handoff.

For an existing publisher, experiment/run identity cannot change and generation
cannot decrease. Reusing a key ID requires identical publisher, normalized public
key and validity interval and an unrevoked key. A revoked key ID cannot be reused.
After restore, the documented fencing/reconciliation procedure needs new key
authority and a generation above both HQ and receiver history. A normal receiver
restart itself does not increment the publisher generation. Reconcile any HQ
restart before enabling delivery; never erase accepted events or receipts to
resolve a generation mismatch.

### Exact command sequence after receiving the real materials

On `ssh webadmin`, define the existing owner-only command wrapper:

```sh
inv() {
  sudo -n runuser -u asymmetri-investment -- env \
    ASYMMETRI_RECEIVER_CONFIG=/etc/asymmetri-investment/config.json \
    /usr/bin/node /opt/asymmetri-receiver/receiver/dist/src/cli.js "$@"
}
```

The uppercase shell variables below are operator placeholders, not supplied IDs
or paths. Set `INV_AUTHORIZATION_JSON` and `INV_RUN_EVENT_JSON` to the actual
validated absolute file paths, privately staged outside the repository/public
root and readable by `asymmetri-investment`. Set `INV_EXPERIMENT_ID` and
`INV_RUN_ID` from those same documents. Preserve their bytes/hashes in the private
release receipt; do not commit operational key material or fabricate JSON.

Keep HQ publication delivery held while validating the supplied materials and
capturing a consistent pre-activation backup. Follow the existing
[backup/restore runbook](INV-03-OPERATIONS.md): `backup` requires a gracefully
stopped receiver and a new receiver-writable destination outside its data tree.
Verify the full backup and retain the root-owned config/unit/source receipt.
Restart only the investment unit after the backup, verify its listener, then:

```sh
inv diagnostics
inv authorize "${INV_AUTHORIZATION_JSON:?supply the verified authorization file}"
inv approve-run "${INV_RUN_EVENT_JSON:?supply the canonical run.published preview}"
```

Record the stored publisher scope/key fingerprint, finite validity and exact
approved configuration hash. If approval fails after authorization, keep HQ held
and disable/revoke the newly granted authority as appropriate; do not enable
delivery or silently change the frozen configuration. An identical run approval
is a no-op; a different configuration for the same experiment/run conflicts.

HQ then enables only its finite investment delivery and sends the actual ordered,
signed EventBatch with POST to
`https://asymmetri.co/api/experiments/v1/experiments/{experimentId}/runs/{runId}/events`,
substituting the two real IDs. The signature authority is **`asymmetri.co`**, not
`www`, the loopback address or a redirected URL. Reconcile the immutable publication
receipt through its authenticated GET using current signed authority, and verify
the exact public run/configuration/visibility witness before selection.
Do not use a website-side synthetic publisher or manufacture sessions/results.

Inspect `GET /api/experiments/v1/experiments/{experimentId}`. Only if its current
`officialRunId` is null after successful signed ingestion, execute:

```sh
inv select-official "${INV_EXPERIMENT_ID:?supply the actual experiment ID}" \
  "${INV_RUN_ID:?supply the actual run ID}" -
```

The third argument is compare-and-swap: `-` means no previous selection. If a run
is already selected, inspect it and use that exact expected prior ID for an
authorized change. An uncertain success must be read back before retry: repeating
`-` after a successful selection conflicts. Selection requires a visible, locally
approved `observed_paper` run whose immutable kind is `official`; it cannot create
or ingest a run. Verify `officialRunId` and retain the selection audit afterward.

Installed code confirms `authorize`, `approve-run`, `select-official` and
`diagnostics` do **not** acquire `receiver.lock`; they can run with this listener.
Only `serve`, `migrate`, `cleanup`, `restore-fence`, `backup`, `restore` and
`reconcile-controls` use the exclusive lock. No restart is required merely to
load an authorization/approval/selection. Never remove a live lock.

Website reads are a separate final configuration step after receiver acceptance:

```text
ASYMMETRI_INVESTMENT_READ_ORIGIN=http://127.0.0.1:3101
ASYMMETRI_INVESTMENT_READ_AUTHORITY=asymmetri.co
ASYMMETRI_INVESTMENT_EXPERIMENT=<actual experiment ID>
ASYMMETRI_INVESTMENT_RUN=<actual run ID>
```

These are server-only runtime settings. Preserve the current website source/build
and enable them through its reviewed service configuration, then verify actual
public views, visibility witnesses, receipts and protected Motion routes. No
unrelated rebuild or Ask setting belongs to this operation. If public read
verification fails, hold/remove these read settings while preserving the accepted
archive and immutable receipts; never rewind the financial database as a page
rollback. Existing Ask admission/claims/delivery remain false throughout.

### Access status and remaining handoff

SSH administrator read-only inspection succeeded. The default filesystem sandbox
denied the initial Git fetch write; the approved escalated `git pull --ff-only
origin main` then succeeded with main already current. **No unresolved tool-
approval blocker prevented this preparation.** No mutating activation command was
attempted. The remaining input is HQ's real public key/finite scope and canonical
run event/configuration, including its durable generation and file hashes, followed
by the backed-up activation and genuine signed receipt reconciliation above.
HQ can consume this committed document directly; no outbound chat message is needed.

## Compatible website implementation

The canonical v1 manifest remains
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
No schema, migration, receiver financial invariant or signed transport is changed.

- Existing desk, research, discussions, decisions, portfolio/benchmark, journal and
  exact-record routes are reused. The methodology page describes `inv-real-open-v1`.
- Verified public run descriptions, frozen settings and limitations are displayed.
  The publisher owns the public descriptions; the website invents no owner quote,
  employee summary, observation or portfolio result.
- `observed_paper` is explicitly labelled observed market data with modeled paper
  results. Synthetic fixtures retain their labels. Failed verification is described
  as unavailable, not evidence that an experiment never started.
- A future-session decision precedes its target OPEN. The completed daily bar is
  retrieved after close; the OPEN is a modeled execution reference. The display
  separates market as-of, evidence availability/retrieval, ledger effective and
  accounting-recorded times. Exact records retain publication receipts.
- Journal and CSV show accounting/evidence clocks; source summaries expose their
  limitations. Holdings show mark retrieval time. Cash is labelled as cash at the
  last complete valuation, not unreserved spending capacity.
- Incomplete observations expose quality and reasons. Pagination does not imply
  newest data. Chart paths break across absent valuation sequences as well as null
  values; hidden records do not acquire an interpolated return.
- Ask BotSquad remains unavailable. No input, visitor session, private transcript,
  source-response body, credentials or operational control is added to public routes.

## Producer coordination and readiness

BotSquad owns the simulator, observed data admission, genuine employees, scheduler,
persistent history and public projection. Website preflight reviewed producer base
`b06bc51059372b633c98b68ecc3ef144f999781c` and its active INV-REAL-01 source. That
working source is not a deployment identity or acceptance result.

Independent review found the original simulator public projection synthetic-only,
and the original team projection capable of publishing selected raw private text.
These findings were sent to the producer chat. The producer acknowledged the need
for explicit public decision/review summaries with genuine execution provenance,
and an observed v1 projection using a 36,000-second opening-evidence window.
No observed payload is accepted merely because these changes are planned.

Before enabling observed reads, verify the producer's accepted commit, public-only
projection, real publication grant/key lifecycle, exact configuration approval,
signed end-to-end receiver acceptance and immutable receipt reconciliation. Existing
publication controls establish exact scope/content integrity, not a renewed Yahoo
licensing gate. The receiver version must supply `X-Archive-Visibility` before
website reads are configured. Preserve strict signed ingress; the old normalizing
HTTP proxy remains unsuitable. Private installation, website release and real
publisher activation need separate evidence even though deployment is authorized.

## Validation and review ledger

Two independent read-only reviews accepted the final source scope. Compatibility
review confirmed unchanged v1 support and identified producer projection blockers.
Website review corrected two P2 findings: timestamp precision and accessible
sequence-gap counts. Both fixes have focused regression tests.

- Node 24.10.0 matches `.nvmrc`; nvm is absent. Locked dependencies installed.
- `npm run check` passes (zero errors, one existing tutorial navigation warning).
- `npm run test:investment`: 5/5 pass, including sequence gaps and UTC precision.
- `npm run receiver:test`: 202/202 pass; original sandbox listener denial was
  resolved by approved loopback access. Canonical manifest check passes.
- Both `npm run build` (Sites/Vinext) and default `npm run build:next` pass.
- Root and receiver `npm audit --omit=dev`: zero vulnerabilities each.
- Actual browser widths 320, 390, 768, 1024, 1440 and 1920: no horizontal overflow,
  no broken images, two charts, frozen settings disclosure intact. Keyboard Enter
  toggles it with visible teal focus. Exact timestamps and fixture labels verified.
- Browser console initially had no errors/warnings. A CSV-download tool call stalled
  and eventually timed out; no new successful CSV-download claim is made. During
  the long stall, the disposable fixture exhausted its frozen-clock read quota;
  the visibility boundary correctly hid previously displayed records. Preview was
  stopped and its disposable archive removed. This was not a production incident.
- Reduced-motion styles remain unchanged; no OS-emulated or screen-reader audit is
  claimed. No public asset or dependency version changed.

Fixtures prove interface/accounting behavior, never genuine reasoning or elapsed
market sessions. Producer later delivered PR75 at deployed
`d262a8dff59ab82587bd6444b083e5e9b7603cf0`, with signed acceptance against this
compiled receiver (5/5). Its production account returned 401 at that earlier
acceptance, preventing an observed run or new employee authority then. HQ now
reports repaired private authentication; the initial signed publication is verified
above, while genuine employee/market execution remains to be observed.
Later Ask source PR77/78 remains separate.

## Production baseline and release receipt

Read-only preflight: clean production main
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`, service PID 2304100, activation
`2026-10-09 02:48:45 UTC`; 14 GiB free disk, 343 MiB available RAM and about 1.8 GiB
free swap. These are bounded observations, not load acceptance. Existing Node 22
approval remains effective. The unsupported Ubuntu 22.10 exception is reviewed for
this release; no OS upgrade or unrelated-site configuration change is included.
The isolated candidate passed production checks and the Next.js build before the
existing website service was switched at **2026-10-13 15:04:43 UTC**. Released source
is `97b4087b79c5f0f1472fd71dde86765489273400`, build
`kcKfT0zA-jDnr0xVy1Suy`; service PID 2369353. Production source is clean main.
The complete preceding source/dependencies/assets/build remain at
`/var/www/asymmetri-rollback-20261013-745a92c`, source
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`, build `Ic-zxi4WHpmgjiSDnsJCw`.
The temporary candidate listener was stopped after activation.

Production npm 10.9.8 rejected the existing lockfile with missing optional emnapi
entries. The candidate installed the unchanged lockfile successfully using pinned,
one-shot npm 11.6.0, matching local validation. No global npm/Node, lockfile or
dependency version was changed. The existing tutorial lint warning remains.

- All 28 checks across apex and www returned 200, including the four protected
  Motion routes, investment, methodology, Ask, robots and sitemap.
- Tutorial's exact www canonical, anchor IDs and original image URL sets match the
  pre-release baseline; all 48 image requests across both hosts return image/200.
  A local concurrent image probe hit a TLS timeout; the complete server-side HTTPS
  check passed. This does not establish a new persistent availability fault.
- All 15 discovered shared-vhost responses match their baseline, including the
  existing draft 502 and two relay 410 responses. Nginx/config hashes are unchanged.
- Website and Nginx are active; no service errors appeared in the release window.
  Public browser widths 1440 and 390 have no overflow, broken images or console
  warnings/errors. Temporary viewport overrides were reset.
- Investment explicitly displays **Public archive not configured**. Methodology
  displays the observed-paper method and owner-reported Yahoo confirmation. Ask
  accepts no questions. No receiver/publisher key, grant, run or read configuration
  was activated by this website release.

Sanitized detailed baselines and screenshots are retained outside tracked source.
The build identity above is the initial investment release. The later Ask page
release supersedes it; documentation-only commits do not change a running build.

## Remaining integration

Owner-only `approve-run` and `select-official` source now provide exact configuration
approval and explicit checked official selection without SQL edits or a wire/schema
migration; [commands](INVESTMENT_RECEIVER.md#observed-run-approval-and-official-selection).
The real generation-1 run approval and official selection above are now complete.

The private receiver compatibility installation is complete at
`c2edfd50ed12ba576c06e6991091090b9ced3e31`: 207/207 actual Linux tests and 61/61
isolated TLS checks. Runtime source is recorded in `/opt/asymmetri-receiver/SOURCE_COMMIT`;
rollback is `/opt/asymmetri-receiver/rollback-20261013-inv-real`. This initial
installation left it inactive. The later [shared HTTPS release](INGRESS_RELEASE_2026-10-13.md)
explicitly starts the listener while preserving zero events, batches, nonces,
content objects or publishers. Migration 2 integrity/FK checks pass. Website
PID/start/build remained unchanged during that ingress cutover; the later Ask
page release updates only the website. The ingress receipt records the Nginx changes.

[Private Ask](ASK-01-PRIVATE-RECEIVER.md) runs separately from that receiver
identity, with admission/claims/delivery disabled. Shared-apex HTTPS and installed
confinement/renewal are verified. Remaining: ongoing backup/retention custody,
ongoing as-of market history, real-use Ask content custody, finite Ask
budgets and actual employee/provider execution. Initial signed publication is now
verified above. [Typed-client synthetic
interoperability](ASK-01-INTEROPERABILITY.md#producer-typed-client-receipt) and
[local visitor UI acceptance](ASK-03-WEBSITE-UI.md) have passed; the public page
remains unavailable. No fixture or empty archive substitutes for genuine outcomes.


October 13 follow-up: private Ask source passed 227/227 actual Linux tests. The
shared-apex ingress source then passed 68/68 actual Linux checks with a bounded
480-request TLS workload; [ingress evidence](INV-03-INGRESS.md) preserves the exact
limits and production tasks. Native loopback Host mapping now supports the fixed
public authority without trusting visitor headers. These source checks did not
change the running website or create public receiver/Ask authority.
