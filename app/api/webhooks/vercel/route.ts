import { createHmac, timingSafeEqual } from 'node:crypto'
import type { BundleReport, ReportModule } from 'bundle-cop-vercel-plugin'
import { formatBytes } from '@/lib/format'
import { getReportBySha } from '@/lib/reports'
import { createOrUpdateCheck } from '@/lib/vercel-checks'
import { postGithubCheck } from '@/lib/github'

export const runtime = 'nodejs'

type VercelWebhookPayload = {
  type?: string
  payload?: {
    deployment?: {
      id?: string
      url?: string
      meta?: Record<string, string>
      projectId?: string
    }
    project?: { id?: string }
    target?: string
  }
}

export async function POST(request: Request) {
  const raw = await request.text()
  if (!verifySignature(raw, request.headers.get('x-vercel-signature'))) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(raw) as VercelWebhookPayload
  const type = body.type || ''
  if (type !== 'deployment.ready' && type !== 'deployment.succeeded') {
    return Response.json({ ok: true, skipped: type })
  }

  const deployment = body.payload?.deployment
  const deploymentId = deployment?.id
  const projectId = deployment?.projectId || body.payload?.project?.id
  const commitSha =
    deployment?.meta?.githubCommitSha ||
    deployment?.meta?.gitlabCommitSha ||
    deployment?.meta?.bitbucketCommitSha ||
    null

  if (!deploymentId || !commitSha) {
    return Response.json({
      ok: true,
      skipped: 'missing deployment id or commit sha',
    })
  }

  const current = await getReportBySha(commitSha)
  if (!current) {
    return Response.json({
      ok: true,
      skipped: 'no report for commit',
      commitSha,
    })
  }

  const prod = await fetchProductionReport(projectId)
  const markdown = buildComment(current, prod)

  await createOrUpdateCheck({
    deploymentId,
    projectId,
    name: 'Bundle Cop',
    conclusion: budgetFailed(current) ? 'failed' : 'succeeded',
    output: {
      title: 'Bundle Cop Report',
      summary: markdown,
    },
  })

  await postGithubCheck({
    commitSha,
    conclusion: budgetFailed(current) ? 'failure' : 'success',
    title: 'Bundle Cop Report',
    summary: markdown,
  })

  return Response.json({ ok: true, commitSha, deploymentId })
}

function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.VERCEL_WEBHOOK_SECRET
  if (!secret) {
    // Allow local/dev without secret; reject in production if unset
    return process.env.NODE_ENV !== 'production'
  }
  if (!header) return false
  const digest = createHmac('sha1', secret).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(header))
  } catch {
    return false
  }
}

async function fetchProductionReport(
  projectId?: string,
): Promise<BundleReport | null> {
  const token = process.env.VERCEL_TOKEN
  if (!token || !projectId) return null

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=production&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) return null
    const data = (await res.json()) as {
      deployments?: Array<{ meta?: Record<string, string> }>
    }
    const sha =
      data.deployments?.[0]?.meta?.githubCommitSha ||
      data.deployments?.[0]?.meta?.gitlabCommitSha
    if (!sha) return null
    return getReportBySha(sha)
  } catch {
    return null
  }
}

function budgetFailed(report: BundleReport): boolean {
  return (report.budgetResults ?? []).some(
    (r) => r.exceeded && r.enforce === 'error',
  )
}

function buildComment(
  current: BundleReport,
  prod: BundleReport | null,
): string {
  const delta = prod ? current.totalBytes - prod.totalBytes : 0
  const pct =
    prod && prod.totalBytes > 0
      ? ((delta / prod.totalBytes) * 100).toFixed(0)
      : null

  const culprit = pickCulprit(current, prod)
  const lines = [
    '### Bundle Cop Report',
    prod
      ? `**${delta >= 0 ? '+' : ''}${formatBytes(delta)}** vs production${pct ? ` (${delta >= 0 ? '+' : ''}${pct}%)` : ''}`
      : '**First report** (no production baseline)',
    `**Total:** ${prod ? `${formatBytes(prod.totalBytes)} -> ${formatBytes(current.totalBytes)}` : formatBytes(current.totalBytes)}`,
  ]

  if (culprit) {
    lines.push(
      `**Biggest culprit:** \`${culprit.name}\` (+${formatBytes(culprit.size)}) imported by \`${culprit.culpritFile || 'unknown'}\``,
    )
    if (culprit.suggestion) {
      lines.push(`**Suggestion:** ${culprit.suggestion}`)
    }
  }

  return lines.join('\n')
}

function pickCulprit(
  current: BundleReport,
  prod: BundleReport | null,
): ReportModule | null {
  const prodNames = new Set((prod?.modules ?? []).map((m) => m.name))
  const newcomers = current.modules.filter(
    (m) => m.size > 50 * 1024 && !prodNames.has(m.name),
  )
  if (newcomers.length > 0) return newcomers[0]!
  return current.modules[0] ?? null
}
