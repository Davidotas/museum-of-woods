'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useCartStore } from '../store/cart'
import { useSettingsStore } from '../store/settings'
import { useCurrencyStore } from '../store/currency'
import Nav from '../components/Nav'

const STEPS = ['Bag', 'Details', 'Pay']

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCartStore()
  const whatsappNumber = useSettingsStore(s => s.whatsappNumber)
  const { format, currency } = useCurrencyStore()
  const [step, setStep] = useState(0)
  const [whatsappSent, setWhatsappSent] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postcode: '', country: 'United Kingdom',
    delivery: 'standard',
  })
  const [errors, setErrors] = useState({})
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError]     = useState('')
  const containerRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  }, [])

  const animStep = () => {
    gsap.fromTo(formRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
  }

  const cartTotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0)
  const delivery  = form.delivery === 'express' ? 12.99 : cartTotal >= 80 ? 0 : 5.99
  const grandTotal = (cartTotal + delivery).toFixed(2)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.includes('@')) e.email  = 'Valid email required'
    if (!form.address.trim())   e.address   = 'Required'
    if (!form.city.trim())      e.city      = 'Required'
    if (!form.postcode.trim())  e.postcode  = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && !validate()) return
    setStep(s => s + 1)
    animStep()
  }

  const payWithStripe = async () => {
    setStripeLoading(true)
    setStripeError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerEmail: form.email,
          deliveryMethod: form.delivery,
          deliveryFee: delivery,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setStripeError(data.error || 'Payment failed. Please try again.')
      }
    } catch {
      setStripeError('Could not connect to payment service. Please try again.')
    } finally {
      setStripeLoading(false)
    }
  }

  const payManually = () => {
    // Build WhatsApp message
    const itemLines = items.map(i =>
      `• ${i.name}${i.engravingText ? ` _(${i.engravingText})_` : ''} × ${i.qty || 1} — ${format(i.price * (i.qty || 1))}`
    ).join('\n')

    const deliveryLabel = form.delivery === 'express'
      ? `Express (7–10 days) — ${format(12.99)}`
      : delivery === 0 ? 'Standard (14–21 days) — Free' : `Standard (14–21 days) — ${format(delivery)}`

    const currencyNote = currency.code !== 'GBP' ? ` (≈ £${grandTotal} GBP)` : ''

    const msg = [
      `Hello Museum of Woods! 🌿`,
      ``,
      `I'd like to place an order:`,
      ``,
      `*Order Items:*`,
      itemLines,
      ``,
      `*Delivery:* ${deliveryLabel}`,
      `*Total:* ${format(grandTotal)}${currencyNote}`,
      ``,
      `*My Details:*`,
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
      `Address: ${form.address}, ${form.city}, ${form.postcode}`,
      ``,
      `Please confirm my order. Thank you!`,
    ].filter(l => l !== null).join('\n')

    // Strip to E.164 — remove spaces, dashes, parens
    const clean = whatsappNumber.replace(/[\s\-()]/g, '')
    const waUrl = `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`

    // Open WhatsApp in new tab, clear cart, show confirmation
    window.open(waUrl, '_blank', 'noopener,noreferrer')
    clearCart()
    setWhatsappSent(true)
  }

  const Field = ({ id, label, half = false, ...rest }) => (
    <div className={half ? 'flex-1' : 'w-full'}>
      <label className="text-xs uppercase tracking-widest text-fog/35 block mb-1.5">{label}</label>
      <input
        id={id}
        value={form[id] || ''}
        onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: '' })) }}
        className={`w-full bg-bark/20 border ${errors[id] ? 'border-red-400/60' : 'border-fog/10'} rounded-xl px-4 py-3 text-fog/80 text-sm placeholder-fog/20 outline-none focus:border-amber/30 transition-colors`}
        {...rest}
      />
      {errors[id] && <p className="text-red-400 text-xs mt-1">{errors[id]}</p>}
    </div>
  )


  if (whatsappSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}>
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="font-serif text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>WhatsApp Opened</h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            Your order details have been pre-filled in WhatsApp.
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--text-subtle)' }}>
            Just hit <strong>Send</strong> — we'll confirm your order and arrange payment within 24 hours.
          </p>
          <div className="rounded-xl p-4 mb-8 text-left text-sm space-y-1"
            style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)' }}>
            <p style={{ color: 'var(--text-muted)' }}>✓ Cart cleared</p>
            <p style={{ color: 'var(--text-muted)' }}>✓ Order summary sent to WhatsApp</p>
            <p style={{ color: 'var(--text-muted)' }}>✓ We'll reply within 24 hours</p>
          </div>
          <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Nav />

      <div ref={containerRef} className="max-w-screen-lg mx-auto px-6 md:px-10 pt-32 pb-20">
        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-12 justify-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`flex items-center gap-2 text-xs uppercase tracking-widest ${i <= step ? 'text-amber' : 'text-fog/25'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                  i < step ? 'bg-amber border-amber text-forest' : i === step ? 'border-amber text-amber' : 'border-fog/15 text-fog/25'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px ${i < step ? 'bg-amber' : 'bg-fog/10'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left — step content */}
          <div ref={formRef}>
            {/* STEP 0 — Cart review */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-2xl text-fog/90 mb-6">Your Bag</h2>
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-fog/40 mb-4">Your bag is empty</p>
                    <Link href="/shop" className="text-amber text-sm underline">Browse the collection</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.key || item.id} className="flex gap-4 p-4 bg-bark/15 rounded-2xl">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-fog/85 font-medium text-sm">{item.name}</h3>
                          <p className="text-fog/40 text-xs mt-0.5">{item.material}</p>
                          {item.engravingText && (
                            <p className="text-amber/60 text-xs mt-1 italic">"{item.engravingText}"</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-amber font-medium">{format(item.price)}</span>
                            <button onClick={() => removeItem(item.key || item.id)} className="text-fog/25 hover:text-red-400 text-xs transition-colors">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 — Delivery details */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl text-fog/90 mb-6">Delivery Details</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Field id="firstName" label="First Name" half placeholder="Ada" />
                    <Field id="lastName" label="Last Name" half placeholder="Lovelace" />
                  </div>
                  <Field id="email" label="Email Address" type="email" placeholder="ada@example.com" />
                  <Field id="phone" label="Phone (optional)" type="tel" placeholder="+44 7..." />
                  <Field id="address" label="Street Address" placeholder="12 Oak Lane, Flat 3" />
                  <div className="flex gap-3">
                    <Field id="city" label="City" half placeholder="London" />
                    <Field id="postcode" label="Postcode" half placeholder="E1 6RF" />
                  </div>

                  {/* Delivery options */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-fog/35 block mb-3">Delivery Method</label>
                    <div className="space-y-2">
                      {[
                        { id: 'standard', label: 'Standard — 14–21 business days', price: cartTotal >= 80 ? 'Free' : format(5.99) },
                        { id: 'express',  label: 'Express — 7–10 business days',   price: format(12.99) },
                      ].map(opt => (
                        <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          form.delivery === opt.id ? 'border-amber/40 bg-amber/5' : 'border-fog/10 hover:border-fog/20'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.delivery === opt.id ? 'border-amber' : 'border-fog/20'}`}>
                              {form.delivery === opt.id && <div className="w-2 h-2 rounded-full bg-amber" />}
                            </div>
                            <span className="text-fog/70 text-sm">{opt.label}</span>
                          </div>
                          <span className={`text-sm font-medium ${form.delivery === opt.id ? 'text-amber' : 'text-fog/40'}`}>{opt.price}</span>
                          <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id}
                            onChange={e => setForm(f => ({ ...f, delivery: e.target.value }))} className="sr-only" />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Pay */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl text-fog/90 mb-6">Pay &amp; Place Order</h2>

                {/* Order review */}
                <div className="bg-bark/15 rounded-2xl p-6 space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-fog/40">Name</span>
                    <span className="text-fog/80">{form.firstName} {form.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fog/40">Email</span>
                    <span className="text-fog/80">{form.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fog/40">Address</span>
                    <span className="text-fog/80 text-right">{form.address}, {form.city}, {form.postcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fog/40">Delivery</span>
                    <span className="text-fog/80 capitalize">{form.delivery}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-fog/8 font-medium">
                    <span className="text-fog/60">Total</span>
                    <span className="text-amber">{format(grandTotal)}</span>
                  </div>
                </div>

                {/* Stripe error */}
                {stripeError && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-sm text-red-400 mb-4">
                    {stripeError}
                  </div>
                )}

                {/* Primary — Stripe */}
                <button
                  onClick={payWithStripe}
                  disabled={stripeLoading}
                  className="w-full flex items-center justify-center gap-3 bg-amber text-forest py-4 rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-amber/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-3"
                >
                  {stripeLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Redirecting to payment…
                    </>
                  ) : (
                    <>🔒 Pay {format(grandTotal)} with Card (Stripe)</>
)}
                </button>

                {/* Secondary — Manual */}
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-fog/10" />
                  <span className="text-fog/25 text-xs uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-fog/10" />
                </div>

                <button
                  onClick={payManually}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{ background: '#25d366', color: '#fff' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Send Order on WhatsApp
                </button>
                <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-subtle)' }}>
                  Opens WhatsApp with your order pre-filled — just tap Send. We reply within 24 hours.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button onClick={() => { setStep(s => s - 1); animStep() }}
                  className="px-6 py-3 border border-fog/15 text-fog/50 rounded-xl text-sm hover:border-fog/30 transition-all">
                  ← Back
                </button>
              )}
              {step < 2 ? (
                <button
                  onClick={next}
                  disabled={step === 0 && items.length === 0}
                  className="flex-1 bg-amber text-forest py-3 rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-amber/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {step === 0 ? 'Proceed to Details →' : 'Review Order →'}
                </button>
              ) : (
                <button
                  onClick={payWithStripe}
                  disabled={stripeLoading}
                  className="flex-1 bg-amber text-forest py-3 rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-amber/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {stripeLoading ? 'Redirecting…' : `🔒 Pay ${format(grandTotal)} ✦`}
                </button>
              )}
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="bg-bark/15 rounded-2xl p-6 sticky top-28">
            <h3 className="font-serif text-lg text-fog/80 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.key || item.id} className="flex justify-between text-sm">
                  <span className="text-fog/60">{item.name}</span>
                  <span className="text-fog/80">{format(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-fog/8 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-fog/50">
                <span>Subtotal</span>
                <span>{format(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-fog/50">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : format(delivery)}</span>
              </div>
              <div className="flex justify-between text-fog/90 font-medium text-base pt-2 border-t border-fog/8">
                <span>Total</span>
                <span className="text-amber">{format(grandTotal)}</span>
              </div>
            </div>
            {cartTotal < 80 && (
              <p className="text-fog/30 text-xs mt-3 text-center">
                Add {format(80 - cartTotal)} more for free delivery
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-fog/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-fog/30">
                <span>🔒</span><span>Secure & encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-fog/30">
                <span>📦</span><span>Tracked delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-fog/30">
                <span>✦</span><span>Handcrafted Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
