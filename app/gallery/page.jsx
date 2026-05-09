'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import { galleryRooms } from '../data/gallery'

export default function GalleryPage() {
  const [activeRoom, setActiveRoom] = useState(galleryRooms[0])
  const [activeExhibit, setActiveExhibit] = useState(null)

  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>

        {/* Museum entrance */}
        <div className="relative overflow-hidden" style={{ height: '60vh' }}>
          <img
            src="https://images.unsplash.com/photo-U01ptiZV3Uo?auto=format&fit=crop&w=1600&q=85"
            alt="Museum of Woods"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.2) saturate(0.5)' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="section-label">The Gallery</span>
            <h1 className="font-serif text-fog/95 mb-4" style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1.05 }}>
              Museum of Woods
            </h1>
            <p className="font-sans text-sm text-fog/40 max-w-md leading-loose">
              Four rooms. Each one holds objects with emotional weight. Enter, look carefully, read the stories.
            </p>
            <div className="flex gap-1 mt-8">
              {galleryRooms.map(r => (
                <div key={r.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: r.accentColour }} />
              ))}
            </div>
          </div>
        </div>

        {/* Room selector */}
        <div className="border-b border-fog/8">
          <div className="px-6 md:px-14 flex gap-0 overflow-x-auto">
            {galleryRooms.map(room => (
              <button
                key={room.id}
                onClick={() => { setActiveRoom(room); setActiveExhibit(null) }}
                className={`shrink-0 flex items-center gap-3 px-8 py-5 border-b-2 font-sans text-[11px] tracking-[.2em] uppercase transition-all duration-400 ${
                  activeRoom.id === room.id
                    ? 'border-amber text-amber'
                    : 'border-transparent text-fog/35 hover:text-fog/60'
                }`}
              >
                <span className="text-xl">{room.emoji}</span>
                {room.name}
              </button>
            ))}
          </div>
        </div>

        {/* Room content */}
        <div>
          {/* Room hero */}
          <div className="relative overflow-hidden" style={{ height: '40vh' }}>
            <img src={activeRoom.image} alt={activeRoom.name}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ filter: 'brightness(0.25) saturate(0.6)' }} />
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-12"
              style={{ background: `linear-gradient(to top, ${activeRoom.colour}cc, transparent)` }}>
              <div className="text-5xl mb-3">{activeRoom.emoji}</div>
              <h2 className="font-serif text-fog/95 mb-2" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>
                {activeRoom.name}
              </h2>
              <p className="font-sans text-sm max-w-lg leading-loose" style={{ color: activeRoom.accentColour }}>
                {activeRoom.description}
              </p>
            </div>
          </div>

          {/* Exhibits grid */}
          <div className="px-6 md:px-14 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {activeRoom.exhibits.map((exhibit, i) => (
                <button
                  key={exhibit.id}
                  onClick={() => setActiveExhibit(exhibit.id === activeExhibit ? null : exhibit.id)}
                  className={`card-wood text-left group overflow-hidden transition-all duration-400 ${
                    activeExhibit === exhibit.id ? 'ring-1' : ''
                  }`}
                  style={{ '--tw-ring-color': activeRoom.accentColour }}
                >
                  <div className="relative overflow-hidden" style={{ height: '260px' }}>
                    <img src={exhibit.image} alt={exhibit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy" />
                    <div className="absolute top-3 left-3">
                      <span className="font-sans text-[10px] tracking-[.3em] uppercase px-3 py-1.5"
                        style={{ background: activeRoom.accentColour + '22', color: activeRoom.accentColour, border: `1px solid ${activeRoom.accentColour}44` }}>
                        Exhibit {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-serif text-fog/95 mb-1" style={{ fontSize: '1.2rem' }}>
                        {exhibit.title}
                      </h3>
                      <p className="font-sans text-[10px] tracking-[.15em] uppercase" style={{ color: activeRoom.accentColour + 'cc' }}>
                        {exhibit.material}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="font-sans text-[11px] text-fog/45 leading-loose mb-4 line-clamp-3">
                      {exhibit.story}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-fog/8">
                      <span className="font-sans text-[10px] tracking-[.15em] uppercase text-fog/30">
                        {exhibit.purpose}
                      </span>
                      <span className="font-sans text-[10px] tracking-[.15em] uppercase"
                        style={{ color: activeRoom.accentColour }}>
                        {activeExhibit === exhibit.id ? 'Close ↑' : 'Read story →'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Expanded exhibit */}
            {activeExhibit && (() => {
              const ex = activeRoom.exhibits.find(e => e.id === activeExhibit)
              return (
                <div className="border border-fog/10 bg-[#1a2318] p-8 md:p-12 mb-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                      <img src={ex.image} alt={ex.title} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
                    </div>
                    <div>
                      <span className="font-sans text-[10px] tracking-[.3em] uppercase mb-4 block"
                        style={{ color: activeRoom.accentColour }}>
                        {activeRoom.name} · {ex.purpose}
                      </span>
                      <h3 className="font-serif text-fog/95 mb-6" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
                        {ex.title}
                      </h3>
                      <p className="font-sans text-sm text-fog/55 leading-loose mb-8">{ex.story}</p>
                      <div className="flex items-center gap-6 pt-6 border-t border-fog/8">
                        <div>
                          <div className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25 mb-1">Material</div>
                          <div className="font-sans text-sm text-fog/65">{ex.material}</div>
                        </div>
                        <div>
                          <div className="font-sans text-[9px] tracking-[.2em] uppercase text-fog/25 mb-1">Purpose</div>
                          <div className="font-sans text-sm text-fog/65">{ex.purpose}</div>
                        </div>
                      </div>
                      <div className="mt-8">
                        <Link href="/shop" className="btn-primary">Commission something similar →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* CTA */}
            <div className="text-center border-t border-fog/8 pt-16">
              <h3 className="font-serif text-fog/80 mb-4" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
                Your story belongs in this room.
              </h3>
              <p className="font-sans text-sm text-fog/35 leading-loose mb-8 max-w-sm mx-auto">
                Every exhibit started as someone's idea. Yours is just as worth making permanent.
              </p>
              <Link href="/shop" className="btn-primary">Start your commission →</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
