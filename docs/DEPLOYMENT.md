# DigitalOcean production deployment

This guide covers routine redeployment of `https://asymmetri.co` on the current
DigitalOcean Ubuntu Droplet.

For the separately selected OS migration, use [INFRA-01](INFRA-01-UBUNTU-MIGRATION.md)
and its [acceptance ledger](INFRA-01-VALIDATION.md). That task preserves the exact
existing production release rather than deploying current main. It remains at
recovery and destructive-rebuild/outage gates. The existing Droplet/IP will be
retained; its whole disk must be restored after a clean Ubuntu 24.04 rebuild. Snapshot
storage is approved up to US$1.50/month and deletion is mandatory only after accepted
migration, healthy observation and independent recovery. The [retirement
amendment](INFRA-01-DJANGO-RETIREMENT.md) removes active Django/Gunicorn/PG installation
from the target plan after archival obligations and retirement approval. Keep shared
`django-user` ownership and OS Python. No rebuild or retirement has occurred.
Routine redeployment commands below do not authorize this migration or receiver activation.

For the configured Mac SSH login and restricted deployment commands, see
[CLI access](CLI_ACCESS.md). Connect with `ssh asymmetri` as `webdeploy`, then
define the documented `app` function. When following application commands below,
replace `sudo -u django-user -H` with `app`; it retains the application owner
while disabling privilege elevation. The guide also lists the exact allowed
service-control and log commands. Root-console examples remain available for
server administrators.

The production application:

- lives at `/var/www/asymmetri`;
- is owned and run by `django-user`;
- is built with `npm run build:next`;
- is started directly with `node_modules/.bin/next start`;
- listens on `127.0.0.1:3001`;
- is managed by `asymmetri.service`;
- receives public traffic through Nginx.

The repository also contains a Vinext and Cloudflare build path. That path uses
`npm run build` and `npm run start`. It is not the DigitalOcean production
startup path. Do not use `npm run start` for the DigitalOcean service because
the script invokes Vinext.

The October 7 dependency patch uses the owner-approved isolated candidate
procedure below, preserving live dependencies until activation. Its advisory
review and unchanged-runtime contract are recorded in
[Dependency security review](DEPENDENCY_SECURITY_2026-10-07.md). For this release,
compare all discovered virtual-host health baselines and shared-service/configuration
fingerprints before mutation and after activation; pre-existing failures must
remain unchanged. No shared infrastructure changes are part of the release.

## Production guardrails

- Perform application Git and npm operations as `django-user`.
- Use root privileges only for operating-system responsibilities such as
  systemd and Nginx.
- Inspect branch, exact HEAD, remote, ahead/behind state, all tracked changes and
  untracked files before synchronization. Stop on unexpected production state;
  never reset, clean, or discard files to force compliance.
- Build successfully before restarting the service.
- Do not combine routine application deployment with operating-system upgrades,
  SSH hardening, dependency remediation, certificate work, or Nginx redesign.
- Do not run `npm audit fix` or `npm audit fix --force` during deployment.
- Do not edit production files by hand to make them differ from `origin/main`.
- Do not delete the live `node_modules/` or `.next/` directories while the
  running service depends on them.

## Roles and locations

| Context | Identity | Responsibilities |
| --- | --- | --- |
| Local Mac | Repository owner | Edit, validate, commit, and push `main` |
| Production application | `django-user` | Fetch source, install dependencies, check, and build |
| Production operating system | Root or an administrator using `sudo` | Restart services, inspect Nginx, and review system logs |
| Public verification | Any operator | Check the loopback application and public HTTPS endpoint |

Commands marked as production commands must run after connecting to the
DigitalOcean Droplet through the established SSH or DigitalOcean web-console
access. This guide does not invent a hostname, IP address, or SSH key path.

## Routine redeployment

### Step 1: Prepare and validate the change locally

**What and why:** Update the local checkout, install the exact dependency graph,
and prove that the standard Next.js application passes its checks and production
build before changing the server.

**Who, when, and where:** The repository owner performs this on the local Mac,
before every routine deployment, from
`/Users/eugenelin/dev/asymmetri/website`. Root privileges are not required.

**How:**

```bash
cd /Users/eugenelin/dev/asymmetri/website

git status
git branch --show-current
git pull --ff-only origin main

npm ci
npm run check
npm run build:next
```

**Success:** The branch is `main`, the intended worktree state is understood,
the pull fast-forwards or reports that the branch is current, exact dependencies
install, TypeScript and ESLint pass, and Next.js completes the production build.

**Common failure:** Local edits prevent a pull, the branch is not `main`, npm
cannot install the lockfile, type or lint errors appear, or the Next.js build
fails. Resolve the local issue before committing or deploying.

**Live effect and rerun safety:** These commands do not change the live website.
They are safe to rerun locally. `npm ci` replaces local `node_modules/` from the
lockfile, so untracked manual changes inside that generated directory are not
preserved.

#### Local command notes

| Command | Purpose, success, and failure |
| --- | --- |
| `cd /Users/eugenelin/dev/asymmetri/website` | Enters the local repository. Success means later commands run in the intended checkout. A missing directory means the local path has changed. |
| `git status` | Shows branch and worktree state. Review it before staging. It does not change files and is safe to rerun. |
| `git branch --show-current` | Must print `main`. It is read-only and safe to rerun. |
| `git pull --ff-only origin main` | Updates local `main` without creating a merge commit. A divergence or local conflict stops the workflow and does not justify a forced update. |
| `npm ci` | Recreates dependencies from `package-lock.json`. Success ends with a completed install. A lockfile mismatch, network error, disk error, or engine error must be investigated. |
| `npm run check` | Runs strict TypeScript checking and ESLint. Any reported error blocks deployment. |
| `npm run build:next` | Creates the standard Next.js `.next/` production output. This is the build used by DigitalOcean. A failed build blocks deployment. |

Generated `.next/`, `dist/`, `.wrangler/`, and `node_modules/` content is ignored
and should not be committed unless the repository explicitly changes its
tracking policy.

### Step 2: Review, commit, and push local `main`

**What and why:** Review the exact change, stage only intended files, create a
descriptive commit, and make that commit available to production through
`origin/main`.

**Who, when, and where:** The repository owner performs this on the local Mac
after the local checks pass and before connecting to production.

**How:**

```bash
cd /Users/eugenelin/dev/asymmetri/website

git status
git diff
git add <specific-files>
git commit -m "Describe the change"
git push origin main
git log -1 --oneline
```

Replace `<specific-files>` with the reviewed file paths. Do not prefer
`git add .`. If the repository’s prompt-journal policy applies, create the
implementation and archive commits in the required order, then push both.

**Success:** The push reports that `main` advanced, and `git log -1 --oneline`
shows the intended final commit. Record its full SHA with `git rev-parse HEAD`
when an abbreviated value is not sufficient.

**Common failure:** Unrelated files are staged, Git identity is missing, the
remote rejects the push, or local `main` is behind. Stop and resolve the Git
state without force-pushing.

**Live effect and rerun safety:** Pushing does not change the running server.
`git status`, `git diff`, and `git log` are safe to rerun. Repeating `git commit`
creates another commit, so do not repeat it after success. Repeating the same
push is harmless and normally reports that everything is current.

### Step 3: Connect to the production server

**What and why:** Open an authenticated shell on the Droplet so the production
checkout and service can be inspected.

**Who, when, and where:** The authorized server operator connects after the
intended commit is on `origin/main`. Use the established SSH method or the
DigitalOcean web console.

**How:** Connect using the server access method already configured for the
Droplet. After login, confirm the host and current identity before running
commands:

```bash
hostname
whoami
```

**Success:** The shell is on the intended Droplet and the operator has permission
to use `sudo`.

**Common failure:** Authentication fails, the wrong host is reached, or `sudo`
permission is unavailable. Do not continue on an unverified host.

**Live effect and rerun safety:** Connecting is read-only and does not change the
website. It is safe to reconnect.

### Step 4: Confirm that the production checkout is clean

**What and why:** Inspect the production repository before synchronization.
Unexpected local changes, meaningful untracked files, a wrong branch or
unpushed production commits block deployment. Preserve them for owner review.

**Who, when, and where:** The server operator runs Git as `django-user` on the
Droplet. The command targets `/var/www/asymmetri` directly, so the operator’s
current directory does not matter.

**How:**

```bash
sudo -u django-user -H git -C /var/www/asymmetri status -sb
sudo -u django-user -H git -C /var/www/asymmetri status --porcelain=v1 --untracked-files=all
sudo -u django-user -H git -C /var/www/asymmetri rev-parse HEAD origin/main
sudo -u django-user -H git -C /var/www/asymmetri rev-list --left-right --count HEAD...origin/main
```

**Success:** The output identifies the expected branch and contains no modified,
deleted, staged, or untracked production-only files that need investigation.

**Common failure:** Git reports local changes, an unexpected branch, a missing
repository, or a permissions problem. Stop before synchronization and determine
whether the files are accidental, operationally important, or evidence of an incomplete
deployment.

**Live effect and rerun safety:** The command is read-only and safe to rerun.

Root may report “detected dubious ownership” if Git is run directly in the
deployment owned by `django-user`. Do not solve that by casually changing
ownership or by running production Git operations as root. Use the
`sudo -u django-user -H git -C ...` form throughout this guide.

### Step 5: Synchronize production with pushed `main`

**What and why:** Fetch the remote state and make the production checkout match
the reviewed `origin/main` commit exactly.

**Who, when, and where:** The server operator runs these commands as
`django-user` on the Droplet after confirming the checkout is clean.

**How:**

```bash
sudo -u django-user -H git -C /var/www/asymmetri fetch origin
sudo -u django-user -H git -C /var/www/asymmetri rev-parse origin/main
# Verify that this is the exact commit pushed from the Mac before proceeding.
sudo -u django-user -H git -C /var/www/asymmetri pull --ff-only origin main

sudo -u django-user -H git -C /var/www/asymmetri log -1 --oneline
```

Recheck the branch, worktree and ahead/behind state after fetch. If production
has diverged or contains unexpected work, stop. Fast-forward synchronization
must not discard production-only changes. Do not use a destructive reset to
force a deployment.

**Success:** Fetch completes, the fast-forward succeeds, and the final log
line matches the commit pushed from the Mac.

**Common failure:** The remote cannot be reached, credentials fail, the expected
commit is absent, or filesystem permissions prevent synchronization. The running
service normally remains on its prior in-memory and `.next/` build until it is
restarted.

**Live effect and rerun safety:** Fetch is read-only with respect to the worktree.
The fast-forward changes production source files but does not restart the live
service. Repeating it at the same commit reports that it is already current.

### Step 6: Check Node.js, disk, and memory

**What and why:** Confirm that the runtime satisfies the repository and Next.js
requirements and that the small Droplet has enough capacity for dependency
installation and compilation.

**Who, when, and where:** The server operator runs these checks on the Droplet
after source synchronization and before `npm ci`.

**How:**

```bash
sudo -u django-user -H bash -lc '
cd /var/www/asymmetri
node --version
npm --version
'

df -h /
free -h
```

The repository targets Node.js 24 in `.nvmrc` for local development/validation.
Production runs Node 22.23.1 with npm 10.9.8. On September 19 the owner explicitly
gave standing approval for Node 22 production deployment: “always approve node 22
runtime. don't ask me again.” This replaces the earlier per-deployment exceptions
for the utility pages and tutorial. Do not ask to renew this approval. Keep the
production runtime in place and require successful production checks/build before
restart. The repository Next.js 16.3.8 package requires Node.js 20.9.0 or newer.
A concrete compatibility/build failure still needs diagnosis; no OS/runtime
upgrade is part of a copy deployment.

**Success:** Node and npm execute successfully for `django-user`, the Node
release is compatible, and disk and memory have reasonable headroom.

**Common failure:** Node is missing from the login environment, the release is
incompatible, disk is nearly full, or available memory is too low. Correct the
runtime or capacity issue before installation.

**Live effect and rerun safety:** These commands are read-only and safe to rerun.

### Step 7: Install exact production dependencies

**What and why:** Recreate `node_modules/` from the committed lockfile so the
build and runtime use the reviewed dependency graph. Development dependencies
are included because TypeScript, ESLint, and the build toolchain need them.

**Who, when, and where:** The server operator runs npm as `django-user` from
`/var/www/asymmetri`, after the resource checks pass.

**How:**

```bash
sudo -u django-user -H bash -lc '
cd /var/www/asymmetri
npm ci --no-fund
'
```

**Success:** npm completes without an install error and recreates
`node_modules/` from `package-lock.json`.

**Common failure:** Network resolution, package download, incompatible Node,
lockfile mismatch, disk exhaustion, memory pressure, or permissions can stop the
install. Audit findings printed at the end do not by themselves mean the
installation failed.

**Live effect and rerun safety:** This changes `node_modules/` used by the
application, but it does not restart the service. On this deployment model the
running Node process normally continues with modules it has already loaded.
Rerunning `npm ci` is supported, but do not start a second install before
confirming that the first one ended.

Do not run `npm audit fix` or `npm audit fix --force` as part of deployment.
Handle dependency remediation as a separate local code change with its own
testing and lockfile review.

### Step 8: Run type checking and linting

**What and why:** Reconfirm on the production host that strict TypeScript and
ESLint pass with the installed dependency tree.

**Who, when, and where:** The server operator runs the repository script as
`django-user` from `/var/www/asymmetri`, after `npm ci`.

**How:**

```bash
sudo -u django-user -H bash -lc '
cd /var/www/asymmetri
export NEXT_TELEMETRY_DISABLED=1
npm run check
'
```

**Success:** Both `tsc --noEmit` and `eslint .` exit successfully.

**Common failure:** A type error, lint error, missing dependency, incompatible
Node release, or exhausted memory stops the command. Do not build or restart
until the cause is understood.

**Live effect and rerun safety:** The command does not change the live website
and is safe to rerun.

### Step 9: Build the standard Next.js application

**What and why:** Compile the production `.next/` output that the systemd
service will serve. The memory limit reduces the chance that Node consumes all
Droplet memory during the build.

**Who, when, and where:** The server operator runs the build as `django-user`
from `/var/www/asymmetri`, after checks pass and before service restart.

**How:**

```bash
sudo -u django-user -H bash -lc '
cd /var/www/asymmetri
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=1536"
npm run build:next
'
```

**Success:** Next.js reports a completed optimized production build and the
expected routes. `.next/` contains the new output.

**Common failure:** Compilation errors, type errors, incompatible Node,
out-of-memory termination, or lack of disk space can stop the build.

**Live effect and rerun safety:** The build writes `.next/` but does not restart
the service. Do not restart after a failed build. The previous running process
continues serving its already loaded version until a restart. Rerun only after
understanding and correcting the failure.

### Step 10: Restart and inspect the systemd service

**What and why:** Restart the application process so it loads the newly built
source, dependencies, and `.next/` output. Then confirm systemd considers it
healthy.

**Who, when, and where:** A root shell or an operator with `sudo` performs this
on the Droplet only after the build succeeds.

**How:**

```bash
systemctl restart asymmetri.service

systemctl status asymmetri.service --no-pager -l
```

If the operator is not already root, prefix both commands with `sudo`.

**Success:** The service is `active (running)`, the main process is the expected
Next.js command, and recent status output contains no startup error.

**Common failure:** A missing dependency or build, incorrect service path,
permission error, incompatible Node release, or occupied port prevents startup.

**Live effect and rerun safety:** Restart changes the live application and
causes a brief interruption, usually a few seconds. Nginx remains running.
Repeated restart is supported but causes another interruption and should not be
used as a substitute for diagnosis.

Routine redeployment does not require an Nginx, DNS, certificate, service-file,
or port change. The service stays on port 3001.

### Step 11: Verify the local application and public website

**What and why:** Test both sides of the reverse proxy. The loopback check proves
that Next.js is responding. The public check proves that DNS, TLS, Nginx, and the
application path work together.

**Who, when, and where:** The server operator runs the curl checks on the
Droplet immediately after the restart.

**How:**

```bash
curl -sS -o /dev/null \
  -w 'Local: HTTP %{http_code}\n' \
  http://127.0.0.1:3001/

curl -sS -o /dev/null \
  -w 'Public: HTTP %{http_code}\n' \
  https://asymmetri.co/
```

Then check important routes against the local Next.js server:

```bash
for p in / /sports /labs /motion /botsquad /about /tutorial /privacy /support /sport /work /favicon.svg /robots.txt /sitemap.xml /story /contact; do
  curl -sS -o /dev/null \
    -w "$p -> HTTP %{http_code}  %{redirect_url}\n" \
    "http://127.0.0.1:3001$p"
done
```

Expected results:

- `/`, `/motion`, `/tutorial`, `/privacy`, and `/support` return HTTP 200 with their intended content.
- `/favicon.svg` returns HTTP 200.
- `/robots.txt` returns HTTP 200.
- `/sitemap.xml` returns HTTP 200.
- `/story` returns an HTTP 308 permanent redirect to `/sports#story`.
- `/sport` and `/work` return HTTP 308 to `/sports` and `/labs`.
- `/contact` returns an HTTP 308 permanent redirect to `/#contact`, targeting the
  existing footer email rather than a separate homepage contact section.

Verify actual unauthenticated content at `https://www.asymmetri.co/motion`,
`https://www.asymmetri.co/tutorial`, `https://www.asymmetri.co/privacy`,
`https://www.asymmetri.co/support`, and the homepage. A redirect to the homepage
is not publication success. Check titles, the existing apex canonicals and the tutorial’s explicit www
canonical, mutual links, footer links, `mailto:info@asymmetri.co`, mobile readability,
all nine sitemap routes
and permissive robots rules. Also verify the apex URLs, product metadata and
SoftwareApplication schema, and the Motion icon/social assets. Product release
wording must still match the verified source state; website publication does not
make the iPhone app publicly available.

Finally, open the public pages in a browser. Use a hard refresh if the old
appearance remains cached.

**Success:** Both homepage checks return HTTP 200, static and metadata routes
work, redirects point to the expected anchors, and the browser shows the intended
change.

**Common failure:** A refused local connection points to the service. A local
200 with a public 502 points to Nginx-to-application connectivity. TLS or DNS
errors occur before the application.

**Live effect and rerun safety:** Verification is read-only and safe to rerun.

### Step 12: Review logs when anything is unhealthy

**What and why:** Read the service logs to identify startup or runtime errors
instead of repeatedly restarting or rebuilding.

**Who, when, and where:** A root shell or an operator with `sudo` runs this on the
Droplet whenever status, curl, or browser verification fails.

**How:**

```bash
journalctl -u asymmetri.service -n 100 --no-pager
```

For live observation during a controlled request:

```bash
journalctl -u asymmetri.service -f
```

Press `Ctrl+C` to leave the live log view.

**Success:** Logs show normal Next.js startup and successful requests without
repeating exceptions.

**Common failure:** Missing `.next/`, missing modules, invalid service paths,
permission failures, port conflicts, or an incompatible runtime appear in the
log.

**Live effect and rerun safety:** Reading logs is safe and does not change the
service.

## Troubleshooting

### DigitalOcean web console disconnects

The browser console can disconnect while `npm ci`, type checking, or a Next.js
build continues on the server. Do not immediately rerun the long command.
Reconnect first and inspect the state:

```bash
ps aux | grep -E 'npm|next|node|vinext' | grep -v grep || true
du -sh /var/www/asymmetri/node_modules 2>/dev/null || true
du -sh /var/www/asymmetri/.next 2>/dev/null || true
journalctl -k -b --no-pager | grep -Ei 'out of memory|oom|killed process' | tail -30 || true
```

The process list shows whether a command is still running. Directory sizes show
whether installation or build output exists and may still be changing. Kernel
logs reveal an out-of-memory kill. Wait for an active process to finish or
identify why it stopped before rerunning anything.

### Build fails

Do not restart `asymmetri.service`. The running process remains on the previously
loaded version until a restart.

Review the complete build output, then check capacity:

```bash
df -h /
free -h
du -sh /var/www/asymmetri/.next 2>/dev/null || true
journalctl -k -b --no-pager | grep -Ei 'out of memory|oom|killed process' | tail -30 || true
```

Fix the identified source, runtime, disk, or memory problem. Rerun the build only
after the failure is understood.

### Service fails to start

```bash
systemctl status asymmetri.service --no-pager -l
journalctl -u asymmetri.service -n 100 --no-pager
ss -ltnp | grep ':3001\b' || true
```

Likely causes include:

- missing `node_modules/`;
- a missing or incomplete `.next/` build;
- the wrong `WorkingDirectory`;
- the wrong `ExecStart`;
- another process already using port 3001;
- insufficient permissions for `django-user`;
- an incompatible Node.js version.

Inspect the live service definition with `systemctl cat asymmetri.service`.
Correct the cause, then restart once.

### Public site returns 502

An HTTP 502 usually means Nginx is running but cannot reach the Next.js
application.

```bash
systemctl is-active nginx
systemctl is-active asymmetri.service
curl -I http://127.0.0.1:3001/
nginx -t
journalctl -u nginx -n 100 --no-pager
```

If the local curl fails, diagnose the application service. If the local curl
works, inspect Nginx configuration and logs. Run `sudo nginx -T` when the active
proxy configuration must be reviewed.

### Disk space is low

```bash
df -h /
du -sh /var/www/asymmetri
du -sh /var/www/asymmetri/node_modules
du -sh /var/www/asymmetri/.next
journalctl --disk-usage
```

The current deployment can consume close to 1 GB because the production
checkout includes development dependencies needed for checks and builds.

Do not delete live `node_modules/` or `.next/` while the running service depends
on them. Identify safe cleanup targets separately, such as old confirmed
deployment copies, package caches, or oversized journals. Review ownership and
rollback needs before deleting anything.

The September 28 and October 9 cleanups are recorded in
[Server storage maintenance](SERVER_MAINTENANCE.md), including authorized removals,
recovery inputs, capacity, and health checks. The October 9 cleanup replaces older
deployment copies with one verified, independent immediate-predecessor rollback.
The obsolete `asymmetri-next` checkout and older staging/rollback paths were removed.
Do not rely on historical release receipts as proof that a directory still exists.

### Git reports dubious ownership

Run production Git commands as the deployment owner:

```bash
sudo -u django-user -H git -C /var/www/asymmetri status -sb
```

Do not run routine production Git operations as root. Do not change the entire
deployment directory to root ownership and do not add a broad `safe.directory`
exception merely to bypass the warning.

### Vulnerabilities reported by npm

`npm ci` can print audit findings even when installation succeeds. Review the
exit status and install summary before deciding that deployment failed.

Do not run either of these during deployment:

```bash
npm audit fix
npm audit fix --force
```

Dependency security remediation belongs in a separate local change. Review the
dependency path, make the smallest appropriate package update, run the complete
test suite, commit the lockfile change, and deploy it through the normal process.

## Rollback

Choose a rollback method only after inspecting which backups and known-good
commits actually exist.

### Option 1: Immediate directory rollback

The complete preceding release retained after the October 9 cleanup is
`/var/www/asymmetri-rollback-20261009-fd65c46`, source
`fd65c46c16588903bb74198f1988cafff8d8b20c`, build `3sb31Jjj0R0QRPODTe0e_`.
It contains source, Git metadata, public assets, the previous production build,
and independently copied dependencies. File-content checks and all nine pages,
robots and sitemap passed on a temporary loopback server, which was then stopped.
Reconfirm its identity, contents and suitability for the current incident before
use; subsequent deployments may establish a newer rollback. Inspect it first:

```bash
ls -ld /var/www/asymmetri /var/www/asymmetri-rollback-20261009-fd65c46
sudo -u django-user -H git -C /var/www/asymmetri-rollback-20261009-fd65c46 log -1 --oneline
sudo -u django-user -H test -x /var/www/asymmetri-rollback-20261009-fd65c46/node_modules/.bin/next
sudo -u django-user -H test -d /var/www/asymmetri-rollback-20261009-fd65c46/.next
```

If it is a confirmed previous working deployment and immediate recovery is more
important than preserving the current path in place, a root operator can swap
directories:

```bash
systemctl stop asymmetri.service

failed_dir="/var/www/asymmetri-failed-$(date +%Y%m%d%H%M%S)"
mv /var/www/asymmetri "$failed_dir"
mv /var/www/asymmetri-rollback-20261009-fd65c46 /var/www/asymmetri

systemctl start asymmetri.service
systemctl status asymmetri.service --no-pager -l

curl -sS -o /dev/null \
  -w 'Public: HTTP %{http_code}\n' \
  https://asymmetri.co/
```

This changes the live website and consumes the rollback directory path. It
preserves the failed deployment in a timestamped directory for investigation.
Before using it, confirm that both directories have the expected ownership and
that the service file still points to `/var/www/asymmetri`.

### Option 2: Restore tagged source without rewriting history

For the October 7 architecture redesign, the immutable known-good marker is
`website-pre-architecture-redesign-2026-10-07`, peeled commit
`679f3378701af6b04557c0bebff15120f21e3754`. Verify both local and remote identity:

```bash
git fetch origin tag website-pre-architecture-redesign-2026-10-07
git rev-parse 'website-pre-architecture-redesign-2026-10-07^{commit}'
git ls-remote origin 'refs/tags/website-pre-architecture-redesign-2026-10-07*'
```

For immediate service recovery prefer the verified complete pre-activation directory
and preserve the failed release using Option 1/the staged-release procedure. Its
exact path and build ID are in the external release receipt. Verify source, tracked
public assets, `.next` and independent dependencies before a swap; do not mix builds.
Routine service stop/start uses `ssh asymmetri`; only root-owned-parent directory
renames use the documented `ssh webadmin` administrator route.

If the directory is unavailable, create an independent application-owned candidate
from the tag, install its exact lockfile, check/build and smoke-test it on an unused
loopback port. Activate through the same full-directory swap. Keep the running tagged
revision and incident record explicit; do not reset or clean the existing checkout.

To restore the source through shared `main`, inspect all commits after the tag and
create reviewed revert commit(s) for the intended redesign changes. Do not blindly
revert unrelated later work. Validate and journal the rollback, push normally, then
fast-forward/deploy through the standard staged process. Never force-push or move
an immutable tag. A rollback is an explicit new event in history.

### Option 3: Restore a known-good service file

Use this only when the application files are valid and the regression is in the
systemd unit.

Inspect the active unit and available backups:

```bash
systemctl cat asymmetri.service
ls -l /etc/systemd/system/asymmetri.service*
```

Compare a candidate backup before restoring it:

```bash
diff -u /etc/systemd/system/asymmetri.service \
  <KNOWN_GOOD_SERVICE_FILE>
```

If the backup is verified:

```bash
cp <KNOWN_GOOD_SERVICE_FILE> /etc/systemd/system/asymmetri.service
systemctl daemon-reload
systemctl restart asymmetri.service
systemctl status asymmetri.service --no-pager -l
```

These commands require root. Replace `<KNOWN_GOOD_SERVICE_FILE>` with the exact
reviewed path. Do not restore an unknown backup or skip `daemon-reload`.

## First-time deployment versus routine redeployment

Routine low-risk content, image, and styling updates normally require:

- no DNS changes;
- no new DigitalOcean Domain entry;
- no new certificate;
- no Nginx port change;
- no new systemd service;
- no new application directory;
- no port 3002 test process;
- no blue-green deployment.

The existing DNS, certificate, Nginx proxy, loopback port, application directory,
and service are reused.

A more cautious staged deployment is appropriate for:

- major dependency upgrades;
- Next.js version upgrades;
- infrastructure or service-file changes;
- environment-variable changes;
- authentication or backend introduction;
- large routing changes;
- database introduction;
- changes that could prevent the application from starting.

Plan those changes separately. A staged approach may use a second directory,
temporary loopback port, explicit health checks, and a controlled Nginx or
service switch, but that is not the default routine workflow.

## Security and maintenance notes

- Ubuntu 22.10 is end-of-life. Plan migration or upgrade to a supported Ubuntu
  LTS release in a dedicated maintenance window.
- The Droplet is small and resource-constrained. Check disk and memory before
  large installs or builds.
- Review direct root SSH exposure as a separate infrastructure task.
- Repeated internet SSH login attempts are normal on a public server. SSH
  hardening, firewall review, key policy, and intrusion controls belong in a
  dedicated maintenance task.
- Do not combine routine website deployment with OS upgrades, SSH hardening,
  dependency remediation, certificate changes, or Nginx redesign.
- The public website currently requires no application secrets. Do not place
  source-system credentials, athlete data, or private evaluation data in the
  repository or service file.

## Operational checklist

### Before deployment

- [ ] Local `main` is current.
- [ ] The intended changes are committed.
- [ ] Both required repository commits are pushed.
- [ ] `npm run check` passes locally.
- [ ] `npm run build:next` passes locally.
- [ ] Production disk and memory are adequate.
- [ ] The production checkout is clean.
- [ ] The intended commit SHA is known.

### After deployment

- [ ] `asymmetri.service` is active.
- [ ] `asymmetri.service` is enabled at boot.
- [ ] Port 3001 is listening on `127.0.0.1`.
- [ ] The local HTTP check returns 200.
- [ ] The public HTTPS check returns 200.
- [ ] Important routes and redirects work.
- [ ] A browser hard refresh shows the expected change.
- [ ] Recent service logs contain no errors.
- [ ] Disk usage remains acceptable.

Confirm boot enablement and loopback binding when needed:

```bash
systemctl is-enabled asymmetri.service
ss -ltnp | grep '127.0.0.1:3001' || true
```

## Retained Vinext and OpenAI Sites workflow

The repository retains a separate build and packaging path:

- `npm run build` creates a Vinext Worker-compatible `dist/` bundle.
- `npm run start` serves the Vinext build locally.
- `vite.config.ts`, `worker/index.ts`, and
  `build/sites-vite-plugin.ts` own this path.
- `.openai/hosting.json` stores the opaque Sites project identifier.

This workflow must not be substituted for the DigitalOcean commands above.
OpenAI Sites publishing requires a successful Vinext build, an explicitly
requested release, exact source provenance, and the Sites version workflow.
Generated `dist/` output is ignored and is not committed.


## Tutorial release checks

For `/tutorial`, confirm the exact title and canonical
`https://www.asymmetri.co/tutorial`, all ten module jumps, hash deep links,
Record/Import and Back/Side choices, full-guide mode, image-original links, genuine
screenshots, labelled setup illustrations and mobile layout. Check Support →
Tutorial, Motion → Tutorial and shared footer links. Serve tutorial assets locally;
no DNS, Nginx, TLS, OS, Node or firewall change is needed for this route.


## Copy-only deployment with unchanged dependencies

For small content updates with an identical package/lockfile/runtime configuration,
use a temporary build workspace to preserve the serving `.next/` directory until
production validation passes. This avoids replacing live dependencies or build
files during compilation on the small Droplet.

1. Complete local checks/journal/push and the production clean-source/remote/commit
   checks above. Record the current production commit. Fetch, inspect the incoming
   range and confirm package/lockfile/configuration equality before a fast-forward.
2. As `django-user`, create a unique workspace under `/var/tmp`, extract the exact
   reviewed Git source there with `git archive`, and hard-link the existing
   unchanged `node_modules` tree using `cp -al`. Do not run `npm ci` in either
   linked dependency tree. If dependencies need changing, use a separately
   reviewed installation/deployment path; do not reuse this shortcut.
3. In the workspace, disable build telemetry, use the documented 1536 MiB Node
   heap limit, and run `npm run check` then `npm run build:next`. Capture exit
   status. Confirm the original live service and URLs remain healthy before
   switching. Failed compilation never replaces the serving build.
4. After successful build, stop only `asymmetri.service`, move the previous `.next`
   into that workspace as a rollback copy, move the new `.next` into the normal
   application path, then start the same service. All source/build file operations
   run as `django-user`; only systemd operations use administrator privilege.
5. Verify active service, loopback and public routes/content. If the replacement
   fails, restore the preserved `.next` while the service is stopped and restart;
   preserve both builds and investigate. Do not reset or discard production source.
6. Record source/build identity, runtime and sanitized checks. The current source
   remains on clean `main`; the temporary workspace/previous build stay outside
   Git for bounded rollback. Do not remove unrelated backups or caches.

This is the same Next.js/systemd/Nginx deployment path, with compilation isolated
from live generated output. No port, service definition, DNS, Nginx, dependency,
OS or logging change is required.

## Staged portfolio release with route changes

Releases that change route composition or redirect configuration, including the
September 28 portfolio and Work domain releases, use a complete isolated candidate
rather than the copy-only hard-link shortcut. Existing service, Nginx, DNS, TLS and Node 22 remain unchanged.
The owner's standing Node 22 approval applies; local checks still use Node 24.

1. Record the clean live `main` SHA, fetched remote, `.next/BUILD_ID`, service
   process/start time and a served-page marker. Treat source identity and running
   build identity as separate evidence. Check disk/RAM/swap and competing builds.
2. After both local commits are pushed, create an independent `django-user`-owned
   checkout of the exact remote SHA under a unique `/var/tmp/asymmetri-release-*`
   directory. Use the existing authenticated Git route, no alternate object store
   or hard-linked dependency tree. Confirm package and lockfile equality with the
   live release before copying unchanged installed dependencies. Otherwise install
   independently from the reviewed lockfile. Never install or build in the live tree.
3. Run production `npm run check` and `npm run build:next` inside the candidate with
   telemetry disabled and the documented 1536 MiB heap limit. Start its Next.js
   server on a confirmed-unused temporary loopback port. Smoke-test all nine
   routes, old redirects, metadata, images and changed content before activation.
4. Preserve the complete previous checkout, dependencies, public assets and `.next`
   as a uniquely named sibling rollback directory. Stop only `asymmetri.service`,
   then rename the complete candidate into `/var/www/asymmetri` and restart the
   existing service. The full-server administrator route may perform these two
   directory renames because `/var/www` is root-owned; all Git, dependency and
   build operations remain application-owned. Verify ownership after the move.
5. Verify loopback and both public HTTPS hosts, canonical/sitemap/redirect values,
   new product/video references, raster assets, service status and recent errors.
   Confirm the candidate SHA and build ID match the activated release and clean
   `main`. Capture desktop/mobile browser evidence and video behavior.
6. If health fails, stop the service, preserve the failed candidate under a separate
   name, restore the complete prior directory and restart. Verify the prior source
   SHA, prior build ID and served content. This restores source/public/dependencies
   together; swapping only `.next` is insufficient for this routing change.

Record exact candidate/rollback directory names, SHAs, build IDs and health results
in a task release receipt outside tracked source. Keep the rollback directory until
the owner chooses a retention policy. Do not delete unrelated backups to make space.
No release receipt should include credentials, private key contents or visitor logs.

### September 29, 2026: editorial redesign release

The human-voice and visual redesign was activated from clean `main` at
`08862c3d439ea007db5dfbb4e657e94c44afb873`, using the complete isolated-candidate
procedure above. The independent candidate passed `npm run check` and
`npm run build:next` on the existing Node 22 runtime before activation. Package
and lockfile equality allowed an independent copy of installed dependencies.

Post-activation checks passed on loopback, apex and `www`: all nine pages,
37 image/static URLs, four compatibility redirects, nine sitemap entries,
canonical values, ten tutorial modules and the protected Motion resources.
Desktop/mobile browser checks confirmed the new design and the Motion video's
click-to-load wrapper. The previous complete release remains available for
rollback. Exact deployment paths and build identities are recorded in the
external task receipt. Subsequent documentation-only commits may advance source
HEAD without changing the validated running build.


### Compressing an older retained rollback when capacity is limited

Keep the current serving release and the immediate pre-activation rollback as
complete independent directories. An older inactive website rollback may be
retained as a lossless archive to make room for the next candidate, without
changing its source or discarding recovery data:

1. Confirm its exact source SHA, build ID, clean state and inactive status.
2. As the application owner, archive the entire older directory, including Git,
   dependencies, public files and `.next`, to a unique file outside all checkouts.
3. Run gzip integrity, tar content comparison against the still-present directory,
   and a SHA-256 checksum. Stop on any mismatch or insufficient staging headroom.
4. Only after successful comparison, remove that exact uncompressed duplicate.
   Retain the archive and checksum; do not remove unrelated backups or caches.
5. Record the archive location, checksum and original source/build IDs in the
   external release receipt. Before using this older rollback, verify its checksum
   and extract as the application owner into an empty staging location, then check
   source/build identity and ownership before the usual directory activation.

This changes the storage form of the older rollback, not its retention. During
September 28 Work preparation, the archive was created and verified. A separate
owner-authorized cleanup then provided sufficient capacity, so the original
pre-portfolio rollback directory was retained alongside its archive.


## Immutable architecture-release markers

Before October 7 implementation, the verified live source was permanently tagged
`website-pre-architecture-redesign-2026-10-07` at
`679f3378701af6b04557c0bebff15120f21e3754`; see the
[baseline and product review](COMPANY_ARCHITECTURE_2026-10-07.md).
After the pushed redesign is activated and verified, create a separate annotated
`website-sports-labs-redesign-2026-10-07` tag at the verified production SHA.
If a proposed tag exists, use a unique suffix; never move or delete either marker.
Verify peeled remote targets. Record the final SHA, tags, candidate/rollback paths,
build IDs and health in the external task receipt. Tags mark source; the retained
complete directory supplies immediate runtime rollback. Fetchable tracked public
assets and the exact lockfile supply source-level recovery independent of local builds.


## Visual identity release with unchanged routes and dependencies

The October 7 identity update uses only the routine `ssh asymmetri` account. It
changes CSS, markup and static artwork without changing routing, dependencies or
runtime configuration. Use the staged copy-only model with these asset safeguards:

1. Inspect clean live `main`, fetch and verify the exact pushed SHA. Confirm
   package/lockfile, Next/Vinext/Worker configurations and route redirects are
   identical to the live revision. Record the running build ID and route health.
2. As the application owner, extract the reviewed Git revision into a unique
   `/var/tmp/asymmetri-visual-*` candidate. Copy unchanged dependencies independently
   with `cp -a` (no live install). Run check and Next build with telemetry disabled
   and `NODE_OPTIONS=--max-old-space-size=1536`. Smoke-test on a free loopback port.
3. Before activation, preserve a complete independent copy of the live checkout,
   including Git, public assets, dependencies and `.next`, under a unique
   `/var/tmp/asymmetri-rollback-*` directory. Check its SHA/build ID and tracked
   assets. Keep ample disk capacity; never delete other releases to make room.
4. Stop only `asymmetri.service`. Fast-forward live `main` to the exact reviewed
   `origin/main`, updating tracked CSS sources and social assets together. Move
   live `.next` into the candidate as `previous.next`, then move the validated
   candidate `.next` into the application directory. Start the same service.
   The application-owned live directory itself stays in place, so no full-server
   admin route or root-owned parent rename is needed.
5. Verify live source/build identity, all nine routes on loopback/apex/www,
   redirects, protected Motion resources, static artwork, logs and browser palette.
   Keep the complete snapshot and previous build; record paths in the task receipt.

If activation fails, stop the service, preserve all live directory contents
(including dotfiles) in a unique failed-release directory, then copy the complete
verified snapshot back into the existing live directory as the application owner.
Restart and verify the old source/build and routes. Do not reset or clean Git.
For a later non-emergency source rollback, create reviewed revert commits and
redeploy through this staged process, preserving shared history.

The immutable pre-update marker is
`website-pre-visual-identity-update-2026-10-07`, pointing to
`699c7b22007174300d63673162515165139e43c7`. It was created only after all nine
routes passed loopback and both public hosts. The separate
`website-visual-identity-update-2026-10-07` release tag is created only after the
new production passes verification; use a unique suffix if occupied. Verify both
remote peeled targets, never move/delete them.


## Selected Graphite + Teal release

Use the staged visual-identity process above for this CSS/browser-theme-color
promotion. Routes, configurations, dependencies and all public assets remain
byte-identical to the preceding release. No experimental review tools are copied.
The previous verified production marker `website-visual-identity-update-2026-10-07`
remains immutable at `c35ed81cd71bcfa0a96fd510e74046cff1a92386`.
After the pushed final main revision passes production verification, create an
annotated `website-dark-teal-theme-2026-10-07` tag at that exact revision (use a
unique suffix if occupied), push it and verify both remote peeled targets. Record
the exact source/build IDs, retained candidate/rollback paths and health evidence
in the external release receipt. Preserve historical exploration commits and tags.

## Labs open-source playground release

The October 7 Labs simplification retains the selected Graphite + Teal identity,
all routes, public assets, dependencies and runtime configuration. Use the copy-only
staged build procedure, preserving the live `.next` until checks/build succeed.
The immutable pre-change tag `website-pre-labs-simplification-2026-10-07` points to
verified healthy production at `bc85e3a4425b1133dd848711573981c56f6a22c8`.
After the final pushed revision passes production verification, annotate and push
`website-labs-open-source-playground-2026-10-07` at that deployed SHA (use a unique
suffix if occupied). Never move either tag. Record exact build/snapshot paths in
the external release receipt. Recheck both hosts' Motion resources and tutorial
originals as well as Labs, BotSquad and the homepage.

## BotSquad project-page release

The October 7 BotSquad rebuild keeps public assets, dependencies, routes and runtime
configuration unchanged. Use the existing unchanged-dependency copy-only method above:
extract the exact pushed source into a unique candidate, hard-link unchanged dependencies,
run production check/build and loopback smoke tests, then preserve the old `.next` at
activation. No npm install or dependency mutation is permitted in the linked trees.

Before switching, retain the full pre-change tracked-source archive and Git metadata beside
the old build; public assets are byte-identical across this release. The immutable rollback
marker `website-pre-botsquad-page-rebuild-2026-10-07` targets
`024338b4b07b85b3297c92ddea11b497e997c388`. This bounded source/build recovery path avoids
removing older releases or copying another full dependency tree on the small Droplet.
The live application path and existing service configuration remain unchanged.

After verifying the exact deployed main, service, loopback, both public hosts, protected
Motion resources and deliberate video behavior, annotate and push
`website-botsquad-project-page-2026-10-07` at that revision (unique suffix if occupied).
Never move either tag. Record candidate/archive/previous-build paths, build IDs and final
health in the external task receipt. See the [public-story source review](BOTSQUAD_PAGE_REVIEW_2026-10-07.md).

## Investment receiver is not deployed

INV-02 adds a locally validated, default-disabled service; none of the existing website deployment commands deploys or starts it. Do not package SQLite into Cloudflare Workers. The [receiver runbook](INVESTMENT_RECEIVER.md) and uninstalled `receiver/deploy/asymmetri-investment.service.example` describe separate identity/storage, supported OS/capacity, Node22 Linux validation, proxy-signature checks, backups/restore fencing and explicit future activation/rollback gates. These are proposals, not an INV-02 deployment authorization.
