'use client'
import { create } from 'zustand'

// Exchange rates relative to GBP (base)
const CURRENCY_MAP = {
  // North America
  US: { code: 'USD', symbol: '$',    name: 'US Dollar',       rate: 1.27 },
  CA: { code: 'CAD', symbol: 'CA$',  name: 'Canadian Dollar', rate: 1.72 },
  MX: { code: 'MXN', symbol: 'MX$',  name: 'Mexican Peso',    rate: 21.5 },
  // Africa
  NG: { code: 'NGN', symbol: '₦',    name: 'Nigerian Naira',  rate: 2050 },
  GH: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi',   rate: 15.8 },
  KE: { code: 'KES', symbol: 'KSh',  name: 'Kenyan Shilling', rate: 164  },
  ZA: { code: 'ZAR', symbol: 'R',    name: 'South African Rand', rate: 23.6 },
  // Europe
  GB: { code: 'GBP', symbol: '£',    name: 'British Pound',   rate: 1.0  },
  DE: { code: 'EUR', symbol: '€',    name: 'Euro',            rate: 1.17 },
  FR: { code: 'EUR', symbol: '€',    name: 'Euro',            rate: 1.17 },
  IE: { code: 'EUR', symbol: '€',    name: 'Euro',            rate: 1.17 },
  NL: { code: 'EUR', symbol: '€',    name: 'Euro',            rate: 1.17 },
  IT: { code: 'EUR', symbol: '€',    name: 'Euro',            rate: 1.17 },
  ES: { code: 'EUR', symbol: '€',    name: 'Euro',            rate: 1.17 },
  // Australia & Asia-Pacific
  AU: { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar', rate: 1.94 },
  NZ: { code: 'NZD', symbol: 'NZ$',  name: 'New Zealand Dollar', rate: 2.11 },
  // Default
  DEFAULT: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1.0 },
}

const formatPrice = (gbpPrice, currency) => {
  const raw = gbpPrice * currency.rate
  // For currencies with large values (NGN, KES etc) show no decimals
  const decimals = raw >= 100 ? 0 : 2
  const formatted = raw.toLocaleString('en', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${currency.symbol}${formatted}`
}

export const useCurrencyStore = create((set, get) => ({
  currency: CURRENCY_MAP.GB,
  country: 'GB',
  loading: true,

  detect: async () => {
    // Don't re-detect if already done
    if (!get().loading) return
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
      const data = await res.json()
      const countryCode = data.country_code || 'GB'
      const currency = CURRENCY_MAP[countryCode] || CURRENCY_MAP.DEFAULT
      set({ currency, country: countryCode, loading: false })
    } catch {
      // Fallback to GBP silently
      set({ currency: CURRENCY_MAP.GB, loading: false })
    }
  },

  format: (gbpPrice) => {
    const { currency } = get()
    return formatPrice(gbpPrice, currency)
  },

  setCurrency: (code) => {
    const found = Object.values(CURRENCY_MAP).find(c => c.code === code)
    if (found) set({ currency: found })
  },
}))
