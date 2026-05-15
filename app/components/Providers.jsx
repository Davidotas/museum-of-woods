'use client'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import CurrencyProvider from './CurrencyProvider'
import { useProductStore } from '../store/products'

function ProductSyncer() {
  const fetchAll = useProductStore(s => s.fetchAll)
  useEffect(() => { fetchAll() }, [fetchAll])
  return null
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <ProductSyncer />
        {children}
      </CurrencyProvider>
    </SessionProvider>
  )
}
