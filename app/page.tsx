import { SiteShell } from '@/components/SiteChrome'

export default function HomePage() {
  return (
    <SiteShell>
      <h1 className="brand">Bundle Cop</h1>
      <p className="lead">
        Catch Next.js bundle regressions before they hit production. Attribute
        cost to the importing file, enforce budgets, and report on every
        deployment.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary" href="/docs">
          Read the docs
        </a>
        <a className="btn" href="/setup">
          Get started
        </a>
        <a
          className="btn"
          href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
      <section className="panel">
        <h2>Zero-config on Vercel</h2>
        <p>
          Install the adapter, ship. Bundle Cop parses build output, diffs
          against production, and posts a Check with the biggest culprit and a
          replacement suggestion.
        </p>
      </section>
      <section className="panel">
        <h2>What you get</h2>
        <ul className="doc-list">
          <li>
            <strong>Attribution</strong> — e.g. <code>moment</code> imported by{' '}
            <code>app/page.tsx</code>
          </li>
          <li>
            <strong>Budgets</strong> — warn or fail the build from{' '}
            <code>bundle-cop.config.json</code>
          </li>
          <li>
            <strong>Deployment reports</strong> — webhook + Checks on every
            ship
          </li>
        </ul>
      </section>
    </SiteShell>
  )
}
