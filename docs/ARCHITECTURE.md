# Architecture

## Overview

The public site presents the Labs portfolio, Work and Sport domains, two product pages,
company philosophy and Motion resources. It uses Next.js App Router, React,
strict TypeScript, Tailwind and shared CSS. DigitalOcean serves the standard
Next.js build behind Nginx; Vinext/Cloudflare Worker packaging remains separate.
There is no website database, authentication, API, form backend, CMS or analytics.

## Routes and compatibility

| URL | Source / result |
| --- | --- |
| `/` | `app/page.tsx`: Labs portfolio and company contact |
| `/work` | `app/work/page.tsx`: individual capability, AI coordination and human judgment |
| `/sport` | `app/sport/page.tsx`: preserved former homepage narrative |
| `/motion` | `app/motion/page.tsx`: detailed Motion product page |
| `/botsquad` | `app/botsquad/page.tsx`: AI worker coordination product page |
| `/about` | `app/about/page.tsx`: company philosophy, real page |
| `/tutorial` | `app/tutorial/page.tsx`: progressive Motion guide |
| `/privacy`, `/support` | Motion policy and support articles |
| `/robots.txt`, `/sitemap.xml` | Generated metadata routes; nine canonical pages |
| `/story` | HTTP 308 to `/sport#story` |
| `/contact` | HTTP 308 to `/#contact` |
| `/why-asymmetrico` | HTTP 308 to `/about` |
| `/work/asymmetrico-platform` | HTTP 308 to `/sport` |

The apex canonical origin remains `https://asymmetri.co`, except for the preserved
`https://www.asymmetri.co/tutorial`. Both hosts serve the actual tutorial. No host
redirect or infrastructure change is introduced. Browsers do not send fragments
to the server: a small homepage-only component maps old root `#story`, `#approach`
and singular `#product` to the same fragment on `/sport`. Plural `#products` and
`#contact` stay on the Labs homepage. No-JavaScript visitors have explicit Sport links.

## Content, metadata and assets

`content/site.ts` remains the shared identity/contact/navigation source and owns
Sport's preserved narrative, Motion facts, tutorial content and Motion utility
articles. `site.ts` also supplies separate typed exports for Labs/Work/BotSquad/About copy,
Sport navigation, labelled concept images and approved video IDs/disclosures.
Product facts and external URLs stay in this central content source; page components
own composition and small connective passages.

`app/layout.tsx` supplies the shared metadata and Organization JSON-LD.
`lib/metadata.ts` supplies product/company/utility route metadata helpers. Product
SoftwareApplication JSON-LD includes no invented offers, ratings or download data.
Labs, Work, About and BotSquad use `public/images/labs-social.png` (1200×630); Sport uses
`public/images/sport-social.png`, a raster export of the retained `public/og.svg`.
Motion retains its approved raster icon. Existing logo/favicon/social assets remain.
The Sport photograph and tutorial files retain their stable URLs and original bytes.
All new and reused media are recorded in `ASSET_MANIFEST.md`.

## Rendering and interaction

Routes and shared structure are server components. Essential copy, navigation,
product diagrams and tutorial content are available in the initial HTML. Small
client components are limited to:

- `tutorial-reader.tsx`: the existing progressive guide and ephemeral branches;
- `legacy-home-fragments.tsx`: three moved homepage fragment destinations;
- `introduction-video.tsx`: explicit video loading and closing;
- `site-navigation.tsx`: Escape/outside-pointer dismissal for native domain disclosures.

The reusable video component initially renders a local HTML/CSS poster and a
normal external link. Clicking Load creates a fixed-ID `youtube-nocookie.com`
iframe, with no autoplay, no persisted consent, native controls and fullscreen.
It uses `strict-origin-when-cross-origin` so YouTube receives the required origin
referrer. It adds no API SDK, preconnect, remote thumbnail or visitor storage.
Google-controlled resources load only after activation and may process requests;
the public notice and policy explain this boundary. A close action restores the
poster and keyboard focus; the external fallback is always visible. Cross-origin
player errors are not reliably exposed to the parent, so the fallback does not
depend on error detection.

`SiteHeader` supplies a skip link and Work/Sport/About/Contact navigation.
Work and Sport use native exclusive `details` disclosures with overview and direct
product links. Enter/Space and navigation work without JavaScript; the small client
enhancement adds outside-pointer dismissal and Escape with focus restoration.
`SiteFooter` adds explicit product/company links and Motion resource labels.
`WorkerFlow` renders a compact ordered workflow in the BotSquad hero.
`WorkerExample` renders a labelled written task and ordered handoff
steps in its own section after the detailed BotSquad workflow;
`EvidenceChain` uses semantic HTML/CSS. `HomeCapability` and `HomeWorkerFlow`
present the restored `0c05c7b` homepage explanation in the current light list style.
The homepage retains the company introduction, principles, two product panels,
common principles and contact sequence. Shared navigation still exposes Work/Sport
and their products; the homepage restores its historical approach/story links.
Work restores its split hero with a short approach outline. About introduces the
company name before its principles and founder story. Colors and marketing copy
retain the September 29 editorial treatment.
Homepage copy lives in `labs`, including a homepage-only historical BotSquad
summary so the current product page remains unchanged. About's `labs.origin`
value is preserved. Root page metadata overrides the shared default and uses
`home-social.png`; other pages retain `labs-social.png`. The Motion icon and
approved evidence capture are restored on the homepage with their original labels.
`UtilityPage` remains a server-rendered article. No external fonts, UI library,
server state or new dependency is introduced.

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
- `package.json`, `package-lock.json`, `.nvmrc`: unchanged runtime/dependency contract.

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
- Next.js 16.2.12 requires Node.js 20.9.0 or newer;
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
