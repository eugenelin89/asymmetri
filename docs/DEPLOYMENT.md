# DigitalOcean production deployment

This guide covers routine redeployment of `https://asymmetri.co` on the current
DigitalOcean Ubuntu Droplet.

The [Campus and City menu receipt](CAMPUS_CITY_MENU_RELEASE_2026-10-31.md)
records the latest runtime: source `4f57af9`, build `9fGY4CtfRyxjVywNp8Hqf`,
activated October 31 at 22:07:44 UTC. Only the Labs submenu label changed;
`/labs/gis`, its page/card/footer name and all existing URLs are preserved.
The immediate copy-only rollback is the prior `Al8RacnJ4uunt6U1i9VTC` build at
`/var/tmp/asymmetri-campus-city-menu-20261031/previous.next`, source `f106770b`.

The preceding [UBC After Dark receipt](UBC_AFTER_DARK_RELEASE_2026-10-31.md)
records the unchanged campus behavior and current historical archive custody.
The [UBC landmarks and Halloween receipt](UBC_LANDMARKS_HALLOWEEN_RELEASE_2026-10-31.md)
records an earlier runtime and its then-current recovery paths. Use the latest
receipts and actual live identity before staging or restoring a release.

The [UBC natural dialogue receipt](UBC_NATURAL_DIALOGUE_RELEASE_2026-10-31.md)
records the preceding conversation release. Its source/build and then-immediate
rollback are historical; use the latest receipt and refresh actual live identity
before staging another release.

The [Surrey V0.6 release receipt](SURREY_V06_RELEASE_2026-10-31.md) records the
preceding Open Roads runtime, guidance follow-up, complete immediate rollback and
verified historical archives. Always refresh actual live source/build before
staging; older receipt identities are historical.

The [homepage division-link receipt](HOME_DIVISION_LINKS_RELEASE_2026-10-31.md)
records the preceding October 31 source/build and copy-only rollback. Homepage cards
open Sports and Labs; all city, UBC, BotSquad and Motion routes remain intact.
The preceding [UBC V0.3 receipt](UBC_CAMPUS_LIFE_RELEASE_2026-10-31.md) records
campus life and the community-profile routing configuration, which are unchanged.

The [UBC V0.2 Orchard release receipt](UBC_ORCHARD_RELEASE_2026-10-31.md) records
an earlier October 31 runtime: five UBC interior reconstructions, including one
Orchard Commons demonstration floor with eight rooms, while all three city apps
remain intact. Source `32f7295`, Linux build `uSdetjZWMH8Rh69FKnc5J`, activated at
08:16:08 UTC. Its then-immediate predecessor has since been retained as a verified
archive; see the Surrey V0.6 receipt for its current location and checksum. Private/public/browser,
protected-route and peer checks passed. The initial private memory-guard stop and
successful bounded-heap repeat are documented; safeguard floors were unchanged.
Later documentation commits do not change the runtime.

The [Surrey V0.5 release receipt](SURREY_V05_RELEASE_2026-10-30.md) records the
preceding October 30 runtime: playable driving, a complete delivery, bounded traffic
and moving train scenery, with Richmond and Vancouver preserved. Runtime source
`fcd2b90`, Linux build `VaAKfIoEAK5LbGri4K8V8`, activated at 23:20:24 UTC. Its
then-immediate predecessor has since been retained as a verified archive;
see the Surrey V0.6 receipt for current recovery instructions.
Public HTTP/asset and peer guards passed. The post-release visual browser recheck
passed by 23:35 UTC after browser reconnection: held driving controls, aerial
pause/resume, occupied-car reload and compact portrait/landscape layouts. Physical
iPhone/Android testing remains outstanding. Documentation commits do not change
the runtime.

The [Richmond V0.1 release receipt](RICHMOND_RELEASE_2026-10-30.md) records the
preceding October 30 runtime: Richmond delivery/mall/YVR gameplay and unobstructed
phone controls, exact-source Linux build, private/public acceptance and complete
Surrey V0.4 rollback. Its deployed identity supersedes the earlier receipts below;
later documentation commits do not change the running build.

The [Vancouver V0.5 release receipt](VANCOUVER_V05_RELEASE_2026-10-30.md) records
the October 30 compact phone view, experimental manual controls, exact-source
Linux build, preserved Surrey V0.3, verified older-runtime archival and complete
immediately preceding rollback. Its deployment identity supersedes earlier
October 30 runtime receipts; subsequent documentation commits do not change it.

The [Labs menu release receipt](LABS_MENU_RELEASE_2026-10-30.md) records the current
October 30 exact-source Linux build, simplified global menu and retained BotSquad
area links. The preceding [city naming receipt](GIS_CITY_NAMES_RELEASE_2026-10-30.md)
records the city display-name corrections. Both use the documented copy-only path
with unchanged routes, assets and dependencies. The earlier
[Vancouver V0.4 release receipt](VANCOUVER_V04_RELEASE_2026-10-30.md) records the
GIS Apps grouping, preserved Surrey V0.2 and complete pre-V0.4 runtime.
Later documentation commits do not change the activated source/build identity.

The [October 22 direct Motion video release receipt](MOTION_VIDEO_RELEASE_2026-10-22.md)
records the live native player, updated website-media disclosure, verified Linux
build, protected-route acceptance and retained preceding source/build.

The [October 21 Motion access release receipt](MOTION_ACCESS_RELEASE_2026-10-21.md)
records the live `/motion/try` redirect, website signup actions, privacy extension,
independent candidate, verified archival and complete preceding-runtime rollback.

The [October 21 Sports/Motion release receipt](MOTION_V12_RELEASE_2026-10-21.md)
records the v1.2 website refresh, exact production build, protected-route checks,
retained rollback and verified archival used to restore deployment headroom.
The website release does not imply public App Store availability.

For the BotSquad investment experiment, consult the [cross-repository integration map](BOTSQUAD_INTEGRATION.md), the [investment release handoff](INV-REAL-01-WEBSITE.md) and [current website and investment receiver release receipt](INVESTMENT_CLOSE_RELEASE_2026-10-14.md) and BotSquad's [authoritative milestone roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md). The investment UI was publicly released October 13 at `97b4087`, with truthful unconfigured archive and disabled Ask states. Its strict visibility-witness reads require compatible receiver and website source. The [shared HTTPS release](INGRESS_RELEASE_2026-10-13.md) records active empty/disabled-intake receivers, confinement and renewal. The subsequent [investment activation](INV-REAL-01-WEBSITE.md) verifies finite HQ authority, five signed initial events, official selection and runtime read enablement on the unchanged d0c4543 build. Market/employee execution and ongoing independent backup custody remain unverified. The owner authorized this work and deployment; website publication alone does not activate producer or receiver authority.

The owner [cancelled/deferred INFRA-01](INFRA-01-CANCELLATION.md) on October 9.
Production stays on Ubuntu 22.10 under a time-limited unsupported-OS exception;
review it before the next deployment or new public exposure. The migration snapshot
was deleted after backup verification and cleanup is complete. Django retirement
was evaluated but not executed. Preserve all existing runtimes, shared identities,
data, domains and recovery material. Do not reactivate historical rebuild instructions.
Future deployments require explicit scope and actual Linux/runtime, proxy/signature,
capacity, least-privilege and recovery acceptance. An Ubuntu upgrade is no longer an
automatic prerequisite. Routine commands below do not authorize receiver activation.

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

The [Ask closed launch packet](ASK-LAUNCH-CLOSED.md) uses the reserved larger Linux
host for final checks/builds after the website host's resource guard stopped a
compiler. This is a bounded release exception: run as the staging application
owner with the exact production Node 22 executable and matching native packages;
retain source/dependency/build hashes and check peer identities and disk/memory
headroom. Transfer only the verified candidate artifacts, verify their hashes and
source files against the committed candidate, and run a production-owner loopback
smoke test before activation. Do not lower the website host's headroom guard or
compile inside the live tree. Existing activation/rollback and private-data
preservation requirements remain unchanged.

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

- Ubuntu 22.10 is end-of-life. Apply the [owner exception and review triggers](INFRA-01-CANCELLATION.md#time-limited-unsupported-os-exception). A future upgrade needs a separately requested project; do not silently restart INFRA-01.
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

For copy-only changes, the exact-source Node 22 Linux candidate workflow may
replace on-host compilation. Verify its successful checks, source SHA, archive
hash and build ID, then extract only `.next` into the application-owned staging
workspace. Confirm package, lockfile, runtime configuration, routes and public
assets are unchanged before reusing installed dependencies; never run an install
against hard-linked dependencies. Smoke-test that build on a private loopback
port under the same 192 MiB available-memory and 6 GiB free-disk floors before
the build swap. Preserve the prior `.next` and source identity for rollback;
source remains clean `main` and advances only by fast-forward. Route, asset or
dependency changes still require the complete candidate procedure below.

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
   The October 13 lockfile required npm 11.6.0: production npm 10.9.8 rejected
   optional emnapi entries despite local locked installation passing. In that
   isolated candidate, `npm exec --yes --package=npm@11.6.0 -- npm ci --no-audit
   --no-fund` installed the unchanged lockfile. This is a pinned one-shot package
   manager, not a global runtime upgrade. Check the candidate's clean Git state
   afterward; do not repair a deployment by changing its tracked lockfile.
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

If production cannot hold the archive while maintaining its required free-space
floor, stream it over the existing authenticated SSH connection to private,
durable owner storage outside Git. Sync it there, compare its SHA-256 and size
with the server's streaming receipt, and verify gzip integrity. Stream that exact
archive back to GNU tar for a full content and metadata comparison against the
still-present original. Only then retire the redundant directory. Keep a private
receipt on the server and beside the archive; restoration requires transferring
this exact archive back and verifying its checksum before extraction. The current
release and immediate rollback must remain complete on the server. See the
[October 15 retention record](WEBSITE-ROLLBACK-ARCHIVES_2026-10-15.md).

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

## Independent private investment receiver

[INFRA-02](INFRA-02-RECEIVER-DEPLOYMENT.md) installs the accepted INV-02 receiver independently at `/opt/asymmetri-receiver`, with private SQLite under `/var/lib/asymmetri-investment` and root-owned disabled configuration under `/etc/asymmetri-investment`. That initial installation left `asymmetri-investment.service` static/inactive. The [October 13 ingress release](INGRESS_RELEASE_2026-10-13.md) explicitly started it with strict HTTPS and an empty archive. The subsequent investment activation installs an exact finite publisher scope, approves the frozen configuration and selects the first accepted official run. None of the website deployment commands deploys or starts it; no website source/build/dependency update accompanied installation. Do not package SQLite into Cloudflare Workers.

Use the receiver's [installation/backup/rollback runbook](INFRA-02-RECEIVER-DEPLOYMENT.md) and [actual Linux acceptance](INFRA-02-VALIDATION.md). A transparent loopback Nginx test passed; the nginx 1.22 HTTP profile failed duplicate Connection preservation and is not accepted for public/real traffic. Exact HTTP/TLS ingress is now verified by the release receipt. Recurring backups/retention, representative live capacity and genuine publication remain separate gates; owner deployment authorization and the existing OS exception remain in effect.

## INV-03 private receiver compatibility update

[INV-03 acceptance](INV-03-VALIDATION.md) records a receiver-only update, additive
schema 002 and disabled empty operational state. No website release or Nginx restart
is part of it. Use [receiver operations](INV-03-OPERATIONS.md) for rollback, backup
and owner controls; [ingress gates](INV-03-INGRESS.md) for future shared-443 work.
The website routes were separately released October 13; see the current release
receipt. Receiver activation remains independent.

## Historical INV-04 source milestone and subsequent release

INV-04 is locally validated website source plus additive receiver read headers.
It does not authorize a website release, receiver restart, public ingress or real
publisher/Ask activation. That source milestone itself did not change production. The subsequently authorized
October 13 website release is recorded in [INV-REAL-01](INV-REAL-01-WEBSITE.md).
A future authorized release must coordinate receiver `X-Archive-Visibility` support
before enabling website read variables; the website fails closed without it. Keep
fixture launcher/test content and fixture environment values out of operational
startup. Preserve protected Motion URLs, tutorial canonical/hashes/original images
and both existing hostnames in the before/after release checks.

Shared HTTPS/TLS ingress, the rejected Nginx HTTP profile, sustained real public
capacity, actual key/receipt reconciliation, retention/backup custody, source and
redistribution rights, and the unsupported Ubuntu 22.10 risk remain separate gates.
Later investment and Ask milestones plus explicit INV-12 activation still apply.


## October 13 shared-apex ingress release

[The ingress runbook](INV-03-INGRESS.md) now includes source and isolated Linux
acceptance for a bounded Node TLS/raw router behind the installed Nginx SNI
stream dispatcher. Its example remains disabled; no ordinary website deployment
command installs an ingress unit, copies certificate keys, edits listener or
renewal configuration, or activates Ask. The owner-authorized integration is now installed: [the release receipt](INGRESS_RELEASE_2026-10-13.md)
records exact listener rollback, trusted metadata, renewal and 112 before/after
all-vhost/protected-route checks. The explicit
website loopback authority setting is `ASYMMETRI_INVESTMENT_READ_AUTHORITY`.


Service examples now exist for the independent TLS/router and private Ask process.
Use the [ingress certificate procedure](INV-03-INGRESS.md#shared-host-rehearsal-and-service-packaging)
and [Ask installation boundary](ASK-01-PRIVATE-RECEIVER.md#private-linux-service-packaging).
Run `systemd-analyze verify` on installed-path candidates and verify actual
confinement, certificate reload/renewal and disabled-intake state before exposure.
The all-vhost rehearsal verified 64 checks in each baseline/shared/rollback phase;
it did not itself change production listener files.

## Live investment read configuration — October 13

The [complete activation receipt](INV-REAL-01-WEBSITE.md#signed-publication-selection-and-website-activation-receipt)
records the exact real run, publisher generation/expiry, configuration hash, signed
receipts, backup/restore validation and public checks. Website source d0c4543 and
build P7LP4PKXMUyZ96RJnAgcz are unchanged; PID 2386085 started at 20:36:55 UTC.
The systemd drop-in `/etc/systemd/system/asymmetri.service.d/20-investment-read.conf`
sets only `ASYMMETRI_INVESTMENT_READ_ORIGIN`, `ASYMMETRI_INVESTMENT_READ_AUTHORITY`,
`ASYMMETRI_INVESTMENT_EXPERIMENT` and `ASYMMETRI_INVESTMENT_RUN`. Read origin is
`http://127.0.0.1:3101`, with fixed Host `asymmetri.co`; exact IDs are in the receipt.
These server-only settings are neither build-time public variables nor Ask authority.

The guarded read-configuration rollback is
`sudo -n python3 /var/lib/asymmetri-investment-activation-20261013/website-enable.py rollback`.
It restores the unconfigured read state on the same verified build, preserving
all accepted receiver records and other services. It checks the exact task-owned
drop-in before removal. This is separate from earlier source/build rollback swaps;
re-review after subsequent website releases. Never restore an empty pre-activation
database over accepted history to reverse a page configuration.

## Dormant Ask visitor interface

The [Ask UI packet](ASK-03-WEBSITE-UI.md) leaves production intake closed.
Do not deploy `ASYMMETRI_ASK_UI_MODE=synthetic_fixture` or any fixture adapter, key
or data tree. That flag cannot enable the synthetic fixture in production. The
current production client reads authoritative availability and remains closed
without an approved disclosure.
Website deployment alone grants no Ask authority. Retain the shared ingress,
receiver identities and protected Motion compatibility checks for every release.

The [October 13 unavailable Ask page release](ASK-03-RELEASE_2026-10-13.md)
records live source `d51288fc52b0faa4401848ec9d009ad3cc3ae87b`, exact build,
112 preservation checks and the complete 97b4087 predecessor rollback. It changes
only the website and leaves shared ingress/receiver authority unchanged.


The subsequent [closed Ask production-path release](ASK-04-RELEASE_2026-10-13.md)
is the current website at `d0c454314d646b74895f4d9e3e4a014c63c666a6`, with complete
prior d51288f rollback. At that website release, its receiver fixes remained
source-only; the separate rollout below subsequently installed them. No operational
intake, authority or archive reads were enabled.

The [closed Ask receiver rollout](ASK-04-RECEIVER-RELEASE_2026-10-13.md) installs
private source 4daa713 separately from the unchanged d0c4543 website. It records
Ask-only guarded activation/rollback, retained startup failure and recovery, exact
closed-state acceptance, bounded Linux resources and four pre-existing IPv6 TLS
exceptions. Its root-held rollback command operates only Ask code and preserves
private state and HTTP protection counters.

## Closed Ask memory and recovery safeguards

The [operational receipt](ASK-04-OPERATIONS_2026-10-13.md) records the Ask-only
launcher/drop-in, zero swap/core limits, actual process read-back, non-content
backup and isolated held restore. Install the root-owned launcher before the
updated unit example. Keep the running application source/configuration separate
from this service-profile change; no website or investment restart is needed.
The receipt gives the guarded Ask-only rollback and exact unresolved custody gates.

## October 13 navigation and closed contract release

The [current release receipt](BOTSQUAD-NAVIGATION-RELEASE_2026-10-13.md) records the BotSquad Research hub,
shared navigation, neutral investment introduction and installed closed Ask
activity-contract source. It supersedes earlier runtime identities while preserving
live investment records, protected Motion pages and unchanged service configuration.
Public Ask remains closed; the later configuration-read amendment is separate.

The subsequent [portrait release](BOTSQUAD-PORTRAITS-RELEASE_2026-10-13.md)
records website source da09185, exact build/activation identity, guarded code-only
rollback and live image acceptance. Ask and investment receivers are unchanged.

The later [Ask configuration release](ASK-CONFIGURATION-RELEASE_2026-10-13.md)
installs receiver source 2b63015 after 254 isolated Linux cases, with intake closed
and exact code-only rollback. Its [older runtime retention record](WEBSITE-ROLLBACK-ARCHIVES_2026-10-13.md)
explains the two archived historical website trees and restoration commands.

## Investment status wording release

The [October 13 status-copy receipt](BOTSQUAD-STATUS-RELEASE_2026-10-13.md) records
website source `f47f99b`, guarded activation and complete `da09185` rollback runtime.
Public review, publisher-contact and snapshot-session labels changed; receiver
versions, data, authority and closed Ask gates are preserved.

## October 14 closed Ask launch preparation release

The [verified closed launch receipt](ASK-LAUNCH-RELEASE_2026-10-14.md) records
website and Ask receiver source `6a194f0`, the Node 22 Linux build transfer,
complete rollback trees, native/browser acceptance and unchanged configuration.
The candidate API notice remains unapproved and public questions remain disabled.

## October 14 close-recovery compatibility

The [close-recovery packet](INVESTMENT_CLOSE_RECOVERY_2026-10-14.md) requires a
matching reviewed canonical manifest before receiver and website installation.
Deploy the receiver before HQ publishes the new optional fields, preserve its
configuration, finite publisher generation, receipts, complete prior event prefix
and ledger, and keep Ask unchanged. Installation does not activate HQ authority.

An older receiver may reject the new event fields after they are accepted. Before
code rollback, validate every retained event against that older contract; if any
record is incompatible, retain the data and stop for a compatible forward repair.
Never restore an older database or remove an accepted amendment to make old code
start. Website and receiver activation remain separate guarded operations.

The [October 14 close-amendment release receipt](INVESTMENT_CLOSE_RELEASE_2026-10-14.md)
records the actual candidate guards, source/build identities, stopped archive
backup and public/Ask preservation checks. After new amendment records are
accepted, older website builds can fail closed on the new status field; prefer
a compatible forward repair over assuming an old website is a useful rollback.


## Trade URL migration rollback

For the October15 Trade URL migration, retain the normal complete pre-activation
runtime and a separately built compatibility fallback that serves both public URL
namespaces. A pre-migration runtime alone cannot serve new bookmarks or cached308
destinations. Use the tested compatibility fallback for operational rollback, keep
the failed migration for diagnosis, and forward-fix the canonical Trade release.
Never combine the fallback's Trade→Investment rewrite with the migration's
Investment→Trade redirect. The [migration contract](BOTSQUAD_TRADE_URL_MIGRATION_2026-10-15.md)
records scope and validation; exact commits/builds/manifests belong in the release
receipt. Do not modify ingress, private receivers or stored records for this move.

## Vancouver isolated Linux candidates

The [V0.4 release record](VANCOUVER_V04_RELEASE_2026-10-30.md) records the current
completed release gates and deployed identity. The
[V0.3 release record](VANCOUVER_V03_RELEASE_2026-10-30.md) preserves the preceding
Vancouver release evidence. The [V0.2 release record](VANCOUVER_V02_RELEASE_2026-10-30.md)
records the earlier October 30 production identity, acceptance, rollback and
older-runtime retention.

See the [October 30 release record](VANCOUVER_RELEASE_2026-10-30.md) for deployed
features, verification, runtime identities, recovery and remaining limitations.

The owner explicitly authorized implementation, main push and public experimental
release on October 30, 2026, including safe resolution of capacity prerequisites.
The unsupported Ubuntu host remains under the reviewed retained-host exception;
no OS, Nginx, TLS, DNS or unrelated service change is part of Vancouver. The source
update remediates the production dependency audit findings without a broad stack
upgrade. The existing production Node 22 approval continues.

`.github/workflows/website-linux-candidate.yml` builds public source on isolated
Ubuntu x86_64 with Node 22.23.1, pinned actions and npm 11.6.0. It runs checks,
Vancouver tests, the production audit and standard Next build; it packages a
Linux runtime plus source SHA and SHA-256. It has read-only repository permission,
no production secrets, no SSH access and no automatic deployment. Seven-day CI
artifact retention is transport only; keep release evidence in owner storage.

Download and verify the successful exact-SHA artifact, create an independent
application-owned checkout using the existing SSH/Git route, and extract matching
Linux dependencies/build. Never mix Mac dependencies into production, mutate a
hard-linked rollback dependency tree, or compile inside the live checkout.
Retain the 192 MiB production available-memory and 6 GiB free-disk floors through
preparation, loopback acceptance and activation. Archive only verified older
inactive website runtimes using the existing lossless retention procedure when
capacity requires it; keep live and immediate rollback complete on-server.

Validate the candidate on a private loopback port, compare protected route main
content/assets/canonicals/redirects, then use the complete-directory swap above.
Preserve the previous release and recheck public HTTPS, services and unrelated
vhosts. Record exact source/build/artifact/rollback identities and measured
capacity outside Git. CI success alone is never deployment approval or proof of
production health. The owner separately authorized V0.1 and the autonomous
V0.2 experimental release. V0.2 uses the same guarded independent candidate and
whole-directory rollback process, without infrastructure or dependency changes.
Keep published V0.1 data and the complete preceding V0.1 runtime recoverable.

V0.3 is explicitly authorized under the same floors and independent Linux candidate
procedure. Preserve both published earlier snapshots and a full immediately prior
V0.2 runtime. The redundant original V0.1 candidate may be removed only after a
lossless owner-held archive, SHA-256, gzip check and full remote tar comparison,
plus rechecking inactivity, clean source/build and absence of configuration refs.
Keep the final V0.1 rollback and pre-Vancouver runtime as well. No host upgrade,
configuration change, service change or threshold exception is authorized here.

V0.4 uses the same explicit deployment authorization, exact-SHA Linux candidate,
192 MiB / 6 GiB floors and whole-directory recovery. See
[V0.4 release evidence](VANCOUVER_V04_RELEASE_2026-10-30.md). Re-read the currently
serving identity immediately before preparation; Surrey or another authorized
website release may have advanced it. Preserve that immediate predecessor in full,
all older Vancouver datasets, and unrelated source/content. Never assume V0.3 is
still the preceding runtime. Only independently verified inactive older assets may
be archived using the established lossless retention procedure.

## Surrey Adventure release candidate

The [V0.1 release record](SURREY_RELEASE_2026-10-30.md) records the completed
production release, exact Linux/source identity, live mission acceptance,
capacity evidence and complete preceding Vancouver V0.3 recovery.

Surrey adds `/labs/surrey` and a separate static map; use the same isolated Linux
candidate and whole-directory activation procedure as Vancouver. The user's
October 30 request authorizes a dedicated feature branch and production release
only after existing safeguards pass. The `prebuild:next` hook includes Surrey tests in the exact-SHA
Linux build. Preserve Vancouver snapshots and the complete immediately preceding
runtime. The 192 MiB memory and 6 GiB disk floors, Node 22, existing proxy/services,
protected routes and rollback rules remain unchanged. Do not activate from a Mac
build or bypass a capacity guard. If blocked, retain the tested feature candidate
and report the measured blocker; CI does not automatically deploy the website.

V0.2 uses `codex/surrey-adventure-v02`, preserves the V0.1 geographic snapshot and
keeps the complete live Surrey V0.1 runtime for immediate rollback. Validate both
cases, aerial controls and local saves as well as existing routes. Archive an
older inactive runtime only after full off-server hash/gzip/tar comparison and
reference/activity checks; never sacrifice the immediately preceding live runtime
to stage the candidate. No workflow, proxy, runtime version or service change.

[V0.2 release and recovery receipt](SURREY_V02_RELEASE_2026-10-30.md) records the
completed exact-source Linux deployment, public/browser checks, capacity floors
and complete Surrey V0.1 rollback. Later documentation commits do not change
the deployed source/build identity.

V0.3 uses `codex/surrey-adventure-v03` and a new static snapshot while retaining
V0.1 byte-for-byte. Keep the user-confirmed Surrey display name and all concurrent
GIS/Vancouver/Richmond and Labs-menu commits. Before integration and staging, fetch
latest main and serialize the release window with the other active GIS work.
This is a feature/data release: use an independent full Linux runtime and complete
immediate-predecessor rollback, never the naming release's copy-only exception.
Check both cases, migrated V0.2 saves, view controls and compact phone layouts.
The 192MiB memory and 6GiB disk floors and all protected services/configurations
remain mandatory. See [V0.3 release receipt](SURREY_V03_RELEASE_2026-10-30.md) for
measured candidate, activation or exact blocking evidence.


## Surrey V0.4 — Living Surrey

Surrey V0.4 must use the existing guarded exact Linux candidate workflow, refreshed approved main and a complete immediate runtime rollback. Do not deploy while Richmond holds the shared window. No OS, network, database or peer-service change is part of this release. Completed October 30 at 22:26 UTC: runtime `0a73d7c`, Linux build `-btiWXzoBuaN8Yg_3rBIy`; the complete immediate predecessor is retained at `/var/www/asymmetri-rollback-before-surrey-v04-20261030`. Private/public checks and peer guards passed. See [V0.4 release receipt](SURREY_V04_RELEASE_2026-10-30.md).

## Surrey V0.5 — On the Move

V0.5 was integrated on `codex/surrey-adventure-v05` after Richmond handed off
approved main `2618089`. The exact Linux candidate was activated with a complete
Richmond V0.1 runtime rollback. Refresh live identities before any later release.
Use the existing exact-source Linux candidate workflow and 192MiB available-memory /
6GiB free-disk floors with continuous guards. Preserve all old geographic bytes,
Vancouver/Richmond/GIS/Motion/BotSquad routes, saves and immediate full-runtime
rollback. No OS, DNS, TLS, database or peer-service changes are authorized by this
release. Status and exact release receipts: `SURREY_V05_RELEASE_2026-10-30.md`.

## Surrey V0.6 release and recovery

V0.6 including the live-guidance correction is deployed from exact Linux source
`bbf194c3584637868bf92936da946485caca2929`, build `Ds3XoQLPUe8czRrb_7rcW`.
The complete immediately previous V0.6 runtime is retained at
`/var/www/asymmetri-rollback-before-surrey-v06-guidance-20261031`; the preceding
UBC runtime also remains at `/var/www/asymmetri-rollback-before-surrey-v06-20261031`. Read
`SURREY_V06_RELEASE_2026-10-31.md` for activation, preservation checks and older
runtime archive recovery; do not assume old expanded rollback paths still exist.
V0.6 passed the October 31 local ordinary-control detour journey, moving
reroute, parked-car/save continuity and rendered responsive checks documented in
`SURREY_V06_ACCEPTANCE_2026-10-30.md`. For future releases, refresh actual live
identity and approved main, coordinate the shared window, build an exact-source
Linux candidate and preserve the complete immediate runtime rollback. Existing
capacity guards, peer/protected-route checks and artifact/source/BUILD_ID checks
remain unchanged. Repeat browser acceptance on the live release. This candidate
makes no OS, DNS, TLS, database, service-policy or deployment-helper changes.

## UBC Orchard Commons V0.2

The October 31 user instruction explicitly authorizes automatic production release
after validation. Use the unchanged exact-SHA Linux workflow. Its existing build command now
includes UBC through `prebuild:next`, alongside Surrey/Richmond; Vancouver remains
an independent workflow check. Preserve Node 22,
the retained-host OS exception, continuous 192 MiB available-memory / 6 GiB free-disk
floors, peer/configuration fingerprints, protected routes and the complete immediate
predecessor. No new hosting, OS, DNS, TLS or unrelated service change is in scope.

`UBC_ORCHARD_MVR_2026-10-31.md` records local acceptance and release status. Verify
actual live source/build before staging; documentation or CI success alone is not
deployment. Preserve all published UBC and city datasets.

## UBC campus life V0.3

The [V0.3 implementation](UBC_CAMPUS_LIFE_V03.md) adds two public-space interiors,
visitor navigation, ambient activity and an explicitly requested opt-in profile
backend. Build/test the exact reviewed source through the existing Linux candidate
workflow. Use a new independent candidate and retain the complete V0.2 runtime.
Production activation must be recorded separately after verification; source push
alone is not a deployment.

Follow [profile operations](UBC_COMMUNITY_OPERATIONS.md): provision the private
persistent store outside every release directory, preserve its data on rollback,
and compare all prior configuration hashes plus the one expected systemd drop-in.
Check public GET projection, ownership isolation, CSRF rejection and no-store
headers in addition to protected Motion/city routes and immutable asset digests.
No profile data, private recovery codes or local test fixtures belong in Git or
public deployment artifacts.

### V0.3 profile route correction

Public verification found that the shared raw ingress intentionally rejects unknown
`/api/` families, although the private candidate can serve them. UBC profiles must
use `/labs/ubc/community-api/` through the ordinary website backend. Keep the raw
router, investment/Ask authority, Nginx `/api/` denial, peer services and all prior
configuration untouched. Verify public GET and write boundaries after activation;
a loopback candidate check alone does not validate shared ingress routing.

The corrected V0.3 deployment is verified live. The [production receipt](UBC_CAMPUS_LIFE_RELEASE_2026-10-31.md) records exact artifact identity, the initial rollback, corrected public profile recovery, resource safeguards and retained recovery runtime.

### UBC encounter refinements

Verified live October 31 at 16:51 UTC: source `526213d`, Linux build
`ujW5iepUV_ni0g_OH7ONo`. The [release receipt](UBC_ENCOUNTER_RELEASE_2026-10-31.md)
records private/public/browser acceptance, unchanged shared services and profile
storage, exact artifact hashes, the complete immediate predecessor, and lossless
archival of two older inactive runtimes to retain the existing capacity floors.
Follow the same exact-source independent-runtime process for subsequent releases.

### UBC After Dark release

Verified live October 31 at 21:52:48 UTC: source `f106770b`, Linux build
`Al8RacnJ4uunt6U1i9VTC`. The [release receipt](UBC_AFTER_DARK_RELEASE_2026-10-31.md)
records exact-source CI, guarded independent staging, public/browser acceptance,
unchanged protected content/services/profile storage and complete rollback.
All six older server archives remain; the selected older bbf runtime has verified
owner-only archive custody under the documented capacity procedure. Preserve that
archive and its receipts. The 192 MiB RAM and 6 GiB disk floors remain unchanged.

### CWRU V0.1 release

Verified live October 31 at 22:32:09 UTC: source `28b5521`, Linux build `H6dUdFnitvZI1P5BXdc9O`. The [release receipt](CWRU_RELEASE_2026-10-31.md) records exact-source CI, both-host acceptance, live profile lifecycle, browser evidence and final health. Preserve `/var/lib/asymmetri-cwru-community` and its `40-cwru-community.conf` systemd dropin in every successor baseline. The complete immediate rollback is `/var/www/asymmetri-rollback-before-cwru-v01-20261031`. Two older expanded runtimes now have verified owner-only archive custody; six older server archives remain. Resource floors stay 192 MiB available RAM and 6 GiB free disk. The server release slot was handed to Stanford after these checks; shared reviews/reporting are a separate CWRU follow-up.
