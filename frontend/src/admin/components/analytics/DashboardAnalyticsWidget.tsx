'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BarChart3, Eye, TrendingUp, Users } from 'lucide-react'
import type { AnalyticsSummary } from '@backend/lib/googleAnalytics/types'

interface State {
  data: AnalyticsSummary | null
  loading: boolean
  error: string | null
}

/**
 * Small "last 7 days" snapshot on the main /admin dashboard. Silently shows
 * nothing (rather than an error banner) if GA4 isn't configured yet — the
 * full /admin/analytics page explains setup in detail, this widget shouldn't
 * be the place that greets a fresh install with a scary error.
 */
export default function DashboardAnalyticsWidget() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    fetch('/api/analytics/summary')
      .then(async (res) => {
        const payload = await res.json().catch(() => null)
        if (!res.ok) throw new Error(payload?.error ?? 'Failed to load analytics summary.')
        return payload
      })
      .then((payload) => {
        if (!cancelled) setState({ data: payload?.data ?? null, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Failed to load.' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.loading) {
    return (
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-soft">
        <div className="h-24 animate-pulse rounded-xl bg-ink/5" />
      </div>
    )
  }

  // Not configured, or some other error — stay quiet rather than alarming a
  // fresh install; the full analytics page explains what to do.
  if (state.error || !state.data) return null

  const { visitors7d, pageViews7d, mostPopularPage, topTrafficSource } = state.data

  return (
    <div className="mt-10 rounded-2xl bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ocean-deep">
          <BarChart3 className="h-5 w-5 text-lagoon" />
          Analytics — Last 7 Days
        </h2>
        <Link
          href="/admin/analytics"
          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink/80 transition-colors hover:bg-ink/5"
        >
          View Full Analytics
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-sand-dark/30 px-4 py-3">
          <Users className="h-4 w-4 text-lagoon" />
          <p className="mt-2 font-display text-xl font-semibold text-ocean-deep">
            {visitors7d.toLocaleString()}
          </p>
          <p className="text-xs text-ink/50">Visitors</p>
        </div>
        <div className="rounded-xl bg-sand-dark/30 px-4 py-3">
          <Eye className="h-4 w-4 text-lagoon" />
          <p className="mt-2 font-display text-xl font-semibold text-ocean-deep">
            {pageViews7d.toLocaleString()}
          </p>
          <p className="text-xs text-ink/50">Page Views</p>
        </div>
        <div className="rounded-xl bg-sand-dark/30 px-4 py-3">
          <TrendingUp className="h-4 w-4 text-lagoon" />
          <p className="mt-2 truncate font-display text-base font-semibold text-ocean-deep" title={mostPopularPage ?? undefined}>
            {mostPopularPage ?? '—'}
          </p>
          <p className="text-xs text-ink/50">Most Popular Page</p>
        </div>
        <div className="rounded-xl bg-sand-dark/30 px-4 py-3">
          <BarChart3 className="h-4 w-4 text-lagoon" />
          <p className="mt-2 truncate font-display text-base font-semibold text-ocean-deep" title={topTrafficSource ?? undefined}>
            {topTrafficSource ?? '—'}
          </p>
          <p className="text-xs text-ink/50">Top Traffic Source</p>
        </div>
      </div>
    </div>
  )
}
