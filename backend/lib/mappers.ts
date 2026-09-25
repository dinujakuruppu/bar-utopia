/**
 * Translation layer between Postgres rows (snake_case, nullable) and the
 * camelCase shapes the React components have always used. Keeping this in one
 * place is what let the existing components stay untouched.
 */

import type {
  GalleryImage,
  GalleryCategory,
  MenuCategory,
  MenuItem,
  SiteSettings,
  SurfPackage,
} from '../types'
import type {
  GalleryImageRow,
  MenuItemRow,
  SiteSettingsRow,
  SurfPackageRow,
} from './supabase/types'
import { MENU_CATEGORIES } from '../data/menuData'
import { GALLERY_CATEGORIES } from '../data/galleryData'

const GALLERY_ONLY = GALLERY_CATEGORIES.filter((c): c is GalleryCategory => c !== 'All')

// ---------------------------------------------------------------------------
// Row → app
// ---------------------------------------------------------------------------

export function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as MenuCategory,
    image: row.image,
    // The DB stores "no price" as NULL; the UI has always used '' / undefined.
    price: row.price ?? '',
  }
}

export function toSurfPackage(row: SurfPackageRow): SurfPackage {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    priceNote: row.price_note ?? undefined,
    includes: row.includes ?? [],
    excludes: row.excludes?.length ? row.excludes : undefined,
    cta: row.cta,
    highlighted: row.highlighted,
  }
}

export function toGalleryImage(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    src: row.src,
    alt: row.alt,
    category: row.category as GalleryCategory,
  }
}

export function toSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    social: {
      instagram: row.instagram_url,
      facebook: row.facebook_url,
      tripadvisor: row.tripadvisor_url,
    },
    bookingUrl: row.booking_url,
    contact: {
      address: row.contact_address,
      phone: row.contact_phone,
      email: row.contact_email,
      hours: row.contact_hours,
    },
    mapEmbedUrl: row.map_embed_url,
  }
}

// ---------------------------------------------------------------------------
// Request body → row
//
// Every API route runs its payload through these. They throw ValidationError on
// bad input, which the route turns into a 400 with a readable message.
// ---------------------------------------------------------------------------

export class ValidationError extends Error {}

function str(value: unknown, field: string, { required = false } = {}): string {
  if (typeof value !== 'string') {
    if (value == null && !required) return ''
    throw new ValidationError(`"${field}" must be text.`)
  }
  const trimmed = value.trim()
  if (required && !trimmed) throw new ValidationError(`"${field}" is required.`)
  return trimmed
}

function strArray(value: unknown, field: string): string[] {
  if (value == null) return []
  if (!Array.isArray(value)) throw new ValidationError(`"${field}" must be a list.`)
  return value.map((v) => str(v, field)).filter(Boolean)
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], field: string): T {
  const s = str(value, field, { required: true })
  if (!allowed.includes(s as T)) {
    throw new ValidationError(`"${field}" must be one of: ${allowed.join(', ')}.`)
  }
  return s as T
}

export function menuItemFromBody(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  const price = str(b.price, 'price')
  return {
    name: str(b.name, 'name', { required: true }),
    description: str(b.description, 'description'),
    category: oneOf(b.category, MENU_CATEGORIES, 'category'),
    image: str(b.image, 'image'),
    price: price || null,
  }
}

export function surfPackageFromBody(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  const note = str(b.priceNote, 'priceNote')
  return {
    name: str(b.name, 'name', { required: true }),
    price: str(b.price, 'price'),
    price_note: note || null,
    includes: strArray(b.includes, 'includes'),
    excludes: strArray(b.excludes, 'excludes'),
    cta: str(b.cta, 'cta'),
    highlighted: Boolean(b.highlighted),
  }
}

export function galleryImageFromBody(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    src: str(b.src, 'src', { required: true }),
    alt: str(b.alt, 'alt'),
    category: oneOf(b.category, GALLERY_ONLY, 'category'),
  }
}

export function siteSettingsFromBody(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  const social = (b.social ?? {}) as Record<string, unknown>
  const contact = (b.contact ?? {}) as Record<string, unknown>
  return {
    instagram_url: str(social.instagram, 'social.instagram'),
    facebook_url: str(social.facebook, 'social.facebook'),
    tripadvisor_url: str(social.tripadvisor, 'social.tripadvisor'),
    booking_url: str(b.bookingUrl, 'bookingUrl'),
    contact_address: str(contact.address, 'contact.address'),
    contact_phone: str(contact.phone, 'contact.phone'),
    contact_email: str(contact.email, 'contact.email'),
    contact_hours: str(contact.hours, 'contact.hours'),
    map_embed_url: str(b.mapEmbedUrl, 'mapEmbedUrl'),
  }
}
