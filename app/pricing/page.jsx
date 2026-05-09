'use client'

import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import { CheckIcon, SparkleIcon } from '../components/Icons'

const plans = [
  {
    id: 'free',
    name: 'Explorer',
    price: 0,
    period: 'forever',
    tagline: 'Start discovering',
    colour: 'border-fog/15',
    accentColour: 'text-fog/70',
    features: [
      'Browse 2,400+ ideas',
      'Basic materials library',
      'Gallery access (public rooms)',
      'Community feed',
      '3 studio previews/month',
      'Learning hub (beginner modules)',
    ],
    locked: ['Business Hub & profit calculator', 'Unlimited studio designs', 'Design template downloads', 'Soundwave converter', 'Priority order queue'],
    cta: 'Get started free',
    href: '/explore',
  },
  {
    id: 'pro',
    name: 'Creator',
    price: 12,
    period: 'per month',
    tagline: 'For serious makers',
    colour: 'border-amber/50',
    accentColour: 'text-amber',
    badge: 'Most Popular',
    features: [
      'Everything in Explorer',
      'Unlimited studio designs',
      'Full Business Hub + profit calculator',
      'All design templates (200+)',
      'Soundwave & audio converter',
      'Full learning library (all 3 levels)',
      'Priority order queue',
      'Save & share unlimited designs',
    ],
    locked: ['White-label design exports', 'Bulk order pricing', 'Dedicated account manager'],
    cta: 'Start 14-day free trial',
    href: '/studio',
  },
  {
    id: 'business',
    name: 'Business',
    price: 35,
    period: 'per month',
    tagline: 'For sellers & studios',
    colour: 'border-fog/15',
    accentColour: 'text-fog/70',
    features: [
      'Everything in Creator',
      'White-label design exports',
      'Bulk order pricing (up to 30% off)',
      'Dedicated account manager',
      'Custom branding on all exports',
      'API access for Etsy/Shopify sync',
      'Monthly business strategy call',
      'Early access to new features',
    ],
    locked: [],
    cta: 'Book a demo',
    href: '/community',
  },
]

const faqs = [
  { q: 'Can I order without a subscription?', a: 'Yes — every product in the shop is available to anyone. A subscription unlocks the creation and business tools, not the ability to buy.' },
  { q: 'What happens after my free trial?', a: 'You\'ll be asked to choose a plan. If you don\'t choose, you drop to the free Explorer tier automatically — no charges.' },
  { q: 'Do you offer student or charity discounts?', a: 'Yes. Email us with proof and we\'ll set you up on 50% off Creator for as long as you need it.' },
  { q: 'Can I cancel anytime?', a: 'Completely. No lock-in, no cancellation fees. Cancel from your account settings in under 30 seconds.' },
  { q: 'Is the profit calculator accurate?', a: 'It\'s based on real UK material costs, average labour rates, and platform fees. Use it as a guide — your actual numbers will depend on your setup.' },
]

export default function PricingPage() {
  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>

        {/* Hero */}
        <div className="px-6 md:px-14 py-20 text-center border-b border-fog/8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-DT3SJ-WimzI?auto=format&fit=crop&w=1400&q=40)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <span className="section-label relative">Pricing</span>
          <h1 className="font-serif text-fog/95 mb-4 relative" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 1.08 }}>
            Start free.<br />
            <span className="text-amber italic">Scale when you're ready.</span>
          </h1>
          <p className="font-sans text-sm text-fog/40 max-w-md mx-auto leading-loose relative">
            Browse for free forever. Unlock the studio, business tools, and templates when you're ready to create or sell.
          </p>
        </div>

        {/* Plans */}
        <div className="px-6 md:px-14 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {plans.map(plan => (
              <div key={plan.id}
                className={`border ${plan.colour} relative flex flex-col ${plan.id === 'pro' ? 'bg-amber/3' : ''}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 bg-amber text-forest font-sans text-[10px] tracking-[.2em] uppercase px-4 py-1.5">
                      <SparkleIcon size={11} /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 border-b border-fog/8">
                  <span className={`font-sans text-[10px] tracking-[.3em] uppercase ${plan.accentColour} block mb-3`}>
                    {plan.name}
                  </span>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="font-serif text-fog/95" style={{ fontSize: '3rem', lineHeight: 1 }}>
                      {plan.price === 0 ? 'Free' : `£${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="font-sans text-sm text-fog/35 mb-2">{plan.period}</span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-fog/35">{plan.tagline}</p>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-3">
                        <CheckIcon size={14} className="text-amber shrink-0 mt-0.5" />
                        <span className="font-sans text-xs text-fog/65 leading-relaxed">{f}</span>
                      </li>
                    ))}
                    {plan.locked.map(f => (
                      <li key={f} className="flex items-start gap-3 opacity-35">
                        <CloseIconSmall />
                        <span className="font-sans text-xs text-fog/40 leading-relaxed line-through">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}
                    className={`w-full text-center py-3.5 font-sans text-[11px] tracking-[.2em] uppercase transition-all duration-400 ${
                      plan.id === 'pro'
                        ? 'bg-amber text-forest hover:bg-grain'
                        : 'border border-fog/20 text-fog/60 hover:border-amber/40 hover:text-amber'
                    }`}>
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="section-title text-center mb-10">Full comparison</h2>
            <div className="border border-fog/10 overflow-hidden">
              <div className="grid grid-cols-4 bg-bark/30 border-b border-fog/8">
                <div className="p-4 font-sans text-[10px] tracking-[.2em] uppercase text-fog/30">Feature</div>
                {plans.map(p => (
                  <div key={p.id} className={`p-4 text-center font-sans text-[11px] tracking-[.2em] uppercase ${p.accentColour}`}>
                    {p.name}
                  </div>
                ))}
              </div>
              {[
                ['Browse ideas',          true,  true,  true],
                ['Materials library',     true,  true,  true],
                ['Gallery access',        true,  true,  true],
                ['Studio designs',        '3/mo','∞',   '∞'],
                ['Business hub',          false, true,  true],
                ['Profit calculator',     false, true,  true],
                ['Design templates',      false, true,  true],
                ['Soundwave converter',   false, true,  true],
                ['Learning library',      'Basic','Full','Full'],
                ['White-label exports',   false, false, true],
                ['Bulk order pricing',    false, false, true],
                ['Account manager',       false, false, true],
              ].map(([feature, ...vals]) => (
                <div key={feature} className="grid grid-cols-4 border-b border-fog/6 hover:bg-fog/2 transition-colors">
                  <div className="p-4 font-sans text-xs text-fog/50">{feature}</div>
                  {vals.map((v, i) => (
                    <div key={i} className="p-4 text-center">
                      {v === true  ? <CheckIcon size={14} className="text-amber mx-auto" /> :
                       v === false ? <span className="text-fog/15 text-xs">—</span> :
                       <span className="font-sans text-xs text-fog/50">{v}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title text-center mb-10">Questions</h2>
            <div className="space-y-0 divide-y divide-fog/8">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group py-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-serif text-fog/80" style={{ fontSize: '1.05rem' }}>{q}</span>
                    <span className="text-amber/50 group-open:rotate-45 transition-transform duration-300 text-xl ml-4 shrink-0">+</span>
                  </summary>
                  <p className="font-sans text-sm text-fog/45 leading-loose mt-4 pr-8">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function CloseIconSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" className="shrink-0 mt-0.5 text-fog/25">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
