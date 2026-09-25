import { NextResponse } from 'next/server'
import { createClient } from '@backend/lib/supabase/server'
import { assertNoDbError, readJson, requireAdmin, toErrorResponse } from '@backend/lib/api'
import { galleryImageFromBody, toGalleryImage } from '@backend/lib/mappers'
import { nextSortOrder } from '@backend/lib/sort'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order')
      .order('id')
    assertNoDbError(error)
    return NextResponse.json((data ?? []).map(toGalleryImage))
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin()
    const values = galleryImageFromBody(await readJson(request))

    const { data, error } = await supabase
      .from('gallery_images')
      .insert({ ...values, sort_order: await nextSortOrder(supabase, 'gallery_images') })
      .select('*')
      .single()

    assertNoDbError(error)
    return NextResponse.json(toGalleryImage(data!), { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
