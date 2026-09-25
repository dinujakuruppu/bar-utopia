import 'server-only'
import { getAnalyticsDataClient } from './client'
import { gaPropertyId } from './env'
import { ApiError } from '../api'
import type { ResolvedDateRange } from './dateRanges'
import type {
  AnalyticsSummary,
  DeviceResponse,
  GeoRow,
  InteractionEventsResponse,
  JourneyResponse,
  JourneyStage,
  MenuBehaviorResponse,
  MetricWithTrend,
  OverviewMetrics,
  PopularPage,
  SurfPackageBehaviorResponse,
  TrafficResponse,
  TrafficSourceRow,
} from './types'

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

type Row = { dimensionValues?: { value?: string | null }[] | null; metricValues?: { value?: string | null }[] | null }

function num(row: Row | undefined, index: number): number {
  const raw = row?.metricValues?.[index]?.value
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) ? n : 0
}

function dim(row: Row, index: number): string {
  return row.dimensionValues?.[index]?.value ?? ''
}

/** Runs a single GA4 report against the configured property. */
async function runReport(request: {
  dateRanges: { startDate: string; endDate: string }[]
  dimensions?: { name: string }[]
  metrics: { name: string }[]
  dimensionFilter?: unknown
  orderBys?: unknown[]
  limit?: number
}) {
  const client = getAnalyticsDataClient()
  try {
    const [response] = await client.runReport({
      property: `properties/${gaPropertyId()}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(request as any),
    })
    return response
  } catch (error) {
    // Wrap the Google API client's gRPC error in something a human (and the
    // admin UI's error state) can actually act on.
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('PERMISSION_DENIED') || message.includes('permission')) {
      throw new ApiError(
        'The Google service account does not have access to this GA4 property. Grant it "Viewer" access in GA4 Admin → Property Access Management.',
        403,
      )
    }
    if (message.includes('NOT_FOUND') || message.includes('Requested entity was not found')) {
      throw new ApiError('GA_PROPERTY_ID does not match a Google Analytics 4 property. Double-check the property ID.', 400)
    }
    if (message.includes('UNAUTHENTICATED') || message.includes('invalid_grant') || message.includes('DECODER routines')) {
      throw new ApiError(
        'Could not authenticate with Google Analytics. Check GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.',
        401,
      )
    }
    throw new ApiError(`Google Analytics request failed: ${message}`, 502)
  }
}

function changePercent(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

function withTrend(current: number, previous: number): MetricWithTrend {
  return {
    value: Math.round(current * 100) / 100,
    previousValue: Math.round(previous * 100) / 100,
    changePercent: changePercent(current, previous),
  }
}

/** eventName IN (...) dimension filter, reused by the behavior/interaction/journey queries. */
function eventNameFilter(names: string[]) {
  return {
    filter: {
      fieldName: 'eventName',
      inListFilter: { values: names },
    },
  }
}

// ---------------------------------------------------------------------------
// 1. Overview cards
// ---------------------------------------------------------------------------

const OVERVIEW_METRICS = [
  { name: 'totalUsers' },
  { name: 'newUsers' },
  { name: 'sessions' },
  { name: 'screenPageViews' },
  { name: 'userEngagementDuration' },
  { name: 'engagementRate' },
  { name: 'activeUsers' },
] as const

export async function getOverviewMetrics(dateRange: ResolvedDateRange): Promise<OverviewMetrics> {
  const [current, previous] = await Promise.all([
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: OVERVIEW_METRICS as unknown as { name: string }[],
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.previousStartDate, endDate: dateRange.previousEndDate }],
      metrics: OVERVIEW_METRICS as unknown as { name: string }[],
    }),
  ])

  const c = current.rows?.[0]
  const p = previous.rows?.[0]

  const totalUsers = num(c, 0)
  const newUsers = num(c, 1)
  const sessions = num(c, 2)
  const pageViews = num(c, 3)
  const engagementDuration = num(c, 4)
  const engagementRate = num(c, 5) * 100
  const activeUsers = num(c, 6)

  const pTotalUsers = num(p, 0)
  const pNewUsers = num(p, 1)
  const pSessions = num(p, 2)
  const pPageViews = num(p, 3)
  const pEngagementDuration = num(p, 4)
  const pEngagementRate = num(p, 5) * 100

  const returningUsers = Math.max(totalUsers - newUsers, 0)
  const pReturningUsers = Math.max(pTotalUsers - pNewUsers, 0)

  const avgEngagementTime = sessions > 0 ? engagementDuration / sessions : 0
  const pAvgEngagementTime = pSessions > 0 ? pEngagementDuration / pSessions : 0

  return {
    totalUsers: withTrend(totalUsers, pTotalUsers),
    newUsers: withTrend(newUsers, pNewUsers),
    returningUsers: withTrend(returningUsers, pReturningUsers),
    sessions: withTrend(sessions, pSessions),
    pageViews: withTrend(pageViews, pPageViews),
    avgEngagementTimeSeconds: withTrend(avgEngagementTime, pAvgEngagementTime),
    engagementRate: withTrend(engagementRate, pEngagementRate),
    // `activeUsers` is fetched for future use (e.g. real-time-ish context) but
    // not surfaced as its own card — totalUsers already covers the headline.
    ...(activeUsers >= 0 ? {} : {}),
  }
}

// ---------------------------------------------------------------------------
// 2. Traffic trend (users/sessions/page views over time + new vs returning)
// ---------------------------------------------------------------------------

export async function getTrafficTrend(dateRange: ResolvedDateRange): Promise<TrafficResponse> {
  const response = await runReport({
    dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
    dimensions: [{ name: 'date' }, { name: 'newVsReturning' }],
    metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  })

  const byDate = new Map<string, { users: number; newUsers: number; returningUsers: number; sessions: number; pageViews: number }>()

  for (const row of response.rows ?? []) {
    const rawDate = dim(row, 0)
    const formatted = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
    const segment = dim(row, 1)
    const users = num(row, 0)
    const sessions = num(row, 1)
    const pageViews = num(row, 2)

    const entry = byDate.get(formatted) ?? {
      users: 0,
      newUsers: 0,
      returningUsers: 0,
      sessions: 0,
      pageViews: 0,
    }
    entry.users += users
    entry.sessions += sessions
    entry.pageViews += pageViews
    if (segment === 'new') entry.newUsers += users
    else if (segment === 'returning') entry.returningUsers += users

    byDate.set(formatted, entry)
  }

  const trend = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }))

  return { trend }
}

// ---------------------------------------------------------------------------
// 3. Popular pages
// ---------------------------------------------------------------------------

export async function getPopularPages(dateRange: ResolvedDateRange): Promise<PopularPage[]> {
  const response = await runReport({
    dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'userEngagementDuration' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 15,
  })

  return (response.rows ?? []).map((row) => {
    const sessions = num(row, 3)
    const engagementDuration = num(row, 2)
    return {
      path: dim(row, 0),
      title: dim(row, 1) || dim(row, 0),
      views: num(row, 0),
      users: num(row, 1),
      avgEngagementTimeSeconds: sessions > 0 ? Math.round((engagementDuration / sessions) * 10) / 10 : 0,
    }
  })
}

// ---------------------------------------------------------------------------
// 4. Traffic sources
// ---------------------------------------------------------------------------

export async function getTrafficSources(dateRange: ResolvedDateRange): Promise<TrafficSourceRow[]> {
  const response = await runReport({
    dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagementRate' }],
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
  })

  return (response.rows ?? []).map((row) => ({
    channel: dim(row, 0) || 'Unassigned',
    users: num(row, 0),
    sessions: num(row, 1),
    engagementRate: Math.round(num(row, 2) * 1000) / 10,
  }))
}

// ---------------------------------------------------------------------------
// 5. Devices, browsers, OS
// ---------------------------------------------------------------------------

export async function getDeviceBreakdown(dateRange: ResolvedDateRange): Promise<DeviceResponse> {
  const [deviceRes, browserRes, osRes] = await Promise.all([
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'browser' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 6,
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'operatingSystem' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 6,
    }),
  ])

  const deviceRows = deviceRes.rows ?? []
  const totalDeviceUsers = deviceRows.reduce((sum, r) => sum + num(r, 0), 0)

  return {
    devices: deviceRows.map((row) => {
      const users = num(row, 0)
      return {
        category: dim(row, 0) || 'Unknown',
        users,
        percentage: totalDeviceUsers > 0 ? Math.round((users / totalDeviceUsers) * 1000) / 10 : 0,
      }
    }),
    browsers: (browserRes.rows ?? []).map((row) => ({ name: dim(row, 0) || 'Unknown', users: num(row, 0) })),
    operatingSystems: (osRes.rows ?? []).map((row) => ({ name: dim(row, 0) || 'Unknown', users: num(row, 0) })),
  }
}

// ---------------------------------------------------------------------------
// 6. Geography
// ---------------------------------------------------------------------------

export async function getGeography(dateRange: ResolvedDateRange): Promise<GeoRow[]> {
  const response = await runReport({
    dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
    dimensions: [{ name: 'country' }, { name: 'city' }],
    metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    limit: 20,
  })

  return (response.rows ?? []).map((row) => ({
    country: dim(row, 0) || 'Unknown',
    city: dim(row, 1) || 'Unknown',
    users: num(row, 0),
    sessions: num(row, 1),
  }))
}

// ---------------------------------------------------------------------------
// 7. Menu behavior (custom events)
// ---------------------------------------------------------------------------

export async function getMenuBehavior(dateRange: ResolvedDateRange): Promise<MenuBehaviorResponse> {
  const [categoryRes, itemRes] = await Promise.all([
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'customEvent:category' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: eventNameFilter(['view_menu_category']),
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'customEvent:item_name' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: eventNameFilter(['view_menu_item']),
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 10,
    }),
  ])

  return {
    categories: (categoryRes.rows ?? [])
      .filter((row) => dim(row, 0))
      .map((row) => ({ name: dim(row, 0), views: num(row, 0) })),
    items: (itemRes.rows ?? [])
      .filter((row) => dim(row, 0))
      .map((row) => ({ name: dim(row, 0), interactions: num(row, 0) })),
  }
}

// ---------------------------------------------------------------------------
// 8. Surf package behavior (custom events)
// ---------------------------------------------------------------------------

export async function getSurfPackageBehavior(
  dateRange: ResolvedDateRange,
): Promise<SurfPackageBehaviorResponse> {
  const [viewRes, ctaRes] = await Promise.all([
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'customEvent:package_name' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: eventNameFilter(['select_surf_package']),
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'customEvent:package_name' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: eventNameFilter(['surf_package_cta_click']),
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
  ])

  const packages = (viewRes.rows ?? [])
    .filter((row) => dim(row, 0))
    .map((row) => ({ name: dim(row, 0), views: num(row, 0) }))
  const ctaClicks = (ctaRes.rows ?? [])
    .filter((row) => dim(row, 0))
    .map((row) => ({ name: dim(row, 0), clicks: num(row, 0) }))

  const totalInteractions =
    packages.reduce((sum, p) => sum + p.views, 0) + ctaClicks.reduce((sum, c) => sum + c.clicks, 0)

  return {
    packages,
    ctaClicks,
    totalInteractions,
    mostPopularPackage: packages[0]?.name ?? null,
    mostClickedCta: ctaClicks[0]?.name ?? null,
  }
}

// ---------------------------------------------------------------------------
// 9. Contact / social / booking interaction events
// ---------------------------------------------------------------------------

const INTERACTION_EVENT_NAMES = [
  'contact_click',
  'phone_click',
  'email_click',
  'whatsapp_click',
  'map_click',
  'booking_com_click',
  'hero_cta_click',
  'social_link_click',
]

export async function getInteractionEvents(dateRange: ResolvedDateRange): Promise<InteractionEventsResponse> {
  const [eventRes, socialRes, scrollRes] = await Promise.all([
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: eventNameFilter(INTERACTION_EVENT_NAMES),
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'customEvent:network' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: eventNameFilter(['social_link_click']),
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
    runReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'customEvent:percent_scrolled' }],
      metrics: [{ name: 'totalUsers' }],
      dimensionFilter: eventNameFilter(['scroll_depth']),
      orderBys: [{ dimension: { dimensionName: 'customEvent:percent_scrolled' } }],
    }),
  ])

  const counts = new Map<string, number>()
  for (const row of eventRes.rows ?? []) counts.set(dim(row, 0), num(row, 0))

  return {
    contactClicks: counts.get('contact_click') ?? 0,
    phoneClicks: counts.get('phone_click') ?? 0,
    emailClicks: counts.get('email_click') ?? 0,
    whatsappClicks: counts.get('whatsapp_click') ?? 0,
    mapClicks: counts.get('map_click') ?? 0,
    bookingComClicks: counts.get('booking_com_click') ?? 0,
    heroCtaClicks: counts.get('hero_cta_click') ?? 0,
    socialLinkClicks: (socialRes.rows ?? [])
      .filter((row) => dim(row, 0))
      .map((row) => ({ network: dim(row, 0), clicks: num(row, 0) })),
    scrollDepth: (scrollRes.rows ?? [])
      .filter((row) => dim(row, 0))
      .map((row) => ({ threshold: `${dim(row, 0)}%`, users: num(row, 0) })),
  }
}

// ---------------------------------------------------------------------------
// 10. User journey / funnel
// ---------------------------------------------------------------------------

const JOURNEY_STAGE_DEFINITIONS: { stage: string; events: string[] }[] = [
  { stage: 'Website Visit', events: ['session_start'] },
  { stage: 'Homepage Interaction', events: ['hero_cta_click', 'scroll_depth'] },
  { stage: 'Menu View', events: ['view_menu'] },
  { stage: 'Surf Package View', events: ['view_surf_packages'] },
  { stage: 'Gallery View', events: ['view_gallery'] },
  { stage: 'Contact Interaction', events: ['contact_click', 'phone_click', 'email_click'] },
  { stage: 'External Booking.com Click', events: ['booking_com_click'] },
]

export async function getUserJourney(dateRange: ResolvedDateRange): Promise<JourneyResponse> {
  const allEventNames = Array.from(new Set(JOURNEY_STAGE_DEFINITIONS.flatMap((s) => s.events)))

  const response = await runReport({
    dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'activeUsers' }],
    dimensionFilter: eventNameFilter(allEventNames),
  })

  const usersByEvent = new Map<string, number>()
  for (const row of response.rows ?? []) usersByEvent.set(dim(row, 0), num(row, 0))

  const rawStages = JOURNEY_STAGE_DEFINITIONS.map(({ stage, events }) => ({
    stage,
    users: Math.max(...events.map((e) => usersByEvent.get(e) ?? 0)),
  }))

  const stages: JourneyStage[] = rawStages.map((s, i) => {
    if (i === 0) return { ...s, continuePercent: null, dropoffPercent: null }
    const prevUsers = rawStages[i - 1].users
    const continuePercent = prevUsers > 0 ? Math.round((s.users / prevUsers) * 1000) / 10 : null
    const dropoffPercent = continuePercent === null ? null : Math.round((100 - continuePercent) * 10) / 10
    return { ...s, continuePercent, dropoffPercent }
  })

  return { stages }
}

// ---------------------------------------------------------------------------
// 11. Small dashboard widget summary (last 7 days)
// ---------------------------------------------------------------------------

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const end = new Date()
  const start = new Date()
  start.setUTCDate(start.getUTCDate() - 6)
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const range = { startDate: iso(start), endDate: iso(end) }

  const [totals, pages, sources] = await Promise.all([
    runReport({ dateRanges: [range], metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }] }),
    runReport({
      dateRanges: [range],
      dimensions: [{ name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 1,
    }),
    runReport({
      dateRanges: [range],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 1,
    }),
  ])

  const totalsRow = totals.rows?.[0]

  return {
    visitors7d: num(totalsRow, 0),
    pageViews7d: num(totalsRow, 1),
    mostPopularPage: pages.rows?.[0] ? dim(pages.rows[0], 0) : null,
    topTrafficSource: sources.rows?.[0] ? dim(sources.rows[0], 0) : null,
  }
}
