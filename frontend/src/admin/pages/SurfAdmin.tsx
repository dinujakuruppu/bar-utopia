'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X as XIcon } from 'lucide-react'
import { useData } from '../../store/DataContext'
import type { SurfPackage } from '@backend/types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import FormField, { inputClass } from '../components/FormField'

type FormState = Omit<SurfPackage, 'id' | 'includes' | 'excludes' | 'priceNote'> & {
  priceNote: string
  includesText: string
  excludesText: string
}

const emptyForm: FormState = {
  name: '',
  price: '',
  priceNote: '',
  cta: '',
  highlighted: false,
  includesText: '',
  excludesText: '',
}

function toFormState(pkg: SurfPackage): FormState {
  return {
    name: pkg.name,
    price: pkg.price,
    priceNote: pkg.priceNote ?? '',
    cta: pkg.cta,
    highlighted: pkg.highlighted ?? false,
    includesText: pkg.includes.join('\n'),
    excludesText: (pkg.excludes ?? []).join('\n'),
  }
}

function linesToArray(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export default function SurfAdmin() {
  const { surfPackages, addSurfPackage, updateSurfPackage, deleteSurfPackage } = useData()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<SurfPackage | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEdit = (pkg: SurfPackage) => {
    setForm(toFormState(pkg))
    setEditingId(pkg.id)
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim() || !form.cta.trim()) return
    const payload: Omit<SurfPackage, 'id'> = {
      name: form.name,
      price: form.price,
      priceNote: form.priceNote.trim() || undefined,
      cta: form.cta,
      highlighted: form.highlighted,
      includes: linesToArray(form.includesText),
      excludes: linesToArray(form.excludesText).length ? linesToArray(form.excludesText) : undefined,
    }
    setSaving(true)
    setError('')
    try {
      if (editingId !== null) {
        await updateSurfPackage(editingId, payload)
      } else {
        await addSurfPackage(payload)
      }
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this package.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteSurfPackage(deleteTarget.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this package.')
    }
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ocean-deep">Surf Packages</h1>
          <p className="mt-1 text-sm text-ink/60">
            Pricing tiers shown in the "Find Your Wave" section.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {surfPackages.map((pkg) => (
          <div key={pkg.id} className="rounded-2xl bg-white p-6 shadow-soft">
            {pkg.highlighted && (
              <span className="surf-report mb-3 inline-block rounded-full bg-coral/15 px-3 py-1 text-[0.6rem] text-coral-dark">
                Most Popular
              </span>
            )}
            <h3 className="font-display text-lg font-semibold text-ocean-deep">{pkg.name}</h3>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-ocean-deep">{pkg.price}</span>
              {pkg.priceNote && <span className="text-xs text-ink/50">{pkg.priceNote}</span>}
            </p>
            <ul className="mt-3 space-y-1.5">
              {pkg.includes.map((inc) => (
                <li key={inc} className="flex items-center gap-2 text-xs text-ink/70">
                  <Check className="h-3.5 w-3.5 shrink-0 text-lagoon" /> {inc}
                </li>
              ))}
              {pkg.excludes?.map((exc) => (
                <li key={exc} className="flex items-center gap-2 text-xs text-ink/40">
                  <XIcon className="h-3.5 w-3.5 shrink-0" /> {exc}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openEdit(pkg)}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2 text-xs font-semibold text-ink/70 transition-colors hover:bg-ink/5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(pkg)}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-coral/40 py-2 text-xs font-semibold text-coral-dark transition-colors hover:bg-coral/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showForm}
        title={editingId !== null ? 'Edit Surf Package' : 'Add Surf Package'}
        onClose={() => setShowForm(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Beginner Package"
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price">
              <input
                className={inputClass}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Rs. 5,000"
                required
              />
            </FormField>
            <FormField label="Price Note" hint="Optional, e.g. / hour">
              <input
                className={inputClass}
                value={form.priceNote}
                onChange={(e) => setForm({ ...form, priceNote: e.target.value })}
                placeholder="/ hour"
              />
            </FormField>
          </div>
          <FormField label="Includes" hint="One item per line.">
            <textarea
              className={inputClass}
              rows={3}
              value={form.includesText}
              onChange={(e) => setForm({ ...form, includesText: e.target.value })}
              placeholder={'Surfing lessons\nSurfboard'}
            />
          </FormField>
          <FormField label="Excludes" hint="Optional, one item per line.">
            <textarea
              className={inputClass}
              rows={2}
              value={form.excludesText}
              onChange={(e) => setForm({ ...form, excludesText: e.target.value })}
              placeholder="No teacher included"
            />
          </FormField>
          <FormField label="Button Text">
            <input
              className={inputClass}
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              placeholder="Choose Beginner"
              required
            />
          </FormField>
          <label className="mb-4 flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.highlighted}
              onChange={(e) => setForm({ ...form, highlighted: e.target.checked })}
              className="h-4 w-4 rounded border-ink/25"
            />
            Mark as "Most Popular"
          </label>
          {error && <p className="mb-3 text-sm text-coral-dark">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="focus-ring rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="focus-ring rounded-full bg-ocean-deep px-5 py-2 text-sm font-semibold text-sand transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId !== null ? 'Save Changes' : 'Add Package'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete surf package?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
