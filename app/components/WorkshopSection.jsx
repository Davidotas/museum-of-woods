'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    title: 'The Archive',
    desc: 'A personal ledger etched in oak. Every name, date, and milestone — rendered permanent.',
    material: 'English White Oak',
    num: '01',
  },
  {
    title: 'The Signal',
    desc: 'Upload a voice note. We convert it into waveform art, engraved on walnut.',
    material: 'American Black Walnut',
    num: '02',
  },
  {
    title: 'The Heirloom',
    desc: 'A piece designed to be passed down. Made to outlive you by centuries.',
    material: 'Reclaimed Teak',
    num: '03',
  },
]

export default function WorkshopSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    const cards = el.querySelectorAll('.product-card')
    const label = el.querySelector('.anim-label')
    const heading = el.querySelector('.anim-heading')

    gsap.fromTo(label, { y: 20, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 72%', once: true },
    })
    gsap.fromTo(heading, { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 68%', once: true },
    })
    gsap.fromTo(cards, { y: 80, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', stagger: 0.2,
      scrollTrigger: { trigger: el, start: 'top 55%', once: true },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="section-workshop"
      className="scroll-section min-h-screen px-8 md:px-14 py-32 flex flex-col justify-center"
    >
      <span className="anim-label font-sans text-xs tracking-[0.4em] uppercase text-amber/60 block mb-10" style={{ opacity: 0 }}>
        Workshop
      </span>

      <h2
        className="anim-heading font-serif text-fog/90 mb-20 max-w-xl"
        style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', lineHeight: 1.08, opacity: 0 }}
      >
        Objects built to last longer than trends.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-fog/5">
        {products.map(({ title, desc, material, num }) => (
          <div
            key={num}
            className="product-card bg-forest p-8 md:p-10 group hover:bg-bark/60 transition-colors duration-700"
            style={{ opacity: 0 }}
          >
            <span className="font-sans text-[10px] tracking-[0.3em] text-fog/20 block mb-8">{num}</span>

            <h3
              className="font-serif text-fog/90 mb-4 group-hover:text-amber transition-colors duration-500"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              {title}
            </h3>

            <p className="font-sans text-xs text-fog/35 leading-loose mb-8 max-w-xs">{desc}</p>

            <div className="border-t border-fog/10 pt-6 flex items-center justify-between">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-amber/50">{material}</span>
              <span className="text-amber/40 group-hover:text-amber transition-colors duration-500 text-lg">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
