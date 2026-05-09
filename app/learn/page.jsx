'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'

const lessons = [
  {
    level: 'Beginner', emoji: '🌱',
    modules: [
      { title: 'What is laser engraving?', duration: '4 min', image: 'https://images.unsplash.com/photo-DT3SJ-WimzI?auto=format&fit=crop&w=600&q=80' },
      { title: 'How to choose your first wood', duration: '6 min', image: 'https://images.unsplash.com/photo-9SHUwEUs_oc?auto=format&fit=crop&w=600&q=80' },
      { title: 'Preparing your design file', duration: '8 min', image: 'https://images.unsplash.com/photo-v13x0qU4afA?auto=format&fit=crop&w=600&q=80' },
      { title: 'Your first engraving: step-by-step', duration: '10 min', image: 'https://images.unsplash.com/photo-kVY2YCV5fyE?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    level: 'Intermediate', emoji: '🌿',
    modules: [
      { title: 'Design principles for engraving', duration: '9 min', image: 'https://images.unsplash.com/photo-o54RjF-C7xo?auto=format&fit=crop&w=600&q=80' },
      { title: 'Typography on wood: spacing & contrast', duration: '7 min', image: 'https://images.unsplash.com/photo-RnyzvOyxl2s?auto=format&fit=crop&w=600&q=80' },
      { title: 'Working with photos: halftone techniques', duration: '12 min', image: 'https://images.unsplash.com/photo-3cIvvzjE6Lk?auto=format&fit=crop&w=600&q=80' },
      { title: 'Finishing: oils, waxes & sanding', duration: '8 min', image: 'https://images.unsplash.com/photo-t5YUoHW6zRo?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    level: 'Advanced', emoji: '🌳',
    modules: [
      { title: 'Deep engraving: multi-pass techniques', duration: '11 min', image: 'https://images.unsplash.com/photo-1fDq8DMtxJg?auto=format&fit=crop&w=600&q=80' },
      { title: 'Working with difficult woods (iroko, teak)', duration: '9 min', image: 'https://images.unsplash.com/photo-0CCVIuAjORE?auto=format&fit=crop&w=600&q=80' },
      { title: 'Creating cultural & calligraphic designs', duration: '14 min', image: 'https://images.unsplash.com/photo-U01ptiZV3Uo?auto=format&fit=crop&w=600&q=80' },
      { title: 'Scaling to a business: systems & pricing', duration: '15 min', image: 'https://images.unsplash.com/photo-IQbC4VU4YPQ?auto=format&fit=crop&w=600&q=80' },
    ],
  },
]

const mistakes = [
  { mistake: 'Using the wrong DPI for your image', fix: 'Always export at 600+ DPI for engraving. 72 DPI (screen resolution) produces muddy, pixelated results.' },
  { mistake: 'Engraving wet or oily wood', fix: 'Always let wood acclimatise and dry for 48hrs. Oils and moisture cause smoke residue and uneven burn depth.' },
  { mistake: 'Skipping a test piece', fix: 'Every wood species behaves differently. Always run a 5×5cm test at your planned settings before the full piece.' },
  { mistake: 'Going too deep on first pass', fix: 'Start shallow (0.2mm) and add depth gradually. You can always engrave deeper; you can never undo it.' },
  { mistake: 'Ignoring grain direction', fix: 'Engraving against the grain produces rougher edges. Map your text orientation to work with the wood\'s natural direction.' },
]

export default function LearnPage() {
  const [activeLevel, setActiveLevel] = useState(0)

  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ height: '42vh' }}>
          <img src="https://images.unsplash.com/photo-ngLt4Y1vI_Q?auto=format&fit=crop&w=1600&q=80"
            alt="Learning" className="w-full h-full object-cover" style={{ filter: 'brightness(0.28) saturate(0.6)' }} />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-12">
            <span className="section-label">Learning Hub</span>
            <h1 className="section-title">From curious to capable.</h1>
            <p className="font-sans text-sm text-fog/40 max-w-lg mt-3 leading-loose">
              Short guides, practical videos, and no jargon. Whether you're picking up your first piece of wood or building a business — we've got the lesson.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-14 py-16">

          {/* Level selector */}
          <div className="flex gap-3 flex-wrap mb-12">
            {lessons.map((l, i) => (
              <button key={l.level} onClick={() => setActiveLevel(i)}
                className={`flex items-center gap-2 px-6 py-3 font-sans text-[11px] tracking-[.2em] uppercase border transition-all duration-300 ${
                  activeLevel === i ? 'border-amber bg-amber text-forest' : 'border-fog/15 text-fog/45 hover:border-fog/40'
                }`}>
                {l.emoji} {l.level}
              </button>
            ))}
          </div>

          {/* Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {lessons[activeLevel].modules.map((mod, i) => (
              <div key={mod.title} className="card-wood group overflow-hidden">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img src={mod.image} alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-forest/50 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-fog/60 flex items-center justify-center text-fog/80 text-xl group-hover:border-amber group-hover:text-amber transition-colors duration-400">
                      ▶
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 font-sans text-[10px] bg-forest/80 px-2 py-0.5 text-fog/60">
                    {mod.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25 mb-2 block">
                    Module {i + 1}
                  </span>
                  <h4 className="font-serif text-fog/85" style={{ fontSize: '1rem' }}>{mod.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Journey path */}
          <div className="mb-20">
            <span className="section-label">Your Learning Journey</span>
            <h2 className="section-title mb-12">Beginner → Creator → Seller</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-fog/8" />
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Make your first piece', desc: 'A simple name plate or small sign. Learn the tools, the feel of the wood, the settings.', time: 'Week 1' },
                  { step: '02', title: 'Personalise for someone', desc: 'Gift your next piece. Engrave for a real person. Feel the reaction. That\'s your product-market fit signal.', time: 'Week 2–3' },
                  { step: '03', title: 'List it for sale', desc: 'Etsy, Depop, your own Instagram shop. One listing. See if anyone buys. Many do on their first try.', time: 'Week 4' },
                  { step: '04', title: 'Build a product range', desc: '3–5 consistent products. Same material, clear aesthetic. People buy a brand, not a random item.', time: 'Month 2' },
                  { step: '05', title: 'Scale with systems', desc: 'Templates, bulk material orders, repeat customer flows. This is where £500/month becomes £2,000.', time: 'Month 3+' },
                ].map(({ step, title, desc, time }) => (
                  <div key={step} className="relative pl-14">
                    <div className="absolute left-0 w-12 h-12 flex items-center justify-center border border-amber/30 bg-forest">
                      <span className="font-sans text-[10px] tracking-[.15em] text-amber/70">{step}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-fog/90 mb-1" style={{ fontSize: '1.15rem' }}>{title}</h4>
                        <p className="font-sans text-sm text-fog/40 leading-loose max-w-lg">{desc}</p>
                      </div>
                      <span className="font-sans text-[10px] tracking-[.15em] uppercase text-fog/25 shrink-0 ml-6">{time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Common mistakes */}
          <div>
            <span className="section-label">Common Mistakes</span>
            <h2 className="section-title mb-10">Learn from others' errors.</h2>
            <div className="space-y-4">
              {mistakes.map(({ mistake, fix }) => (
                <div key={mistake} className="card-wood p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <span className="text-fog/20 text-xl shrink-0">✕</span>
                    <div>
                      <p className="font-sans text-[10px] tracking-[.2em] uppercase text-fog/25 mb-1">Mistake</p>
                      <p className="font-sans text-sm text-fog/60">{mistake}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber/60 text-xl shrink-0">✓</span>
                    <div>
                      <p className="font-sans text-[10px] tracking-[.2em] uppercase text-fog/25 mb-1">The fix</p>
                      <p className="font-sans text-sm text-fog/60">{fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
