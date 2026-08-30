import {
  integrationRedirectUri,
  saveInstallation,
  type InstallationRecord,
} from '@/lib/installations'

export type OAuthTokenResponse = {
  access_token: string
  token_type?: string
  installation_id?: string
  user_id?: string
  team_id?: string | null
}

/**
 * Exchange a one-time Vercel integration `code` for a long-lived access token.
 * @see https://vercel.com/docs/integrations/create-integration/vercel-api-integrations
 */
export async function exchangeCodeForToken(input: {
  code: string
  configurationId: string
}): Promise<InstallationRecord> {
  const clientId = process.env.INTEGRATION_CLIENT_ID
  const clientSecret = process.env.INTEGRATION_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('INTEGRATION_CLIENT_ID / INTEGRATION_CLIENT_SECRET missing')
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: input.code,
    redirect_uri: integrationRedirectUri(),
  })

  const res = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = (await res.json()) as OAuthTokenResponse & {
    error?: string
    error_description?: string
  }

  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description ||
        data.error ||
        `OAuth token exchange failed (${res.status})`,
    )
  }

  const now = new Date().toISOString()
  const record: InstallationRecord = {
    configurationId: input.configurationId,
    accessToken: data.access_token,
    teamId: data.team_id ?? null,
    userId: data.user_id ?? null,
    installationId: data.installation_id ?? null,
    createdAt: now,
    updatedAt: now,
  }

  await saveInstallation(record)
  return record
}
