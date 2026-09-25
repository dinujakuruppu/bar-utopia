import { NextResponse } from 'next/server'
import { guardAnalyticsRequest } from '@backend/lib/googleAnalytics/requestHelpers'
import { getMenuBehavior, getSurfPackageBehavior, getInteractionEvents } from '@backend/lib/googleAnalytics/queries'
import { toErrorResponse } from '@backend/lib/api'

export async function GET(request: Request) {
  try {
    const dateRange = await guardAnalyticsRequest(request)
    const [menu, surfPackages, interactions] = await Promise.all([
      getMenuBehavior(dateRange),
      getSurfPackageBehavior(dateRange),
      getInteractionEvents(dateRange),
    ])
    return NextResponse.json({ dateRange, data: { menu, surfPackages, interactions } })
  } catch (error) {
    return toErrorResponse(error)
  }
}
