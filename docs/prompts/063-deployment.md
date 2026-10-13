# Prompt 063: Confined services and certificate renewal packaging

- Date: 2026-10-13
- Scope: deployment
- Goal: Prepare independently confined Ask/TLS services and a verified, reversible certificate update path.

## Original user request

> i will be away. you are authorized for everything you need.

Continuation of the authorized INV-REAL-01 website/receiver/Ask integration and
production deployment, coordinated with HQ. No renewed permission request is
needed; technical acceptance remains distinct from owner authorization.

## Scope

Add Linux service templates, root-owned certificate renewal tooling and current
rehearsal documentation. Keep actual installation/activation as the next verified
operation. No HQ authority, public question intake, data fabrication or paid
execution is introduced.

## Decisions

- Separate TLS and Ask identities/releases prevent the TLS key and private Ask
  content from becoming shared website or archive runtime privileges.
- TLS is loopback-only, confined and bounded; ordinary Nginx remains independent
  so an apex-worker failure cannot make every other site's startup depend on it.
- Ask has its own writable store and an empty read-only mount at the public store
  reference path. Public context uses verified HTTP; archive data is not mounted.
- Keep admission/claims/delivery and grants distinct from starting a listener.
- The Certbot hook handles only the exact Asymmetri lineage. Validate SAN, time,
  matching key and TLS context, atomically publish a protected versioned copy,
  signal HUP and verify the actual served certificate. Roll back on failure.
- Explicit ownership/modes remove dependence on the root caller's umask. Parent
  configuration directory access remains part of installation verification.

## Implementation

Added confined systemd templates and root-only Python certificate tooling with
initialization/check modes, fsync, live TLS fingerprint verification and rollback.
The disabled ingress example now reads from the managed current-certificate link.

## Engineering impact

No Node dependency, contract, content, asset or website rendering change. No live
service unit or certificate hook was installed in this source commit. Temporary
rehearsal keys stayed on the server in protected directories and were deleted.

## Files changed

Two service templates, one certificate hook, ingress example configuration, and
four deployment/Ask/ingress/testing documents.

## Documentation updated

Describe service permissions/resource bounds, certificate procedure, remaining
installed-service checks and the completed all-host graceful-reload rehearsal.

## Git diff summary

8 files changed, 313 insertions and 2 deletions. Source-level deployment packaging
and evidence only; no production configuration copied into the repository.

## Verification

- Actual installed Linux systemd accepted both service templates with
  `systemd-analyze verify`.
- Certificate hook `--check` validated the current real certificate pair without
  modifying it. Python/JSON syntax and Git whitespace checks passed.
- All-host rehearsal: 64 checks in each baseline/shared/rollback phase, all matched.
  Covered 15 hosts, separate IPv4/IPv6 virtual-host sets/default certificates,
  28 Asymmetri route checks, HTTP redirects, exact tutorial www canonical and
  54 hash links. Existing draft 502 and relay 410 baselines remained unchanged.
- Both graceful HTTP-to-stream and stream-to-HTTP transitions passed on isolated
  high loopback ports. Production configuration/listeners and API authority stayed
  unchanged. Temporary certificate copies and processes were cleaned up.
- First rehearsal syntax check found a relative proxy_params include; resolving
  staging includes against the original Nginx directory fixed it before any run.
- Two read-only reviewers accepted the templates/hook after fixing the restrictive
  umask issue. They did not independently rerun deployment checks.
- Prior transport commit retains full 230/230 local/Linux, 68/68 shared-ingress,
  Next/Sites build and zero-vulnerability audit evidence; no runtime TS changed here.

## Repository state after implementation commit

Main at `14b6021df30e5f1f230307584a30024993944baf`, clean before this journal and one implementation commit ahead
of origin. Push both commits after this record. No branch/worktree/PR or unrelated work.

## Implementation commits

- `14b6021df30e5f1f230307584a30024993944baf` — Package confined Ask and ingress services with verified certificate renewal.

## Archive commit

Record confined service and certificate deployment journal

## Lessons learned

A successful root-side validation does not prove service-side file access.
Test restrictive umask, actual confinement and served certificate identity.
Preserve IPv4/IPv6 virtual-host differences when introducing an SNI dispatcher.

## Follow-up ideas

Install on loopback, verify disabled intake/no authority and actual filesystem/
network confinement, exercise Certbot dry-run plus hook, then perform the already
authorized reversible shared-443 activation with final route/image read-back.
