import { NextResponse } from 'next/server'
import { createClient } from '@backend/lib/supabase/server'
import { assertNoDbError, readJson, requireAdmin, toErrorResponse } from '@backend/lib/api'
import { surfPackageFromBody, toSurfPackage } from '@backend/lib/mappers'
import { nextSortOrder } from '@backend/lib/sort'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('surf_packages')
      .select('*')
      .order('sort_order')
      .order('id')
    assertNoDbError(error)
    return NextResponse.json((data ?? []).map(toSurfPackage))
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin()
    const values = surfPackageFromBody(await readJson(request))

    const { data, error } = await supabase
      .from('surf_packages')
      .insert({ ...values, sort_order: await nextSortOrder(supabase, 'surf_packages') })
      .select('*')
      .single()

    assertNoDbError(error)
    return NextResponse.json(toSurfPackage(data!), { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
