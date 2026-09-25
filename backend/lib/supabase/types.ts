/**
 * Hand-written mirror of supabase/schema.sql.
 *
 * If you change the schema, change this file too — it is what gives every
 * `.from('menu_items')` call its types. (You can also regenerate it with
 * `npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts`.)
 */

export type MenuItemRow = {
  id: number
  name: string
  description: string
  category: string
  image: string
  price: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type SurfPackageRow = {
  id: number
  name: string
  price: string
  price_note: string | null
  includes: string[]
  excludes: string[]
  cta: string
  highlighted: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type GalleryImageRow = {
  id: number
  src: string
  alt: string
  category: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type SiteSettingsRow = {
  id: number
  instagram_url: string
  facebook_url: string
  tripadvisor_url: string
  booking_url: string
  contact_address: string
  contact_phone: string
  contact_email: string
  contact_hours: string
  map_embed_url: string
  updated_at: string
}

type Writable<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>

/**
 * Note: every type here is a `type` alias, not an `interface`. supabase-js
 * constrains schemas to `Record<string, unknown>`, which interfaces do not
 * satisfy (they have no implicit index signature) — using one silently
 * degrades every query's types to `never`.
 */

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: MenuItemRow
        Insert: Partial<Writable<MenuItemRow>> & Pick<MenuItemRow, 'name' | 'category'>
        Update: Partial<Writable<MenuItemRow>>
        Relationships: []
      }
      surf_packages: {
        Row: SurfPackageRow
        Insert: Partial<Writable<SurfPackageRow>> & Pick<SurfPackageRow, 'name'>
        Update: Partial<Writable<SurfPackageRow>>
        Relationships: []
      }
      gallery_images: {
        Row: GalleryImageRow
        Insert: Partial<Writable<GalleryImageRow>> & Pick<GalleryImageRow, 'src' | 'category'>
        Update: Partial<Writable<GalleryImageRow>>
        Relationships: []
      }
      site_settings: {
        Row: SiteSettingsRow
        Insert: Partial<Omit<SiteSettingsRow, 'updated_at'>>
        Update: Partial<Omit<SiteSettingsRow, 'updated_at'>>
        Relationships: []
      }
      admins: {
        Row: { email: string; created_at: string }
        Insert: { email: string }
        Update: { email?: string }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
