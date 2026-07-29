# Deployment

The website is a Next.js App Router application packaged with Vinext as a Cloudflare
Worker for OpenAI Sites. It has no database, server-owned state, authentication,
uploads, environment variables, or third-party runtime services.

## Required runtime

- the Node.js version declared in `.nvmrc`; nvm is recommended but not required
- OpenAI Sites for the production deployment
- a Next.js-compatible runtime if using the optional compatibility build

## Build

```bash
npm ci
npm run check
npm run build
npm audit --omit=dev
```

`npm run build` creates the deployable Worker bundle in `dist/`. The optional
`npm run build:next` command verifies the application against the standard Next.js
compiler.

## Sites packaging

- `.openai/hosting.json` stores the opaque Sites project identifier after project
  creation.
- `vite.config.ts` configures Vinext and the Cloudflare build.
- `build/sites-vite-plugin.ts` emits the deployment manifest.
- `worker/index.ts` is the Worker entry point.

The generated `dist/` directory is archived for version creation and is not committed
to source control.

## Canonical settings

The canonical site URL and contact mailbox live in `content/site.ts`. Confirm both
values before moving the company to a new domain or mailbox.

## Public files

Brand, image, icon, and social-preview assets live under `public/`. Do not commit
build output to the repository.

## Privacy

No secrets are required. Do not add source-application credentials, athlete data,
private evaluation data, or production application links to environment variables or
deployment configuration for this public site.
