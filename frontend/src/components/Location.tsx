'use client'

import { motion } from 'framer-motion'
import { Navigation } from 'lucide-react'
import { CONTACT_INFO, MAP_EMBED_URL } from '@backend/data/socialLinks'
import { trackMapClick } from '@/lib/analytics'

export default function Location() {
  return (
    <section className="bg-sand py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon">Find Us</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ocean-deep sm:text-5xl">
            On the Beach, Easy to Find
          </h2>
          <p className="mt-4 text-ink/70">{CONTACT_INFO.address}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] shadow-soft"
        >
          <iframe
            title="Bar Utopia location map"
            src={MAP_EMBED_URL}
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <div className="mt-8 flex justify-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              CONTACT_INFO.address,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMapClick}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean-deep px-7 py-3.5 text-sm font-semibold text-sand shadow-soft transition-transform hover:scale-105"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
        </div>
      </div>
    </section>
  )
}
