import type { BundleReport } from 'bundle-cop-vercel-plugin'
import type { HistoryPoint } from '@/components/BundleHistoryChart'

export async function listRecentReports(limit = 30): Promise<HistoryPoint[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []

  try {
    const { list, get } = await import('@vercel/blob')
    const { blobs } = await list({
      prefix: 'bundle-reports/',
      limit,
      token,
    })

    const points: HistoryPoint[] = []
    for (const blob of blobs) {
      try {
        const result = await get(blob.pathname, { access: 'private', token })
        if (!result?.stream) continue
        const text = await streamToString(result.stream)
        const report = JSON.parse(text) as BundleReport
        const sha =
          report.commitSha ||
          blob.pathname.split('/').pop()?.replace(/\.json$/, '') ||
          'unknown'
        points.push({
          sha,
          label: sha.slice(0, 7),
          totalKb: Math.round(report.totalBytes / 1024),
          createdAt:
            report.createdAt ||
            (blob.uploadedAt instanceof Date
              ? blob.uploadedAt.toISOString()
              : String(blob.uploadedAt || '')),
        })
      } catch {
        // skip bad blobs
      }
    }

    return points.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  } catch (error) {
    console.warn('[bundle-cop] listRecentReports failed:', error)
    return []
  }
}

export async function getReportBySha(sha: string): Promise<BundleReport | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return null

  try {
    const { get } = await import('@vercel/blob')
    const pathname = `bundle-reports/${sha}.json`
    const result = await get(pathname, { access: 'private', token })
    if (!result?.stream) return null
    const text = await streamToString(result.stream)
    return JSON.parse(text) as BundleReport
  } catch (error) {
    console.warn('[bundle-cop] getReportBySha failed:', error)
    return null
  }
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
  const merged = Buffer.concat(chunks.map((c) => Buffer.from(c)))
  return merged.toString('utf8')
}
