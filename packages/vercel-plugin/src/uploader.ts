import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { BundleReport } from './types.js'

export function writeLocalReport(
  projectDir: string,
  report: BundleReport,
): string {
  const outPaths = [
    join(projectDir, 'bundle-report.json'),
    join(projectDir, '.vercel', 'output', 'static', 'bundle-report.json'),
  ]

  let primary = outPaths[0]!
  for (const outPath of outPaths) {
    try {
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, JSON.stringify(report, null, 2))
      primary = outPath
    } catch (error) {
      console.warn(`[bundle-cop] Could not write ${outPath}:`, error)
    }
  }
  return primary
}

export async function uploadReport(
  report: BundleReport,
): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const sha =
    report.commitSha ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    'local'

  if (!token) {
    console.warn(
      '[bundle-cop] BLOB_READ_WRITE_TOKEN not set — skipping Blob upload',
    )
    return null
  }

  try {
    const { put } = await import('@vercel/blob')
    const pathname = `bundle-reports/${sha}.json`
    const result = await put(pathname, JSON.stringify(report), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    })
    console.log(`[bundle-cop] Uploaded report to Blob: ${pathname}`)
    return result.url
  } catch (error) {
    console.warn('[bundle-cop] Blob upload failed:', error)
    return null
  }
}
