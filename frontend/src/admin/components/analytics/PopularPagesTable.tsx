'use client'

import type { PopularPage } from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

function formatSeconds(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return `${minutes}m ${rest}s`
}

export default function PopularPagesTable({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<PopularPage[]>('pages', dateRange)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft">
      <h3 className="font-display text-lg font-semibold text-ocean-deep">Popular Pages</h3>
      <p className="mt-0.5 text-sm text-ink/50">Ranked by total views</p>

      <div className="mt-4">
        {loading && !data && <AnalyticsLoading />}
        {error && <AnalyticsError message={error} />}
        {data && data.length === 0 && <AnalyticsEmpty />}
        {data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/45">
                  <th className="py-2.5 pr-4 font-medium">Page</th>
                  <th className="py-2.5 pr-4 font-medium">Path</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Views</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Users</th>
                  <th className="py-2.5 text-right font-medium">Avg. Engagement</th>
                </tr>
              </thead>
              <tbody>
                {data.map((page) => (
                  <tr key={page.path} className="border-b border-ink/5 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ocean-deep">{page.title}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-ink/50">{page.path}</td>
                    <td className="py-3 pr-4 text-right text-ink/80">{page.views.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right text-ink/80">{page.users.toLocaleString()}</td>
                    <td className="py-3 text-right text-ink/80">{formatSeconds(page.avgEngagementTimeSeconds)}</td>
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
