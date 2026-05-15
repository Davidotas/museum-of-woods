'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const safeStorage = createJSONStorage(() =>
  typeof window !== 'undefined'
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
)

export const useSettingsStore = create(
  persist(
    (set) => ({
      whatsappNumber: '+447000000000', // update in admin → Payment
      storeName: 'Museum of Woods',
      contactEmail: 'hello@museumofwoods.co',
      defaultCurrency: 'GBP',

      update: (key, value) => set(state => ({ ...state, [key]: value })),
      updateAll: (fields) => set(state => ({ ...state, ...fields })),
    }),
    {
      name: 'mow-settings',
      storage: safeStorage,
    }
  )
)
