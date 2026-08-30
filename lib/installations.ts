import { SITE_URL } from '@/lib/site'

export type InstallationRecord = {
  configurationId: string
  accessToken: string
  teamId?: string | null
  userId?: string | null
  installationId?: string | null
  createdAt: string
  updatedAt: string
}

function blobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN || null
}

function installationPath(configurationId: string) {
  return `installations/${configurationId}.json`
}

function teamIndexPath(teamId: string) {
  return `installations/by-team/${teamId}.json`
}

async function streamToString(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8')
}

export async function saveInstallation(
  record: InstallationRecord,
): Promise<void> {
  const token = blobToken()
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required to store installations')
  }

  const { put } = await import('@vercel/blob')
  const body = JSON.stringify(record, null, 2)

  await put(installationPath(record.configurationId), body, {
    access: 'private',
    token,
    contentType: 'application/json',
    allowOverwrite: true,
    addRandomSuffix: false,
  })

  if (record.teamId) {
    await put(
      teamIndexPath(record.teamId),
      JSON.stringify({ configurationId: record.configurationId }),
      {
        access: 'private',
        token,
        contentType: 'application/json',
        allowOverwrite: true,
        addRandomSuffix: false,
      },
    )
  }
}

export async function getInstallation(
  configurationId: string,
): Promise<InstallationRecord | null> {
  const token = blobToken()
  if (!token) return null

  try {
    const { get } = await import('@vercel/blob')
    const result = await get(installationPath(configurationId), {
      access: 'private',
      token,
    })
    if (!result?.stream) return null
    return JSON.parse(await streamToString(result.stream)) as InstallationRecord
  } catch {
    return null
  }
}

export async function getInstallationByTeam(
  teamId: string,
): Promise<InstallationRecord | null> {
  const token = blobToken()
  if (!token) return null

  try {
    const { get } = await import('@vercel/blob')
    const index = await get(teamIndexPath(teamId), { access: 'private', token })
    if (!index?.stream) return null
    const { configurationId } = JSON.parse(
      await streamToString(index.stream),
    ) as { configurationId?: string }
    if (!configurationId) return null
    return getInstallation(configurationId)
  } catch {
    return null
  }
}

export async function deleteInstallation(
  configurationId: string,
  teamId?: string | null,
): Promise<void> {
  const token = blobToken()
  if (!token) return

  try {
    const { del } = await import('@vercel/blob')
    const paths = [installationPath(configurationId)]
    if (teamId) paths.push(teamIndexPath(teamId))
    await del(paths, { token })
  } catch (error) {
    console.warn('[bundle-cop] deleteInstallation failed:', error)
  }
}

/**
 * Resolve a Vercel API token for Checks / diffs.
 * Prefer per-install OAuth token; fall back to shared VERCEL_TOKEN.
 */
export async function resolveAccessToken(opts: {
  configurationId?: string | null
  teamId?: string | null
}): Promise<string | null> {
  if (opts.configurationId) {
    const install = await getInstallation(opts.configurationId)
    if (install?.accessToken) return install.accessToken
  }
  if (opts.teamId) {
    const install = await getInstallationByTeam(opts.teamId)
    if (install?.accessToken) return install.accessToken
  }
  return process.env.VERCEL_TOKEN || null
}

export function integrationRedirectUri(): string {
  return (
    process.env.INTEGRATION_REDIRECT_URI || `${SITE_URL}/setup`
  )
}
