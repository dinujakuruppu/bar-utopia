'use client'

import { ArrowDown } from 'lucide-react'
import type { JourneyResponse } from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

export default function UserJourneyFunnel({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<JourneyResponse>('journey', dateRange)

  const maxUsers = data ? Math.max(1, ...data.stages.map((s) => s.users)) : 1

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft">
      <h3 className="font-display text-lg font-semibold text-ocean-deep">User Journey</h3>
      <p className="mt-0.5 text-sm text-ink/50">
        How visitors move through the site, and where they lose interest
      </p>

      <div className="mt-6">
        {loading && !data && <AnalyticsLoading />}
        {error && <AnalyticsError message={error} />}
        {data && data.stages.every((s) => s.users === 0) && <AnalyticsEmpty />}
        {data && !data.stages.every((s) => s.users === 0) && (
          <div className="space-y-1">
            {data.stages.map((stage, i) => {
              const widthPercent = Math.max(6, (stage.users / maxUsers) * 100)
              return (
                <div key={stage.stage}>
                  <div className="flex items-center gap-4">
                    <div className="w-full">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-medium text-ocean-deep">{stage.stage}</span>
                        <span className="text-ink/60">{stage.users.toLocaleString()} users</span>
                      </div>
                      <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-sand-dark/30">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-ocean-deep to-lagoon transition-all"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {i < data.stages.length - 1 && (
                    <div className="flex items-center gap-2 py-1.5 pl-1 text-xs text-ink/45">
                      <ArrowDown className="h-3.5 w-3.5" />
                      {data.stages[i + 1].continuePercent !== null ? (
                        <span>
                          {data.stages[i + 1].continuePercent}% continued
                          {data.stages[i + 1].dropoffPercent !== null && (
                            <span className="text-coral-dark"> · {data.stages[i + 1].dropoffPercent}% drop-off</span>
                          )}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
