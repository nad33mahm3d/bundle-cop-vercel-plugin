'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type HistoryPoint = {
  sha: string
  label: string
  totalKb: number
  createdAt: string
}

export function BundleHistoryChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
        <XAxis dataKey="label" stroke="#a3a3a3" tick={{ fontSize: 11 }} />
        <YAxis
          stroke="#a3a3a3"
          tick={{ fontSize: 11 }}
          unit=" kB"
          width={64}
        />
        <Tooltip
          contentStyle={{
            background: '#141414',
            border: '1px solid #262626',
          }}
        />
        <Line
          type="monotone"
          dataKey="totalKb"
          stroke="#00e599"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
