'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function revealText(elements, trigger) {
  gsap.fromTo(
    elements,
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: trigger,
        start: 'top 78%',
        once: true,
      },
    }
  )
}

export function revealLines(lines) {
  lines.forEach((line) => {
    const inner = line.querySelector('span')
    if (!inner) return
    gsap.fromTo(
      inner,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 82%',
          once: true,
        },
      }
    )
  })
}

export function fadeUp(el, delay = 0) {
  gsap.fromTo(
    el,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay,
      ease: 'power3.out',
    }
  )
}

export function magneticEffect(el) {
  const strength = 40

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    gsap.to(el, {
      x: dx * strength,
      y: dy * strength,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}
