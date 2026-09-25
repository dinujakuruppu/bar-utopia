'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@backend/lib/supabase/client'

/**
 * Admin session, backed by Supabase Auth.
 *
 * The session lives in an httpOnly-ish auth cookie written by @supabase/ssr, so
 * the server (middleware, API routes, RLS) sees the same identity the browser
 * does. `email` is passed down from the server layout, which already verified
 * the user against the admins allow-list.
 */

interface AdminAuthValue {
  email: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; error?: string }>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({
  initialEmail = null,
  children,
}: {
  initialEmail?: string | null
  children: ReactNode
}) {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(initialEmail)

  const value = useMemo<AdminAuthValue>(
    () => ({
      email,
      isAuthenticated: email !== null,

      login: async (emailInput, password) => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput.trim(),
          password,
        })

        if (error) {
          return {
            ok: false,
            error:
              error.message === 'Invalid login credentials'
                ? 'Incorrect email or password.'
                : error.message,
          }
        }

        setEmail(data.user?.email ?? emailInput)
        // Let the server re-render with the new cookie; the admin layout does
        // the allow-list check and will bounce a non-admin account back out.
        router.refresh()
        return { ok: true }
      },

      logout: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        setEmail(null)
        router.replace('/admin/login')
        router.refresh()
      },

      changePassword: async (currentPassword, newPassword) => {
        if (newPassword.trim().length < 8) {
          return { ok: false, error: 'New password must be at least 8 characters.' }
        }
        if (!email) return { ok: false, error: 'You are not signed in.' }

        const supabase = createClient()

        // Supabase would let a live session change the password without the old
        // one; re-authenticating keeps the "current password" field meaningful
        // and stops someone using an unattended, logged-in browser.
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        })
        if (reauthError) return { ok: false, error: 'Current password is incorrect.' }

        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) return { ok: false, error: error.message }

        return { ok: true }
      },
    }),
    [email, router],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  return ctx
}
