'use client'

import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} maxWidth="max-w-sm">
      <p className="text-sm text-ink/70">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="focus-ring rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="focus-ring rounded-full bg-coral px-5 py-2 text-sm font-semibold text-sand transition-transform hover:scale-105"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
