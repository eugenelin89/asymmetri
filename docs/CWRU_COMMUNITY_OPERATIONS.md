# CWRU public-profile operations

Players can publish their own public character, edit or delete it, recover ownership with a private code, and report other profiles. This is separate from UBC, Motion and BotSquad. Affiliation is self-described; walking routes are simulations.

## Local runtime and production hosting

Set `CWRU_PROFILE_DIR` to a private absolute directory outside the source checkout and public tree. Unconfigured hosts return 503 with a clear unavailable message. Production was provisioned October 31: `/var/lib/asymmetri-cwru-community` (application-owned 0700; `community.json` 0600) and `/etc/systemd/system/asymmetri.service.d/40-cwru-community.conf`. Preserve both across deployment and rollback; see the [release receipt](CWRU_RELEASE_2026-10-31.md).

```sh
CWRU_PROFILE_DIR=/private/tmp/cwru-community-validation npm run dev:next -- --webpack --hostname 127.0.0.1 --port 3031
```

Endpoints are under `/labs/cwru/community-api/`; the HttpOnly, SameSite=Strict ownership cookie is `cwru_profile_owner`, scoped to that path and Secure outside development. Never share the UBC store directory. Node deployments need persistent filesystem storage and a trusted proxy that overwrites `X-Real-IP`; the current release uses the existing verified proxy. Cloudflare/Vinext build compatibility alone does not provision filesystem persistence. Mutations require an allowed site origin, bounded JSON requests and rate limits. No account provider, dependency or separate port is introduced.

## Ownership, moderation and durability

The store saves only ownership/recovery secret digests. The one-time recovery code is shown privately to its owner; do not collect or log it. Profiles accept bounded plain text without URLs/contact details and normalized procedural avatar settings. No portraits or uploaded media are accepted.

Run these commands as the application owner with the intended private `CWRU_PROFILE_DIR` environment variable already set:

```sh
node --import ./projects/cwru/test-loader.mjs projects/cwru/community/admin.mjs reports
node --import ./projects/cwru/test-loader.mjs projects/cwru/community/admin.mjs hide PROFILE_UUID
node --import ./projects/cwru/test-loader.mjs projects/cwru/community/admin.mjs restore PROFILE_UUID
```

Reports contain participant text and must not be pasted into public logs or journals. Hiding removes a character from the public feed; normal clients refresh within 60 seconds. Owners cannot undo moderation through edits. Reports are deduplicated by temporary source hash and expire after 90 days during report processing. Capacity is 2,000 profiles and 5,000 reports.

Private writes use a directory lock, 0600 temporary file, fsync, atomic rename and directory fsync. Unknown schemas fail closed. If a crash leaves a stale `.write-lock`, stop the relevant application, confirm there is no writer, preserve a private backup, then remove only that stale lock before restarting. Never clear participant data as a repair or rollback shortcut. Backups require the same access protection as live data; this implementation does not establish an off-site backup service.

Local validation created disposable synthetic profiles, exercised publishing, read/edit/recovery, rejected a cross-site mutation, and removed the fixtures. No real person’s profile was submitted during testing. Private candidate and public acceptance repeated the lifecycle successfully, then removed the synthetic fixtures. Future releases follow the same protected-store release workflow.
