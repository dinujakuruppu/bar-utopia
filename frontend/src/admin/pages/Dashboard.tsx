'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed, Waves, Images, Download, Upload, RotateCcw } from 'lucide-react'
import { useData } from '../../store/DataContext'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardAnalyticsWidget from '../components/analytics/DashboardAnalyticsWidget'

export default function Dashboard() {
  const { menuItems, surfPackages, galleryImages, exportData, importData, resetToDefaults } =
    useData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null,
  )
  const [confirmReset, setConfirmReset] = useState(false)
  const [busy, setBusy] = useState(false)

  const cards = [
    { label: 'Menu Items', count: menuItems.length, icon: UtensilsCrossed, to: '/admin/menu' },
    { label: 'Surf Packages', count: surfPackages.length, icon: Waves, to: '/admin/surf-packages' },
    { label: 'Gallery Images', count: galleryImages.length, icon: Images, to: '/admin/gallery' },
  ]

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bar-utopia-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setBusy(true)
    setImportMessage(null)
    try {
      await importData(await file.text())
      setImportMessage({ type: 'ok', text: 'Content imported successfully.' })
    } catch (err) {
      setImportMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Import failed.',
      })
    } finally {
      setBusy(false)
    }
  }

  const handleReset = async () => {
    setConfirmReset(false)
    setBusy(true)
    setImportMessage(null)
    try {
      await resetToDefaults()
      setImportMessage({ type: 'ok', text: 'Content reset to the original demo data.' })
    } catch (err) {
      setImportMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Reset failed.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ocean-deep">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">
        Manage the content shown across the Bar Utopia website.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.to}
              className="focus-ring group rounded-2xl bg-white p-6 shadow-soft transition-transform hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lagoon/15 text-lagoon">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-3xl font-semibold text-ocean-deep">
                {card.count}
              </p>
              <p className="mt-1 text-sm text-ink/60">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-ocean-deep">Backup &amp; Restore</h2>
        <p className="mt-1 text-sm text-ink/60">
          Content lives in your Supabase database and is live for every visitor. Export a JSON
          backup before big changes, or import one to restore.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean-deep px-5 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105"
          >
            <Download className="h-4 w-4" />
            Export Content
          </button>
          <button
            onClick={handleImportClick}
            disabled={busy}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            Import Content
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => setConfirmReset(true)}
            disabled={busy}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-coral/40 px-5 py-2.5 text-sm font-semibold text-coral-dark transition-colors hover:bg-coral/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
        </div>

        {busy && <p className="mt-4 text-sm text-ink/50">Working…</p>}

        {importMessage && (
          <p
            className={`mt-4 text-sm ${
              importMessage.type === 'ok' ? 'text-lagoon' : 'text-coral-dark'
            }`}
          >
            {importMessage.text}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all content?"
        message="This will replace all menu items, surf packages, gallery images, and settings in the database with the original demo content, for every visitor. This cannot be undone."
        confirmLabel="Reset"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />

      <DashboardAnalyticsWidget />
    </div>
  )
}
