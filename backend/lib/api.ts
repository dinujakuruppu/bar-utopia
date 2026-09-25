import { NextResponse } from 'next/server'
import type { PostgrestError } from '@supabase/supabase-js'
import { getAdminUser, createClient } from './supabase/server'
import { SupabaseConfigError } from './supabase/env'
import { GoogleAnalyticsConfigError } from './googleAnalytics/env'
import { ValidationError } from './mappers'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

/**
 * Gate for every write endpoint. Returns a request-scoped Supabase client that
 * carries the admin's session, so RLS re-checks the same thing independently.
 */
export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) {
    throw new ApiError('You must be signed in as an admin to do that.', 401)
  }
  return { supabase: await createClient(), user }
}

/** Turns whatever went wrong into a JSON response with a message worth showing a human. */
export function toErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (error instanceof SupabaseConfigError) {
    // 503: the server is fine, it just has not been connected to a database yet.
    return NextResponse.json({ error: error.message }, { status: 503 })
  }
  if (error instanceof GoogleAnalyticsConfigError) {
    // 503: the server is fine, GA4 credentials just have not been added yet.
    return NextResponse.json({ error: error.message }, { status: 503 })
  }
  console.error('[bar-utopia] API error:', error)
  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
}

/** Postgres errors from a write almost always mean RLS rejected it or the row is gone. */
export function assertNoDbError(error: PostgrestError | null): asserts error is null {
  if (!error) return
  if (error.code === '42501' || error.message.toLowerCase().includes('row-level security')) {
    throw new ApiError(
      'Your account is not on the admin allow-list for this site. Add its email to the `admins` table.',
      403,
    )
  }
  throw new ApiError(error.message, 400)
}

/** Parses a numeric route param, rejecting junk before it reaches the database. */
export function parseId(raw: string) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) throw new ApiError('Invalid id.', 400)
  return id
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new ApiError('Request body must be JSON.', 400)
  }
}

/** Next passes route params as a promise in the App Router. */
export type RouteContext = { params: Promise<{ id: string }> }
