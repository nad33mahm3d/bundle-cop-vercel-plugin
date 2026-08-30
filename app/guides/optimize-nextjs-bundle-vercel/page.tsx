import type { Metadata } from 'next'
import { SiteShell } from '@/components/SiteChrome'
import { FAQ_ITEMS, GITHUB_URL, NPM_URL, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Optimize Next.js Bundle Size on Vercel',
  description:
    'Practical guide: reduce Next.js bundle size on Vercel, catch regressions in CI, attribute cost to files, and enforce budgets with Bundle Cop.',
  keywords: [
    'optimize Next.js on Vercel',
    'reduce Next.js bundle size',
    'Vercel performance optimization',
    'Next.js bundle budget',
    'Next.js LCP bundle',
  ],
  alternates: { canonical: '/guides/optimize-nextjs-bundle-vercel' },
  openGraph: {
    title: 'Optimize Next.js Bundle Size on Vercel | Bundle Cop',
    description:
      'How to find and fix silent Next.js bundle growth on Vercel deployments.',
    url: `${SITE_URL}/guides/optimize-nextjs-bundle-vercel`,
    type: 'article',
  },
}

const howToLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Optimize Next.js bundle size on Vercel with Bundle Cop',
  description:
    'Install the adapter, set budgets, and catch bundle regressions on every Vercel deploy.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Install the adapter',
      text: 'pnpm add bundle-cop-vercel-plugin and set adapterPath in next.config.ts',
    },
    {
      '@type': 'HowToStep',
      name: 'Add bundle budgets',
      text: 'Create bundle-cop.config.json with maxSize and enforce warn or error',
    },
    {
      '@type': 'HowToStep',
      name: 'Deploy on Vercel',
      text: 'Ship to Vercel; review bundle-report.json and deployment Checks for culprits',
    },
  ],
}

export default function OptimizeGuidePage() {
  return (
    <SiteShell wide>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />

      <p className="eyebrow" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
        Guide
      </p>
      <h1 className="page-title">
        Optimize Next.js bundle size on Vercel
      </h1>
      <p className="lead" style={{ marginLeft: 0 }}>
        Search intent for &quot;Vercel optimization&quot; and &quot;reduce Next.js
        bundle size&quot; usually means one thing: stop silent JS growth before it
        hurts LCP and bandwidth. This guide shows how Bundle Cop fits that
        workflow.
      </p>

      <section className="panel doc-section">
        <h2>Why Vercel apps get heavier without anyone noticing</h2>
        <p>
          Next.js apps on Vercel ship a client JS payload on every deploy.
          Adding <code>moment</code>, full <code>lodash</code>, or a chart kit
          can add hundreds of kilobytes from a single import. Without a budget
          gate, the regression lands in production first.
        </p>
        <p>
          Bundle Cop runs in the Next.js build, attributes large modules to the
          importing file, and can fail the build when you set{' '}
          <code>enforce: &quot;error&quot;</code>.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>How to optimize Next.js bundles on Vercel</h2>
        <ol className="doc-list">
          <li>
            <strong>Measure on every deploy</strong> — install{' '}
            <a href={NPM_URL} target="_blank" rel="noreferrer">
              bundle-cop-vercel-plugin
            </a>{' '}
            and set <code>adapterPath</code> (see <a href="/docs#install">docs</a>
            ).
          </li>
          <li>
            <strong>Attribute the cost</strong> — read{' '}
            <code>bundle-report.json</code> to see which file imported the heavy
            module.
          </li>
          <li>
            <strong>Replace or tree-shake</strong> — e.g. <code>moment</code> →{' '}
            <code>date-fns</code>, prefer subpath imports for lodash/date-fns.
          </li>
          <li>
            <strong>Enforce a budget</strong> — add{' '}
            <code>bundle-cop.config.json</code> so over-budget PRs fail before
            merge.
          </li>
          <li>
            <strong>Diff vs production</strong> — use the integration webhook so
            each Vercel deployment reports the delta.
          </li>
        </ol>
      </section>

      <section className="panel doc-section">
        <h2>Queries this workflow answers</h2>
        <ul className="doc-list">
          <li>How do I optimize my Next.js app on Vercel?</li>
          <li>How do I reduce Next.js bundle size?</li>
          <li>How do I set a Next.js / Vercel bundle budget?</li>
          <li>What is causing my client JS to grow after deploy?</li>
          <li>webpack-bundle-analyzer alternative for Vercel CI?</li>
        </ul>
      </section>

      <section className="panel doc-section">
        <h2>FAQ</h2>
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} style={{ marginBottom: '1.25rem' }}>
            <h3
              style={{
                margin: '0 0 0.4rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {item.question}
            </h3>
            <p style={{ margin: 0 }}>{item.answer}</p>
          </div>
        ))}
      </section>

      <section className="panel doc-section">
        <h2>Next steps</h2>
        <p>
          Read the <a href="/docs">full docs</a>, configure{' '}
          <a href="/setup">setup defaults</a>, or star the project on{' '}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </section>
    </SiteShell>
  )
}
