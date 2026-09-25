'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Waves, Users, UtensilsCrossed, Sunrise } from 'lucide-react'

const points = [
  { icon: Waves, text: 'Beautiful beachfront location with sea views' },
  { icon: Sunrise, text: 'Relaxing, unhurried tropical atmosphere' },
  { icon: Users, text: 'Friendly, attentive local staff' },
  { icon: UtensilsCrossed, text: 'Quality food, drinks, and surfing experiences' },
]

export default function About() {
  return (
    <section id="about" className="bg-sand py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&w=1200&q=80"
            alt="Bar Utopia beachfront seating overlooking the ocean"
            className="h-[420px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[520px]"
          />
          <div className="glass-light absolute -bottom-6 -right-6 hidden max-w-[200px] rounded-2xl p-5 sm:block">
            <p className="font-display text-3xl font-semibold text-ocean-deep">100m</p>
            <p className="text-sm text-ink/70">of open sand, right at the water&apos;s edge</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="surf-report text-lagoon">About Us</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ocean-deep sm:text-5xl">
            Welcome to Bar Utopia
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Bar Utopia is a beachfront restaurant where the sand meets your table and the sea
            breeze sets the pace. Come for the quality food and drinks, stay for the salty air,
            the sweeping ocean views, and a kind of relaxation that only a real beach can give
            you.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((p) => {
              const Icon = p.icon
              return (
                <li key={p.text} className="flex items-center gap-3 text-ink/80">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lagoon/15 text-lagoon">
                    <Icon className="h-5 w-5" />
                  </span>
                  {p.text}
                </li>
              )
            })}
          </ul>
          <a
            href="#menu"
            className="focus-ring group mt-10 inline-flex items-center gap-2 rounded-full bg-ocean-deep px-7 py-3.5 text-sm font-semibold text-sand transition-transform hover:scale-105"
          >
            Discover More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
