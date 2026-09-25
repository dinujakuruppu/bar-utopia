'use client'

import { motion } from 'framer-motion'
import { Palmtree, UtensilsCrossed, Fish, Waves, Sun, HeartHandshake } from 'lucide-react'

const reasons = [
  { icon: Palmtree, title: 'Beautiful Beachfront Location', text: 'Right on the sand, facing the open ocean.' },
  { icon: UtensilsCrossed, title: 'Quality Food', text: 'Thoughtfully prepared dishes, always fresh.' },
  { icon: Fish, title: 'Fresh Seafood', text: 'Daily catch from local waters.' },
  { icon: Waves, title: 'Surfing Experiences', text: 'Lessons and rentals for every level.' },
  { icon: Sun, title: 'Free Sunbeds', text: 'No cost, no pressure — just relax.' },
  { icon: HeartHandshake, title: 'Friendly Staff', text: 'Warm, genuine hospitality throughout your visit.' },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-sand py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon">Why Bar Utopia</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ocean-deep sm:text-5xl">
            Why Choose Bar Utopia
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = r.icon
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-3xl bg-white p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lagoon/15 text-lagoon">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ocean-deep">{r.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{r.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
