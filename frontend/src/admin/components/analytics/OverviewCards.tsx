'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowDown, ArrowUp, Minus, Users, UserPlus, Repeat, MonitorSmartphone, Eye, Timer, Flame } from 'lucide-react'
import type { MetricWithTrend, OverviewMetrics } from '@backend/lib/googleAnalytics/types'
import { AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

function formatSeconds(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return `${minutes}m ${rest}s`
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

interface CardDef {
  label: string
  icon: LucideIcon
  metric: MetricWithTrend
  format: (value: number) => string
}

function TrendBadge({ changePercent }: { changePercent: number | null }) {
  if (changePercent === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink/40">
        <Minus className="h-3 w-3" /> n/a
      </span>
    )
  }
  const isUp = changePercent > 0
  const isFlat = changePercent === 0
  const Icon = isFlat ? Minus : isUp ? ArrowUp : ArrowDown
  const colorClass = isFlat ? 'bg-ink/5 text-ink/40' : isUp ? 'bg-lagoon/10 text-lagoon' : 'bg-coral/10 text-coral-dark'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(changePercent)}%
    </span>
  )
}

function StatCard({ label, icon: Icon, metric, format }: CardDef) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lagoon/15 text-lagoon">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <TrendBadge changePercent={metric.changePercent} />
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-ocean-deep sm:text-3xl">
        {format(metric.value)}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/45 sm:text-sm sm:normal-case sm:tracking-normal">
        {label}
      </p>
    </div>
  )
}

export default function OverviewCards({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<OverviewMetrics>('overview', dateRange)

  if (loading && !data) {
    return (
      <div className="rounded-2xl bg-white shadow-soft">
        <AnalyticsLoading label="Loading overview…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white shadow-soft">
        <AnalyticsError message={error} />
      </div>
    )
  }

  if (!data) return null

  const cards: CardDef[] = [
    { label: 'Total Users', icon: Users, metric: data.totalUsers, format: formatNumber },
    { label: 'New Users', icon: UserPlus, metric: data.newUsers, format: formatNumber },
    { label: 'Returning Users', icon: Repeat, metric: data.returningUsers, format: formatNumber },
    { label: 'Total Sessions', icon: MonitorSmartphone, metric: data.sessions, format: formatNumber },
    { label: 'Page Views', icon: Eye, metric: data.pageViews, format: formatNumber },
    { label: 'Avg. Engagement Time', icon: Timer, metric: data.avgEngagementTimeSeconds, format: formatSeconds },
    { label: 'Engagement Rate', icon: Flame, metric: data.engagementRate, format: (v) => `${v.toFixed(1)}%` },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}
