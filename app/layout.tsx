import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bundle Cop',
  description: 'Prevent Next.js bundle regressions on Vercel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
