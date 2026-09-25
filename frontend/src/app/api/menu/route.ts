import { NextResponse } from 'next/server'
import { createClient } from '@backend/lib/supabase/server'
import { assertNoDbError, readJson, requireAdmin, toErrorResponse } from '@backend/lib/api'
import { menuItemFromBody, toMenuItem } from '@backend/lib/mappers'
import { nextSortOrder } from '@backend/lib/sort'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order')
      .order('id')
    assertNoDbError(error)
    return NextResponse.json((data ?? []).map(toMenuItem))
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin()
    const values = menuItemFromBody(await readJson(request))

    const { data, error } = await supabase
      .from('menu_items')
      // New items go to the bottom of the list, matching the old array append.
      .insert({ ...values, sort_order: await nextSortOrder(supabase, 'menu_items') })
      .select('*')
      .single()

    assertNoDbError(error)
    return NextResponse.json(toMenuItem(data!), { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
