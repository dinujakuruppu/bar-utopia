'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useData } from '../../store/DataContext'
import { MENU_CATEGORIES } from '@backend/data/menuData'
import type { MenuCategory, MenuItem } from '@backend/types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import FormField, { inputClass } from '../components/FormField'
import ImageInput from '../components/ImageInput'

type FormState = Omit<MenuItem, 'id'>

const emptyForm: FormState = {
  name: '',
  description: '',
  category: MENU_CATEGORIES[0],
  image: '',
  price: '',
}

export default function MenuAdmin() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useData()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEdit = (item: MenuItem) => {
    const { id, ...rest } = item
    setForm(rest)
    setEditingId(id)
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim() || !form.image.trim()) return

    setSaving(true)
    setError('')
    try {
      if (editingId !== null) {
        await updateMenuItem(editingId, form)
      } else {
        await addMenuItem(form)
      }
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this item.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMenuItem(deleteTarget.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this item.')
    }
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ocean-deep">Menu</h1>
          <p className="mt-1 text-sm text-ink/60">
            Food &amp; drink items shown on the site. Set a price for each item below.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
            <div className="relative h-36">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              <span className="surf-report absolute left-3 top-3 rounded-full bg-ocean-deep/85 px-2.5 py-1 text-[0.6rem] text-sand">
                {item.category}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-ocean-deep">{item.name}</h3>
                {item.price && (
                  <span className="whitespace-nowrap rounded-full bg-lagoon/10 px-2.5 py-1 text-xs font-semibold text-lagoon">
                    {item.price}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-ink/60">{item.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2 text-xs font-semibold text-ink/70 transition-colors hover:bg-ink/5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-coral/40 py-2 text-xs font-semibold text-coral-dark transition-colors hover:bg-coral/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {menuItems.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-ink/50">
            No menu items yet. Add your first one.
          </p>
        )}
      </div>

      <Modal
        open={showForm}
        title={editingId !== null ? 'Edit Menu Item' : 'Add Menu Item'}
        onClose={() => setShowForm(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Beachside Burger"
              required
            />
          </FormField>
          <FormField label="Description">
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short, appetising description"
              required
            />
          </FormField>
          <FormField label="Category">
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as MenuCategory })}
            >
              {MENU_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Price" hint="e.g. $14 — leave blank to hide the price on the site.">
            <input
              className={inputClass}
              value={form.price ?? ''}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="$14"
            />
          </FormField>
          <ImageInput
            label="Photo"
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
            required
          />

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
              {saving ? 'Saving…' : editingId !== null ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete menu item?"
        message={`"${deleteTarget?.name}" will be permanently removed from the menu.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
