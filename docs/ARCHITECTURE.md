# Architecture

## Overview

Asymmetri / Asymmetri.co is the umbrella; Asymmetri Sports and Asymmetri Labs are
peer divisions. Motion belongs to Sports; experimental open-source BotSquad belongs
to Labs. BotSquad contains BotSquad Research, which contains BotSquad Trade;
Ask BotSquad is a shared sibling of Research. Next.js App Router, strict TypeScript and shared CSS render the site.
DigitalOcean serves the standard Next.js build; Vinext/Cloudflare packaging remains
separate. Existing pages have no CMS, forms, accounts or analytics. The independent,
default-disabled INV-02 receiver owns a public archive/signature boundary described
in [INVESTMENT_RECEIVER.md](INVESTMENT_RECEIVER.md). Strict production API routing
is live with the exact finite investment publisher and initial configured portfolio.
Ask intake remains disabled and no Ask service authority is active.

## Routes and compatibility

| URL | Source / result |
| --- | --- |
| `/` | `app/page.tsx`: concise umbrella gateway with division/product links |
| `/sports` | `app/sports/page.tsx`: sports, origin and Motion family |
| `/labs` | `app/labs/page.tsx`: experiments and current project list |
| `/motion` | Current pitching workflow and family roadmap |
| `/botsquad` | Umbrella project overview, software story and area directory |
| `/botsquad/research` | Research hub linking to BotSquad Trade |
| `/botsquad/investment` | Trade research project and retained evidence routes |
| `/botsquad/investment/guide` | Static technical article, actual public-interface captures and dated operational evidence |
| `/botsquad/ask` | Shared BotSquad question service, currently closed |
| `/about` | Company philosophy and origin |
| `/tutorial` | Protected progressive Motion guide |
| `/privacy`, `/support` | Protected Motion articles |
| `/robots.txt`, `/sitemap.xml` | Ten indexable canonical routes, permissive robots |
| `/sport` | HTTP 308 to `/sports` |
| `/work` | HTTP 308 to `/labs` |
| `/story` | HTTP 308 to `/sports#story` |
| `/contact` | HTTP 308 to `/#contact` (footer email) |
| `/why-asymmetrico` | HTTP 308 to `/about` |
| `/work/asymmetrico-platform` | HTTP 308 to `/sports` |

The apex origin is canonical except for exact `https://www.asymmetri.co/tutorial`.
Both hosts serve protected pages. No host/infrastructure redirect change.
The Trade technical guide is a static server-rendered article with local public
screenshots, native contents links and semantic diagrams/tables. It does not read
private HQ data, depend on a receiver connection or add an API, parser dependency,
operational control or model call. Its dated evidence is distinct from the live
archive. Guide metadata keeps Trade's noindex policy; the sitemap is unchanged.
Browsers retain legacy `/sport` fragments across its fragment-free redirect;
Sports retains story/approach/product/contact IDs. The homepage-only compatibility
component maps old root `#story`, `#approach`, `#product` to Sports. Explicit no-JS
fallback anchors remain. The product showcase is removed; current gateway links
use `/`. Root `#contact` remains on the footer email for historical contact URLs,
while primary navigation uses the centralized mailto link.

## Content, metadata and assets

`content/site.ts` owns `site` identity/navigation/contact; `divisions` peer identities;
`home`, `sports`, `labs`, `about` route copy; `motion`, `botsquad` product facts;
`motionFamily` names, grouping, statuses and entitlements; `productStatusLabels`
(current/preparing/development/planned); and existing tutorial, utility, concept and
approved-video records. Sports owns its narrative instead of company-level `site`.
Labs owns a typed `LabsProject` list with name, description, status, required source
link and optional detail/license links. The single current entry reuses `botsquad`
facts. The server page renders a brief hero, generic project articles and a closing
line; it has no approach/principles section or BotSquad-specific access fields.
All Labs projects are open source; Sports has no blanket open-source requirement.
No old `work` content export.

`botsquadStructure` owns the stable area names and URLs. `botsquadResearch` owns
the research hub; `botsquadDirectory` owns the overview area cards. The server-only
`BotSquadNavigation` renders ancestor breadcrumbs and Overview/Research/Trade/Ask
links on the overview, hub, investment, archive and Ask pages. Ask is a sibling
of Research, not an investment-only child. Existing investment and Ask URLs remain
stable; page hierarchy does not change the canonical evidence/API protocol.
See [the October 13 hierarchy decision](BOTSQUAD_HIERARCHY_2026-10-13.md).

`MotionFamily` is a server component reused on Sports and Motion: two individual
apps and exactly one professional app with nested entitlement rows. Names/statuses
are changed centrally. Optional product links allow later genuine detail routes;
there are no placeholder pages for unimplemented products.

`app/layout.tsx` supplies umbrella metadata/Organization schema. Product schemas
retain bounded facts and no offers, ratings or invented downloads. Route metadata
uses `lib/metadata.ts`; homepage/About/default previews use `home-social.png`,
Labs/BotSquad use `labs-social.png`, Sports uses `sport-social.png`, and Motion
retains its icon. Updated social artwork uses local SVG typography and existing
Sharp rasterization; authentic photos/screenshots/icons retain URLs and bytes.
See `ASSET_MANIFEST.md` for provenance.

## Rendering and interaction

Essential copy, diagrams and native anchor/disclosure navigation render on the
server. `SiteHeader` includes a skip link and Sports/Labs/About/Contact navigation.
Native exclusive `details` menus work without JS; a small enhancement dismisses on
outside pointer/Escape and restores focus. Footer links label Motion resources.
`HomeCapability` now renders the actual two-division hierarchy with direct product
links in the only homepage section. Homepage-only showcases, copy and `HomeWorkerFlow`
are removed; dedicated pages retain product detail. On BotSquad, `WorkerFlow` renders the
reference team as nested semantic lists; `WorkerExample` renders the illustrative Motion
scenario as an ordered sequence with explicit limitations. `EvidenceChain` retains Motion
evidence presentation. All diagrams are server-rendered text, with no diagram library.
BotSquad-specific `.squad-*` CSS uses existing Graphite + Teal tokens. Its native page
index preserves `#how-it-works`, `#availability` and `#introduction-video`. `UtilityPage` is a server article.

Client components remain limited to tutorial progression, legacy root fragments,
menu dismissal and deliberate video loading, plus the availability/disclosure-gated Ask client. Video posters load no remote resource.
Clicking Load creates a fixed-ID privacy-enhanced iframe with no autoplay, SDK or
persisted consent; origin referrer, native controls/fullscreen, visible Google
notice, Close/focus restoration and external fallback remain. Google processing
begins only after activation. No new runtime dependency or server state.

## Application architecture

### TypeScript

`tsconfig.json` enables strict TypeScript, uses bundler module resolution, and
defines the `@/*` alias for repository-root imports. `content/site.ts` declares
explicit image and navigation types and uses `satisfies` to validate shared
content structures.

`npm run typecheck` runs `tsc --noEmit`. `npm run check` runs type checking and
ESLint together.

### Tailwind and global CSS

Tailwind scans `app/`, `components/`, and `content/`. PostCSS loads Tailwind and
Autoprefixer. `tailwind.config.ts` retains the theme extension and system font
families.

The current page presentation is primarily implemented through semantic class
selectors in `app/globals.css`. That file owns:

- reusable color, shell, and typography custom properties;
- global resets and system font stacks;
- page grids, spacing, buttons, navigation, header, and footer styling;
- responsive breakpoints;
- visible keyboard focus;
- reduced-motion behavior.

No external font service, CSS-in-JS runtime, or UI component library is used.

### Directory responsibilities

- `app/`: routes, metadata, sitemap, robots, composition and global styles.
- `components/`: shared structure, editorial visuals and small interactions.
- `content/`: typed public copy, product facts, links and asset descriptions.
- `lib/metadata.ts`: shared metadata helpers.
- `public/brand/`, `public/images/`: local approved assets and raster social images.
- `docs/`: strategy, source reviews, development, verification and operations.
- `build/`, `worker/`, `vite.config.ts`: retained Sites/Vinext packaging.
- `next.config.ts`: permanent route redirects.
- `package.json`, `package-lock.json`, `.nvmrc`: runtime/dependency contract.

### npm scripts

| Script | Actual command | Purpose |
| --- | --- | --- |
| `npm run dev` | `vinext dev` | Local Vinext and Cloudflare-compatible development |
| `npm run build` | `vinext build` | Build the Worker-compatible `dist/` bundle |
| `npm run start` | `vinext start` | Serve an existing Vinext build locally |
| `npm run dev:next` | `next dev` | Standard Next.js development server |
| `npm run build:next` | `next build` | Standard Next.js production build in `.next/` |
| `npm run check` | `npm run typecheck && npm run lint` | Strict TypeScript and ESLint checks |
| `npm run typecheck` | `tsc --noEmit` | Type-check without emitting JavaScript |
| `npm run lint` | `eslint .` | Lint repository source |

The DigitalOcean production server does not use `npm run start`. That script
starts Vinext. DigitalOcean uses `npm run build:next`, then launches the standard
Next.js server directly:

```bash
node_modules/.bin/next start -p 3001 -H 127.0.0.1
```

### Standard Next.js and Vinext boundaries

| Concern | DigitalOcean production | Vinext and OpenAI Sites |
| --- | --- | --- |
| Build command | `npm run build:next` | `npm run build` |
| Build output | `.next/` | `dist/` |
| Runtime | `node_modules/.bin/next start` | Vinext Cloudflare Worker |
| Main configuration | `next.config.ts` | `vite.config.ts`, `worker/`, `build/` |
| Public endpoint | `asymmetri.co` through Nginx | Managed Sites deployment URL when explicitly published |

The two paths share the same `app/`, `components/`, `content/`, and `public/`
sources. A change should remain compatible with both unless the repository
explicitly retires one path.

## Production infrastructure architecture

The October 9 [INFRA-01 cancellation](INFRA-01-CANCELLATION.md) retains the original
Ubuntu 22.10 Droplet/IP and independently pinned website release. All 15 hosts retain
their baseline behavior. The migration snapshot was deleted after backup verification;
independent encrypted recovery sets remain. The OS carries an explicit time-limited
unsupported-OS exception with review before future deployment/public exposure.
Django retirement and the static 410 proposal were evaluated, not executed; Django,
Gunicorn/socket, SQLite, dormant PG data, shared accounts and all runtimes remain.
`ops/infra/` contains reusable operator HTTP comparison and recovery tools with no
website/runtime integration. [INFRA-02](INFRA-02-RECEIVER-DEPLOYMENT.md) installs the receiver under a dedicated identity with an empty private archive, masked unrelated filesystem trees and no public ingress. Actual Linux/native SQLite, isolated transparent Nginx, confinement and bounded-load evidence is recorded in [validation](INFRA-02-VALIDATION.md). The [October 13 release](INGRESS_RELEASE_2026-10-13.md) starts the empty receiver and disabled-intake Ask listener behind verified strict HTTPS. Both units remain static; publisher/Ask authority is absent. The rejected nginx 1.22 HTTP profile did not preserve duplicate Connection headers.

### Request path

```text
Browser
  -> DNS provider
  -> DigitalOcean Droplet
  -> Nginx HTTP on 80 / stream SNI dispatch on 443
  -> apex: TLS bridge 3103 -> raw router 3100 -> Nginx website 3080
     www/other SNI: ordinary Nginx TLS 8443/8444
  -> 127.0.0.1:3001
  -> asymmetri.service
  -> standard Next.js production server
  -> /var/www/asymmetri
```

### Responsibilities

| Layer | Responsibility |
| --- | --- |
| DNS provider | Publishes records for `asymmetri.co` and `www.asymmetri.co` that point to the Droplet |
| DigitalOcean Droplet | Provides the virtual server, network interface, disk, memory, and CPU |
| Ubuntu | Supplies the operating system, users, package management, process controls, and logs |
| Nginx | Accepts HTTP and dispatches HTTPS by SNI; terminates www/other TLS and proxies ordinary pages to Next.js |
| Dedicated TLS/raw router | Terminates apex TLS and preserves API HTTP bytes for the separate investment and Ask receivers |
| Let’s Encrypt and Certbot | Renew Nginx certificates; a verified deploy hook atomically reloads the apex TLS bridge |
| systemd | Starts, restarts, monitors, and enables `asymmetri.service` at boot |
| Node.js | Executes the installed Next.js runtime |
| npm | Installs the exact lockfile dependency graph and runs validation and build scripts |
| Next.js | Builds and serves the application, routes, redirects, metadata responses, and image requests |
| Git repository | Defines the reviewed source and dependency lockfile for each deployment |
| `/var/www/asymmetri` | Holds the production checkout, `node_modules/`, `.next/`, and files used by the service |

DNS does not need to be managed in the DigitalOcean Domains dashboard for the
Droplet to host the site. The registrar or another DNS provider can manage the
zone as long as the records resolve to the Droplet’s public address.

### Current production assumptions

The current operational baseline is:

- an Ubuntu DigitalOcean Droplet;
- the dedicated bridge terminates apex HTTPS; Nginx terminates www/other HTTPS;
- an existing Let’s Encrypt certificate covers both hostnames;
- Nginx proxies application traffic to `127.0.0.1:3001`;
- port 3001 is bound to loopback and is not directly exposed to the internet;
- `asymmetri.service` is enabled to start automatically at boot;
- the service runs as `django-user`;
- production application files live under `/var/www/asymmetri`;
- the repository targets Node.js 24 through `.nvmrc`;
- Next.js 16.3.8 requires Node.js 20.9.0 or newer;
- the Droplet is resource-constrained, so disk and memory should be checked
  before dependency installation or a production build.

These statements describe the current intended production setup. The live
server configuration remains the source of truth and should be inspected before
an infrastructure change.

### Expected systemd service

The expected service shape is:

```ini
[Unit]
Description=Asymmetri Labs Next.js
After=network.target

[Service]
Type=simple
User=django-user
Group=django-user
WorkingDirectory=/var/www/asymmetri
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
ExecStart=/var/www/asymmetri/node_modules/.bin/next start -p 3001 -H 127.0.0.1
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

This example is documentation, not a replacement for the live file. Inspect the
actual unit with:

```bash
systemctl cat asymmetri.service
```

The live file is expected at
`/etc/systemd/system/asymmetri.service`.

### Expected Nginx proxy

A representative application location is:

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

The exact live Nginx configuration must be checked with:

```bash
sudo nginx -T
```

Routine application redeployment does not require a DNS, certificate, Nginx,
port, or systemd change. See `docs/DEPLOYMENT.md` for the production procedure.


## Motion story and shared measurement inventory

`content/site.ts` owns `motionMeasurements`, eight owner-approved public measurement
names/descriptions grouped by view and event. `/motion` renders the groups as
semantic headings and definition lists; tutorial Analyze derives its Back/Side
lists from the same inventory. The eight-step workflow and history/performance
sections remain server-rendered content with existing tokens. No new client
component, dependency, data store or media asset is required. The product review
documents the October 8 owner override of the prior website naming gate and the
unchanged scientific mapping for each view/event result.

## Progressive tutorial

`content/site.ts` exports typed `tutorial` modules/steps and `tutorialMedia` captions,
alt text, exact dimensions and visual-source labels. `app/tutorial/page.tsx` renders
all essential prose, lists, troubleshooting disclosures and media as server content.
The narrowly scoped `components/tutorial-reader.tsx` receives server-rendered header
and content slots plus a small navigation index. It adds module selection, ephemeral
Record/Import and Back/Side radios, Previous/Next and complete-guide mode.

The URL hash is the navigation source of truth through `useSyncExternalStore`.
Deep links reveal their module and branch; browser Back/Forward follows hash history.
After hydration, inactive modules use native `hidden`. Before hydration, or with no
JavaScript, all modules and paths remain visible and native anchors/disclosures work.
No progress is stored, sent to a server or used for analytics. Print CSS exposes all
modules and branches. Focus follows hash destinations; scrolling respects the shared
reduced-motion preference. Image links open the original asset in another tab.

Tutorial captures are local lossless PNG crops rendered without image optimization
to preserve screenshot pixels. Original generated setup illustrations use local
WebP; guide/sequence diagrams are local SVG. All have intrinsic dimensions, lazy
loading, responsive CSS, text equivalents and explicit visual-source labels. The tutorial adds no
new dependency, backend, form submission, database, account or external embed.
Optional third-party videos exist only on the two product pages described above.

Tutorial header and content slots use distinct React keys because both become
siblings inside each module. Their key prefixes differ; module/step DOM IDs and
public hashes do not change.


## Semantic visual tokens

`app/globals.css` defines the selected Graphite + Teal palette. Sports and Labs
share umbrella aliases; explicit light reading contexts reassign surfaces, ink,
actions and focus. Motion has independent product tokens preserving its original
teal. Tailwind maps to CSS variables. No exploration runtime or review routes ship.
`Logo` uses currentColor and a token-driven accent without inline color literals.
`HomeCapability` is still a server-rendered native-link hierarchy; its equal
division fields and connectors add no JavaScript. The browser theme color follows
graphite. Existing social exports, favicons, authentic media and source variants
retain their bytes; CSS authority is documented in `VISUAL_IDENTITY.md`.

## BotSquad investment: repository and release ownership

The [cross-repository integration map](BOTSQUAD_INTEGRATION.md) and BotSquad's [investment roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md) describe the coordinated system. **BotSquad** (`eugenelin89/bot_messenger`) owns private employees, Tasks, the future HQ financial simulator and market adapter, trusted publishing, and the canonical [v1 contract](https://github.com/eugenelin89/bot_messenger/tree/507f93afaa0d5e8ede28922e82fc677b8b5cc4e2/contracts/investment/v1). **Asymmetri** (this repository) owns the independently secured receiver and public Next.js archive/showcase; nine canonical files are pinned in `receiver/vendor/investment/v1/` and checked by `npm --prefix receiver run contracts:check`.

INV-01–04 are complete **for their documented source, synthetic and private-installation scopes**. The October 13 [investment activation](INV-REAL-01-WEBSITE.md) subsequently installed finite publisher authority, accepted five initial events and enabled website reads for the exact official run. The public portfolio is configured; market results remain unavailable and Ask stays closed. See [the ingress release receipt](INGRESS_RELEASE_2026-10-13.md) for listener identities, confinement, renewal and all-host checks. Operational backup custody, genuine market-session outcomes and public Ask still require their respective acceptance. The OS upgrade remains a separate project.

## INV-02 standalone archive boundary

`receiver/` has an independent Node22/24 package, pinned contract, SQLite migration,
Ed25519 HTTP authentication, immutable events/receipts, financial validation and
private CAS. Next/Vinext builds exclude its runtime; `lib/investment-archive.ts`
provides only type-safe read locations/types, disabled unless explicitly configured.
Existing company pages do not fetch it. INV-03 adds explicitly configured, default-disabled
server pages under `/botsquad/investment`, with no-store verified content proxying. See the [runbook](INVESTMENT_RECEIVER.md) for trust,
transaction, visibility, capacity, recovery and later private Ask boundaries.


## INV-03 archive and owner-control boundary

[Operations](INV-03-OPERATIONS.md) describes additive migration 002, exact metadata
rights approval, registry/withdrawal controls, correction review, interrupted-restore
startup fencing and current-control reconciliation. `components/investment` owns
safe text/Markdown rendering and evidence links; `content/site.ts` owns archive
copy. No receiver runtime, signing key or private path enters the website bundle.
`receiver/src/backup.ts` snapshots private CAS plus SQLite; encryption is an offline
owner utility. No public administrative route or collection job exists. The separate
default-disabled Ask source is described below.

## INV-04 showcase read boundary

`app/botsquad/investment/` composes a streaming static introduction plus bounded
server reads. New exact-run, decision and methodology pages complement INV-03
artifact/version, discussion and record pages. `/botsquad/ask` remains closed and can inspect same-origin availability.
The website has no question submission UI or provider connection. The independent
Ask API is routed separately and rejects visitor intake while disabled.
`content/site.ts` owns `investmentShowcase` copy and `investmentArchive` disclosures.

`lib/investment-archive.ts` validates configured origin/scope, an exact GET allowlist,
query constraints and named frozen v1 DTO schemas through AJV 8.20.0/ajv-formats 3.0.1.
The server allows two concurrent reads, nine requests per landing render, 8-second
read deadlines and a 2 MiB JSON ceiling. Artifact bytes retain exact digest/type/size
checks and post-read visibility checks. Financial strings remain exact for labels;
Number conversion is confined to display chart coordinates/derived plotting ratios.

`components/investment/` separates desk, portfolio/history, journal, collections,
run history, exports, human-readable exact records, disabled Ask and visibility.
Native SVG, meters and semantic tables require no chart library. CSV formula cells
are neutralized; exports contain only the shown page and retain synthetic labels.
Snapshot fields, original timestamps and receiver publication receipts stay distinct.
No roster/financial data clients mount before the run's evidence mode is verified.

INV-REAL-01 adds a public run-configuration component using existing `RunPublished`
fields, source/valuation limitations and explicit evidence/accounting clocks. Chart
paths use exact sequence comparisons to break across missing observations. No new
DTO, database or client authority is added. See [the current integration handoff](INV-REAL-01-WEBSITE.md).

The same-origin `/botsquad/investment/read` GET route exposes only approved public
read resources; it adds no HQ access, authentication or write authority. Receiver
transport adds `X-Archive-Visibility` (archive epoch + visibility epoch hash) and an
optional `X-Archive-Latest-Cursor` for the latest bounded event window. They do not
change the frozen OpenAPI/schema/DTO package. Successful website reads require the
visibility witness; an older receiver without it fails closed. The installed private
receiver has compatible source; the [investment activation](INV-REAL-01-WEBSITE.md)
enabled exact-run website reads through the preserved runtime configuration.

Ordinary publication changes do not remount readers. A visibility change hides cached
content and refreshes the server projection. Final server witnesses cover all loaded
pages, including run history; detail pages recheck title/body visibility. Visible
status polling is 15 seconds; the desk polls about 12–13 seconds with backoff to
96–97 seconds. Hidden tabs skip reads. Desk requests are aborted on unmount and
preserve paused content/scroll while counting unseen tail events. The tail hint uses
the existing opaque cursor, fixed watermark, visibility epoch, 15-minute expiry,
100-record and 1 MiB page bounds. No recursive catch-up occurs. Withdrawal cannot
recall data already copied by a reader; open UI suppression has a bounded polling
interval, not a claim of instantaneous distributed revocation.

## Private Ask boundary

`receiver/src/ask/` is a separate, default-disabled loopback process with its own
`ask-migrations/`, `ask.sqlite`, service authority and offline CLI. It does not open
the public archive database or add server state to Next.js. Its fixed loopback
adapter verifies public evidence and visibility; raw questions/answers never enter
the archive/feed/export. See [ASK-01](ASK-01-PRIVATE-RECEIVER.md) for sessions,
limits, privacy controls, non-content recovery and activation prerequisites.


## Shared-apex ingress source

`receiver/src/tls-ingress.ts` terminates SNI-selected TLS after a validated trusted
PROXY preamble; `receiver/src/ingress.ts` routes only by the first raw request line.
Separate investment and Ask APIs receive unchanged HTTP, while ordinary Nginx
receives trusted client metadata. The combined CLI and example default disabled.
No ingress code or private key enters the website bundle. The
[ingress runbook](INV-03-INGRESS.md) records limits, actual Linux verification and
the completed [production/renewal receipt](INGRESS_RELEASE_2026-10-13.md). `lib/investment-read-transport.ts` adds only
an explicit server-owned loopback Host override; default fetch/Sites behavior stays
unchanged when that environment setting is absent.

## Dormant Ask visitor interface

[Ask UI boundaries](ASK-03-WEBSITE-UI.md) describe the closed production path
and development-only synthetic disclosure. The approved production disclosure
registry is empty; availability cannot enable a composer by itself. The hook owns consent, tab metadata, safe retries
and privacy controls; `lib/ask-client.ts` validates unchanged canonical DTOs and
relative browser-only API requests. The separate receiver still owns all private
server state. There is no new dependency, provider connection or production
activation setting.

## October 13 navigation and closed contract release

The [current release receipt](BOTSQUAD-NAVIGATION-RELEASE_2026-10-13.md) records the BotSquad Research hub,
shared navigation, neutral investment introduction and installed closed Ask
activity-contract source. It supersedes earlier runtime identities while preserving
live investment records, protected Motion pages and unchanged service configuration.
Public Ask remains closed. The subsequent [configuration-read source packet](ASK-CONFIGURATION-READ_2026-10-13.md) adds the private reconciliation endpoint; its deployment is recorded separately.

## Durable investment execution amendment

The [October 14 packet](INVESTMENT_CLOSE_RECOVERY_2026-10-14.md) adds optional
canonical v1 fields, without a migration. The receiver validates the exact
one-session amendment and requires prior event references from its decisions,
orders and snapshots. Existing dependency links propagate withdrawal. The bounded
`PublicStatus.executionAmendment` projection returns the immutable status event
even when it is beyond an event page or a later status supersedes the run state.
A hidden amendment makes status unavailable. The showcase and archive shell
render this witnessed projection beside the original frozen settings.
