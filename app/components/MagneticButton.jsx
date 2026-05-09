'use client'

import { useEffect, useRef } from 'react'
import { magneticEffect } from '../lib/animations'

export default function MagneticButton({ children, className = '', onClick, href }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const cleanup = magneticEffect(ref.current)
    return cleanup
  }, [])

  const base =
    'relative inline-flex items-center justify-center overflow-hidden group ' + className

  if (href) {
    return (
      <a ref={ref} href={href} className={base}>
        {children}
      </a>
    )
  }

  return (
    <button ref={ref} onClick={onClick} className={base}>
      {children}
    </button>
  )
}
