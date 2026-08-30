# Bundle Cop - Vercel Marketplace Plugin
# PRD + Technical Build Plan for Cursor

> Copy this file into your repo as `cursor.md` or `BUNDLE_COP_SPEC.md` and paste into Cursor Agent mode.

---

## 0. GOAL
Build a Vercel Marketplace Build Plugin that prevents Next.js bundle regressions.
Name: `bundle-cop`
NPM: `@bundle-cop/vercel-plugin`

## 1. PRODUCT DEFINITION

### Problem
Next.js bundles grow silently. Teams add `moment`, `lodash`, heavy charts and only notice when Vercel bandwidth bill spikes or LCP drops.

### Solution
A Build Plugin + Deployment Integration hybrid:
1. During `vercel build`, parse `.next` webpack stats
2. Attribute cost to user file: "moment (+280kb) imported by components/DatePicker.tsx:4"
3. Diff vs production deployment
4. Enforce budgets from `bundle-cop.config.json`
5. Report via Vercel Deployment Comments + GitHub Checks

### Success Criteria
- Adds < 3s to build time
- Zero-config works out of the box
- Passes Vercel Marketplace review (uses @vercel/geist, no external dashboard required)

## 2. ARCHITECTURE

```
User Installs from Marketplace
           |
           v
[Build Plugin: onBuildComplete]
  - Reads .next/analyze/client.json + .next/build-manifest.json
  - Creates bundle-report.json (modules, chunks, routes, total)
  - Uploads to Vercel Blob: bundle-reports/{COMMIT_SHA}.json
           |
           v
[Webhook: deployment.succeeded -> /api/webhooks/vercel]
  - Fetch current report from Blob
  - Fetch prod report via Vercel API: GET /v6/deployments?target=production
  - Diff, run attribution + suggestions
  - POST comment to Vercel Deployment + GitHub Check Run
```

## 3. PROJECT STRUCTURE (Cursor should create this)

```
bundle-cop/
├── integration.json              # Vercel Integration manifest
├── package.json
├── vercel.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Landing for marketplace
│   ├── setup/
│   │   └── page.tsx              # Onboarding UI - uses @vercel/geist
│   ├── dashboard/
│   │   └── page.tsx              # Bundle history chart from Blob
│   └── api/
│       ├── webhooks/vercel/route.ts
│       └── reports/[sha]/route.ts
├── packages/
│   └── vercel-plugin/
│       ├── package.json          # name: @bundle-cop/vercel-plugin
│       ├── src/
│       │   ├── index.ts          # exports onBuildComplete
│       │   ├── parser.ts         # parse webpack stats
│       │   ├── attribution.ts    # issuerPath -> culprit file
│       │   ├── budgets.ts        # check bundle-cop.config.json
│       │   └── uploader.ts       # upload to Blob
│       └── tsconfig.json
└── bundle-cop.config.example.json
```

## 4. TECHNICAL SPEC

### 4.1 integration.json

```json
{
  "slug": "bundle-cop",
  "name": "Bundle Cop",
  "description": "Prevent bundle regressions. Attribute cost to files and enforce budgets.",
  "scopes": ["deployment:read", "project:read", "blob:readwrite", "comment:write"],
  "hooks": ["deployment.succeeded", "project.created"],
  "buildPlugins": ["@bundle-cop/vercel-plugin"],
  "uiHooks": [
    { "path": "/setup", "type": "setup" },
    { "path": "/dashboard", "type": "dashboard" }
  ]
}
```

### 4.2 Build Plugin: packages/vercel-plugin/src/index.ts

REQUIREMENTS FOR CURSOR:
- Export `onBuildComplete` and `onBuildStart`
- In `onBuildStart`, check if .next/analyze exists. If not, set env var to force Next.js to generate stats. Do NOT modify user's next.config.js directly. Inject via `NEXT_ANALYZE=true` or write temporary next.config wrapper.
- In `onBuildComplete`:
  1. Load `.next/analyze/client.json` - if missing, fallback to `.next/build-manifest.json` + `.next/app-build-manifest.json` and estimate via `/.next/static/chunks` file sizes.
  2. Call `parseStats(stats)` -> returns `Report { totalBytes, modules: { name, size, issuerPath }[], chunks: { name, size, route }[] }`
  3. Load `bundle-cop.config.json` from project root if exists.
  4. Check budgets. If enforce=error and exceeded, throw Error to fail build.
  5. Write `.vercel/output/static/bundle-report.json` for debugging.
  6. Upload to Blob using `@vercel/blob` put(`bundle-reports/${process.env.VERCEL_GIT_COMMIT_SHA}.json`)

- MUST be <3s. Use async file reads, no heavy deps in build plugin. Bundle `webpack-bundle-analyzer` parser logic, not full UI.

### 4.3 Attribution Engine: attribution.ts

This is critical. Implement:

```ts
export function findCulprit(module: WebpackModule): { culpritFile: string, chain: string[] } {
  // module.issuerPath = [ { name: 'moment', path: 'node_modules/moment/moment.js' }, { name: './DatePicker', path: 'components/DatePicker.tsx' } ]
  // Walk issuerPath backwards until first file NOT in node_modules and NOT in .next
  // Return that file as culprit
}

export function suggestAlternative(moduleName: string): string | null {
  const MAP = {
    'moment': 'date-fns (save ~270kb) -> npm i date-fns',
    'lodash': 'lodash-es + tree-shake or individual imports',
    'react-icons': 'import directly: react-icons/fa/FaIcon',
    'date-fns': 'use subpath imports: date-fns/format',
  }
  // Match by prefix
}
```

### 4.4 Diff + Report API: app/api/webhooks/vercel/route.ts

1. Verify webhook signature using `VERCEL_WEBHOOK_SECRET`
2. Get deployment id from payload
3. Fetch current report from Blob: `bundle-reports/${commitSha}.json`
4. Fetch production deployment report:
   `fetch https://api.vercel.com/v6/deployments?projectId=${projectId}&target=production&limit=1` with `Authorization: Bearer ${VERCEL_TOKEN}`
5. Diff modules:
   `delta = current.total - prod.total`
   `newLargeModules = current.modules.filter(m => m.size > 50kb && !prod.modules.find(p => p.name === m.name))`
6. Generate markdown comment:
   ```
   ### Bundle Cop Report
   **+340.2 kB** vs production (+18%)
   **Total:** 1.2MB -> 1.54MB
   **Biggest culprit:** `moment` (+280kb) imported by `components/DatePicker.tsx:4`
   **Suggestion:** Replace...
   ```
7. Post to Vercel: `POST https://api.vercel.com/v1/deployments/{id}/comments` 
8. Post to GitHub: Use GitHub App installation token to create Check Run

### 4.5 Config File: bundle-cop.config.json

```json
{
  "$schema": "https://bundle-cop.dev/schema.json",
  "budgets": [
    { "path": "/*", "maxSize": "250kb", "enforce": "warn" },
    { "path": "/dashboard", "maxSize": "400kb", "enforce": "error" }
  ],
  "ignore": ["node_modules/**/locales/**"],
  "githubComment": true,
  "suggestions": true
}
```

## 5. UI REQUIREMENTS

- Use `@vercel/geist` components only (Button, Card, Code, etc.) - required for Marketplace approval
- Setup page: Connect GitHub checkbox, default budget input, toggle "Fail build if over budget"
- Dashboard page: Recharts line chart of bundle size over last 30 deployments. Data from Blob list.

## 6. EDGE CASES CURSOR MUST HANDLE

1. Turborepo: .next may be at `apps/web/.next` - search recursively for `.next` folder
2. App Router + Pages Router: parse both manifests
3. PNPM: resolve symlink realpath for node_modules attribution
4. No stats file: fallback to reading `.next/static/chunks/*.js` file sizes
5. Security: NEVER upload source maps or full module code to Blob. Only names + sizes.

## 7. DEV WORKFLOW FOR CURSOR

Implement in order:
1. Create `packages/vercel-plugin` with onBuildComplete that writes dummy JSON
2. Test locally: `vercel build` in example Next.js app
3. Implement parser.ts + attribution.ts
4. Create Blob uploader
5. Create Next.js integration app (app/api/webhooks)
6. Add GitHub App integration for PR comments

## 8. TESTING

Create `example/` folder with a Next.js app that imports `moment` to test attribution.
Run `npm run build` and verify `bundle-report.json` shows `moment` -> `example/app/page.tsx`

## 9. MARKETPLACE SUBMISSION CHECKLIST

- [ ] Geist UI
- [ ] No env var leak
- [ ] Screencast GIF (build + PR comment)
- [ ] README with install steps
- [ ] Support email in integration.json

END OF SPEC
