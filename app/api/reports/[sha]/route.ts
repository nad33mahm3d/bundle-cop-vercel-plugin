import { getReportBySha } from '@/lib/reports'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  context: { params: Promise<{ sha: string }> },
) {
  const { sha } = await context.params
  if (!sha) {
    return Response.json({ error: 'sha required' }, { status: 400 })
  }

  const report = await getReportBySha(sha)
  if (!report) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  return Response.json(report)
}
