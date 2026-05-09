'use client'
import { create } from 'zustand'

const applyTheme = (isDay) => {
  if (typeof document === 'undefined') return
  if (isDay) {
    document.documentElement.classList.add('day')
  } else {
    document.documentElement.classList.remove('day')
  }
  try { localStorage.setItem('mow-theme', isDay ? 'day' : 'night') } catch {}
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem('mow-theme') === 'day'
  } catch {
    return false
  }
}

export const useThemeStore = create((set, get) => ({
  isDay: false,

  init: () => {
    const isDay = getInitialTheme()
    applyTheme(isDay)
    set({ isDay })
  },

  toggle: () => {
    const isDay = !get().isDay
    applyTheme(isDay)
    set({ isDay })
  },
}))
