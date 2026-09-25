/**
 * Shared response shapes for the /api/analytics/* routes. Kept dependency-free
 * so both the server (query builders) and the client (admin UI) can import
 * them without pulling in the Google API client.
 */

export interface MetricWithTrend {
  value: number
  previousValue: number
  changePercent: number | null
}

export interface OverviewMetrics {
  totalUsers: MetricWithTrend
  newUsers: MetricWithTrend
  returningUsers: MetricWithTrend
  sessions: MetricWithTrend
  pageViews: MetricWithTrend
  avgEngagementTimeSeconds: MetricWithTrend
  engagementRate: MetricWithTrend
}

export interface TrafficTrendPoint {
  date: string
  users: number
  newUsers: number
  returningUsers: number
  sessions: number
  pageViews: number
}

export interface TrafficResponse {
  trend: TrafficTrendPoint[]
}

export interface PopularPage {
  path: string
  title: string
  views: number
  users: number
  avgEngagementTimeSeconds: number
}

export interface TrafficSourceRow {
  channel: string
  users: number
  sessions: number
  engagementRate: number
}

export interface DeviceRow {
  category: string
  users: number
  percentage: number
}

export interface NamedCountRow {
  name: string
  users: number
}

export interface DeviceResponse {
  devices: DeviceRow[]
  browsers: NamedCountRow[]
  operatingSystems: NamedCountRow[]
}

export interface GeoRow {
  country: string
  city: string
  users: number
  sessions: number
}

export interface MenuBehaviorResponse {
  categories: { name: string; views: number }[]
  items: { name: string; interactions: number }[]
}

export interface SurfPackageBehaviorResponse {
  packages: { name: string; views: number }[]
  ctaClicks: { name: string; clicks: number }[]
  totalInteractions: number
  mostPopularPackage: string | null
  mostClickedCta: string | null
}

export interface InteractionEventsResponse {
  contactClicks: number
  phoneClicks: number
  emailClicks: number
  whatsappClicks: number
  mapClicks: number
  bookingComClicks: number
  heroCtaClicks: number
  socialLinkClicks: { network: string; clicks: number }[]
  scrollDepth: { threshold: string; users: number }[]
}

export interface JourneyStage {
  stage: string
  users: number
  continuePercent: number | null
  dropoffPercent: number | null
}

export interface JourneyResponse {
  stages: JourneyStage[]
}

export interface AnalyticsSummary {
  visitors7d: number
  pageViews7d: number
  mostPopularPage: string | null
  topTrafficSource: string | null
}
