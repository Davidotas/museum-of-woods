'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import { ideas, ideaCategories, emotions } from '../data/ideas'

const difficulties = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

export default function ExplorePage() {
  const [category, setCategory] = useState('all')
  const [emotion, setEmotion] = useState('all')
  const [showRandom, setShowRandom] = useState(null)

  const filtered = ideas.filter(i =>
    (category === 'all' || i.category === category) &&
    (emotion === 'all' || i.emotion === emotion)
  )

  const randomIdea = () => {
    const pick = ideas[Math.floor(Math.random() * ideas.length)]
    setShowRandom(pick)
  }

  return (
    <>
      <Nav />
      <CartSidebar />

      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>
        {/* Hero */}
        <div className="px-6 md:px-14 py-16 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(201,162,126,0.06) 0%, transparent 70%)' }} />
          <span className="relative block font-sans text-[10px] tracking-[.4em] uppercase mb-6" style={{ color: 'rgba(201,162,126,0.7)' }}>Explore Ideas</span>
          <h1 className="relative font-serif mb-4" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 1.05, color: '#ffffff', fontWeight: 300 }}>
            2,400+ ideas.<br />
            <span style={{ color: '#c9a27e', fontStyle: 'italic' }}>Find yours in seconds.</span>
          </h1>
          <p className="font-sans text-sm max-w-md leading-loose relative mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Filter by occasion, emotion, or budget. Every idea includes the material recommendation, time estimate, and profit potential if you want to sell.
          </p>
          <button
            onClick={randomIdea}
            className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-8 py-3.5 transition-colors duration-300"
            style={{ background: '#c9a27e', color: '#0f1510' }}>
            🎲 Surprise Me — Random Idea
          </button>
        </div>

        <div className="px-6 md:px-14 py-10">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {ideaCategories.map(c => (
              <button key={c.id}
                onClick={() => setCategory(c.id)}
                className="font-sans text-[11px] tracking-[.18em] uppercase px-4 py-2 border transition-all duration-300"
                style={category === c.id
                  ? { background: '#c9a27e', color: '#0f1510', borderColor: '#c9a27e' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.45)', borderColor: 'rgba(255,255,255,0.12)' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-10">
            {emotions.map(e => (
              <button key={e.id}
                onClick={() => setEmotion(e.id)}
                className="font-sans text-[11px] tracking-[.18em] uppercase px-4 py-2 border transition-all duration-300"
                style={emotion === e.id
                  ? { background: 'rgba(201,162,126,0.15)', color: '#c9a27e', borderColor: 'rgba(201,162,126,0.4)' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.08)' }}>
                {e.label}
              </button>
            ))}
          </div>

          <p className="font-sans text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>{filtered.length} ideas found</p>

          {/* Ideas grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(idea => (
              <div key={idea.id} className="group overflow-hidden rounded-xl" style={{ background: '#1a2318', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="overflow-hidden" style={{ aspectRatio: '3/2', background: '#141c12' }}>
                  <img src={idea.image} alt={idea.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-sans text-[9px] tracking-[.15em] uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,126,0.15)', color: '#c9a27e', border: '1px solid rgba(201,162,126,0.3)' }}>{idea.emotion}</span>
                    <span className="font-sans text-[9px] tracking-[.15em] uppercase px-2 py-0.5 rounded" style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>{difficulties[idea.difficulty]}</span>
                    {idea.trending && <span className="font-sans text-[9px] px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,126,0.15)', color: '#c9a27e', border: '1px solid rgba(201,162,126,0.3)' }}>🔥 Trending</span>}
                  </div>
                  <h3 className="font-serif mb-2" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)' }}>{idea.title}</h3>
                  <p className="font-sans text-[11px] leading-loose mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{idea.description}</p>

                  <div className="grid grid-cols-3 gap-3 py-4 mb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div className="font-sans text-[9px] tracking-[.2em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Material</div>
                      <div className="font-sans text-xs capitalize" style={{ color: 'rgba(255,255,255,0.6)' }}>{idea.material}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[9px] tracking-[.2em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Time</div>
                      <div className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{idea.timeToMake}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[9px] tracking-[.2em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Profit</div>
                      <div className="font-sans text-xs" style={{ color: '#c9a27e' }}>{idea.profitPotential}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/studio" className="flex-1 text-center font-sans text-[10px] tracking-[.18em] uppercase py-2.5 transition-all duration-300"
                      style={{ border: '1px solid rgba(201,162,126,0.4)', color: '#c9a27e' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#c9a27e'; e.currentTarget.style.color = '#0f1510' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c9a27e' }}>
                      Create This
                    </Link>
                    <Link href="/business" className="flex-1 text-center font-sans text-[10px] tracking-[.18em] uppercase py-2.5 transition-all duration-300"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>
                      Business Plan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Random idea modal */}
      {showRandom && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setShowRandom(null)} />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl" style={{ background: '#1c2419', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ aspectRatio: '16/7', background: '#141c12', overflow: 'hidden' }}>
              <img src={showRandom.image} alt={showRandom.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-sans text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ background: 'rgba(201,162,126,0.15)', color: '#c9a27e', border: '1px solid rgba(201,162,126,0.3)' }}>{showRandom.emotion}</span>
                <span className="font-sans text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>{showRandom.occasion}</span>
              </div>
              <h2 className="font-serif mb-2" style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.95)' }}>
                {showRandom.title}
              </h2>
              <p className="font-sans text-sm leading-loose mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>{showRandom.description}</p>
              <div className="grid grid-cols-3 gap-4 py-5 mb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {[['Material', showRandom.material], ['Time', showRandom.timeToMake], ['Profit', showRandom.profitPotential]].map(([label, val]) => (
                  <div key={label}>
                    <div className="font-sans text-[9px] tracking-[.2em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</div>
                    <div className="font-sans text-sm capitalize" style={{ color: label === 'Profit' ? '#c9a27e' : 'rgba(255,255,255,0.7)' }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/studio" className="flex-1 text-center font-sans text-xs tracking-widest uppercase py-3.5 transition-colors"
                  style={{ background: '#c9a27e', color: '#0f1510' }}>Create This</Link>
                <button onClick={randomIdea} className="font-sans text-xs tracking-widest uppercase px-6 py-3.5 transition-all"
                  style={{ border: '1px solid rgba(201,162,126,0.4)', color: '#c9a27e' }}>Try Another 🎲</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
