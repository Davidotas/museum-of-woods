'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const follower = followerRef.current
    if (!dot || !follower) return

    let mouseX = 0
    let mouseY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1 })
      gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.45, ease: 'power2.out' })
    }

    const onEnterLink = () => {
      gsap.to(dot, { scale: 3, duration: 0.3 })
      gsap.to(follower, { scale: 1.6, opacity: 0, duration: 0.3 })
    }

    const onLeaveLink = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 })
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
