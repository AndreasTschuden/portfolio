'use client'

import { useEffect, useState } from 'react'

import { useReveal } from '../motion/Reveal'
import { prefersReducedMotion } from '../motion/reduced-motion'

/** "+N" that counts up (1400 ms, ease-out cubic) once it is revealed. */
export function CountUp({
  value,
  delay = 0,
  className,
}: {
  value: number
  delay?: number
  className?: string
}) {
  const [ref, revealed] = useReveal<HTMLSpanElement>()
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (!revealed || prefersReducedMotion()) return
    setShown(0)
    let raf = 0
    const timer = setTimeout(() => {
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1400)
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay + 200)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [revealed, value, delay])

  return (
    <span ref={ref} className={className}>
      +{shown}
    </span>
  )
}
