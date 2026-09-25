'use client'

import { useState, type FormEvent } from 'react'
import { useData } from '../../store/DataContext'
import { useAdminAuth } from '../../store/AdminAuthContext'
import FormField, { inputClass } from '../components/FormField'

export default function SettingsAdmin() {
  const { settings, updateSettings } = useData()
  const { changePassword, email } = useAdminAuth()

  const [form, setForm] = useState(settings)
  const [savedMessage, setSavedMessage] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsError, setSettingsError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null,
  )
  const [changingPassword, setChangingPassword] = useState(false)

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setSettingsError('')
    try {
      await updateSettings(form)
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2500)
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSavingSettings(false)
    }
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordMessage(null)

    const result = await changePassword(currentPassword, newPassword)
    if (result.ok) {
      setPasswordMessage({ type: 'ok', text: 'Password updated.' })
      setCurrentPassword('')
      setNewPassword('')
    } else {
      setPasswordMessage({ type: 'error', text: result.error ?? 'Could not update password.' })
    }
    setChangingPassword(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ocean-deep">Settings</h1>
      <p className="mt-1 text-sm text-ink/60">
        Contact details, social links, and booking information shown across the site.
      </p>

      <form onSubmit={handleSave} className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-ocean-deep">Contact Info</h2>
        <div className="mt-4">
          <FormField label="Address">
            <input
              className={inputClass}
              value={form.contact.address}
              onChange={(e) =>
                setForm({ ...form, contact: { ...form.contact, address: e.target.value } })
              }
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone">
              <input
                className={inputClass}
                value={form.contact.phone}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })
                }
              />
            </FormField>
            <FormField label="Email">
              <input
                className={inputClass}
                value={form.contact.email}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, email: e.target.value } })
                }
              />
            </FormField>
          </div>
          <FormField label="Opening Hours">
            <input
              className={inputClass}
              value={form.contact.hours}
              onChange={(e) =>
                setForm({ ...form, contact: { ...form.contact, hours: e.target.value } })
              }
            />
          </FormField>
          <FormField label="Google Maps Embed URL" hint="Used for the embedded map (if shown).">
            <input
              className={inputClass}
              value={form.mapEmbedUrl}
              onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
            />
          </FormField>
        </div>

        <h2 className="mt-8 font-display text-base font-semibold text-ocean-deep">Social Links</h2>
        <div className="mt-4">
          <FormField label="Instagram URL">
            <input
              className={inputClass}
              value={form.social.instagram}
              onChange={(e) =>
                setForm({ ...form, social: { ...form.social, instagram: e.target.value } })
              }
            />
          </FormField>
          <FormField label="Facebook URL">
            <input
              className={inputClass}
              value={form.social.facebook}
              onChange={(e) =>
                setForm({ ...form, social: { ...form.social, facebook: e.target.value } })
              }
            />
          </FormField>
          <FormField label="TripAdvisor URL" hint="Optional.">
            <input
              className={inputClass}
              value={form.social.tripadvisor ?? ''}
              onChange={(e) =>
                setForm({ ...form, social: { ...form.social, tripadvisor: e.target.value } })
              }
            />
          </FormField>
        </div>

        <h2 className="mt-8 font-display text-base font-semibold text-ocean-deep">
          Parrot Perch Villa
        </h2>
        <div className="mt-4">
          <FormField
            label="Booking.com Listing URL"
            hint="Accommodation booking always redirects to Booking.com — no booking system lives on this site."
          >
            <input
              className={inputClass}
              value={form.bookingUrl}
              onChange={(e) => setForm({ ...form, bookingUrl: e.target.value })}
            />
          </FormField>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={savingSettings}
            className="focus-ring rounded-full bg-ocean-deep px-6 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingSettings ? 'Saving…' : 'Save Settings'}
          </button>
          {savedMessage && <span className="text-sm text-lagoon">Saved.</span>}
          {settingsError && <span className="text-sm text-coral-dark">{settingsError}</span>}
        </div>
      </form>

      <form onSubmit={handlePasswordChange} className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-ocean-deep">Admin Password</h2>
        <p className="mt-1 text-xs text-ink/50">
          Changes the password for {email ?? 'your admin account'} in Supabase Auth. You will be
          asked for your current password to confirm it is you.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Current Password">
            <input
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormField>
          <FormField label="New Password" hint="At least 8 characters.">
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={changingPassword}
            className="focus-ring rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? 'Updating…' : 'Update Password'}
          </button>
          {passwordMessage && (
            <span className={`text-sm ${passwordMessage.type === 'ok' ? 'text-lagoon' : 'text-coral-dark'}`}>
              {passwordMessage.text}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
