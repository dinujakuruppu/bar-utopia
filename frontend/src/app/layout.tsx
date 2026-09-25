import type { Metadata } from 'next'
import { Fraunces, Manrope, Space_Mono } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bar Utopia — Eat. Surf. Relax. Repeat.',
  description:
    'Bar Utopia is a beachfront restaurant and surf destination offering fresh seafood, tropical drinks, surf lessons, free sunbeds, and beachside accommodation at Parrot Perch Villa.',
  icons: { icon: '/images/bar-utopia-logo.jpeg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="bg-sand font-body text-ink antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
