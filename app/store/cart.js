'use client'

import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, options = {}) => {
    const { items } = get()
    const key = `${product.id}-${options.engraving || ''}-${options.material || product.materialCode}`
    const existing = items.find((i) => i.key === key)
    let newItems
    if (existing) {
      newItems = items.map((i) => i.key === key ? { ...i, qty: i.qty + 1 } : i)
    } else {
      newItems = [...items, { ...product, key, qty: 1, options }]
    }
    set({
      items: newItems,
      isOpen: true,
      total: newItems.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0),
      count: newItems.reduce((s, i) => s + i.qty, 0),
    })
  },

  removeItem: (key) => {
    const newItems = get().items.filter((i) => i.key !== key)
    set({
      items: newItems,
      total: newItems.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0),
      count: newItems.reduce((s, i) => s + i.qty, 0),
    })
  },

  updateQty: (key, qty) => {
    if (qty < 1) { get().removeItem(key); return }
    const newItems = get().items.map((i) => i.key === key ? { ...i, qty } : i)
    set({
      items: newItems,
      total: newItems.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0),
      count: newItems.reduce((s, i) => s + i.qty, 0),
    })
  },

  clearCart: () => set({ items: [], total: 0, count: 0 }),

  openCart:   () => set({ isOpen: true }),
  closeCart:  () => set({ isOpen: false }),
  toggleCart: () => set({ isOpen: !get().isOpen }),

  total: 0,
  count: 0,
}))
