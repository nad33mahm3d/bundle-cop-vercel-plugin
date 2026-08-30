import type { ReactNode } from 'react'
import { GITHUB_URL, NPM_URL } from '@/lib/site'

export function SiteNav() {
  return (
    <header className="site-header">
      <a className="logo-mark" href="/" aria-label="Bundle Cop home">
        <span className="logo-dot" aria-hidden />
        Bundle Cop
      </a>
      <nav className="nav" aria-label="Primary">
        <a href="/docs">Docs</a>
        <a href="/setup">Setup</a>
        <a href="/dashboard">Dashboard</a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <span className="logo-mark footer-mark">
          <span className="logo-dot" aria-hidden />
          Bundle Cop
        </span>
        <p>Prevent silent bundle growth on Next.js + Vercel.</p>
      </div>
      <div className="site-footer-cols">
        <div>
          <h3>Product</h3>
          <a href="/docs">Docs</a>
          <a href="/setup">Setup</a>
          <a href="/dashboard">Dashboard</a>
        </div>
        <div>
          <h3>Legal</h3>
          <a href="/privacy">Privacy</a>
          <a href="/eula">EULA</a>
          <a href="/llms.txt">llms.txt</a>
        </div>
        <div>
          <h3>Open source</h3>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            npm
          </a>
          <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">
            Releases
          </a>
        </div>
      </div>
      <p className="site-footer-meta">
        © {new Date().getFullYear()} Bundle Cop · MIT License
      </p>
    </footer>
  )
}

export function SiteShell({
  children,
  wide,
  landing,
}: {
  children: ReactNode
  wide?: boolean
  landing?: boolean
}) {
  return (
    <div className={landing ? 'page-shell landing' : 'page-shell'}>
      <SiteNav />
      <main className={wide ? 'main-wide' : undefined}>{children}</main>
      <SiteFooter />
    </div>
  )
}
