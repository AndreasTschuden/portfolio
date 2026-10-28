'use client'

import { useRef } from 'react'

import { useScrollFrame } from '../motion/useScrollFrame'

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useScrollFrame(({ y, maxScroll }) => {
    if (ref.current) ref.current.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`
  })

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-navy"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}
