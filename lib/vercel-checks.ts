type CheckInput = {
  deploymentId: string
  projectId?: string
  name: string
  conclusion: 'succeeded' | 'failed' | 'neutral' | 'skipped'
  output: { title: string; summary: string }
}

/**
 * Best-effort Vercel Checks API integration.
 * Uses deployment checks when a token is present; no-ops otherwise.
 */
export async function createOrUpdateCheck(input: CheckInput): Promise<void> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    console.warn('[bundle-cop] VERCEL_TOKEN missing — skipping Checks API')
    return
  }

  try {
    const res = await fetch(
      `https://api.vercel.com/v1/deployments/${input.deploymentId}/checks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: input.name,
          path: '/',
          status: 'completed',
          conclusion: input.conclusion,
          blocking: false,
          detailsUrl: undefined,
          output: {
            summary: input.output.summary,
            title: input.output.title,
          },
        }),
      },
    )

    if (!res.ok) {
      const text = await res.text()
      console.warn('[bundle-cop] Checks API error:', res.status, text)
    }
  } catch (error) {
    console.warn('[bundle-cop] Checks API failed:', error)
  }
}
