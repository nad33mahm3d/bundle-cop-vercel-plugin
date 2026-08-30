import type { ReactNode } from 'react'

const GITHUB =
  'https://github.com/nad33mahm3d/bundle-cop-vercel-plugin'
const NPM = 'https://www.npmjs.com/package/bundle-cop-vercel-plugin'

export function SiteNav() {
  return (
    <p className="nav">
      <a href="/">Home</a>
      <a href="/docs">Docs</a>
      <a href="/setup">Setup</a>
      <a href="/dashboard">Dashboard</a>
      <a href={GITHUB} target="_blank" rel="noreferrer">
        GitHub
      </a>
    </p>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        <a href="/docs">Docs</a>
        <a href="/privacy">Privacy</a>
        <a href="/eula">EULA</a>
        <a href={GITHUB} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={NPM} target="_blank" rel="noreferrer">
          npm
        </a>
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
}: {
  children: ReactNode
  wide?: boolean
}) {
  return (
    <main className={wide ? 'main-wide' : undefined}>
      <SiteNav />
      {children}
      <SiteFooter />
    </main>
  )
}
