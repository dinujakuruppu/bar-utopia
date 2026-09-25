import 'server-only'

import type { SiteContent } from '../types'
import { createClient } from './supabase/server'
import { isSupabaseConfigured } from './supabase/env'
import { toGalleryImage, toMenuItem, toSiteSettings, toSurfPackage } from './mappers'

import { menuData } from '../data/menuData'
import { surfPackages } from '../data/surfPackages'
import { galleryData } from '../data/galleryData'
import {
  SOCIAL_LINKS,
  BOOKING_URL,
  CONTACT_INFO,
  MAP_EMBED_URL,
} from '../data/socialLinks'

/**
 * The content that shipped with the original static build. Used only as a
 * fallback so the site still renders (and `next build` still succeeds) before
 * Supabase credentials are in place — see SETUP.md.
 */
export const fallbackContent: SiteContent = {
  menuItems: menuData,
  surfPackages,
  galleryImages: galleryData,
  settings: {
    social: SOCIAL_LINKS,
    bookingUrl: BOOKING_URL,
    contact: CONTACT_INFO,
    mapEmbedUrl: MAP_EMBED_URL,
  },
}

/**
 * Loads everything the site renders in one round of parallel queries.
 *
 * Reads go through the anon key against RLS's "public read" policies, so this
 * works for logged-out visitors and admins alike.
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) return fallbackContent

  const supabase = await createClient()

  const [menu, surf, gallery, settings] = await Promise.all([
    supabase.from('menu_items').select('*').order('sort_order').order('id'),
    supabase.from('surf_packages').select('*').order('sort_order').order('id'),
    supabase.from('gallery_images').select('*').order('sort_order').order('id'),
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
  ])

  const firstError = menu.error ?? surf.error ?? gallery.error ?? settings.error
  if (firstError) {
    // A misconfigured project should not blank out the whole website.
    console.error('[bar-utopia] Supabase read failed, serving fallback content:', firstError.message)
    return fallbackContent
  }

  return {
    menuItems: (menu.data ?? []).map(toMenuItem),
    surfPackages: (surf.data ?? []).map(toSurfPackage),
    galleryImages: (gallery.data ?? []).map(toGalleryImage),
    settings: settings.data ? toSiteSettings(settings.data) : fallbackContent.settings,
  }
}
