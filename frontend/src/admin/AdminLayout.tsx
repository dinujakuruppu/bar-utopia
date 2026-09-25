'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Waves,
  Images,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useAdminAuth } from '../store/AdminAuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed, exact: false },
  { to: '/admin/surf-packages', label: 'Surf Packages', icon: Waves, exact: false },
  { to: '/admin/gallery', label: 'Gallery', icon: Images, exact: false },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, exact: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { email, logout } = useAdminAuth()
  const pathname = usePathname()

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to)

  return (
    <div className="min-h-screen bg-sand-dark/40">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col bg-ocean-deep px-4 py-6 text-sand lg:flex">
          <div className="flex items-center gap-2 px-2 font-display text-lg font-semibold">
            <img
              src="/images/bar-utopia-logo.jpeg"
              alt="Bar Utopia Logo"
              className="h-8 w-8 rounded-full object-cover ring-1 ring-sand/30"
            />
            Bar Utopia
          </div>
          <p className="px-2 pb-6 pt-1 text-xs uppercase tracking-wide text-sand/50">
            Admin Panel
          </p>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item)
                      ? 'bg-coral text-sand'
                      : 'text-sand/75 hover:bg-white/10 hover:text-sand'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-col gap-1 border-t border-sand/10 pt-4">
            {email && (
              <p className="truncate px-3 pb-2 text-xs text-sand/45" title={email}>
                {email}
              </p>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sand/75 transition-colors hover:bg-white/10 hover:text-sand"
            >
              <ExternalLink className="h-4.5 w-4.5" />
              View Site
            </a>
            <button
              onClick={logout}
              className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-sand/75 transition-colors hover:bg-white/10 hover:text-sand"
            >
              <LogOut className="h-4.5 w-4.5" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-ocean-deep px-4 py-3 text-sand lg:hidden">
          <div className="flex items-center gap-2 font-display text-base font-semibold">
            <img
              src="/images/bar-utopia-logo.jpeg"
              alt="Bar Utopia Logo"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-sand/30"
            />
            Admin
          </div>
          <button onClick={logout} className="focus-ring rounded-full p-2 hover:bg-white/10">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-ink/10 bg-white py-2 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`focus-ring flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[0.65rem] font-medium ${
                  isActive(item) ? 'text-coral' : 'text-ink/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <main className="flex-1 px-4 pb-24 pt-20 sm:px-8 sm:pb-8 lg:pt-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
