import { redirect } from 'next/navigation'
import AdminLayout from '@/admin/AdminLayout'
import { AdminAuthProvider } from '@/store/AdminAuthContext'
import { DataProvider } from '@/store/DataContext'
import { getUser, isAllowListedAdmin } from '@backend/lib/supabase/server'
import { getSiteContent } from '@backend/lib/content'
import { isSupabaseConfigured } from '@backend/lib/supabase/env'
import SetupRequired from '@/admin/SetupRequired'
import NotAuthorized from '@/admin/NotAuthorized'

/**
 * Server-side gate for every admin screen.
 *
 * `/admin/login` deliberately sits outside this route group, so signing in is
 * still reachable when this guard sends you away.
 */
export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <SetupRequired />

  const user = await getUser()
  if (!user) redirect('/admin/login')

  // Signed in but not allow-listed: show a dead end rather than redirecting to
  // the login page, which would send them straight back here.
  if (!(await isAllowListedAdmin())) return <NotAuthorized email={user.email ?? null} />

  const content = await getSiteContent()

  return (
    <AdminAuthProvider initialEmail={user.email ?? null}>
      <DataProvider initialContent={content}>
        <AdminLayout>{children}</AdminLayout>
      </DataProvider>
    </AdminAuthProvider>
  )
}
