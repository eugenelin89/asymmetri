# Campus reviews operations

Status: implementation prepared and locally tested. No production activation or public-data migration is claimed here. The release owner must separately verify the live environment, writable persistence, API behavior and rollback before reporting deployment.

The shared review service serves UBC, Case Western Reserve University and Stanford at `/labs/campus-reviews-api/{campus}` and `/labs/campus-reviews-api/{campus}/report`. It uses Next's Node runtime, native Request/Response handlers and the existing TypeScript dependency. It does not reuse or alter UBC public-profile storage. See [the module contract](../projects/campus-reviews/README.md) for exact request and response fields.

## Configuration and persistence

Set `CAMPUS_REVIEWS_DATA_DIR` in the application service environment to an absolute path outside the application checkout and outside any publicly served directory. Provision it as the application owner with mode `0700`. The service creates `reviews.json` with mode `0600`. It rejects a public directory/file, symlinked data file or a path that resolves inside the checkout. Do not place this directory under `public/`, a runtime release directory or a temporary build tree.

For example, for local development only:

```sh
mkdir -p "$HOME/.local/share/asymmetri-campus-reviews"
chmod 700 "$HOME/.local/share/asymmetri-campus-reviews"
export CAMPUS_REVIEWS_DATA_DIR="$HOME/.local/share/asymmetri-campus-reviews"
npm run dev:next
```

On the production host use a persistent application-owned directory selected by the deployment owner; do not copy the local path verbatim. The environment must be loaded when the service process starts. Missing or invalid configuration returns 503 instead of silently using local or ephemeral storage. Existing records must survive source deployments and runtime rollback.

The version-1 file contains public review fields, campus IDs, SHA-256 ownership hashes, moderation state, reports with hashed reporter capabilities and minimal moderation tombstones. Raw owner tokens, email addresses and IP addresses are not persisted. Treat the entire file as private. Backups have the same access restrictions and must not be committed or copied into public release artifacts.

Capacity bounds are 5,000 reviews, 10,000 reports, 10,000 moderation tombstones and a 48 MiB file. Exhausted capacity fails with an error; it does not discard reviews. Report records older than 90 days are pruned on subsequent report writes. There is no background retention job, and review text is not automatically expired.

## Publication, ownership and reporting

New reviews publish immediately. Visitors may use a display name or nickname. One review is associated with one anonymous browser capability for each campus. This is not verified identity or proof of a campus visit. Clearing cookies, another browser/profile or another website hostname can establish a separate capability. There is no account recovery workflow.

The API establishes an opaque cookie on a same-origin initial GET. The cookie is HttpOnly, SameSite Strict, lasts one year and has path `/labs/campus-reviews-api`. It is Secure except in development. Apex and `www` use host-only cookies. The UI must finish its initial GET before enabling writes. A missing cookie returns 401 and asks the visitor to reload.

POST creates or updates the owner's record; PATCH requires an existing record. DELETE removes the owner's review text and associated reports. An owner cannot edit another browser's record, and campus routes are isolated. Names and comments are plain text, with no HTML rendering.

A report contains an allowed reason and the review ID. Reports deduplicate by review and reporter capability. They never hide content automatically. Moderators must review reports and choose an action.

Hiding preserves the review privately, removes it from public lists and rating statistics and prevents owner edits. The owner can see its hidden status and remove its text. Moderator removal, or owner removal of a hidden review, retains only the review ID, campus, ownership hash and moderation timestamp as a tombstone. That browser receives `viewerReview: null` and `viewerReviewStatus: "hidden"`; POST and PATCH remain forbidden. This prevents edit/delete/recreate from bypassing moderation while allowing text removal. Clearing cookies can evade browser-level restrictions, which is an inherent limit of anonymous access.

## Private moderation CLI

Run the CLI as the application owner from the checkout, using the same `CAMPUS_REVIEWS_DATA_DIR` as the running application. The loader uses the existing TypeScript dependency. The CLI and API share the same write lock. There is no public administrator endpoint.

```sh
node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs reports
node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs reports ubc
node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs reports stanford --all
node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs hide ubc REVIEW_ID
node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs restore ubc REVIEW_ID
node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs remove ubc REVIEW_ID
```

Replace `REVIEW_ID` with the UUID from the private report output or the selected public review. `reports` lists unresolved reports; `--all` includes resolved reports retained in the file. Report output contains the reported review's text but not owner/reporter hashes. Keep terminal exports private.

`hide` removes the review from public display and resolves pending reports. `restore` republishes an existing hidden review and resolves pending reports. `remove` deletes text and reports and creates a moderation tombstone. Restoring a tombstone returns `{restored: false, unblocked: true}`: it permits a new submission from that browser but cannot recover deleted text. Review evidence and backups before permanent removal.

## Request and abuse controls

Mutations require an exact allowed Origin matching the request host and reject `Sec-Fetch-Site: cross-site`. Production origins are HTTPS apex and `www`; matching localhost/loopback origins support local testing. Arbitrary `X-Forwarded-Host` is not trusted. The production proxy must overwrite `X-Real-IP`, as it does for existing campus profiles; do not expose the application port directly as an alternative ingress.

JSON bodies are capped at 8,192 actual bytes and 10 seconds. Invalid UTF-8, unknown fields, out-of-range ratings, nonempty honeypots and unsafe control characters are rejected. Name and comment limits are 60 and 2,000 JavaScript string characters. Comments are optional.

Per-process rate limits use salted ephemeral IP hashes, never persistent raw IPs. Limits per client are 120 reads/minute, 20 create/edit/delete requests/hour and 10 reports/hour. Global process limits are 3,000 reads/minute, 120 writes/minute and 120 reports/minute. At most 4,096 buckets are retained; expired entries are discarded. Invalid/missing proxy IPs share one fallback bucket. These controls are bounded best-effort protection, not a distributed anti-abuse service; restarting the process resets them. Error responses use `Retry-After` where applicable.

## Backup, rollback and failure recovery

Writes take an exclusive `.reviews-write-lock` directory lock. They read and validate the current file, write a unique mode-0600 temporary file, sync it, atomically rename it to `reviews.json` and sync the directory. API processes and the moderator CLI use the same mechanism. Readers see either the previous or next complete file. Failed validation preserves existing data; unsupported schema versions are never reset automatically.

For a routine backup, copy the committed `reviews.json` to a private, timestamped backup and verify its bytes/hash and permissions. Atomic replacement prevents a partial source snapshot. For a coordinated backup of records together with service/configuration changes, stop writers first. Do not back up a temporary `.reviews-*.tmp` file as the authoritative dataset. Do not export review or report contents to public logs.

A runtime rollback should keep the current external data directory. Do not replace newer visitor records with an old release copy. If a data restore is genuinely required, stop the app and all moderator CLI processes, preserve the current file and any temporary files privately, inspect the failure, then restore a known valid backup with mode `0600` and correct application ownership. A restore can lose submissions newer than that backup; reconcile them before restarting. Never overwrite or delete `reviews.json` merely to clear a 503 error.

A process killed during a write may leave `.reviews-write-lock` behind. The service intentionally does not break locks based on age: a slow but active writer could still own it. A stale lock makes mutations return a busy 503; public reads of valid committed data can continue.

To recover a confirmed stale lock:

1. Stop the application service and all moderator CLI processes that use this directory.
2. Verify that no writer remains, including a second runtime/process during deployment.
3. Preserve `reviews.json` and inspect any `.reviews-*.tmp` files privately. A temporary file is not automatically newer, valid or committed.
4. Remove only the empty `.reviews-write-lock` directory. Prefer `rmdir` so unexpected contents are not deleted silently.
5. Verify the committed file and private permissions, restart the service, and test a controlled lifecycle in an isolated test store. Use only nonpublishing checks against production.

Never remove a lock while writers may still be running. Never delete the entire data directory as a recovery step.

## Validation and release checks

Automated command:

```sh
node --test projects/campus-reviews/reviews.test.mjs
```

The current 13 tests pass, including real concurrent child-process writers and CLI moderation, persistence/restart, browser and campus isolation, aggregate/pagination behavior, hidden/tombstone rules, report deduplication and retention, origin enforcement, streaming body limits, cookie attributes, bounded rate memory and failure-safe storage. Scoped strict TypeScript and ESLint checks also passed. These are local implementation results, not proof of production deployment or physical-device behavior.

Before activation, build and validate the integrated site, confirm persistent configuration, and preserve the existing store. This release integrates the review section above UBC’s footer; the CWRU and Stanford threads own their integrations and acceptance. Exercise the full GET/POST/PATCH/DELETE/report lifecycle, cookie ownership, moderation and campus isolation against disposable private stores. After activation, use public reads and nonpublishing rejection checks, and verify the actual interface at mobile and desktop widths with keyboard navigation. Do not publish synthetic production reviews. Report actual public verification and remaining limitations in the release receipt.
