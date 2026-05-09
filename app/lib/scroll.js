'use client'

import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis = null

export function initLenis() {
  gsap.registerPlugin(ScrollTrigger)

  lenis = new Lenis({
    lerp: 0.08,
    smooth: true,
    smoothTouch: false,
    syncTouch: false,
  })

  // Sync Lenis with GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Sync Lenis scroll position with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  return lenis
}

export function destroyLenis() {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}

export function getLenis() {
  return lenis
}
