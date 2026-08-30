import { SiteShell } from '@/components/SiteChrome'
import { GITHUB_URL, NPM_URL } from '@/lib/site'

function ReportVisual() {
  return (
    <div className="report-visual" aria-hidden>
      <div className="report-chrome">
        <div className="report-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="report-filename">bundle-report.json</span>
      </div>
      <div className="report-body">
        <div className="report-delta">
          <strong>+340.2 kB</strong>
          <span>vs production · +18%</span>
        </div>
        <div className="report-rows">
          <div className="report-row">
            <code>moment</code>
            <span className="bar" style={{ width: '78%' }} />
            <b>+280kb</b>
          </div>
          <div className="report-row">
            <code>lodash</code>
            <span className="bar" style={{ width: '42%' }} />
            <b>+96kb</b>
          </div>
          <div className="report-row">
            <code>recharts</code>
            <span className="bar" style={{ width: '28%' }} />
            <b>+54kb</b>
          </div>
        </div>
        <p className="report-culprit">
          Culprit <code>components/DatePicker.tsx</code>
          <span> → replace with </span>
          <code>date-fns</code>
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <SiteShell landing>
      <section className="hero">
        <p className="eyebrow">Next.js adapter · Vercel integration</p>
        <h1 className="hero-title">
          Catch bundle regressions
          <br />
          before they ship.
        </h1>
        <p className="lead">
          Attribute every kilobyte to the importing file, enforce budgets at
          build time, and surface the culprit on every deploy.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/docs">
            Get Started
          </a>
          <a className="btn btn-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </section>

      <section className="hero-stage">
        <ReportVisual />
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Zero-config on Vercel</h2>
          <p className="section-lead">
            Install the adapter and ship. Bundle Cop parses build output, diffs
            against production, and posts a Check with the biggest culprit.
          </p>
        </div>
        <pre className="code-block">{`pnpm add bundle-cop-vercel-plugin`}</pre>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Built for shipping</h2>
          <p className="section-lead">
            The same clarity you expect from the Vercel workflow — attribution,
            budgets, and deploy reports without another dashboard to babysit.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature-cell">
            <h3>Attribution</h3>
            <p>
              Know that <code>moment</code> landed because of{' '}
              <code>app/page.tsx</code> — not a vague chunk name.
            </p>
          </article>
          <article className="feature-cell">
            <h3>Budgets</h3>
            <p>
              Warn or fail from <code>bundle-cop.config.json</code> before the
              merge hits production.
            </p>
          </article>
          <article className="feature-cell">
            <h3>Deploy reports</h3>
            <p>
              Webhook + Checks on every ship, with optional Blob history on the
              dashboard.
            </p>
          </article>
        </div>
      </section>

      <section className="section cta-band">
        <div className="section-head">
          <h2 className="section-title">Open source. Ready to install.</h2>
          <p className="section-lead">
            MIT licensed. Published on npm as{' '}
            <a href={NPM_URL} target="_blank" rel="noreferrer">
              bundle-cop-vercel-plugin
            </a>
            .
          </p>
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href="/docs#install">
            Install guide
          </a>
          <a className="btn btn-secondary" href="/setup">
            Configure setup
          </a>
        </div>
      </section>
    </SiteShell>
  )
}
