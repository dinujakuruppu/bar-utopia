import { NextResponse } from 'next/server'
import {
  ApiError,
  assertNoDbError,
  parseId,
  readJson,
  requireAdmin,
  toErrorResponse,
  type RouteContext,
} from '@backend/lib/api'
import { surfPackageFromBody, toSurfPackage } from '@backend/lib/mappers'

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { supabase } = await requireAdmin()
    const id = parseId((await params).id)
    const values = surfPackageFromBody(await readJson(request))

    const { data, error } = await supabase
      .from('surf_packages')
      .update(values)
      .eq('id', id)
      .select('*')
      .maybeSingle()

    assertNoDbError(error)
    if (!data) throw new ApiError('That surf package no longer exists.', 404)
    return NextResponse.json(toSurfPackage(data))
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { supabase } = await requireAdmin()
    const id = parseId((await params).id)

    const { data, error } = await supabase
      .from('surf_packages')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    assertNoDbError(error)
    if (!data) throw new ApiError('That surf package no longer exists.', 404)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}
