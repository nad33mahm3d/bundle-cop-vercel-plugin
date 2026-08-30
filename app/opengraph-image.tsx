import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/site'

export const alt = 'Bundle Cop — prevent Next.js bundle regressions'
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
          color: '#ffffff',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            maxWidth: 680,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#a3a3a3',
              fontWeight: 700,
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              Catch bundle regressions before production.
            </div>
            <div style={{ fontSize: 26, color: '#a3a3a3' }}>
              Attribute cost to the file. Enforce budgets. Report on every
              deploy.
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#737373' }}>
            bundle-cop.vercel.app
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={320}
          height={320}
          alt=""
          style={{ borderRadius: 24 }}
        />
      </div>
    ),
    { ...size },
  )
}
