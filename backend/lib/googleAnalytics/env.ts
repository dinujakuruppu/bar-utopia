import 'server-only'

/**
 * Reads the Google Analytics Data API service-account credentials once, with
 * an error message that says what to do rather than failing later with an
 * opaque auth error. Mirrors the pattern in `supabase/env.ts`.
 */

/** Thrown when GA4 credentials are missing, so callers can report it as "not configured", not a crash. */
export class GoogleAnalyticsConfigError extends Error {}

const environment = (
  globalThis as typeof globalThis & {
    process?: { env: Record<string, string | undefined> }
  }
).process?.env ?? {}

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new GoogleAnalyticsConfigError(
      `Missing ${name}. Add it to .env.local (see ANALYTICS.md for setup instructions).`,
    )
  }
  return value
}

export function gaPropertyId() {
  return required('GA_PROPERTY_ID', environment.GA_PROPERTY_ID)
}

export function googleClientEmail() {
  return required('GOOGLE_CLIENT_EMAIL', environment.GOOGLE_CLIENT_EMAIL)
}

/**
 * Service-account private keys are stored in `.env.local` with escaped
 * newlines (`\n`) because real newlines are awkward in .env files. This
 * un-escapes them back into the PEM format the Google client library expects.
 */
export function googlePrivateKey() {
  const raw = required('GOOGLE_PRIVATE_KEY', environment.GOOGLE_PRIVATE_KEY)
  return raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw
}

/** True when all three GA4 server credentials are present. */
export function isGoogleAnalyticsConfigured() {
  return Boolean(
    environment.GA_PROPERTY_ID && environment.GOOGLE_CLIENT_EMAIL && environment.GOOGLE_PRIVATE_KEY,
  )
}
