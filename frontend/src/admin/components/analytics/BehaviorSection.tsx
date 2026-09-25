'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { UtensilsCrossed, Waves, MessageCircle, Share2 } from 'lucide-react'
import type {
  InteractionEventsResponse,
  MenuBehaviorResponse,
  SurfPackageBehaviorResponse,
} from '@backend/lib/googleAnalytics/types'
import { AnalyticsEmpty, AnalyticsError, AnalyticsLoading } from './AnalyticsStates'
import { useAnalyticsQuery } from '../../hooks/useAnalyticsQuery'
import type { DateRangeState } from '../../hooks/useDateRange'

interface BehaviorData {
  menu: MenuBehaviorResponse
  surfPackages: SurfPackageBehaviorResponse
  interactions: InteractionEventsResponse
}

function MiniBarChart({ data, dataKey, color }: { data: { name: string; value: number }[]; dataKey: string; color: string }) {
  if (data.length === 0) return <AnalyticsEmpty message="No interactions tracked yet." />
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#12222310" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#12222380' }} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: '#122223' }}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #12222315', fontSize: 12 }} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function InteractionStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-sand-dark/30 px-4 py-3">
      <p className="font-display text-xl font-semibold text-ocean-deep">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-xs text-ink/50">{label}</p>
    </div>
  )
}

export default function BehaviorSection({ dateRange }: { dateRange: DateRangeState }) {
  const { data, loading, error } = useAnalyticsQuery<BehaviorData>('behavior', dateRange)

  if (loading && !data) {
    return (
      <div className="rounded-2xl bg-white shadow-soft">
        <AnalyticsLoading label="Loading behavior data…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white shadow-soft">
        <AnalyticsError message={error} />
      </div>
    )
  }

  if (!data) return null

  const { menu, surfPackages, interactions } = data

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-lagoon" />
            <h3 className="font-display text-lg font-semibold text-ocean-deep">Menu Behavior</h3>
          </div>
          <p className="mt-0.5 text-sm text-ink/50">Most viewed categories</p>
          <div className="mt-4">
            <MiniBarChart
              data={menu.categories.map((c) => ({ name: c.name, value: c.views }))}
              dataKey="value"
              color="#17A398"
            />
          </div>
          {menu.items.length > 0 && (
            <>
              <p className="mt-5 text-sm font-medium text-ink/60">Most interacted-with items</p>
              <ul className="mt-2 space-y-1.5">
                {menu.items.slice(0, 6).map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{item.name}</span>
                    <span className="font-medium text-ocean-deep">{item.interactions}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-lagoon" />
            <h3 className="font-display text-lg font-semibold text-ocean-deep">Surf Package Interest</h3>
          </div>
          <p className="mt-0.5 text-sm text-ink/50">
            {surfPackages.mostPopularPackage
              ? `Most popular: ${surfPackages.mostPopularPackage}`
              : 'Package views and CTA clicks'}
          </p>
          <div className="mt-4">
            <MiniBarChart
              data={surfPackages.packages.map((p) => ({ name: p.name, value: p.views }))}
              dataKey="value"
              color="#0E4749"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <InteractionStat label="Total Interactions" value={surfPackages.totalInteractions} />
            <InteractionStat
              label={surfPackages.mostClickedCta ? `Top CTA: ${surfPackages.mostClickedCta}` : 'Top CTA'}
              value={surfPackages.ctaClicks[0]?.clicks ?? 0}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-lagoon" />
          <h3 className="font-display text-lg font-semibold text-ocean-deep">Contact &amp; Booking Interactions</h3>
        </div>
        <p className="mt-0.5 text-sm text-ink/50">Real-element clicks tracked across the site</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InteractionStat label="Contact Clicks" value={interactions.contactClicks} />
          <InteractionStat label="Phone Clicks" value={interactions.phoneClicks} />
          <InteractionStat label="Email Clicks" value={interactions.emailClicks} />
          <InteractionStat label="Map Clicks" value={interactions.mapClicks} />
          <InteractionStat label="Booking.com Clicks" value={interactions.bookingComClicks} />
          <InteractionStat label="Hero CTA Clicks" value={interactions.heroCtaClicks} />
          {interactions.socialLinkClicks.map((s) => (
            <InteractionStat key={s.network} label={`${s.network} Clicks`} value={s.clicks} />
          ))}
        </div>

        {interactions.scrollDepth.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-ink/40" />
              <p className="text-sm font-medium text-ink/60">Scroll Depth</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {interactions.scrollDepth.map((s) => (
                <span key={s.threshold} className="rounded-full bg-sand-dark/40 px-3 py-1 text-xs text-ink/70">
                  {s.threshold}: {s.users.toLocaleString()} users
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
