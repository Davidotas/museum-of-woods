'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import { products, categories } from '../data/products'
import { useCartStore } from '../store/cart'

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [justAdded, setJustAdded] = useState(null)
  const addItem = useCartStore(s => s.addItem)

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  const handleAddToCart = (p) => {
    addItem(p)
    setJustAdded(p.id)
    setTimeout(() => setJustAdded(null), 2000)
  }

  return (
    <>
      <Nav />
      <CartSidebar />

      <main className="min-h-screen" style={{ background: '#0f1510' }}>
        {/* Hero header — dark, cinematic */}
        <div className="relative overflow-hidden px-8 md:px-14 pt-36 pb-16 border-b border-white/5">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 60% 50%, rgba(201,162,126,0.3) 0%, transparent 70%)'
            }} />
          </div>
          <div className="relative">
            <span className="font-sans text-[10px] tracking-[.35em] uppercase text-amber/60 block mb-4">The Collection</span>
            <h1 className="font-serif text-white/95 leading-[1.0] mb-4" style={{ fontSize: 'clamp(3rem,7vw,7rem)' }}>
              Objects built<br />to last.
            </h1>
            <p className="font-sans text-sm text-white/35 max-w-sm leading-loose">
              Every piece laser-engraved to order. Personalise with names, dates, audio, coordinates — commission something permanent.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-14 py-10">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`font-sans text-[10px] tracking-[.2em] uppercase px-5 py-2.5 rounded-full border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-amber text-[#0f1510] border-amber'
                    : 'border-white/10 text-white/35 hover:border-amber/40 hover:text-amber'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products grid — no popup, clean cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="group rounded-2xl overflow-hidden" style={{ background: '#1a2318' }}>
                {/* Image — dark background so photos always show */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', background: '#141c12' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-400" />

                  {/* Badges */}
                  {p.bestseller && (
                    <span className="absolute top-3 left-3 bg-amber text-[#0f1510] font-sans text-[9px] tracking-[.15em] uppercase px-2.5 py-1 rounded-full">
                      Bestseller
                    </span>
                  )}
                  {p.stock <= 5 && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white/70 font-sans text-[9px] px-2.5 py-1 rounded-full">
                      Only {p.stock} left
                    </span>
                  )}

                  {/* Quick-view Details button on hover */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/shop/${p.slug}`}
                      className="block w-full text-center bg-white/10 backdrop-blur-sm border border-white/20 text-white font-sans text-[10px] tracking-[.2em] uppercase py-2.5 rounded-lg hover:bg-amber hover:text-[#0f1510] hover:border-amber transition-all duration-300"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <span className="font-sans text-[9px] tracking-[.25em] uppercase text-white/25">{p.material}</span>
                  <h3 className="font-serif text-white/90 mt-1 mb-1 text-lg">{p.name}</h3>
                  <p className="font-sans text-[11px] text-white/30 leading-loose mb-4 line-clamp-1">{p.tagline}</p>
                  <p className="font-sans text-[9px] text-white/20 mb-4">✓ {p.deliveryDays} days delivery</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif text-amber text-xl">£{p.price}</span>
                      <span className="font-sans text-xs text-white/20 line-through ml-2">£{p.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/shop/${p.slug}`}
                        className="font-sans text-[9px] tracking-widest uppercase text-white/30 hover:text-amber transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`font-sans text-[10px] tracking-[.15em] uppercase px-4 py-2 rounded-lg border transition-all duration-300 ${
                          justAdded === p.id
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-amber/35 text-amber hover:bg-amber hover:text-[#0f1510]'
                        }`}
                      >
                        {justAdded === p.id ? '✓ Added' : '+ Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 py-16 border-t border-white/5">
            <h2 className="font-serif text-white/60 text-2xl mb-4">Can't find what you need?</h2>
            <p className="font-sans text-sm text-white/30 mb-6">Every piece can be fully customised. Talk to us.</p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-3 bg-amber text-[#0f1510] font-sans text-xs tracking-[.2em] uppercase px-10 py-4 hover:bg-amber/90 transition-all"
            >
              Design a custom piece →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
