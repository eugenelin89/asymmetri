# Website dependency security review — October 7, 2026

This review concerns only the website repository and its DigitalOcean Next.js
application. Motion iOS source, release branches, version/build and App Store or
TestFlight state are outside this change. Public content, assets, hierarchy,
protected routes and infrastructure remain unchanged.

## Baseline and advisory evidence

Starting source: `ada1a338a35211106b17c1dd87e62d0d7771ae89`. A clean local
`npm ci` and fresh `npm audit --omit=dev --json`, independently confirmed against
the live production checkout, reported five vulnerable package entries:
**one critical, three high, one moderate, zero low**. These aggregate package
counts cover eight underlying advisory records, not five distinct advisories.
Full audit JSON and infrastructure evidence are retained outside tracked source.

All five packages occur in the production dependency graph, including Sharp as a
Next.js optional runtime dependency. The source reachability assessment below is
bounded evidence, not proof that every possible exploit path is absent.

| Package / old version | Severity and advisory | Vulnerable range / first fixed release | Production path and reachability |
| --- | --- | --- | --- |
| next 16.2.12 | Critical [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36), CVE-2026-75604 | 16.x before 16.3.3 / 16.3.3 | Direct dependency. Windows-specific conditions do not match the Ubuntu host. |
| next 16.2.12 | Critical [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) | 16.x before 16.3.3 / 16.3.3 | Direct dependency. Image optimizer is reachable, but approved local images contain no AVIF/HEIF; no upload handler or remote-image allowlist was found. |
| next 16.2.12 | Critical [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j), CVE-2026-94545 | >=16.2.0 <16.3.6 / 16.3.6 | Direct dependency. No `next/og`, `ImageResponse`, server actions or application route handlers accepting attacker-controlled SVG were found. Social artwork is static. |
| sharp 0.35.3 | High [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | <0.35.4 / 0.35.4 | next → sharp; also development Miniflare. libheif image-decoding issue; no untrusted upload or AVIF/HEIF input found. |
| sharp 0.35.3 | High [GHSA-wq5f-xc86-pv6w](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w), upstream CVE-2026-96889 | <0.35.5 / 0.35.5 | next → sharp. Ubuntu is relevant to the librsvg advisory, but no visitor-controlled SVG rendering path or `dangerouslyAllowSVG` configuration was found. |
| nanoid 3.3.16 | High [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8), CVE-2026-67213 | <3.3.18 on installed 3.x line / 3.3.18 | next → overridden postcss 8.5.25 → nanoid. No application call accepting a visitor-controlled custom-generator size was found. |
| source-map-js 1.2.1 | High [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), CVE-2026-93749 | >=1.0.0 <1.2.2 / 1.2.2 | next → overridden postcss 8.5.25 → source-map-js. Build/source-map processing; no visitor-supplied indexed source-map input found. |
| baseline-browser-mapping 2.10.19 | Moderate [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv), CVE-2026-45819 | >=2.0.0 <2.11.0 / 2.11.0 | next → baseline-browser-mapping; also development Browserslist. No application visitor-input call site found. |

The selected Next.js release fixes all three reported Next.js advisories.
Absence of an identified exploit input was not used to retain vulnerable versions.

## Controlled changes

| Dependency | Before → after | Kind / reason |
| --- | --- | --- |
| next | 16.2.12 → 16.3.6 | Direct; smallest published stable 16.x release outside all reported critical/high ranges. npm's suggested 16.4.0 is unnecessary. |
| eslint-config-next | 16.2.12 → 16.3.6 | Development; align framework lint rules. |
| sharp | 0.35.3 → 0.35.5 | Existing override; fixes libheif and librsvg advisories. |
| nanoid | 3.3.16 → 3.3.20 | Transitive lockfile refresh within PostCSS's existing `^3.3.16`. |
| source-map-js | 1.2.1 → 1.2.2 | Transitive lockfile refresh within PostCSS's existing `^1.2.1`. |
| baseline-browser-mapping | 2.10.19 → 2.11.27 | Transitive lockfile refresh within Next.js's `^2.9.19` and Browserslist's `^2.10.12`. |

The Sharp override originated in the initial website/Vinext integration, replacing
Next.js/Miniflare's 0.34.x selection with one 0.35.x installation. That original
journal records a clean audit but no more detailed Sharp rationale. Retain the
shared version control and advance it by patch releases. Next.js 16.3.6 itself
accepts Sharp `^0.35.4`; Miniflare retains its existing override arrangement,
verified by the Vinext build. Do not claim upstream Miniflare's unmodified range
includes Sharp 0.35.x.

The three transitive fixes need neither parent changes nor new overrides: normal
resolution already permits fixed releases. They were refreshed selectively with
`npm update ... --package-lock-only`, not added as top-level dependencies.
React, React DOM and react-server-dom-webpack stay 19.2.6; PostCSS stays 8.5.25;
Vinext stays 0.0.50; Vite stays 8.0.13. No audit-fix command was used.

Required supporting changes include matching Next/SWC packages, @swc/helpers
0.5.23, Sharp binary packages 0.35.5 and libvips packages 1.3.4, and two nested
lint utility entries. The three existing optional-peer lock entries are retained: npm 11 pruned them,
but an explicit npm 10.9.8 compatibility check required them. No new
install lifecycle scripts or registry origins were introduced. New tarball
integrities belong to the changed releases; unchanged package integrities remain
unchanged. Next.js generates an additional `root-params.d.ts` reference in
`next-env.d.ts`; no handwritten application code changes.

## Runtime and verification

Local validation uses Node 24.10.0 / npm 11.6.0, matching `.nvmrc`'s major 24.
nvm is not installed on this Mac. Next.js 16.3.6 and Sharp 0.35.5 both declare
Node >=20.9.0; existing React versions satisfy the framework peer ranges.
Production Node 22.23.1 / npm 10.9.8 remains unchanged.

The required full clean install, TypeScript/ESLint check, standard Next.js build,
Vinext build, production audit and whitespace check pass locally. The final
production dependency audit reports **zero critical, high, moderate and low**.
This does not mean the development-tool graph has zero advisories: the full
install reports 24 development findings (19 high, four moderate, one low).
Those are outside the production dependency remediation acceptance scope.

An extra `npm ci --omit=dev` experiment on macOS with npm 10/11 omitted
Sharp's native optional binaries. Changing lockfile classification alone did not
resolve it, so the final lockfile retains npm-generated metadata. The documented
full `npm ci` installation includes working Sharp 0.35.5 binaries and remains
the supported build/deployment path. Do not substitute a production-only install
without separately resolving and testing that optional-dependency behavior.
`npm audit --omit=dev` is an audit filter, not an instruction to prune build
dependencies.

The aligned lint plugin adds one non-blocking warning for existing tutorial
`window.location.assign()` hash navigation. Browser verification retains this
behavior; changing it is unnecessary for the security fix. Existing Browserslist
age and Vinext static-classification notices remain non-fatal.

HTTP verification covers all nine pages, robots/sitemap/favicon, six redirects,
47 referenced local assets, footer continuity, exact tutorial canonical and
Motion SoftwareApplication metadata. `/story` intentionally redirects to
`/sports#story`, reflecting current architecture rather than the older example
in the request. Tutorial hashes and original-image paths are unchanged.

## Deployment boundary

The owner approved using an independent Asymmetri candidate under
`/var/tmp/asymmetri-release-*` to reconcile the live-path npm instruction with
preservation of the serving dependency tree. Follow the complete isolated
candidate procedure in [Deployment](DEPLOYMENT.md), with npm/Git/checks/builds as
`django-user`, 1536 MiB build heap, and activation at `/var/www/asymmetri` only
after successful checks. Never run npm ci against the currently serving tree.

Before mutation and after activation compare all discovered public virtual-host
HTTP/HTTPS responses, redirects/TLS, Nginx configuration fingerprint, certificate
references, listening ports and unrelated service/process identities. Preserve
pre-existing unhealthy/retired responses; do not repair other sites. Keep exact
host details, source/build IDs, candidate/rollback paths and post-activation
results in the external deployment receipt, not public infrastructure inventory.
No OS, global Node, DNS, Nginx, TLS, firewall, service-definition or unrelated
application changes are authorized. Only the Asymmetri service may be stopped
and started for activation. A plausibly caused unrelated regression fails the
release and triggers Asymmetri-only rollback.
