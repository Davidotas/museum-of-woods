'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function StorySection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    const texts = el.querySelectorAll('.anim-text')
    const line = el.querySelector('.wood-line')
    const label = el.querySelector('.anim-label')
    const stat = el.querySelectorAll('.anim-stat')

    gsap.fromTo(
      label,
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      }
    )

    gsap.fromTo(
      texts,
      { y: 70, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 65%', once: true },
      }
    )

    gsap.fromTo(
      stat,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2,
        scrollTrigger: { trigger: el, start: 'top 50%', once: true },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      id="section-story"
      className="scroll-section min-h-screen px-8 md:px-14 py-32 flex flex-col justify-center"
    >
      <div className="max-w-2xl ml-auto">
        <span className="anim-label font-sans text-xs tracking-[0.4em] uppercase text-amber/60 block mb-10"
          style={{ opacity: 0 }}>
          Our Story
        </span>

        <p
          className="anim-text font-serif leading-snug text-fog/90 mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', opacity: 0 }}
        >
          Wood remembers everything — the rain, the light, the years.
        </p>
        <p
          className="anim-text font-serif italic leading-snug text-amber/80 mb-12"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', opacity: 0 }}
        >
          We help you add your chapter.
        </p>

        <p
          className="anim-text font-sans text-sm text-fog/40 leading-loose max-w-sm mb-16"
          style={{ opacity: 0 }}
        >
          Every piece begins as raw timber — each ring a year, each knot a scar of survival.
          Our laser etches meaning into that history. The result isn't decoration. It's documentation.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 border-t border-fog/10 pt-12">
          {[
            { value: '2,400+', label: 'Pieces created' },
            { value: '38', label: 'Wood species' },
            { value: '100%', label: 'Handfinished' },
          ].map(({ value, label }) => (
            <div key={label} className="anim-stat" style={{ opacity: 0 }}>
              <div
                className="font-serif text-amber mb-1"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
              >
                {value}
              </div>
              <div className="font-sans text-[10px] tracking-[0.25em] uppercase text-fog/35">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
