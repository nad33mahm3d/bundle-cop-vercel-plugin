import type { Metadata } from 'next'
import { SiteShell } from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bundle Cop handles data for the integration and adapter.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      <h1 className="brand page-title">Privacy Policy</h1>
      <p className="lead">Last updated: August 31, 2026</p>

      <section className="panel doc-section">
        <h2>Who we are</h2>
        <p>
          Bundle Cop (&quot;we&quot;) provides a Next.js build adapter (
          <code>bundle-cop-vercel-plugin</code>) and a Vercel integration app
          hosted at <code>bundle-cop.vercel.app</code>.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>What we collect</h2>
        <ul className="doc-list">
          <li>
            <strong>Bundle reports</strong> — module names, sizes, routes, and
            commit SHA metadata uploaded to private Vercel Blob when you enable
            the adapter and Blob token. We do <em>not</em> upload source maps or
            full source code.
          </li>
          <li>
            <strong>Deployment webhooks</strong> — event payloads from Vercel
            (deployment IDs, project IDs, commit SHAs) needed to diff and post
            Checks.
          </li>
          <li>
            <strong>Integration OAuth</strong> — when you connect the
            integration, Vercel may send install codes and configuration IDs so
            we can obtain scoped API access you authorize.
          </li>
        </ul>
      </section>

      <section className="panel doc-section">
        <h2>How we use data</h2>
        <p>
          Data is used only to generate bundle reports, enforce budgets, show
          the dashboard, and create deployment Checks or comments you enable.
          We do not sell personal data.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>Storage &amp; retention</h2>
        <p>
          Reports live in a private Vercel Blob store tied to the project. You
          can delete the store or revoke tokens at any time via Vercel. Local
          builds write <code>bundle-report.json</code> only on your machine or
          CI.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>Third parties</h2>
        <p>
          Hosting and storage run on Vercel. Optional GitHub App features send
          Check Run data to GitHub under your installation. See their privacy
          policies for platform-level processing.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>Contact</h2>
        <p>
          Questions:{' '}
          <a href="mailto:ebox.nadeem@gmail.com">ebox.nadeem@gmail.com</a> or{' '}
          <a href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/issues">
            open a GitHub issue
          </a>
          .
        </p>
      </section>
    </SiteShell>
  )
}
