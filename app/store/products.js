'use client'
import { create } from 'zustand'
import { products as seedProducts, categories as seedCategories } from '../data/products'

const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')

// Map DB row → app product shape
const fromDB = (row) => ({
  id:          row.id,
  slug:        slugify(row.name),
  name:        row.name,
  price:       Number(row.price),
  description: row.description || '',
  category:    row.category || 'gifts',
  images:      Array.isArray(row.images) ? row.images : [],
  image:       Array.isArray(row.images) ? row.images[0] : '',
  badge:       row.badge || null,
  woodType:    row.wood_type || null,
  size:        row.size || null,
  leadTime:    row.lead_time || null,
  rating:      Number(row.rating)  || 5,
  reviews:     Number(row.reviews) || 0,
  featured:    Boolean(row.featured),
  createdAt:   row.created_at,
})

export const useProductStore = create((set, get) => ({
  products:   seedProducts,
  categories: seedCategories,
  loaded:     false,  // true once DB data has been fetched

  // ── Fetch from DB (call this on app init) ──────────────────────────
  fetchAll: async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ])
      const { products: dbProducts } = await pRes.json()
      const { categories: dbCats }   = await cRes.json()

      // Merge: seed products + DB products (DB wins on conflict by id)
      const seedIds  = new Set(seedProducts.map(p => String(p.id)))
      const dbIds    = new Set((dbProducts || []).map(p => String(p.id)))
      const merged   = [
        ...seedProducts.filter(p => !dbIds.has(String(p.id))),
        ...(dbProducts || []).map(fromDB),
      ]

      // Categories: seed built-ins + DB custom ones
      const seedCatIds = new Set(seedCategories.map(c => c.id))
      const mergedCats = [
        ...seedCategories,
        ...(dbCats || []).filter(c => !seedCatIds.has(c.id)).map(c => ({ id: c.id, label: c.label })),
      ]

      set({ products: merged, categories: mergedCats, loaded: true })
    } catch (err) {
      console.error('fetchAll error:', err)
      set({ loaded: true })
    }
  },

  // ── Product CRUD (writes to DB + updates local state) ──────────────
  addProduct: async (data) => {
    const id   = `prod_${Date.now()}`
    const slug = slugify(data.name || id)
    const product = {
      ...data,
      id,
      slug,
      images: data.images?.length ? data.images : [data.image].filter(Boolean),
      image:  data.images?.[0] || data.image || '',
      createdAt: new Date().toISOString(),
    }
    // Optimistic update
    set(s => ({ products: [...s.products, product] }))

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      if (!res.ok) throw new Error(await res.text())
    } catch (err) {
      console.error('addProduct DB error:', err)
    }
    return product
  },

  updateProduct: async (id, updates) => {
    set(s => ({
      products: s.products.map(p =>
        String(p.id) === String(id)
          ? { ...p, ...updates, slug: updates.name ? slugify(updates.name) : p.slug }
          : p
      ),
    }))

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, id }),
      })
    } catch (err) {
      console.error('updateProduct DB error:', err)
    }
  },

  deleteProduct: async (id) => {
    set(s => ({ products: s.products.filter(p => String(p.id) !== String(id)) }))
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('deleteProduct DB error:', err)
    }
  },

  // ── Category CRUD ───────────────────────────────────────────────────
  addCategory: async (label) => {
    const id = slugify(label)
    if (get().categories.find(c => c.id === id)) return
    set(s => ({ categories: [...s.categories, { id, label }] }))
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, label }),
      })
    } catch (err) {
      console.error('addCategory DB error:', err)
    }
  },

  updateCategory: async (id, newLabel) => {
    set(s => ({
      categories: s.categories.map(c => c.id === id ? { ...c, label: newLabel } : c),
    }))
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, label: newLabel }),
      })
    } catch (err) {
      console.error('updateCategory DB error:', err)
    }
  },

  deleteCategory: async (id) => {
    if (id === 'all') return
    set(s => ({
      categories: s.categories.filter(c => c.id !== id),
      products:   s.products.map(p => p.category === id ? { ...p, category: 'gifts' } : p),
    }))
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('deleteCategory DB error:', err)
    }
  },

  resetToSeed: () => set({ products: seedProducts, categories: seedCategories }),
}))
