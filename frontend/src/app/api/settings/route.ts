import { NextResponse } from 'next/server'
import { createClient } from '@backend/lib/supabase/server'
import { assertNoDbError, readJson, requireAdmin, toErrorResponse } from '@backend/lib/api'
import { siteSettingsFromBody, toSiteSettings } from '@backend/lib/mappers'
import { fallbackContent } from '@backend/lib/content'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    assertNoDbError(error)
    return NextResponse.json(data ? toSiteSettings(data) : fallbackContent.settings)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const { supabase } = await requireAdmin()
    const values = siteSettingsFromBody(await readJson(request))

    // Upsert rather than update: the settings row is created by seed.sql, but a
    // project set up without the seed should still be able to save.
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...values })
      .select('*')
      .single()

    assertNoDbError(error)
    return NextResponse.json(toSiteSettings(data!))
  } catch (error) {
    return toErrorResponse(error)
  }
}
