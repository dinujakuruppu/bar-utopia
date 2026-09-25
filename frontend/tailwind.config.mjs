/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'ocean-deep': '#0E4749',
        'ocean-mid': '#12595C',
        lagoon: '#17A398',
        'lagoon-light': '#5FCFC0',
        sand: '#F6EEE0',
        'sand-dark': '#E8DAC0',
        coral: '#FF6F52',
        'coral-dark': '#E85A3E',
        palm: '#4C7A5E',
        ink: '#122223',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        body: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        mono: ['var(--font-space-mono)', '"Space Mono"', 'monospace'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, rgba(14,71,73,0.05) 0%, rgba(14,71,73,0.85) 100%)',
      },
      boxShadow: {
        soft: '0 20px 60px -15px rgba(14,71,73,0.35)',
        glass: '0 8px 32px rgba(14,71,73,0.15)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(-15px) translateY(8px)' },
        },
        tide: {
          '0%': { backgroundPositionX: '0' },
          '100%': { backgroundPositionX: '1000px' },
        },
      },
      animation: {
        drift: 'drift 6s ease-in-out infinite',
        tide: 'tide 20s linear infinite',
      },
    },
  },
  plugins: [],
}
