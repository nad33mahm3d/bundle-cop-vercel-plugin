import { BundleHistoryChart } from '@/components/BundleHistoryChart'
import { listRecentReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const points = await listRecentReports(30)

  return (
    <main>
      <p className="nav">
        <a href="/">Home</a>
        <a href="/setup">Setup</a>
      </p>
      <h1 className="brand" style={{ fontSize: '2.5rem' }}>
        Dashboard
      </h1>
      <p className="lead">
        Bundle size across recent deployments (from private Blob reports).
      </p>
      <section className="panel">
        <h2>Last {points.length || 0} reports</h2>
        {points.length === 0 ? (
          <p>
            No reports yet. Run a build with the Bundle Cop adapter and ensure{' '}
            <code>BLOB_READ_WRITE_TOKEN</code> is set.
          </p>
        ) : (
          <div className="chart-wrap">
            <BundleHistoryChart data={points} />
          </div>
        )}
      </section>
    </main>
  )
}
