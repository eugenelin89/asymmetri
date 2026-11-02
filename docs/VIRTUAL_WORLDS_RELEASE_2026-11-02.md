# Virtual Worlds release — November 2, 2026

The shared website category is now **Virtual Worlds**. The Labs submenu,
category page, footer, Labs card and campus breadcrumbs/return controls use the
same name. `/labs/gis` and existing campus/city URLs remain unchanged.

## Deployed identity

- Source: `a73eec24f2c81f5fe514c4ff2872a7d46bc12cf4`.
- Next build: `dmqK2Psv92J2yUeGDoMK2`.
- Activation completed: November 2, 2026, 18:28:50 UTC (10:28:50 Vancouver).
- Exact-source Linux workflow: [41497717835](https://github.com/eugenelin89/asymmetri/actions/runs/41497717835), job `125456912329`.
- Artifact: `13167701793`, Node `22.23.1`.
- Artifact ZIP SHA-256: `577e12d68c354cd2171902f789197f187da0c38373bfba52eadaec4c8ad7ad52`.
- Runtime tar SHA-256: `0aa0fe813f817a10d684f990ecdf4fddc6ed49dd25cbe9e0b101d7f6f4b5c0c3`.
- Activation receipt SHA-256: `d68c5e14c8dbb3bd2a4abf0dd9d534730e551e79faaf280aabe18fed18db9091`.

## Scope and verification

The rename was implemented in `4279704`, with CWRU and Stanford changes made by
their respective owners. The complete release also includes the previously
committed UBC benchmark foundation and bounded Orchard interaction optimization:
out-of-range actions skip unnecessary line-of-sight work. Benchmark diagnostics
remain opt-in and are not enabled by normal campus entry. This release does not
complete the flagship V0.5 milestone or establish new performance targets.

Independent review matched all 63 changed paths and 16 non-documentation paths
against Git. No routes, public assets, dependency versions, lockfile or service
configuration changed. The package scripts add only manual benchmark commands.

- Exact-source Linux CI passed **622 tests**, TypeScript/lint, the production
  dependency audit with **zero vulnerabilities**, and the Next production build.
- Local checks covered desktop, tablet and mobile layouts, keyboard focus and
  menu navigation, UBC breadcrumb/return/About labels, and console errors.
- Staged smoke passed all 18 page comparisons, allowing only the reviewed copy
  changes while retaining links, IDs and canonicals. Protected assets, all three
  profile projections, review/analytics readiness and image optimization passed.
- A fresh public browser reload confirmed the new title, heading, breadcrumb,
  expanded Labs submenu and footer. Actual desktop (1280 px) and mobile (390 px)
  screenshots were captured. The mobile menu and page fit the viewport.
- No synthetic production play, review or public profile was submitted. This
  copy release does not claim a fresh physical-phone gameplay or audio test.

## Recovery and capacity

The complete immediate rollback is
`/var/www/asymmetri-rollback-before-virtual-worlds-20261102`, source
`38d432685765161347cff7b74c2f3dddd14af378`, build `4JfgZCh6OpnpuPeTAjb1A`.
The preceding `33e4b65` runtime remains complete at
`/var/www/asymmetri-rollback-before-ubc-audio-startup-20261031`.
All 12 existing owner-held historical archives retain verified custody.

Before staging, the separate, explicitly authorized November 2 disk-cleanup
task retired five obsolete runtimes and disposable caches. It retained the live
and immediate rollback runtimes, persistent stores, configuration and existing
archives. That cleanup created no new archives; this release does not claim
those five retired runtimes remain complete. Its receipt is pinned in the private
release packet. No additional cleanup was performed by this deployment.

The release used an independent application-owner checkout, the verified Linux
artifact, loopback smoke and guarded activation. The 6 GiB disk and 192 MiB
available-memory floors were retained. Minimum staged-smoke available memory was
274,196 KiB; minimum activation free disk was 11,641,737,216 bytes.

Final health passed at 18:31:22 UTC: all 18 pages, 800 published assets and 40
static bundles passed on loopback, apex and www. All 15 peer hosts retained their
baseline responses. The 62 configuration files, three campus profile stores,
private review/analytics stores, 12 historical archives and retained complete
runtimes passed preservation checks. The prune run succeeded and its timer
remained enabled and active. No new application warnings or errors were found.
Final-health minimum available memory was 305,640 KiB and free disk was
11,639,873,536 bytes. No production test reviews or synthetic play sessions were
created.

Final-health receipt SHA-256:
`685c57286d0a6a63d7975f64012059a8d7751134d926236479c5c8a35404fa89`.
The private release packet and actual browser screenshots are retained outside
the repository. Documentation-only closeout commits do not change the deployed
source or build.
