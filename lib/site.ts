export const SITE_URL = 'https://bundle-cop.vercel.app'
export const SITE_NAME = 'Bundle Cop'

/** Primary meta description — matches how people search */
export const SITE_DESCRIPTION =
  'Optimize Next.js bundle size on Vercel. Bundle Cop catches regressions before production, attributes cost to the importing file, enforces budgets, and reports on every deploy.'

export const SITE_TITLE =
  'Bundle Cop | Optimize Next.js Bundle Size on Vercel'

export const GITHUB_URL =
  'https://github.com/nad33mahm3d/bundle-cop-vercel-plugin'
export const NPM_URL = 'https://www.npmjs.com/package/bundle-cop-vercel-plugin'

/** Intent-aligned keywords (meta + content planning) */
export const SITE_KEYWORDS = [
  'optimize Next.js bundle size',
  'Vercel bundle optimization',
  'Next.js performance on Vercel',
  'reduce Next.js bundle size',
  'Next.js bundle budget',
  'prevent bundle regressions',
  'Vercel deployment check bundle',
  'Next.js webpack bundle analyzer',
  'Turbopack bundle size',
  'Next.js LCP optimization',
  'attribute bundle size to file',
  'bundle-cop-vercel-plugin',
  'Next.js 16 adapter',
]

export const FAQ_ITEMS = [
  {
    question: 'How do I optimize Next.js bundle size on Vercel?',
    answer:
      'Install bundle-cop-vercel-plugin, point Next.js adapterPath at the adapter, and deploy. Bundle Cop analyzes build output on Vercel, attributes large modules to the importing file, and can fail the build when budgets are exceeded.',
  },
  {
    question: 'What causes Next.js bundles to grow on Vercel?',
    answer:
      'Heavy dependencies such as moment, lodash, or chart libraries often land through a single import. Without attribution, teams only notice after slower LCP or higher bandwidth. Bundle Cop shows the culprit file on every deploy.',
  },
  {
    question: 'Is Bundle Cop a webpack-bundle-analyzer alternative for Vercel?',
    answer:
      'Yes for shipping workflows. Instead of a local analyzer UI only, Bundle Cop runs in the Next.js build, writes bundle-report.json, diffs against production, and can post Vercel Checks so regressions are caught in CI.',
  },
  {
    question: 'Can I enforce a Next.js bundle budget on deploy?',
    answer:
      'Yes. Add bundle-cop.config.json with path budgets and set enforce to warn or error. Error fails the build when the client bundle exceeds your limit.',
  },
]
