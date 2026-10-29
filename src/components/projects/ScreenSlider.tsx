'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

import type { MediaImage } from '@/lib/media'

import { Mask, Reveal } from '../motion/Reveal'
import { LaptopFrame } from './LaptopFrame'
import { prefersReducedMotion } from '../motion/reduced-motion'
import { clamp, useScrollFrame } from '../motion/useScrollFrame'

export type Screen = { desktop: MediaImage; mobile: MediaImage | null; label: string }

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
        className="mt-[22px] grid touch-pan-y"
      >
        {/* Slides share one grid cell, so the stage is as tall as the tallest slide. */}
        {screens.map((s, k) => {
          const d = k - slide
          const label = s.label ? ` – ${s.label}` : ''
          return (
            <div
              key={k}
              aria-hidden={d !== 0}
              className={`flex flex-col [grid-area:1/1] md:flex-row md:items-start ${d === 0 ? '' : 'pointer-events-none'}`}
            >
              <div
                ref={(el) => {
                  laptops.current[k] = el
                }}
                className={`w-[88%] flex-none md:w-[71.57%] ${
                  s.mobile ? '-ml-[2%] md:-ml-[2.7%]' : 'mx-auto'
                }`}
              >
                <div
                  className={`[transition:opacity_.6s_var(--ease-wipe),translate_.8s_var(--ease-wipe)] ${
                    d === 0
                      ? 'opacity-100'
                      : d < 0
                        ? '-translate-x-[8%] opacity-0'
                        : 'translate-x-[8%] opacity-0'
                  }`}
                >
                  <LaptopFrame
                    image={s.desktop}
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
                  className="relative -mt-[36%] mr-[1.7%] w-[31.3%] flex-none self-end md:mt-[1.2%] md:mr-0 md:ml-auto md:w-[21.73%] md:self-start"
                >
                  <div
                    className={`[transition:opacity_.6s_var(--ease-wipe),translate_.8s_var(--ease-wipe)] ${
                      d === 0
                        ? 'opacity-100 delay-80'
                        : d < 0
                          ? '-translate-x-[30%] opacity-0'
                          : 'translate-x-[30%] opacity-0'
                    }`}
                  >
                    <div className="mx-[2%] my-[1%] rounded-[16%/8%] bg-device p-[5%] shadow-[inset_0_0_0_1.5px_var(--color-bezel),0_40px_60px_-30px_rgb(17_42_70/.45)]">
                      <div
                        className="relative overflow-hidden rounded-[12%/6%] bg-mist"
                        style={{ aspectRatio: s.mobile.ratio ?? 9 / 19.5 }}
                      >
                        <Image
                          src={s.mobile.src}
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
