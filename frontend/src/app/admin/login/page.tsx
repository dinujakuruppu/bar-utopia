import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import AdminLogin from '@/admin/AdminLogin'
import { AdminAuthProvider } from '@/store/AdminAuthContext'
import { getUser } from '@backend/lib/supabase/server'
import { isSupabaseConfigured } from '@backend/lib/supabase/env'
import SetupRequired from '@/admin/SetupRequired'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Bar Utopia Admin — Sign In' }

export default async function AdminLoginPage() {
  if (!isSupabaseConfigured()) return <SetupRequired />

  // Already signed in? Skip the form. The panel layout decides whether this
  // account is actually allowed to edit anything.
  if (await getUser()) redirect('/admin')

  return (
    <AdminAuthProvider>
      {/* useSearchParams needs a suspense boundary during prerender. */}
      <Suspense>
        <AdminLogin />
      </Suspense>
    </AdminAuthProvider>
  )
}
