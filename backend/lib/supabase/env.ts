/**
 * Reads the Supabase connection details once, with an error message that says
 * what to do rather than failing later with an opaque "Invalid URL".
 *
 * IMPORTANT: NEXT_PUBLIC_* variables must be read with the literal expression
 * `process.env.NEXT_PUBLIC_...`. Next.js swaps that exact text for the real value
 * when it builds the browser bundle. Any indirect access (globalThis.process,
 * env[name], destructuring) is NOT swapped, so it is `undefined` in the browser,
 * which made the admin login fail with "Missing NEXT_PUBLIC_SUPABASE_URL" even
 * though .env.local was filled in correctly.
 */

/** Thrown when the app has no Supabase credentials, so callers can report it as setup, not a crash. */
export class SupabaseConfigError extends Error {}

// Literal reads: Next.js inlines these for browser code and reads them from the
// real environment on the server. `.trim()` guards against stray spaces/newlines.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new SupabaseConfigError(
      `Missing ${name}. Copy .env.example to .env.local and fill in your Supabase ` +
        `project's values (Supabase Dashboard → Project Settings → API). See SETUP.md.`,
    )
  }
  return value
}

export function supabaseUrl() {
  return required('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL)
}

export function supabaseAnonKey() {
  return required('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY)
}

/** True when both public env vars are present — used to render a helpful setup screen instead of crashing. */
export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}
