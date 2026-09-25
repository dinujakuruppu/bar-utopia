'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useData } from '../../store/DataContext'
import { GALLERY_CATEGORIES } from '@backend/data/galleryData'
import type { GalleryCategory, GalleryImage } from '@backend/types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import FormField, { inputClass } from '../components/FormField'
import ImageInput from '../components/ImageInput'

const categoryOptions = GALLERY_CATEGORIES.filter((c) => c !== 'All') as GalleryCategory[]

type FormState = Omit<GalleryImage, 'id'>

const emptyForm: FormState = {
  src: '',
  alt: '',
  category: categoryOptions[0],
}

export default function GalleryAdmin() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useData()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEdit = (img: GalleryImage) => {
    const { id, ...rest } = img
    setForm(rest)
    setEditingId(id)
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.src.trim() || !form.alt.trim()) return

    setSaving(true)
    setError('')
    try {
      if (editingId !== null) {
        await updateGalleryImage(editingId, form)
      } else {
        await addGalleryImage(form)
      }
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this image.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteGalleryImage(deleteTarget.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this image.')
    }
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ocean-deep">Gallery</h1>
          <p className="mt-1 text-sm text-ink/60">Images shown in the site's photo gallery.</p>
        </div>
        <button
          onClick={openAdd}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add Image
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {galleryImages.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
            <div className="relative h-32">
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
              <span className="surf-report absolute left-2 top-2 rounded-full bg-ocean-deep/85 px-2 py-0.5 text-[0.55rem] text-sand">
                {img.category}
              </span>
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-xs text-ink/60">{img.alt}</p>
              <div className="mt-2 flex gap-1.5">
                <button
                  onClick={() => openEdit(img)}
                  className="focus-ring flex flex-1 items-center justify-center gap-1 rounded-full border border-ink/15 py-1.5 text-[0.65rem] font-semibold text-ink/70 transition-colors hover:bg-ink/5"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(img)}
                  className="focus-ring flex flex-1 items-center justify-center gap-1 rounded-full border border-coral/40 py-1.5 text-[0.65rem] font-semibold text-coral-dark transition-colors hover:bg-coral/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showForm}
        title={editingId !== null ? 'Edit Image' : 'Add Image'}
        onClose={() => setShowForm(false)}
      >
        <form onSubmit={handleSubmit}>
          <ImageInput
            label="Photo"
            value={form.src}
            onChange={(src) => setForm({ ...form, src })}
            required
          />
          <FormField label="Alt Text" hint="Describes the image for accessibility & SEO.">
            <input
              className={inputClass}
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              placeholder="e.g. Turquoise waves rolling onto the beach"
              required
            />
          </FormField>
          <FormField label="Category">
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as GalleryCategory })}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>
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
              {saving ? 'Saving…' : editingId !== null ? 'Save Changes' : 'Add Image'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete image?"
        message="This image will be permanently removed from the gallery."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
