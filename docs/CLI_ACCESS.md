# CLI access for website development and deployment

This setup supports the existing local Git → GitHub → DigitalOcean workflow.
The scoped deployment access was installed and verified on September 24, 2026.
Use the deployment login for routine releases. Broader administration has a
separate installer and authorization scope.

## Log in from the configured Mac

```bash
ssh asymmetri
whoami
hostname
```

The login account is `webdeploy`. Connection settings live in the Mac's
`~/.ssh/config`; its existing private identity remains in `~/.ssh/lin`. Never
copy a private key into this repository, the server, a prompt, or a journal.
Only the matching public key belongs in the server's `authorized_keys` file.
Use `exit` to disconnect. Another computer needs its own authorized key setup.

## Work locally and push

Edit the local website checkout, follow `AGENTS.md`, run the applicable checks,
commit implementation and the prompt journal separately, and push `main`.
Keep unrelated changes intact. Use the repository's existing Git credential
configuration; never embed tokens in commands, remotes, or documentation.

## Operate the application after SSH login

Define this convenience function in the remote shell:

```bash
app() {
  sudo -n -H -u django-user /usr/local/sbin/asymmetri-app "$@"
}
```

The helper starts in `/var/www/asymmetri` as the existing application owner,
`django-user`. It uses a clean environment and enables Linux `no_new_privs`
before running the supplied command. Commands and their children cannot gain
root through setuid executables such as `sudo`. The helper itself is owned by
root and cannot be changed by the SSH user or application owner.

This preserves existing application ownership and Git credentials. It grants
the file access of `django-user`, which also owns other applications on this
server; it is not filesystem isolation to one directory. Keep all work scoped
to the requested website. The running Asymmetri service also has
`NoNewPrivileges=yes`.

Inspect before synchronizing:

```bash
app id
app git status --short --branch
app git rev-parse HEAD
app git fetch origin
app git rev-parse origin/main
app git rev-list --left-right --count HEAD...origin/main
```

Verify the expected branch, clean source state, and exact approved remote commit.
Only then fast-forward:

```bash
app git pull --ff-only origin main
app git rev-parse HEAD
```

Do not reset, force-push, clean, or discard production-only changes. Follow
`docs/DEPLOYMENT.md` for validation, staged builds, activation, and rollback.
Replace its application command prefix `sudo -u django-user -H` with `app` when
logged in as `webdeploy`. For example, `app bash -c 'COMMANDS'` runs the documented
application-owned steps. Preserve the live `.next` build until staged checks and
the production build succeed. The existing Node 22 production approval remains
in effect; use the repository's `.nvmrc` for local validation.

## Control only the Asymmetri service

After the successful build and at the documented activation step:

```bash
sudo -n /usr/bin/systemctl stop asymmetri.service
# Perform the documented application-owned build swap using app.
sudo -n /usr/bin/systemctl start asymmetri.service
```

The exact `restart asymmetri.service` command is also allowed when the documented
deployment path requires a restart. No other service can be controlled through
these permissions. Root shells and unrestricted administrator commands are not
allowed. Inspect health and the bounded application log with:

```bash
systemctl is-active asymmetri.service
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:3001/
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' https://asymmetri.co/
sudo -n /usr/bin/journalctl --unit=asymmetri.service --lines=100 --no-pager
```

## Installation and recovery

`ops/access/install-access.py` is the reviewed installer. A root administrator
runs it once in the DigitalOcean console after verifying its SHA-256 checksum.
It refuses unexpected existing files or service configuration, validates the
sudo policy, and rolls back files it created if validation fails. It installs:

- `/usr/local/sbin/asymmetri-app`: application command helper, root owned, 0755.
- `/etc/sudoers.d/webdeploy-asymmetri`: exact sudo rules, root owned, 0440.

Installation does not restart the service, change SSH settings, modify source,
or change application ownership. Keep the root console available for recovery.
A root administrator can revoke deployment permissions by removing the dedicated
sudoers entry and then checking `visudo -c`; SSH key revocation is separate.

After setup, verify the helper identity and `NoNewPrivs: 1`, inspect `sudo -n -l`,
confirm generic root commands are denied, and check that website health and the
service process remain unchanged. Verify GitHub write access locally with a
dry-run push and server read access through the helper before deployment.


## Separate full-server administration

Full server administration is a separate, explicitly authorized capability.
The scoped deployment installer does not enable it. The additional
`ops/access/install-admin-access.sh` installer creates `webadmin` with
`NOPASSWD` sudo for any command as root. It affects the entire Ubuntu instance,
including other websites, files, accounts, services, packages, and networking.
It is not limited to Asymmetri. Use the deployment login for routine releases.

The administrator uses a distinct Ed25519 key at `~/.ssh/asymmetri_admin` on the
configured Mac. This key has no passphrase for unattended CLI use and is protected
by local filesystem permissions; it is a root-equivalent credential. Keep it
outside Git and do not print, upload, or copy its contents. Only its public half
is installed on the server. The aliases `webadmin` and `asymmetri-admin` select
this identity with strict host-key verification and agent forwarding disabled.

After the administrator setup has been activated and verified:

```bash
ssh webadmin
sudo -i
# Finish the root shell, then the SSH session:
exit
exit
```

For one administrative command, use `ssh webadmin 'sudo -n COMMAND'`. An available
root credential is not a reason to run routine application builds as root.
Inspect and back up configuration before server-wide changes; preserve the
other hosted sites and verify health after changes. New infrastructure or
production changes still follow the scope of the user's request.

A root administrator installs the additional account only after reviewing the
script and the exact root-access authorization:

```bash
bash install-admin-access.sh PUBLIC_KEY_FILE EXPECTED_SHA256_FINGERPRINT
```

The installer verifies the key fingerprint and sudo syntax and refuses an
existing account, home directory, or sudo entry. It creates a key-only login
with a locked password and the dedicated `/etc/sudoers.d/webadmin` policy.
Installation does not restart websites or alter application ownership. To revoke
administrator authority, a root administrator removes that sudoers entry;
revoke its SSH key separately if login must also be removed. Maintain the
DigitalOcean root console as a recovery route.
