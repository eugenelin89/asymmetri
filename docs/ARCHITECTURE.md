# Architecture

## Overview

Asymmetri / Asymmetri.co is the umbrella; Asymmetri Sports and Asymmetri Labs are
peer divisions. Motion belongs to Sports; experimental open-source BotSquad belongs
to Labs. Next.js App Router, strict TypeScript and shared CSS render the site.
DigitalOcean serves the standard Next.js build; Vinext/Cloudflare packaging remains
separate. No site-owned database, authentication, API, CMS, forms or analytics.

## Routes and compatibility

| URL | Source / result |
| --- | --- |
| `/` | `app/page.tsx`: umbrella, divisions, current work and contact |
| `/sports` | `app/sports/page.tsx`: sports, origin and Motion family |
| `/labs` | `app/labs/page.tsx`: experiments and current project list |
| `/motion` | Current pitching workflow and family roadmap |
| `/botsquad` | Experimental self-hosted project |
| `/about` | Company philosophy and origin |
| `/tutorial` | Protected progressive Motion guide |
| `/privacy`, `/support` | Protected Motion articles |
| `/robots.txt`, `/sitemap.xml` | Nine canonical routes, permissive robots |
| `/sport` | HTTP 308 to `/sports` |
| `/work` | HTTP 308 to `/labs` |
| `/story` | HTTP 308 to `/sports#story` |
| `/contact` | HTTP 308 to `/#contact` |
| `/why-asymmetrico` | HTTP 308 to `/about` |
| `/work/asymmetrico-platform` | HTTP 308 to `/sports` |

The apex origin is canonical except for exact `https://www.asymmetri.co/tutorial`.
Both hosts serve protected pages. No host/infrastructure redirect change.
Browsers retain legacy `/sport` fragments across its fragment-free redirect;
Sports retains story/approach/product/contact IDs. The homepage-only compatibility
component maps old root `#story`, `#approach`, `#product` to Sports. Explicit no-JS
fallback anchors remain; `#products` and root `#contact` are unchanged.

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
links. `HomeWorkerFlow`, `WorkerFlow`, `WorkerExample` and `EvidenceChain` preserve
semantic text visuals and synthetic-example labels. `UtilityPage` is a server article.

Client components remain limited to tutorial progression, legacy root fragments,
menu dismissal and deliberate video loading. Video posters load no remote resource.
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

### Request path

```text
Browser
  -> DNS provider
  -> DigitalOcean Droplet
  -> Nginx on ports 80 and 443
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
| Nginx | Accepts public HTTP and HTTPS traffic, terminates TLS, and proxies requests to the local Next.js port |
| Let’s Encrypt and Certbot | Provide and renew the certificate used by Nginx |
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
- Nginx terminates HTTPS for `asymmetri.co` and `www.asymmetri.co`;
- an existing Let’s Encrypt certificate covers both hostnames;
- Nginx proxies application traffic to `127.0.0.1:3001`;
- port 3001 is bound to loopback and is not directly exposed to the internet;
- `asymmetri.service` is enabled to start automatically at boot;
- the service runs as `django-user`;
- production application files live under `/var/www/asymmetri`;
- the repository targets Node.js 24 through `.nvmrc`;
- Next.js 16.3.6 requires Node.js 20.9.0 or newer;
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
