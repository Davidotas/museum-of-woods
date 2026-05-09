'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import { materials } from '../data/materials'

function RatingDots({ value, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={i < value ? 'dot-fill' : 'dot-empty'} />
      ))}
    </div>
  )
}

export default function MaterialsPage() {
  const [selected, setSelected] = useState(null)
  const mat = selected ? materials.find(m => m.id === selected) : null

  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ height: '50vh' }}>
          <img
            src="https://images.unsplash.com/photo-9SHUwEUs_oc?auto=format&fit=crop&w=1600&q=85"
            alt="Wood workshop"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(0.7)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-14">
            <span className="section-label">Materials Library</span>
            <h1 className="section-title">7 woods. Infinite outcomes.</h1>
            <p className="font-sans text-sm text-fog/40 max-w-md mt-3 leading-loose">
              Each wood species has its own personality — grain, smell, weight, engraving character. Choose wisely. It changes everything about the final piece.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 md:px-14 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(m => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id === selected ? null : m.id)}
                className={`card-wood text-left group overflow-hidden transition-all duration-500 ${selected === m.id ? 'ring-1 ring-amber/50' : ''}`}
              >
                <div className="relative overflow-hidden" style={{ height: '220px' }}>
                  <img src={m.image} alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                    <div>
                      <div className="w-5 h-5 rounded-full mb-2 border border-fog/20"
                        style={{ backgroundColor: m.colour }} />
                      <h3 className="font-serif text-fog/95" style={{ fontSize: '1.25rem' }}>{m.name}</h3>
                      <p className="font-sans text-[10px] tracking-[.15em] uppercase text-fog/40">{m.origin}</p>
                    </div>
                    <span className="font-sans text-[10px] tracking-[.15em] uppercase text-amber/60 border border-amber/20 px-2.5 py-1">
                      {m.pricePerUnit}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="font-sans text-[11px] text-fog/40 leading-loose mb-4 line-clamp-2">
                    {m.grain}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: 'Hardness', v: m.hardness },
                      { l: 'Engraving', v: m.engravingQuality },
                      { l: 'Eco', v: m.sustainabilityRating },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <div className="font-sans text-[9px] tracking-[.18em] uppercase text-fog/25 mb-1.5">{l}</div>
                        <RatingDots value={v} />
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {mat && (
          <div className="px-6 md:px-14 pb-20">
            <div className="border border-amber/20 bg-[#1a2318]">
              <div className="relative overflow-hidden" style={{ height: '35vh' }}>
                <img src={mat.heroImage} alt={mat.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.4)' }} />
                <div className="absolute inset-0 flex items-end px-10 pb-10">
                  <div>
                    <h2 className="font-serif text-fog/95 mb-1" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>
                      {mat.name}
                    </h2>
                    <p className="font-sans text-sm text-fog/40 italic">"{mat.quote}"</p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Properties */}
                <div>
                  <h4 className="section-label mb-5">Properties</h4>
                  <div className="space-y-4">
                    {[
                      { l: 'Feel', v: mat.feel },
                      { l: 'Smell', v: mat.smell },
                      { l: 'Grain', v: mat.grain },
                      { l: 'Contrast when engraved', v: mat.contrast },
                      { l: 'Ideal engraving depth', v: mat.engravingDepth },
                      { l: 'Laser speed', v: mat.laserSpeed },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex flex-col gap-0.5">
                        <span className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25">{l}</span>
                        <span className="font-sans text-sm text-fog/65">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best for */}
                <div>
                  <h4 className="section-label mb-5">Best used for</h4>
                  <ul className="space-y-2 mb-8">
                    {mat.bestFor.map(b => (
                      <li key={b} className="flex items-center gap-2 font-sans text-sm text-fog/60">
                        <span className="text-amber">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                  <h4 className="section-label mb-5">Not ideal for</h4>
                  <ul className="space-y-2">
                    {mat.notIdealFor.map(b => (
                      <li key={b} className="flex items-center gap-2 font-sans text-sm text-fog/40">
                        <span className="text-fog/25">✕</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Profit ideas */}
                <div>
                  <h4 className="section-label mb-5">Profit ideas</h4>
                  <div className="space-y-4">
                    {mat.profitIdeas.map((idea, i) => (
                      <div key={i} className="border-l-2 border-amber/30 pl-4">
                        <p className="font-sans text-sm text-fog/60 leading-relaxed">{idea}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-3">
                    <Link href="/studio" className="btn-primary text-center justify-center">
                      Create with {mat.name.split(' ')[0]} →
                    </Link>
                    <Link href="/business" className="btn-outline text-center justify-center">
                      Calculate profit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison note */}
        <div className="px-6 md:px-14 pb-20 text-center">
          <div className="wood-line-h max-w-2xl mx-auto mb-12" />
          <h2 className="font-serif text-fog/80 mb-4" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
            Not sure which wood to choose?
          </h2>
          <p className="font-sans text-sm text-fog/35 mb-8">
            Our studio has a material preview tool. Upload your design and see it on each wood type before ordering.
          </p>
          <Link href="/studio" className="btn-primary">Open the Studio</Link>
        </div>
      </main>
    </>
  )
}
