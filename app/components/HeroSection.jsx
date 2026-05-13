'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HeroSection() {
  const sectionRef = useRef(null)
  const taglineRef = useRef(null)
  const subRef = useRef(null)
  const scrollHintRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const lines = taglineRef.current.querySelectorAll('.line-inner')

    // Set initial hidden state via GSAP (not inline HTML) so SSR renders visible
    gsap.set(lines, { y: '105%', opacity: 0 })
    gsap.set(subRef.current, { y: 30, opacity: 0 })
    gsap.set(lineRef.current, { scaleY: 0, opacity: 0 })
    gsap.set(scrollHintRef.current, { y: 20, opacity: 0 })

    const tl = gsap.timeline({ delay: 0.6 })

    tl.to(lines, { y: '0%', opacity: 1, duration: 1.4, ease: 'power3.out', stagger: 0.18 })
      .to(subRef.current, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.7')
      .to(lineRef.current, { scaleY: 1, opacity: 1, duration: 1.4, ease: 'power3.inOut', transformOrigin: 'top' }, '-=0.8')
      .to(scrollHintRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.4')

    // Scroll hint pulse
    gsap.to(scrollHintRef.current, {
      y: 10,
      duration: 1.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2.5,
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="section-hero"
      className="scroll-section min-h-screen flex flex-col justify-center px-8 md:px-14 pt-24"
    >
      <div className="max-w-3xl">
        {/* Eyebrow */}
        <div className="reveal-line mb-6 md:mb-8">
          <span
            className="line-inner block font-sans text-xs tracking-[0.4em] uppercase text-amber/70"
          >
            Est. 2024 · Worldwide
          </span>
        </div>

        {/* Main tagline */}
        <h1 ref={taglineRef} className="font-serif leading-none mb-8 md:mb-10">
          {['Where', 'Wood', 'Becomes', 'Memory.'].map((word, i) => (
            <span key={i} className="reveal-line block overflow-hidden">
              <span
                className="line-inner block"
                style={{
                  fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                  lineHeight: 1.05,
                  color: i === 3 ? 'var(--color-amber)' : 'var(--color-fog)',
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          className="font-sans text-sm md:text-base text-fog/40 max-w-xs leading-loose tracking-wide"
        >
          Precision-engraved objects. Each piece carries a story that outlasts its maker.
        </p>
      </div>

      {/* Vertical line + scroll hint */}
      <div className="absolute bottom-12 left-8 md:left-14 flex flex-col items-center gap-4">
        <div
          ref={lineRef}
          style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, var(--color-amber), transparent)' }}
        />
        <span
          ref={scrollHintRef}
          className="font-sans text-[10px] tracking-[0.35em] uppercase text-fog/30"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>

      {/* Right-side coordinates decoration */}
      <div className="absolute bottom-12 right-8 md:right-14 hidden md:flex flex-col items-end gap-1">
        <span className="font-sans text-[10px] tracking-[0.2em] text-fog/20">51.5074° N</span>
        <span className="font-sans text-[10px] tracking-[0.2em] text-fog/20">0.1278° W</span>
      </div>
    </section>
  )
}
