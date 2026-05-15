'use client'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { useCartStore } from '../../store/cart'
import { useEffect } from 'react'

export default function SuccessPage() {
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Nav />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(220,185,145,0.15)', border: '1px solid rgba(220,185,145,0.3)' }}>
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="font-serif text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Order Confirmed
          </h1>
          <p className="font-sans text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            Thank you for your commission. Payment received via Stripe.
          </p>
          <p className="font-sans text-sm mb-8" style={{ color: 'var(--text-subtle)' }}>
            You'll receive a confirmation email shortly. Your piece will be handcrafted and dispatched within 14–21 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            <Link href="/" className="btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
