'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { pad } from '@/lib/media'
import { cardTheme } from '@/lib/themes'

import { ArrowUpRight } from '../icons'
import { Mask } from '../motion/Reveal'
import { prefersReducedMotion } from '../motion/reduced-motion'
import { clamp, useScrollFrame } from '../motion/useScrollFrame'

export type ScrollerProject = {
  id: string
  title: string
  href: string
  stack: string
  cover: string | null
}

type Props = {
  projects: ScrollerProject[]
  intro: string
  allHref: string
  t: { projects: string; seeMore: string; scroll: string; allProjects: string }
}

/** Sticky section whose card row moves sideways while scrolling down. */
export function ProjectsScroller({ projects, intro, allHref, t }: Props) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLAnchorElement | null)[]>([])
  const nums = useRef<(HTMLSpanElement | null)[]>([])
  const sizeKey = useRef('')
  const [idx, setIdx] = useState(0)
  const n = projects.length

  useScrollFrame(({ vw, vh }) => {
    const wrap = section.current
    const row = track.current
    if (!wrap || !row) return
    const dist = Math.max(0, row.scrollWidth - vw)
    const key = `${dist}:${vh}`
    if (sizeKey.current !== key) {
      sizeKey.current = key
      wrap.style.height = `${dist + vh}px`
    }
    const p = dist ? clamp(-wrap.getBoundingClientRect().top / dist) : 0
    row.style.transform = `translate3d(${-p * dist}px,0,0)`

    if (!prefersReducedMotion())
      cards.current.forEach((c, i) => {
        if (!c) return
        const b = c.getBoundingClientRect()
        const d = clamp((b.left + b.width / 2 - vw / 2) / vw, -1.2, 1.2)
        c.style.transform = `scale(${1 - Math.abs(d) * 0.08}) rotate(${d * 3}deg) translateY(${Math.abs(d) * 30}px)`
        const num = nums.current[i]
        if (num) num.style.transform = `translateX(${d * -80}px)`
      })

    const next = Math.min(n - 1, Math.floor(p * n * 0.999))
    setIdx((prev) => (prev === next ? prev : next))
  })

  return (
    <section id="projects" ref={section} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div
          ref={track}
          className="flex w-max items-center gap-[clamp(24px,3vw,48px)] px-gutter will-change-transform"
        >
          <div className="flex w-[min(440px,84vw)] flex-none flex-col gap-5">
            <h2 className="m-0 text-h2 leading-[1.1] font-medium text-navy">
              <Mask>{t.projects}</Mask>
            </h2>
            <p className="m-0 text-base leading-[1.4] text-pretty text-black">{intro}</p>
            <Link
              href={allHref}
              className="mt-[18px] flex items-center gap-1 self-start text-base text-navy underline hover:text-secondary"
            >
              {t.seeMore}
              <ArrowUpRight />
            </Link>
            <div className="mt-10 flex items-center gap-2.5 text-base text-steel">
              <span>{t.scroll}</span>
              <svg
                width="40"
                height="12"
                viewBox="0 0 40 12"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M1 6h37M33 1l5 5-5 5" />
              </svg>
            </div>
          </div>

          {projects.map((p, i) => {
            const theme = cardTheme(i)
            return (
              <Link
                key={p.id}
                href={p.href}
                ref={(el) => {
                  cards.current[i] = el
                }}
                className={`flex w-[88vw] sm:aspect-[658/422] sm:w-[min(820px,88vw,calc((100vh-220px)*1.559))] flex-none origin-center flex-col gap-3.5 rounded-[20px] px-4 pt-[13px] pb-[18px] text-inherit no-underline will-change-transform ${theme.bg}`}
              >
                <div
                  className={`relative aspect-[3/2] flex-none overflow-hidden rounded-2xl sm:aspect-auto sm:flex-auto ${theme.img}`}
                >
                  {p.cover && (
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 88vw, 820px"
                      className="object-cover"
                    />
                  )}
                  <span
                    ref={(el) => {
                      nums.current[i] = el
                    }}
                    className={`absolute right-6 bottom-3 text-[clamp(60px,8vw,120px)] leading-[.8] font-bold will-change-transform ${theme.num}`}
                  >
                    {pad(i + 1)}
                  </span>
                </div>
                <div className={`flex items-end justify-between gap-3 ${theme.ink}`}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xl leading-none font-bold">{p.title}</span>
                    <span className="text-sm whitespace-pre">{p.stack}</span>
                  </div>
                  <ArrowUpRight size={24} />
                </div>
              </Link>
            )
          })}

          <Link
            href={allHref}
            className="flex aspect-square w-[min(320px,70vw)] flex-none items-center justify-center gap-1.5 rounded-full text-xl text-navy no-underline shadow-[inset_0_0_0_1px_var(--color-haze)] transition-colors duration-300 hover:bg-navy hover:text-white"
          >
            {t.allProjects}
            <svg
              width="20"
              height="20"
              viewBox="0 0 17 17"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9.5 3h4.5v4.5M14 3L8 9M12 10v3.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-8a.5.5 0 01.5-.5H7" />
            </svg>
          </Link>
        </div>

        <div className="mx-auto mt-14 flex w-full items-center gap-5 px-gutter">
          <span className="min-w-10 text-base text-black">
            {idx + 1} / {n}
          </span>
          <div className="flex gap-[7px]">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className={`h-1 rounded-[4px] [transition:width_.45s_var(--ease-soft),background-color_.3s] ${
                  i === idx ? 'w-[46px] bg-navy' : 'w-6 bg-haze'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
