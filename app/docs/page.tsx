import type { Metadata } from 'next'
import { SiteShell } from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: 'Docs — Install & configure Next.js bundle optimization',
  description:
    'Install Bundle Cop on Next.js, configure bundle budgets, and wire the Vercel integration for deploy-time optimization reports.',
  alternates: { canonical: '/docs' },
}

export default function DocsPage() {
  return (
    <SiteShell wide>
      <h1 className="brand page-title">Docs</h1>
      <p className="lead">
        Install and configure Bundle Cop to optimize Next.js bundle size on
        Vercel — budgets, attribution, and deploy reports.
      </p>

      <nav className="docs-toc panel">
        <h2>On this page</h2>
        <ul className="doc-list">
          <li>
            <a href="#install">Install the adapter</a>
          </li>
          <li>
            <a href="#config">Budgets config</a>
          </li>
          <li>
            <a href="#local">Prove it locally</a>
          </li>
          <li>
            <a href="#integration">Integration app</a>
          </li>
          <li>
            <a href="#env">Environment variables</a>
          </li>
          <li>
            <a href="#publish">Publishing</a>
          </li>
          <li>
            <a href="#links">Links</a>
          </li>
          <li>
            <a href="/guides/optimize-nextjs-bundle-vercel">
              Optimization guide
            </a>
          </li>
        </ul>
      </nav>

      <section id="install" className="panel doc-section">
        <h2>Install the adapter</h2>
        <p>
          Requires <strong>Next.js 16+</strong>. Package:{' '}
          <a
            href="https://www.npmjs.com/package/bundle-cop-vercel-plugin"
            target="_blank"
            rel="noreferrer"
          >
            bundle-cop-vercel-plugin
          </a>
          .
        </p>
        <pre className="code-block">{`pnpm add bundle-cop-vercel-plugin`}</pre>
        <p>
          Point Next.js at the adapter in <code>next.config.ts</code>:
        </p>
        <pre className="code-block">{`import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const nextConfig: NextConfig = {
  adapterPath: require.resolve('bundle-cop-vercel-plugin/adapter'),
}

export default nextConfig`}</pre>
        <p>
          After <code>next build</code>, inspect <code>bundle-report.json</code>{' '}
          in the project root.
        </p>
      </section>

      <section id="config" className="panel doc-section">
        <h2>Budgets config</h2>
        <p>
          Optional. Copy{' '}
          <code>bundle-cop.config.example.json</code> to{' '}
          <code>bundle-cop.config.json</code>:
        </p>
        <pre className="code-block">{`{
  "budgets": [
    { "path": "/*", "maxSize": "250kb", "enforce": "warn" },
    { "path": "/dashboard", "maxSize": "400kb", "enforce": "error" }
  ],
  "ignore": ["node_modules/**/locales/**"],
  "githubComment": true,
  "suggestions": true
}`}</pre>
        <ul className="doc-list">
          <li>
            <code>enforce: &quot;warn&quot;</code> — log only
          </li>
          <li>
            <code>enforce: &quot;error&quot;</code> — fail the build when over budget
          </li>
          <li>
            <code>suggestions</code> — suggest lighter alternatives (e.g. date-fns
            for moment)
          </li>
        </ul>
      </section>

      <section id="local" className="panel doc-section">
        <h2>Prove it locally</h2>
        <p>
          The monorepo <code>example/</code> app imports <code>moment</code> so
          you can verify attribution:
        </p>
        <pre className="code-block">{`pnpm install
pnpm build:plugin
pnpm --filter @bundle-cop/example build
# → example/bundle-report.json (moment → app/page.tsx)`}</pre>
      </section>

      <section id="integration" className="panel doc-section">
        <h2>Integration app</h2>
        <p>
          This site (<a href="https://bundle-cop.vercel.app">bundle-cop.vercel.app</a>)
          hosts setup, dashboard, and webhooks for the Vercel integration.
        </p>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="/">/</a>
              </td>
              <td>Product landing</td>
            </tr>
            <tr>
              <td>
                <a href="/docs">/docs</a>
              </td>
              <td>Full documentation (this page)</td>
            </tr>
            <tr>
              <td>
                <a href="/setup">/setup</a>
              </td>
              <td>Default budgets / fail-on-over-budget guidance</td>
            </tr>
            <tr>
              <td>
                <a href="/dashboard">/dashboard</a>
              </td>
              <td>Bundle history from private Blob reports</td>
            </tr>
            <tr>
              <td>
                <code>POST /api/webhooks/vercel</code>
              </td>
              <td>Deployment webhook → Checks</td>
            </tr>
            <tr>
              <td>
                <code>GET /api/reports/[sha]</code>
              </td>
              <td>Fetch a report by commit SHA</td>
            </tr>
            <tr>
              <td>
                <a href="/privacy">/privacy</a>
              </td>
              <td>Privacy Policy</td>
            </tr>
            <tr>
              <td>
                <a href="/eula">/eula</a>
              </td>
              <td>End User License Agreement</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="env" className="panel doc-section">
        <h2>Environment variables</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Required</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>BLOB_READ_WRITE_TOKEN</code>
              </td>
              <td>Blob / dashboard</td>
              <td>Private Blob read/write</td>
            </tr>
            <tr>
              <td>
                <code>VERCEL_WEBHOOK_SECRET</code>
              </td>
              <td>Webhooks</td>
              <td>Verify Vercel webhook signatures</td>
            </tr>
            <tr>
              <td>
                <code>VERCEL_TOKEN</code>
              </td>
              <td>Checks / diffs</td>
              <td>Deployments + Checks API</td>
            </tr>
            <tr>
              <td>
                <code>GITHUB_APP_*</code>
              </td>
              <td>Optional</td>
              <td>GitHub Check Runs</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="publish" className="panel doc-section">
        <h2>Publishing</h2>
        <p>
          npm releases ship from GitHub Releases. Tag <code>vX.Y.Z</code> → CI
          publishes <code>bundle-cop-vercel-plugin</code>.
        </p>
        <ol className="doc-list">
          <li>
            Ensure repo secret <code>NPM_TOKEN</code> is set
          </li>
          <li>
            Create a GitHub Release with tag <code>vX.Y.Z</code>
          </li>
          <li>Actions bumps version and runs <code>npm publish</code></li>
        </ol>
      </section>

      <section id="links" className="panel doc-section">
        <h2>Links</h2>
        <ul className="doc-list">
          <li>
            <a
              href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin"
              target="_blank"
              rel="noreferrer"
            >
              Source on GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.npmjs.com/package/bundle-cop-vercel-plugin"
              target="_blank"
              rel="noreferrer"
            >
              npm package
            </a>
          </li>
          <li>
            <a
              href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/issues"
              target="_blank"
              rel="noreferrer"
            >
              Issues
            </a>
          </li>
          <li>
            <a
              href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases"
              target="_blank"
              rel="noreferrer"
            >
              Releases
            </a>
          </li>
          <li>
            <a href="/privacy">Privacy Policy</a> · <a href="/eula">EULA</a>
          </li>
        </ul>
      </section>
    </SiteShell>
  )
}
