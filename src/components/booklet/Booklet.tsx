'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import type { Messages } from '@/i18n'

import { ArrowBack } from '../icons'

// A5 at 96 dpi, the size the pages are laid out in
const PAGE_W = (148 * 96) / 25.4
const PAGE_H = (210 * 96) / 25.4
/** Below this scale two pages get too small to read, so the viewer shows one page at a time. */
const MIN_SPREAD_SCALE = 0.55

type Props = {
  pages: ReactNode[]
  t: Messages['booklet']
}

/**
 * Booklet with turning pages. Wide screens show spreads (cover alone on the right, back cover
 * alone on the left); narrow screens show single pages that turn away.
 */
export function Booklet({ pages, t }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [spread, setSpread] = useState(true)
  // First visible page, in single-page terms. Spreads show pages (2k-1, 2k).
  const [page, setPage] = useState(0)
  const [moving, setMoving] = useState<number | null>(null)
  const count = pages.length

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      const two = Math.min(width / (2 * PAGE_W), height / PAGE_H) >= MIN_SPREAD_SCALE
      setSpread(two)
      setMoving(null)
      setScale(Math.min(width / ((two ? 2 : 1) * PAGE_W), height / PAGE_H, 1.3))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Spread mode: leaf k carries page 2k on its front and 2k+1 on its back.
  const leaves = spread ? Math.ceil(count / 2) : count
  const turned = spread ? Math.floor((page + 1) / 2) : page
  const maxTurned = spread ? leaves : count - 1

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = Math.min(maxTurned, Math.max(0, turned + dir))
      if (next === turned) return
      setMoving(dir === 1 ? turned : next)
      setPage(spread ? Math.max(0, Math.min(count - 1, 2 * next - 1)) : next)
    },
    [count, maxTurned, spread, turned],
  )

  const jump = useCallback((to: number) => {
    setMoving(null)
    setPage(to)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1)
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1)
      else if (e.key === 'Home') jump(0)
      else if (e.key === 'End') jump(count - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, go, jump])

  // Swipe on touch, click on the left / right half everywhere else
  const swipe = useRef<{ x: number; y: number; done: boolean } | null>(null)
  const book = useRef<HTMLDivElement>(null)

  const onClick = (e: React.MouseEvent) => {
    if (swipe.current?.done) return
    if ((e.target as HTMLElement).closest('a')) return
    const rect = book.current?.getBoundingClientRect()
    if (!rect) return
    // Spreads: the visible half decides. At the covers only one page shows.
    const mid = spread
      ? turned === 0
        ? rect.left + rect.width * 0.5 + rect.width * 0.25
        : turned === leaves
          ? rect.left + rect.width * 0.25
          : rect.left + rect.width / 2
      : rect.left + rect.width * 0.3
    go(e.clientX >= mid ? 1 : -1)
  }

  const visible = spread ? [2 * turned - 1, 2 * turned].filter((p) => p >= 0 && p < count) : [page]
  const status = visible.map((p) => p + 1).join('–')

  const bookW = (spread ? 2 : 1) * PAGE_W
  // Center the closed book: shift by half a page while only the cover or back shows.
  const shift = spread ? (turned === 0 ? -PAGE_W / 2 : turned === leaves ? PAGE_W / 2 : 0) : 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={stage}
        className="flex min-h-0 flex-1 touch-pan-y items-center justify-center select-none"
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY, done: false }
        }}
        onPointerUp={(e) => {
          const s = swipe.current
          if (!s) return
          const dx = e.clientX - s.x
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
            s.done = true
            go(dx < 0 ? 1 : -1)
          }
        }}
      >
        <div
          className={`flex-none ${scale ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width: bookW,
            height: PAGE_H,
            // zoom (not a scale transform) so the pages are rendered sharp at their final size
            zoom: scale || 1,
            transform: `translateX(${shift}px)`,
            transition: 'transform .9s var(--ease-wipe), opacity .5s',
          }}
        >
          <div
            ref={book}
            role="region"
            aria-roledescription={t.title}
            aria-label={`${t.page} ${status} ${t.of} ${count}`}
            onClick={onClick}
            className="relative size-full cursor-pointer perspective-[2600px]"
          >
            {/* One shadow under the visible pages; per-page shadows stack into grey edges */}
            <div
              aria-hidden
              className="absolute top-0 h-full shadow-[0_30px_70px_-30px_rgba(17,42,70,.6)]"
              style={{
                left: spread && turned === 0 ? PAGE_W : 0,
                width: spread && turned > 0 && turned < leaves ? 2 * PAGE_W : PAGE_W,
                transition: 'left .9s var(--ease-wipe), width .9s var(--ease-wipe)',
              }}
            />
            {Array.from({ length: leaves }, (_, k) => {
              const isTurned = k < turned
              const front = spread ? pages[2 * k] : pages[k]
              const back = spread ? pages[2 * k + 1] : null
              const shown = spread ? k === turned || k === turned - 1 : k === page
              const z = k === moving ? leaves + 1 : isTurned ? k + 1 : leaves - k
              return (
                <div
                  key={`${spread}-${k}`}
                  aria-hidden={!shown}
                  className="absolute top-0 h-full transform-3d"
                  style={{
                    left: spread ? PAGE_W : 0,
                    width: PAGE_W,
                    zIndex: z,
                    transformOrigin: 'left center',
                    transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                    transition: 'transform .9s var(--ease-wipe)',
                    pointerEvents: shown ? 'auto' : 'none',
                  }}
                >
                  <Face side="right" spread={spread}>
                    {front}
                  </Face>
                  {back && (
                    <Face side="left" spread={spread} back>
                      {back}
                    </Face>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 pt-6 print:hidden">
        <NavButton label={t.prev} onClick={() => go(-1)} disabled={turned === 0} />
        <span aria-live="polite" className="min-w-[110px] text-center font-mono text-sm text-steel">
          {pad2(status)} / {String(count).padStart(2, '0')}
        </span>
        <NavButton label={t.next} onClick={() => go(1)} disabled={turned === maxTurned} flip />
      </div>
      <p className="m-0 mt-3 text-center text-[13px] text-ash">{t.hint}</p>
    </div>
  )
}

const pad2 = (s: string) => s.replace(/\d+/g, (n) => n.padStart(2, '0'))

function Face({
  children,
  side,
  spread,
  back = false,
}: {
  children: ReactNode
  side: 'left' | 'right'
  spread: boolean
  back?: boolean
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden backface-hidden"
      style={{ transform: back ? 'rotateY(180deg)' : undefined }}
    >
      {children}
      {/* Paper fold towards the spine */}
      {spread && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[44px]"
          style={
            side === 'right'
              ? { left: 0, background: 'linear-gradient(to right, rgba(0,0,0,.14), transparent)' }
              : { right: 0, background: 'linear-gradient(to left, rgba(0,0,0,.14), transparent)' }
          }
        />
      )}
    </div>
  )
}

function NavButton({
  label,
  onClick,
  disabled,
  flip = false,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  flip?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="group flex size-[52px] cursor-pointer items-center justify-center rounded-full border-0 bg-mist text-navy transition-colors duration-400 hover:bg-navy hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-mist disabled:hover:text-navy"
    >
      <ArrowBack
        className={`transition-transform duration-600 ease-soft ${flip ? 'rotate-180 group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'}`}
      />
    </button>
  )
}
