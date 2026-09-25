'use client'

interface TideLineProps {
  color?: string
  className?: string
}

/**
 * The recurring visual signature for Bar Utopia: a gentle animated wave
 * seam marking the transition between sections, echoing the shoreline.
 */
export default function TideLine({ color = '#17A398', className = '' }: TideLineProps) {
  return (
    <div className={`tide-line ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1000 28" preserveAspectRatio="none">
        <path
          d="M0 14 Q 25 0 50 14 T 100 14 T 150 14 T 200 14 T 250 14 T 300 14 T 350 14 T 400 14 T 450 14 T 500 14 T 550 14 T 600 14 T 650 14 T 700 14 T 750 14 T 800 14 T 850 14 T 900 14 T 950 14 T 1000 14 L 1000 28 L 0 28 Z"
          fill={color}
          opacity="0.9"
        />
      </svg>
    </div>
  )
}
