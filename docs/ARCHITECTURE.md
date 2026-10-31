# Architecture

## Overview

Asymmetri / Asymmetri.co is the umbrella; Asymmetri Sports and Asymmetri Labs are
peer divisions. Motion belongs to Sports; experimental open-source BotSquad belongs
to Labs. BotSquad contains BotSquad Research, which contains BotSquad Trade;
Ask BotSquad is a shared sibling of Research. Next.js App Router, strict TypeScript and shared CSS render the site.
DigitalOcean serves the standard Next.js build; Vinext/Cloudflare packaging remains
separate. Existing pages have no CMS, embedded signup forms, accounts or analytics.
Motion access requests use an external Google Form, reached through `/motion/try`. The independent,
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
| `/labs/gis` | `app/labs/gis/page.tsx`: GIS Apps category, city cards and reconstruction explanation |
| `/labs/vancouver`, `/labs/surrey`, `/labs/richmond` | Existing independent city applications; unchanged URLs under the GIS Apps category |
| `/motion` | Current pitching workflow and family roadmap |
| `/motion/try` | HTTP 307 to the external Google Form in `motion.access.formUrl` |
| `/botsquad` | Umbrella project overview, software story and area directory |
| `/botsquad/research` | Research hub linking to BotSquad Trade |
| `/botsquad/trade` | Trade research project and retained evidence routes |
| `/botsquad/trade/guide` | Static technical article, actual public-interface captures and dated operational evidence |
| `/botsquad/trade/hq-guide` | Static companion explaining private HQ inspection through approved cropped screenshots |
| `/botsquad/investment/:path*` | HTTP 308 to the same suffix under `/botsquad/trade`, retaining query values |
| `/botsquad/ask` | Shared BotSquad question service, currently closed |
| `/about` | Company philosophy and origin |
| `/tutorial` | Protected progressive Motion guide |
| `/privacy`, `/support` | Protected Motion articles |
| `/robots.txt`, `/sitemap.xml` | Indexable canonical routes, permissive robots |
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
archive. Both guide routes share the article layout, contents, tables and styles. The HQ
companion accepts a plain source label for private-interface captures; it never
links to or reads a private HQ endpoint. Full-size images remain local static
assets, capped by their native width. Guide metadata keeps Trade's noindex policy;
the sitemap is unchanged.
The HQ guide's `#tail-logs` section contains static operator command examples,
including service-journal inspection and a clearly dated incident-specific helper.
Rendering the page never opens SSH, reads a private database or starts a follower.
Browsers retain legacy `/sport` fragments across its fragment-free redirect;
Sports retains story/approach/product/contact IDs. The homepage-only compatibility
component maps old root `#story`, `#approach`, `#product` to Sports. Explicit no-JS
fallback anchors remain. The product showcase is removed; current gateway links
use `/`. Root `#contact` remains on the footer email for historical contact URLs,
while primary navigation uses the centralized mailto link.

## Motion access requests

`motion.access` in `content/site.ts` owns the stable route, public form destination,
CTA and eligibility/provider notice. `next.config.ts` imports that destination and
uses a temporary 307 redirect so a later signup service can replace Google Forms
without changing shared website links. It is not a landing page or sitemap entry.
`MotionAccess` is a server component used at the top and bottom of Motion and in
the Sports product section. Normal anchors work without JavaScript and do not
prefetch the form. Google receives a request only after navigation. The website
holds no submissions, form credentials or response-sheet identifier. Private
response storage and invitation handling remain outside this repository.

## Content, metadata and assets

`content/site.ts` owns `site` identity/navigation/contact; `divisions` peer identities;
`home`, `sports`, `labs`, `about` route copy; `motion`, `botsquad` product facts;
`motionFamily` names, grouping, statuses and entitlements; `productStatusLabels`
(current/preparing/development/planned); and existing tutorial, utility, concept and
approved-video records. Sports owns its narrative instead of company-level `site`.
Labs owns a typed `LabsProject` list with name, description, status and optional
source/detail/license links. Project entries retain source links; the GIS Apps
category links to its hub without inventing a separate repository or licence.
`LabsProjectCards` renders the same server-only cards on Labs and GIS Apps.
`gisApps` owns category metadata, reconstruction copy and city cards, which reuse
`vancouver` and `surrey` facts. No city engine/data is imported by the hub.
The new indexable route adds a sitemap entry without moving any existing page,
canonical, asset or data URL. The server page renders a brief hero, generic project articles and a closing
line; it has no approach/principles section or BotSquad-specific access fields.
All Labs projects are open source; Sports has no blanket open-source requirement.
No old `work` content export.

`botsquadStructure` owns the stable area names and URLs. `botsquadResearch` owns
the research hub; `botsquadDirectory` owns the overview area cards. The server-only
`BotSquadNavigation` renders ancestor breadcrumbs and Overview/Research/Trade/Ask
links on the overview, hub, investment, archive and Ask pages. Ask is a sibling
of Research, not an investment-only child. Legacy Investment page URLs remain usable through same-suffix permanent
redirects to Trade. Ask URLs and the canonical evidence/API protocol are unchanged.
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
index preserves `#how-it-works`, `#availability` and `#introduction-video`; the last
now links to the official YouTube channel without embedding an off-channel video.
`UtilityPage` is a server article.

Client components remain limited to tutorial progression, legacy root fragments,
menu dismissal, plus the availability/disclosure-gated Ask client.
`IntroductionVideo` is a server component that renders the fixed-ID
privacy-enhanced iframe directly, without autoplay or a site-owned player SDK.
Google requests can begin on page load, before Play. Origin referrer, native
controls/fullscreen, visible Google notice and external fallback remain. Loading
does not move keyboard focus. No new runtime dependency or server state.

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
- `next.config.ts`: permanent compatibility redirects and the temporary Motion access redirect.
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
documents the October 8 owner override and its verification against accepted
Motion 1.2 (4), with unchanged scientific mappings. The shared Pitching family
detail supplies release wording on both routes. Motion's `#reference-study`
section links to the tutorial step with the same hash; the tutorial keeps its ten
modules and existing IDs while adding Notes, PDF sharing and Reference/Compare
steps. Explorer copy describes the All default separately from saved filters.

## Progressive tutorial

`content/site.ts` exports typed `tutorial` modules/steps and `tutorialMedia` captions,
alt text, exact dimensions and visual-source labels. `app/tutorial/page.tsx` renders
all essential prose, lists, troubleshooting disclosures and media as server content.
The narrowly scoped `components/tutorial-reader.tsx` receives server-rendered header
and content slots plus a small navigation index. It adds module selection, ephemeral
Record/Import and Back/Side radios, Previous/Next and complete-guide mode.

The URL hash is the navigation source of truth through `useSyncExternalStore`.
After module visibility changes, deep-link focus and scrolling resolve immediately
to the requested step, avoiding native smooth-scroll races with the old page height.
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
The optional third-party player exists only on Motion and uses a verified upload
from the centralized `youtubeChannel`. BotSquad provides a plain channel link.

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
server pages under `/botsquad/trade`, with no-store verified content proxying. See the [runbook](INVESTMENT_RECEIVER.md) for trust,
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

`app/botsquad/trade/` composes a streaming static introduction plus bounded
server reads. New exact-run, decision and methodology pages complement INV-03
artifact/version, discussion and record pages. `/botsquad/ask` remains closed and can inspect same-origin availability.
The website has no question submission UI or provider connection. The independent
Ask API is routed separately and rejects visitor intake while disabled.
`content/site.ts` owns `investmentShowcase` copy and `investmentArchive` disclosures.

`lib/investment-archive.ts` validates configured origin/scope, an exact GET allowlist,
query constraints and named frozen v1 DTO schemas through AJV 8.20.0/ajv-formats 3.0.1.
The server allows two concurrent reads, nine requests per landing render plus at most one receiver-provided tail page, 8-second
read deadlines and a 2 MiB JSON ceiling. Artifact bytes retain exact digest/type/size
checks and post-read visibility checks. Financial strings remain exact for labels;
Number conversion is confined to display chart coordinates/derived plotting ratios.

`components/investment/` separates desk, portfolio/history, journal, collections,
run history, exports, human-readable exact records, disabled Ask and visibility.
Native SVG, meters and semantic tables require no chart library. CSV formula cells
are neutralized; exports contain only the shown page and retain synthetic labels.
Snapshot fields, original timestamps and receiver publication receipts stay distinct.
The Live Trading Desk shows each bounded event window newest first by original
event time, breaking ties by descending receiver sequence. Following and Jump to
latest keep the panel at the top; moving down to older records pauses following.
Archive pagination keeps its publication-order cursors. Synthetic playback still
reveals events from oldest to newest, with each newly revealed event at the top.
No roster/financial data clients mount before the run's evidence mode is verified.

INV-REAL-01 adds a public run-configuration component using existing `RunPublished`
fields, source/valuation limitations and explicit evidence/accounting clocks. Chart
paths use exact sequence comparisons to break across missing observations. No new
DTO, database or client authority is added. See [the current integration handoff](INV-REAL-01-WEBSITE.md).

The same-origin `/botsquad/trade/read` GET route exposes only approved public
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


## Trade public URL migration

The complete route family lives in `app/botsquad/trade/`; the legacy family has a
single permanent wildcard redirect in `next.config.ts`. `lib/trade-metadata.ts`
sets per-page canonical/OG identity with exact-run context while retaining noindex.
Read/content handlers moved without implementation changes. No ingress or private
API routing changed. Dated screenshot source links intentionally retain their old
capture URLs. The [migration contract](BOTSQUAD_TRADE_URL_MIGRATION_2026-10-15.md)
documents query/fragment/method behavior and the independently built dual-URL
compatibility fallback required for permanent-redirect rollback.

## Trade session summary

The landing and exact-run pages lead with `SessionBrief`, a dated public account
of the latest decision in the receiver's bounded tail window. The first event
page still verifies run configuration and roster; one optional tail read supplies
recent facts, under the same final visibility witness. Failed tail reads do not
fall back to an old decision. No recursive history download is introduced.

The summary separates proposal, independent review and publication times in
America/Vancouver. It quotes published reasoning and dissent, shows the newest
available valuation (including a partial one newer than the complete snapshot),
and displays only an explicitly published next review. A past schedule is labelled
as past. Cited sources are not research success counts, a decision is not a fill,
and the page does not infer private execution health or current risk permission.
No HQ access, new contract, model call, operational control or fixed daily time is
added. Existing visibility polling refreshes the server summary when the source
watermark changes; withdrawals and unavailability continue to hide cached content.

## Vancouver V0.5 (October 30, 2026)

`app/labs/vancouver/page.tsx` frames the independent Labs experiment. Its client
interface dynamically imports `projects/vancouver/engine.ts`; Three.js 0.186.1
and geographic data are isolated to this route. `scenery.ts` owns merged facades,
original window textures, instanced vegetation/street furniture and landmark/car
models. The engine owns WebGL2, OrbitControls, static shadow maps, selection,
damped cameras, input, visibility suspension and GPU/listener disposal. Auto DPR
is capped and reduces after sustained low FPS; Lite disables shadows and caps DPR
at one. Context loss preserves the text interface and retry recreates the engine.

React owns search, modes, source panels, loading/error/text states and a portable
full-window dialog with focus trapping/Escape. `MiniMap.tsx` uses the same loaded
city for its SVG map. Only throttled driving telemetry crosses into React.
`physics.ts` uses a 64-metre spatial index, full-car clearance, movement substeps,
smoothed steering and validated nearby spawns. Elevated bridge/viaduct lines are
excluded from ground driving. No API, database, accounts, transmitted telemetry or external
runtime service is added.

The immutable V0.2 snapshot derives from V0.1 in the optional offline Python
pipeline. Source road centrelines and 436 building parts remain; 24 footprints
are trimmed to make illustrative pavement/sidewalk clearance. Pavement is clipped
to land; water and extent do not expand. Shared precision is removed before
buffering overlays to prevent collapsed building parts. Heights, street widths,
promenade, scenery and flat terrain are explicitly illustrative. No historical,
proposal or OSM layers. Source/data licences remain separate. Public-folder
revalidation remains unchanged; any future immutable caching must be versioned
and verified across both build paths.

The V0.1 dependency baseline remains Next.js/eslint-config-next 16.4.3, React
19.2.6 and Sharp's 0.35.5 override. V0.2 adds no runtime or development dependency.

V0.3 adds `navigation.ts`: a validated local graph, Dijkstra routes, checked corner
smoothing, route projection and an optional scenic controller that feeds the same
vehicle physics. Visible pavement and 64 m collision tiles are generated together;
movement integrates at <=1/120 s with a 0.1 s stall cap. Four endpoint repairs and
110 turning aprons do not alter retained building or water geometry. A separate
V0.3 snapshot joins 115 historic 2009 LiDAR heights conservatively to 2015 footprints;
321 remain illustrative. Original snapshots are untouched. The 2.369 km loop is
accepted in both directions including its lap seam. All six places have roadside
routes, but Cruise is offered only on the tested loop. Bridge visuals use sampled
level water decks and smooth land ramps; elevated driving remains deferred. Route
arrows add one instanced mesh that is disposed when replaced. Bounded DOM-only
performance diagnostics record session distance/collisions/FPS and a rolling
600-frame p95; nothing is transmitted. No dependencies or runtime services added.

V0.4 adds three waypoint drives and map-selected destinations without extending
Cruise beyond the scenic circuit. Checked short parallel-road offsets are smoothed
only if the full car fits. `input.ts` owns independent key/pointer sources, so
releasing one finger cannot release another. Blur, visibility and offscreen pauses
clear inputs, Cruise and velocity. Relaxed pace only controls speed; steering stays
manual. Camera distance is selectable. A development-only WebGL loss/restore UI
exercises the real renderer lifecycle and is absent from production.

The V0.4 pipeline retains footprint/land/water geometry, widens 110 clipped aprons
and renders the exact 64 m collision cells. 18 source-reviewed 2013 NRCan heights
replace 13 older measurements and five estimates; 102 City 2009 heights and 316
estimates remain. Its external PyArrow extractor uses bounded verified byte ranges;
no new npm dependency or geographic runtime service is needed.

V0.5 adds `handling.ts`, an injected wrapper around the unchanged shared collision
integrator. It shapes manual taps/holds, speed-sensitive wheel limits and release
at 120 Hz without using road headings or route guidance. `camera.ts` tests the
whole horizontal sight line, including interpolation through a corner. View-only
bridge materials fade on camera-to-car ray intersection; driving geometry remains
unchanged. `DriveControls.tsx` owns captured pointers and sliding steering.

Compact screens use one explicit Menu panel and a paused engine state, safe-area
insets and automatic expanded driving. The map labels its bounded False Creek
coverage. DOM diagnostics add per-run distance, time, moving time, contacts,
recoveries and resets. Nothing is transmitted. The existing V0.4 snapshot remains
byte-identical. `elevation.ts` and a development-only lazy `ElevationLab.tsx` test
an original synthetic XYZ road graph, continuous ramps, full-car deck support and
a disconnected underpass. They do not enable public bridge driving. No dependency,
backend or common cross-city engine is introduced.

## Surrey, City of Adventure V0.3

`app/labs/surrey` owns the isolated game route. `projects/surrey` separates pure
collision, seeded simulation, authored story/encounter data, validated local saves,
aerial camera and bounded pedestrians from Three.js and React. One scene/renderer/
loop serves both modes; aerial freezes gameplay time, NPCs and threats. React gets
150 ms snapshots. Teardown releases GPU resources, listeners and observers.

Only existing Vancouver geometry predicates are reused. Vancouver files and published earlier
geographic snapshots stay unchanged. `save.ts` validates the versioned per-origin
localStorage record; no backend, account, upload, telemetry or dependency is added.
`content/site.ts` owns public metadata/status; route-local text discloses fictional
adult content. The project README describes all controls, cases and limitations.

### Surrey V0.3 reconstruction

The V0.3 snapshot retains V0.1 footprints, anchors and collision cells, replaces
pavement with unioned source/derived surfaces, and adds active curbs, medians and
paths. FACILITYID/native-CRS joins verify metre units and source agreement; unknown
survey method/date prevents a verified-measured classification. Terrain explicitly
remains flat. `reconstruct_city.py` pins input/output hashes and uses 1cm topology-
preserving precision. `test_reconstruction.py` independently checks exported meshes.

`architecture.ts` assigns deterministic building profiles; `buildings.ts` batches
shared facade materials, roof caps/equipment and 128m nearby-detail tiles. One
scene/renderer still serves both perspectives. `ViewControls.tsx` and `viewPolicy.ts`
provide persistent labelled buttons, active semantics, guarded V shortcuts and
independent onboarding storage. Phone HUD panels open on request through Menu,
with a compact objective and edge controls. `save.ts` migrates V0.2 map identity
under the same storage key; simulation restore preserves progress and validates
only positions against current walkability. No new runtime dependency/service.


## Surrey V0.4 — Living Surrey

Surrey V0.4 adds pure time/missing-case modules and opt-in procedural WebAudio, retains one renderer and immutable V0.3 geometry, and explicitly migrates saved schema2 to3 under the old local key. Window/lamp emission shares materials; pedestrian schedules and distance updates remain bounded. See `projects/surrey/README.md` and `SURREY_V04_RELEASE_2026-10-30.md`.

## Richmond V0.1

`app/labs/richmond/page.tsx` owns the server-rendered route, metadata, attribution
and text alternative. Its client game lazily imports the Three.js engine after
Start. `content/site.ts` exports the typed `richmond` identity and registers it in
`gisApps.projects`; existing `LabsProjectCards`, menus and sitemap conventions
remain in place. Other routes do not import the renderer or geographic snapshot.

`projects/richmond/` separates world spatial indexes, pure simulation/economy,
interior geometry, population, cameras, scenery, streetscape, persistence and UI.
It imports only Vancouver's stable pure polygon/distance/car predicates and
vehicle integrator. Richmond collision radii, data, state and save key remain
independent. No Vancouver or Surrey implementation or save namespace is changed.

The same-origin ODbL snapshot has a lightweight building overview and 512 m detail
tiles (at most 16 loaded, two pending). Public source-node road topology is
separate from pedestrian and airfield surfaces; no projected crossing invents a
junction. Fictional entrance connectors and the marked airport connection are
explicit derived-data additions. Original interiors use solid furniture and
walkable corridor guidance; transitions retain the exterior car and active order.

Versioned, validated `asymmetri.richmond.save.v1` contains the single game economy,
transaction ledger, inventory, order and settings. Invalid saves are retained
until explicit reset; unavailable storage leaves a session-only game. There is no
backend, telemetry, authentication or live GIS request. Menus, shops, hidden tabs
and aerial surveying pause simulation. Teardown aborts loads and disposes geometry,
textures, actors, input listeners and animation frames.

Phone play uses `100dvh`, safe-area insets and a canvas grid row with controls
outside it. Full status/minimap panels are on demand. A single focused paused
dialog makes background controls inert. See the project README and handoff for
geographic coverage, approximation disclosures and measured acceptance limits.

## Surrey V0.5 — On the Move

Surrey-only `vehicle.ts` owns full oriented footprint/boundary and 120Hz swept
movement; `transport.ts` owns the versioned road mask, ordered route graph, safe
exit/recovery, traffic and connected train path. `transportScene.ts` adds original
shared geometry to the existing renderer. Occupancy is a movement state, never a
third top-level view. Simulation pauses cars/traffic/trains in Aerial Explore.
Schema4 explicitly migrates old saves and stops cars on reload. `resources.ts`
now disposes line geometry/materials too. Vancouver/Richmond engines are untouched.
See the project README and V0.5 release record for bounds and verification.

## Vancouver V0.6 research boundary

V0.5 remains public after failed manual candidate acceptance. `projects/vancouver/development/` contains the explicitly selected handling/camera comparison, bounded in-memory evidence and real-data Cambie lab; production conditional imports omit these modules. Stable physics/handling/camera and published data are unchanged. `elevation.ts` extends the isolated proof with curved profiles and explicit connected surfaces. See [the decision and evidence](VANCOUVER_V06_RESEARCH_2026-10-30.md).

## Surrey V0.6 candidate

Surrey adds a separately versioned transport graph derived from immutable V0.3
geography. `navigation.ts` searches directed incoming-edge states so rejected
junction turns cannot return through A*. `vehicle.ts` accelerates polygon ray
queries with north/south edge bands while retaining full-body boundary/hole and
swept collision checks. `signals.ts` supplies one fictional phase shared by
visible lights, traffic and crossing pedestrians; `input.ts` tracks independent
pointer/key ownership. Schema5 retains the existing browser-local storage key.
GPS buffers are replaced/disposed on route revision; no renderer or global state
is added. Public runtime remains V0.5 until the V0.6 acceptance gate passes.
