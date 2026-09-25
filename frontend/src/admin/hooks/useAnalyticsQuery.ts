'use client'

import { useEffect, useRef, useState } from 'react'
import type { DateRangeState } from './useDateRange'

interface QueryState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function buildQuery(dateRange: DateRangeState) {
  const params = new URLSearchParams({ range: dateRange.preset })
  if (dateRange.preset === 'custom' && dateRange.start && dateRange.end) {
    params.set('start', dateRange.start)
    params.set('end', dateRange.end)
  }
  return params.toString()
}

/**
 * Fetches one /api/analytics/* endpoint and re-fetches whenever the date
 * range changes. Cancels the in-flight request if the range changes again
 * (or the component unmounts) before it resolves, so a slow earlier request
 * can't clobber a newer one.
 */
export function useAnalyticsQuery<T>(endpoint: string, dateRange: DateRangeState) {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null })
  const requestId = useRef(0)

  useEffect(() => {
    const thisRequest = ++requestId.current
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))

    fetch(`/api/analytics/${endpoint}?${buildQuery(dateRange)}`, { signal: controller.signal })
      .then(async (res) => {
        const payload = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error(payload?.error ?? `Request failed (${res.status}).`)
        }
        return payload
      })
      .then((payload) => {
        if (requestId.current !== thisRequest) return
        setState({ data: payload?.data ?? null, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        if (requestId.current !== thisRequest) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Something went wrong loading analytics.',
        })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, dateRange.preset, dateRange.start, dateRange.end])

  return state
}
