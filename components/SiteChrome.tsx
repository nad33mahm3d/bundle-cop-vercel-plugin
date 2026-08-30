import Image from 'next/image'
import type { ReactNode } from 'react'
import { GITHUB_URL, NPM_URL } from '@/lib/site'

function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <Image
      src="/logo.jpg"
      alt=""
      width={size}
      height={size}
      className="logo-img"
      priority
    />
  )
}

export function SiteNav() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="logo-mark" href="/" aria-label="Bundle Cop home">
          <BrandMark />
          <span>Bundle Cop</span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="/docs">Docs</a>
          <a href="/guides/optimize-nextjs-bundle-vercel">Guide</a>
          <a href="/setup">Setup</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <div className="header-actions">
          <a
            className="btn btn-ghost btn-sm"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a className="btn btn-primary btn-sm" href="/docs">
            Get Started
          </a>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <a className="logo-mark" href="/">
            <BrandMark size={20} />
            <span>Bundle Cop</span>
          </a>
          <div className="site-footer-links">
            <a href="/docs">Docs</a>
            <a href="/guides/optimize-nextjs-bundle-vercel">Guide</a>
            <a href="/privacy">Privacy</a>
            <a href="/eula">EULA</a>
            <a href="/llms.txt">llms.txt</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={NPM_URL} target="_blank" rel="noreferrer">
              npm
            </a>
          </div>
        </div>
        <p className="site-footer-meta">
          © {new Date().getFullYear()} Bundle Cop. MIT License. Built for the
          Vercel ecosystem.
        </p>
      </div>
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
