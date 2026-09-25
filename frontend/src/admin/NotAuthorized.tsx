'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { createClient } from '@backend/lib/supabase/client'

/**
 * Shown when someone signs in with a valid Supabase account that is not on the
 * `admins` allow-list.
 *
 * This is a dead end on purpose — sending them back to /admin/login would just
 * bounce them straight here again, since they do have a session.
 */
export default function NotAuthorized({ email }: { email: string | null }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    await createClient().auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ocean-deep px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/15 text-coral-dark">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ocean-deep">
          This account can&apos;t edit the site
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          You&apos;re signed in{email ? ` as ${email}` : ''}, but that address isn&apos;t on the
          admin list.
        </p>
        <p className="mt-3 text-sm text-ink/70">
          Whoever manages the Supabase project can add it by running this in the{' '}
          <strong className="font-semibold text-ocean-deep">SQL Editor</strong>:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink/5 p-4 text-xs text-ink/80">
          {`insert into public.admins (email)\nvalues ('${email ?? 'you@example.com'}');`}
        </pre>

        <button
          onClick={signOut}
          disabled={signingOut}
          className="focus-ring mt-6 w-full rounded-full bg-ocean-deep px-6 py-3 text-sm font-semibold text-sand transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}
