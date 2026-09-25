'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'
import { useData } from '../store/DataContext'
import { trackContactClick, trackEmailClick, trackPhoneClick, trackSocialLinkClick } from '@/lib/analytics'

export default function Contact() {
  const { settings } = useData()
  const { contact: CONTACT_INFO } = settings

  const details = [
    { icon: MapPin, label: 'Address', value: CONTACT_INFO.address, href: undefined, onClick: undefined },
    {
      icon: Phone,
      label: 'Phone',
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`,
      onClick: trackPhoneClick,
    },
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      onClick: trackEmailClick,
    },
    { icon: Clock, label: 'Opening Hours', value: CONTACT_INFO.hours, href: undefined, onClick: undefined },
  ]

  return (
    <section id="contact" className="bg-ocean-deep py-24 text-sand">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="surf-report text-lagoon-light">Get In Touch</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Visit Bar Utopia</h2>
          <p className="mt-4 text-sand/75">
            Come by for a meal, a wave, or just a sunbed and a sunset.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {details.map((d) => {
            const Icon = d.icon
            const body = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/90">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="surf-report text-sand/60">{d.label}</p>
                  <p className="mt-1 text-sand">{d.value}</p>
                </div>
              </>
            )

            if (d.href) {
              return (
                <a
                  key={d.label}
                  href={d.href}
                  onClick={() => {
                    trackContactClick(d.label.toLowerCase())
                    d.onClick?.()
                  }}
                  className="focus-ring glass flex items-start gap-4 rounded-2xl p-6 transition-colors hover:bg-white/10"
                >
                  {body}
                </a>
              )
            }

            return (
              <div key={d.label} className="glass flex items-start gap-4 rounded-2xl p-6">
                {body}
              </div>
            )
          })}
        </motion.div>

        <div className="mt-12 flex justify-center gap-4">
          <a
            href={"https://www.instagram.com/barutopia_hiriketiya/"}
            aria-label="Bar Utopia on Instagram"
            onClick={() => trackSocialLinkClick('instagram')}
            className="focus-ring glass flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={"https://www.facebook.com/profile.php?id=61551360549958"}
            aria-label="Bar Utopia on Facebook"
            onClick={() => trackSocialLinkClick('facebook')}
            className="focus-ring glass flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
