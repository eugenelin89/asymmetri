# Prompt 034: Website dependency security patch and isolated deployment

- Date: 2026-10-07
- Scope: deployment
- Goal: Remediate website production advisories and deploy without changing Motion iOS or another hosted application.

## Original user request

> Pasted text contains the user's request.

The supplied request was titled “ASYMMETRI LABS WEBSITE — Security Dependency
Remediation + Production Deployment — Patch npm advisories without touching
Asymmetri Motion iOS.” Its accompanying “SERVER-WIDE SAFETY GATE — PROTECT EVERY
OTHER HOSTED WEBSITE” made preservation of all unrelated applications a hard
acceptance requirement. The safe request and full decision summary are retained
here without private attachment locations or generated attachment names.

The owner requested a fresh exact-lockfile production audit, advisory IDs/ranges,
dependency chains and source reachability; controlled smallest compatible fixes;
Next.js/eslint alignment; deliberate Sharp override handling; compatible
transitive resolution without fake direct dependencies or audit-fix commands;
local Node 24 checks and both Next.js/Vinext builds; scoped security-branch work,
review and safe main integration; production Node 22 checks/build/audit; exact-SHA
activation and protected-route/browser/log verification; a rollback reference;
and a final before/after security and server-wide health report.

The safety gate required read-only inventory of services, ports, active Nginx
hosts/configuration, certificates and resources before production mutation;
bounded health baselines for every discovered public hostname; preservation of
pre-existing failures; resource checks around install/build; only Asymmetri
service activation; and rollback of Asymmetri if it plausibly caused another
site to regress. OS/global Node, DNS, TLS, Nginx, firewall, SSH, service definitions,
other repositories/dependencies and Motion iOS/distribution changes were prohibited.

An explicit follow-up approved resolving the conflict between exact-live-path npm
commands and preservation of live dependencies:

> Use the isolated Asymmetri candidate (recommended)

This authorizes npm/Git/checks/builds as `django-user` in an independent
`/var/tmp/asymmetri-release-*` candidate, followed by activation at the unchanged
`/var/www/asymmetri` path after all gates pass.

## Scope

Website package graph, generated framework type reference, affected documentation,
and the explicitly requested DigitalOcean application release. No application
copy, assets, design, routing, privacy commitments, Motion code or distribution
state changes. Other server applications are inspected only for preservation.

## Decisions

- Follow the request's explicit security-branch/integration workflow as an
  exception to the repository's default direct-main workflow. No worktree or PR.
- Select Next.js/eslint-config-next 16.3.6, the lowest published stable 16.x release
  outside all fresh applicable critical/high ranges; do not take npm's unnecessary
  16.4.0 suggestion. Keep React/React DOM 19.2.6.
- Advance the existing shared Sharp override from 0.35.3 to 0.35.5 for libheif and
  librsvg fixes. Preserve the existing Miniflare override arrangement and test Vinext.
- Refresh only nanoid, source-map-js and baseline-browser-mapping within existing
  parent ranges. Parent upgrades and additional overrides are unnecessary.
- Distinguish installed vulnerable packages from demonstrated application input
  paths. Bound reachability does not justify retaining a critical dependency.
- Preserve actual current hierarchy and redirects: peer Sports/Labs under Asymmetri,
  `/sport` → `/sports`, `/work` → `/labs`, `/story` → `/sports#story`.
- Retain original optional peer lock entries after npm 11 pruning failed an npm
  10.9.8 compatibility check. Normalize and validate with production's npm version.
- Full `npm ci` is the documented build/deployment installation. An extra macOS
  production-only install omitted Sharp binaries under npm 10/11; metadata-only
  edits did not solve it. Record the limitation rather than silently claiming it
  passed or introducing a speculative packaging change. Full installs load Sharp
  0.35.5 successfully and both builds pass.

## Implementation

Five production package entries, comprising eight advisory records, are remediated.
The dependency review documents versions, GHSA/CVE references, affected ranges,
first fixes, production paths, reachability, runtime compatibility and limitations.
The isolated production candidate will use the exact reviewed pushed main commit,
with live build/dependencies retained until validation and activation.

## Engineering impact

No public feature or content change. Next.js regenerates one additional type import
in `next-env.d.ts`. Next/SWC, Sharp/libvips and required lint helper entries follow
the selected releases. No new lifecycle install scripts, registry origins, unrelated
major upgrades or same-version integrity changes. No existing package entries are
removed in the final lockfile. Existing local/production runtime majors stay intact.

## Files changed

Package manifest/lockfile and generated Next.js type reference; README navigation;
architecture, local-development and deployment version/compatibility guidance;
privacy-audit pointer to the current dependency review; and the new security review.
Application source, content, assets and infrastructure definitions are unchanged.

## Documentation updated

The security review owns detailed advisory and validation evidence. Other documents
link to it and update materially stale runtime/framework statements. Historical
prompt records and dated asset-processing versions remain historical evidence.
Sensitive host inventory and raw audit/build data stay in external local evidence.

## Git diff summary

Implementation: 9 files changed, 388 insertions, 188 deletions. Most package churn
is synchronized framework/platform binaries; prose records security and operational
constraints. This journal is excluded from its own diff summary.

## Verification

- Started on clean main at `ada1a338a35211106b17c1dd87e62d0d7771ae89`; fetched and
  fast-forward checked. A second fetch showed no concurrent main change.
- Local Node 24.10.0 matches `.nvmrc`; nvm unavailable. Both npm 11.6.0 and the exact
  production npm 10.9.8 full installation were exercised; final npm 10.9.8 clean
  install passed and loaded Sharp 0.35.5.
- TypeScript and ESLint pass; one non-blocking new lint rule warns on existing
  tutorial hash navigation. Standard Next.js and Vinext builds pass. Existing
  Browserslist age and Vinext route-classification notices remain non-fatal.
- Final local production audit: zero critical, high, moderate or low. Full tool
  graph retains 24 development findings; this is not a zero-all-dependencies claim.
- Local HTTP checks: nine pages, robots/sitemap/favicon, six redirects, 47 assets,
  exact tutorial canonical, Motion schema and protected footer links pass.
- Browser checks include desktop tutorial hash navigation and mobile Privacy/Support
  rendering without overflow. Live post-activation smoke remains a release gate.
- Preflight server clean main/source matches starting SHA. Node 22.23.1/npm 10.9.8,
  loopback/public health and resource headroom verified. Read-only baseline records
  15 public hostnames (30 HTTP/TLS responses), 22 running system services, listener
  ports, active Nginx fingerprint and six public certificate fingerprints.
- Pre-existing failed/retired responses are recorded and will be compared unchanged.
- Diff/whitespace and package-delta review pass. No Motion repository accessed.

Production candidate installation, audit/check/build, activation, final public
smoke and collateral-health comparison occur after this journal is committed and
pushed. They are not claimed complete in this pre-deployment record. The external
release receipt and final task report record actual source/build identity and
results; no unnecessary post-release source edit changes the reviewed deployed SHA.

## Repository state after implementation commit

Clean security branch `fix/website-security-dependencies`, one implementation commit
ahead of unchanged origin/main before this journal. Both commits will be integrated
with a fast-forward to main and pushed without force before production preparation.

## Implementation commits

- `4935285b276c51d819a60218dc91a5dc54368aa5` — `fix: patch website production dependencies`

## Archive commit

`docs: archive website security remediation request`

## Lessons learned

Check the server's npm as well as Node compatibility: npm major differences can
change optional peer resolution. Audit filtering and production-only installation
are separate concerns. Preserve a running release with independent dependencies
when framework/native packages change. Whole-server before/after evidence is a
release acceptance gate, not permission for unrelated repairs.

## Follow-up ideas

Separately investigate development-tool advisories and production-only optional
Sharp installation behavior; neither widens this production deployment.
