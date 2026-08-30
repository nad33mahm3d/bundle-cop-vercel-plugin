import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/site'

export const alt = 'Bundle Cop — Optimize Next.js bundle size on Vercel'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const logoData = await readFile(join(process.cwd(), 'public/logo.jpg'))
  const logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 72,
          background: '#000000',
          color: '#ededed',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          borderBottom: '1px solid #333',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            maxWidth: 700,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#888',
              fontWeight: 500,
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 650,
                lineHeight: 1.05,
                letterSpacing: -2,
                color: '#fff',
              }}
            >
              Optimize Next.js bundle size on Vercel.
            </div>
            <div style={{ fontSize: 24, color: '#888', maxWidth: 620 }}>
              Attribute cost to the file. Enforce budgets. Catch regressions on
              every deploy.
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#666' }}>
            bundle-cop.vercel.app
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={280}
          height={280}
          alt=""
          style={{ borderRadius: 16, border: '1px solid #333' }}
        />
      </div>
    ),
    { ...size },
  )
}
