'use client'

import { motion } from 'framer-motion'
import { UtensilsCrossed, Fish, Waves, Sun } from 'lucide-react'
import TideLine from './TideLine'

const highlights = [
  {
    icon: UtensilsCrossed,
    title: 'Beachfront Dining',
    description: 'Tables in the sand with uninterrupted ocean views, day into night.',
  },
  {
    icon: Fish,
    title: 'Fresh Seafood',
    description: 'Daily catch, grilled and served the way the ocean intended.',
  },
  {
    icon: Waves,
    title: 'Surf Experiences',
    description: 'Lessons, guidance, and board rental for every skill level.',
  },
  {
    icon: Sun,
    title: 'Free Sunbeds',
    description: 'No charge, no reservation. Just pick a spot and relax.',
    emphasized: true,
  },
]

export default function ExperienceHighlights() {
  return (
    <section className="relative bg-ocean-deep pb-20 pt-4">
      <TideLine color="#F6EEE0" />
      <div className="mx-auto -mt-2 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group rounded-3xl p-7 shadow-soft transition-transform duration-300 hover:-translate-y-2 ${
                item.emphasized
                  ? 'bg-coral text-sand'
                  : 'glass text-sand'
              }`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${
                  item.emphasized ? 'bg-sand/20' : 'bg-lagoon/30'
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className={`mt-2 text-sm ${item.emphasized ? 'text-sand/90' : 'text-sand/75'}`}>
                {item.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
