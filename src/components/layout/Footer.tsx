'use client'

import { useRef } from 'react'

import { clamp, useScrollFrame } from '../motion/useScrollFrame'
import { prefersReducedMotion } from '../motion/reduced-motion'

/** Big name whose letters rise one after another once the footer scrolls into view. */
export function Footer({ name }: { name: string }) {
  const footer = useRef<HTMLElement>(null)
  const letters = useRef<(HTMLSpanElement | null)[]>([])

  useScrollFrame(({ vh }) => {
    const el = footer.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = prefersReducedMotion() ? 1 : clamp((vh - r.top) / (r.height * 0.95))
    letters.current.forEach((c, i) => {
      if (!c) return
      const lp = clamp(p * 1.7 - i * 0.045)
      c.style.transform = `translateY(${Math.pow(1 - lp, 3) * 105}%)`
    })
  })

  return (
    <footer ref={footer} className="overflow-hidden px-gutter pt-24 md:pt-[150px]">
      <div
        aria-label={name}
        className="flex h-[.6em] justify-center overflow-hidden text-footer leading-none font-bold tracking-[-0.01em] whitespace-nowrap text-navy"
      >
        {[...name].map((char, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              letters.current[i] = el
            }}
            className={`inline-block ${char === ' ' ? 'w-[.28em]' : ''}`}
            style={{ transform: 'translateY(105%)' }}
          >
            {char === ' ' ? '' : char}
          </span>
        ))}
      </div>
    </footer>
  )
}
