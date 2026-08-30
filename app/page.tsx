import { SiteShell } from '@/components/SiteChrome'
import { GITHUB_URL, NPM_URL } from '@/lib/site'

function ReportVisual() {
  return (
    <div className="report-visual" aria-hidden>
      <div className="report-chrome">
        <span />
        <span />
        <span />
        <em>bundle-report.json</em>
      </div>
      <div className="report-delta anim-pulse-soft">
        <strong>+340.2 kB</strong>
        <span>vs production (+18%)</span>
      </div>
      <div className="report-rows">
        <div className="report-row anim-rise" style={{ animationDelay: '120ms' }}>
          <code>moment</code>
          <span className="bar" style={{ width: '78%' }} />
          <b>+280kb</b>
        </div>
        <div className="report-row anim-rise" style={{ animationDelay: '220ms' }}>
          <code>lodash</code>
          <span className="bar" style={{ width: '42%' }} />
          <b>+96kb</b>
        </div>
        <div className="report-row anim-rise" style={{ animationDelay: '320ms' }}>
          <code>recharts</code>
          <span className="bar" style={{ width: '28%' }} />
          <b>+54kb</b>
        </div>
      </div>
      <p className="report-culprit anim-rise" style={{ animationDelay: '420ms' }}>
        Culprit: <code>components/DatePicker.tsx</code>
        <br />
        Suggestion: replace with <code>date-fns</code>
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <SiteShell landing>
      <section className="hero">
        <div className="hero-copy anim-rise">
          <p className="brand-kicker">Bundle Cop</p>
          <h1 className="hero-title">
            Catch bundle regressions before they ship.
          </h1>
          <p className="lead">
            Attribute every kilobyte to the importing file, enforce budgets at
            build time, and surface the culprit on every Vercel deploy.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="/docs">
              Read the docs
            </a>
            <a className="btn" href="/setup">
              Get started
            </a>
            <a className="btn btn-ghost" href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
        <div className="hero-visual anim-rise" style={{ animationDelay: '160ms' }}>
          <ReportVisual />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Zero-config on Vercel</h2>
        <p className="section-lead">
          Install the adapter, ship. Bundle Cop parses build output, diffs
          against production, and posts a Check with the biggest culprit and a
          replacement suggestion.
        </p>
        <pre className="code-block install-snippet">{`pnpm add bundle-cop-vercel-plugin`}</pre>
      </section>

      <section className="section features">
        <h2 className="section-title">What you get</h2>
        <div className="feature-grid">
          <article>
            <h3>Attribution</h3>
            <p>
              Know that <code>moment</code> landed because of{' '}
              <code>app/page.tsx</code> — not a vague chunk name.
            </p>
          </article>
          <article>
            <h3>Budgets</h3>
            <p>
              Warn or fail from <code>bundle-cop.config.json</code> before the
              merge hits production.
            </p>
          </article>
          <article>
            <h3>Deploy reports</h3>
            <p>
              Webhook + Checks on every ship, with optional Blob history on the
              dashboard.
            </p>
          </article>
        </div>
      </section>

      <section className="section cta-band">
        <h2 className="section-title">Open source, ready to install</h2>
        <p className="section-lead">
          MIT licensed. Published on npm as{' '}
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            bundle-cop-vercel-plugin
          </a>
          .
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/docs#install">
            Install guide
          </a>
          <a className="btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
            Star on GitHub
          </a>
        </div>
      </section>
    </SiteShell>
  )
}
