'use client'

import { createBrowserClient } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from './env'
import type { Database } from './types'

/**
 * Browser-side Supabase client. Only used for auth actions that need to run in
 * the browser (sign-in, password change); all content writes go through the
 * /api routes so they can be validated and authorised server-side.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseAnonKey())
}
