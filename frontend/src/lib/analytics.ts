'use client'

/**
 * Reusable Google Analytics 4 (gtag.js) helpers for the public Bar Utopia
 * site.
 *
 * - Reads the Measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID` (never
 *   hardcoded in components).
 * - `pageview()` / `event()` are no-ops when GA hasn't loaded (script
 *   blocked, ad blocker, not configured, or non-production without debug
 *   mode) so components can call them unconditionally.
 * - Every tracked interaction has its own small typed wrapper below instead
 *   of components calling `event()` with raw string literals scattered
 *   around the codebase.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Whether GA should actually fire events in this environment.
 *
 * Analytics scripts only run in production by default, so local development
 * doesn't pollute real data. Set `NEXT_PUBLIC_GA_DEBUG=true` to opt in to
 * tracking on a non-production build (useful for staging or manual testing).
 */
export function isAnalyticsEnabled() {
  if (!GA_MEASUREMENT_ID) return false
  if (process.env.NODE_ENV === 'production') return true
  return process.env.NEXT_PUBLIC_GA_DEBUG === 'true'
}

type EventParams = Record<string, string | number | boolean | undefined>

/** Low-level: sends a raw GA4 event. Prefer one of the typed helpers below. */
export function trackEvent(name: string, params: EventParams = {}) {
  if (!isAnalyticsEnabled()) return
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

/** Sends a page_view for the given path. Called on initial load and every route change. */
export function trackPageview(path: string) {
  if (!isAnalyticsEnabled()) return
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !GA_MEASUREMENT_ID) return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: path })
}

// ---------------------------------------------------------------------------
// Typed event helpers — one per real interaction in the product. Keeping
// these here means every event name and its parameter shape is defined once.
// ---------------------------------------------------------------------------

export function trackHeroCtaClick(ctaLabel: string) {
  trackEvent('hero_cta_click', { cta_label: ctaLabel })
}

export function trackViewMenu() {
  trackEvent('view_menu', {})
}

export function trackViewMenuCategory(category: string) {
  trackEvent('view_menu_category', { category })
}

export function trackViewMenuItem(itemName: string, category: string) {
  trackEvent('view_menu_item', { item_name: itemName, category })
}

export function trackViewSurfPackages() {
  trackEvent('view_surf_packages', {})
}

export function trackSelectSurfPackage(packageName: string) {
  trackEvent('select_surf_package', { package_name: packageName })
}

export function trackSurfPackageCtaClick(packageName: string) {
  trackEvent('surf_package_cta_click', { package_name: packageName })
}

export function trackViewGallery(category?: string) {
  trackEvent('view_gallery', category ? { category } : {})
}

export function trackContactClick(method: string) {
  trackEvent('contact_click', { method })
}

export function trackPhoneClick() {
  trackEvent('phone_click', {})
}

export function trackEmailClick() {
  trackEvent('email_click', {})
}

export function trackWhatsappClick() {
  trackEvent('whatsapp_click', {})
}

export function trackSocialLinkClick(network: string) {
  trackEvent('social_link_click', { network })
}

export function trackBookingComClick(location: string) {
  trackEvent('booking_com_click', { location })
}

export function trackMapClick() {
  trackEvent('map_click', {})
}

const firedScrollThresholds = new Set<number>()

/** Fires once per threshold per page load (25/50/75/100%), not on every scroll tick. */
export function trackScrollDepth(percentScrolled: 25 | 50 | 75 | 100) {
  if (firedScrollThresholds.has(percentScrolled)) return
  firedScrollThresholds.add(percentScrolled)
  trackEvent('scroll_depth', { percent_scrolled: percentScrolled })
}

/** Resets scroll-depth de-duplication — call on route change (new page = new scroll). */
export function resetScrollDepthTracking() {
  firedScrollThresholds.clear()
}
