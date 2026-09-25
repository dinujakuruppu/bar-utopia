import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomeSections from '@/sections/HomeSections'
import { DataProvider } from '@/store/DataContext'
import { getSiteContent } from '@backend/lib/content'

/**
 * The public site.
 *
 * Content is read from Supabase on the server on every request, so an edit made
 * in the admin panel is live for every visitor immediately — no rebuild, no
 * per-browser localStorage.
 */
export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await getSiteContent()

  return (
    <DataProvider initialContent={content}>
      <div className="min-h-screen bg-sand">
        <Navbar />
        <main>
          <HomeSections />
        </main>
        <Footer />
      </div>
    </DataProvider>
  )
}
