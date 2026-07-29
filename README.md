# Asymmetrico

Asymmetrico builds accessible sports technology that helps athletes, coaches, and
sports organizations see development more clearly and compete beyond their
resources.

The company name expresses asymmetric advantage: when resources are unequal,
smaller organizations need leverage rather than an imitation of professional-scale
spending. Asymmetrico creates that leverage through more accessible technology,
more useful information, and systems designed around real sports workflows.

## Website purpose

This repository contains the official Asymmetrico website. It:

- explains the company’s asymmetric-advantage thesis;
- presents the deployed Asymmetrico Platform;
- separates deployed work from emerging research and future direction;
- documents the company’s visual identity and asset provenance;
- provides a privacy-conscious public account of work originating in community
  baseball.

## Technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS with a custom CSS token layer
- Next.js image optimization and metadata APIs
- Vinext and Cloudflare Workers packaging for OpenAI Sites

The site uses server components by default and contains no analytics, third-party
scripts, form backend, database, authentication, or public athlete data.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial company story |
| `/work` | Deployed and emerging work |
| `/work/asymmetrico-platform` | Principal product case study |
| `/why-asymmetrico` | Meaning of the company name |
| `/about` | Technical origin and current focus |
| `/contact` | Direct company contact |

Next.js also generates `/robots.txt` and `/sitemap.xml`.

## Local development

Prerequisite: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL reported by Vinext.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

No environment variables are required for the public site.

## Editing content

Primary public copy, product facts, navigation, metadata, contact details, research
disclosures, and image descriptions live in:

```text
content/site.ts
```

Page composition lives under `app/`. Reusable editorial and product visuals live
under `components/`. Design tokens and responsive behavior live in
`app/globals.css`.

## Assets

- Brand assets: `public/brand/`
- Sports photography: `public/images/sports/`
- Research visuals: `public/images/research/`
- Social preview: `public/og.png`

Do not publish real athlete data, private evaluation content, source-organization
branding, or unverified product claims. Record every added or replaced asset in
`docs/ASSET_MANIFEST.md`.

## Documentation

- [Brand strategy](docs/BRAND_STRATEGY.md)
- [Site strategy](docs/SITE_STRATEGY.md)
- [Visual identity](docs/VISUAL_IDENTITY.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Deployment assumptions](docs/DEPLOYMENT.md)

## Deployment assumptions

The production build is packaged as a Cloudflare Worker for OpenAI Sites. A standard
Next.js build remains available as `npm run build:next` for compatibility checks.
The canonical site URL and public contact mailbox are centralized in
`content/site.ts`.
