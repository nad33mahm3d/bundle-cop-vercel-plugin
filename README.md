# Bundle Cop

Prevent Next.js bundle regressions on Vercel. Attribute cost to the importing file, enforce budgets, and report via Vercel Checks + GitHub.

**Repository:** [nad33mahm3d/bundle-cop-vercel-plugin](https://github.com/nad33mahm3d/bundle-cop-vercel-plugin)

## Packages

| Path | Package | Role |
|------|---------|------|
| `packages/vercel-plugin` | `bundle-cop-vercel-plugin` | Next.js Adapter (`modifyConfig` + `onBuildComplete`) |
| `.` (root) | `bundle-cop` | Marketplace integration app (setup, dashboard, webhooks) |
| `example` | `@bundle-cop/example` | Demo Next app that imports `moment` |

## Quick start

Published adapter: [`bundle-cop-vercel-plugin`](https://www.npmjs.com/package/bundle-cop-vercel-plugin)

```bash
pnpm add bundle-cop-vercel-plugin
```

```ts
// next.config.ts — requires Next.js 16+
import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const nextConfig: NextConfig = {
  adapterPath: require.resolve('bundle-cop-vercel-plugin/adapter'),
}

export default nextConfig
```

Optional project config — copy [`bundle-cop.config.example.json`](./bundle-cop.config.example.json) to `bundle-cop.config.json`.

## Integration app

```bash
pnpm dev
```

- `/` — landing
- `/setup` — default budgets / fail-on-over-budget
- `/dashboard` — history chart from private Blob reports
- `POST /api/webhooks/vercel` — deployment webhook → Checks + GitHub
- `GET /api/reports/[sha]` — fetch a report by commit SHA

### Bootstrap

Hosted on **NadeemAhmedPersonal** (`eboxnadeem-3937`):

- App: https://bundle-cop.vercel.app
- Project: `nadeem-ahmeds-projects-9ef48543/bundle-cop`
- Private Blob: `bundle-cop-reports`
- Webhook: `deployment.succeeded` → `/api/webhooks/vercel`

Still needed for Checks diffs:

1. **`VERCEL_TOKEN`** — https://vercel.com/account/tokens then `vercel env add VERCEL_TOKEN …` and redeploy
2. **GitHub App** (optional) — `GITHUB_APP_*` + `GITHUB_REPOSITORY`
3. **Marketplace Integration Console** (Phase C) — see `integration.json`

## Environment

Copy `.env.example` → `.env.local` (or `vercel env pull`):

| Variable | Purpose |
|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | Private Blob read/write for reports |
| `VERCEL_TOKEN` | Deployments + Checks API |
| `VERCEL_WEBHOOK_SECRET` | Verify webhook signatures |
| `GITHUB_APP_ID` / `GITHUB_APP_PRIVATE_KEY` / `GITHUB_APP_INSTALLATION_ID` | Optional GitHub Check Runs |
| `GITHUB_REPOSITORY` | `owner/repo` for Check Runs |

Bootstrap: `vercel link` → provision Blob → `vercel env pull --yes`.

## Publishing the npm package

`bundle-cop-vercel-plugin@0.1.0` is already on npm (manual publish).

Automated publishes run on **GitHub Release** via [`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml):

1. Add repo secret **`NPM_TOKEN`** (npm granular token with publish; prefer bypass-2FA for automation)
2. Create a release tagged **`v0.1.1`** (or higher — do not reuse `v0.1.0`)
3. CI sets the package version from the tag and runs `npm publish`

## Marketplace

See [`integration.json`](./integration.json) for the draft Integration Console manifest (`deployment`, `deployment-check`, `project`, `project-env-vars`).

## License

MIT
