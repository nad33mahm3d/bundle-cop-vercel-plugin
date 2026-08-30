'use client'

import { useEffect, useState } from 'react'
import { SiteShell } from '@/components/SiteChrome'

type Props = {
  nextUrl?: string | null
  configurationId?: string | null
  installed: boolean
  installError?: string | null
}

export function SetupClient({
  nextUrl,
  configurationId,
  installed,
  installError,
}: Props) {
  const [defaultBudget, setDefaultBudget] = useState('250')
  const [failOnOver, setFailOnOver] = useState(false)
  const [connectGithub, setConnectGithub] = useState(true)
  const [saved, setSaved] = useState(false)
  const [countdown, setCountdown] = useState(installed && nextUrl ? 3 : null)

  useEffect(() => {
    if (!installed || !nextUrl || countdown === null) return
    if (countdown <= 0) {
      window.location.href = nextUrl
      return
    }
    const t = window.setTimeout(() => setCountdown((c) => (c == null ? c : c - 1)), 1000)
    return () => window.clearTimeout(t)
  }, [installed, nextUrl, countdown])

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <SiteShell>
      <h1 className="page-title">Setup</h1>
      <p className="lead">
        Configure default budgets for new projects. Full install steps are in
        the <a href="/docs">docs</a>.
      </p>

      {installError ? (
        <section className="panel" style={{ borderColor: 'var(--danger)' }}>
          <h2>Installation error</h2>
          <p>{installError}</p>
          <p style={{ marginTop: '0.75rem' }}>
            Re-open the install from Vercel, or check that{' '}
            <code>INTEGRATION_CLIENT_ID</code> /{' '}
            <code>INTEGRATION_CLIENT_SECRET</code> and the Redirect URL match.
          </p>
        </section>
      ) : null}

      {installed && !installError ? (
        <section className="panel">
          <h2>Connected to Vercel</h2>
          <p>
            OAuth install saved
            {configurationId ? (
              <>
                {' '}
                for configuration <code>{configurationId}</code>
              </>
            ) : null}
            . Bundle Cop can post Checks using your installation token.
          </p>
          {nextUrl ? (
            <div className="cta-row" style={{ marginTop: '1.25rem' }}>
              <a className="btn btn-primary" href={nextUrl}>
                {countdown != null && countdown > 0
                  ? `Continue to Vercel (${countdown})`
                  : 'Continue to Vercel'}
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      <form onSubmit={onSave} className="panel">
        <label>
          Default max client budget (kB)
          <input
            type="number"
            min={50}
            value={defaultBudget}
            onChange={(e) => setDefaultBudget(e.target.value)}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={failOnOver}
            onChange={(e) => setFailOnOver(e.target.checked)}
          />
          Fail build if over budget
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={connectGithub}
            onChange={(e) => setConnectGithub(e.target.checked)}
          />
          Connect GitHub for PR checks
        </label>

        <div className="cta-row" style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary">
            Save defaults
          </button>
        </div>

        {saved ? (
          <p style={{ marginTop: '1rem', color: 'var(--success)' }}>
            Defaults saved for this session. Add{' '}
            <code>bundle-cop-vercel-plugin</code> via <code>adapterPath</code>{' '}
            in next.config, then deploy. See{' '}
            <a href="/docs#install">docs → Install</a>.
          </p>
        ) : null}

        <pre className="code-block">{`{
  "budgets": [
    {
      "path": "/*",
      "maxSize": "${defaultBudget}kb",
      "enforce": "${failOnOver ? 'error' : 'warn'}"
    }
  ],
  "githubComment": ${connectGithub},
  "suggestions": true
}`}</pre>
      </form>
    </SiteShell>
  )
}
