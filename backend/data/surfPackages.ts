import type { SurfPackage } from '../types'

export const surfPackages: SurfPackage[] = [
  {
    id: 1,
    name: 'Beginner Package',
    price: 'Rs. 5,000',
    includes: ['Surfing lessons', 'Surfboard'],
    cta: 'Choose Beginner',
  },
  {
    id: 2,
    name: 'Intermediate Package',
    price: 'Rs. 7,000',
    includes: ['Surfing lessons', 'Surfboard'],
    cta: 'Choose Intermediate',
    highlighted: true,
  },
  {
    id: 3,
    name: 'Surfboard Only',
    price: 'Rs. 1,000',
    priceNote: '/ hour',
    includes: ['Surfboard rental'],
    excludes: ['No teacher included'],
    cta: 'Rent a Surfboard',
  },
]
