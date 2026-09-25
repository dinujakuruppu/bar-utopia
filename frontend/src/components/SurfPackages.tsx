'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useData } from '../store/DataContext'
import { trackSelectSurfPackage, trackSurfPackageCtaClick, trackViewSurfPackages } from '@/lib/analytics'

export default function SurfPackages() {
  const { surfPackages } = useData()
  return (
    <motion.section
      className="bg-ocean-deep py-24 text-sand"
      onViewportEnter={trackViewSurfPackages}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon-light">Surf Packages</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Find Your Wave
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {surfPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onViewportEnter={() => trackSelectSurfPackage(pkg.name)}
              className={`flex flex-col rounded-3xl p-8 shadow-soft transition-transform duration-300 hover:-translate-y-2 ${
                pkg.highlighted ? 'scale-[1.03] bg-coral' : 'glass'
              }`}
            >
              {pkg.highlighted && (
                <span className="surf-report mb-4 inline-block w-fit rounded-full bg-sand/20 px-3 py-1 text-[0.65rem]">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-2xl font-semibold">{pkg.name}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{pkg.price}</span>
                {pkg.priceNote && <span className="text-sm text-sand/80">{pkg.priceNote}</span>}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2 text-sm text-sand/90">
                    <Check className="h-4 w-4 shrink-0 text-lagoon-light" /> {inc}
                  </li>
                ))}
                {pkg.excludes?.map((exc) => (
                  <li key={exc} className="flex items-center gap-2 text-sm text-sand/60">
                    <X className="h-4 w-4 shrink-0" /> {exc}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => trackSurfPackageCtaClick(pkg.name)}
                className={`focus-ring mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition-transform hover:scale-105 ${
                  pkg.highlighted ? 'bg-sand text-ocean-deep' : 'bg-coral text-sand'
                }`}
              >
                {pkg.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-sand/70">
          Experienced instructors are available to guide you through your surfing experience.
        </p>
      </div>
    </motion.section>
  )
}
