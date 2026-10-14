# Ask launch preparation: closed deployment

October 13, 2026 (America/Vancouver). This packet prepares the existing Ask
receiver and visitor interface. It does not authorize a provider request, buy
credits, approve a budget, provision credentials, issue a service grant, or open
public questions. Investment records and publisher authority are independent.

The canonical package is pinned to HQ source
`507f93afaa0d5e8ede28922e82fc677b8b5cc4e2`, manifest SHA-256
`4b61ab70b60f7660a7c2586b88666c5e00ce5ab9b849fb63295ffb095a5aae76`.
Only the input-token schema ceiling rises from 32,000 to 400,000, with an
explanatory protocol paragraph and regenerated manifest. Actual declaration
generation and all nine file hashes were independently checked on Linux.
Existing operational limits and every other DTO shape remain unchanged.

## Exact closed configuration

[`receiver/config/ask-launch-closed.json`](../receiver/config/ask-launch-closed.json)
contains the complete closed production configuration read on October 14 at
04:41 UTC. It preserves the listener, private directory, database identity,
illustrative limits and empty roster. Its values match live configuration SHA-256
`ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c`.
Do not install it over an independently changed configuration. Compare the entire
parsed object and the expected live digest first.

| Field | Preserved value |
| --- | --- |
| Service / notice | `asymmetri-ask` / `ask-privacy-v1` |
| Origin / authority | `https://asymmetri.co` / `asymmetri.co` |
| Bind address | `127.0.0.1:3102` |
| Data / separate public archive directory | `/var/lib/asymmetri-ask` / `/var/lib/asymmetri-investment` |
| Listener / admission / claims / delivery | true / false / false / false |
| Roster | `disabled-ask-roster-v1`, no workers |
| Archive HTTP adapter | null origin and authority; nonempty context cannot be admitted |
| Configuration approval / spending | `synthetic_only`, null approval record and budget, `unavailable_disable_paid_admission` |
| Existing generation / hold | `0` / false; no active key or visitor content |

The production notice registry remains empty. A receiver reporting `available`
cannot expose a composer without a reviewed exact service/notice pair. New
receiver sessions, conversations and questions require all three operational
flags plus current authority and a fresh privacy-control barrier. New conversations
and questions additionally require the session's current notice version. These
checks follow exact authenticated receipt recovery; existing owned reads and
privacy controls remain usable when new intake is paused or consent changes.

## Activation inputs still required

These are missing facts, not placeholder operational values:

- An explicit owner-approved finite spending ceiling and approval-record ID;
  a credential held only by HQ; independently verified provider eligibility.
- A dedicated Ed25519 Ask public verification key and exact key ID, positive
  generation, integer `notBefore`/`notAfter`, UTC scope expiry and permissions
  `claim`, `control_sync`, `status`, `answer`, `receipt`. The initial grant advances
  generation zero; neither key nor scope may outlive the 24-hour generation window.
  The offline authorization file has exactly `scope`, `publicKey`, `notBefore`
  and `notAfter`. Do not derive authority from investment publisher keys.
- The actual HQ-approved roster version, worker identities, topics, responsibilities,
  eligibility and research policy. The public Investment Atlas/Maya roster and
  their existing portraits alone do not establish Ask execution eligibility.
- All exact `AskLimits`, including retention, daily tokens/executions, input/output
  bounds and duty cycle. Reuse `verified_cap` only with a positive decimal-string
  budget and proven durable HQ enforcement; it excludes `subscriptionActivityPolicy`.
  Receiver limits alone do not establish a cost cap.
- Either a reviewed general-question-only scope or verified loopback archive
  adapter configuration for exact public context. Do not claim context support
  while both adapter fields are null.
- The exact approved privacy notice and consent text, bound to the agreed service
  and new notice version. Retention values and provider facts must agree across
  the receiver, HQ, signed configuration and public notice before intake opens.

The proposed API fallback, model pin, conservative reservation and $5/24-hour
ceiling are HQ proposals pending owner authorization and executable evidence.
They are not installed values. A schema maximum does not change per-service limits.
The existing proxy conservatively shares a network bucket across visitors:
10 new sessions/hour and 20 questions/hour, plus 50 questions/day or the smaller
configured daily execution limit. No throughput promise is inferred from those caps.

## Verified custody and notice boundaries

The October 14 04:41 UTC read-back confirmed empty session, conversation, question,
answer and service-key tables. Ask retains its dedicated UID and private directory.
Its actual process has core limits 0/0 and core filter `00000000`; systemd reports
192 MiB memory, zero swap allowance and 32 tasks. These facts supplement the
[operational receipt](ASK-04-OPERATIONS_2026-10-13.md), not a claim of encrypted
storage or physical-media erasure.

The currently closed example uses 24-hour sessions, seven-day raw retention and
30-day suppression retention. Session expiry or deletion can purge text earlier.
Request cleanup and the 30-second lifecycle sweep manage receiver deletion.
Hashes, identifiers and suppression receipts remain private after body purge.
Privileged host operators and the service identity can access stored data.

Receiver logs exclude bodies; Nginx access metadata can contain IPs and paths.
The inspected Nginx rotation is daily with 14 retained rotations and delayed
compression. Journald has no explicit retention override. These settings establish
neither exact elapsed-day deletion nor absence of other host logs. Recovery
directories `before` and `restore-check` remain mode 0700 under the Ask identity;
the supported recovery projection excludes bodies, session credentials and active
authority. These are same-host copies, not verified off-host disaster recovery.

The timer and cron inventories did not establish provider snapshot coverage,
external backup exclusion, encrypted off-host custody, or a disposal schedule.
HQ-side retained attempts, provider uncertainty and deletion/recovery behavior
also require evidence. No public notice may promise exclusion or deletion that
these observations do not prove.

The receiver has one transactional SQLite/WAL store for bodies, authority,
receipts and controls; it has no separate `contentDirectory`. Moving `dataDir`
to `/run` would also discard durable suppression and authority on reboot.
Tmpfs is therefore not a drop-in fix for backup custody. A body-only ephemeral
store would require reviewed atomicity/crash/recovery changes, and HQ-only tmpfs
would not alter the receiver's disk boundary.

For the proposed API path, `store:false` does not itself establish zero retention.
OpenAI documents abuse-monitoring retention of up to 30 days by default, with
exceptions; special retention controls require eligibility and approval. The
actual account's controls remain unverified. See the official
[API data controls](https://developers.openai.com/api/docs/guides/your-data).
The [subscription token-sharing documentation](https://developers.openai.com/siwc/token-sharing-open-source)
does not establish entitlement for this remotely hosted public Ask service.

Public wording can be approved only after the unresolved facts are supplied.
It must explain who receives question/history/context, operator access, actual
receiver/HQ/provider retention, research recipients (if any), cancellation and
deletion limits, logging and backup custody. No draft is inserted into
`approvedAskPrivacyNotices` by this preparation.

The versioned `candidateAskApiPrivacyNotice` in `content/site.ts` prepares
`asymmetri-ask` / `ask-api-privacy-v1`. It is deliberately outside the approved
registry and is not an advertised runtime notice. The closed page now describes
the proposed API route, replacing its superseded subscription proposal, and links
the official provider data controls. Truthful limits and explicit unknowns meet
the consumer disclosure requirement; a guarantee of universal physical erasure
or a speculative storage split is not required.

HQ's proposed notice inputs are a one-hour session, ten-minute queue, 24-hour
maximum raw retention, 30-day suppression records and eight answered history
turns. Only OpenAI would receive inference content; external research is disabled.
Non-content accounting, response identifiers and consumed authority persist for
audit. HQ proposes separate private, authority and custody directories outside
its company tree and ordinary backup root. Those paths, backup exclusions and HQ
swap settings are not yet provisioned or independently verified. The candidate
notice says so; activation must replace proposal language with the measured facts
and bind identical limits/version across HQ, receiver and website.

## Closed release and rollback sequence

1. Confirm the sole writer and serialized Linux slot. Snapshot expected source,
   configuration hashes, Ask metadata/counts, investment scope/existing rows,
   peer process/start identities and protected Motion responses before changes.
2. Validate exact canonical manifest and strict types; run authored admission,
   consent, recovery and UI checks plus standard builds/audit. Use isolated Linux
   staging under the service account, bounded memory and serial tests. Genuine
   model acceptance requires its separate explicit finite authority.
3. Prepare application-owner candidates. Before production activation, run the
   documented Node 22 checks/build and candidate smoke tests. Preserve complete
   rollback trees and manifests. Do not reuse a Node 24 native SQLite binary in
   a Node 22 candidate. Never replace a live build while building it.
4. Leave the live configuration, empty notice registry, keys, generation and
   databases unchanged. Replace/restart only the exact service whose candidate
   passed; independently verify the other services and Investment state.
5. Verify apex/www Ask and Investment, portraits/navigation, Motion `/motion`,
   `/privacy`, `/support`, `/tutorial`, tutorial canonical/hashes/original images,
   and unchanged peer-service baseline (including any pre-existing inactive unit).
   Ask availability stays disabled and session creation returns 503 without a
   cookie; private responses retain no-store. Stop and roll back the changed
   executable tree if any required postcondition fails.
6. Retain bounded non-content receipts and actual source/build/runtime identities.
   Report closed deployment separately from genuine employee acceptance. Release
   the Linux slot after terminating all validation processes.

An ordinary restart must not reset accounting, provider uncertainty, generation
or privacy controls. For recovery, use the existing offline exclusive lock,
non-content backup, isolated held restore, independently current journal captured
within five minutes and canonical digest verification. Reconcile above both
generation values, then obtain newer finite authority and drain controls fully.
Never use a stale backup to restore private text or infer a fresh execution grant.


## Validation status before release

The isolated Node 24.21 Linux run passed website TypeScript/ESLint (one existing
Tutorial navigation warning), receiver TypeScript/build, exact canonical file and
actual declaration generation checks, authored UI/Investment helpers, Vinext and
standard Next builds. Both production dependency audits returned zero findings.
No model or research provider was called.

The matching Node 22.23.1 / better-sqlite3 13.0.3 website-host profile passed all
257 native tests, including interrupted recovery and real crash boundaries.
The 311.8-second supervised run measured 196,464,640 bytes peak memory, zero swap,
and minimum host MemAvailable 243,564 KiB. All 62 public probes passed and existing
service identities were unchanged. The task's 77 MiB candidate and disposable
copy used an explicit 6 GiB free-disk floor on a host with 7.57 GiB initially free;
the 192 MiB available-memory floor was retained.

A later final TypeScript compilation was stopped by the resource/public-health
guard; it is not a passing build. Independent read-back confirmed preserved live
state afterward. Final compilation is moved to the larger reserved Linux host,
using the existing Node 22 executable and native dependencies. The executable
SHA-256 is `93956de2e59480474a7b46571da1651180b1a050cdf32641ebec4ce6e478e068`.
The earlier failed native install on the larger host encountered missing `make`;
its node-gyp header-cache attempt outside staging is recorded, and no system tools
were installed. Subsequent native validation reuses the matching existing files.

The strengthened consent test additionally cancels the old outstanding question
and drains controls before checking obsolete consent; an outstanding-turn conflict
cannot mask the version gate. It passed 3/3 on the confined website host and again
3/3 on the larger Linux host using the exact Node 22 executable/native package.
The final receiver typecheck, build, actual contract generation, minimal-lockfile
dry run and 21 UI/Investment helper checks also passed there. Resource supervision
observed at least 1,330,180 KiB available memory and unchanged peer services.

The disposable browser fixture passed general and contextual follow-up submission,
worker attribution, old publication versus new retrieval date, unknown event date
and source limitations; context removal stayed disabled during a delayed preflight.
Two normal refresh cycles over 37.28 seconds preserved both keyboard focus and
scroll position. Failed reads hid bodies while deletion stayed usable. Exact
interrupted-request replay recovered the third question with intake disabled;
the server delay was preserved, and cancellation/deletion still succeeded.
There were no console errors/warnings and no horizontal overflow at 320, 390,
768, 1024, 1440 and 1920 CSS pixels. Existing reduced-motion rules were inspected;
the browser did not offer media emulation, so that setting is not claimed tested.
The local HTTP cookie adapter is authored interface evidence, not production TLS
or genuine model acceptance. It and its disposable data were stopped/removed.

The final Node 22 website check, Vinext build and standard Next build passed with
the existing Tutorial lint warning and zero production-audit findings for both
packages. Next build ID is `3eDBZMdlma5Ug7_iw_ZES`. All 243 runtime/source files
(excluding documentation) matched the local source manifest, SHA-256
`bd6374995f54405ad57931fbb3cf27cb39f68c6c41de60347862e18a3c5a7a47`.
Website validation retained at least 1,073,384 KiB available memory, with peer
identities unchanged. The Linux slot was released after artifact packaging.

These are preparation results. The deployment receipt records installed source
and service identities separately; this packet is not an activation receipt.
