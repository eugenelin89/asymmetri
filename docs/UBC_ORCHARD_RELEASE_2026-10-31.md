# UBC V0.2 — Orchard Commons production receipt

**Live:** https://asymmetri.co/labs/ubc, also verified on `www`.
Activated October 31, 2026 at **08:16:08 UTC** (01:16 PDT).

- Runtime source: `32f72951135c45b6cfb44281cda9dc1e029d15a2`.
- Implementation commits: `3ef1758` and `ea3527e`; journals `5abdd81` and `32f7295`.
- Linux build: `uSdetjZWMH8Rh69FKnc5J`; Node `v22.23.1`.
- Successful [Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41183153020), artifact `13035339972`.
- Runtime tar SHA-256: `5962b6fc9161610994ba9988862a66065b6562285d36271df570c0b6eaec89cb`.
- Complete immediate rollback: `/var/www/asymmetri-rollback-before-ubc-orchard-v02-20261031`.
- Rollback source: `fcd2b900b512652a94af07571b841e823c61d2de`, build `VaAKfIoEAK5LbGri4K8V8`.

The [implementation report](UBC_ORCHARD_MVR_2026-10-31.md) documents the eight rooms,
five bathrooms, sixteen doors, stairs/lift, common spaces, fictional students,
geography, sources, rights and remaining fidelity limits. This is one representative
demonstration floor, not a surveyed reconstruction or the whole residence.
The [22-capture gallery](validation/ubc-orchard/README.md) includes four actual
production captures. No AI marketing imagery substitutes for application evidence.

## Verification

Local checks passed: TypeScript, lint (one existing tutorial navigation warning),
Next webpack and Vinext builds, zero production dependency vulnerabilities, source
reproduction and privacy/diff scans. Automated results: UBC 26, Vancouver 74,
Surrey 54, Richmond 27, investment 7 and Python GIS 5, **193 total**.
The exact-source Linux workflow passed check, Vancouver tests, audit and Next
build, including the Surrey, Richmond and UBC prebuild gates. No workflow credential
scope was expanded; the existing workflow runs the package prebuild hook.

Local browser acceptance covered all eight bedrooms, both double configurations,
connected bathroom traversal, all three students, official links, stairs/lift,
normal exit, all camera modes and environmental controls. Automated movement tests
also traverse every bathroom connection. Desktop, tablet and phone viewport checks
passed; physical iOS/Android and sustained performance testing remain outstanding.

Private Linux candidate checks passed 17 routes, eight protected-host checks,
24 tutorial images, 124 retained tutorial IDs, native image optimization, all 688
Richmond outputs, published city snapshots and all six UBC public assets. Protected
visible content matched the previous runtime. Public apex and `www` each passed
17-route/24-image comparisons, plus 64 geographic, copy and redirect checks.

The live browser followed GIS Apps → UBC → Start → Orchard directory → outside
entrance, walked through the lobby and stairs, opened and entered Room H and its
bathroom, returned to the corridor, spoke with Maya and followed the bathroom
question at 390 × 844 CSS pixels without horizontal overflow. It called and boarded
the upper lift, rode continuously to the lobby, exited through the courtyard, and
switched Aerial/Map. The final tile finish is visible in capture 19. The temporary
viewport override was reset. No UBC console errors or warnings were observed.

Existing-app browser smoke checks also passed on the deployed origin: Vancouver
entered Drive, moved 0.01 km and braked; Surrey started and ordinary walking reduced
the destination distance from 90 m to 82 m; Richmond started, entered its car,
accelerated and braked, including its existing bump response. No page console errors
were recorded. These bounded checks supplement the regression suites and asset
comparisons; they do not claim repetition of every city storyline.

## Safeguards and recovery

The original 192 MiB available-memory and 6 GiB free-disk floors stayed unchanged.
An initial private smoke run completed its content checks but was stopped by the
memory guard at 183,256 KiB available, before activation. Production was untouched.
Its evidence is retained. The temporary candidate heap was bounded to 80 MiB,
image optimization was included inside the guarded smoke process, and the whole
suite was repeated successfully: minimum **231,876 KiB available memory** and
**8,317,792,256 free bytes**. An intervening socket preflight hit the previous
connection's TIME_WAIT state; the bind check now uses address reuse while still
rejecting a listening service. No guard, port isolation or peer check was bypassed.

Activation used the independent Linux checkout and a complete-directory swap,
with automatic restoration on failure. The activation monitor recorded a minimum
377,228 KiB available memory and 8,317,788,160 free bytes, with no errors. Only
Asymmetri restarted. All 55 configuration hashes, 13 peer virtual hosts, peer service
identities and the Node binary remained unchanged. Health after browser validation at 08:24:40 UTC confirmed
active/running/enabled service, zero automatic restarts, zero post-activation errors,
395,452 KiB available memory and 8,317,480,960 free bytes. The old shutdown exit 143
is the expected controlled stop.

The full previous source, `.next` and `node_modules` remain in the rollback directory;
older recovery material remains intact. To restore, stop only Asymmetri, retain the
current tree under a new failed-release path, rename the complete predecessor to
`/var/www/asymmetri`, restart Asymmetri and repeat protected-route/peer/capacity checks.
Do not replace only `.next` or delete earlier runtimes. Server receipts remain in
`/var/lib/asymmetri-ubc-orchard-v02-release-20261031`; artifact and receipts are also
retained privately outside Git on the deployment Mac.

No OS, DNS, TLS, database, peer-service or dependency change was made. Later
documentation commits do not change the running source/build identity. Local
development validation is complete and its server is stopped; production is live.
