import { NPM_URL } from '@/lib/site'

const PACKAGE = 'bundle-cop-vercel-plugin'

export type NpmDownloadStats = {
  lastDay: number | null
  lastWeek: number | null
  lastMonth: number | null
  version: string | null
}

/** YYYY-MM-DD in UTC */
function utcYmd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function daysAgoUtc(days: number): Date {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d
}

/**
 * Prefer explicit rolling windows over npm's `last-week` / `last-month` aliases.
 * Those aliases often end 1–2 days behind "today", which hides downloads for
 * brand-new packages (e.g. publish day falls outside the alias window).
 */
async function fetchPointRange(
  start: string,
  end: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/${start}:${end}/${PACKAGE}`,
      {
        next: { revalidate: 1800 },
        headers: { Accept: 'application/json' },
      },
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
      next: { revalidate: 1800 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { version?: string }
    return data.version ?? null
  } catch {
    return null
  }
}

export async function getNpmDownloadStats(): Promise<NpmDownloadStats> {
  const end = utcYmd(daysAgoUtc(0))
  const dayStart = utcYmd(daysAgoUtc(1))
  const weekStart = utcYmd(daysAgoUtc(7))
  const monthStart = utcYmd(daysAgoUtc(30))

  const [lastDay, lastWeek, lastMonth, version] = await Promise.all([
    fetchPointRange(dayStart, end),
    fetchPointRange(weekStart, end),
    fetchPointRange(monthStart, end),
    fetchLatestVersion(),
  ])

  return { lastDay, lastWeek, lastMonth, version }
}

export function formatDownloads(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export { PACKAGE as NPM_PACKAGE_NAME, NPM_URL }
