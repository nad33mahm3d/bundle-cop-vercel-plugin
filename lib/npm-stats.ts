import { NPM_URL } from '@/lib/site'

const PACKAGE = 'bundle-cop-vercel-plugin'

export type NpmDownloadStats = {
  lastDay: number | null
  lastWeek: number | null
  lastMonth: number | null
  version: string | null
}

async function fetchPoint(
  period: 'last-day' | 'last-week' | 'last-month',
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/${period}/${PACKAGE}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const data = (await res.json()) as { downloads?: number }
    return typeof data.downloads === 'number' ? data.downloads : null
  } catch {
    return null
  }
}

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${PACKAGE}/latest`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { version?: string }
    return data.version ?? null
  } catch {
    return null
  }
}

export async function getNpmDownloadStats(): Promise<NpmDownloadStats> {
  const [lastDay, lastWeek, lastMonth, version] = await Promise.all([
    fetchPoint('last-day'),
    fetchPoint('last-week'),
    fetchPoint('last-month'),
    fetchLatestVersion(),
  ])
  return { lastDay, lastWeek, lastMonth, version }
}

export function formatDownloads(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export { PACKAGE as NPM_PACKAGE_NAME, NPM_URL }
