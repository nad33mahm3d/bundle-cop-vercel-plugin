import type { Metadata } from 'next'
import { SiteShell } from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: 'EULA',
  description: 'End User License Agreement for Bundle Cop.',
  alternates: { canonical: '/eula' },
}

export default function EulaPage() {
  return (
    <SiteShell>
      <h1 className="brand page-title">End User License Agreement</h1>
      <p className="lead">Last updated: August 31, 2026</p>

      <section className="panel doc-section">
        <h2>License</h2>
        <p>
          Bundle Cop software (the npm package{' '}
          <code>bundle-cop-vercel-plugin</code>, this integration app, and
          related materials) is licensed under the{' '}
          <a
            href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            MIT License
          </a>
          . You may use, copy, modify, merge, publish, distribute, sublicense,
          and/or sell copies of the Software, subject to the MIT terms.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>Vercel integration</h2>
        <p>
          By installing the Bundle Cop Vercel integration, you authorize Bundle
          Cop to access the Vercel resources implied by the scopes you approve
          (for example deployments, projects, and checks) solely to provide
          bundle reporting features. You can uninstall the integration at any
          time from your Vercel team settings.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>No warranty</h2>
        <p>
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
          KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
          OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
          NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
          LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY ARISING FROM USE OF
          THE SOFTWARE.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the integration (for example attempting to
          access other customers&apos; Blob reports or circumvent webhook
          signature verification). We may revoke access for abuse.
        </p>
      </section>

      <section className="panel doc-section">
        <h2>Contact</h2>
        <p>
          Licensing questions:{' '}
          <a
            href="https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/issues"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Issues
          </a>
          .
        </p>
      </section>
    </SiteShell>
  )
}
