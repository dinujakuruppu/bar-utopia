'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MENU_CATEGORIES } from '@backend/data/menuData'
import { useData } from '../store/DataContext'
import type { MenuCategory } from '@backend/types'
import { trackViewMenu, trackViewMenuCategory, trackViewMenuItem } from '@/lib/analytics'

export default function Menu() {
  const { menuItems } = useData()
  const [active, setActive] = useState<MenuCategory | 'All'>('All')

  const items = active === 'All' ? menuItems : menuItems.filter((m) => m.category === active)

  const selectCategory = (cat: MenuCategory | 'All') => {
    setActive(cat)
    trackViewMenuCategory(cat)
  }

  return (
    <motion.section
      id="menu"
      className="bg-sand py-24"
      onViewportEnter={trackViewMenu}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon">The Menu</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ocean-deep sm:text-5xl">
            Food &amp; Drinks
          </h2>
          <p className="mt-4 text-ink/70">
            A taste of the tropics — from ocean-fresh seafood to plant-based bowls, tropical
            cocktails, and slow mornings with coffee.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {(['All', ...MENU_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`focus-ring rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                active === cat
                  ? 'bg-ocean-deep text-sand'
                  : 'bg-white/70 text-ink/70 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                onClick={() => trackViewMenuItem(item.name, item.category)}
                className="group overflow-hidden rounded-3xl bg-white shadow-soft"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="surf-report absolute left-4 top-4 rounded-full bg-ocean-deep/85 px-3 py-1 text-[0.6rem] text-sand">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-ocean-deep">
                      {item.name}
                    </h3>
                    {item.price && (
                      <span className="surf-report shrink-0 rounded-full bg-lagoon/10 px-3 py-1 text-sm font-semibold text-lagoon">
                        {item.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
