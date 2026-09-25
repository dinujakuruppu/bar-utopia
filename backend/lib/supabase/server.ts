import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from './env'
import type { Database } from './types'

/**
 * Server-side Supabase client bound to the request's cookies, so RLS sees the
 * signed-in admin (or the anonymous role for public visitors).
 *
 * Must be awaited: `cookies()` is async in the App Router.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // middleware refreshes the session instead, so this is safe to ignore.
        }
      },
    },
  })
}

/**
 * The signed-in Supabase user, or null.
 *
 * Uses getUser() rather than getSession(): getUser() revalidates the token with
 * Supabase, so a forged cookie cannot fake a session.
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/** Whether the current session's email is on the `admins` allow-list. */
export async function isAllowListedAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

/**
 * The signed-in user, but only if they are also allow-listed. Null covers both
 * "not signed in" and "signed in but not an editor" — which is what write
 * endpoints care about. Screens that need to tell those apart should call
 * getUser() and isAllowListedAdmin() separately.
 */
export async function getAdminUser() {
  const user = await getUser()
  if (!user) return null
  return (await isAllowListedAdmin()) ? user : null
}
