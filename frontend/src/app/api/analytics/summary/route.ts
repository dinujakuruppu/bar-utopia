import { NextResponse } from 'next/server'
import { requireAdmin } from '@backend/lib/api'
import { isGoogleAnalyticsConfigured, GoogleAnalyticsConfigError } from '@backend/lib/googleAnalytics/env'
import { getAnalyticsSummary } from '@backend/lib/googleAnalytics/queries'
import { toErrorResponse } from '@backend/lib/api'

/** Small last-7-days snapshot for the main /admin dashboard widget. */
export async function GET() {
  try {
    await requireAdmin()
    if (!isGoogleAnalyticsConfigured()) {
      throw new GoogleAnalyticsConfigError(
        'Google Analytics is not connected yet. Add GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY to enable analytics.',
      )
    }
    const data = await getAnalyticsSummary()
    return NextResponse.json({ data })
  } catch (error) {
    return toErrorResponse(error)
  }
}
