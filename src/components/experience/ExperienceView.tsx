'use client'

import { useRef, useState } from 'react'

import type { Messages } from '@/i18n'
import { pad } from '@/lib/media'
import type { Technology } from '@/payload-types'

import { Mask, Reveal } from '../motion/Reveal'
import { prefersReducedMotion } from '../motion/reduced-motion'
import { clamp, useScrollFrame } from '../motion/useScrollFrame'
import { TechLogo } from '../TechLogo'

type Kind = 'work' | 'edu'

export type Entry = {
  id: string
  type: Kind
  year: string
  period: string
  role: string
  org: string
  place: string
  description: string
  learned: { kind: string; title: string; text: string }[]
  stack: Technology[]
}

/** Intro with Work/Education filter and the scroll-filled timeline. */
export function ExperienceView({ entries, t }: { entries: Entry[]; t: Messages['experience'] }) {
  const kinds = (['work', 'edu'] as const).filter((k) => entries.some((e) => e.type === k))
  const [filter, setFilter] = useState<Kind>(kinds[0] ?? 'work')
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const timeline = useRef<HTMLElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const articles = useRef<(HTMLElement | null)[]>([])
  const on = hover ?? active

  useScrollFrame(({ vh }) => {
    const tl = timeline.current
    if (!tl || !fill.current) return
    const b = tl.getBoundingClientRect()
    fill.current.style.transform = `scaleY(${prefersReducedMotion() ? 1 : clamp((vh * 0.55 - b.top) / b.height)})`

    // Active station: the one crossing the middle band, else the closest to it.
    let best = -1
    let bestDist = Infinity
    articles.current.forEach((a, i) => {
      if (!a || entries[i]?.type !== filter) return
      const r = a.getBoundingClientRect()
      const d = r.top < vh * 0.55 && r.bottom > vh * 0.3 ? 0 : Math.abs(r.top - vh * 0.45)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    if (best >= 0) setActive((prev) => (prev === best ? prev : best))
  })

  return (
    <>
      <section className="px-gutter pt-[190px]">
        <div className="flex flex-wrap items-end justify-between gap-x-20 gap-y-10 pl-inset">
          <div className="flex flex-[1_1_520px] flex-col">
            <h1 className="m-0 text-h1 leading-none font-bold text-black">
              <Mask delay={80} innerClassName="-mb-[.22em] pb-[.22em]">
                {t.title}
              </Mask>
            </h1>
            <Reveal
              as="p"
              delay={200}
              className="mt-7 mb-0 max-w-[720px] text-base leading-[1.38] text-pretty text-black"
            >
              {t.intro}
            </Reveal>
          </div>
          <Reveal
            delay={320}
            className="flex max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full bg-mist p-1"
          >
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={filter === k}
                onClick={() => setFilter(k)}
                className={`flex flex-none cursor-pointer items-center gap-2 rounded-full border-0 px-[18px] py-2.5 text-sm font-medium whitespace-nowrap [transition:background-color_.35s,color_.35s] ${
                  filter === k ? 'bg-navy text-white' : 'bg-transparent text-navy'
                }`}
              >
                {t.types[k]}
                <span className="font-mono text-xs opacity-60">
                  {pad(entries.filter((e) => e.type === k).length)}
                </span>
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section ref={timeline} className="relative px-gutter pt-[90px]">
        <div className="relative pl-inset">
          <div
            aria-hidden
            className="absolute inset-y-0 left-[calc(var(--spacing-inset)+clamp(120px,22vw,320px)+19px)] w-px bg-line"
          >
            <div
              ref={fill}
              className="absolute inset-0 origin-top bg-navy"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {entries.map((e, i) => {
            const a = on === i
            return (
              <article
                key={e.id}
                ref={(el) => {
                  articles.current[i] = el
                }}
                className={`${e.type === filter ? 'grid' : 'hidden'} grid-cols-[clamp(120px,22vw,320px)_40px_minmax(0,1fr)] gap-x-[clamp(16px,2vw,32px)] pb-[clamp(72px,9vw,120px)]`}
              >
                <Reveal className="sticky top-[130px] flex flex-col gap-1.5 self-start">
                  <span
                    className={`text-[clamp(44px,5.55vw,80px)] leading-none font-medium tabular-nums transition-colors duration-500 ${
                      a ? 'text-navy' : 'text-haze'
                    }`}
                  >
                    {e.year}
                  </span>
                  <span className="text-base text-black">{e.period}</span>
                </Reveal>

                <div className="relative flex justify-center pt-[clamp(14px,1.8vw,26px)]">
                  <span
                    className={`sticky top-[150px] size-[15px] rounded-full [transition:background-color_.4s,box-shadow_.5s_var(--ease-soft)] ${
                      a
                        ? 'bg-navy shadow-[0_0_0_1px_var(--color-navy),0_0_0_10px_rgb(17_42_70/.12)]'
                        : 'bg-white shadow-[0_0_0_1px_var(--color-navy),0_0_0_0_rgb(17_42_70/.12)]'
                    }`}
                  />
                </div>

                <Reveal delay={120} className="min-w-0">
                  <div
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    className="flex flex-col gap-[22px]"
                  >
                    <div className="flex flex-col gap-2">
                      <h2 className="m-0 text-title leading-[1.2] font-medium text-balance text-black">
                        {e.role}
                      </h2>
                      <span className="text-lg text-navy">
                        {[e.org, e.place].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                    {e.description && (
                      <p className="m-0 max-w-[680px] text-base leading-[1.45] text-pretty text-black">
                        {e.description}
                      </p>
                    )}
                    <div className="flex max-w-[820px] flex-col gap-[18px] pt-2.5">
                      {e.learned.length > 0 && (
                        <>
                          <div className="flex items-center gap-3.5">
                            <span className="text-sm font-bold tracking-[.06em] text-navy uppercase">
                              {t.learned}
                            </span>
                            <span className="relative h-px flex-1 overflow-hidden bg-line">
                              <span
                                className={`absolute inset-0 origin-left bg-navy transition-transform duration-1000 ease-soft ${
                                  a ? 'scale-x-100' : 'scale-x-0'
                                }`}
                              />
                            </span>
                          </div>
                          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
                            {e.learned.map((l, j) => (
                              <div
                                key={j}
                                className={`flex flex-col gap-3.5 rounded-[20px] px-[22px] pt-5 pb-[22px] [transition:background-color_.5s,color_.5s,translate_.5s_var(--ease-soft)] hover:-translate-y-1 ${
                                  a ? 'bg-navy text-white' : 'bg-mist text-navy'
                                }`}
                                style={{ transitionDelay: `${a ? j * 90 : 0}ms` }}
                              >
                                <div className="flex items-center justify-between gap-2.5 font-mono text-xs opacity-70">
                                  <span>{t.kinds[l.kind as keyof typeof t.kinds] ?? l.kind}</span>
                                  <span>{pad(j + 1)}</span>
                                </div>
                                <span className="text-xl leading-[1.25] font-medium text-balance">
                                  {l.title}
                                </span>
                                <span className="text-[15px] leading-[1.45] text-pretty opacity-85">
                                  {l.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {e.stack.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                          <span className="mr-1 text-sm text-secondary">{t.tools}</span>
                          {e.stack.map((tech) => (
                            <TechLogo key={tech.id} tech={tech} size="sm" color="112a46" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
