'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { pad } from '@/lib/media'

import { Reveal } from '../motion/Reveal'

/** Problem / Solution / Outcome. Hover, keyboard focus or click opens a card; click/tap pins it. */
export function CaseCards({ cases }: { cases: { title: string; text: string }[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const active = hover ?? pinned
  // Open cards grow to fit their text: measured text height + its top offset + room for the title.
  const texts = useRef<(HTMLParagraphElement | null)[]>([])
  const [textHeights, setTextHeights] = useState<number[]>([])

  useEffect(() => {
    const measure = () => setTextHeights(texts.current.map((p) => p?.offsetHeight ?? 0))
    const observer = new ResizeObserver(measure)
    texts.current.forEach((p) => p && observer.observe(p))
    return () => observer.disconnect()
  }, [cases.length])

  return (
    <div className="mt-[65px] flex flex-wrap items-start gap-x-5 gap-y-4">
      {cases.map((c, k) => {
        const on = active === k
        const dim = active !== null && !on
        const textHeight = textHeights[k] ?? 0
        const heights = {
          '--open': `${Math.max(290, 76 + textHeight + 72)}px`,
          '--open-md': `${Math.max(197, 28 + textHeight + 80)}px`,
        } as CSSProperties
        return (
          <div
            key={k}
            className={`min-w-[min(100%,280px)] [transition:flex_.7s_var(--ease-wipe)] ${on ? 'flex-[1.9_1_0%]' : 'flex-[1_1_0%]'} ${k > 0 ? 'mt-1' : ''}`}
          >
            <Reveal delay={k * 120}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={on}
                // Touch taps only toggle the pin, otherwise the emulated hover/focus keeps the card open.
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(k)}
                onPointerLeave={() => setHover(null)}
                onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHover(k)}
                onBlur={() => setHover(null)}
                onClick={() => setPinned((p) => (p === k ? null : k))}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  setPinned((p) => (p === k ? null : k))
                }}
                style={heights}
                className={`relative cursor-pointer overflow-hidden rounded-[20px] outline-none [transition:height_.7s_var(--ease-wipe),background-color_.45s] focus-visible:shadow-[0_0_0_2px_var(--color-secondary)] ${
                  on ? 'h-(--open) bg-navy md:h-(--open-md)' : 'h-[120px] bg-mist md:h-[197px]'
                }`}
              >
                <div
                  className={`absolute -top-1 -right-1 flex size-20 items-center justify-center [transition:rotate_.6s_var(--ease-soft),color_.4s] ${
                    on ? 'rotate-45 text-white' : 'text-steel'
                  }`}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M1 33L33 1M6 1h27v27" />
                  </svg>
                </div>
                <p
                  ref={(el) => {
                    texts.current[k] = el
                  }}
                  className={`absolute top-[76px] right-[27px] left-[27px] md:top-7 md:right-[110px] m-0 max-w-[420px] text-base leading-[1.45] text-pretty text-white [transition:opacity_.45s_var(--ease-soft),translate_.6s_var(--ease-soft)] ${
                    on ? 'translate-y-0 opacity-100 delay-280' : 'translate-y-4 opacity-0 delay-0'
                  }`}
                >
                  {c.text}
                </p>
                <span
                  className={`absolute bottom-4 left-[27px] text-[34px] md:text-[43px] leading-none font-normal whitespace-nowrap transition-colors duration-450 ${
                    on ? 'text-white' : 'text-navy'
                  }`}
                >
                  {c.title}
                </span>
                <span
                  aria-hidden
                  className={`absolute bottom-0 text-[72px] md:text-[100px] leading-none font-normal whitespace-nowrap [transition:translate_.7s_var(--ease-soft),color_.45s] ${
                    k === 0 ? 'right-[19px]' : 'right-3'
                  } ${on ? 'translate-y-[8%] text-secondary' : dim ? 'translate-y-[52%] text-haze' : 'translate-y-[35%] text-haze'}`}
                >
                  {pad(k + 1)}
                </span>
              </div>
            </Reveal>
          </div>
        )
      })}
    </div>
  )
}
