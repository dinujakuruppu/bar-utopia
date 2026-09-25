'use client'

import { motion } from 'framer-motion'
import { Clock, GraduationCap, LifeBuoy, ShowerHead } from 'lucide-react'
import TideLine from './TideLine'

const experience = [
  { icon: Clock, text: 'Approximately 30 minutes of initial practice and training on the sand' },
  { icon: GraduationCap, text: 'Hands-on guidance from experienced local instructors' },
  { icon: LifeBuoy, text: 'In-water support while you catch your first waves' },
  { icon: ShowerHead, text: 'Showers and washroom facilities for surfing guests' },
]

export default function Surfing() {
  return (
    <section id="surfing" className="relative overflow-hidden bg-sand py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="surf-report text-lagoon">Surf School</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ocean-deep sm:text-5xl">
            Ride the Waves
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Bar Utopia offers surfing experiences for tourists and visitors of every level,
            guided by experienced surfers and instructors who know these waves well.
          </p>
          <ul className="mt-8 space-y-5">
            {experience.map((e) => {
              const Icon = e.icon
              return (
                <li key={e.text} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lagoon/15 text-lagoon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-ink/80">{e.text}</span>
                </li>
              )
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1531722569936-825d3dd91b15?auto=format&fit=crop&w=1100&q=80"
            alt="Surfer riding a wave near Bar Utopia"
            className="h-[460px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[540px]"
          />
        </motion.div>
      </div>
      <div className="mt-16">
        <TideLine color="#17A398" />
      </div>
    </section>
  )
}
