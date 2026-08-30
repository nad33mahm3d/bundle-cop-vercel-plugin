import { BundleHistoryChart } from '@/components/BundleHistoryChart'
import { SiteShell } from '@/components/SiteChrome'
import { listRecentReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const points = await listRecentReports(30)

  return (
    <SiteShell>
      <h1 className="brand page-title">Dashboard</h1>
      <p className="lead">
        Bundle size across recent deployments (from private Blob reports).
      </p>
      <section className="panel">
        <h2>Last {points.length || 0} reports</h2>
        {points.length === 0 ? (
          <p>
            No reports yet. Run a build with the Bundle Cop adapter and ensure{' '}
            <code>BLOB_READ_WRITE_TOKEN</code> is set. See{' '}
            <a href="/docs#env">docs → Environment</a>.
          </p>
        ) : (
          <div className="chart-wrap">
            <BundleHistoryChart data={points} />
          </div>
        )}
      </section>
    </SiteShell>
  )
}
