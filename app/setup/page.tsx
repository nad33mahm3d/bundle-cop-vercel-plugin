import { exchangeCodeForToken } from '@/lib/oauth'
import { SetupClient } from './SetupClient'

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const code = first(sp.code)
  const configurationId = first(sp.configurationId)
  const nextUrl = first(sp.next)

  let installed = false
  let installError: string | null = null

  if (code && configurationId) {
    try {
      await exchangeCodeForToken({ code, configurationId })
      installed = true
    } catch (error) {
      installError =
        error instanceof Error ? error.message : 'Failed to complete OAuth install'
      console.error('[bundle-cop] OAuth exchange failed:', error)
    }
  }

  return (
    <SetupClient
      nextUrl={nextUrl}
      configurationId={configurationId}
      installed={installed}
      installError={installError}
    />
  )
}
