# Prompt 070: Closed Ask receiver rollout

- Date: 2026-10-13
- Scope: deployment
- Goal: Install the reviewed Ask recovery/availability fixes while preserving closed intake, private state and unrelated services.

## Original user request

> i will be away. you are authorized for everything you need.

The owner previously authorized deployment and public release when ready without
another approval request. The current coordinated packet requested a separate
closed Ask receiver rollout of the already committed fixes, exact rollback and
state receipts, isolated acceptance, bounded real-host observations and an honest
record of remaining privacy, authority and capacity gates.

## Scope

Installed Ask source 4daa713, incorporating implementation 73276d4. The website,
ingress, investment service, Nginx, certificates and operational configuration were
preserved. No HQ account probe, model call, operational grant/key, roster, session,
question, answer or financial action was introduced. No native Mac workload ran.

## Decisions

- Compare exact source and compiled artifacts; only two Ask runtime files changed.
- Keep the existing schema, root-held configuration, generation and private store.
  A routine code swap does not justify a restore fence or new authority.
- Preserve independent code/dependency/configuration rollback before activation.
- Run candidate tests in isolated authored state under the installed service's
  memory/swap/CPU ceilings; record measurements without promising visitor capacity.
- Retain HTTP rate counters as valid protection metadata, separate from content
  and authority tables. Never erase them to match a stale snapshot.
- Classify pre-existing TLS failures explicitly instead of counting equal curl
  failures as healthy HTTPS.

## Implementation

The candidate passed strict TypeScript, build, canonical verification, all 236
receiver tests and a zero-vulnerability production audit on Linux/Node 22.23.1.
The sealed candidate matched the exact committed source and installed native
SQLite binary. Operational admission, claims and delivery remained disabled.

The first activation failed an overly short six-second startup check. Verified
old code was restored, then left stopped because a guard included changing HTTP
quota rows in its zero-count comparison. Configuration, generation and visitor/
authority tables were unchanged. The old listener was safely recovered without
resetting counters; measured startup was 7.31 seconds. Original failure, candidate
and recovery evidence were retained.

The corrected guard uses a monotonic 30-second readiness budget and validates
bounded HTTP quota metadata separately. Independent review also corrected rollback
ordering and required the final verifier to bind the successful source receipt to
a nonzero active process and verified-TLS closed API behavior. The identical
candidate then activated successfully: Ask PID 2384365, active since 19:38:30 UTC,
source `4daa713cd848f3798b87169ed3694bf2be0332f7`.

## Engineering impact

Authenticated exact-body session-create recovery now survives paused admission
while retaining ownership, cookie, expiry and restore-hold checks. Availability
reports a saturated queue as busy. The closed operational store cannot exercise
those paths without separately established authority. No dependency, contract,
schema, website UI, public asset or service-unit change was required.

The bounded test observation covered the running shared website/private services
plus an isolated authored test process, with no actual HQ/model workload. Real-use
privacy disclosure, application wiring, independent custody, finite authority and
combined workload capacity remain incomplete.

## Files changed

Added the exact receiver release receipt. Updated onboarding, private receiver and
deployment runbooks, readiness, integration and testing guidance. Added historical
clarifications to the website and ingress release records without rewriting prior
prompt journals.

## Documentation updated

The receipt pins installed and preserved identities, independent rollback paths,
root-held evidence manifest, first-attempt failure/recovery, quota handling,
resource observations, final confinement and remaining gates. Current deployment
language now distinguishes the production visitor client from its prohibited
synthetic fixture and the completed receiver rollout from the earlier source-only
website release. The latest HQ dormant source receipt was independently hashed;
its producer-reported tests do not establish operational custody or deployment.

## Git diff summary

Nine documentation files changed: 240 insertions and 12 deletions. This packet
documents deployment of existing reviewed application source; it changes no
application code. The current prompt record is excluded from these totals.

## Verification

- Main was clean and the required fast-forward pull succeeded before changes.
- Actual Linux strict check/build/canonical nine-file check and 236/236 receiver
  tests passed. Production dependency audit: zero vulnerabilities.
- In 259.08 seconds, 234 resource samples and 94 concurrent public HTTP checks
  were collected. All HTTP checks returned 200; candidate peak sampled memory
  was 114.28 MiB; minimum host available RAM was 343.97 MiB; no OOM kill occurred.
- Final 112 preservation observations comprise 104 verified HTTP observations,
  four fallback certificate fingerprints and four explicitly failing IPv6 TLS
  observations. Sixteen Nginx hashes and unrelated process identities matched.
  Protected Motion routes, tutorial canonical/fragments and original images held.
- The four other-domain IPv6 certificate-name failures predate this rollout.
  Their error/certificate and separately labelled unverified read-through
  fingerprints were preserved; no unrelated TLS repair occurred.
- Final verified apex TLS: availability 200/disabled, session creation 503 using
  the advertised privacy version, private/no-store, no cookies. Unowned read 404.
- Root configuration, private metadata and empty visitor/authority tables match;
  process UID/GID, zero capabilities, NoNewPrivileges and mount/resource limits
  were checked. HTTP protection counters were preserved as expected metadata.
- Independent source/operator reviews completed; their findings were resolved.
  Changed-document links resolve and whitespace checks passed.

## Repository state after implementation commit

Branch `main`, implementation `1958eb91c4f24e0f6541bf091588fcb89134e109`.
The tree was clean after implementation, one commit ahead of origin/main before
this separate archive commit. The installed Ask source remains 4daa713; subsequent
documentation commits do not change deployed code. The website remains d0c4543.

## Implementation commits

- `1958eb91c4f24e0f6541bf091588fcb89134e109` — Record closed Ask receiver rollout and retained recovery evidence.

## Archive commit

Record prompt 070 closed Ask receiver release journal

## Lessons learned

Cold startup under a CPU quota needs a realistic bounded readiness window. A
preservation guard must distinguish normal security counters from private content
and authority. A failed acceptance check must not prevent restoring verified old
code, and a successful early start does not prove a service stayed healthy through
final verification. Matching transport failures are evidence of preserved failure,
not evidence of healthy TLS.

Automatic approval review rejected a cross-chat progress message containing
deployment metadata because the available authorization was not specific enough
to its payload and destination. No alternate sending route was used; the concrete
release report remains available in this repository and the current chat.

## Follow-up ideas

Finish genuine HQ integration, independently held privacy recovery evidence,
reviewed disclosures, finite authority and combined workload acceptance before
opening questions. Existing unrelated IPv6 certificate failures require separately
scoped maintenance; this rollout preserves them rather than claiming repair.
