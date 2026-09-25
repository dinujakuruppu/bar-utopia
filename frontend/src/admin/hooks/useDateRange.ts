'use client'

import { useState } from 'react'

export const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'last7Days', label: 'Last 7 Days' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'last12Months', label: 'Last 12 Months' },
  { value: 'custom', label: 'Custom Range' },
] as const

export type DateRangePreset = (typeof DATE_RANGE_OPTIONS)[number]['value']

export interface DateRangeState {
  preset: DateRangePreset
  /** YYYY-MM-DD, only used when preset === 'custom' */
  start?: string
  end?: string
}

export function useDateRange(initial: DateRangePreset = 'last7Days') {
  const [dateRange, setDateRange] = useState<DateRangeState>({ preset: initial })
  return { dateRange, setDateRange }
}
