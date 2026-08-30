import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/site'

export const alt = 'Bundle Cop — prevent Next.js bundle regressions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'linear-gradient(145deg, #07110d 0%, #0c1f18 45%, #0a1620 100%)',
          color: '#f4f7f5',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#00e599',
            fontWeight: 700,
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            Catch bundle regressions before production.
          </div>
          <div style={{ fontSize: 28, color: '#9db5a8', maxWidth: 820 }}>
            Attribute cost to the file. Enforce budgets. Report on every deploy.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, color: '#7a9488' }}>
          bundle-cop.vercel.app · npm: bundle-cop-vercel-plugin
        </div>
      </div>
    ),
    { ...size },
  )
}
