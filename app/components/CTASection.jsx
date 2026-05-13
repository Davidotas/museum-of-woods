'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { magneticEffect } from '../lib/animations'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef(null)
  const btnPrimaryRef = useRef(null)
  const btnSecondaryRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    const texts = el.querySelectorAll('.anim-text')

    gsap.fromTo(texts, { y: 70, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', stagger: 0.18,
      scrollTrigger: { trigger: el, start: 'top 65%', once: true },
    })

    if (btnPrimaryRef.current) magneticEffect(btnPrimaryRef.current)
    if (btnSecondaryRef.current) magneticEffect(btnSecondaryRef.current)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="section-cta"
      className="scroll-section min-h-screen px-8 md:px-14 py-32 flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      {/* Background texture lines */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${(i / 12) * 100}%`,
              width: 1,
              background: 'linear-gradient(to bottom, transparent, rgba(201,162,126,0.04), transparent)',
            }}
          />
        ))}
      </div>

      <span className="anim-text font-sans text-xs tracking-[0.4em] uppercase text-amber/60 block mb-10" style={{ opacity: 0 }}>
        Commission a Piece
      </span>

      <h2
        className="anim-text font-serif text-fog/95 mb-8 max-w-2xl"
        style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 1.05, opacity: 0 }}
      >
        What do you want to remember?
      </h2>

      <p
        className="anim-text font-sans text-sm text-fog/35 leading-loose mb-16 max-w-xs"
        style={{ opacity: 0 }}
      >
        Each piece takes 2–4 weeks. We'll guide the whole process. No design skills needed.
      </p>

      <div className="anim-text flex flex-col sm:flex-row items-center gap-5" style={{ opacity: 0 }}>
        <button
          ref={btnPrimaryRef}
          className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.25em] uppercase bg-amber text-forest px-10 py-4 hover:bg-grain transition-colors duration-500"
        >
          Start your piece
          <span className="text-base">→</span>
        </button>

        <button
          ref={btnSecondaryRef}
          className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.25em] uppercase border border-fog/20 text-fog/50 px-10 py-4 hover:border-amber hover:text-amber transition-all duration-500"
        >
          View the archive
        </button>
      </div>

      {/* Bottom footer strip */}
      <div className="absolute bottom-10 left-8 md:left-14 right-8 md:right-14 flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-[0.25em] text-fog/20 uppercase">
          Museum of Woods · Global
        </span>
        <span className="font-sans text-[10px] tracking-[0.25em] text-fog/20">
          © 2024
        </span>
      </div>
    </section>
  )
}
