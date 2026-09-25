'use client'

import { motion } from 'framer-motion'
import { Sun } from 'lucide-react'

export default function FreeSunbeds() {
  return (
    <section id="sunbeds" className="relative flex min-h-[85vh] items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-ocean-deep/55" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-sand">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-coral shadow-soft"
        >
          <Sun className="h-8 w-8" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-medium text-sand/80 sm:text-4xl"
        >
          YOUR BEACH DAY, ON US
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 font-display text-5xl font-bold tracking-tight text-coral sm:text-7xl"
        >
          FREE SUNBEDS
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-sand/90"
        >
          Relax under the sun, feel the sea breeze, and enjoy the beach at your own pace.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          href="#contact"
          className="focus-ring mt-10 inline-block rounded-full bg-sand px-9 py-4 text-sm font-semibold uppercase tracking-wide text-ocean-deep shadow-soft transition-transform hover:scale-105"
        >
          Come Relax With Us
        </motion.a>
      </div>
    </section>
  )
}
