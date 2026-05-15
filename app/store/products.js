'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { products as seedProducts, categories as seedCategories } from '../data/products'

const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')

// Safe localStorage for SSR
const safeStorage = createJSONStorage(() =>
  typeof window !== 'undefined'
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
)

// Map DB row → app product shape
const fromDB = (row) => ({
  id:           String(row.id),
  slug:         slugify(row.name),
  name:         row.name,
  price:        Number(row.price),
  description:  row.description  || '',
  category:     row.category     || 'gifts',
  images:       Array.isArray(row.images) ? row.images : [],
  image:        Array.isArray(row.images) && row.images.length ? row.images[0] : '',
  badge:        row.badge        || null,
  woodType:     row.wood_type    || null,
  size:         row.size         || null,
  leadTime:     row.lead_time    || null,
  rating:       Number(row.rating)  || 5,
  reviews:      Number(row.reviews) || 0,
  featured:     Boolean(row.featured),
  bestseller:   Boolean(row.featured),
  createdAt:    row.created_at,
})

export const useProductStore = create(
  persist(
    (set, get) => ({
      products:   seedProducts,
      categories: seedCategories,
      loaded:     false,

      // ── Fetch from DB on every page load ─────────────────────────────
      fetchAll: async () => {
        try {
          const [pRes, cRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/categories'),
          ])
          if (!pRes.ok || !cRes.ok) throw new Error('API error')
          const { products: dbProducts }   = await pRes.json()
          const { categories: dbCats }     = await cRes.json()

          // DB products keyed by id (string) take priority over seed
          const dbIds = new Set((dbProducts || []).map(p => String(p.id)))
          const merged = [
            ...seedProducts.filter(p => !dbIds.has(String(p.id))),
            ...(dbProducts || []).map(fromDB),
          ]

          // Categories: seed built-ins + DB custom ones (no duplicates)
          const seedCatIds = new Set(seedCategories.map(c => c.id))
          const mergedCats = [
            ...seedCategories,
            ...(dbCats || []).filter(c => !seedCatIds.has(c.id)).map(c => ({ id: c.id, label: c.label })),
          ]

          set({ products: merged, categories: mergedCats, loaded: true })
        } catch (err) {
          console.warn('fetchAll: DB unavailable, using cached data', err.message)
          set({ loaded: true })   // keep whatever is in localStorage from last fetch
        }
      },

      // ── Product CRUD ──────────────────────────────────────────────────
      addProduct: async (data) => {
        const id   = `prod_${Date.now()}`
        const slug = slugify(data.name || id)
        const product = {
          ...data,
          id,
          slug,
          images:    data.images?.length ? data.images : [data.image].filter(Boolean),
          image:     data.images?.[0]   || data.image || '',
          createdAt: new Date().toISOString(),
        }
        // Optimistic update (immediately visible everywhere)
        set(s => ({ products: [...s.products, product] }))

        // Persist to DB
        try {
          const res = await fetch('/api/products', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(product),
          })
          if (!res.ok) throw new Error(await res.text())
        } catch (err) {
          console.error('addProduct DB error:', err.message)
        }

        // Sync to Stripe (non-blocking — don't fail if Stripe errors)
        try {
          const sr = await fetch('/api/stripe/sync-product', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              id,
              name:        product.name,
              price:       product.price,
              description: product.description,
              images:      product.images,
            }),
          })
          if (sr.ok) {
            const { stripeProductId, stripePriceId } = await sr.json()
            // Store stripe IDs on the product in state + DB
            const updated = { ...product, stripeProductId, stripePriceId }
            set(s => ({
              products: s.products.map(p => p.id === id ? updated : p),
            }))
            await fetch('/api/products', {
              method:  'PUT',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({ id, stripeProductId, stripePriceId }),
            })
          }
        } catch (err) {
          console.warn('Stripe sync skipped:', err.message)
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
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ ...updates, id }),
          })
        } catch (err) {
          console.error('updateProduct DB error:', err.message)
        }
      },

      deleteProduct: async (id) => {
        set(s => ({ products: s.products.filter(p => String(p.id) !== String(id)) }))
        try {
          await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
        } catch (err) {
          console.error('deleteProduct DB error:', err.message)
        }
      },

      // ── Category CRUD ─────────────────────────────────────────────────
      addCategory: async (label) => {
        const id = slugify(label)
        if (get().categories.find(c => c.id === id)) return
        set(s => ({ categories: [...s.categories, { id, label }] }))
        try {
          await fetch('/api/categories', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id, label }),
          })
        } catch (err) {
          console.error('addCategory DB error:', err.message)
        }
      },

      updateCategory: async (id, newLabel) => {
        set(s => ({
          categories: s.categories.map(c => c.id === id ? { ...c, label: newLabel } : c),
        }))
        try {
          await fetch('/api/categories', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id, label: newLabel }),
          })
        } catch (err) {
          console.error('updateCategory DB error:', err.message)
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
          console.error('deleteCategory DB error:', err.message)
        }
      },

      resetToSeed: () => set({ products: seedProducts, categories: seedCategories }),
    }),
    {
      name:    'mow-product-store-v2',
      storage: safeStorage,
      // Persist everything — so refresh always shows the last known good state
      partialize: (state) => ({
        products:   state.products,
        categories: state.categories,
      }),
      // On hydrate: keep persisted state, then fetchAll will update from DB
      merge: (persisted, current) => ({
        ...current,
        products:   persisted.products?.length   ? persisted.products   : current.products,
        categories: persisted.categories?.length ? persisted.categories : current.categories,
        loaded:     false,  // always re-fetch from DB on mount
      }),
    }
  )
)
