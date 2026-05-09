'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis, destroyLenis } from './lib/scroll'
import Nav from './components/Nav'
import CartSidebar from './components/CartSidebar'
import { products } from './data/products'
import { useCartStore } from './store/cart'
import { StarIcon } from './components/Icons'

gsap.registerPlugin(ScrollTrigger)

const Scene = dynamic(() => import('./components/Scene'), { ssr: false })
const Cursor = dynamic(() => import('./components/Cursor'), { ssr: false })

const V1 = 'https://videos.pexels.com/video-files/5895456/5895456-hd_1280_720_30fps.mp4'
const V2 = 'https://videos.pexels.com/video-files/6262756/6262756-hd_1280_720_25fps.mp4'
const P = (f) => `/images/${f}`

const featuredProducts = products.filter(p => p.bestseller).slice(0, 6)
const allProducts = products.slice(0, 16)

const TESTIMONIALS = [
  { name: 'Amara K.',  city: 'Manchester', stars: 5, product: 'Signal Slice',    text: 'I uploaded my late dad\'s voicemail. His voice, waved into walnut. I\'ve had it on my wall 8 months.' },
  { name: 'James F.',  city: 'London',     stars: 5, product: 'Archive Board',   text: 'Coordinates of where we met, got married, kids were born — on one board. She cried. I almost did.' },
  { name: 'Priya R.',  city: 'Leicester',  stars: 5, product: 'Culture Piece',   text: 'A Quranic verse for our masjid opening. The iroko and calligraphy quality was extraordinary.' },
  { name: 'Sarah M.',  city: 'Birmingham', stars: 5, product: 'Founder Plaque',  text: 'I\'ve ordered 6 custom pieces for client gifts this year. Museum of Woods is the only one I recommend.' },
  { name: 'Tom H.',    city: 'Bristol',    stars: 5, product: 'Memory Frame',    text: 'My nan on birch, displayed at her funeral. 40 people asked where I got it.' },
  { name: 'Marcus L.', city: 'London',    stars: 5, product: 'Pocket Totem',    text: 'Ordered 50 pocket totems for my gym — "DO THE WORK" + logo. Best retention tool in 6 years.' },
]

const MARQUEE = [
  '✦ Soundwave Art', '✦ Wedding Signs', '✦ Memorial Portraits', '✦ Founder Plaques',
  '✦ Pocket Totems', '✦ Baby Name Boards', '✦ Pub Signage', '✦ Calligraphy Panels',
  '✦ Coordinate Maps', '✦ Business Branding', '✦ Anniversary Boards', '✦ Faith Art',
]

const OCCASIONS = [
  { label:'Anniversary', emoji:'❤️', img: P('photoroom_000_20251125_183809.jpeg'), href:'/shop?occasion=anniversary' },
  { label:'Wedding',     emoji:'💒', img: P('photoroom_003_20251125_173001.jpeg'), href:'/shop?occasion=wedding' },
  { label:'New Baby',    emoji:'👶', img: P('photoroom_006_20251125_173001.jpeg'), href:'/shop?occasion=baby' },
  { label:'Birthday',    emoji:'🎂', img: P('photoroom_004_20251125_183809.jpeg'), href:'/shop?occasion=birthday' },
  { label:'Memorial',    emoji:'🕊️', img: P('photoroom_003_20251125_180453.jpeg'), href:'/shop?occasion=memorial' },
  { label:'Business',    emoji:'💼', img: P('photoroom_006_20251125_180453.jpeg'), href:'/shop?occasion=business' },
  { label:'Faith',       emoji:'🙏', img: P('photoroom_000_20251125_173001.jpeg'), href:'/shop?occasion=faith' },
  { label:'Graduation',  emoji:'🎓', img: P('photoroom_009_20251125_180453.jpeg'), href:'/shop?occasion=graduation' },
]

const PROCESS = [
  { n:'01', title:'Choose or design',  img: P('photoroom_005_20251125_183809.jpeg'), desc:'Browse 2,400+ ideas or upload your own text, photo, audio, or coordinates.' },
  { n:'02', title:'We select the wood',img: P('photoroom_001_20251125_173001.jpeg'), desc:'Every species behaves differently. We pick the right grain, density and finish.' },
  { n:'03', title:'Laser engraved',    img: P('photoroom_002_20251125_180453.jpeg'), desc:'0.1mm precision. Each line intentional. This isn\'t printing — it\'s carving light.' },
  { n:'04', title:'Finished & shipped',img: P('photoroom_20260502_123855.jpg'),      desc:'Hand-sanded, oiled, packaged in a branded box. 7–28 days delivery.' },
]

const COMMUNITY_IMGS = [
  P('photoroom_001_20251125_153606.jpeg'), P('photoroom_002_20251125_153606.jpeg'),
  P('photoroom_003_20251125_153606.jpeg'), P('photoroom_004_20251125_153606.jpeg'),
  P('photoroom_005_20251125_153606.jpeg'), P('photoroom_006_20251125_153606.jpeg'),
  P('photoroom_007_20251125_153606.jpeg'), P('photoroom_008_20251125_153606.jpeg'),
  P('photoroom_020_20251125_183809.jpeg'), P('photoroom_021_20251125_183809.jpeg'),
  P('photoroom_022_20251125_183809.jpeg'), P('photoroom_009_20251125_153606.jpeg'),
]

// ─── Styles shared ──────────────────────────────────────────────────
const S = {
  amber:     '#c9a27e',
  amberDark: '#b5732a',
  bg:        '#0f1510',
  card:      '#1a2318',
  imgBg:     '#141c12',
  white95:   'rgba(255,255,255,0.95)',
  white80:   'rgba(255,255,255,0.80)',
  white50:   'rgba(255,255,255,0.50)',
  white30:   'rgba(255,255,255,0.30)',
  white12:   'rgba(255,255,255,0.12)',
  white06:   'rgba(255,255,255,0.06)',
}

export default function Home() {
  const heroRef = useRef(null)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    const lenis = initLenis()

    // Hero text entrance
    const heroEls = heroRef.current?.querySelectorAll('.hero-anim')
    if (heroEls?.length) {
      gsap.set(heroEls, { y: 60, opacity: 0 })
      gsap.to(heroEls, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.14, delay: 0.5 })
    }

    // Scroll reveals — IntersectionObserver
    document.body.classList.add('sr-js-ready')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.dataset.delay || 0)
          setTimeout(() => entry.target.classList.add('sr-visible'), delay)
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' })
    document.querySelectorAll('.sr').forEach(el => io.observe(el))

    return () => { io.disconnect(); destroyLenis() }
  }, [])

  return (
    <>
      <Cursor />
      <Scene />
      <Nav />
      <CartSidebar />

      <main style={{ background: S.bg }}>

        {/* ══════════════════════════════════════════════════
            HERO — cinematic full-screen video
        ══════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col justify-end overflow-hidden" style={{ background: '#0d1410' }}>
          <video autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.72)' }}>
            <source src={V1} type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

          <div className="relative z-10 px-8 md:px-16 pb-16 md:pb-24 w-full max-w-screen-xl">
            <div className="hero-anim mb-5">
              <span className="font-sans text-[11px] tracking-[.35em] uppercase" style={{ color: S.amber }}>
                Est. 2024 · London · Laser-Engraved by Hand
              </span>
            </div>
            <h1 className="hero-anim font-serif leading-[0.95] mb-8"
              style={{ fontSize: 'clamp(3.8rem, 10vw, 10rem)', color: '#fff', textShadow: '0 4px 40px rgba(0,0,0,0.4)' }}>
              Where wood<br />
              becomes <em style={{ color: S.amber, fontStyle: 'italic' }}>memory.</em>
            </h1>

            <div className="hero-anim flex flex-wrap items-center gap-4 mb-12">
              <Link href="/shop"
                className="font-sans text-xs tracking-[.22em] uppercase px-9 py-4 transition-all duration-300"
                style={{ background: S.amber, color: '#0f1510' }}>
                Shop the Collection →
              </Link>
              <Link href="/studio"
                className="font-sans text-xs tracking-[.22em] uppercase px-9 py-4 transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}>
                Design a Custom Piece
              </Link>
            </div>

            <div className="hero-anim flex flex-wrap gap-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['500+','Pieces made'],['16','Products'],['7','Wood types'],['£35+','Starting from'],['5★','Avg rating']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-serif text-2xl" style={{ color: S.amber }}>{v}</div>
                  <div className="font-sans text-[10px] tracking-[.2em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-3">
            <div className="w-px h-14" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,162,126,0.7))' }} />
            <span className="font-sans text-[9px] tracking-[.35em] uppercase" style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.3)' }}>Scroll</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            MARQUEE TICKER
        ══════════════════════════════════════════════════ */}
        <div className="relative z-10 py-4 overflow-hidden" style={{ background: '#141c12', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="font-sans text-[11px] tracking-[.28em] uppercase mx-8 shrink-0" style={{ color: S.amber, opacity: 0.65 }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            FEATURED PRODUCTS — editorial bento grid
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 px-6 md:px-14 py-28">
          {/* Section header */}
          <div className="flex items-end justify-between mb-16 sr">
            <div>
              <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-4" style={{ color: S.amber }}>The Collection</span>
              <h2 className="font-serif leading-[1.0]" style={{ fontSize: 'clamp(2.5rem,5.5vw,4.5rem)', color: S.white95 }}>
                Objects built to<br />last generations.
              </h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-2 font-sans text-xs tracking-[.2em] uppercase transition-all duration-300 hover:gap-4" style={{ color: S.amber }}>
              View all 16 →
            </Link>
          </div>

          {/* Bento grid — 2 large + 4 small */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            {/* Large card — col 1-7 */}
            {featuredProducts[0] && (
              <Link href={`/shop/${featuredProducts[0].slug}`} className="md:col-span-7 group relative overflow-hidden sr" style={{ animationDelay: '0ms' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', background: S.imgBg }}>
                  <img src={featuredProducts[0].image} alt={featuredProducts[0].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)' }} />
                  {featuredProducts[0].bestseller && (
                    <span className="absolute top-5 left-5 font-sans text-[9px] tracking-[.2em] uppercase px-3 py-1.5" style={{ background: S.amber, color: '#0f1510' }}>Bestseller</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <p className="font-sans text-[9px] tracking-[.25em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{featuredProducts[0].material}</p>
                      <h3 className="font-serif text-2xl" style={{ color: '#fff' }}>{featuredProducts[0].name}</h3>
                      <p className="font-sans text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{featuredProducts[0].tagline}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl" style={{ color: S.amber }}>£{featuredProducts[0].price}</div>
                      <div className="font-sans text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>from</div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Right column — 2 stacked */}
            <div className="md:col-span-5 grid grid-rows-2 gap-4">
              {featuredProducts.slice(1, 3).map((p, i) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="group relative overflow-hidden sr" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: S.imgBg }}>
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                      <div>
                        <p className="font-sans text-[9px] tracking-widest uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.material}</p>
                        <h3 className="font-serif text-lg" style={{ color: '#fff' }}>{p.name}</h3>
                      </div>
                      <span className="font-serif text-xl" style={{ color: S.amber }}>£{p.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom row — 3 equal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {featuredProducts.slice(3, 6).map((p, i) => (
              <div key={p.id} className="group sr" style={{ animationDelay: `${(i + 3) * 70}ms`, background: S.card, borderRadius: '16px', overflow: 'hidden' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: S.imgBg }}>
                  <img src={p.image} alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  {p.bestseller && (
                    <span className="absolute top-3 left-3 font-sans text-[8px] tracking-[.15em] uppercase px-2.5 py-1" style={{ background: S.amber, color: '#0f1510' }}>Bestseller</span>
                  )}
                  {p.stock <= 5 && (
                    <span className="absolute top-3 right-3 font-sans text-[8px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)' }}>Only {p.stock} left</span>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}>
                    <button onClick={(e) => { e.preventDefault(); addItem(p) }}
                      className="w-full font-sans text-[10px] tracking-[.2em] uppercase py-3 transition-colors duration-200"
                      style={{ background: S.amber, color: '#0f1510' }}>
                      + Add to Cart
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-sans text-[9px] tracking-[.25em] uppercase mb-1" style={{ color: S.white30 }}>{p.material}</p>
                  <h3 className="font-serif text-lg mb-1 group-hover:text-amber transition-colors" style={{ color: S.white95 }}>{p.name}</h3>
                  <p className="font-sans text-[11px] leading-relaxed mb-4 line-clamp-1" style={{ color: S.white30 }}>{p.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl" style={{ color: S.amber }}>£{p.price}</span>
                    <Link href={`/shop/${p.slug}`} className="font-sans text-[9px] tracking-widest uppercase transition-colors hover:text-amber" style={{ color: S.white30 }}>Details →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center sr">
            <Link href="/shop"
              className="inline-flex items-center gap-3 font-sans text-xs tracking-[.25em] uppercase px-12 py-4 transition-all duration-300 hover:gap-6"
              style={{ border: '1px solid rgba(201,162,126,0.4)', color: S.amber }}>
              Browse All 16 Products →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TRUST BAR
        ══════════════════════════════════════════════════ */}
        <div className="relative z-10 py-16 px-6 md:px-14" style={{ background: '#141c12', borderTop: `1px solid ${S.white06}`, borderBottom: `1px solid ${S.white06}` }}>
          <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: '🌳', title: 'FSC Certified Wood', sub: 'Every species sustainably sourced' },
              { icon: '⚡', title: '0.1mm Precision', sub: 'Industrial laser engraving' },
              { icon: '🎁', title: 'Gift-Ready Packaging', sub: 'Branded box included free' },
              { icon: '🔄', title: 'Free Returns', sub: 'Not happy? We fix it' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="font-sans text-sm font-medium mb-1" style={{ color: S.white80 }}>{title}</p>
                  <p className="font-sans text-[11px] leading-relaxed" style={{ color: S.white30 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            VIDEO PROCESS — cinematic overlay
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 sr" style={{ height: '80vh' }}>
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.45)' }}>
            <source src={V2} type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="font-sans text-[10px] tracking-[.5em] uppercase mb-6" style={{ color: S.amber }}>Our Process</span>
            <h2 className="font-serif mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,5.5rem)', color: '#fff', lineHeight: 1.0 }}>
              Precision lasered.<br />
              <em style={{ color: S.amber }}>Hand-finished.</em>
            </h2>
            <p className="font-sans text-sm leading-loose max-w-md mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
              0.1mm resolution. Linseed, beeswax and teak oil finishes. Every piece hand-sanded before it ships.
            </p>
            <Link href="/studio"
              className="font-sans text-xs tracking-[.25em] uppercase px-10 py-4 transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#fff' }}>
              Start Designing →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS — step cards
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 md:px-14" style={{ background: '#141c12' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-20 sr">
              <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-4" style={{ color: S.amber }}>How It Works</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', color: S.white95 }}>From idea to your wall,<br />in 4 steps.</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {PROCESS.map((step, i) => (
                <div key={i} className="group sr" data-delay={i * 90} style={{ background: S.card, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${S.white06}` }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: S.imgBg }}>
                    <img src={step.img} alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                    <div className="absolute top-4 left-4 font-serif" style={{ fontSize: '3rem', color: S.amber, opacity: 0.9, lineHeight: 1 }}>{step.n}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg mb-2" style={{ color: S.white95 }}>{step.title}</h3>
                    <p className="font-sans text-xs leading-relaxed" style={{ color: S.white30 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SHOP BY OCCASION — dramatic grid
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 md:px-14">
          <div className="flex items-end justify-between mb-16 sr">
            <div>
              <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-4" style={{ color: S.amber }}>Shop by Occasion</span>
              <h2 className="font-serif leading-[1.0]" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', color: S.white95 }}>
                What's the moment?
              </h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 font-sans text-xs tracking-[.2em] uppercase transition-all hover:gap-4" style={{ color: S.amber }}>
              All products →
            </Link>
          </div>

          {/* Masonry-style — 4 top, 4 bottom with different heights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {OCCASIONS.slice(0, 4).map((oc, i) => (
              <Link key={oc.label} href={oc.href}
                className="relative overflow-hidden group rounded-2xl sr"
                data-delay={i * 60}
                style={{ aspectRatio: i % 2 === 0 ? '3/4' : '3/5', background: S.imgBg }}>
                <img src={oc.img} alt={oc.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="block text-lg mb-1">{oc.emoji}</span>
                  <span className="font-serif text-xl block mb-1 group-hover:text-amber transition-colors" style={{ color: '#fff' }}>{oc.label}</span>
                  <span className="font-sans text-[9px] tracking-[.2em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Shop now →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {OCCASIONS.slice(4, 8).map((oc, i) => (
              <Link key={oc.label} href={oc.href}
                className="relative overflow-hidden group rounded-2xl sr"
                data-delay={(i + 4) * 60}
                style={{ aspectRatio: i % 2 === 0 ? '3/5' : '3/4', background: S.imgBg }}>
                <img src={oc.img} alt={oc.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="block text-lg mb-1">{oc.emoji}</span>
                  <span className="font-serif text-xl block mb-1 group-hover:text-amber transition-colors" style={{ color: '#fff' }}>{oc.label}</span>
                  <span className="font-sans text-[9px] tracking-[.2em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Shop now →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            BUSINESS HUB SPLIT
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 grid lg:grid-cols-2 overflow-hidden" style={{ minHeight: '65vh' }}>
          <div className="relative overflow-hidden order-2 lg:order-1" style={{ minHeight: '50vh' }}>
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.55)' }}>
              <source src={V1} type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, rgba(15,21,16,0.9))' }} />
          </div>
          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 py-20 sr" style={{ background: '#141c12' }}>
            <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-5" style={{ color: S.amber }}>For Creators & Businesses</span>
            <h2 className="font-serif leading-[1.05] mb-6" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: S.white95 }}>
              Turn a £15 piece<br />of wood into a<br />
              <em style={{ color: S.amber }}>£90 product.</em>
            </h2>
            <p className="font-sans text-sm leading-loose mb-10 max-w-sm" style={{ color: S.white50 }}>
              Our Business Hub shows exactly what to make, who to sell to, and how to price it. Real numbers from real makers.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-10 pb-10" style={{ borderBottom: `1px solid ${S.white06}` }}>
              {[['£500', 'Avg first month'], ['83%', 'Margin on totems'], ['12hrs', 'To first sale']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-serif text-2xl mb-1" style={{ color: S.amber }}>{v}</div>
                  <div className="font-sans text-[9px] uppercase tracking-widest" style={{ color: S.white30 }}>{l}</div>
                </div>
              ))}
            </div>
            <Link href="/business"
              className="inline-flex items-center gap-3 font-sans text-xs tracking-[.25em] uppercase px-8 py-4 w-fit transition-all duration-300"
              style={{ background: S.amber, color: '#0f1510' }}>
              Open Business Hub →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ALL 16 PRODUCTS — clean grid
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 md:px-14">
          <div className="flex items-end justify-between mb-16 sr">
            <div>
              <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-4" style={{ color: S.amber }}>Full Collection</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', color: S.white95 }}>Every product.</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 font-sans text-xs tracking-[.2em] uppercase transition-all hover:gap-4" style={{ color: S.amber }}>
              View shop →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {allProducts.map((p, i) => (
              <Link key={p.id} href={`/shop/${p.slug}`}
                className="group sr"
                data-delay={(i % 4) * 50}>
                <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: '4/5', background: S.imgBg }}>
                  <img src={p.images?.[1] || p.image} alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="block font-sans text-[9px] tracking-[.2em] uppercase mb-1" style={{ color: S.amber }}>View details</span>
                    </div>
                  </div>
                  {p.bestseller && (
                    <span className="absolute top-3 left-3 font-sans text-[8px] tracking-[.15em] uppercase px-2 py-1" style={{ background: S.amber, color: '#0f1510' }}>Best</span>
                  )}
                  {p.stock <= 5 && (
                    <span className="absolute top-3 right-3 font-sans text-[8px] px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.7)' }}>Only {p.stock}</span>
                  )}
                </div>
                <p className="font-sans text-[9px] tracking-[.2em] uppercase mb-1" style={{ color: S.white30 }}>{p.material}</p>
                <h3 className="font-serif text-base mb-1 transition-colors group-hover:text-amber" style={{ color: S.white95 }}>{p.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg" style={{ color: S.amber }}>£{p.price}</span>
                  {p.originalPrice && (
                    <span className="font-sans text-xs line-through" style={{ color: S.white30 }}>£{p.originalPrice}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PHILOSOPHY — full video
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 sr" style={{ height: '60vh' }}>
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}>
            <source src={V2} type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="font-sans text-[10px] tracking-[.5em] uppercase mb-5" style={{ color: S.amber }}>Philosophy</p>
            <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(1.8rem,5vw,4.5rem)', color: '#fff', lineHeight: 1.05 }}>
              Wood is the oldest memory<br />material humanity has.
            </h2>
            <p className="font-sans text-sm leading-loose max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              It holds shape. It holds scent. It holds the marks you leave in it.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TESTIMONIALS — card grid
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 md:px-14" style={{ background: '#141c12' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-end justify-between mb-16 sr">
              <div>
                <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-4" style={{ color: S.amber }}>Customer Stories</span>
                <h2 className="font-serif" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', color: S.white95 }}>What people say.</h2>
              </div>
              <div className="hidden md:flex items-center gap-2 font-serif" style={{ color: S.amber, fontSize: '1.5rem' }}>
                5.0 ★
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className="sr" data-delay={i * 70}
                  style={{ background: S.card, borderRadius: '16px', padding: '2rem', border: `1px solid ${S.white06}` }}>
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <StarIcon key={j} size={13} className="text-amber" filled />
                    ))}
                  </div>
                  <p className="font-serif leading-relaxed italic mb-6" style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.7)' }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center justify-between pt-5" style={{ borderTop: `1px solid ${S.white06}` }}>
                    <div>
                      <p className="font-sans text-sm font-medium" style={{ color: S.white80 }}>{t.name}</p>
                      <p className="font-sans text-[10px]" style={{ color: S.white30 }}>{t.city}</p>
                    </div>
                    <span className="font-sans text-[8px] tracking-widest uppercase px-2.5 py-1 rounded"
                      style={{ color: S.white30, border: `1px solid ${S.white12}` }}>
                      {t.product}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            COMMUNITY WALL
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 md:px-14">
          <div className="flex items-end justify-between mb-16 sr">
            <div>
              <span className="font-sans text-[10px] tracking-[.4em] uppercase block mb-4" style={{ color: S.amber }}>Community</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', color: S.white95 }}>Made by people like you.</h2>
            </div>
            <Link href="/community" className="hidden md:flex items-center gap-2 font-sans text-xs tracking-[.2em] uppercase transition-all hover:gap-4" style={{ color: S.amber }}>See all →</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {COMMUNITY_IMGS.map((img, i) => (
              <Link key={i} href="/community"
                className="relative overflow-hidden group rounded-xl sr"
                data-delay={i * 30}
                style={{ aspectRatio: '1/1', background: S.imgBg }}>
                <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.55)' }}>
                  <span className="font-sans text-[9px] tracking-widest uppercase" style={{ color: '#fff' }}>View</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10 sr">
            <Link href="/community" className="font-sans text-xs tracking-[.25em] uppercase transition-all" style={{ color: S.white30 }}>
              Share your piece on #MuseumOfWoods
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CTA — full-bleed editorial
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={P('photoroom_20260330_104834.jpg')} alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) saturate(0.8)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-24">
            <span className="font-sans text-[10px] tracking-[.5em] uppercase block mb-8" style={{ color: S.amber }}>Commission a Piece</span>
            <h2 className="font-serif mb-8" style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: '#fff', lineHeight: 0.95 }}>
              What do you want<br />
              <em style={{ color: S.amber }}>to remember?</em>
            </h2>
            <p className="font-sans text-sm leading-loose mb-12 max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Each piece is made to last longer than you.<br />Let's make it together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop"
                className="font-sans text-xs tracking-[.25em] uppercase px-12 py-5 transition-all duration-300"
                style={{ background: S.amber, color: '#0f1510' }}>
                Commission a Piece →
              </Link>
              <Link href="/explore"
                className="font-sans text-xs tracking-[.25em] uppercase px-12 py-5 transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }}>
                Explore Ideas
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════ */}
        <footer className="relative z-10 px-8 md:px-14 py-20" style={{ background: '#0a100c', borderTop: `1px solid ${S.white06}` }}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <img src="/images/logo.svg" alt="Museum of Woods" className="h-14 w-auto object-contain mb-5"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              <p className="font-sans text-xs leading-loose mb-4" style={{ color: S.white30 }}>
                Where wood becomes memory.<br />Precision laser-engraved objects<br />crafted in London.
              </p>
              <span className="font-sans text-[10px]" style={{ color: 'rgba(201,162,126,0.5)' }}>🇬🇧 Made in London</span>
            </div>

            {[
              { head: 'Platform', links: [['Explore Ideas', '/explore'], ['Materials', '/materials'], ['Studio', '/studio'], ['Business Hub', '/business'], ['Gallery', '/gallery'], ['Learn', '/learn']] },
              { head: 'Shop',     links: [['All Products', '/shop'], ['Gifts', '/shop?cat=gifts'], ['Business', '/shop?cat=business'], ['Home & Desk', '/shop?cat=home'], ['Art & Culture', '/shop?cat=art'], ['Pricing', '/pricing']] },
              { head: 'Company', links: [['Community', '/community'], ['About', '#'], ['Press', '#'], ['Sustainability', '#'], ['Contact', '#']] },
            ].map(col => (
              <div key={col.head}>
                <p className="font-sans text-[9px] tracking-[.35em] uppercase mb-5" style={{ color: 'rgba(201,162,126,0.5)' }}>{col.head}</p>
                {col.links.map(([l, h]) => (
                  <Link key={l} href={h} className="font-sans text-xs block mb-2.5 transition-colors hover:text-amber" style={{ color: S.white30 }}>{l}</Link>
                ))}
              </div>
            ))}

            <div>
              <p className="font-sans text-[9px] tracking-[.35em] uppercase mb-5" style={{ color: 'rgba(201,162,126,0.5)' }}>Legal</p>
              {['Privacy Policy', 'Terms of Service', 'Returns & Refunds', 'Cookie Policy'].map(l => (
                <span key={l} className="font-sans text-xs block mb-2.5 cursor-pointer transition-colors hover:text-amber" style={{ color: S.white30 }}>{l}</span>
              ))}
              <Link href="/admin" className="font-sans text-[10px] block mt-5 transition-colors" style={{ color: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,162,126,0.35)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.08)'}>
                Admin ↗
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: `1px solid ${S.white06}` }}>
            <span className="font-sans text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>FSC Certified · Sustainable · Carbon Offset Shipping</span>
            <span className="font-sans text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>© 2025 Museum of Woods · All rights reserved.</span>
          </div>
        </footer>

      </main>
    </>
  )
}
