export type MenuCategory =
  | 'Food'
  | 'Seafood'
  | 'Vegan'
  | 'Vegetarian'
  | 'Cocktails'
  | 'Mocktails'
  | 'Hot Drinks'
  | 'Cold Drinks'
  | 'Coffee'

export interface MenuItem {
  id: number
  name: string
  description: string
  category: MenuCategory
  image: string
  price?: string
}

export interface SurfPackage {
  id: number
  name: string
  price: string
  priceNote?: string
  includes: string[]
  excludes?: string[]
  cta: string
  highlighted?: boolean
}

export type GalleryCategory =
  | 'Beach'
  | 'Restaurant'
  | 'Food'
  | 'Drinks'
  | 'Surfing'
  | 'Sunbeds'
  | 'Accommodation'

export interface GalleryImage {
  id: number
  src: string
  alt: string
  category: GalleryCategory
}

export interface SocialLinks {
  instagram: string
  facebook: string
  tripadvisor?: string
}

export interface NavLink {
  label: string
  href: string
}

export interface ContactInfo {
  address: string
  phone: string
  email: string
  hours: string
}

export interface SiteSettings {
  social: SocialLinks
  bookingUrl: string
  contact: ContactInfo
  mapEmbedUrl: string
}

/** Everything the public site and the admin panel render, as one payload. */
export interface SiteContent {
  menuItems: MenuItem[]
  surfPackages: SurfPackage[]
  galleryImages: GalleryImage[]
  settings: SiteSettings
}
