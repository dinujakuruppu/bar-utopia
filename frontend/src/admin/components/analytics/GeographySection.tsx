'use client'

import { Globe2 } from 'lucide-react'
import type { GeoRow } from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

export default function GeographySection({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<GeoRow[]>('geography', dateRange)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <Globe2 className="h-5 w-5 text-lagoon" />
        <h3 className="font-display text-lg font-semibold text-ocean-deep">Visitor Geography</h3>
      </div>
      <p className="mt-0.5 text-sm text-ink/50">
        Top countries and cities — useful for spotting tourism markets vs. local visitors
      </p>

      <div className="mt-4">
        {loading && !data && <AnalyticsLoading />}
        {error && <AnalyticsError message={error} />}
        {data && data.length === 0 && <AnalyticsEmpty />}
        {data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/45">
                  <th className="py-2.5 pr-4 font-medium">Country</th>
                  <th className="py-2.5 pr-4 font-medium">City</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Users</th>
                  <th className="py-2.5 text-right font-medium">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={`${row.country}-${row.city}`} className="border-b border-ink/5 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ocean-deep">{row.country}</td>
                    <td className="py-3 pr-4 text-ink/70">{row.city}</td>
                    <td className="py-3 pr-4 text-right text-ink/80">{row.users.toLocaleString()}</td>
                    <td className="py-3 text-right text-ink/80">{row.sessions.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
