# Vancouver V0.1 — Experimental release

Public experience: https://asymmetri.co/labs/vancouver

The owner explicitly approved implementation, main push and immediate public
release, then authorized autonomous overnight completion. The Labs submenu uses
**Vancouver in Progress**; the project title and URL remain Vancouver.

## Delivered experience

- Eastern False Creek aerial orbit, pan and zoom; reset and fullscreen controls.
- Third-person arcade driving with keyboard and on-screen controls, braking,
  reverse, street constraints and simple building/water avoidance.
- Six selectable, searchable places with original summaries and linked sources:
  Science World, Olympic Village, Creekside Community Centre, Hinge Park,
  Habitat Island and Cambie Bridge.
- Responsive layout, pause/resume with renderer disposal, WebGL error handling
  and server-rendered no-JavaScript place descriptions.
- Route-isolated Three.js/WebGL2. No new backend, accounts or visitor tracking.

The bounded City snapshot contains 436 building footprints, 296 street lines and
18 park polygon parts, with land/water geometry. It is 184,020 bytes uncompressed.
The source manifest records requests, raw hashes and the derived-data digest.

## Source and runtime identity

The first public activation completed at 08:24:45 UTC on October 30, 2026
(01:24 PDT), from `a27af820d842d05aee1fcd7d1fe21d9c89bd1d69`, build
`vX6ln8E9nzEy5RzvDLV6n`. Subsequent submenu wording was prepared without activating
the superseded Drive Vancouver or City in Progress candidates.

The final submenu update activated at **08:49:57 UTC (01:49 PDT)**:

- Source: `e909c8da9121f9f9179dfb3d71d78e0621805a85`.
- Next build ID: `At28nruWgLtaH0vOlV-pM`.
- [Successful Linux build](https://github.com/eugenelin89/asymmetri/actions/runs/41028369889), artifact `12965225164`.
- Runtime tar SHA-256: `e98bee38386a65a7aaf31a2e94dd6afeb358bf8f3370e4cc36bfa8c63849bde6`.
- Runtime tar size: 253,977,149 bytes.

Later release-documentation commits do not change this compiled production
identity. Implementation and prompt journals were pushed normally to main.

The source was built on isolated Ubuntu x86_64 with Node 22.23.1 and npm 11.6.0.
CI uses pinned actions and read-only repository permissions; it has no production
secrets or automatic deployment. Source, artifact digests, Linux runtime and
build IDs were checked before the app-owned candidate was used. No Mac native
dependencies were transferred into production.

## Validation

Local TypeScript/ESLint, standard Next and Vinext builds passed. Six Vancouver
geometry/driving/provenance tests and seven existing investment tests passed.
The exact release source also passed CI checks, Vancouver tests, production audit
and a Next webpack build. Production dependencies have zero reported audit
vulnerabilities; this does not claim a clean development-only dependency audit.
The existing tutorial navigation lint warning and nonfatal build size/age
warnings remain.

Browser verification covered scene rendering, aerial navigation, driving,
landmark selection/search, pause to zero canvases and resume to one. Public
on-screen acceleration reached 45 km/h. Desktop samples were approximately
60 FPS, without a sustained benchmark. Layout checks at 320, 390 and 768 pixels
showed no horizontal overflow; public 390-pixel controls/layout were inspected.
These are browser viewport checks, not physical-phone or touch-hardware testing.
Forced WebGL loss was not tested. The paused text experience and no-JavaScript
markup were verified; the WebGL failure path was reviewed.

The final candidate and public HTTPS checks returned HTTP 200 for all 13 page
routes. Protected main content, links, canonicals, 124 existing tutorial IDs and
24 tutorial asset hashes were retained. Apex and www Vancouver/Motion/privacy/
support/tutorial URLs passed; the tutorial keeps its exact www canonical.
Motion's 307 access redirect and permanent Work/Sport/legacy investment redirects
preserve their destinations, suffixes and query context. City JSON and manifest
hashes match the committed source. Linux native image optimization returned 200.
The final submenu was visually verified at desktop, 390 and 320 pixels, without
horizontal overflow; browser error/warning logs were empty.

At 2026-10-30T08:51:56.738248+00:00, the website was active/enabled with zero automatic
restarts. Five peer-service identities, 55 configuration hashes, the Node
binary and 13 other virtual-host response baselines were unchanged. Available
memory was 415,856 KiB and disk free space 7,238,459,392 bytes
(about 6.74 GiB). Preparation/acceptance minima were
292,544 KiB and 7,238,537,216 free bytes.

During the intentional stop, the old service wrapper exited 143 (SIGTERM), which
systemd recorded as an exit-code warning. The new process started normally;
there were zero matching error entries after successful activation. No service
configuration was changed to suppress the old-wrapper shutdown warning.

## Capacity and rollback

The production host's 192 MiB available-memory and 6 GiB free-disk floors were
retained during candidate preparation, loopback acceptance and activation.
Three older inactive complete website runtimes were losslessly archived to
owner-controlled storage: `d51288f`, `f47f99b` and `da09185`. Before removing each
redundant uncompressed directory, source/build identity, clean/inactive status,
configuration references, matching local/remote SHA-256, gzip integrity and GNU
tar's complete contents/metadata comparison were verified. This changes recovery
storage form, not retention. Archives and private evidence are outside Git.

The immediately preceding Vancouver runtime is retained at
`/var/www/asymmetri-rollback-vancouver-20261030-a27af82`. The complete pre-Vancouver
runtime is also retained at
`/var/www/asymmetri-rollback-vancouver-20261030-cefacd5`, source
`cefacd55346d3c18fc60d767d0e6e518751e478e`, build `mPazQxcfU3DwZdKLhWD9I`.
Each includes source, dependencies, public assets and the matching Next build.

Rollback uses the documented complete-directory swap: verify the selected
runtime and resource/service baseline, stop only `asymmetri.service`, move the
current tree to an unused failure-retention path, move the selected complete
rollback tree to `/var/www/asymmetri`, start the service and repeat protected
HTTP/assets/peer checks. The release activation script includes automatic
restoration on failure. Rollback identities and executable runtime files were
verified; a production restore was not needed or rehearsed.

Ubuntu, Nginx, TLS, DNS, Node binary and peer services were not changed. The
existing retained-host exception and standing production Node 22 approval remain.

## Rights and limitations

Original Vancouver code, prose and procedural models are MIT. Derived City data
retains the Open Government Licence – Vancouver, and Three.js retains its MIT
notice. See [rights and attribution](../projects/vancouver/THIRD_PARTY_NOTICES.md).
No OSM data or reference-project code/media is included. The independent-project
disclaimer, sources, experimental label and important omissions are visible.

Coverage is eastern False Creek only. Footprints date to 2015 and the simplified
shoreline to 2002; heights, trees and landmark dimensions are illustrative, with
flat terrain. Dated footprints can obstruct some street corridors. Driving is
arcade-only; use reset when blocked. Bridges, walking, traffic, history, proposed
development layers and the rest of Vancouver are absent.

V0.2 priorities are road/bridge continuity, better measured heights and landmark
models, physical-phone profiling, and incremental western False Creek coverage.
