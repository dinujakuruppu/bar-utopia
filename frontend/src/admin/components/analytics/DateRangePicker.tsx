'use client'

import { Calendar } from 'lucide-react'
import { DATE_RANGE_OPTIONS, type DateRangeState } from '../../hooks/useDateRange'

interface DateRangePickerProps {
  value: DateRangeState
  onChange: (value: DateRangeState) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5 rounded-full bg-white p-1.5 shadow-soft">
        {DATE_RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ preset: option.value })}
            className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              value.preset === option.value
                ? 'bg-ocean-deep text-sand'
                : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {value.preset === 'custom' && (
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-soft">
          <Calendar className="h-4 w-4 shrink-0 text-ink/40" />
          <input
            type="date"
            value={value.start ?? ''}
            max={value.end ?? undefined}
            onChange={(e) => onChange({ ...value, start: e.target.value })}
            className="focus-ring rounded-lg border-0 bg-transparent text-xs text-ink outline-none sm:text-sm"
          />
          <span className="text-ink/30">–</span>
          <input
            type="date"
            value={value.end ?? ''}
            min={value.start ?? undefined}
            onChange={(e) => onChange({ ...value, end: e.target.value })}
            className="focus-ring rounded-lg border-0 bg-transparent text-xs text-ink outline-none sm:text-sm"
          />
        </div>
      )}
    </div>
  )
}
