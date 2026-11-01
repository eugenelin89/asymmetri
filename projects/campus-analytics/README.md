# Private campus play statistics

Shared implementation for the UBC, Case Western Reserve University and Stanford virtual campuses. Implementation and local validation are complete; this README does not claim production activation or that scheduled cleanup is installed.

This release wires the feature into UBC. CWRU and Stanford page integration belongs to their respective project workstreams; the shared API already supports all three.

The browser sends only a random session UUID, an event name and an increasing sequence number. The server records a separate random browser-cookie hash, campus, server timestamps, approximate active-session duration and the first/last valid source IP and User-Agent for that session. It does not record input content, coordinates, email, account/profile identity or a fingerprint, and it does not join records with public profiles or reviews.

`uniqueBrowsers` counts observed cookie capabilities, **not people**. Separate browsers, cleared cookies and the apex/`www` hostnames can count the same person again. Shared browsers can represent multiple people. IP and User-Agent are unverified network/browser metadata, not proof of identity or a campus visit. Concurrent tabs can contribute overlapping active-session seconds; totals are not person-hours.

## Collection and privacy

The client waits for active gameplay. Its activity gate requires a visible document, an on-screen game region and input within the last 90 seconds. It sends a heartbeat about every 15 seconds, pauses on inactivity/hidden/off-screen state and ends on departure where possible. It retains only the time of input, never the input value. See [client lifecycle notes](CLIENT.md).

Previously saved opt-outs continue to disable recording for all three campuses on the current hostname. Browser GPC/DNT signals disable collection in both client and server. The client also skips collection if safe shared storage or Web Locks are unavailable. Origin Web Locks serialize analytics requests and deletion across tabs; the preference is read afresh inside the lock.

At the owner's request, UBC and the shared privacy article no longer render the Play privacy card, its checkbox or its deletion button. UBC retains a standard Privacy link to the plain article, which explains collection, browser signals, saved opt-outs, retention and contact information for removal requests. The exported component is retained temporarily for compatibility with other campus workstreams; those owners remove their own imports. This UI change does not alter measurement or its backend. See [the UI follow-up](../../docs/UBC_PRIVACY_UI_2026-10-31.md).

The host-only `campus_analytics_visitor` cookie contains a random 256-bit capability, is HttpOnly, SameSite Strict and Secure outside development, and is scoped to `/labs/campus-analytics-api` for one year. No analytics cookie is required to explore the campus.

A first cookie-less start **does not persist a session or IP/User-Agent**. It returns a cookie-only bootstrap. The client repeats the same start once under the same lock. Only a request that echoes the cookie can create a record. A lost bootstrap response or blocked cookie therefore leaves no orphaned analytics record.

## API

`POST /labs/campus-analytics-api/{ubc|cwru|stanford}` accepts exactly:

```json
{"sessionId":"a UUID v4","event":"start","seq":0}
```

Supported events are `start`, `heartbeat`, `pause` and `end`. A new session starts at sequence zero. Increasing `start` resumes a paused session. An ended session is terminal; a new visit uses a new UUID. Duplicate and out-of-order sequence numbers are accepted without adding time. Another cookie cannot modify an existing session. Client-supplied elapsed time, identity or timestamps are rejected.

Normal response: `{accepted: true}`. Cookie bootstrap response: `{accepted: false, initialized: true}`. The client retries an initialization once with the identical payload; repeated initialization means cookies are unavailable and collection stops silently.

Server-clock elapsed intervals are credited only while the preceding session state was active. Each interval contributes at most 35 seconds. A gap greater than 45 seconds contributes zero, preventing a sleeping/background/offline tab from adding hours. Pause/end can credit the final bounded interval. UTC daily buckets split intervals across midnight. This is conservative approximate telemetry, not a verified measure of attention or learning.

`DELETE` on a campus endpoint with `{scope: "all"}` erases that cookie's records across all three campuses and expires the cookie. `{scope: "campus"}`, an empty object or no body erases only the named campus and retains the shared cookie. Missing-cookie deletion is idempotent success. Response: `{removed: true}`. Deletion remains allowed with GPC/DNT enabled. The retained compatibility component first opts out, drains its pending requests and acquires the shared lock before calling deletion; UBC and the shared privacy article no longer render that control. Deletion applies to the current browser capability on this hostname, not unrelated browser identities, hosting logs or private backups.

There is **no public statistics, report or administrator endpoint**. Requests other than POST/DELETE are unsupported. Mutations require an exact allowed Origin matching the request host and reject cross-site fetches. JSON bodies are capped at 1,024 bytes and 10 seconds. Errors return `{error}` with appropriate 400/401/403/404/408/413/415/429/503 statuses.

The production proxy must overwrite `X-Real-IP`, and the application listener must remain private. Only a valid single IP literal is accepted; absent/invalid values become `null`. Forwarded chains are never guessed. User-Agent is stripped of control characters and capped at 256 characters. Per-process rate limits are 240 collection events/minute/client and 20 deletions/minute/client, with global limits of 3,000 and 120 respectively. At most 4,096 ephemeral salted-IP buckets exist; raw rate-limit IPs are not persisted.

## Private storage and retention

Set `CAMPUS_ANALYTICS_DATA_DIR` to an absolute application-owned mode-0700 directory outside the checkout and every public tree. The Node service writes mode-0600 `analytics.json`. Missing/invalid configuration fails closed; there is no ephemeral production fallback. This directory is separate from both campus review data and public-profile stores.

Raw first/last IP and User-Agent details expire **30 days after session start**. At that cutoff they are removed, while session timestamps, daily duration buckets and the pseudonymous browser hash remain. The entire session summary/hash expires **90 days after session start**. There is no additional indefinite aggregate archive.

Retention runs during accepted store operations and private reports. Install and monitor a daily `prune` job so quiet periods also receive cleanup. Cutoffs are applied on the next cleanup; a daily schedule can lag by up to its interval, and outages require catch-up. Do not describe scheduled deletion as deployed until the timer's success and next run have been verified. App deletion/cleanup does not erase separate hosting logs or retained private backups; operators must manage those independently.

The store is bounded to 20,000 session records and 32 MiB. At capacity it rejects new records rather than discarding accepted history. It uses one private JSON file with an exclusive directory lock, atomic rename, file/directory sync and deep validation. This is a bounded low-volume implementation, not a distributed analytics service.

## Operator commands

Run as the application owner, from the deployed checkout, with `CAMPUS_ANALYTICS_DATA_DIR` supplied in that process environment:

```sh
node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs report
node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs report ubc 7
node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs report all 30
node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs report stanford 30 --sessions
node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs prune
```

`report [campus|all] [1–90]` defaults to all campuses over 30 UTC calendar days including today. It returns period bounds, session count, unique-browser count, active-session seconds and daily rows. A session continuing from an earlier day is included when it contributes activity during the selected period. Daily session counts are not additive across days. There is no IP/User-Agent or browser hash in default output.

Only explicit `--sessions` includes session-level timestamps, duration and still-retained source details. A session with no event for more than 45 seconds is labelled inactive; this status is approximate event history, not live campus occupancy. Treat that output as private personal data; do not copy it into public logs, issues, screenshots or journals. Even detailed output omits the cookie and internal browser hash. `report` also performs retention, so it may update the file. `prune` prints only removed/redacted counts and is suitable for a private systemd job.

The existing loader uses the repository's TypeScript dependency; no package was added. Production uses the approved Node 22 runtime, while local validation uses `.nvmrc`.

## Backup and rollback

Keep private backups separate from public artifacts, with mode 0600 and an explicit retention policy. Preserve current visitor data during runtime deployment/rollback. Never overwrite `analytics.json` with an empty file to clear a 503, and never restore an old backup over newer records without reconciliation. Unknown schema/corrupt files fail closed and remain available for inspection.

A killed writer may leave `.analytics-write-lock`. Stop all app and cleanup/CLI writers, preserve the committed file and inspect temporary files privately, then remove only the confirmed-stale empty lock with `rmdir`. Never break a lock based solely on age.

A cleanup timer that imports from `/var/www/asymmetri` must be stopped and drained during whole-runtime swaps. Re-enable it after a compatible runtime becomes healthy. If rollback restores a version without this module, preserve the store and arrange daily pruning from the retained compatible runtime; do not silently leave personal data without cleanup. No timer/service installation is performed by the source module itself.

## Validation

```sh
node --test projects/campus-analytics/analytics.test.mjs
node --test projects/campus-analytics/client.test.mjs
```

The backend's 16 tests passed locally: server-clock accounting, paused/resumed/ended states, duplicate sequencing, inactive gaps, UTC boundaries, browser/campus isolation, deletion, raw/summary retention, private CLI projection, real cross-process writes, capacity preservation, failure-safe locking/storage, request limits, GPC/DNT and lost/parallel cookie bootstrap. Scoped strict TypeScript and ESLint also passed. Client test totals and integrated browser/device/deployment results are recorded separately by the release owner.
