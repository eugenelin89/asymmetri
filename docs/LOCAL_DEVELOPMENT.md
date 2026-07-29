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
| `npm run build:next` | Run the standard Next.js compatibility build |
| `npm run start` | Serve an existing Vinext production build locally |
| `npm audit --omit=dev` | Check production dependencies for known issues |

## Environment

The public site requires no environment variables. Do not add credentials,
private athlete information, production application URLs, or source-system
secrets to local environment files.

`.openai/hosting.json` contains the Sites project identifier. It is source
configuration, not an environment file or credential store.

## Editing workflow

1. Read `AGENTS.md` and the relevant documents under `docs/`.
2. Change shared copy and facts in `content/site.ts`.
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
