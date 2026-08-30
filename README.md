# Bundle Cop

[![npm version](https://img.shields.io/npm/v/bundle-cop-vercel-plugin.svg)](https://www.npmjs.com/package/bundle-cop-vercel-plugin)
[![npm downloads](https://img.shields.io/npm/dm/bundle-cop-vercel-plugin.svg)](https://www.npmjs.com/package/bundle-cop-vercel-plugin)
[![CI publish](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/actions/workflows/publish-npm.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Prevent Next.js bundle regressions on Vercel. Attribute cost to the importing file, enforce budgets at build time, and report on deployments.

| Resource | Link |
|----------|------|
| **GitHub** | [nad33mahm3d/bundle-cop-vercel-plugin](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin) |
| **npm** | [bundle-cop-vercel-plugin](https://www.npmjs.com/package/bundle-cop-vercel-plugin) |
| **Live integration app** | [bundle-cop.vercel.app](https://bundle-cop.vercel.app) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **Issues** | [GitHub Issues](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/issues) |
| **Releases** | [GitHub Releases](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases) |

## Why Bundle Cop

Bundles grow silently — teams add `moment`, `lodash`, or heavy charts and only notice when LCP drops or bandwidth bills spike. Bundle Cop runs in the Next.js build, points at the **culprit file**, and can fail the build when budgets are exceeded.

## Packages

| Path | Package / app | Role |
|------|---------------|------|
| [`packages/vercel-plugin`](./packages/vercel-plugin) | [`bundle-cop-vercel-plugin`](https://www.npmjs.com/package/bundle-cop-vercel-plugin) | Next.js Adapter (`modifyConfig` + `onBuildComplete`) |
| Repo root | Integration app | Setup UI, dashboard, Vercel webhooks + Checks |
| [`example`](./example) | Demo Next app | Imports `moment` to verify attribution |

## Quick start (adapter)

Requires **Next.js 16+**.

```bash
pnpm add bundle-cop-vercel-plugin
```

```ts
// next.config.ts
import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const nextConfig: NextConfig = {
  adapterPath: require.resolve('bundle-cop-vercel-plugin/adapter'),
}

export default nextConfig
```

Optional budgets — copy [`bundle-cop.config.example.json`](./bundle-cop.config.example.json) to `bundle-cop.config.json`:

```json
{
  "budgets": [
    { "path": "/*", "maxSize": "250kb", "enforce": "warn" }
  ],
  "suggestions": true
}
```

After `next build`, inspect `bundle-report.json` in the project root.

### Prove it locally

```bash
pnpm install
pnpm build:plugin
pnpm --filter @bundle-cop/example build
# → example/bundle-report.json (moment attributed to app/page.tsx)
```

## Integration app

Hosted at [bundle-cop.vercel.app](https://bundle-cop.vercel.app) (Vercel team **NadeemAhmedPersonal**).

```bash
pnpm install
pnpm build:plugin
pnpm dev
```

| Route | Purpose |
|-------|---------|
| `/` | Product landing |
| `/setup` | Default budgets / fail-on-over-budget guidance |
| `/dashboard` | Bundle history chart (private Blob reports) |
| `POST /api/webhooks/vercel` | Deployment webhook → Checks (+ optional GitHub) |
| `GET /api/reports/[sha]` | Fetch a report by commit SHA |

### Environment

Copy [`.env.example`](./.env.example) → `.env.local` (or `vercel env pull`):

| Variable | Required | Purpose |
|----------|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | For Blob upload / dashboard | Private Blob read/write |
| `VERCEL_WEBHOOK_SECRET` | For webhooks | Verify Vercel webhook signatures |
| `VERCEL_TOKEN` | For Checks / prod diffs | Deployments + Checks API |
| `GITHUB_APP_ID` / `GITHUB_APP_PRIVATE_KEY` / `GITHUB_APP_INSTALLATION_ID` | Optional | GitHub Check Runs |
| `GITHUB_REPOSITORY` | Optional | `owner/repo` for Check Runs |

### Hosting bootstrap (already done for the public demo)

- Project: `nadeem-ahmeds-projects-9ef48543/bundle-cop`
- Private Blob store: `bundle-cop-reports`
- Webhook: `deployment.succeeded` → `/api/webhooks/vercel`

## Publishing to npm

Package name: **`bundle-cop-vercel-plugin`**

| Version | How |
|---------|-----|
| `0.1.0` | Manual first publish |
| `0.1.1+` | GitHub Release → [`.github/workflows/publish-npm.yml`](./.github/workflows/publish-npm.yml) |

**To ship a new version:**

1. Ensure repo secret **`NPM_TOKEN`** is set (Settings → Secrets → Actions)
2. Create a GitHub Release with tag `vX.Y.Z` (e.g. `v0.1.2`)
3. CI bumps the package version from the tag and runs `npm publish --access public`

npm metadata (`repository`, `bugs`, `homepage`, `license`) points at this GitHub repo so the package page links back to source.

## Marketplace (Phase C — pending)

Draft scopes and hooks live in [`integration.json`](./integration.json). Next step: create a **Connectable Account Integration** in the Vercel Integrations Console using:

- Redirect URL: `https://bundle-cop.vercel.app/setup`
- Webhook URL: `https://bundle-cop.vercel.app/api/webhooks/vercel`
- Configuration URL: `https://bundle-cop.vercel.app/dashboard`

## Development

```bash
pnpm install
pnpm build:plugin   # build adapter
pnpm typecheck
pnpm build          # adapter + integration app
pnpm --filter @bundle-cop/example build
```

Monorepo: pnpm workspaces (`packages/*`, `example`).

## License

[MIT](./LICENSE)
