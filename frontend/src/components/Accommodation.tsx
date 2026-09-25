'use client'

import { motion } from 'framer-motion'
import { BedDouble, Waves as PoolIcon, Home, ExternalLink } from 'lucide-react'
import { trackBookingComClick } from '@/lib/analytics'

const features = [
  { icon: BedDouble, text: 'Four comfortable rooms' },
  { icon: PoolIcon, text: 'Private swimming pool access' },
  { icon: Home, text: 'A relaxed home base for your trip' },
]

export default function Accommodation() {
  return (
    <section id="stay" className="bg-sand py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&q=80"
            alt="Parrot Perch Villa swimming pool surrounded by palm trees"
            className="h-[420px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[500px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="order-1 lg:order-2"
        >
          <p className="surf-report text-lagoon">Parrot Perch Villa</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ocean-deep sm:text-5xl">
            Need a Place to Stay?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            After a day of beach, food, and surfing at Bar Utopia, unwind at Parrot Perch Villa —
            a separate accommodation just for our guests, with comfortable rooms and a pool to
            cool off in.
          </p>
          <ul className="mt-8 space-y-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <li key={f.text} className="flex items-center gap-3 text-ink/80">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-palm/15 text-palm">
                    <Icon className="h-5 w-5" />
                  </span>
                  {f.text}
                </li>
              )
            })}
          </ul>
          <a
            href= "https://www.booking.com/hotel/lk/parrot-perch-villa-dickwella.html?label=gen173nr-10CBkoggI46AdIM1gEaIUBiAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBqAIBuAL4lKLTBsACAdICJDcwMzMzYWNhLWUwNzctNDdlMy1iZjgxLWJhMmQwZTJmOGQ0YtgCAeACAQ&sid=3ea5fa98349e3e7c6c35a9b64f4e3537"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingComClick('accommodation_section')}
            className="focus-ring mt-10 inline-flex items-center gap-2 rounded-full bg-ocean-deep px-7 py-4 text-sm font-semibold text-sand shadow-soft transition-transform hover:scale-105"
          >
            Check Availability &amp; Book Your Stay
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-3 text-xs text-ink/50">
            Booking and payment are handled securely via Booking.com.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
