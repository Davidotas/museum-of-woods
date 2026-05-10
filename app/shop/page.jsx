'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import { products, categories } from '../data/products'
import { useCartStore } from '../store/cart'
import { useThemeStore } from '../store/theme'
import Price from '../components/Price'

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [justAdded, setJustAdded] = useState(null)
  const addItem   = useCartStore(s => s.addItem)
  const isDay     = useThemeStore(s => s.isDay)

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  const handleAddToCart = (p) => {
    addItem(p)
    setJustAdded(p.id)
    setTimeout(() => setJustAdded(null), 2000)
  }

  // Theme-reactive palette
  const bg       = isDay ? '#ffffff'               : '#0f1510'
  const card     = isDay ? '#f5f5f5'               : '#1a2318'
  const imgBg    = isDay ? '#e8e4de'               : '#141c12'
  const text90   = isDay ? 'rgba(10,10,10,0.90)'   : 'rgba(255,255,255,0.90)'
  const text30   = isDay ? 'rgba(10,10,10,0.40)'   : 'rgba(255,255,255,0.30)'
  const text20   = isDay ? 'rgba(10,10,10,0.30)'   : 'rgba(255,255,255,0.20)'
  const text60   = isDay ? 'rgba(10,10,10,0.65)'   : 'rgba(255,255,255,0.60)'
  const amber    = isDay ? '#6e3c14'               : '#c9a27e'
  const border5  = isDay ? 'rgba(10,10,10,0.06)'   : 'rgba(255,255,255,0.05)'
  const border10 = isDay ? 'rgba(10,10,10,0.10)'   : 'rgba(255,255,255,0.10)'
  const filterBtn = isDay
    ? 'border-[rgba(10,10,10,0.15)] text-[rgba(10,10,10,0.45)] hover:border-[#6e3c14] hover:text-[#6e3c14]'
    : 'border-white/10 text-white/35 hover:border-amber/40 hover:text-amber'

  return (
    <>
      <Nav />
      <CartSidebar />

      <main className="min-h-screen transition-colors duration-500" style={{ background: bg }}>

        {/* ── Hero header ── */}
        <div className="relative overflow-hidden px-8 md:px-14 pt-36 pb-16"
          style={{ borderBottom: `1px solid ${border5}` }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 60% 50%, rgba(201,162,126,0.3) 0%, transparent 70%)'
            }} />
          </div>
          <div className="relative">
            <span className="font-sans text-[10px] tracking-[.35em] uppercase block mb-4"
              style={{ color: amber, opacity: 0.7 }}>The Collection</span>
            <h1 className="font-serif leading-[1.0] mb-4"
              style={{ fontSize: 'clamp(3rem,7vw,7rem)', color: text90 }}>
              Objects built<br />to last.
            </h1>
            <p className="font-sans text-sm max-w-sm leading-loose" style={{ color: text30 }}>
              Every piece laser-engraved to order. Personalise with names, dates, audio,
              coordinates — commission something permanent.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-14 py-10">

          {/* ── Category filter ── */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`font-sans text-[10px] tracking-[.2em] uppercase px-5 py-2.5 rounded-full border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'border-amber bg-amber text-[#0f1510]'
                    : filterBtn
                }`}
                style={activeCategory === cat.id
                  ? { background: amber, borderColor: amber, color: '#fff' }
                  : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Products grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="group rounded-2xl overflow-hidden transition-colors duration-500"
                style={{ background: card }}>

                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', background: imgBg }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Badges */}
                  {p.bestseller && (
                    <span className="absolute top-3 left-3 font-sans text-[9px] tracking-[.15em] uppercase px-2.5 py-1 rounded-full"
                      style={{ background: amber, color: '#fff' }}>
                      Bestseller
                    </span>
                  )}
                  {p.stock <= 5 && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white/80 font-sans text-[9px] px-2.5 py-1 rounded-full">
                      Only {p.stock} left
                    </span>
                  )}

                  {/* View Details on hover */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/shop/${p.slug}`}
                      className="block w-full text-center bg-white/10 backdrop-blur-sm border border-white/25 text-white font-sans text-[10px] tracking-[.2em] uppercase py-2.5 rounded-lg transition-all duration-300 hover:bg-amber hover:border-amber"
                      style={{ '--tw-text-opacity': 1 }}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <span className="font-sans text-[9px] tracking-[.25em] uppercase"
                    style={{ color: text20 }}>{p.material}</span>
                  <h3 className="font-serif mt-1 mb-1 text-lg" style={{ color: text90 }}>{p.name}</h3>
                  <p className="font-sans text-[11px] leading-loose mb-3 line-clamp-1"
                    style={{ color: text30 }}>{p.tagline}</p>
                  <p className="font-sans text-[9px] mb-4" style={{ color: text20 }}>✓ {p.deliveryDays} days delivery</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <Price gbp={p.price} className="font-serif text-xl" style={{ color: amber }} />
                      {p.originalPrice > p.price && (
                        <Price gbp={p.originalPrice} className="font-sans text-xs line-through ml-2"
                          style={{ color: text20 }} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/shop/${p.slug}`}
                        className="font-sans text-[9px] tracking-widest uppercase transition-colors"
                        style={{ color: text20 }}
                        onMouseEnter={e => e.currentTarget.style.color = amber}
                        onMouseLeave={e => e.currentTarget.style.color = text20}
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`font-sans text-[10px] tracking-[.15em] uppercase px-4 py-2 rounded-lg border transition-all duration-300 ${
                          justAdded === p.id ? 'bg-green-600 border-green-600 text-white' : ''
                        }`}
                        style={justAdded === p.id ? {} : {
                          borderColor: `${amber}60`,
                          color: amber,
                        }}
                        onMouseEnter={e => {
                          if (justAdded !== p.id) {
                            e.currentTarget.style.background = amber
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.borderColor = amber
                          }
                        }}
                        onMouseLeave={e => {
                          if (justAdded !== p.id) {
                            e.currentTarget.style.background = ''
                            e.currentTarget.style.color = amber
                            e.currentTarget.style.borderColor = `${amber}60`
                          }
                        }}
                      >
                        {justAdded === p.id ? '✓ Added' : '+ Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="text-center mt-16 py-16" style={{ borderTop: `1px solid ${border5}` }}>
            <h2 className="font-serif text-2xl mb-4" style={{ color: text60 }}>Can't find what you need?</h2>
            <p className="font-sans text-sm mb-6" style={{ color: text30 }}>Every piece can be fully customised. Talk to us.</p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-3 font-sans text-xs tracking-[.2em] uppercase px-10 py-4 transition-all hover:opacity-90"
              style={{ background: amber, color: '#fff' }}
            >
              Design a custom piece →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
