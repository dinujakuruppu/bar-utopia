'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrafficResponse } from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

const COLORS = {
  users: '#17A398', // lagoon
  sessions: '#0E4749', // ocean-deep
  pageViews: '#FF6F52', // coral
  newUsers: '#17A398',
  returningUsers: '#FF6F52',
}

function formatDateLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TrafficTrendCharts({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<TrafficResponse>('traffic', dateRange)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Website Traffic</h3>
        <p className="mt-0.5 text-sm text-ink/50">Users, sessions, and page views over time</p>
        <div className="mt-4 h-72">
          {loading && !data && <AnalyticsLoading />}
          {error && <AnalyticsError message={error} />}
          {data && data.trend.length === 0 && <AnalyticsEmpty />}
          {data && data.trend.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend} margin={{ left: -20, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.users} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.users} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#12222310" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateLabel}
                  tick={{ fontSize: 11, fill: '#12222380' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#12222380' }} tickLine={false} axisLine={false} width={40} />
                <Tooltip
                  labelFormatter={(v) => formatDateLabel(String(v))}
                  contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke={COLORS.users}
                  fill="url(#fillUsers)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Sessions"
                  stroke={COLORS.sessions}
                  fill="transparent"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke={COLORS.pageViews}
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Visitor Types</h3>
        <p className="mt-0.5 text-sm text-ink/50">New vs. returning</p>
        <div className="mt-4 h-72">
          {loading && !data && <AnalyticsLoading />}
          {error && <AnalyticsError message={error} />}
          {data && data.trend.length === 0 && <AnalyticsEmpty />}
          {data && data.trend.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trend} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#12222310" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateLabel}
                  tick={{ fontSize: 11, fill: '#12222380' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#12222380' }} tickLine={false} axisLine={false} width={40} />
                <Tooltip
                  labelFormatter={(v) => formatDateLabel(String(v))}
                  contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="newUsers" name="New" stackId="a" fill={COLORS.newUsers} radius={[0, 0, 0, 0]} />
                <Bar
                  dataKey="returningUsers"
                  name="Returning"
                  stackId="a"
                  fill={COLORS.returningUsers}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
