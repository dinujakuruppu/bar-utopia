'use client'

import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

export function AnalyticsLoading({ label = 'Loading analytics…' }: { label?: string }) {
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 text-ink/40">
      <Loader2 className="h-5 w-5 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function AnalyticsError({ message }: { message: string }) {
  const isSetupIssue = /not connected|not configured/i.test(message)
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl bg-coral/5 px-6 py-8 text-center">
      <AlertTriangle className="h-5 w-5 text-coral-dark" />
      <p className="max-w-sm text-sm text-coral-dark">{message}</p>
      {isSetupIssue && (
        <p className="text-xs text-ink/45">See ANALYTICS.md for Google Analytics setup instructions.</p>
      )}
    </div>
  )
}

export function AnalyticsEmpty({ message = 'No data for this date range yet.' }: { message?: string }) {
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 text-ink/40">
      <Inbox className="h-5 w-5" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
