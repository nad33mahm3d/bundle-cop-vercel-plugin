type GithubCheckInput = {
  commitSha: string
  conclusion: 'success' | 'failure' | 'neutral'
  title: string
  summary: string
}

/**
 * Posts a GitHub Check Run when GitHub App credentials are configured.
 */
export async function postGithubCheck(input: GithubCheckInput): Promise<void> {
  const appId = process.env.GITHUB_APP_ID
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const repo = process.env.GITHUB_REPOSITORY // owner/repo

  if (!appId || !installationId || !privateKey || !repo) {
    return
  }

  try {
    const token = await getInstallationToken(
      appId,
      installationId,
      privateKey,
    )
    const [owner, name] = repo.split('/')
    if (!owner || !name) return

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/check-runs`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          name: 'Bundle Cop',
          head_sha: input.commitSha,
          status: 'completed',
          conclusion: input.conclusion,
          output: {
            title: input.title,
            summary: input.summary,
          },
        }),
      },
    )

    if (!res.ok) {
      console.warn('[bundle-cop] GitHub check failed:', await res.text())
    }
  } catch (error) {
    console.warn('[bundle-cop] GitHub check error:', error)
  }
}

async function getInstallationToken(
  appId: string,
  installationId: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const jwt = await signAppJwt(appId, privateKey, now)

  const res = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  if (!res.ok) {
    throw new Error(`GitHub installation token failed: ${await res.text()}`)
  }

  const data = (await res.json()) as { token: string }
  return data.token
}

async function signAppJwt(
  appId: string,
  privateKeyPem: string,
  now: number,
): Promise<string> {
  // Minimal JWT (RS256) without external deps using Web Crypto
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: appId,
  }

  const enc = new TextEncoder()
  const b64 = (data: unknown) =>
    Buffer.from(JSON.stringify(data)).toString('base64url')
  const unsigned = `${b64(header)}.${b64(payload)}`

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    enc.encode(unsigned),
  )

  return `${unsigned}.${Buffer.from(signature).toString('base64url')}`
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '')
  const buf = Buffer.from(b64, 'base64')
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}
