# Architecture

## Overview

The Asymmetri Labs website is the company’s public marketing site. It explains
the baseball pitching focus, first product Asymmetri Motion, founder story,
Capture / Understand / Improve approach and how to contact the company.

The application uses Next.js 16 App Router, React 19, strict TypeScript, Tailwind
CSS, PostCSS, and a shared global stylesheet. The current DigitalOcean production
system runs the standard Next.js server behind Nginx. The repository also retains
a separate Vinext and Cloudflare Worker build path for OpenAI Sites.

The repository proves that the current site has:

- four indexed public content pages at `/`, `/motion`, `/privacy`, and `/support`;
- five homepage sections: hero, Story, Approach, Product and Contact;
- local brand, favicon, social-preview, and photography assets;
- configuration-driven permanent redirects from former routes;
- generated `/robots.txt` and `/sitemap.xml` responses;
- no database, authentication, API routes, form backend, uploads, analytics,
  visitor tracking, CMS, or server-side product business logic;
- no third-party runtime scripts or application-specific runtime environment
  variables for the public website.

## Product-level architecture

### Public page and sections

`app/page.tsx` composes the public homepage from five semantic sections:

1. The hero presents the company’s baseball technology position and the pitching
   photograph.
2. `#story` explains how smartphone video and later sensor experiments led to
   the company idea.
3. `#approach` presents Capture, Understand, and Improve.
4. `#product` introduces Motion and links to `/motion`; it follows the company
   narrative and precedes the closing contact section.
5. `#contact` closes with the company’s public email action.

`components/site-header.tsx` provides the skip link, homepage brand link, and
product and anchor navigation. `components/site-footer.tsx` provides the brand descriptor,
email link, Privacy and Support links, and copyright notice. Primary navigation
contains root-relative Story/Approach/Product/Contact homepage anchors in page
order, so it works from every route. The Product target is keyboard-focusable;
the existing header scroll padding keeps anchored content visible.

### Public routes

| URL | Source | Result |
| --- | --- | --- |
| `/` | `app/page.tsx` | Main public marketing page |
| `/motion` | `app/motion/page.tsx` | Detailed Motion product marketing page |
| `/privacy` | `app/privacy/page.tsx` | Asymmetri Motion Privacy Policy |
| `/support` | `app/support/page.tsx` | Asymmetri Motion Support |
| `/robots.txt` | `app/robots.ts` | Generated crawler rules and sitemap reference |
| `/sitemap.xml` | `app/sitemap.ts` | Generated sitemap containing all four canonical content routes |
| `/favicon.svg` | `public/favicon.svg` | Static SVG favicon |
| `/og.svg` | `public/og.svg` | Static 1200 by 630 social-preview image |
| `/story` | `next.config.ts` | Permanent redirect to `/#story` |
| `/contact` | `next.config.ts` | Permanent redirect to `/#contact` |
| `/about` | `next.config.ts` | Permanent redirect to `/#story` |
| `/work` | `next.config.ts` | Permanent redirect to `/` |
| `/why-asymmetrico` | `next.config.ts` | Permanent redirect to `/#story` |
| `/work/asymmetrico-platform` | `next.config.ts` | Permanent redirect to `/` |

Next.js uses HTTP 308 for these `permanent: true` redirects. `/`, `/motion`, `/privacy`, and
`/support` are listed in the generated sitemap. The existing apex canonical origin remains
`https://asymmetri.co`; the requested `www` URLs must also serve the actual pages.

### Content and metadata

`content/site.ts` is the primary editable source for:

- the company name, canonical URL, email address, and footer descriptor;
- navigation labels and destinations;
- page title, description, and social-preview text;
- all main homepage copy, the structured `motion` product content and typed
  Motion privacy/support sections;
- the public hero image path, dimensions, and alternative text.

`app/layout.tsx` consumes those values to configure:

- title and description metadata;
- canonical metadata;
- favicon and Apple touch icon references;
- Open Graph and X metadata;
- Organization JSON-LD;
- language, theme color, and color-scheme metadata.

`lib/metadata.ts` supplies route-specific utility titles, descriptions, canonicals,
and social metadata. `components/utility-page.tsx` renders the shared readable
article, section links, headings, lists, contact and related-page link. These are
server components and add no custom browser JavaScript.

`app/motion/page.tsx` supplies product title/description, canonical, Open Graph
and Twitter metadata plus factual SoftwareApplication JSON-LD. The schema includes
no price, offer, review, rating, download count or Store URL. Product social metadata
uses the approved raster Motion icon.

This keeps contact information and public facts out of presentation components.

### Assets

`public/brand/` stores the approved logo variants and raster icon fallbacks.
`public/images/` stores approved sports and research imagery at stable public
URLs. The homepage retains
`public/images/baseball/pitching-delivery.webp` and adds the approved Motion icon.
`public/brand/motion-pitcher.png` is the exact 1024-square packaged app icon used
on both marketing pages and in Motion social metadata. Next.js supplies optimized
page-image sizes. The former `motion-release.svg` and `motion-release.png` remain
unreferenced historical identity assets; the current illustration is raster artwork.

`public/favicon.svg` is served directly at `/favicon.svg`.
`public/og.svg` is the social-preview asset referenced by both Open Graph and X
metadata. `public/og.png` and several older image assets are retained but are not
currently referenced by the public page.

Asset provenance, dimensions, processing, public roles, and rights assessments
are recorded in `docs/ASSET_MANIFEST.md`.

### Static and server responsibilities

The homepage, product page, utility pages, robots response, and sitemap are generated from
repository content during the standard Next.js build. Static files remain under `public/` in the
production checkout and are served at their root-relative URLs.

The DigitalOcean deployment still requires a running Node.js process. The
standard Next.js production server:

- serves the built application;
- applies configured redirects;
- serves generated metadata routes;
- handles Next.js runtime requests and image optimization;
- listens only on `127.0.0.1:3001`.

There is no application-owned data store or long-running business process. The
Node.js server exists to serve the built Next.js application, not to run a
database, account system, form processor, or product API.

## Application architecture

### Rendering and components

The current React components are server components. No file contains a
`"use client"` directive, and the site does not require browser JavaScript for
application state or custom interaction. Navigation and contact actions use
normal links and `mailto:` URLs.

Shared components remain small:

- `Logo` renders the inline brand mark and optional wordmark.
- `SiteHeader` renders the skip link, brand link, and primary navigation.
- `SiteFooter` renders the brand descriptor and contact metadata.
- `HomePage` owns the five-section homepage composition.
- `MotionPage` composes the editorial product page.
- `EvidenceChain` renders a semantic six-stage ordered list from shared content.
- `UtilityPage` renders the two Motion utility articles.

See `docs/WEBSITE_PRIVACY_AUDIT.md` for source, browser and infrastructure
evidence, bounded hosting disclosure, and unresolved retention/mailbox facts.

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

### Important directories and files

```text
.
├── app/
│   ├── globals.css          Global design tokens and responsive presentation
│   ├── layout.tsx           Metadata, icons, JSON-LD, viewport, and root layout
│   ├── page.tsx             One-page public homepage composition
│   ├── privacy/page.tsx      Motion Privacy Policy
│   ├── support/page.tsx      Motion Support
│   ├── robots.ts            Generated robots.txt response
│   └── sitemap.ts           Generated sitemap.xml response
├── components/
│   ├── logo.tsx             Reusable brand mark and wordmark
│   ├── site-header.tsx      Skip link, brand link, and anchor navigation
│   ├── utility-page.tsx      Shared utility article presentation
│   └── site-footer.tsx      Descriptor, mailbox, utility links, and copyright
├── content/
│   └── site.ts              Typed public copy, facts, links, and image metadata
├── lib/metadata.ts          Utility route metadata helper
├── public/
│   ├── brand/               Approved logo and icon assets
│   ├── images/              Approved photography and retained research imagery
│   ├── favicon.svg          Primary favicon
│   └── og.svg               Active social-preview artwork
├── docs/                    Architecture, operations, strategy, tests, and journals
├── build/
│   └── sites-vite-plugin.ts OpenAI Sites manifest-copying build plugin
├── worker/
│   └── index.ts             Vinext Cloudflare Worker and image optimization entry
├── next.config.ts           Permanent redirect configuration
├── tailwind.config.ts       Tailwind content paths and theme extension
├── postcss.config.cjs       Tailwind and Autoprefixer pipeline
├── vite.config.ts           Vinext, Vite, Cloudflare, and Sites configuration
├── package.json             Dependencies and executable npm scripts
├── package-lock.json        Exact npm dependency graph
└── .nvmrc                   Repository Node.js major version
```

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
