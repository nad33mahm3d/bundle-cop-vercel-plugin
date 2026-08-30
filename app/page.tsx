import { SiteShell } from '@/components/SiteChrome'
import { FAQ_ITEMS, GITHUB_URL, NPM_URL } from '@/lib/site'

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
        <p className="eyebrow">Next.js bundle optimization for Vercel</p>
        <h1 className="hero-title">
          Optimize Next.js bundle size
          <br />
          before it hits production.
        </h1>
        <p className="lead">
          Bundle Cop helps you reduce client JS on Vercel: attribute every
          kilobyte to the importing file, enforce budgets at build time, and
          catch regressions on every deploy.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/docs">
            Get Started
          </a>
          <a
            className="btn btn-secondary"
            href="/guides/optimize-nextjs-bundle-vercel"
          >
            Optimization guide
          </a>
        </div>
      </section>

      <section className="hero-stage">
        <ReportVisual />
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">
            Vercel optimization that runs in the build
          </h2>
          <p className="section-lead">
            Install the adapter and ship. Bundle Cop parses Next.js build
            output on Vercel, diffs against production, and highlights the
            biggest culprit — so performance work is tied to a real file, not a
            vague chunk name.
          </p>
        </div>
        <pre className="code-block">{`pnpm add bundle-cop-vercel-plugin`}</pre>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Built for shipping on Vercel</h2>
          <p className="section-lead">
            Attribution, budgets, and deploy reports — without another dashboard
            to babysit.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature-cell">
            <h3>File-level attribution</h3>
            <p>
              Know that <code>moment</code> landed because of{' '}
              <code>app/page.tsx</code> when you optimize Next.js bundles.
            </p>
          </article>
          <article className="feature-cell">
            <h3>Bundle budgets</h3>
            <p>
              Warn or fail from <code>bundle-cop.config.json</code> before an
              oversize merge hits Vercel production.
            </p>
          </article>
          <article className="feature-cell">
            <h3>Deploy reports</h3>
            <p>
              Webhook + Checks on every ship so Vercel performance regressions
              surface in CI.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Common questions</h2>
          <p className="section-lead">
            Straight answers for teams searching how to optimize Next.js on
            Vercel.
          </p>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="section-lead" style={{ marginTop: '1.25rem' }}>
          Deep dive:{' '}
          <a href="/guides/optimize-nextjs-bundle-vercel">
            Optimize Next.js bundle size on Vercel
          </a>
          .
        </p>
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
          <a
            className="btn btn-secondary"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>
    </SiteShell>
  )
}
