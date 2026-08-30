# bundle-cop-vercel-plugin

Next.js adapter that attributes bundle cost to source files and enforces budgets during `next build`.

## Requirements

- Next.js **16+** (Adapters API / `adapterPath`)
- Node.js 20+

## Install

```bash
pnpm add bundle-cop-vercel-plugin
# or: npm i bundle-cop-vercel-plugin
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

Optional budgets — create `bundle-cop.config.json` in the project root:

```json
{
  "budgets": [
    { "path": "/*", "maxSize": "250kb", "enforce": "warn" }
  ],
  "suggestions": true
}
```

## What it does

On `onBuildComplete`:

1. Parses `.next` diagnostics / chunks (Turbopack-aware fallbacks)
2. Attributes heavy packages (e.g. `moment`) to the importing file
3. Checks budgets (`warn` or fail build on `error`)
4. Writes `bundle-report.json`
5. Uploads to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (`access: 'private'`)

## License

MIT
