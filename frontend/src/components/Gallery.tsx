'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { GALLERY_CATEGORIES } from '@backend/data/galleryData'
import { useData } from '../store/DataContext'
import type { GalleryCategory } from '@backend/types'
import { trackViewGallery } from '@/lib/analytics'

export default function Gallery() {
  const { galleryImages } = useData()
  const [active, setActive] = useState<GalleryCategory | 'All'>('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const images = active === 'All' ? galleryImages : galleryImages.filter((g) => g.category === active)

  const openLightbox = (id: number) => {
    const idx = images.findIndex((img) => img.id === id)
    setLightboxIndex(idx)
  }

  const closeLightbox = () => setLightboxIndex(null)

  const showNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length))

  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))

  return (
    <motion.section
      id="gallery"
      className="bg-ocean-deep py-24 text-sand"
      onViewportEnter={() => trackViewGallery()}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon-light">Gallery</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            The Bar Utopia Experience
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActive(cat)
                trackViewGallery(cat)
              }}
              className={`focus-ring rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active === cat ? 'bg-coral text-sand' : 'glass text-sand/80 hover:text-sand'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {images.map((img) => (
            <motion.button
              key={img.id}
              layout
              onClick={() => openLightbox(img.id)}
              className="focus-ring group block w-full overflow-hidden rounded-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
            onClick={closeLightbox}
          >
            <button
              aria-label="Close"
              onClick={closeLightbox}
              className="focus-ring absolute right-6 top-6 text-sand"
            >
              <X className="h-8 w-8" />
            </button>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
              className="focus-ring absolute left-4 text-sand sm:left-8"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <motion.img
              key={images[lightboxIndex].id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-soft"
            />
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              className="focus-ring absolute right-4 text-sand sm:right-8"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
