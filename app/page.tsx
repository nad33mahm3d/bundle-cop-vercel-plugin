export default function HomePage() {
  return (
    <main>
      <p className="nav">
        <a href="/setup">Setup</a>
        <a href="/dashboard">Dashboard</a>
      </p>
      <h1 className="brand">Bundle Cop</h1>
      <p className="lead">
        Catch Next.js bundle regressions before they hit production. Attribute
        cost to the importing file, enforce budgets, and report on every
        deployment.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary" href="/setup">
          Get started
        </a>
        <a
          className="btn"
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
        >
          View docs
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
    </main>
  )
}
