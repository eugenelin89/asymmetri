# Prompt 014: Architecture and DigitalOcean deployment documentation

- Date: 2026-07-30
- Scope: deployment
- Goal: Give a new operator a repository-backed architecture reference and a safe, detailed procedure for routine DigitalOcean redeployment and rollback.

## Original user request

> Create comprehensive, practical documentation for the Asymmetri Labs website
> architecture and its DigitalOcean production redeployment workflow. Verify all
> commands and repository details, do not change application behavior, and do
> not deploy or modify the server.

The user supplied a detailed operational brief identifying `asymmetri.co` as a
standard Next.js 16 deployment on a resource-constrained DigitalOcean Ubuntu
Droplet. Nginx terminates HTTPS and proxies to a loopback-only Next.js server on
port 3001. systemd runs the application as `django-user` from
`/var/www/asymmetri`.

The brief required product, application, and production architecture; a
beginner-friendly routine redeployment guide with full operator, location,
timing, purpose, execution, success, failure, live-effect, and rerun guidance;
troubleshooting; three rollback approaches; first-time versus routine deployment
guidance; operational checklists; and security and maintenance notes. It also
required a strict distinction between the standard Next.js production workflow
and the retained Vinext and Cloudflare workflow.

## Scope

Included:

- product, route, component, content, metadata, asset, and rendering
  architecture;
- npm scripts and their actual executable paths;
- standard Next.js and Vinext build and runtime boundaries;
- DigitalOcean, Ubuntu, DNS, Nginx, Let’s Encrypt, systemd, Node.js, npm, Git,
  and filesystem responsibilities;
- local preparation and direct-to-`main` Git workflow;
- production fetch, destructive reset, dependency installation, checks, build,
  restart, route verification, and logs;
- DigitalOcean web-console disconnects, build failures, service startup
  failures, 502 responses, low disk space, Git ownership warnings, and npm audit
  findings;
- directory, Git, and systemd rollback procedures;
- routine versus staged deployment decisions;
- predeployment and postdeployment checklists;
- current Ubuntu 22.10, Droplet resource, and SSH maintenance concerns.

Excluded application behavior, public copy, styling, dependencies,
configuration, deployment code, live server access, DNS changes, Nginx changes,
service changes, release creation, hosted previews, and deployment.

## Decisions

- Documented DigitalOcean as the current production path and retained OpenAI
  Sites as a separate, explicitly requested alternative path.
- Made `npm run build:next` the standard DigitalOcean build and documented the
  direct `node_modules/.bin/next start` executable as the production runtime.
- Explicitly warned that `npm run start` invokes Vinext and is not the
  DigitalOcean startup command.
- Derived product routes, redirects, metadata, favicon, social preview, robots,
  sitemap, component roles, and absent capabilities from repository source.
- Identified Node.js 24 as the repository target and Node.js 20.9.0 as the
  installed Next.js package minimum.
- Treated the supplied production topology as the current operational baseline
  while preserving the live systemd and Nginx files as the source of truth.
- Used a consistent six-part explanation for every routine deployment step.
- Kept production Git and npm operations under `django-user` and reserved root
  for systemd, Nginx, and operating-system work.
- Presented `reset --hard origin/main` as intentionally destructive and
  dependent on a clean production status check.
- Documented realistic rollback choices without assuming that a backup
  directory or service-file copy is valid.

## Implementation

Expanded `docs/ARCHITECTURE.md` into a product, application, and production
infrastructure reference. It now contains the public route map, static and
server responsibilities, metadata and asset data flow, strict TypeScript and CSS
roles, directory map, exact npm script table, runtime comparison, request path,
infrastructure ownership table, current production assumptions, and
representative systemd and Nginx configuration.

Rebuilt `docs/DEPLOYMENT.md` as a detailed DigitalOcean operations manual. It
contains 12 routine steps, command notes, guardrails, role boundaries,
troubleshooting, three rollback methods, deployment-scope guidance, security
notes, and before and after checklists. The retained Sites workflow is described
separately at the end.

Updated the README documentation index and production summary. Clarified the
DigitalOcean runtime in the local-development command table and aligned testing
guidance with both the standard Next.js and Vinext builds.

## Engineering impact

This change affects documentation only. No application, content, style, asset,
dependency, package lockfile, runtime configuration, build configuration,
service, server, DNS, certificate, Nginx, or deployment state changed.

The repository now distinguishes the two supported build paths accurately and
provides safer operational guidance for a destructive production reset, a
resource-constrained build, service restart, verification, and rollback.

## Files changed

- Expanded architecture documentation in `docs/ARCHITECTURE.md`.
- Replaced the former Sites-focused deployment overview with the DigitalOcean
  operations guide in `docs/DEPLOYMENT.md`.
- Added a documentation index and current production summary to `README.md`.
- Clarified the standard Next.js production command in
  `docs/LOCAL_DEVELOPMENT.md`.
- Updated deployment validation expectations in `docs/TESTING.md`.

## Documentation updated

All changed files are documentation. Existing brand, content, asset, and
strategy documents remained unchanged because the task did not alter their
subjects.

## Git diff summary

The implementation commit changed five text files with 1,157 insertions and 77
deletions. No binary, source, configuration, dependency, package-lock, or
generated file changed.

## Verification

- Preflight confirmed a clean `main` branch synchronized with `origin/main`.
- Repository inspection covered `AGENTS.md`, `package.json`,
  `package-lock.json`, `.nvmrc`, Next.js, TypeScript, ESLint, Tailwind, PostCSS,
  Vinext, Vite, Worker, Sites, application, component, content, public asset,
  architecture, deployment, local-development, testing, and journal files.
- The installed Next.js package metadata confirmed version 16.2.12 and Node.js
  requirement `>=20.9.0`.
- Node.js v24.10.0 matched the `.nvmrc` major version.
- Every npm script referenced by the updated documents exists in `package.json`.
- All changed Markdown files have balanced code fences and valid local links.
- `npm run check` passed strict TypeScript and ESLint.
- `npm run build:next` passed and statically generated the homepage, robots, and
  sitemap routes.
- `npm run build` passed the retained Vinext production build. It emitted only
  the known Tailwind no-utility-class warning because the current page uses
  semantic CSS.
- The documented direct Next.js executable started successfully on
  `127.0.0.1:3001` in the local workspace.
- Local route checks returned HTTP 200 for `/`, `/favicon.svg`, `/robots.txt`,
  and `/sitemap.xml`, and HTTP 308 redirects from `/story` and `/contact` to
  their documented homepage anchors.
- `npm audit --omit=dev` reported zero production vulnerabilities.
- `git diff --check` passed.
- The implementation diff introduced no em dash or en dash characters.
- No deployment, hosted preview, release, production connection, or server
  change occurred.

## Repository state after implementation commit

Branch: `main`

Implementation commit: `f945ec7c090a8f6f6c94a7bd6c27bc6dd6ff6c58`

The worktree was clean after the implementation commit. `main` was one commit
ahead of `origin/main` and had not yet been pushed when this record was created.

## Implementation commits

- `f945ec7c090a8f6f6c94a7bd6c27bc6dd6ff6c58` docs: document architecture and production deployment

## Archive commit

`docs: archive architecture and deployment documentation`

## Lessons learned

The repository’s two build paths use the same application source but have
different production commands and outputs. Naming that boundary explicitly
prevents the most consequential operational mistake: using the Vinext start
script for the DigitalOcean Next.js service.

Deployment instructions are safer when every step states the actor, location,
timing, purpose, expected result, failure signal, live effect, and rerun
behavior. Destructive synchronization and rollback commands need context before
the command block, not only a warning after it.

## Follow-up ideas

Plan the Ubuntu migration, SSH hardening review, and any dependency remediation
as separate infrastructure or code changes. None is included in this task.
