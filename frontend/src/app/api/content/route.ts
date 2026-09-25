import { NextResponse } from 'next/server'
import { getSiteContent } from '@backend/lib/content'
import { readJson, requireAdmin, toErrorResponse } from '@backend/lib/api'
import { parseContentPayload, replaceAllContent } from '@backend/lib/replace'

/** The whole site payload — used to refresh the admin panel after a bulk change. */
export async function GET() {
  try {
    return NextResponse.json(await getSiteContent())
  } catch (error) {
    return toErrorResponse(error)
  }
}

/** Import: replaces every piece of content with an exported backup file. */
export async function PUT(request: Request) {
  try {
    const { supabase } = await requireAdmin()
    const payload = parseContentPayload(await readJson(request))
    await replaceAllContent(supabase, payload)
    return NextResponse.json(await getSiteContent())
  } catch (error) {
    return toErrorResponse(error)
  }
}
