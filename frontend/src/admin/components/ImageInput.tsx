'use client'

import { useRef, useState } from 'react'
import { ImageUp, Loader2 } from 'lucide-react'
import { useData } from '../../store/DataContext'
import FormField, { inputClass } from './FormField'

/**
 * Image picker for the admin forms: upload a photo straight to Supabase
 * Storage, or paste a URL from elsewhere. Either way the field's value is the
 * public URL that gets saved with the record.
 */
export default function ImageInput({
  label,
  value,
  onChange,
  required = false,
  hint = 'Upload a photo, or paste a direct image URL.',
}: {
  label: string
  value: string
  onChange: (url: string) => void
  required?: boolean
  hint?: string
}) {
  const { uploadImage } = useData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewFailed, setPreviewFailed] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file)
      setPreviewFailed(false)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <FormField label={label}>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={value}
          onChange={(e) => {
            setPreviewFailed(false)
            onChange(e.target.value)
          }}
          placeholder="https://..."
          required={required}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="focus-ring inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-ink/15 px-3.5 py-2.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageUp className="h-4 w-4" />
          )}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <p className="mt-1 text-xs text-ink/45">{hint}</p>
      {error && <p className="mt-2 text-xs text-coral-dark">{error}</p>}

      {value && !previewFailed && (
        // eslint-disable-next-line @next/next/no-img-element -- URLs are arbitrary/admin-supplied
        <img
          src={value}
          alt="Preview"
          className="mt-3 h-32 w-full rounded-xl object-cover"
          onError={() => setPreviewFailed(true)}
        />
      )}
    </FormField>
  )
}
