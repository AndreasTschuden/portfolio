'use client'

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { prefersReducedMotion } from './reduced-motion'
import { observeReveal } from './reveal-observer'

/** True once `ref` scrolled into view (always true with prefers-reduced-motion). */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setRevealed(true)
      return
    }
    return observeReveal(el, () => setRevealed(true))
  }, [])

  return [ref, revealed] as const
}

const TRANSITION =
  'motion-safe:[transition:opacity_.9s_var(--ease-soft),translate_1.1s_var(--ease-soft),scale_1.1s_var(--ease-soft),rotate_1.1s_var(--ease-soft),clip-path_1.2s_var(--ease-wipe)]'

const states = {
  up: ['opacity-0 translate-y-10', 'opacity-100'],
  scale: ['opacity-0 scale-[1.08] origin-[50%_30%]', 'opacity-100 origin-[50%_30%]'],
  pop: ['opacity-0 scale-[.4] -rotate-45', 'opacity-100'],
  wipe: ['[clip-path:inset(0_100%_0_0)]', '[clip-path:inset(0_0_0_0)]'],
} as const

type Tag = 'div' | 'span' | 'p' | 'article' | 'li'

type RevealProps = {
  type?: keyof typeof states
  /** ms */
  delay?: number
  as?: Tag
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Fades/moves its content in when it scrolls into view (data-reveal in the prototypes). */
export function Reveal({
  type = 'up',
  delay = 0,
  as = 'div',
  className = '',
  style,
  children,
}: RevealProps) {
  const [ref, revealed] = useReveal<HTMLElement>()
  const [hidden, shown] = states[type]

  return createElement(
    as,
    {
      ref,
      className: `${TRANSITION} ${revealed ? shown : hidden} ${className}`,
      style: { transitionDelay: `${delay}ms`, ...style },
    },
    children,
  )
}

type MaskProps = {
  delay?: number
  /** Classes for the clipping wrapper (display defaults to block). */
  className?: string
  /** Classes for the moving inner span. */
  innerClassName?: string
  children: ReactNode
}

/** Text slides up out of an overflow-hidden wrapper (data-reveal="mask"). */
export function Mask({ delay = 0, className = 'block', innerClassName = '', children }: MaskProps) {
  const [ref, revealed] = useReveal<HTMLSpanElement>()

  return (
    <span ref={ref} className={`overflow-hidden ${className}`}>
      <span
        className={`inline-block ${TRANSITION} ${revealed ? 'translate-y-0' : 'translate-y-[115%]'} ${innerClassName}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  )
}
