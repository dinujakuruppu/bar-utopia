import type { SupabaseClient } from '@supabase/supabase-js'
import type { SiteContent } from '../types'
import type { Database } from './supabase/types'
import { assertNoDbError, ApiError } from './api'
import {
  galleryImageFromBody,
  menuItemFromBody,
  siteSettingsFromBody,
  surfPackageFromBody,
} from './mappers'

type Client = SupabaseClient<Database>

/**
 * Validates a whole-site content payload (an exported backup, or the original
 * demo content) without touching the database, so a bad file is rejected before
 * anything is deleted.
 */
export function parseContentPayload(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>

  if (
    !Array.isArray(b.menuItems) ||
    !Array.isArray(b.surfPackages) ||
    !Array.isArray(b.galleryImages) ||
    typeof b.settings !== 'object' ||
    b.settings === null
  ) {
    throw new ApiError(
      'File is missing one of: menuItems, surfPackages, galleryImages, settings.',
      400,
    )
  }

  return {
    menuItems: b.menuItems.map((item, i) => ({ ...menuItemFromBody(item), sort_order: i + 1 })),
    surfPackages: b.surfPackages.map((pkg, i) => ({
      ...surfPackageFromBody(pkg),
      sort_order: i + 1,
    })),
    galleryImages: b.galleryImages.map((img, i) => ({
      ...galleryImageFromBody(img),
      sort_order: i + 1,
    })),
    settings: siteSettingsFromBody(b.settings),
  }
}

/**
 * Replaces all site content in one go, used by Import and Reset.
 *
 * Note this is a sequence of statements rather than a single transaction —
 * PostgREST has no multi-statement transaction. Rows are inserted before the
 * old ones are removed where possible, and the whole thing is admin-only, so
 * the realistic failure mode is a partial restore that can simply be re-run.
 */
export async function replaceAllContent(supabase: Client, content: ReturnType<typeof parseContentPayload>) {
  for (const table of ['menu_items', 'surf_packages', 'gallery_images'] as const) {
    // `.delete()` refuses to run without a filter; every id is >= 1.
    const { error } = await supabase.from(table).delete().gte('id', 1)
    assertNoDbError(error)
  }

  if (content.menuItems.length) {
    const { error } = await supabase.from('menu_items').insert(content.menuItems)
    assertNoDbError(error)
  }
  if (content.surfPackages.length) {
    const { error } = await supabase.from('surf_packages').insert(content.surfPackages)
    assertNoDbError(error)
  }
  if (content.galleryImages.length) {
    const { error } = await supabase.from('gallery_images').insert(content.galleryImages)
    assertNoDbError(error)
  }

  const { error } = await supabase.from('site_settings').upsert({ id: 1, ...content.settings })
  assertNoDbError(error)
}

/** Shapes the in-app default content the same way an uploaded backup is shaped. */
export function toPayload(content: SiteContent) {
  return parseContentPayload(content as unknown)
}
