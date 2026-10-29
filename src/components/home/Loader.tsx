'use client'

import { useEffect, useState } from 'react'

import { Logo } from '../icons'
import { prefersReducedMotion } from '../motion/reduced-motion'
import { holdReveals, releaseReveals } from '../motion/reveal-observer'

// The intro only plays on the first page load, not when navigating back to home.
let played = false

type Phase = 'idle' | 'logo' | 'name' | 'out' | 'wipe' | 'done'

export function Loader({ name }: { name: string }) {
  const [phase, setPhase] = useState<Phase>(() => (played ? 'done' : 'idle'))

  useEffect(() => {
    if (played || prefersReducedMotion()) {
      played = true
      setPhase('done')
      return
    }
    holdReveals()
    const html = document.documentElement
    html.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        setPhase('logo')
        at(120, () => setPhase('name'))
        at(700, () => setPhase('out'))
        at(800, () => setPhase('wipe'))
        at(1000, () => {
          html.style.overflow = ''
          releaseReveals()
        })
        at(1500, () => {
          played = true
          setPhase('done')
        })
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      html.style.overflow = ''
      releaseReveals()
    }
  }, [])

  if (phase === 'done') return null

  const step = ['idle', 'logo', 'name', 'out', 'wipe'].indexOf(phase)

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-7 bg-navy text-white transition-[clip-path] duration-650 ease-swift motion-reduce:hidden animate-loader-failsafe ${
        step >= 4 ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
      }`}
    >
      <div
        className={`flex flex-col items-center gap-[26px] [transition:translate_.45s_var(--ease-swift),opacity_.3s] ${
          step >= 3 ? '-translate-y-10 opacity-0' : ''
        }`}
      >
        <div
          className={`[transition:opacity_.4s_var(--ease-soft),translate_.55s_var(--ease-soft),scale_.55s_var(--ease-soft)] ${
            step >= 1 ? 'opacity-100' : 'translate-y-6 scale-[.7] opacity-0'
          }`}
        >
          <Logo width={80} height={70} />
        </div>
        <div className="-my-[.25em] overflow-hidden py-[.25em] text-[clamp(28px,4vw,48px)] leading-[1.1]">
          <div
            className={`font-medium tracking-[-0.01em] whitespace-nowrap transition-transform duration-550 ease-soft ${
              step >= 2 ? 'translate-y-0' : 'translate-y-[calc(110%+.5em)]'
            }`}
          >
            {name}
          </div>
        </div>
      </div>
    </div>
  )
}
