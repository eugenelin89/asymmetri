# UBC V0.3 — campus life production receipt

**Live:** https://asymmetri.co/labs/ubc, also verified on `www`.
Corrected activation: **October 31, 2026 at 10:36:03 UTC (03:36 PDT)**.

- Runtime source: `cdc2ba3d8e86566633119658151108689dc21cae`.
- Implementation: `6e7ce98` (campus life), `be4090d` (profile route correction).
- Journals: `673a13a` and `cdc2ba3`.
- Linux build: `gRKOgO5gYIKwm9Z0g4amq`; Node `v22.23.1`.
- Successful [Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41192872577), artifact `13039816864`.
- Runtime tar SHA-256: `6d428fd51f0fa020bd1e598fc9037cc9b11f4c62797cb195c157a71000646502`.
- Artifact ZIP SHA-256: `28bb635812e5b98bcf335cda5447a6e18304dcf3c8a0655d715577abc05ba24f`.
- Complete immediate rollback: `/var/www/asymmetri-rollback-before-ubc-v031-profile-routing-20261031`.
- Rollback source: `32f72951135c45b6cfb44281cda9dc1e029d15a2`, build `uSdetjZWMH8Rh69FKnc5J`.

The [implementation report](UBC_CAMPUS_LIFE_V03.md) covers architecture, geographic
coverage, seven Level B interiors, source/asset licensing, partial faculty/roster
coverage, conversations, transit, public profiles and five next priorities. This is
a functional **research preview**, not the completed photorealistic master plan.
The [22-capture gallery](validation/ubc-navigation/README.md) contains actual local
and public browser evidence. No generated marketing images substitute for the app.

## Validation

All **199 automated tests** passed: UBC 44, Vancouver 74, Surrey 54 and Richmond 27.
TypeScript/ESLint passed with one existing tutorial navigation warning; Vinext and
Next webpack builds passed; the production audit returned zero vulnerabilities.
The exact-source Linux workflow independently passed its check, Vancouver tests,
audit and Next build with Surrey/Richmond/UBC prebuild gates. No dependency changed.

Local production HTTP tests passed create, public visibility, ownership, CSRF,
edit, recovery, reporting and deletion. The disposable profile was removed. No
private recovery code, ownership cookie or store content is in Git/screenshots.
Local browser validation covered the seven interiors, conversations, camera/input,
map/GPS and avatar flows. Desktop, tablet and phone viewports passed; real-device
and sustained performance testing remain outstanding. Gym Auto observation was
37 FPS, 2,544 draw calls and 2,491,208 triangles; no target-FPS achievement is claimed.

The private Linux candidate passed 17 routes, eight protected-host checks, 24
tutorial images, 124 retained tutorial IDs, all 688 Richmond outputs, published
city/UBC data, six UBC assets, public profile projection and native image optimization.
Protected main content matched the previous runtime. Both public hostnames then
passed 17-route/24-image comparisons plus 64 asset, copy and redirect checks.

Public profile checks confirmed no-store headers, safe public projection,
Christopher Lin's requested self-profile, anonymous isolation, origin rejection,
unauthorized edit rejection using a valid body, owner recovery POST and owner GET,
and Secure/HttpOnly/SameSite=Strict cookies scoped to the UBC endpoint family.
Malformed bodies returned 400. Repeated invalid creation checks then reached the
intentional shared per-IP limit and returned 429; this limit was not bypassed.
An initial test incorrectly expected 401 for an empty edit body, which validates
before ownership. Correcting the test to send a valid draft established the 401
boundary without publishing a test profile on production.

The final live browser rendered the campus, switched third person, ran and turned,
loaded the enabled public profile form, marked an outdoor map point and generated
a 132 m walking guide. Walking away increased the remaining distance to 134 m.
Go here moved the visitor onto the selected safe outdoor path near the stadium.
Zero console errors/warnings were observed. Captures 20–22 document this corrected
public release. The browser tab is left on the campus; temporary viewport overrides
were reset. Local validation servers are stopped; production remains running.

## Initial public-route failure and correction

The first V0.3 activation at 10:16:47 UTC used source `673a13a` and build
`1Xvs8fB3LRsrAvxoiRthw`. Public checks found the existing raw ingress rejects unknown
`/api/` families, despite successful private candidate responses. It was restored
to the complete V0.2 runtime at 10:21:53 UTC. Persistent profile data was preserved.

The corrected release moves the four handlers to `/labs/ubc/community-api/`, through
ordinary website ingress, and updates clients and cookie scope. It does not change
raw ingress, Nginx's reserved API policy, investment/Ask authority, DNS or TLS.
The rejected source/build and compressed artifact remain retained. Only that
rejected release's generated `node_modules` was removed after V0.2 restoration and
an inactive-directory check, to stage a new independent candidate within the
unchanged disk guard. All complete earlier rollback runtimes remain intact.

## Safeguards and storage

The 192 MiB available-memory and 6 GiB free-disk floors stayed unchanged. Corrected
private smoke minimum: **272,036 KiB available memory** and
**6,876,172,288 free bytes**. Activation monitor minimum:
393,228 KiB and 6,876,164,096 free bytes, with no errors.

Only the Asymmetri website restarted. All **56 configuration hashes**, **13 peer
virtual hosts**, peer service identities and Node binary remained unchanged from
the corrected preflight. The pre-existing 55 configuration files were untouched;
one new UBC-only systemd environment drop-in had been provisioned for persistent
profile storage. No separate network listener or database service was introduced.

Final health at **10:38:42 UTC** confirmed active/running/enabled service, zero
automatic restarts, zero post-activation errors, 387,192 KiB
available memory and 6,875,910,144 free bytes. The old shutdown exit 143
is the expected controlled stop. The immediate rollback retains source, `.next`
and executable dependencies, and older recovery material remains intact.

Profile storage is `/var/lib/asymmetri-ubc-community`, directory 0700 and JSON 0600,
owned by the application user and outside every release tree. The requested
Christopher Lin Engineering Physics profile uses only the user's supplied facts;
its recovery capability is retained privately outside Git. Follow
[community operations](UBC_COMMUNITY_OPERATIONS.md) for report review, hiding,
restoration and owner removal. Immediate publishing requires ongoing moderation.

Server receipts: `/var/lib/asymmetri-ubc-v031-profile-routing-release-20261031`.
Exact artifacts and receipts are also retained privately on the deployment Mac.
Restore by stopping only Asymmetri, retaining the current tree under a new failure
path, moving the complete predecessor to `/var/www/asymmetri`, restarting, then
repeating protected-route/peer/capacity checks. Preserve the community store.

Later documentation commits do not change the runtime source/build identity above.
