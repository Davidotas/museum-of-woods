'use client'
import { useEffect } from 'react'
import { useThemeStore } from '../store/theme'

export default function ThemeToggle() {
  const { isDay, toggle, init } = useThemeStore()

  useEffect(() => { init() }, [])

  return (
    <button
      onClick={toggle}
      aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      title={isDay ? 'Night mode' : 'Day mode'}
      className="relative flex items-center gap-1.5 no-theme-transition"
      style={{ color: 'rgba(255,255,255,0.55)' }}
    >
      {/* Toggle pill */}
      <span
        className="relative flex items-center w-12 h-6 rounded-full transition-colors duration-400 no-theme-transition"
        style={{
          background: isDay
            ? 'linear-gradient(135deg, #e8c97a 0%, #f5d78e 100%)'
            : 'rgba(255,255,255,0.08)',
          border: isDay
            ? '1px solid rgba(184,116,60,0.4)'
            : '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Stars (night) */}
        {!isDay && (
          <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" aria-hidden>
            <span className="absolute top-1 left-2 w-0.5 h-0.5 rounded-full bg-white opacity-50" />
            <span className="absolute top-2.5 left-4 w-0.5 h-0.5 rounded-full bg-white opacity-30" />
            <span className="absolute bottom-1.5 left-2.5 w-px h-px rounded-full bg-white opacity-40" />
          </span>
        )}

        {/* Sliding thumb */}
        <span
          className="absolute flex items-center justify-center w-5 h-5 rounded-full shadow-lg transition-all duration-400 no-theme-transition"
          style={{
            left: isDay ? 'calc(100% - 1.375rem)' : '2px',
            background: isDay
              ? 'linear-gradient(135deg, #f5a623 0%, #f0d060 100%)'
              : 'linear-gradient(135deg, #c9a27e 0%, #a07850 100%)',
            boxShadow: isDay
              ? '0 2px 8px rgba(245,166,35,0.5)'
              : '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {isDay ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  )
}
