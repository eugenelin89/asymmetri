# DigitalOcean production deployment

This guide covers routine redeployment of `https://asymmetri.co` on the current
DigitalOcean Ubuntu Droplet.

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

## Production guardrails

- Perform application Git and npm operations as `django-user`.
- Use root privileges only for operating-system responsibilities such as
  systemd and Nginx.
- Check the production working tree before the destructive reset.
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

**What and why:** Inspect the production repository before the reset. The next
step intentionally discards production-only tracked changes.

**Who, when, and where:** The server operator runs Git as `django-user` on the
Droplet. The command targets `/var/www/asymmetri` directly, so the operator’s
current directory does not matter.

**How:**

```bash
sudo -u django-user -H git -C /var/www/asymmetri status -sb
```

**Success:** The output identifies the expected branch and contains no modified,
deleted, staged, or untracked production-only files that need investigation.

**Common failure:** Git reports local changes, an unexpected branch, a missing
repository, or a permissions problem. Stop before reset and determine whether
the files are accidental, operationally important, or evidence of an incomplete
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
sudo -u django-user -H git -C /var/www/asymmetri reset --hard origin/main

sudo -u django-user -H git -C /var/www/asymmetri log -1 --oneline
```

**Warning:** `reset --hard origin/main` intentionally overwrites tracked
production files and destroys uncommitted tracked changes. It is appropriate
only after the status check and after confirming that `origin/main` contains the
intended deployment.

**Success:** Fetch completes, reset reports the target commit, and the final log
line matches the commit pushed from the Mac.

**Common failure:** The remote cannot be reached, credentials fail, the expected
commit is absent, or filesystem permissions prevent the reset. The running
service normally remains on its prior in-memory and `.next/` build until it is
restarted.

**Live effect and rerun safety:** Fetch is read-only with respect to the worktree.
Reset changes production source files but does not restart the live service.
After a successful clean reset, rerunning the same reset is idempotent.

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

The repository targets Node.js 24 in `.nvmrc`. The installed Next.js 16.2.12
package requires Node.js 20.9.0 or newer. Production should normally match the
repository target instead of relying only on the framework minimum.

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
for p in / /favicon.svg /robots.txt /sitemap.xml /story /contact; do
  curl -sS -o /dev/null \
    -w "$p -> HTTP %{http_code}  %{redirect_url}\n" \
    "http://127.0.0.1:3001$p"
done
```

Expected results:

- `/` returns HTTP 200.
- `/favicon.svg` returns HTTP 200.
- `/robots.txt` returns HTTP 200.
- `/sitemap.xml` returns HTTP 200.
- `/story` returns an HTTP 308 permanent redirect to `/#story`.
- `/contact` returns an HTTP 308 permanent redirect to `/#contact`.

Finally, open `https://asymmetri.co` in a browser. Use a hard refresh if the old
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

A previous deployment directory may exist at
`/var/www/asymmetri-next`. Do not assume it is complete or known-good. Inspect
it first:

```bash
ls -ld /var/www/asymmetri /var/www/asymmetri-next
sudo -u django-user -H git -C /var/www/asymmetri-next log -1 --oneline
sudo -u django-user -H test -x /var/www/asymmetri-next/node_modules/.bin/next
sudo -u django-user -H test -d /var/www/asymmetri-next/.next
```

If it is a confirmed previous working deployment and immediate recovery is more
important than preserving the current path in place, a root operator can swap
directories:

```bash
systemctl stop asymmetri.service

failed_dir="/var/www/asymmetri-failed-$(date +%Y%m%d%H%M%S)"
mv /var/www/asymmetri "$failed_dir"
mv /var/www/asymmetri-next /var/www/asymmetri

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

### Option 2: Git rollback to a known commit

List recent commits:

```bash
sudo -u django-user -H git -C /var/www/asymmetri log --oneline -10
```

Choose a commit that is known to have built and run successfully. Then:

```bash
sudo -u django-user -H git -C /var/www/asymmetri reset --hard <KNOWN_GOOD_COMMIT>

sudo -u django-user -H bash -lc '
cd /var/www/asymmetri
npm ci --no-fund
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=1536"
npm run build:next
'

systemctl restart asymmetri.service

curl -sS -o /dev/null \
  -w 'Public: HTTP %{http_code}\n' \
  https://asymmetri.co/
```

Replace `<KNOWN_GOOD_COMMIT>` with the reviewed full or unambiguous abbreviated
SHA.

Resetting production to an old commit does not change `origin/main`. The next
normal deployment will move production forward again. Prefer fixing or
reverting the bad commit in GitHub so `main` once again describes the intended
production state. Do not leave production permanently detached from `main`
without recording and resolving that decision.

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
