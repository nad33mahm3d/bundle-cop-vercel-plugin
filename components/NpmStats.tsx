import {
  formatDownloads,
  getNpmDownloadStats,
  NPM_PACKAGE_NAME,
  NPM_URL,
} from '@/lib/npm-stats'

export async function NpmStats() {
  const stats = await getNpmDownloadStats()
  const hasAny =
    stats.lastWeek != null || stats.lastMonth != null || stats.version != null

  if (!hasAny) return null

  return (
    <section className="npm-stats" aria-label="npm package stats">
      <div className="npm-stats-inner">
        <a
          className="npm-stats-package"
          href={NPM_URL}
          target="_blank"
          rel="noreferrer"
        >
          {NPM_PACKAGE_NAME}
          {stats.version ? <span>v{stats.version}</span> : null}
        </a>
        <dl className="npm-stats-grid">
          <div>
            <dt>Last day</dt>
            <dd>{formatDownloads(stats.lastDay)}</dd>
          </div>
          <div>
            <dt>Last week</dt>
            <dd>{formatDownloads(stats.lastWeek)}</dd>
          </div>
          <div>
            <dt>Last month</dt>
            <dd>{formatDownloads(stats.lastMonth)}</dd>
          </div>
        </dl>
      </div>
      <p className="npm-stats-note">
        Downloads from the{' '}
        <a href={NPM_URL} target="_blank" rel="noreferrer">
          npm registry
        </a>
        , refreshed hourly.
      </p>
    </section>
  )
}
