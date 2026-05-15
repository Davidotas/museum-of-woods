'use client'

import Link from 'next/link'
import { useCartStore } from '../store/cart'
import { useCurrencyStore } from '../store/currency'
import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from './Icons'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCartStore()
  const format = useCurrencyStore(s => s.format)

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? 'visible' : ''}`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <aside className={`cart-sidebar flex flex-col ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-fog/8">
          <div className="flex items-center gap-3">
            <CartIcon size={18} className="text-amber" />
            <div>
              <h2 className="font-serif text-xl text-fog/90">Your Cart</h2>
              <p className="font-sans text-[10px] tracking-[.2em] uppercase text-fog/35 mt-0.5">
                {count} {count === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-fog/40 hover:text-amber transition-colors"
            aria-label="Close cart"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <CartIcon size={40} className="text-fog/15 mb-4" />
              <p className="font-serif text-lg text-fog/50 mb-2">Nothing here yet</p>
              <p className="font-sans text-xs text-fog/25">
                Browse the shop or explore an idea
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex gap-4 py-4 border-b border-fog/6">
                <div
                  className="w-16 h-16 shrink-0 bg-bark/60"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm text-fog/90 truncate">{item.name}</p>
                  <p className="font-sans text-[10px] tracking-[.15em] uppercase text-fog/35 mt-0.5">
                    {item.material}
                  </p>
                  {item.options?.engraving && (
                    <p className="font-sans text-[10px] text-amber/70 mt-1 truncate">
                      ✏ "{item.options.engraving}"
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        className="w-6 h-6 border border-fog/15 text-fog/50 flex items-center justify-center hover:border-amber/40 hover:text-amber transition-colors"
                      >
                        <MinusIcon size={10} />
                      </button>
                      <span className="font-sans text-xs text-fog/70 w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        className="w-6 h-6 border border-fog/15 text-fog/50 flex items-center justify-center hover:border-amber/40 hover:text-amber transition-colors"
                      >
                        <PlusIcon size={10} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-sm text-amber">{format(item.price * item.qty)}</span>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-fog/20 hover:text-fog/50 transition-colors"
                        aria-label="Remove item"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-fog/8">
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-xs tracking-[.15em] uppercase text-fog/40">Subtotal</span>
              <span className="font-serif text-xl text-fog/90">{format(total)}</span>
            </div>
            <p className="font-sans text-[10px] text-fog/25 mb-5">
              Engraving, finishing & shipping calculated at checkout
            </p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full justify-center mb-3 block text-center">
              Proceed to Checkout →
            </Link>
            <button onClick={closeCart} className="btn-ghost w-full justify-center text-center">
              Continue browsing
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
