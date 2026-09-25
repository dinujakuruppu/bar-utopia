'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Sun } from 'lucide-react'
import { trackHeroCtaClick } from '@/lib/analytics'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ocean-deep"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-ocean-gradient" />
      <div className="absolute inset-0 bg-ink/30" />

      <div className="surf-report absolute left-6 top-28 hidden text-sand/70 md:block">
        SWELL 4FT · WATER 27°C · OFFSHORE WIND
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="surf-report mb-4 text-lagoon-light"
        >
          Beachfront Restaurant &amp; Surf House
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance font-display text-6xl font-semibold tracking-tight text-sand sm:text-7xl md:text-8xl"
        >
          BAR UTOPIA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-4 font-display text-2xl italic text-lagoon-light sm:text-3xl"
        >
          Eat. Surf. Relax. Repeat.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 max-w-xl text-balance text-base text-sand/85 sm:text-lg"
        >
          Experience great food, refreshing drinks, unforgettable surfing, and the freedom to
          relax by the beach.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#about"
            onClick={() => trackHeroCtaClick('Explore Bar Utopia')}
            className="focus-ring rounded-full bg-coral px-8 py-4 text-sm font-semibold uppercase tracking-wide text-sand shadow-soft transition-transform hover:scale-105 hover:bg-coral-dark"
          >
            Explore Bar Utopia
          </a>
          <a
            href="#sunbeds"
            onClick={() => trackHeroCtaClick('Discover the Beach Life')}
            className="glass focus-ring rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wide text-sand transition-transform hover:scale-105"
          >
            Discover the Beach Life
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#sunbeds"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="glass focus-ring absolute bottom-28 right-6 z-10 hidden max-w-[220px] items-start gap-3 rounded-2xl p-4 shadow-glass sm:flex"
      >
        <Sun className="mt-0.5 h-6 w-6 shrink-0 text-coral" />
        <div className="text-left">
          <p className="font-display text-lg font-semibold text-sand">FREE SUNBEDS</p>
          <p className="text-xs text-sand/80">Relax by the beach. It&apos;s on us.</p>
        </div>
      </motion.a>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-sand/80"
      >
        <ChevronDown className="h-7 w-7" />
      </motion.div>
    </section>
  )
}
