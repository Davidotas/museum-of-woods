'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'

const caseStudies = [
  { name: 'Sarah M.', city: 'Birmingham', product: 'Custom wedding signs', monthly: '£1,240', time: '3 months in', avatar: '👩🏾' },
  { name: 'James K.', city: 'London',     product: 'Restaurant menu boards', monthly: '£2,800', time: '6 months in', avatar: '👨🏻' },
  { name: 'Aisha T.', city: 'Manchester', product: 'Pocket tokens (Etsy)', monthly: '£680',   time: '5 weeks in', avatar: '👩🏽' },
]

const businessIdeas = [
  { title: 'Wedding Signs',        margin: '78%', startup: '£120', demand: 'Very High', icon: '💍' },
  { title: 'Pub Quiz Trophies',    margin: '72%', startup: '£80',  demand: 'High',      icon: '🍺' },
  { title: 'Restaurant Menus',     margin: '80%', startup: '£200', demand: 'High',      icon: '🍽️' },
  { title: 'Pet Memorial Plaques', margin: '83%', startup: '£60',  demand: 'Very High', icon: '🐾' },
  { title: 'Branded Desk Sets',    margin: '71%', startup: '£150', demand: 'Medium',    icon: '💼' },
  { title: 'Etsy Pocket Tokens',   margin: '85%', startup: '£40',  demand: 'High',      icon: '🛒' },
]

export default function BusinessPage() {
  const [matCost,  setMatCost]  = useState(15)
  const [timeMins, setTimeMins] = useState(90)
  const [overhead, setOverhead] = useState(5)
  const [markup,   setMarkup]   = useState(3)

  const hourlyRate = 18
  const laborCost  = (timeMins / 60) * hourlyRate
  const totalCost  = matCost + laborCost + overhead
  const sellPrice  = totalCost * markup
  const profit     = sellPrice - totalCost
  const margin     = ((profit / sellPrice) * 100).toFixed(0)

  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ height: '45vh' }}>
          <img src="https://images.unsplash.com/photo-v13x0qU4afA?auto=format&fit=crop&w=1600&q=80"
            alt="Business" className="w-full h-full object-cover" style={{ filter: 'brightness(0.3) saturate(0.6)' }} />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-14">
            <span className="section-label">Business Hub</span>
            <h1 className="section-title">Turn wood into income.</h1>
            <p className="font-sans text-sm text-fog/40 max-w-lg mt-3 leading-loose">
              Real numbers. Real strategies. Real people earning from wood engraving — and exactly how they did it.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-14 py-16">

          {/* Profit Calculator */}
          <div className="mb-20">
            <span className="section-label">Profit Calculator</span>
            <h2 className="section-title mb-10">Know your numbers before you start.</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-8">
                {[
                  { label: 'Material cost (£)',       val: matCost,  set: setMatCost,  min: 1,  max: 200, step: 1  },
                  { label: 'Time to make (minutes)',  val: timeMins, set: setTimeMins, min: 15, max: 480, step: 15 },
                  { label: 'Overhead / packaging (£)',val: overhead, set: setOverhead, min: 0,  max: 50,  step: 1  },
                  { label: 'Price multiplier',        val: markup,   set: setMarkup,   min: 1.5,max: 8,   step: 0.1},
                ].map(({ label, val, set, min, max, step }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <label className="font-sans text-[11px] tracking-[.2em] uppercase text-fog/45">{label}</label>
                      <span className="font-serif text-amber">{typeof val === 'number' && Number.isInteger(step) ? `${val}` : val.toFixed(1)}{label.includes('£') ? '' : label.includes('min') ? ' min' : '×'}</span>
                    </div>
                    <input type="range" className="w-full" min={min} max={max} step={step}
                      value={val} onChange={e => set(Number(e.target.value))} />
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className="bg-bark/30 border border-fog/8 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-fog/80 text-xl mb-8">Your numbers</h3>
                  <div className="space-y-4">
                    {[
                      { l: 'Material cost',    v: `£${matCost.toFixed(2)}`,           muted: true },
                      { l: 'Labour cost',      v: `£${laborCost.toFixed(2)}`,          muted: true },
                      { l: 'Overhead',         v: `£${overhead.toFixed(2)}`,           muted: true },
                      { l: 'Total cost',       v: `£${totalCost.toFixed(2)}`,          muted: false },
                    ].map(({ l, v, muted }) => (
                      <div key={l} className="flex justify-between border-b border-fog/5 pb-3">
                        <span className={`font-sans text-sm ${muted ? 'text-fog/40' : 'text-fog/70'}`}>{l}</span>
                        <span className={`font-sans text-sm ${muted ? 'text-fog/40' : 'text-fog/80'}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-amber/20 pt-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-sm text-fog/50">Recommended sell price</span>
                    <span className="font-serif text-2xl text-amber">£{sellPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="font-sans text-sm text-fog/50">Profit per piece</span>
                    <span className="font-serif text-xl text-fog/80">£{profit.toFixed(2)}</span>
                  </div>
                  {/* Margin bar */}
                  <div className="mb-2">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-sans text-[10px] tracking-[.2em] uppercase text-fog/30">Profit margin</span>
                      <span className="font-sans text-sm text-amber font-medium">{margin}%</span>
                    </div>
                    <div className="h-1.5 bg-fog/8 rounded-full overflow-hidden">
                      <div className="progress-bar h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(margin, 100)}%` }} />
                    </div>
                  </div>
                  <p className="font-sans text-[10px] text-fog/25 mt-4">
                    Based on £{hourlyRate}/hr labour rate. Adjust the multiplier to match your platform (Etsy: 3–4×, Direct: 2.5–3.5×).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business ideas */}
          <div className="mb-20">
            <span className="section-label">Product Ideas with Margins</span>
            <h2 className="section-title mb-10">What sells and why.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessIdeas.map(b => (
                <div key={b.title} className="card-wood p-6 group hover:border-amber/30 transition-all duration-400">
                  <div className="text-3xl mb-4">{b.icon}</div>
                  <h3 className="font-serif text-fog/90 mb-3" style={{ fontSize: '1.15rem' }}>{b.title}</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <div className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25 mb-1">Margin</div>
                      <div className="font-sans text-sm text-amber">{b.margin}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25 mb-1">Startup</div>
                      <div className="font-sans text-sm text-fog/60">{b.startup}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25 mb-1">Demand</div>
                      <div className="font-sans text-sm text-fog/60">{b.demand}</div>
                    </div>
                  </div>
                  <Link href="/explore" className="font-sans text-[10px] tracking-[.2em] uppercase text-amber/50 group-hover:text-amber transition-colors">
                    See ideas →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Case studies */}
          <div className="mb-20">
            <span className="section-label">Real People, Real Results</span>
            <h2 className="section-title mb-10">It's already working for others.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map(c => (
                <div key={c.name} className="card-wood p-8">
                  <div className="text-4xl mb-4">{c.avatar}</div>
                  <div className="font-serif text-amber text-3xl mb-1">{c.monthly}</div>
                  <div className="font-sans text-[10px] tracking-[.2em] uppercase text-fog/30 mb-4">per month · {c.time}</div>
                  <p className="font-sans text-sm text-fog/60 leading-loose mb-3">
                    Selling: <span className="text-fog/80">{c.product}</span>
                  </p>
                  <p className="font-sans text-xs text-fog/35">{c.name} · {c.city}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sell this idea */}
          <div className="bg-bark/20 border border-fog/8 p-10 md:p-14 text-center">
            <span className="section-label">Your blueprint</span>
            <h2 className="font-serif text-fog/90 mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)' }}>
              Ready to build your wood business?
            </h2>
            <p className="font-sans text-sm text-fog/40 leading-loose mb-10 max-w-md mx-auto">
              We'll give you a personalised product idea, pricing model, target customer, and launch strategy — for free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/studio" className="btn-primary">Design your first product →</Link>
              <Link href="/explore" className="btn-outline">Browse profitable ideas</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
