'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'

const posts = [
  { id: 1, name: 'Aisha T.', city: 'Manchester', avatar: '👩🏽', image: 'https://images.unsplash.com/photo-o54RjF-C7xo?auto=format&fit=crop&w=600&q=80', caption: 'First soundwave piece. Uploaded my mum\'s voicemail. She cried.', material: 'Walnut', likes: 147, tags: ['soundwave','gift','family'], type: 'gift' },
  { id: 2, name: 'Marcus L.', city: 'London',     avatar: '👨🏾', image: 'https://images.unsplash.com/photo-U01ptiZV3Uo?auto=format&fit=crop&w=600&q=80', caption: 'Sold 8 of these to local pubs this month. £280 profit in 2 weekends.', material: 'Oak', likes: 89, tags: ['business','B2B','pubs'], type: 'business' },
  { id: 3, name: 'Sarah M.', city: 'Birmingham', avatar: '👩🏼', image: 'https://images.unsplash.com/photo-DT3SJ-WimzI?auto=format&fit=crop&w=600&q=80', caption: 'Wedding sign season. Booked for 6 weddings next summer. This platform changed things.', material: 'Oak', likes: 203, tags: ['wedding','business','seasonal'], type: 'business' },
  { id: 4, name: 'Priya R.', city: 'Leicester',  avatar: '👩🏽', image: 'https://images.unsplash.com/photo-1fDq8DMtxJg?auto=format&fit=crop&w=600&q=80', caption: 'Surah Al-Fatiha on Iroko. Commissioned for a masjid opening. Most meaningful piece I\'ve made.', material: 'Iroko', likes: 312, tags: ['faith','calligraphy','community'], type: 'art' },
  { id: 5, name: 'Tom H.',   city: 'Bristol',    avatar: '👨🏻', image: 'https://images.unsplash.com/photo-kVY2YCV5fyE?auto=format&fit=crop&w=600&q=80', caption: 'Photo of my late nan on birch. Everyone at the funeral asked where it came from.', material: 'Birch', likes: 451, tags: ['memorial','portrait','family'], type: 'gift' },
  { id: 6, name: 'Kezia B.', city: 'Leeds',      avatar: '👩🏿', image: 'https://images.unsplash.com/photo-0CCVIuAjORE?auto=format&fit=crop&w=600&q=80', caption: 'Adinkra symbol series — all 7 sold in 48hrs on Instagram. Restocking this week.', material: 'Iroko', likes: 178, tags: ['culture','African','art'], type: 'art' },
]

const challenges = [
  { week: 'This week', title: 'The £10 Material Challenge', desc: 'Make something beautiful with under £10 of wood. Show us what you created.', entries: 34, prize: 'Featured on home page' },
  { week: 'Last week',  title: 'Miniature Masterpiece',     desc: 'Anything under 10cm. The constraint forces creativity.', entries: 67, prize: 'Won: Tom H. (Bristol)', winner: true },
]

export default function CommunityPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter)

  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="pt-nav min-h-screen" style={{ background: '#0f1510', color: '#f5f0e8' }}>

        {/* Hero */}
        <div className="px-6 md:px-14 py-16 border-b border-fog/8">
          <span className="section-label">Community</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="section-title">Real people. Real pieces.</h1>
              <p className="font-sans text-sm text-fog/40 max-w-md mt-3 leading-loose">
                From first attempts to full businesses — everything here is made by people who started exactly where you are.
              </p>
            </div>
            <button className="btn-primary shrink-0">+ Share your creation</button>
          </div>
        </div>

        <div className="px-6 md:px-14 py-12">

          {/* Challenge banner */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(c => (
              <div key={c.title} className={`border p-6 ${c.winner ? 'border-fog/10 bg-bark/15' : 'border-amber/30 bg-amber/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-sans text-[10px] tracking-[.25em] uppercase ${c.winner ? 'text-fog/30' : 'text-amber'}`}>
                    🏆 Challenge · {c.week}
                  </span>
                  <span className="font-sans text-[10px] text-fog/30">{c.entries} entries</span>
                </div>
                <h3 className="font-serif text-fog/90 mb-2" style={{ fontSize: '1.15rem' }}>{c.title}</h3>
                <p className="font-sans text-xs text-fog/40 leading-loose mb-3">{c.desc}</p>
                <p className="font-sans text-[10px] tracking-[.15em] uppercase" style={{ color: c.winner ? '#888' : '#c9a27e' }}>
                  {c.prize}
                </p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-3 flex-wrap mb-8">
            {[['all', 'All Creations'], ['gift', 'Gifts'], ['business', 'Business'], ['art', 'Art']].map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)}
                className={`font-sans text-[11px] tracking-[.2em] uppercase px-4 py-2 border transition-all duration-300 ${
                  filter === id ? 'bg-amber text-forest border-amber' : 'border-fog/15 text-fog/45 hover:border-fog/40'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {filtered.map(post => (
              <div key={post.id} className="card-wood group overflow-hidden">
                <div className="relative overflow-hidden" style={{ aspectRatio: '1' }}>
                  <img src={post.image} alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-forest/70 px-2.5 py-1.5">
                    <span className="text-amber text-[10px]">♥</span>
                    <span className="font-sans text-[10px] text-fog/70">{post.likes}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{post.avatar}</span>
                    <div>
                      <p className="font-sans text-sm text-fog/80">{post.name}</p>
                      <p className="font-sans text-[10px] text-fog/30">{post.city} · {post.material}</p>
                    </div>
                  </div>
                  <p className="font-sans text-[11px] text-fog/55 leading-loose mb-3">
                    "{post.caption}"
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(t => (
                      <span key={t} className="tag text-fog/30">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Success stories */}
          <div>
            <span className="section-label">Success Stories</span>
            <h2 className="section-title mb-10">First sale moments.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { avatar: '👩🏾', name: 'Aisha T.', story: 'I listed my first pocket token on Etsy on a Thursday. By Sunday I had 6 orders. I wasn\'t even sure anyone would look.', result: '£180 first week', city: 'Manchester' },
                { avatar: '👨🏻', name: 'Tom H.',   story: 'I made a memorial portrait for a friend\'s family for free. They posted it. Three people DM\'d me asking for one. That was my launch.', result: '£420 first month', city: 'Bristol' },
                { avatar: '👩🏼', name: 'Sarah M.', story: 'One wedding sign on Instagram. The bride tagged me. The photo got 2,000 likes. I had 12 enquiries by the next morning.', result: '£1,240/month now', city: 'Birmingham' },
              ].map(s => (
                <div key={s.name} className="card-wood p-8">
                  <span className="text-4xl block mb-4">{s.avatar}</span>
                  <p className="font-serif text-fog/70 leading-relaxed mb-6 italic" style={{ fontSize: '1.05rem' }}>
                    "{s.story}"
                  </p>
                  <div className="border-t border-fog/8 pt-5 flex items-center justify-between">
                    <div>
                      <p className="font-sans text-sm text-fog/70">{s.name}</p>
                      <p className="font-sans text-[10px] text-fog/30">{s.city}</p>
                    </div>
                    <span className="font-serif text-amber">{s.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
