'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'
import { useAdminAuth } from '../store/AdminAuthContext'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const result = await login(email, password)

    if (result.ok) {
      // Only follow "from" if it points back inside the admin panel, so the
      // query string cannot be used to bounce someone to another site.
      const from = searchParams.get('from')
      router.replace(from?.startsWith('/admin') ? from : '/admin')
    } else {
      setError(result.error ?? 'Could not sign in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ocean-deep px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/bar-utopia-logo.jpeg"
            alt="Bar Utopia Logo"
            className="h-16 w-16 rounded-full object-cover shadow-soft ring-2 ring-coral/20"
          />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ocean-deep">
            Bar Utopia Admin
          </h1>
          <p className="mt-1 text-sm text-ink/60">Sign in to manage your site content.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@barutopia.com"
              required
              className="focus-ring w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink/35"
            />
          </div>

          <label
            htmlFor="admin-password"
            className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-ink/60"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="focus-ring w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink/35"
            />
          </div>

          {error && <p className="mt-3 text-sm text-coral-dark">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring mt-6 w-full rounded-full bg-ocean-deep px-6 py-3 text-sm font-semibold text-sand transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink/40">
          Accounts are managed in Supabase — Authentication → Users. An account must also be listed
          in the <code className="rounded bg-ink/5 px-1.5 py-0.5">admins</code> table to edit
          content.
        </p>
      </div>
    </div>
  )
}
