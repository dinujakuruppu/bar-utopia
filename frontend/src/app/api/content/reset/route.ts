import { NextResponse } from 'next/server'
import { fallbackContent, getSiteContent } from '@backend/lib/content'
import { requireAdmin, toErrorResponse } from '@backend/lib/api'
import { replaceAllContent, toPayload } from '@backend/lib/replace'

/** Restores the original demo content that shipped with the site. */
export async function POST() {
  try {
    const { supabase } = await requireAdmin()
    await replaceAllContent(supabase, toPayload(fallbackContent))
    return NextResponse.json(await getSiteContent())
  } catch (error) {
    return toErrorResponse(error)
  }
}
