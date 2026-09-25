import { NextResponse } from 'next/server'
import { guardAnalyticsRequest } from '@backend/lib/googleAnalytics/requestHelpers'
import { getUserJourney } from '@backend/lib/googleAnalytics/queries'
import { toErrorResponse } from '@backend/lib/api'

export async function GET(request: Request) {
  try {
    const dateRange = await guardAnalyticsRequest(request)
    const data = await getUserJourney(dateRange)
    return NextResponse.json({ dateRange, data })
  } catch (error) {
    return toErrorResponse(error)
  }
}
