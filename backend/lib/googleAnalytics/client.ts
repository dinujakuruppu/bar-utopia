import 'server-only'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { googleClientEmail, googlePrivateKey } from './env'

/**
 * Lazily-created, cached Google Analytics Data API client.
 *
 * Never exported to client components — this file imports `server-only`,
 * which fails the build if it is ever pulled into browser code. Credentials
 * stay in server-side environment variables at all times.
 */
let cachedClient: BetaAnalyticsDataClient | null = null

export function getAnalyticsDataClient() {
  if (!cachedClient) {
    cachedClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: googleClientEmail(),
        private_key: googlePrivateKey(),
      },
    })
  }
  return cachedClient
}
