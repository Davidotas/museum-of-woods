'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useCartStore } from '../store/cart'
import Nav from '../components/Nav'

const STEPS = ['Bag', 'Details', 'Confirm']

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postcode: '', country: 'United Kingdom',
    delivery: 'standard',
  })
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const [orderId] = useState(() => `MOW-${Math.floor(Math.random() * 9000 + 1000)}`)
  const containerRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  }, [])

  const animStep = () => {
    gsap.fromTo(formRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
  }

  const cartTotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0)
  const delivery = form.delivery === 'express' ? 12.99 : cartTotal >= 80 ? 0 : 5.99
  const grandTotal = (cartTotal + delivery).toFixed(2)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.postcode.trim()) e.postcode = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && !validate()) return
    setStep(s => s + 1)
    animStep()
  }

  const placeOrder = () => {
    setPlaced(true)
    clearCart()
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

  if (placed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f1510' }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-amber/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="font-serif text-3xl text-fog/90 mb-3">Order Placed</h1>
          <p className="text-fog/45 mb-2">Thank you for your commission.</p>
          <p className="text-amber/80 font-mono text-sm mb-8">#{orderId}</p>
          <p className="text-fog/35 text-sm mb-8">
            We'll send a confirmation to <span className="text-fog/60">{form.email}</span>.
            Your piece will be handcrafted and dispatched within {form.delivery === 'express' ? '7–10' : '14–21'} days.
          </p>
          <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>
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
                            <span className="text-amber font-medium">£{item.price}</span>
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
                        { id: 'standard', label: 'Standard — 14–21 business days', price: cartTotal >= 80 ? 'Free' : '£5.99' },
                        { id: 'express',  label: 'Express — 7–10 business days',   price: '£12.99' },
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

            {/* STEP 2 — Confirm */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl text-fog/90 mb-6">Confirm Order</h2>
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
                </div>
                <div className="bg-amber/10 border border-amber/20 rounded-xl p-4 text-sm text-amber/80 mb-6">
                  <p className="font-medium mb-1">Payment — Contact on WhatsApp</p>
                  <p className="text-amber/60 text-xs leading-relaxed">
                    We handle payment directly via WhatsApp or bank transfer. After placing your order, we'll contact you within 24 hours to confirm and process payment securely.
                  </p>
                </div>
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
                  onClick={placeOrder}
                  className="flex-1 bg-amber text-forest py-3 rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-amber/90 transition-all"
                >
                  Place Order ✦
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
                  <span className="text-fog/80">£{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-fog/8 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-fog/50">
                <span>Subtotal</span>
                <span>£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-fog/50">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : `£${delivery.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-fog/90 font-medium text-base pt-2 border-t border-fog/8">
                <span>Total</span>
                <span className="text-amber">£{grandTotal}</span>
              </div>
            </div>
            {cartTotal < 80 && (
              <p className="text-fog/30 text-xs mt-3 text-center">
                Add £{(80 - cartTotal).toFixed(2)} more for free delivery
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
                <span>✦</span><span>Handcrafted in London</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
