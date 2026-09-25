'use client'

import { BarChart3 } from 'lucide-react'
import { useDateRange } from '../hooks/useDateRange'
import DateRangePicker from '../components/analytics/DateRangePicker'
import OverviewCards from '../components/analytics/OverviewCards'
import TrafficTrendCharts from '../components/analytics/TrafficTrendCharts'
import PopularPagesTable from '../components/analytics/PopularPagesTable'
import TrafficSourcesSection from '../components/analytics/TrafficSourcesSection'
import DeviceAnalyticsSection from '../components/analytics/DeviceAnalyticsSection'
import GeographySection from '../components/analytics/GeographySection'
import BehaviorSection from '../components/analytics/BehaviorSection'
import UserJourneyFunnel from '../components/analytics/UserJourneyFunnel'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-xl font-semibold text-ocean-deep">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-ink/50">{subtitle}</p>}
    </div>
  )
}

export default function AnalyticsAdmin() {
  const { dateRange, setDateRange } = useDateRange()

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lagoon/15 text-lagoon">
              <BarChart3 className="h-4.5 w-4.5" />
            </span>
            <h1 className="font-display text-3xl font-semibold text-ocean-deep">Analytics</h1>
          </div>
          <p className="mt-1 text-sm text-ink/60">
            How real visitors behave on the Bar Utopia website, powered by Google Analytics 4.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="mt-8 space-y-10">
        <section>
          <SectionHeading title="Overview" />
          <OverviewCards dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="Visitor Trends" subtitle="Traffic and visitor type patterns over the selected period" />
          <TrafficTrendCharts dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="Popular Pages" />
          <PopularPagesTable dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="Traffic Sources" />
          <TrafficSourcesSection dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="Devices" subtitle="Helps decide whether to prioritize mobile or desktop" />
          <DeviceAnalyticsSection dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="Geography" />
          <GeographySection dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="Menu, Surf Packages & Interactions" />
          <BehaviorSection dateRange={dateRange} />
        </section>

        <section>
          <SectionHeading title="User Journey" />
          <UserJourneyFunnel dateRange={dateRange} />
        </section>
      </div>
    </div>
  )
}
