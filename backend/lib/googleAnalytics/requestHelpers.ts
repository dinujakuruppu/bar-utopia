import { requireAdmin } from '../api'
import { isGoogleAnalyticsConfigured, GoogleAnalyticsConfigError } from './env'
import { resolveDateRange, type ResolvedDateRange } from './dateRanges'

/**
 * Shared guard for every /api/analytics/* route:
 *  1. Requires an authenticated, allow-listed admin (reuses the same check
 *     every other admin write endpoint uses).
 *  2. Confirms GA4 service-account credentials are present, so routes fail
 *     with a clear "not configured yet" message instead of a crash.
 *  3. Parses the date range query params (`range`, `start`, `end`).
 */
export async function guardAnalyticsRequest(request: Request): Promise<ResolvedDateRange> {
  await requireAdmin()

  if (!isGoogleAnalyticsConfigured()) {
    throw new GoogleAnalyticsConfigError(
      'Google Analytics is not connected yet. Add GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY ' +
        'to your environment variables — see ANALYTICS.md for setup instructions.',
    )
  }

  const { searchParams } = new URL(request.url)
  return resolveDateRange(searchParams.get('range'), searchParams.get('start'), searchParams.get('end'))
}
