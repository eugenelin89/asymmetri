# Prompt 022: SSH deployment access and administrator setup

- Date: 2026-09-24
- Scope: deployment
- Goal: Enable CLI website development, Git synchronization, and controlled production operations from the owner’s Mac.

## Original user request

> but in the future I want you to be able to make modification to the current website, push to git, and log in to the server, do git pull from there and update the website and deploy to production

The owner approved the exact persistent deployment permissions: application
commands as `django-user` with privilege elevation disabled, and root access
limited to the Asymmetri service controls and a bounded application log view.

Additional direction:

> basically i want you to be able to access root if necessary

This expanded the desired future role to administration across the hosted sites.
A separate full-administrator installer was prepared. Its exact persistent,
passwordless full-root mechanism still awaited explicit approval at this record.

## Scope

Configure and verify SSH access and the existing application deployment route;
preserve the live website, its owner, service configuration, and running process.
Prepare separate administrator tooling and documentation. No website feature,
content release, OS upgrade, dependency change, or service restart is included.

## Decisions

- Use `webdeploy` for SSH and keep the existing application owned by `django-user`.
- Use a root-owned application helper that sanitizes the environment and sets
  Linux `no_new_privs` before running application commands. This blocks later
  elevation even though the existing app account belongs to the sudo group.
- Grant only the named Asymmetri service start/stop/restart operations and its
  latest 100 journal lines as root through the deployment login.
- Preserve application Git credentials and use the documented staged build,
  successful checks, activation, health verification, and rollback procedure.
- Separate optional `webadmin` root-equivalent authority from routine deployment
  with a distinct local Ed25519 identity and explicit authorization. The admin
  key is outside the repository; no private key or credential is recorded here.
- Preserve existing SSH/root settings and all other hosted websites.

## Implementation

Installed and verified the scoped deployment helper and sudo policy. Added a
reviewable installer, a separate full-administrator installer, an operator guide,
and links from the existing deployment and onboarding documents. Prepared the
separate administrative key and local aliases; server activation remains gated
on the exact root-access approval.

## Engineering impact

Future authorized website work can edit locally, validate, commit/push, connect
through SSH, fetch/pull as the app owner, build, and control the Asymmetri service.
Application access inherits the files accessible to the existing shared app
identity; it is not filesystem isolation to a single site. No unrestricted root
permission was granted to `webdeploy`. The separate administrator installer is
intentionally full-root authority and must be treated accordingly.

## Files changed

- Infrastructure: scoped deployment and optional full-administrator installers.
- Operating documentation: CLI access guide plus README/deployment cross-links.

## Documentation updated

The CLI guide documents local identities without exposing credentials, application
command wrapping, Git synchronization checks, allowed service commands, installer
validation, revocation, and the separate administrator scope.

## Git diff summary

The implementation commit changes five files with 344 insertions. These are
infrastructure tooling and documentation only; application source and runtime
configuration are unchanged.

## Verification

- Local and server Python syntax checks passed for the installer and embedded helper.
- Shell syntax checks passed for the administrator installer; diff whitespace checks passed.
- SSH authenticated as the non-root deployment account.
- The application helper reported the expected app identity, working directory,
  and `NoNewPrivs: 1`; Git metadata write access and a temporary-file round trip passed.
- Generic root commands, elevation from the helper, and unrelated-service control were denied.
- The exact Asymmetri service-control policy and bounded journal access were verified
  without restarting the service.
- Local Git pull and dry-run push succeeded. Server Git fetch, remote inspection,
  and fast-forward pull succeeded with an unchanged production commit.
- Production Node 22.23.1 and npm 10.9.8 execute through the helper.
- Loopback and public website checks returned HTTP 200. The service stayed active
  with the same process; its existing `NoNewPrivileges=yes` setting was preserved.
- The optional full-administrator installation was not represented as complete.
- Full application builds were unnecessary because application code, dependencies,
  and runtime configuration were not changed.

## Repository state after implementation commit

`main` at `e078a420914f7452afb7c9e70df27e4a8ce8be78`, clean before this journal was
created, one implementation commit ahead of the previously synchronized remote.
Both implementation and this journal are intended to be pushed in order.

## Implementation commits

- `e078a420914f7452afb7c9e70df27e4a8ce8be78` — Add scoped SSH deployment access and admin setup tooling.

## Archive commit

Record SSH deployment access setup and verification

## Lessons learned

Use direct SSH for routine operations once bootstrapped. Keep root authority
separate from app builds, verify exact privilege boundaries, and never infer that
an approved deployment role automatically authorizes a persistent full-root role.

## Follow-up ideas

Activate and verify the separately requested administrator route after its exact
approval. Plan supported Ubuntu migration and capacity maintenance separately;
neither belongs inside a routine website release.
