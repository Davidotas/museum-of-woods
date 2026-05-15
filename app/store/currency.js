'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const safeStorage = createJSONStorage(() =>
  typeof window !== 'undefined'
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
)

// All rates are multipliers from GBP base — admin can edit these
export const SEED_RATES = {
  GB: { code: 'GBP', symbol: '£',    name: 'British Pound',      rate: 1.0    },
  US: { code: 'USD', symbol: '$',     name: 'US Dollar',          rate: 1.27   },
  CA: { code: 'CAD', symbol: 'CA$',   name: 'Canadian Dollar',    rate: 1.72   },
  NG: { code: 'NGN', symbol: '₦',     name: 'Nigerian Naira',     rate: 2050   },
  GH: { code: 'GHS', symbol: 'GH₵',  name: 'Ghanaian Cedi',      rate: 15.8   },
  KE: { code: 'KES', symbol: 'KSh',   name: 'Kenyan Shilling',    rate: 164    },
  ZA: { code: 'ZAR', symbol: 'R',     name: 'South African Rand', rate: 23.6   },
  EU: { code: 'EUR', symbol: '€',     name: 'Euro',               rate: 1.17   },
  AU: { code: 'AUD', symbol: 'A$',    name: 'Australian Dollar',  rate: 1.94   },
  NZ: { code: 'NZD', symbol: 'NZ$',   name: 'New Zealand Dollar', rate: 2.11   },
  AE: { code: 'AED', symbol: 'AED',   name: 'UAE Dirham',         rate: 4.66   },
  SG: { code: 'SGD', symbol: 'S$',    name: 'Singapore Dollar',   rate: 1.70   },
}

// Maps country codes → SEED_RATES key
const COUNTRY_TO_KEY = {
  GB:'GB', US:'US', CA:'CA', NG:'NG', GH:'GH', KE:'KE', ZA:'ZA',
  AU:'AU', NZ:'NZ', AE:'AE', SG:'SG',
  // EU bloc
  AT:'EU',BE:'EU',BG:'EU',CY:'EU',CZ:'EU',DK:'EU',EE:'EU',FI:'EU',
  FR:'EU',DE:'EU',GR:'EU',HU:'EU',HR:'EU',IE:'EU',IT:'EU',LV:'EU',
  LT:'EU',LU:'EU',MT:'EU',NL:'EU',PL:'EU',PT:'EU',RO:'EU',SK:'EU',
  SI:'EU',ES:'EU',SE:'EU',
}

const formatPrice = (gbpPrice, currency) => {
  const raw = gbpPrice * currency.rate
  const decimals = raw >= 500 ? 0 : 2
  return `${currency.symbol}${raw.toLocaleString('en', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency:  SEED_RATES.NG,
      country:   'NG',
      detected:  false,
      forcedKey: 'NG',          // default to NGN; admin can change via Currency tab
      rates:     { ...SEED_RATES },

      detect: async () => {
        const { forcedKey, rates, detected } = get()

        // Admin-forced currency takes priority — apply and exit
        if (forcedKey) {
          const c = rates[forcedKey] || SEED_RATES[forcedKey] || SEED_RATES.GB
          set({ currency: c, detected: true })
          return
        }

        // Already geo-detected this session
        if (detected) return

        try {
          // Primary: api.country.is — completely free, no rate limit
          const res = await fetch('https://api.country.is/', {
            signal: AbortSignal.timeout(5000),
            cache: 'no-store',
          })
          const data = await res.json()
          const cc   = data?.country || 'GB'
          const key  = COUNTRY_TO_KEY[cc] || 'GB'
          const c    = rates[key] || SEED_RATES[key] || SEED_RATES.GB
          set({ currency: c, country: cc, detected: true })
        } catch {
          try {
            // Fallback: ipwho.is — 10 k req/month free
            const r2   = await fetch('https://ipwho.is/?fields=country_code', {
              signal: AbortSignal.timeout(4000),
            })
            const d2   = await r2.json()
            const cc   = d2?.country_code || 'GB'
            const key  = COUNTRY_TO_KEY[cc] || 'GB'
            const c    = rates[key] || SEED_RATES.GB
            set({ currency: c, country: cc, detected: true })
          } catch {
            set({ detected: true })   // stays GBP
          }
        }
      },

      format: (gbpPrice) => formatPrice(gbpPrice, get().currency),

      // Admin: force a specific currency key, or null to restore auto-detect
      setForcedCurrency: (key) => {
        if (!key) {
          set({ forcedKey: null, detected: false })
          return
        }
        const { rates } = get()
        const c = rates[key] || SEED_RATES[key] || SEED_RATES.GB
        set({ forcedKey: key, currency: c, detected: true })
      },

      // Admin: live-edit a rate field ('rate', 'symbol', 'name')
      updateRate: (key, field, value) => {
        const parsed = field === 'rate' ? (parseFloat(value) || 0) : value
        set(state => {
          const newRates = {
            ...state.rates,
            [key]: { ...state.rates[key], [field]: parsed },
          }
          // Also update live currency if this is the active one
          const activeKey = state.forcedKey || COUNTRY_TO_KEY[state.country] || 'GB'
          const newCurrency = activeKey === key ? newRates[key] : state.currency
          return { rates: newRates, currency: newCurrency }
        })
      },

      resetRates: () => set({ rates: { ...SEED_RATES } }),
    }),
    {
      name: 'mow-currency-v3',
      storage: safeStorage,
      partialize: (state) => ({
        forcedKey: state.forcedKey,
        rates:     state.rates,
        // Don't persist detected/currency — re-detect on every new session
      }),
    }
  )
)
