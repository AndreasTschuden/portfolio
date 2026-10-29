'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { ArrowDown } from '../icons'
import { Mask, Reveal } from '../motion/Reveal'
import { prefersReducedMotion } from '../motion/reduced-motion'
import { onRevealsReady } from '../motion/reveal-observer'
import { clamp, useScrollFrame } from '../motion/useScrollFrame'
import { CountUp } from './CountUp'

type Props = {
  role: string
  year: number
  stats: { value: number; label: string }[]
  hello: string
  /** Text wrapped in **…** is rendered bold */
  intro: string
  scrollDown: string
  /** home.hero.portrait from Payload; without it the hero has no image */
  portrait: { src: string; alt: string } | null
}

export function Hero({ role, year, stats, hello, intro, scrollDown, portrait }: Props) {
  const left = useRef<HTMLDivElement>(null)
  const helloRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const arrow = useRef<HTMLSpanElement>(null)
  const reduce = useRef(false)
  const t0 = useRef(0)
  const [railIn, setRailIn] = useState(false)

  useEffect(() => {
    reduce.current = prefersReducedMotion()
    t0.current = performance.now()
    return onRevealsReady(() => setRailIn(true))
  }, [])

  useScrollFrame(({ y, vh, now }) => {
    if (reduce.current) return
    if (portraitRef.current)
      portraitRef.current.style.transform = `translate3d(0,${y * 0.16}px,0) scale(${1 + Math.min(y, 1200) * 0.00012})`
    if (helloRef.current) helloRef.current.style.transform = `translate3d(${-y * 0.22}px,0,0)`
    if (left.current) left.current.style.opacity = String(clamp(1 - y / (vh * 1.1)))
    if (arrow.current)
      arrow.current.style.transform = `translateY(${Math.sin((now - t0.current) / 300) * 3}px)`
  })

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-wrap items-stretch pt-[73px] pl-gutter"
    >
      <div className="absolute top-[150px] bottom-12 left-gutter flex w-3.5 flex-col items-center gap-6">
        <Reveal
          as="span"
          delay={200}
          className="rotate-180 text-base whitespace-nowrap text-steel [writing-mode:vertical-rl]"
        >
          {role}
        </Reveal>
        <div
          className={`w-px flex-auto origin-top bg-steel transition-transform delay-300 duration-1600 ease-rail ${
            railIn ? 'scale-y-100' : 'scale-y-0'
          }`}
        />
        <Reveal
          as="span"
          delay={900}
          className="rotate-180 text-base text-steel [writing-mode:vertical-rl]"
        >
          {year}
        </Reveal>
      </div>

      <div
        ref={left}
        className="relative z-[2] flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-[clamp(32px,6vh,80px)] pt-[clamp(40px,8vh,110px)] pl-[clamp(56px,7.8vw,112px)] lg:pb-12"
      >
        <div className="flex gap-[clamp(40px,5vw,72px)]">
          {stats.map((s, i) => (
            <Reveal key={i} delay={500 + i * 150} className="flex flex-col gap-0.5">
              <CountUp
                value={s.value}
                delay={500 + i * 150}
                className="text-5xl leading-none font-medium text-black"
              />
              <span className="text-base text-black">{s.label}</span>
            </Reveal>
          ))}
        </div>
        <div>
          <div ref={helloRef} className="will-change-transform">
            <h1
              aria-label={hello}
              className="m-0 -ml-[0.04em] flex text-hello leading-[.86] font-normal tracking-[-0.02em] whitespace-nowrap text-navy"
            >
              {[...hello].map((char, i) => (
                <Mask key={i} delay={100 + i * 70} className="inline-block">
                  <span aria-hidden>{char}</span>
                </Mask>
              ))}
            </h1>
          </div>
          <Reveal as="p" delay={700} className="mt-[18px] mb-0 text-xl text-pretty text-black">
            {intro.split('**').map((part, i) =>
              i % 2 ? (
                <strong key={i} className="font-medium">
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </Reveal>
        </div>
        <Reveal delay={1000} className="self-start">
          <a href="#about" className="flex items-center gap-1 text-base text-black no-underline">
            {scrollDown}
            <span ref={arrow} className="flex">
              <ArrowDown />
            </span>
          </a>
        </Reveal>
      </div>

      {portrait && (
        <div className="relative mt-12 ml-[clamp(56px,7.8vw,112px)] aspect-[862/950] min-w-0 flex-[1_1_100%] self-end overflow-hidden lg:mt-0 lg:ml-auto lg:h-[calc(100svh-73px)] lg:min-h-[520px] lg:max-w-[60vw] lg:flex-[0_1_auto]">
          <Reveal type="scale" delay={150} className="absolute inset-0">
            <div
              ref={portraitRef}
              className="absolute top-0 -left-[0.4%] h-[110%] w-[106.4%] origin-top will-change-transform"
            >
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(max-width: 1024px) 85vw, 60vw"
                className="object-cover object-left-top"
              />
            </div>
          </Reveal>
        </div>
      )}
    </section>
  )
}
