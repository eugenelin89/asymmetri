# Labs menu production release — October 30, 2026

The global Labs submenu now contains **Asymmetri Labs**, **BotSquad** and
**GIS Apps**. BotSquad Research, BotSquad Trade and Ask BotSquad are reached
within [BotSquad](https://asymmetri.co/botsquad), whose directory, breadcrumbs
and Overview/Research/Trade/Ask navigation remain intact. No page or URL moved.
Trade remains within Research; Ask remains a sibling of Research.

## Scope and release ownership

This completes the owner’s submenu correction under the ongoing explicit website
deployment and link-verification request. The runtime change removes exactly
three shared navigation references. Documentation distinguishes the global project
entry from the retained BotSquad area links. City names, GIS grouping, games,
assets, dependencies, receiver behavior and Ask availability are unchanged.

Greater Vancouver GTA’s Vancouver, Surrey and Richmond chats held shared-file
pushes and production mutations while this chat owned the menu release. City work
continued independently. Journals 132/133 were reserved for this change.

## Activated identity

- Implementation: `eff2c72`; implementation journal: `17a24b4`.
- Source: `17a24b4bc2568a40973de2fd2a8fdd497d7a9ea2`.
- Build: `Njs40iFKI-ZTrJ7cLD-h9`; unchanged Node `v22.23.1`.
- [Successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41116705197), artifact `13006352318`.
- ZIP SHA-256: `6f04c5622ef9675913e3bf03fc61fa21d8ec4d4e1d7c3f29da4b450b24555e74`.
- Runtime archive SHA-256: `f048e33f0071245bf48f9ff0f19fc07b12e7e64b159501ad7767c7b2af3a2517`.
- Verified build-transfer SHA-256: `3e0fd9e08a42088688696afa382963ce73df6e4e5d6d90aa05fed89c833f47e5`.
- Activation: **19:42:02 UTC / 12:42:02 PDT**. Service started at 19:41:56 UTC.

## Checks and continuity

Local Node 24 type/lint checks, Next webpack build, Vinext build, all 29 Surrey
prerequisite tests and production dependency audit passed. The exact-source Linux
workflow additionally passed Vancouver tests. Audit reports zero vulnerabilities;
existing tutorial lint, Browserslist-age and Vinext warnings remain unchanged.

Private staging verified the simplified header and retained BotSquad links before
activation. Public apex/www verification then passed:

- **24 HTTP-200 page checks**, including the four BotSquad areas, Labs/GIS/cities
  and all four protected Motion pages. Global header area shortcuts are absent;
  BotSquad’s internal navigation retains all four destinations.
- **68 unchanged asset/hash checks** for tutorial originals and all retained city
  geographic snapshots. Emitted city/GIS script URLs return HTTP 200.
- **Six HTTP-308 redirects**, including a legacy Investment run path with its
  same suffix and query preserved under Trade, plus Work/Sport on both hosts.
- Every checked page’s main text and IDs match the pre-release baseline. Canonicals,
  sitemap and protected context/footer links are preserved. Ask’s pre-existing
  inherited apex canonical is unchanged; this release does not revise metadata.
- Browser navigation followed Labs → BotSquad → Research → Trade → Ask at the
  original URLs, with no console errors. Local 320/768/1440 CSS-pixel checks found
  no page/menu overflow; Enter/Escape and restored visible focus work.

Guarded source preparation, build transfer and smoke checks maintained the 192 MiB
available-memory and 6 GiB free-disk floors. Guarded minima were 278292 KiB and
6885654528 bytes; activation also stayed above the floors. Final inspection at
19:42:42 UTC recorded 404148 KiB available memory and 6885584896 bytes free disk,
clean main, the expected build, active/running service and zero restarts/errors.
Five peer service identities, 13 unrelated virtual-host responses, 55 configuration
fingerprints and the Node executable remained unchanged.

## Recovery and retained evidence

The documented copy-only path applies because package/lockfile, runtime
configuration, route/component files and public assets are identical. Only the
verified Linux `.next` build was transferred to the application-owned staging
source. Unchanged installed dependencies were hard-linked for staging; no install
or compilation touched live or linked dependencies. Source advanced by fast-forward.

The immediately preceding naming release is source
`69fae182033de1cb6928f4b4b0b35ef9e20a2f78`, build `q8_M2Gb7kqFINS-9chdOm`.
Its build remains at `/var/tmp/asymmetri-labs-menu-20261030/previous.next`.
To recover this copy-only release, stop only the website service, preserve the
replacement build, restore that previous `.next` as `django-user`, and start the
same service. Verify the prior build/content; preserve advanced source rather than
resetting it. Earlier build/full-runtime rollback copies remain untouched.
Future route, dependency or asset changes require complete-runtime recovery.

Sanitized evidence lives outside Git at `deployment-retention/2026-10-30/labs-menu/`
and `/var/lib/asymmetri-labs-menu-release-20261030`. Subsequent receipt/journal
commits are documentation only and do not change the activated source/build.
