# UBC public-profile operations

Public profiles were explicitly requested by the owner, with immediate publishing
and reporting/removal controls. This is separate from Motion, BotSquad receivers
and every other website on the host.

## Runtime

Use Node 22.23.1 production or the repository's local Node 24. Set `UBC_PROFILE_DIR`
to a private absolute directory outside the source checkout and public tree.
The server refuses profile access with 503 when unconfigured. Do not point this
at a release directory that will be replaced during deployment.

Production location: `/var/lib/asymmetri-ubc-community`, owned by `django-user`,
directory mode 0700 and `community.json` mode 0600. The intended systemd drop-in is
`/etc/systemd/system/asymmetri.service.d/30-ubc-community.conf` containing only:

```ini
[Service]
Environment=UBC_PROFILE_DIR=/var/lib/asymmetri-ubc-community
```

Its activation/verification is recorded in the release receipt. No separate server,
port, database package, account provider or proxy route is needed. Profile endpoints
use `/labs/ubc/community-api/` through ordinary website ingress. The shared `/api/`
namespace is reserved for separate investment/Ask services and rejects unknown
prefixes; do not weaken that routing boundary for UBC. The existing
Asymmetri proxy was inspected and overwrites `X-Real-IP` with `$remote_addr`; this
is required for source-specific limits. Never expose the Node listener directly.
Cloudflare/Vinext build compatibility does not provision Node filesystem storage.

Local example, with disposable data outside Git:

```sh
UBC_PROFILE_DIR=/private/tmp/ubc-community-validation npm run dev:next -- --hostname 127.0.0.1 --port 3026
```

## Moderation

Run the following **as the application owner**, from the deployed checkout, with
the configured private path. Reports contain participant text; do not paste them
into public issues, logs or engineering journals.

```sh
UBC_PROFILE_DIR=/var/lib/asymmetri-ubc-community node --import ./projects/ubc/test-loader.mjs projects/ubc/community/admin.mjs reports
UBC_PROFILE_DIR=/var/lib/asymmetri-ubc-community node --import ./projects/ubc/test-loader.mjs projects/ubc/community/admin.mjs hide PROFILE_UUID
UBC_PROFILE_DIR=/var/lib/asymmetri-ubc-community node --import ./projects/ubc/test-loader.mjs projects/ubc/community/admin.mjs restore PROFILE_UUID
```

Review reports regularly. Hiding removes the character from the public API and
subsequent client refresh (normally within 60 seconds); the owner can still remove
the stored profile but cannot bypass moderation with an edit. Restoration is an
operator decision. Reports are deduplicated per temporary source hash and expire
at 90 days when reports are processed. Current capacity is 2,000 profiles and
5,000 reports, with explicit busy responses rather than silent data loss.

Ownership recovery is capability-based. A private one-time recovery code grants
editing/deletion. The server stores only its secret digest. Do not request codes
by email, print them to a terminal or commit them. No email-based identity recovery
is offered. Help requests can be reviewed manually without pretending identity is
verified. The requested Christopher Lin self-profile has a private owner recovery
file outside Git; it is not an application asset or a public release artifact.

## Durability, incidents and rollback

Writes use a directory lock, unique 0600 temporary file, fsync, atomic rename and
directory fsync. On an unexpected persistent 503, inspect server errors privately.
If a process crashed leaving `.write-lock`, stop only Asymmetri, confirm no writer
is active, retain a private copy of `community.json`, then remove the stale empty
lock directory and restart. Do not remove locks while a writer may be active.
Malformed/unknown schema fails closed; never overwrite it with an empty store.

Protect any backups like live profile data and document their retention. This
release does not add an off-site backup service or promise erasure from provider
snapshots. The user notice describes deletion of active records and the limits of
recalling public text. Normal host logs are governed by existing host retention.

The complete prior website can be restored independently. Preserve the community
store during rollback; the prior V0.2 runtime simply has no profile API. The new
systemd drop-in can be removed to restore the exact prior service configuration;
never delete participant data as an incidental deployment rollback. Compare peer
services, all prior configuration hashes and the one expected new drop-in hash.
