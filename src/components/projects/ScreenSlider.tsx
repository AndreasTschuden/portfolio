'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

import { Mask, Reveal } from '../motion/Reveal'
import { LaptopFrame } from './LaptopFrame'
import { prefersReducedMotion } from '../motion/reduced-motion'
import { clamp, useScrollFrame } from '../motion/useScrollFrame'

export type Screen = { desktop: string; mobile: string | null; label: string }

type Props = {
  screens: Screen[]
  t: { look: string; prev: string; next: string; desktopAlt: string; mobileAlt: string }
}

/** "A look inside": laptop (+ phone if there is a mobile screen) per screen, arrows / swipe / ←→ keys. */
export function ScreenSlider({ screens, t }: Props) {
  const [slide, setSlide] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const laptops = useRef<(HTMLDivElement | null)[]>([])
  const phones = useRef<(HTMLDivElement | null)[]>([])
  const startX = useRef<number | null>(null)
  const n = screens.length
  const go = (i: number) => setSlide(Math.max(0, Math.min(n - 1, i)))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = stage.current
      if (!el || /INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '')) return
      const b = el.getBoundingClientRect()
      if (b.bottom < 0 || b.top > window.innerHeight) return
      if (e.key === 'ArrowRight') setSlide((s) => Math.min(n - 1, s + 1))
      if (e.key === 'ArrowLeft') setSlide((s) => Math.max(0, s - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  // Mockups rise into place as the stage scrolls into view; the phone also drifts with scroll.
  useScrollFrame(({ vh }) => {
    const el = stage.current
    if (!el) return
    const motion = !prefersReducedMotion()
    const b = el.getBoundingClientRect()
    const e = 1 - Math.pow(1 - clamp((vh - b.top) / (vh * 0.9)), 3)
    const d = (b.top + b.height / 2 - vh / 2) / vh
    laptops.current.forEach((l) => {
      if (!l) return
      l.style.transform = motion
        ? `translate3d(0,${(1 - e) * 120}px,0) scale(${0.9 + e * 0.1})`
        : 'none'
      l.style.opacity = motion ? String(clamp(e * 1.4)) : '1'
    })
    phones.current.forEach((p) => {
      if (!p) return
      p.style.transform = motion
        ? `translate3d(${(1 - e) * 80}px,${d * 70}px,0) rotate(${(1 - e) * 6}deg)`
        : 'none'
      p.style.opacity = motion ? String(clamp(e * 1.4 - 0.2)) : '1'
    })
  })

  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) go(slide + (dx < 0 ? 1 : -1))
  }

  const arrowButton =
    'flex size-14 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-black shadow-[inset_0_0_0_1px_rgb(0_0_0)] [transition:box-shadow_.3s,color_.3s,background-color_.3s] enabled:hover:bg-mist sm:size-[75px] disabled:cursor-default disabled:text-haze disabled:shadow-[inset_0_0_0_1px_var(--color-haze)]'

  return (
    <section className="px-gutter pt-20 md:pt-[75px]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
        <h2 className="m-0 text-[clamp(40px,4.17vw,60px)] leading-[1.35] font-medium whitespace-nowrap text-black">
          <Mask>{t.look}</Mask>
        </h2>
        <Reveal delay={150} className="ml-auto flex items-center gap-3 sm:gap-[25px]">
          <span
            className="min-w-[53px] text-right text-base text-black tabular-nums"
            aria-live="polite"
          >
            {slide + 1} / {n}
          </span>
          <button
            type="button"
            onClick={() => go(slide - 1)}
            aria-label={t.prev}
            disabled={slide === 0}
            className={arrowButton}
          >
            <svg
              className="size-8 sm:size-10"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M25 10L15 20l10 10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(slide + 1)}
            aria-label={t.next}
            disabled={slide === n - 1}
            className={arrowButton}
          >
            <svg
              className="size-8 sm:size-10"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 10l10 10-10 10" />
            </svg>
          </button>
        </Reveal>
      </div>

      <div
        ref={stage}
        onPointerDown={(e) => {
          startX.current = e.clientX
        }}
        onPointerUp={onPointerUp}
        className="relative mt-[22px] aspect-[390/330] touch-pan-y md:aspect-[1298/603]"
      >
        {screens.map((s, k) => {
          const d = k - slide
          const label = s.label ? ` – ${s.label}` : ''
          return (
            <div
              key={k}
              aria-hidden={d !== 0}
              className={`absolute inset-0 ${d === 0 ? '' : 'pointer-events-none'}`}
            >
              <div
                ref={(el) => {
                  laptops.current[k] = el
                }}
                className={`absolute h-[67.5%] w-[88%] md:top-0 md:h-full md:w-[71.57%] ${
                  s.mobile
                    ? 'top-0 -left-[2%] md:-left-[2.7%]'
                    : 'top-[16.25%] left-[6%] md:left-[14.2%]'
                }`}
              >
                <div
                  className={`absolute inset-0 [transition:opacity_.6s_var(--ease-wipe),translate_.8s_var(--ease-wipe)] ${
                    d === 0
                      ? 'opacity-100'
                      : d < 0
                        ? '-translate-x-[8%] opacity-0'
                        : 'translate-x-[8%] opacity-0'
                  }`}
                >
                  <LaptopFrame
                    src={s.desktop}
                    alt={t.desktopAlt + label}
                    sizes="(max-width: 768px) 88vw, 65vw"
                  />
                </div>
              </div>
              {s.mobile && (
                <div
                  ref={(el) => {
                    phones.current[k] = el
                  }}
                  className="absolute top-[25%] left-[67%] h-[75%] w-[31.3%] md:top-[2.65%] md:left-[78.5%] md:h-[94.86%] md:w-[21.73%]"
                >
                  <div
                    className={`absolute inset-0 [transition:opacity_.6s_var(--ease-wipe),translate_.8s_var(--ease-wipe)] ${
                      d === 0
                        ? 'opacity-100 delay-80'
                        : d < 0
                          ? '-translate-x-[30%] opacity-0'
                          : 'translate-x-[30%] opacity-0'
                    }`}
                  >
                    <div className="absolute inset-x-[2%] inset-y-[1%] rounded-[16%/8%] bg-device p-[5%] shadow-[inset_0_0_0_1.5px_var(--color-bezel),0_40px_60px_-30px_rgb(17_42_70/.45)]">
                      <div className="relative size-full overflow-hidden rounded-[12%/6%] bg-mist">
                        <Image
                          src={s.mobile}
                          alt={t.mobileAlt + label}
                          fill
                          sizes="(max-width: 768px) 32vw, 20vw"
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute top-[2.4%] left-1/2 h-[3.4%] w-[32%] -translate-x-1/2 rounded-full bg-device" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
