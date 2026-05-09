'use client'
import { useEffect } from 'react'
import { useCurrencyStore } from '../store/currency'

export default function CurrencyProvider({ children }) {
  const detect = useCurrencyStore(s => s.detect)
  useEffect(() => { detect() }, [])
  return children
}
