'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { useCartStore } from '../store/cart'
import { useThemeStore } from '../store/theme'
import { CartIcon } from './Icons'
import ThemeToggle from './ThemeToggle'

// Nav structure with dropdowns
const NAV = [
  {
    label: 'Shop',
    href: '/shop',
    dropdown: [
      { href: '/shop', label: 'All Products', desc: '16 bespoke pieces' },
      { href: '/shop?cat=gifts', label: 'Gifts', desc: 'For every occasion' },
      { href: '/shop?cat=home', label: 'Home & Desk', desc: 'Everyday objects' },
      { href: '/shop?cat=business', label: 'Business', desc: 'Plaques & branding' },
      { href: '/shop?cat=art', label: 'Art & Culture', desc: 'Heritage pieces' },
      { href: '/checkout', label: 'Checkout →', desc: 'Complete your order' },
    ],
  },
  {
    label: 'Customise',
    href: '/studio',
    dropdown: [
      { href: '/studio', label: 'Design Studio', desc: 'Build your piece step by step' },
      { href: '/studio', label: 'Wall Art', desc: 'Custom engraved signs' },
      { href: '/studio', label: 'Soundwave Art', desc: 'Turn audio into wood' },
      { href: '/studio', label: 'Map & Coordinates', desc: 'Your special place' },
      { href: '/studio', label: 'Portrait Engraving', desc: 'Faces carved in wood' },
      { href: '/pricing', label: 'Pricing', desc: 'Plans for every maker' },
    ],
  },
  {
    label: 'Explore',
    href: '/explore',
    dropdown: [
      { href: '/explore', label: 'Ideas Library', desc: '2,400+ project ideas' },
      { href: '/gallery', label: 'Gallery', desc: 'See finished pieces' },
      { href: '/materials', label: 'Materials', desc: '7 wood species' },
      { href: '/community', label: 'Community', desc: 'Made by makers' },
    ],
  },
  {
    label: 'About',
    href: '/business',
    dropdown: [
      { href: '/business', label: 'Business Hub', desc: 'Turn wood into income' },
      { href: '/learn', label: 'Learn', desc: 'Guides & tutorials' },
    ],
  },
]

export default function Nav() {
  const navRef    = useRef(null)
  const pathname  = usePathname()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeDD, setActiveDD]     = useState(null) // which dropdown is open
  const { count, toggleCart }       = useCartStore()
  const ddTimer = useRef(null)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.3 }
    )
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openDD  = (label) => { clearTimeout(ddTimer.current); setActiveDD(label) }
  const closeDD = () => { ddTimer.current = setTimeout(() => setActiveDD(null), 120) }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          height: 'var(--nav-h)',
          background: scrolled ? 'rgba(13,20,16,0.96)' : 'rgba(13,20,16,0.55)',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-full flex items-center justify-between">

          {/* Logo — always white */}
          <Link href="/" className="shrink-0 z-10 flex items-center" aria-label="Museum of Woods">
            <img
              src="/images/logo.svg"
              alt="Museum of Woods"
              className="h-16 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
            />
          </Link>

          {/* Desktop nav — always white text */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map(item => (
              <div key={item.label} className="relative"
                onMouseEnter={() => openDD(item.label)}
                onMouseLeave={closeDD}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 font-sans text-[11px] tracking-[.18em] uppercase px-4 py-2 rounded-lg transition-all duration-300"
                  style={{ color: pathname.startsWith(item.href) ? '#c9a27e' : 'rgba(255,255,255,0.75)' }}
                  onMouseEnter={e => { if (!pathname.startsWith(item.href)) e.currentTarget.style.color = '#ffffff'; openDD(item.label) }}
                  onMouseLeave={e => { if (!pathname.startsWith(item.href)) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; closeDD() }}
                >
                  {item.label}
                  {item.dropdown && (
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={`transition-transform duration-200 ${activeDD === item.label ? 'rotate-180' : ''}`}>
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </Link>

                {/* Dropdown panel — always dark */}
                {item.dropdown && activeDD === item.label && (
                  <div
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden"
                    style={{ background: 'rgba(13,20,16,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={() => openDD(item.label)}
                    onMouseLeave={closeDD}
                  >
                    {item.dropdown.map(sub => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="flex flex-col px-4 py-3 transition-colors duration-200 group"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <span className="font-sans text-[11px] tracking-[.12em] transition-colors"
                          style={{ color: 'rgba(255,255,255,0.80)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#c9a27e'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.80)'}
                        >{sub.label}</span>
                        <span className="font-sans text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>{sub.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Sign in */}
            <Link
              href="/auth/signin"
              className="hidden md:inline-flex items-center font-sans text-[10px] tracking-[.15em] uppercase transition-colors duration-300"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              Sign in
            </Link>

            {/* Cart — white icon */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 transition-colors duration-300 p-1"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a27e'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              aria-label="Open cart"
            >
              <CartIcon size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber text-[#0d1410] text-[9px] flex items-center justify-center font-medium leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* CTA button — amber outline, always visible */}
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 font-sans text-[10px] tracking-[.18em] uppercase px-5 py-2 transition-all duration-300"
              style={{ border: '1px solid rgba(201,162,126,0.5)', color: '#c9a27e' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c9a27e'; e.currentTarget.style.color = '#0d1410' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c9a27e' }}
            >
              Commission
            </Link>

            {/* Hamburger — white lines */}
            <button
              className="lg:hidden flex flex-col gap-[5px] p-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`block h-px w-6 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} style={{ background: 'rgba(255,255,255,0.7)' }} />
              <span className={`block h-px w-6 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} style={{ background: 'rgba(255,255,255,0.7)' }} />
              <span className={`block h-px w-6 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} style={{ background: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu — always dark with white text */}
      <div className={`fixed inset-0 z-40 flex flex-col justify-center px-10 transition-all duration-500 lg:hidden ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} style={{ background: 'rgba(10,16,12,0.98)', backdropFilter: 'blur(20px)' }}>
        <div className="flex flex-col gap-2">
          {NAV.map(item => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl transition-colors duration-300 block py-2"
                style={{ color: 'rgba(255,255,255,0.85)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a27e'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
              >
                {item.label}
              </Link>
              {item.dropdown && (
                <div className="pl-4 flex flex-col gap-1 mb-2">
                  {item.dropdown.map(sub => (
                    <Link key={sub.href} href={sub.href} onClick={() => setMenuOpen(false)}
                      className="font-sans text-xs transition-colors"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,162,126,0.8)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3">
          <Link href="/shop" onClick={() => setMenuOpen(false)}
            className="font-sans text-xs tracking-[.2em] uppercase px-6 py-4 text-center"
            style={{ background: '#c9a27e', color: '#0d1410' }}>
            Commission a piece
          </Link>
          <Link href="/checkout" onClick={() => setMenuOpen(false)}
            className="font-sans text-xs tracking-[.2em] uppercase px-6 py-4 text-center"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
            View cart ({count})
          </Link>
        </div>
      </div>
    </>
  )
}
