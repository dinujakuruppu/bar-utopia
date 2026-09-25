import { ApiError } from '../api'

export const DATE_RANGE_PRESETS = [
  'today',
  'last7Days',
  'last30Days',
  'last3Months',
  'last12Months',
  'custom',
] as const

export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number]

export interface ResolvedDateRange {
  /** GA4-friendly YYYY-MM-DD */
  startDate: string
  endDate: string
  /** Same-length period immediately before `startDate`, for % change comparisons. */
  previousStartDate: string
  previousEndDate: string
  label: string
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function daysAgo(days: number) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - days)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function isValidIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime())
}

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: 'Today',
  last7Days: 'Last 7 Days',
  last30Days: 'Last 30 Days',
  last3Months: 'Last 3 Months',
  last12Months: 'Last 12 Months',
  custom: 'Custom Range',
}

/**
 * Turns a preset key (or explicit custom start/end) into concrete GA4 date
 * strings, plus the matching "previous period" used for trend percentages.
 *
 * Throws `ApiError` (400) on anything malformed, so API routes can surface a
 * clean message instead of a stack trace.
 */
export function resolveDateRange(
  preset: string | null,
  customStart: string | null,
  customEnd: string | null,
): ResolvedDateRange {
  const key = (preset ?? 'last7Days') as DateRangePreset
  if (!DATE_RANGE_PRESETS.includes(key)) {
    throw new ApiError(`Invalid date range preset: "${preset}".`, 400)
  }

  if (key === 'custom') {
    if (!customStart || !customEnd || !isValidIsoDate(customStart) || !isValidIsoDate(customEnd)) {
      throw new ApiError('Custom date range requires valid "start" and "end" (YYYY-MM-DD) params.', 400)
    }
    const start = new Date(customStart)
    const end = new Date(customEnd)
    if (start > end) {
      throw new ApiError('Custom date range: "start" must be before "end".', 400)
    }
    const spanDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
    const previousEnd = addDays(start, -1)
    const previousStart = addDays(previousEnd, -(spanDays - 1))
    return {
      startDate: customStart,
      endDate: customEnd,
      previousStartDate: toIsoDate(previousStart),
      previousEndDate: toIsoDate(previousEnd),
      label: PRESET_LABELS.custom,
    }
  }

  const rangeDaysByPreset: Record<Exclude<DateRangePreset, 'custom'>, number> = {
    today: 0,
    last7Days: 6,
    last30Days: 29,
    last3Months: 89,
    last12Months: 364,
  }

  const spanDays = rangeDaysByPreset[key]
  const end = daysAgo(0)
  const start = daysAgo(spanDays)
  const previousEnd = addDays(start, -1)
  const previousStart = addDays(previousEnd, -spanDays)

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
    previousStartDate: toIsoDate(previousStart),
    previousEndDate: toIsoDate(previousEnd),
    label: PRESET_LABELS[key],
  }
}
