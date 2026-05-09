'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: '◎',
    title: 'Sound → Wood',
    desc: 'Upload any audio — a laugh, a voice note, a song. We render it as engraved waveform art.',
  },
  {
    icon: '◈',
    title: 'Story-First Design',
    desc: 'Tell us the occasion. Our design engine suggests the perfect piece, material, and phrase.',
  },
  {
    icon: '◆',
    title: 'Living Pieces',
    desc: 'Hidden messages revealed only under candlelight. Sunlight-reactive grain patterns. Wood that surprises.',
  },
  {
    icon: '◇',
    title: 'Culture-Led Craft',
    desc: 'African patterns, UK street typographies, heritage scripts. Identity beyond initials.',
  },
  {
    icon: '▣',
    title: 'Business Blueprint',
    desc: 'Start selling engraved products. We give you the product, pricing, packaging, and a platform.',
  },
  {
    icon: '◉',
    title: 'The Reveal',
    desc: 'Slide-panel and double-layer engravings. A gift that hides its best part until the right moment.',
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    const items = el.querySelectorAll('.feature-item')
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
    gsap.fromTo(items, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 55%', once: true },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="section-features"
      className="scroll-section min-h-screen px-8 md:px-14 py-32 flex flex-col justify-center"
    >
      <span className="anim-label font-sans text-xs tracking-[0.4em] uppercase text-amber/60 block mb-10" style={{ opacity: 0 }}>
        Experience
      </span>

      <h2
        className="anim-heading font-serif text-fog/90 mb-20 max-w-lg"
        style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.1, opacity: 0 }}
      >
        Beyond the ordinary gift.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="feature-item group" style={{ opacity: 0 }}>
            <div className="text-amber/60 text-2xl mb-5 group-hover:text-amber transition-colors duration-500">
              {icon}
            </div>
            <h3 className="font-serif text-fog/85 mb-3" style={{ fontSize: '1.3rem' }}>
              {title}
            </h3>
            <p className="font-sans text-xs text-fog/35 leading-loose">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
