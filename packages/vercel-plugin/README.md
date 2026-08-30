# bundle-cop-vercel-plugin

[![npm version](https://img.shields.io/npm/v/bundle-cop-vercel-plugin.svg)](https://www.npmjs.com/package/bundle-cop-vercel-plugin)
[![npm downloads](https://img.shields.io/npm/dm/bundle-cop-vercel-plugin.svg)](https://www.npmjs.com/package/bundle-cop-vercel-plugin)
[![license](https://img.shields.io/npm/l/bundle-cop-vercel-plugin.svg)](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/blob/main/LICENSE)
[![CI publish](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/actions/workflows/publish-npm.yml)

Next.js **adapter** that attributes client bundle cost to the importing source file and enforces size budgets during `next build`.

| | |
|---|---|
| **npm** | [bundle-cop-vercel-plugin](https://www.npmjs.com/package/bundle-cop-vercel-plugin) |
| **Source** | [nad33mahm3d/bundle-cop-vercel-plugin](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin) (`packages/vercel-plugin`) |
| **Changelog** | [CHANGELOG.md](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/blob/main/CHANGELOG.md) |
| **Issues** | [GitHub Issues](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/issues) |

Part of the [Bundle Cop](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin) monorepo (adapter + Vercel integration app).

## Requirements

- **Next.js 16+** (`adapterPath` / Adapters API)
- **Node.js 20+**

## Install

```bash
pnpm add bundle-cop-vercel-plugin
# npm i bundle-cop-vercel-plugin
# yarn add bundle-cop-vercel-plugin
```

## Setup

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

Use the **`/adapter`** export. Next loads adapters via `require.resolve` + ESM interop; the dedicated adapter entry exposes `onBuildComplete` correctly.

### Optional budgets

Create `bundle-cop.config.json` in the project root:

```json
{
  "budgets": [
    { "path": "/*", "maxSize": "250kb", "enforce": "warn" },
    { "path": "/dashboard", "maxSize": "400kb", "enforce": "error" }
  ],
  "ignore": [],
  "suggestions": true,
  "githubComment": true
}
```

- `enforce: "warn"` — logs over-budget routes  
- `enforce: "error"` — fails the build  

## What it does

On `onBuildComplete`:

1. Parses `.next` diagnostics when present; otherwise uses route/chunk fallbacks (Turbopack-friendly)
2. Attributes known heavy packages (e.g. `moment`, `lodash`) to the importing source file
3. Enforces budgets from `bundle-cop.config.json`
4. Writes `bundle-report.json` (and under `.vercel/output/static/` when possible)
5. Uploads a **private** Blob report when `BLOB_READ_WRITE_TOKEN` is set

## Environment (optional)

| Variable | Purpose |
|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | Upload private report to Vercel Blob |
| `VERCEL_GIT_COMMIT_SHA` / `GITHUB_SHA` | Report key (commit SHA) |

## Releases

Versions are published from GitHub Releases. Tag `vX.Y.Z` → CI publishes the same version to npm. See the [repo README](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin#publishing-the-npm-package).

## License

[MIT](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/blob/main/LICENSE)
