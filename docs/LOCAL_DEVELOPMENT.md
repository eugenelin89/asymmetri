# Local development

## Prerequisites

- macOS or another environment that can run Node.js
- nvm or another Node.js version manager
- npm
- Git

The supported Node.js release is declared in `.nvmrc`. When nvm is available,
load it when necessary, then install and activate that release:

```bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install
nvm use
```

Confirm the active tools:

```bash
node --version
npm --version
```

If nvm is unavailable, activate the `.nvmrc` release with another version
manager. The important requirement is that `node --version` matches `.nvmrc`.

## Install

Use the committed lockfile:

```bash
npm ci
```

Use `npm install` only when intentionally changing dependencies. Review changes
to both `package.json` and `package-lock.json`.

The October 7 security baseline uses Next.js/eslint-config-next 16.3.6 and the
existing Sharp override at 0.35.5. React/React DOM remain 19.2.6. See the
[dependency security review](DEPENDENCY_SECURITY_2026-10-07.md) for advisory
paths, transitive lockfile updates and production Node 22 compatibility.

## Development server

```bash
npm run dev
```

Vinext reports the local URL and port. Open that exact URL rather than assuming
port 3000. The server supports normal source refresh during development.

The standard Next.js development server remains available for compatibility
diagnosis:

```bash
npm run dev:next
```

Do not run both servers on the same port.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Vinext development server used by the Sites build |
| `npm run dev:next` | Run the standard Next.js development server |
| `npm run check` | Run TypeScript and ESLint checks |
| `npm run typecheck` | Run strict TypeScript checking |
| `npm run lint` | Run ESLint |
| `npm run build` | Create the deployable Vinext Worker bundle in `dist/` |
| `npm run build:next` | Create the standard Next.js build used by DigitalOcean production |
| `npm run start` | Serve an existing Vinext build locally; this is not the DigitalOcean production command |
| `npm audit --omit=dev` | Check production dependencies for known issues |

DigitalOcean production uses `npm run build:next`, then systemd starts
`node_modules/.bin/next start` directly. See `docs/DEPLOYMENT.md`.

## Environment

The public site requires no environment variables. Do not add credentials,
private athlete information, production application URLs, or source-system
secrets to local environment files.

`.openai/hosting.json` contains the Sites project identifier. It is source
configuration, not an environment file or credential store.

## Editing workflow

1. Read `AGENTS.md` and the relevant documents under `docs/`.
2. Change shared identity, product facts, portfolio copy and approved video
   IDs/notices in the typed exports in `content/site.ts`.
3. Change route composition under `app/`.
4. Change shared visuals or structure under `components/`.
5. Update documentation and the asset manifest when their subject changes.
6. Run the checks described in `docs/TESTING.md`.
7. Follow the engineering-journal and two-commit policy in `AGENTS.md`.

## Troubleshooting

### Node engine warnings

Run `nvm use` when nvm is available, then compare `node --version` with
`.nvmrc` before changing a dependency or lockfile.

### Stale generated output

`dist/` and `.next/` are generated and ignored. A clean build replaces the
relevant output; do not commit either directory.

### Port already in use

Stop the prior development process or use the alternative port printed by the
development server. Do not scan unrelated ports.

### Wrangler output

Wrangler writes local logs under `.wrangler/`, which is ignored. Do not commit
those logs or copy credentials from them into documentation.

### `Cannot read properties of undefined (reading 'fetch')`

If the stack points to `worker/index.ts` and `/_vinext/image`, stop and restart
`npm run dev`. The Cloudflare Vite configuration declares the local `ASSETS`
and `IMAGES` bindings required by Vinext image optimization. A server that was
already running before a configuration update may need a full restart.


### Product-video checks

Product pages render local posters until Load video is activated. A fresh Network
panel should show no Google/YouTube resources before that action. Check the native
player and fallback afterwards. The iframe's origin referrer is intentional;
removing it can cause YouTube error 153. Do not add an SDK, remote thumbnail or
preconnect to solve playback failures. Cross-origin player errors are not reliably
observable by the parent, so the external link is always present.

## Isolated investment receiver

Install its separate lockfile with `npm --prefix receiver ci`; run `npm run receiver:test` and `npm run receiver:build`. No installation/build starts it. Runtime data must be private and outside checkout. Explicit configuration, manual startup and diagnostics are in [INVESTMENT_RECEIVER.md](INVESTMENT_RECEIVER.md). Tests use only disposable local keys/storage and synthetic data.

INV-02 advances the local repository security baseline to Next.js and
`eslint-config-next` 16.3.8, the minimal available patch outside the newly reported
16.0.0–16.3.7 audit range. This does not change the installed production version.

## INV-03 isolated archive views

The `/botsquad/investment` pages render an empty state by default. A private local
fixture can set `ASYMMETRI_INVESTMENT_READ_ORIGIN=http://127.0.0.1:PORT`,
`ASYMMETRI_INVESTMENT_EXPERIMENT`, `ASYMMETRI_INVESTMENT_RUN` and
`ASYMMETRI_INVESTMENT_EVIDENCE_MODE=synthetic_fixture`. Match receiver authority to
the origin. Never point a development UI at real private records. The [runbook](INV-03-OPERATIONS.md)
describes routes, safe formats and visibility. `npm run build:next -- --webpack`
is a supported local compatibility fallback when Turbopack's subprocess cannot
bind a local socket; record the default-build failure rather than hiding it.

## Disposable INV-04 showcase preview

Use Node from `.nvmrc` and install the existing root/receiver lockfiles. This is
explicit local tooling, never application startup or a production seed command:

```sh
npm run showcase:preview
# Another terminal:
ASYMMETRI_INVESTMENT_READ_ORIGIN=http://127.0.0.1:4318 \
ASYMMETRI_INVESTMENT_EXPERIMENT=fixture-experiment \
ASYMMETRI_INVESTMENT_RUN=fixture-run \
ASYMMETRI_INVESTMENT_EVIDENCE_MODE=synthetic_fixture \
npm run dev:next -- --webpack --hostname 127.0.0.1 --port 4317
```

Open `http://127.0.0.1:4317/botsquad/investment`. The launcher creates a new private
temporary database/content tree, signs and validates synthetic fixture batches,
then disables its publisher and revokes all ephemeral test keys. The loopback
adapter accepts GET only. Ctrl-C closes it and removes its disposable files.
There is no production data-directory argument and no operational credentials.

After `npm run receiver:build`, `node receiver/dist/test/showcase-preview.js --stale`
advances only the synthetic clock. `--empty` creates no published records. Test-only
stdin commands are `offline`, `online`, `fail-events`, `withdraw`, `reset` (expire
cursors) and `append`. Append briefly authorizes one in-memory local test key,
submits one signed synthetic activity, then revokes it in `finally`. These commands
are not HTTP endpoints and cannot target production. A withdrawn fixture is
monotonic; restart the disposable preview to obtain a fresh fixture.

Omit all `ASYMMETRI_INVESTMENT_*` values to verify the default unconfigured state.
Never set fixture variables on the operational deployment. Stop development before
production builds to avoid competing writes to `.next`; run `npm run build:next --
--webpack` if the documented Turbopack environment-permission failure occurs.
