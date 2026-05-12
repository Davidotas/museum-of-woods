'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { products as initialProducts } from '../data/products'

const PASS = 'museum2024'
const MAX_IMAGES = 15

const MOCK_ORDERS = [
  { id: 'MOW-1042', customer: 'Emma Clarke',    product: 'Archive Board',  total: 89,  status: 'production', date: '2025-01-05' },
  { id: 'MOW-1041', customer: 'James Osei',     product: 'Signal Slice',   total: 64,  status: 'shipped',    date: '2025-01-04' },
  { id: 'MOW-1040', customer: 'Adaeze Nwosu',   product: 'Custom Wall Art',total: 135, status: 'proof',      date: '2025-01-04' },
  { id: 'MOW-1039', customer: 'Tom Walsh',      product: 'Heirloom Box',   total: 145, status: 'delivered',  date: '2025-01-03' },
  { id: 'MOW-1038', customer: 'Yemi Adeyemi',   product: 'Ritual Set',     total: 110, status: 'pending',    date: '2025-01-03' },
  { id: 'MOW-1037', customer: 'Sarah Mitchell', product: 'Archive Board',  total: 89,  status: 'delivered',  date: '2025-01-02' },
  { id: 'MOW-1036', customer: 'Kwame Asante',   product: 'Signal Slice',   total: 64,  status: 'production', date: '2025-01-01' },
]

const MOCK_CUSTOMERS = [
  { name: 'Emma Clarke',    email: 'emma@example.com',   orders: 3, spent: 278,  country: '🇬🇧' },
  { name: 'James Osei',    email: 'james@example.com',   orders: 1, spent: 64,   country: '🇬🇧' },
  { name: 'Adaeze Nwosu',  email: 'adaeze@example.com',  orders: 2, spent: 224,  country: '🇳🇬' },
  { name: 'Tom Walsh',     email: 'tom@example.com',     orders: 1, spent: 145,  country: '🇮🇪' },
  { name: 'Yemi Adeyemi',  email: 'yemi@example.com',    orders: 4, spent: 432,  country: '🇳🇬' },
  { name: 'Sarah Mitchell',email: 'sarah@example.com',   orders: 2, spent: 178,  country: '🇺🇸' },
  { name: 'Kwame Asante',  email: 'kwame@example.com',   orders: 2, spent: 199,  country: '🇬🇭' },
]

const STATUS_COLOURS = {
  pending:    { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b',  dot: '#f59e0b'  },
  proof:      { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6',  dot: '#8b5cf6'  },
  production: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6',  dot: '#3b82f6'  },
  shipped:    { bg: 'rgba(16,185,129,0.12)', text: '#10b981',  dot: '#10b981'  },
  delivered:  { bg: 'rgba(107,114,128,0.12)',text: '#6b7280',  dot: '#6b7280'  },
}

function StatusBadge({ status }) {
  const c = STATUS_COLOURS[status] || STATUS_COLOURS.pending
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-[10px] tracking-[.1em] uppercase font-medium"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

/* ── Product Form (add/edit) with 15-image support ─────────── */
function ProductForm({ product, onSave, onCancel }) {
  const isNew = !product?.id
  const [form, setForm] = useState(product ? { ...product } : {
    name: '', slug: '', tagline: '', price: '', originalPrice: '',
    category: 'gifts', material: 'English White Oak', materialCode: 'oak',
    description: '', stock: '', deliveryDays: '14-21',
    difficulty: 'signature', engraving: true, bestseller: false,
    images: [], features: [''], dimensions: '', weight: '',
    occasion: [], emotion: 'love',
  })
  const [imgPreviews, setImgPreviews] = useState(form.images || [])
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFiles = useCallback((files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    const remaining = MAX_IMAGES - imgPreviews.length
    const toAdd = valid.slice(0, remaining)
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImgPreviews(prev => [...prev, e.target.result])
        setForm(f => ({ ...f, images: [...(f.images || []), e.target.result] }))
      }
      reader.readAsDataURL(file)
    })
  }, [imgPreviews.length])

  const removeImg = (i) => {
    setImgPreviews(prev => prev.filter((_, idx) => idx !== i))
    setForm(f => ({ ...f, images: (f.images || []).filter((_, idx) => idx !== i) }))
  }

  const reorderImg = (from, to) => {
    const arr = [...imgPreviews]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setImgPreviews(arr)
    setForm(f => { const imgs = [...(f.images || [])]; const [it] = imgs.splice(from, 1); imgs.splice(to, 0, it); return { ...f, images: imgs } })
  }

  const addFeature = () => setForm(f => ({ ...f, features: [...(f.features || []), ''] }))
  const setFeature = (i, v) => setForm(f => { const arr = [...(f.features || [])]; arr[i] = v; return { ...f, features: arr } })
  const removeFeature = (i) => setForm(f => ({ ...f, features: (f.features || []).filter((_, idx) => idx !== i) }))

  const CATEGORIES = ['gifts', 'home', 'business', 'art', 'custom']
  const DIFFICULTIES = ['signature', 'premium', 'heritage']
  const EMOTIONS = ['love', 'memory', 'achievement', 'gratitude', 'identity']
  const WOODS = ['oak', 'walnut', 'maple', 'cherry', 'ash', 'birch', 'ebony', 'teak', 'bamboo']

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="min-h-full flex items-start justify-center p-6">
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#0f1510', border: '1px solid rgba(245,242,236,0.08)', marginTop: '80px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6"
            style={{ borderBottom: '1px solid rgba(245,242,236,0.06)', background: 'rgba(0,0,0,0.2)' }}>
            <div>
              <p className="font-sans text-[10px] tracking-[.3em] uppercase" style={{ color: 'rgba(201,162,126,0.7)' }}>
                {isNew ? 'New product' : 'Edit product'}
              </p>
              <h2 className="font-serif text-2xl mt-0.5" style={{ color: '#f5f2ec' }}>
                {isNew ? 'Add a piece' : form.name}
              </h2>
            </div>
            <button onClick={onCancel} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,242,236,0.6)" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="px-8 py-6 space-y-8">

            {/* ── Images (up to 15) ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans text-xs tracking-[.2em] uppercase" style={{ color: 'rgba(201,162,126,0.8)' }}>
                  Product Images
                </h3>
                <span className="font-sans text-[11px]" style={{ color: 'rgba(245,242,236,0.3)' }}>
                  {imgPreviews.length} / {MAX_IMAGES}
                </span>
              </div>

              {/* Drop zone */}
              {imgPreviews.length < MAX_IMAGES && (
                <div
                  className="relative flex flex-col items-center justify-center gap-3 mb-4 rounded-xl cursor-pointer transition-all"
                  style={{
                    height: 120,
                    border: `2px dashed ${dragOver ? '#c9a27e' : 'rgba(201,162,126,0.2)'}`,
                    background: dragOver ? 'rgba(201,162,126,0.05)' : 'rgba(255,255,255,0.02)',
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
                  onClick={() => fileRef.current?.click()}
                >
                  <span className="text-2xl">📸</span>
                  <div className="text-center">
                    <p className="font-sans text-sm" style={{ color: '#c9a27e' }}>Drop images here or click to upload</p>
                    <p className="font-sans text-[11px] mt-1" style={{ color: 'rgba(245,242,236,0.3)' }}>
                      JPG, PNG, WebP — up to {MAX_IMAGES} images total
                    </p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only"
                    onChange={e => handleFiles(e.target.files)} />
                </div>
              )}

              {/* Image grid */}
              {imgPreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {imgPreviews.map((src, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden"
                      style={{ aspectRatio: '1', background: '#1a2318' }}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 font-sans text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: '#c9a27e', color: '#0f1510' }}>Main</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {i > 0 && (
                          <button onClick={() => reorderImg(i, i - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                              <path d="M15 18l-6-6 6-6"/>
                            </svg>
                          </button>
                        )}
                        <button onClick={() => removeImg(i)}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(220,38,38,0.8)' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                        {i < imgPreviews.length - 1 && (
                          <button onClick={() => reorderImg(i, i + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                              <path d="M9 18l6-6-6-6"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Basic Info ── */}
            <section>
              <h3 className="font-sans text-xs tracking-[.2em] uppercase mb-4" style={{ color: 'rgba(201,162,126,0.8)' }}>Basic Info</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: 'name',     label: 'Product Name',  ph: 'The Archive Board', full: true },
                  { k: 'tagline',  label: 'Tagline',       ph: 'Your story, rendered permanent', full: true },
                  { k: 'slug',     label: 'URL Slug',      ph: 'archive-board' },
                  { k: 'material', label: 'Material',      ph: 'English White Oak' },
                ].map(({ k, label, ph, full }) => (
                  <div key={k} className={full ? 'col-span-2' : ''}>
                    <label className="font-sans text-[10px] tracking-[.2em] uppercase block mb-1.5" style={{ color: 'rgba(245,242,236,0.4)' }}>{label}</label>
                    <input type="text" value={form[k] || ''} onChange={e => set(k, e.target.value)} placeholder={ph}
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── Pricing & Stock ── */}
            <section>
              <h3 className="font-sans text-xs tracking-[.2em] uppercase mb-4" style={{ color: 'rgba(201,162,126,0.8)' }}>Pricing & Stock</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { k: 'price', label: 'Price (£)', ph: '89', type: 'number' },
                  { k: 'originalPrice', label: 'Original (£)', ph: '120', type: 'number' },
                  { k: 'stock', label: 'Stock', ph: '10', type: 'number' },
                  { k: 'deliveryDays', label: 'Delivery Days', ph: '14-21' },
                ].map(({ k, label, ph, type = 'text' }) => (
                  <div key={k}>
                    <label className="font-sans text-[10px] tracking-[.2em] uppercase block mb-1.5" style={{ color: 'rgba(245,242,236,0.4)' }}>{label}</label>
                    <input type={type} value={form[k] || ''} onChange={e => set(k, e.target.value)} placeholder={ph}
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── Categorisation ── */}
            <section>
              <h3 className="font-sans text-xs tracking-[.2em] uppercase mb-4" style={{ color: 'rgba(201,162,126,0.8)' }}>Categorisation</h3>
              <div className="grid grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="font-sans text-[10px] tracking-[.2em] uppercase block mb-1.5" style={{ color: 'rgba(245,242,236,0.4)' }}>Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a2318' }}>{c}</option>)}
                  </select>
                </div>
                {/* Difficulty */}
                <div>
                  <label className="font-sans text-[10px] tracking-[.2em] uppercase block mb-1.5" style={{ color: 'rgba(245,242,236,0.4)' }}>Tier</label>
                  <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }}>
                    {DIFFICULTIES.map(d => <option key={d} value={d} style={{ background: '#1a2318' }}>{d}</option>)}
                  </select>
                </div>
                {/* Emotion */}
                <div>
                  <label className="font-sans text-[10px] tracking-[.2em] uppercase block mb-1.5" style={{ color: 'rgba(245,242,236,0.4)' }}>Emotion</label>
                  <select value={form.emotion} onChange={e => set('emotion', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }}>
                    {EMOTIONS.map(em => <option key={em} value={em} style={{ background: '#1a2318' }}>{em}</option>)}
                  </select>
                </div>
              </div>
              {/* Toggles */}
              <div className="flex gap-4 mt-4">
                {[['bestseller', '⭐ Bestseller'], ['engraving', '✏️ Engraving available']].map(([k, label]) => (
                  <button key={k} type="button" onClick={() => set(k, !form[k])}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans text-xs transition-all"
                    style={{ border: `1px solid ${form[k] ? '#c9a27e' : 'rgba(245,242,236,0.08)'}`, background: form[k] ? 'rgba(201,162,126,0.08)' : 'rgba(255,255,255,0.02)', color: form[k] ? '#c9a27e' : 'rgba(245,242,236,0.4)' }}>
                    <span className={`w-4 h-4 rounded flex items-center justify-center border ${form[k] ? 'bg-amber-500/80' : ''}`}
                      style={{ borderColor: form[k] ? '#c9a27e' : 'rgba(245,242,236,0.2)' }}>
                      {form[k] && <svg width="8" height="7" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Description ── */}
            <section>
              <h3 className="font-sans text-xs tracking-[.2em] uppercase mb-4" style={{ color: 'rgba(201,162,126,0.8)' }}>Description</h3>
              <textarea value={form.description || ''} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="Describe the piece — its character, material, and what makes it special…"
                className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[['dimensions', 'Dimensions', '40cm × 28cm × 2cm'], ['weight', 'Weight', '680g']].map(([k, label, ph]) => (
                  <div key={k}>
                    <label className="font-sans text-[10px] tracking-[.2em] uppercase block mb-1.5" style={{ color: 'rgba(245,242,236,0.4)' }}>{label}</label>
                    <input type="text" value={form[k] || ''} onChange={e => set(k, e.target.value)} placeholder={ph}
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── Features ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans text-xs tracking-[.2em] uppercase" style={{ color: 'rgba(201,162,126,0.8)' }}>Key Features</h3>
                <button onClick={addFeature} className="font-sans text-[11px] flex items-center gap-1.5 transition-colors"
                  style={{ color: '#c9a27e' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Add feature
                </button>
              </div>
              <div className="space-y-2">
                {(form.features || []).map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={f} onChange={e => setFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}`}
                      className="flex-1 px-4 py-2.5 rounded-lg font-sans text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                    <button onClick={() => removeFeature(i)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Actions ── */}
            <div className="flex gap-3 pt-2 pb-4">
              <button onClick={onCancel}
                className="flex-1 py-3.5 font-sans text-xs tracking-[.15em] uppercase rounded-lg transition-all"
                style={{ border: '1px solid rgba(245,242,236,0.1)', color: 'rgba(245,242,236,0.5)' }}>
                Cancel
              </button>
              <button onClick={() => onSave(form)}
                className="flex-1 py-3.5 font-sans text-xs tracking-[.15em] uppercase rounded-lg transition-all"
                style={{ background: '#c9a27e', color: '#0f1510' }}>
                {isNew ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Admin Page ────────────────────────────────────── */
export default function AdminPage() {
  const [auth, setAuth]           = useState(false)
  useEffect(() => {
    // Auto-auth in dev OR if previously authenticated
    if (process.env.NODE_ENV === 'development' || localStorage.getItem('mow_admin') === '1') {
      setAuth(true)
    }
  }, [])
  const [pass, setPass]           = useState('')
  const [passErr, setPassErr]     = useState(false)
  const passRef                   = useRef(null)
  const [tab, setTab]             = useState('products')
  const [products, setProducts]   = useState(initialProducts)
  const [editing, setEditing]     = useState(null) // product obj or 'new'
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [toast, setToast]         = useState(null)
  const [orders, setOrders]       = useState(MOCK_ORDERS)
  const [orderSearch, setOrderSearch] = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const STATS = [
    { label: 'Products',      value: products.length, icon: '📦', trend: `${products.filter(p => p.bestseller).length} bestsellers` },
    { label: 'Orders today',  value: 7,              icon: '🛒', trend: '+3 vs yesterday' },
    { label: 'Revenue (MTD)', value: '£4,820',       icon: '💷', trend: '+18%' },
    { label: 'Low stock',     value: products.filter(p => (p.stock || 0) < 5).length, icon: '⚠️', trend: '< 5 units' },
  ]

  /* Auth */
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f0b' }}>
        <div className="w-full max-w-sm px-8 py-10 rounded-2xl" style={{ background: '#141c12', border: '1px solid rgba(245,242,236,0.06)' }}>
          <div className="text-center mb-8">
            <img src="/images/logo.svg" alt="" className="h-12 w-auto mx-auto mb-4" style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
            <h1 className="font-serif text-2xl" style={{ color: '#f5f2ec' }}>Admin access</h1>
            <p className="font-sans text-xs mt-1" style={{ color: 'rgba(245,242,236,0.35)' }}>Museum of Woods · Dashboard</p>
          </div>
          <div>
            <input
              ref={passRef}
              type="password"
              defaultValue=""
              placeholder="Enter password"
              onKeyDown={e => { if (e.key === 'Enter') { const v = passRef.current?.value; if (v === PASS) { localStorage.setItem('mow_admin','1'); setAuth(true) } else { setPassErr(true); setTimeout(() => setPassErr(false), 2000) } } }}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl font-sans text-sm outline-none mb-3 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${passErr ? 'rgba(220,38,38,0.5)' : 'rgba(245,242,236,0.08)'}`, color: '#f5f2ec' }}
            />
            {passErr && <p className="font-sans text-xs text-red-400 mb-3">Incorrect password</p>}
            <button
              type="button"
              onClick={() => { const v = passRef.current?.value; if (v === PASS) { localStorage.setItem('mow_admin','1'); setAuth(true) } else { setPassErr(true); setTimeout(() => setPassErr(false), 2000) } }}
              className="w-full py-3.5 font-sans text-xs tracking-[.2em] uppercase rounded-xl"
              style={{ background: '#c9a27e', color: '#0f1510' }}>
              Enter dashboard →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const filtered = products.filter(p =>
    (filterCat === 'all' || p.category === filterCat) &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) || p.slug?.includes(search.toLowerCase()))
  )

  const filteredOrders = orders.filter(o =>
    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.product.toLowerCase().includes(orderSearch.toLowerCase())
  )

  const saveProduct = (form) => {
    if (editing === 'new') {
      setProducts(prev => [...prev, { ...form, id: Date.now(), image: form.images?.[0] || '' }])
      showToast('Product created!')
    } else {
      setProducts(prev => prev.map(p => p.id === form.id ? { ...form, image: form.images?.[0] || p.image } : p))
      showToast('Product updated!')
    }
    setEditing(null)
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    showToast('Product deleted', 'error')
  }

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    showToast(`Order ${id} → ${status}`)
  }

  const TABS = [
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders',   label: 'Orders',   icon: '🛒' },
    { id: 'customers',label: 'Customers',icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const CATS = ['all', 'gifts', 'home', 'business', 'art', 'custom']

  return (
    <>
      {/* Product form modal */}
      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          onSave={saveProduct}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] px-5 py-3.5 rounded-xl shadow-2xl font-sans text-sm flex items-center gap-2.5 transition-all"
          style={{ background: toast.type === 'error' ? '#dc2626' : '#c9a27e', color: '#0f1510' }}>
          {toast.type === 'error' ? '⚠️' : '✓'} {toast.msg}
        </div>
      )}

      <div className="min-h-screen flex" style={{ background: '#0a0f0b' }}>

        {/* Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col" style={{ background: '#0f1510', borderRight: '1px solid rgba(245,242,236,0.05)' }}>
          <div className="p-6" style={{ borderBottom: '1px solid rgba(245,242,236,0.05)' }}>
            <Link href="/">
              <img src="/images/logo.svg" alt="Museum of Woods" className="h-10 w-auto"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
            </Link>
            <p className="font-sans text-[10px] tracking-[.2em] uppercase mt-2" style={{ color: 'rgba(245,242,236,0.25)' }}>
              Admin Dashboard
            </p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-sans text-sm transition-all"
                style={{
                  background: tab === t.id ? 'rgba(201,162,126,0.1)' : 'transparent',
                  color: tab === t.id ? '#c9a27e' : 'rgba(245,242,236,0.5)',
                  borderLeft: tab === t.id ? '2px solid #c9a27e' : '2px solid transparent',
                }}>
                <span>{t.icon}</span>
                {t.label}
                {t.id === 'orders' && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(201,162,126,0.15)', color: '#c9a27e' }}>7</span>}
              </button>
            ))}
          </nav>
          <div className="p-4" style={{ borderTop: '1px solid rgba(245,242,236,0.05)' }}>
            <Link href="/" className="flex items-center gap-2 font-sans text-xs transition-colors"
              style={{ color: 'rgba(245,242,236,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,242,236,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,242,236,0.3)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12H19M5 12l7-7M5 12l7 7"/></svg>
              Back to site
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5 sticky top-0 z-10"
            style={{ background: 'rgba(10,15,11,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,242,236,0.05)' }}>
            <h1 className="font-serif text-xl capitalize" style={{ color: '#f5f2ec' }}>
              {TABS.find(t => t.id === tab)?.icon} {tab}
            </h1>
            {tab === 'products' && (
              <button onClick={() => setEditing('new')}
                className="flex items-center gap-2 px-5 py-2.5 font-sans text-xs tracking-[.15em] uppercase rounded-lg transition-all hover:opacity-90"
                style={{ background: '#c9a27e', color: '#0f1510' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Add Product
              </button>
            )}
          </div>

          <div className="p-8">

            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-5 mb-8">
              {STATS.map(s => (
                <div key={s.label} className="rounded-xl p-5" style={{ background: '#141c12', border: '1px solid rgba(245,242,236,0.05)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-sans text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,162,126,0.1)', color: '#c9a27e' }}>
                      {s.trend}
                    </span>
                  </div>
                  <p className="font-serif text-3xl" style={{ color: '#f5f2ec' }}>{s.value}</p>
                  <p className="font-sans text-[11px] mt-1" style={{ color: 'rgba(245,242,236,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── PRODUCTS TAB ── */}
            {tab === 'products' && (
              <div>
                {/* Filters */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative flex-1 max-w-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,242,236,0.3)" strokeWidth="2"
                      className="absolute left-4 top-1/2 -translate-y-1/2">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                  </div>
                  <div className="flex gap-1.5">
                    {CATS.map(c => (
                      <button key={c} onClick={() => setFilterCat(c)}
                        className="px-3.5 py-2 rounded-lg font-sans text-[11px] tracking-[.1em] uppercase capitalize transition-all"
                        style={{ background: filterCat === c ? '#c9a27e' : 'rgba(255,255,255,0.04)', color: filterCat === c ? '#0f1510' : 'rgba(245,242,236,0.4)', border: '1px solid rgba(245,242,236,0.06)' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products table */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,242,236,0.06)' }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(245,242,236,0.05)' }}>
                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Images', 'Actions'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left font-sans text-[10px] tracking-[.2em] uppercase"
                            style={{ color: 'rgba(245,242,236,0.3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p, i) => (
                        <tr key={p.id}
                          style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom: '1px solid rgba(245,242,236,0.04)' }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: '#1a2318' }}>
                                {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <p className="font-sans text-sm font-medium" style={{ color: '#f5f2ec' }}>{p.name}</p>
                                <p className="font-sans text-[10px] mt-0.5" style={{ color: 'rgba(245,242,236,0.3)' }}>{p.material}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-sans text-[11px] capitalize px-2.5 py-1 rounded-full"
                              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(245,242,236,0.5)' }}>
                              {p.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <span className="font-sans text-sm" style={{ color: '#c9a27e' }}>£{p.price}</span>
                              {p.originalPrice && <span className="font-sans text-[11px] line-through ml-2" style={{ color: 'rgba(245,242,236,0.2)' }}>£{p.originalPrice}</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-sans text-sm" style={{ color: (p.stock || 0) < 5 ? '#ef4444' : '#f5f2ec' }}>
                              {p.stock ?? '—'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {p.bestseller && <span className="font-sans text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,162,126,0.15)', color: '#c9a27e' }}>⭐ Best</span>}
                              {p.engraving && <span className="font-sans text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>✏️ Engrave</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-sans text-xs" style={{ color: 'rgba(245,242,236,0.4)' }}>
                              {(p.images || [p.image]).filter(Boolean).length} / {MAX_IMAGES}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditing(p)}
                                className="px-3 py-1.5 rounded-lg font-sans text-[11px] transition-all hover:opacity-80"
                                style={{ background: 'rgba(201,162,126,0.12)', color: '#c9a27e' }}>
                                Edit
                              </button>
                              <Link href={`/shop/${p.slug}`} target="_blank"
                                className="px-3 py-1.5 rounded-lg font-sans text-[11px] transition-all hover:opacity-80"
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(245,242,236,0.5)' }}>
                                View
                              </Link>
                              <button onClick={() => deleteProduct(p.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                                style={{ background: 'rgba(220,38,38,0.1)' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(245,242,236,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                    <p className="font-sans text-[11px]" style={{ color: 'rgba(245,242,236,0.3)' }}>
                      Showing {filtered.length} of {products.length} products
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div>
                <div className="relative max-w-sm mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,242,236,0.3)" strokeWidth="2"
                    className="absolute left-4 top-1/2 -translate-y-1/2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Search orders…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,242,236,0.06)' }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(245,242,236,0.05)' }}>
                        {['Order', 'Customer', 'Product', 'Total', 'Status', 'Date', 'Update'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left font-sans text-[10px] tracking-[.2em] uppercase"
                            style={{ color: 'rgba(245,242,236,0.3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o, i) => (
                        <tr key={o.id} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom: '1px solid rgba(245,242,236,0.04)' }}>
                          <td className="px-5 py-4 font-mono text-xs" style={{ color: '#c9a27e' }}>{o.id}</td>
                          <td className="px-5 py-4 font-sans text-sm" style={{ color: '#f5f2ec' }}>{o.customer}</td>
                          <td className="px-5 py-4 font-sans text-xs" style={{ color: 'rgba(245,242,236,0.5)' }}>{o.product}</td>
                          <td className="px-5 py-4 font-sans text-sm" style={{ color: '#c9a27e' }}>£{o.total}</td>
                          <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                          <td className="px-5 py-4 font-sans text-xs" style={{ color: 'rgba(245,242,236,0.35)' }}>{o.date}</td>
                          <td className="px-5 py-4">
                            <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                              className="px-3 py-1.5 rounded-lg font-sans text-[11px] outline-none appearance-none"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }}>
                              {Object.keys(STATUS_COLOURS).map(s => (
                                <option key={s} value={s} style={{ background: '#1a2318' }}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── CUSTOMERS TAB ── */}
            {tab === 'customers' && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,242,236,0.06)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(245,242,236,0.05)' }}>
                      {['Customer', 'Email', 'Country', 'Orders', 'Total Spent'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left font-sans text-[10px] tracking-[.2em] uppercase"
                          style={{ color: 'rgba(245,242,236,0.3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_CUSTOMERS.map((c, i) => (
                      <tr key={c.email} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom: '1px solid rgba(245,242,236,0.04)' }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-medium"
                              style={{ background: 'rgba(201,162,126,0.15)', color: '#c9a27e' }}>
                              {c.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-sans text-sm" style={{ color: '#f5f2ec' }}>{c.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-sans text-xs" style={{ color: 'rgba(245,242,236,0.4)' }}>{c.email}</td>
                        <td className="px-5 py-4 font-sans text-xl">{c.country}</td>
                        <td className="px-5 py-4 font-sans text-sm" style={{ color: '#f5f2ec' }}>{c.orders}</td>
                        <td className="px-5 py-4 font-sans text-sm font-medium" style={{ color: '#c9a27e' }}>£{c.spent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === 'settings' && (
              <div className="max-w-lg space-y-6">
                {[
                  { label: 'Store Name', value: 'Museum of Woods', ph: '' },
                  { label: 'Contact Email', value: 'hello@museumofwoods.co', ph: '' },
                  { label: 'Default Currency', value: 'GBP — British Pound', ph: '' },
                  { label: 'Default Delivery Days', value: '14-21', ph: '' },
                ].map(s => (
                  <div key={s.label}>
                    <label className="font-sans text-[11px] tracking-[.2em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>{s.label}</label>
                    <input type="text" defaultValue={s.value}
                      className="w-full px-4 py-3.5 rounded-xl font-sans text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.08)', color: '#f5f2ec' }} />
                  </div>
                ))}
                <button className="px-8 py-3.5 font-sans text-xs tracking-[.18em] uppercase rounded-xl transition-all hover:opacity-90"
                  style={{ background: '#c9a27e', color: '#0f1510' }}
                  onClick={() => showToast('Settings saved!')}>
                  Save settings
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  )
}
