'use client'

import { Suspense, useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  GA_MEASUREMENT_ID,
  isAnalyticsEnabled,
  resetScrollDepthTracking,
  trackPageview,
  trackScrollDepth,
} from '@/lib/analytics'

/**
 * Fires a page_view on every App Router navigation.
 *
 * `gtag('config', ...)` is called once (below, without `page_path`) with
 * `send_page_view: false`, so this is the *only* place page views are sent —
 * avoiding the classic Next.js double-pageview bug where both the initial
 * script config and a route-change listener fire for the same load.
 *
 * Admin panel usage is intentionally excluded: the dashboard's job is to
 * report on real *visitors*, not on the admin's own clicks around `/admin`.
 */
function RouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    const query = searchParams?.toString()
    trackPageview(query ? `${pathname}?${query}` : pathname)
    resetScrollDepthTracking()
  }, [pathname, searchParams])

  return null
}

/** Fires scroll_depth once per 25/50/75/100% threshold reached, per page load. */
function ScrollDepthTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    const thresholds = [25, 50, 75, 100] as const

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = (scrollTop / docHeight) * 100

      for (const threshold of thresholds) {
        if (percent >= threshold) trackScrollDepth(threshold)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return null
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || !isAnalyticsEnabled()) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollDepthTracker />
      </Suspense>
    </>
  )
}
