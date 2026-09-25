'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TrafficSourceRow } from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

const CHANNEL_COLORS = ['#17A398', '#0E4749', '#FF6F52', '#4C7A5E', '#5FCFC0', '#E85A3E']

export default function TrafficSourcesSection({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<TrafficSourceRow[]>('sources', dateRange)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-3">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Traffic Sources</h3>
        <p className="mt-0.5 text-sm text-ink/50">Where visitors come from</p>

        <div className="mt-4">
          {loading && !data && <AnalyticsLoading />}
          {error && <AnalyticsError message={error} />}
          {data && data.length === 0 && <AnalyticsEmpty />}
          {data && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/45">
                    <th className="py-2.5 pr-4 font-medium">Source</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Users</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Sessions</th>
                    <th className="py-2.5 text-right font-medium">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.channel} className="border-b border-ink/5 last:border-0">
                      <td className="py-3 pr-4 font-medium text-ocean-deep">{row.channel}</td>
                      <td className="py-3 pr-4 text-right text-ink/80">{row.users.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right text-ink/80">{row.sessions.toLocaleString()}</td>
                      <td className="py-3 text-right text-ink/80">{row.engagementRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Distribution</h3>
        <div className="mt-4 h-64">
          {data && data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="users"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.channel} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
