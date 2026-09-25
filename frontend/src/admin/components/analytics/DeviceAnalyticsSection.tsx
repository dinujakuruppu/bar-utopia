'use client'

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Laptop, Smartphone, Tablet } from 'lucide-react'
import type { DeviceResponse } from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

const DEVICE_COLORS: Record<string, string> = {
  mobile: '#FF6F52',
  desktop: '#17A398',
  tablet: '#0E4749',
}

const DEVICE_ICONS: Record<string, typeof Smartphone> = {
  mobile: Smartphone,
  desktop: Laptop,
  tablet: Tablet,
}

export default function DeviceAnalyticsSection({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<DeviceResponse>('devices', dateRange)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Devices</h3>
        <p className="mt-0.5 text-sm text-ink/50">Mobile vs. desktop vs. tablet</p>

        <div className="mt-4 h-52">
          {loading && !data && <AnalyticsLoading />}
          {error && <AnalyticsError message={error} />}
          {data && data.devices.length === 0 && <AnalyticsEmpty />}
          {data && data.devices.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.devices} dataKey="users" nameKey="category" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                  {data.devices.map((d) => (
                    <Cell key={d.category} fill={DEVICE_COLORS[d.category] ?? '#4C7A5E'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {data && data.devices.length > 0 && (
          <ul className="mt-3 space-y-2">
            {data.devices.map((d) => {
              const Icon = DEVICE_ICONS[d.category] ?? Laptop
              return (
                <li key={d.category} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 capitalize text-ink/70">
                    <Icon className="h-4 w-4 text-ink/40" />
                    {d.category}
                  </span>
                  <span className="font-medium text-ocean-deep">{d.percentage.toFixed(1)}%</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Browsers</h3>
        <div className="mt-4 h-64">
          {data && data.browsers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.browsers} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#12222310" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#12222380' }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#122223' }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }} />
                <Bar dataKey="users" fill="#17A398" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            !loading && !error && <AnalyticsEmpty />
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Operating Systems</h3>
        <div className="mt-4 h-64">
          {data && data.operatingSystems.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.operatingSystems} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#12222310" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#12222380' }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#122223' }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }} />
                <Bar dataKey="users" fill="#FF6F52" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            !loading && !error && <AnalyticsEmpty />
          )}
        </div>
      </div>
    </div>
  )
}
