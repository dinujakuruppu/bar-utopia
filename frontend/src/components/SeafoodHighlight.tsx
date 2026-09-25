'use client'

import { motion } from 'framer-motion'
import { menuData } from '@backend/data/menuData'

const seafoodPicks = menuData.filter((m) => m.category === 'Seafood')
const plantPicks = menuData.filter((m) => m.category === 'Vegan' || m.category === 'Vegetarian')

export default function SeafoodHighlight() {
  return (
    <section className="bg-ocean-deep py-24 text-sand">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon-light">Fresh From the Ocean</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Taste the Ocean</h2>
          <p className="mt-4 text-sand/75">
            Fresh flavors, beautiful surroundings, and the perfect beachfront dining experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {seafoodPicks.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="overflow-hidden rounded-3xl shadow-soft"
            >
              <img src={item.image} alt={item.name} className="h-64 w-full object-cover" />
              <div className="glass p-5">
                <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-sand/75">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl bg-sand/5 p-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold">Also Vegan &amp; Vegetarian</h3>
            <p className="mt-1 text-sand/70">
              Plant-based plates crafted with the same care as our seafood.
            </p>
          </div>
          <div className="flex gap-3">
            {plantPicks.slice(0, 2).map((item) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded-2xl object-cover shadow-soft sm:h-24 sm:w-24"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
