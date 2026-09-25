import { NextResponse } from 'next/server'
import { ApiError, requireAdmin, toErrorResponse } from '@backend/lib/api'

const BUCKET = 'site-images'
const MAX_BYTES = 8 * 1024 * 1024

// Extensions are derived from the MIME type rather than the uploaded filename,
// so a file called "photo.jpg.html" cannot be stored as HTML on our origin.
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

/** Accepts one image from the admin panel and returns its public URL. */
export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin()

    const form = await request.formData().catch(() => {
      throw new ApiError('Expected a file upload.', 400)
    })
    const file = form.get('file')

    if (!(file instanceof File)) throw new ApiError('No file was included.', 400)

    const extension = ALLOWED[file.type]
    if (!extension) {
      throw new ApiError('Please upload a JPG, PNG, WebP, AVIF, or GIF image.', 415)
    }
    if (file.size > MAX_BYTES) {
      throw new ApiError('That image is larger than 8 MB. Please compress it and try again.', 413)
    }

    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })

    if (error) {
      const message = error.message.toLowerCase()
      if (message.includes('bucket') && message.includes('not found')) {
        throw new ApiError(
          `The "${BUCKET}" storage bucket does not exist yet. Run supabase/schema.sql — see SETUP.md.`,
          500,
        )
      }
      if (message.includes('row-level security') || message.includes('unauthorized')) {
        throw new ApiError('Your account is not allowed to upload images.', 403)
      }
      throw new ApiError(error.message, 400)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({ url: publicUrl }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
