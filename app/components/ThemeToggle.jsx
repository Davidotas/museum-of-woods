'use client'
import { useEffect } from 'react'
import { useThemeStore } from '../store/theme'

export default function ThemeToggle() {
  const { isDay, toggle, init } = useThemeStore()

  useEffect(() => { init() }, [])

  return (
    <button
      onClick={toggle}
      aria-label={isDay ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isDay ? 'Dark mode' : 'Light mode'}
      className="relative flex items-center gap-2 no-theme-transition"
    >
      {/* Toggle pill */}
      <span
        className="relative flex items-center w-12 h-6 rounded-full transition-colors duration-400 no-theme-transition"
        style={{
          background: isDay
            ? 'linear-gradient(135deg, #ffffff 0%, #f0ece6 100%)'   /* white for light */
            : 'linear-gradient(135deg, #1a3020 0%, #0f2018 100%)',  /* forest green for dark */
          border: isDay
            ? '1px solid rgba(150,130,110,0.35)'
            : '1px solid rgba(61,90,62,0.55)',
          boxShadow: isDay
            ? 'inset 0 1px 3px rgba(0,0,0,0.08)'
            : 'inset 0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        {/* Stars (dark/night mode) */}
        {!isDay && (
          <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" aria-hidden>
            <span className="absolute top-1   left-2   w-0.5 h-0.5 rounded-full bg-white opacity-50" />
            <span className="absolute top-2.5 left-4   w-0.5 h-0.5 rounded-full bg-white opacity-30" />
            <span className="absolute bottom-1.5 left-2.5 w-px h-px rounded-full bg-white opacity-40" />
          </span>
        )}

        {/* Sliding thumb */}
        <span
          className="absolute flex items-center justify-center w-5 h-5 rounded-full shadow-lg transition-all duration-400 no-theme-transition"
          style={{
            left: isDay ? 'calc(100% - 1.375rem)' : '2px',
            background: isDay
              ? 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' /* light grey/white thumb */
              : 'linear-gradient(135deg, #3d5a3e 0%, #2a4230 100%)', /* deep green thumb */
            boxShadow: isDay
              ? '0 2px 6px rgba(0,0,0,0.18)'
              : '0 2px 8px rgba(0,0,0,0.5)',
            border: isDay
              ? '1px solid rgba(120,100,80,0.2)'
              : '1px solid rgba(100,140,100,0.25)',
          }}
        >
          {/* Sun icon (light mode) */}
          {isDay ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8a6a40" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="2"  x2="12" y2="4"  />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="2"  y1="12" x2="4"  y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
            </svg>
          ) : (
            /* Moon icon (dark mode) */
            <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(200,220,200,0.9)" stroke="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </span>
      </span>

      {/* Text label */}
      <span
        className="font-sans text-[9px] tracking-[.18em] uppercase hidden sm:block no-theme-transition"
        style={{ color: isDay ? 'rgba(80,55,30,0.6)' : 'rgba(255,255,255,0.45)' }}
      >
        {isDay ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
