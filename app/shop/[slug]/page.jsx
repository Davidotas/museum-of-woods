'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { products } from '../../data/products'
import { useCartStore } from '../../store/cart'
import { useThemeStore } from '../../store/theme'
import Nav from '../../components/Nav'

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const product = products.find(p => p.slug === slug || p.id === Number(slug))
  const { addItem } = useCartStore()
  const isDay = useThemeStore(s => s.isDay)
  const [activeImg, setActiveImg] = useState(0)
  const [engravingText, setEngravingText] = useState('')
  const [added, setAdded] = useState(false)
  const heroRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    if (!product) return
    const tl = gsap.timeline()
    tl.fromTo(heroRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' })
    tl.fromTo(infoRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Product not found</p>
          <Link href="/shop" className="text-amber text-sm underline">Back to shop</Link>
        </div>
      </div>
    )
  }

  const handleAdd = () => {
    addItem({ ...product, engravingText })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Nav />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 px-6 md:px-10 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-fog/30 tracking-widest uppercase">
          <Link href="/" className="hover:text-amber transition-colors">Home</Link>
          <span>·</span>
          <Link href="/shop" className="hover:text-amber transition-colors">Shop</Link>
          <span>·</span>
          <span className="text-fog/60">{product.name}</span>
        </div>
      </div>

      {/* Main product layout */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Images */}
          <div ref={heroRef}>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--bg-card)' }}>
              <img
                src={product.images?.[activeImg] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.bestseller && (
                <div className="absolute top-4 left-4 bg-amber text-forest text-xs font-medium px-3 py-1 rounded-full tracking-widest uppercase">
                  Bestseller
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-forest/70 backdrop-blur-sm text-fog/60 text-xs px-3 py-1.5 rounded-full">
                {product.material}
              </div>
            </div>
            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-amber' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div ref={infoRef} className="lg:pt-4">
            {/* Category badge */}
            <span className="text-xs tracking-widest uppercase text-amber/70 mb-3 block">{product.category}</span>

            <h1 className="font-serif text-4xl md:text-5xl text-fog/95 leading-tight mb-2">{product.name}</h1>
            <p className="text-fog/45 text-base mb-6 italic">{product.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-serif text-amber">£{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-fog/30 line-through text-lg">£{product.originalPrice}</span>
              )}
              <span className="text-green-400/80 text-sm">
                Save £{product.originalPrice - product.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-fog/60 leading-relaxed mb-8">{product.description}</p>

            {/* Features */}
            <div className="space-y-2 mb-8">
              {product.features?.map(f => (
                <div key={f} className="flex items-center gap-3 text-fog/70 text-sm">
                  <span className="text-amber">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl mb-8 text-sm" style={{ background: 'var(--bg-secondary)' }}>
              <div>
                <span className="text-fog/30 text-xs uppercase tracking-widest block mb-1">Dimensions</span>
                <span className="text-fog/70">{product.dimensions}</span>
              </div>
              <div>
                <span className="text-fog/30 text-xs uppercase tracking-widest block mb-1">Weight</span>
                <span className="text-fog/70">{product.weight}</span>
              </div>
              <div>
                <span className="text-fog/30 text-xs uppercase tracking-widest block mb-1">Delivery</span>
                <span className="text-fog/70">{product.deliveryDays} days</span>
              </div>
              <div>
                <span className="text-fog/30 text-xs uppercase tracking-widest block mb-1">In Stock</span>
                <span className={product.stock <= 3 ? 'text-red-400' : 'text-green-400'}>{product.stock} units</span>
              </div>
            </div>

            {/* Engraving text */}
            {product.engraving && (
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-fog/40 mb-2 block">
                  Your Engraving Text <span className="text-fog/25">(optional)</span>
                </label>
                <textarea
                  value={engravingText}
                  onChange={e => setEngravingText(e.target.value)}
                  placeholder="Enter names, dates, coordinates, quotes..."
                  rows={3}
                  maxLength={150}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors focus:border-amber/30"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'rgba(var(--cr-fog)/0.12)', color: 'var(--text-muted)' }}
                />
                <p className="text-fog/25 text-xs mt-1">{engravingText.length}/150 characters</p>
              </div>
            )}

            {/* Add to cart */}
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className={`flex-1 py-4 rounded-xl font-sans text-sm tracking-widest uppercase transition-all duration-500 ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-amber text-forest hover:bg-amber/90'
                }`}
              >
                {added ? '✓ Added to Cart' : `Add to Cart — £${product.price}`}
              </button>
              <Link
                href="/checkout"
                className="px-6 py-4 rounded-xl border border-amber/30 text-amber text-sm tracking-widest uppercase hover:bg-amber/10 transition-all duration-300 whitespace-nowrap"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-6 text-xs text-fog/30 tracking-wider uppercase">
              <span>🔒 Secure checkout</span>
              <span>📦 Free UK delivery over £80</span>
              <span>✦ Handcrafted Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-6 md:px-10 py-16 border-t border-fog/5 mt-8">
          <h2 className="font-serif text-2xl text-fog/80 mb-8">You might also love</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3" style={{ background: 'var(--bg-secondary)' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-fog/80 group-hover:text-amber transition-colors">{p.name}</h3>
                <p className="text-amber text-sm mt-1">£{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
