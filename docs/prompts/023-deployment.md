# Prompt 023: Activate the approved full-server administrator

- Date: 2026-09-24
- Scope: deployment
- Goal: Enable verified CLI root access through the separately authorized administrator account.

## Original user request

> I approve

This explicitly approved the pending request to create `webadmin` with unrestricted
passwordless sudo across the entire existing Ubuntu instance. It followed the
owner’s instruction:

> basically i want you to be able to access root if necessary

## Scope

Activate the prepared administrator account and separate public key, verify root
access and account protections, and document the established authorization for
future server administration. Preserve routine non-root deployment permissions,
all live website processes, source behavior, ownership, and global SSH policy.

## Decisions

- Use the previously reviewed administrator installer and pinned checksum and
  public-key fingerprint; keep the private identity on the owner’s Mac.
- Provide full root-equivalent sudo only through the separate `webadmin` login.
  Continue routine application operations through the existing non-root helper.
- Record persistent access authorization so later requested administration does
  not repeat the account-setup approval. Keep future actions within user scope.
- Preserve the DigitalOcean console as recovery access.

## Implementation

Installed the key-only `webadmin` account and its dedicated sudo policy. Verified
SSH login and a sudo command returning UID 0. Updated the CLI guide and agent
instructions to record the active administrator route and operating boundaries.

## Engineering impact

Authorized administration can now run entirely through CLI, including work that
requires root across this server and its hosted websites. The separate deployment
account retains its narrow permissions. No application release, dependency,
service configuration, operating-system update, or website restart was performed.

## Files changed

- Agent instructions: verified production access and persistent authorization.
- CLI guide: active administrator state, commands, and verification evidence.

## Documentation updated

The guide records the separate administrator identity, full-server scope,
credential handling, verified file permissions, and account protections. The
previous journal remains an accurate record of setup before final approval.

## Git diff summary

The implementation commit changes two files with 39 insertions and five deletions.
These are operating instructions only; application and installer code are unchanged.

## Verification

- Staged installer checksum and administrator public-key fingerprint matched
  the reviewed artifacts before execution.
- Administrator SSH login returned the dedicated non-root identity; `sudo -n id`
  returned UID 0 and the policy listed `(root) NOPASSWD: ALL`.
- The administrator login password is locked. The SSH directory is 0700,
  authorized key is 0600, and the root-owned sudo policy is 0440.
- `visudo -c` passed for all active policies.
- The separate private key and local SSH configuration are 0600; no private
  credential was printed or committed.
- The routine deployment login still cannot run an arbitrary root command;
  its application helper remains functional.
- Both public hosted websites returned HTTP 200. Asymmetri remained active with
  the same running process throughout setup.
- Documentation whitespace checks passed. Full application builds are not needed
  for these operating-documentation changes and account activation.

## Repository state after implementation commit

`main` at `c44c5c1eb2c2552b56fe4e1b42da24e290f28ba9`, clean before this journal,
one implementation commit ahead of the previously synchronized remote.

## Implementation commits

- `c44c5c1eb2c2552b56fe4e1b42da24e290f28ba9` — Record verified full-server administrator access.

## Archive commit

Record approved administrator activation and checks

## Lessons learned

Separate routine deployment from full-root administration, confirm the exact
persistent privilege mechanism once, and verify both positive access and the
remaining restricted boundaries. Do not use account setup as a reason to restart
healthy websites or combine unrelated infrastructure maintenance.

## Follow-up ideas

Use the administrator route for subsequently requested server work, including
other hosted sites. Plan supported Ubuntu migration and capacity maintenance
separately from website releases.
