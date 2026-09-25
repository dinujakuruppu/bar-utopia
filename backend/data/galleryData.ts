import type { GalleryImage, GalleryCategory } from '../types'

export const GALLERY_CATEGORIES: (GalleryCategory | 'All')[] = [
  'All',
  'Beach',
  'Restaurant',
  'Food',
  'Drinks',
  'Surfing',
  'Sunbeds',
  'Accommodation',
]

export const galleryData: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Turquoise ocean waves rolling onto a sandy beach',
    category: 'Beach',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    alt: 'Aerial view of a tropical beach coastline',
    category: 'Beach',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    alt: 'Beachfront restaurant seating at sunset',
    category: 'Restaurant',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    alt: 'Open-air restaurant dining tables by the sea',
    category: 'Restaurant',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grilled whole fish plated with lime and herbs',
    category: 'Food',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Fresh tropical vegan bowl with mango and avocado',
    category: 'Food',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=80',
    alt: 'Tropical cocktail garnished with lime and mint',
    category: 'Drinks',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
    alt: 'Refreshing fruit mocktail on a beach bar counter',
    category: 'Drinks',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=1200&q=80',
    alt: 'Surfer paddling out into the waves',
    category: 'Surfing',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=1200&q=80',
    alt: 'Surfboards lined up on the sand',
    category: 'Surfing',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1531722569936-825d3dd91b15?auto=format&fit=crop&w=1200&q=80',
    alt: 'Surfer riding a breaking wave',
    category: 'Surfing',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Rows of sunbeds facing the ocean',
    category: 'Sunbeds',
  },
  {
    id: 13,
    src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sunbeds and umbrellas on a quiet beach',
    category: 'Sunbeds',
  },
  {
    id: 14,
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Villa swimming pool surrounded by palm trees',
    category: 'Accommodation',
  },
  {
    id: 15,
    src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bright tropical villa bedroom interior',
    category: 'Accommodation',
  },
]
