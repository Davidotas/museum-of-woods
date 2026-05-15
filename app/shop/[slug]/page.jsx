'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useProductStore } from '../../store/products'
import { useCartStore } from '../../store/cart'
import { useThemeStore } from '../../store/theme'
import Nav from '../../components/Nav'

export default function ProductPage() {
  const { slug }    = useParams()
  const isDay       = useThemeStore(s => s.isDay)
  const { addItem } = useCartStore()

  // Pull from the live store (includes DB products) — wait for load
  const products    = useProductStore(s => s.products)
  const loaded      = useProductStore(s => s.loaded)

  const [activeImg,      setActiveImg]      = useState(0)
  const [engravingText,  setEngravingText]  = useState('')
  const [added,          setAdded]          = useState(false)
  const heroRef = useRef(null)
  const infoRef = useRef(null)

  const product = products.find(
    p => p.slug === slug || String(p.id) === String(slug)
  )

  useEffect(() => {
    if (!product) return
    const tl = gsap.timeline()
    tl.fromTo(heroRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' })
    tl.fromTo(infoRef.current, { opacity: 0, x: 40  }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  }, [product])

  // Loading state — wait for DB fetch before declaring "not found"
  if (!loaded && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(201,162,126,0.3)" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a27e" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="font-sans text-sm" style={{ color: 'rgba(245,242,236,0.4)' }}>Loading product…</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="font-serif text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>Product not found</p>
          <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-subtle)' }}>
            This product may have been removed or the link is incorrect.
          </p>
          <Link href="/shop"
            className="font-sans text-xs tracking-[.15em] uppercase px-6 py-3 rounded-xl"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  const handleAdd = () => {
    addItem({ ...product, engravingText })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const images = product.images?.length ? product.images : [product.image].filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Nav />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 px-6 md:px-10 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
          <Link href="/" className="hover:text-amber transition-colors" style={{ color: 'var(--text-subtle)' }}>Home</Link>
          <span>·</span>
          <Link href="/shop" className="hover:text-amber transition-colors" style={{ color: 'var(--text-subtle)' }}>Shop</Link>
          <span>·</span>
          <span style={{ color: 'var(--text-muted)' }}>{product.name}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Images */}
          <div ref={heroRef}>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--bg-card)' }}>
              <img
                src={images[activeImg] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.bestseller && (
                <div className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full tracking-widest uppercase"
                  style={{ background: 'var(--accent)', color: '#fff' }}>
                  Bestseller
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-20 h-20 rounded-xl overflow-hidden transition-all"
                    style={{ border: `2px solid ${activeImg === i ? 'var(--accent)' : 'transparent'}`, opacity: activeImg === i ? 1 : 0.5 }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div ref={infoRef} className="lg:pt-4">
            <span className="font-sans text-xs tracking-widest uppercase block mb-3"
              style={{ color: 'var(--accent)' }}>{product.category}</span>

            <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-2"
              style={{ color: 'var(--text-primary)' }}>{product.name}</h1>
            <p className="text-base mb-6 italic" style={{ color: 'var(--text-subtle)' }}>{product.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-3xl" style={{ color: 'var(--accent)' }}>£{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="line-through text-lg" style={{ color: 'var(--text-subtle)' }}>£{product.originalPrice}</span>
                  <span className="text-sm text-green-500">Save £{product.originalPrice - product.price}</span>
                </>
              )}
            </div>

            <p className="leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>{product.description}</p>

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="space-y-2 mb-8">
                {product.features.filter(Boolean).map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl mb-8 text-sm" style={{ background: 'var(--bg-secondary)' }}>
              {[
                ['Dimensions', product.dimensions],
                ['Weight',     product.weight],
                ['Delivery',   product.deliveryDays ? `${product.deliveryDays} days` : null],
                ['In Stock',   product.stock != null ? `${product.stock} units` : null],
              ].filter(([, v]) => v).map(([label, val]) => (
                <div key={label}>
                  <span className="font-sans text-[10px] uppercase tracking-widest block mb-1" style={{ color: 'var(--text-subtle)' }}>{label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Engraving */}
            {product.engraving && (
              <div className="mb-6">
                <label className="font-sans text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-subtle)' }}>
                  Your Engraving Text <span style={{ color: 'var(--text-subtle)', opacity: 0.5 }}>(optional)</span>
                </label>
                <textarea
                  value={engravingText}
                  onChange={e => setEngravingText(e.target.value)}
                  placeholder="Names, dates, coordinates, quotes…"
                  rows={3} maxLength={150}
                  className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none resize-none transition-colors"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(128,128,128,0.15)', color: 'var(--text-primary)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'rgba(128,128,128,0.15)'}
                />
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>{engravingText.length}/150</p>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={handleAdd}
                className="flex-1 py-4 rounded-xl font-sans text-sm tracking-widest uppercase transition-all duration-500"
                style={{ background: added ? '#16a34a' : 'var(--accent)', color: '#fff' }}>
                {added ? '✓ Added to Cart' : `Add to Cart — £${product.price}`}
              </button>
              <Link href="/checkout"
                className="px-6 py-4 rounded-xl font-sans text-sm tracking-widest uppercase transition-all duration-300 whitespace-nowrap"
                style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}>
                Buy Now
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 font-sans text-xs tracking-wider uppercase" style={{ color: 'var(--text-subtle)' }}>
              <span>🔒 Secure checkout</span>
              <span>📦 Free UK delivery over £80</span>
              <span>✦ Handcrafted worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-6 md:px-10 py-16 mt-8"
          style={{ borderTop: '1px solid rgba(128,128,128,0.1)' }}>
          <h2 className="font-serif text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>You might also love</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3" style={{ background: 'var(--bg-secondary)' }}>
                  <img src={p.image || p.images?.[0]} alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-serif transition-colors group-hover:text-amber" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="font-sans text-sm mt-1" style={{ color: 'var(--accent)' }}>£{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
