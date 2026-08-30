'use client'

import { useState } from 'react'
import { SiteShell } from '@/components/SiteChrome'

export default function SetupPage() {
  const [defaultBudget, setDefaultBudget] = useState('250')
  const [failOnOver, setFailOnOver] = useState(false)
  const [connectGithub, setConnectGithub] = useState(true)
  const [saved, setSaved] = useState(false)

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <SiteShell>
      <h1 className="brand page-title">Setup</h1>
      <p className="lead">
        Configure default budgets for new projects. Values are written into{' '}
        <code>bundle-cop.config.json</code> guidance shown during install. Full
        install steps are in the <a href="/docs">docs</a>.
      </p>

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
            <code>bundle-cop-vercel-plugin</code> via{' '}
            <code>adapterPath</code> in next.config, then deploy. See{' '}
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
