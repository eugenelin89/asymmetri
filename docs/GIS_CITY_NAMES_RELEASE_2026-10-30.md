# GIS city naming production release

The owner’s naming corrections are live:

- **Vancouver, City in Progress** on the GIS Apps cards and model-limit headings.
- **Surrey, City of Adventure** on the GIS Apps cards, Surrey page and metadata,
  footer and game accessibility labels.

The [GIS Apps hub](https://asymmetri.co/labs/gis),
[Vancouver](https://asymmetri.co/labs/vancouver) and
[Surrey](https://asymmetri.co/labs/surrey) retain their original URLs. Labs menu and
overview continue to lead to GIS Apps. This is a display-copy release; routes,
versioned city data, public assets, saved games and gameplay are unchanged.

## Authorization and coordination

The owner’s explicit deployment and link-verification request continues through
these naming corrections. Greater Vancouver GTA’s Vancouver, Surrey and Richmond
work remained isolated while this chat owned production activation. Follow-up
city releases must preserve these names and serialize shared-file pushes and
server operations. No city-feature update was included in this naming release.

## Exact deployed identity

- Implementation: `759cbf3`; engineering journal: `69fae18`.
- Deployed source: `69fae182033de1cb6928f4b4b0b35ef9e20a2f78`.
- Build: `q8_M2Gb7kqFINS-9chdOm` on existing Node `v22.23.1`.
- [Successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41113565527), artifact `13004218754`.
- ZIP SHA-256: `3cd1182e2edbbb1ef642b464d9c54ca08cde0ff70ca3ec822a2e091a3714964b`.
- Runtime tar SHA-256: `682b397b8976df427704b1c166b8e61f43ffad586659347a27f4b522b49ff8d1`.
- Verified `.next` transfer SHA-256: `695d44aa3bb80f61ba348f73765ad508adf735eb39f189ec787bc9f0a43944f8`.
- Activation completed October 30, 2026 at **19:20:06 UTC / 12:20:06 PDT**.
  The service started at 19:19:58 UTC.

The exact-source workflow passed type/lint checks, Vancouver tests, all 29 Surrey
build-prerequisite tests, production dependency audit and standard Next webpack
build. Local Node 24 checks, both build formats and audit passed as well. Existing
tutorial lint and Vinext chunk/classification warnings were unchanged.

## Copy-only activation and recovery

Package, lockfile, runtime configuration, route/component files and public assets
were verified identical to the preceding release. The source was extracted into
`/var/tmp/asymmetri-city-names-20261030` as `django-user`, with the unchanged live
dependencies hard-linked for private staging; no install or compile touched those
links. Only the verified Linux `.next` build was transferred. The candidate passed
private loopback checks before the clean live main branch fast-forwarded.

Only `asymmetri.service` was stopped for the application-owned build swap. The
preceding source `313dba357ecc00f1de28b8db5d2c326ec9d1125e` and build
`Zaa4FN3iARR31Yquw4Cij` identify the rollback. Its `.next` remains at
`/var/tmp/asymmetri-city-names-20261030/previous.next`.

For this copy-only release, stop the website service, preserve the replacement
build, restore that previous `.next` as `django-user`, and start the same service.
Verify prior build ID and served content; retain the advanced source instead of
resetting it. No dependency/public-file recovery is needed because they did not
change. The earlier complete pre-V0.4 runtime remains untouched at
`/var/www/asymmetri-rollback-before-v04-20261030`. A future route, asset or dependency
release must use the complete-runtime procedure and retain an appropriate complete
rollback; do not apply this copy-only exception to it.

## Verification

- Guarded preparation, transfer and private smoke checks passed. Minimum observed
  available memory was **270576 KiB** and free disk **6932090880 bytes**, above
  the 192 MiB and 6 GiB floors. Activation checks also remained above both floors.
- Private acceptance covered 14 general routes plus Vancouver, protected content
  and canonicals, tutorial originals, city data and Motion access redirects.
- Public verification on apex and www: **16 HTTP-200 page checks, 68 asset/hash
  checks and four HTTP-308 legacy redirects**. Every retained geographic snapshot
  and tutorial original is byte-identical. Emitted GIS/city JavaScript URLs load.
- All checked page main text and IDs match the pre-release baseline after only
  the explicitly requested name/action substitutions. Protected Motion text and
  IDs are unchanged. Tutorial retains its exact www canonical and legacy IDs;
  the city canonicals, sitemap and links retain their original addresses.
- Live browser navigation confirmed GIS Apps → Surrey and GIS Apps → Vancouver
  at the existing URLs, Surrey’s updated document/H1/accessibility names, the
  new GIS headings, and Labs overview/menu grouping. No console errors appeared.
- Local 320/768/1440 CSS-pixel checks found no horizontal overflow or clipped
  city headings; keyboard focus remains visible. No new gameplay acceptance
  campaign is claimed for this display-copy change.
- Final production inspection at 19:21:08 UTC: clean main, expected source/build,
  service active/running, zero restarts and zero service error entries. Five peer
  service identities, 13 unrelated virtual-host responses, 55 configuration
  fingerprints and the Node executable remained unchanged.
- Final measured available memory: **409776 KiB**; free disk: **6932000768 bytes**.

Sanitized baseline, artifact, guards, smoke, activation and public comparison
receipts are retained outside Git in `deployment-retention/2026-10-30/city-names/`
and `/var/lib/asymmetri-city-names-release-20261030`. The release-receipt/journal
commits are documentation only and do not change the activated source/build.
