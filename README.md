# Bundle Cop

[![npm version](https://img.shields.io/npm/v/bundle-cop-vercel-plugin.svg)](https://www.npmjs.com/package/bundle-cop-vercel-plugin)
[![npm downloads](https://img.shields.io/npm/dm/bundle-cop-vercel-plugin.svg)](https://www.npmjs.com/package/bundle-cop-vercel-plugin)
[![CI publish](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/actions/workflows/publish-npm.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Prevent Next.js bundle regressions on Vercel. Attribute cost to the importing file, enforce budgets at build time, and report on deployments.

| Resource | Link |
|----------|------|
| **Docs (website)** | [bundle-cop.vercel.app/docs](https://bundle-cop.vercel.app/docs) |
| **Optimization guide** | [Optimize Next.js on Vercel](https://bundle-cop.vercel.app/guides/optimize-nextjs-bundle-vercel) |
| **llms.txt** | [bundle-cop.vercel.app/llms.txt](https://bundle-cop.vercel.app/llms.txt) |
| **Sitemap** | [bundle-cop.vercel.app/sitemap.xml](https://bundle-cop.vercel.app/sitemap.xml) |
| **GitHub** | [nad33mahm3d/bundle-cop-vercel-plugin](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin) |
| **npm** | [bundle-cop-vercel-plugin](https://www.npmjs.com/package/bundle-cop-vercel-plugin) |
| **Live app** | [bundle-cop.vercel.app](https://bundle-cop.vercel.app) |
| **Privacy** | [Privacy Policy](https://bundle-cop.vercel.app/privacy) |
| **EULA** | [EULA](https://bundle-cop.vercel.app/eula) |
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

## Docs

Full product docs live on the website (not only in this README):

**[https://bundle-cop.vercel.app/docs](https://bundle-cop.vercel.app/docs)**

Quick install:

```bash
pnpm add bundle-cop-vercel-plugin
```

```ts
// next.config.ts — Next.js 16+
import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const nextConfig: NextConfig = {
  adapterPath: require.resolve('bundle-cop-vercel-plugin/adapter'),
}

export default nextConfig
```

Optional budgets: copy [`bundle-cop.config.example.json`](./bundle-cop.config.example.json) → `bundle-cop.config.json`.

### Local monorepo

```bash
pnpm install
pnpm build:plugin
pnpm --filter @bundle-cop/example build
pnpm dev   # integration app
```

### Hosting

- App: [bundle-cop.vercel.app](https://bundle-cop.vercel.app)
- Team / project: `nadeem-ahmeds-projects-9ef48543` / `bundle-cop`
- Connected to this GitHub repo for production auto-deploy on `main`

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

Draft scopes and hooks live in [`integration.json`](./integration.json). Console URLs:

- Redirect: `https://bundle-cop.vercel.app/setup`
- Webhook: `https://bundle-cop.vercel.app/api/webhooks/vercel`
- Configuration: `https://bundle-cop.vercel.app/dashboard`
- Docs / Privacy / EULA: `/docs`, `/privacy`, `/eula` on the same host

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
