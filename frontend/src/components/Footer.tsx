'use client'

import { Instagram, Facebook, ExternalLink } from 'lucide-react'
import { useData } from '../store/DataContext'
import { trackBookingComClick, trackSocialLinkClick } from '@/lib/analytics'

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Surfing', href: '#surfing' },
  { label: 'Free Sunbeds', href: '#sunbeds' },
  { label: 'Stay', href: '#stay' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const { settings } = useData()
  const { contact: CONTACT_INFO } = settings

  return (
    <footer className="bg-ink pt-16 text-sand/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#home" className="flex items-center gap-2 font-display text-xl font-semibold text-sand">
           <img
            src="/images/bar-utopia-logo.jpeg"
            alt="Bar Utopia Logo"
            className="h-10 w-10 rounded-full object-cover ring-1 ring-sand/30"
          />
            Bar Utopia
          </a>
          <p className="mt-4 max-w-xs text-sm text-sand/60">
            A beachfront restaurant and surf house serving good food, good waves, and free
            sunbeds by the ocean.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={"https://www.instagram.com/barutopia_hiriketiya/"}
              aria-label="Instagram"
              onClick={() => trackSocialLinkClick('instagram')}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-sand/10 transition-colors hover:bg-coral"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={"https://www.facebook.com/profile.php?id=61551360549958"}
              aria-label="Facebook"
              onClick={() => trackSocialLinkClick('facebook')}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-sand/10 transition-colors hover:bg-coral"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="surf-report text-sand/50">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="focus-ring transition-colors hover:text-coral">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="surf-report text-sand/50">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{CONTACT_INFO.address}</li>
            <li>{CONTACT_INFO.phone}</li>
            <li>{CONTACT_INFO.email}</li>
            <li>{CONTACT_INFO.hours}</li>
          </ul>
        </div>

        <div>
          <p className="surf-report text-sand/50">Stay With Us</p>
          <p className="mt-4 text-sm text-sand/60">
            Book Parrot Perch Villa, our beachside accommodation, via Booking.com.
          </p>
          <a
            href={"https://www.booking.com/hotel/lk/parrot-perch-villa-dickwella.html?label=gen173nr-10CBkoggI46AdIM1gEaIUBiAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBqAIBuAKkvbvTBsACAdICJDZkM2JlNDc3LTRkOGItNGE0Mi05ODBmLWJkZTkyNmVhOWQ5ZdgCAeACAQ&sid=3ea5fa98349e3e7c6c35a9b64f4e3537"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingComClick('footer')}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105"
          >
            Book on Booking.com
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="border-t border-sand/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-sand/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Bar Utopia. All rights reserved.</p>
          <p className="font-display italic text-sand/60">Eat. Surf. Relax. Repeat.</p>
        </div>
      </div>
    </footer>
  )
}
