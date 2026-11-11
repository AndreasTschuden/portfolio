'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import type { Messages } from '@/i18n'

import { ArrowBack } from '../icons'

// A5 at 96 dpi, the size the pages are laid out in
const PAGE_W = (148 * 96) / 25.4
const PAGE_H = (210 * 96) / 25.4
/** Below this scale two pages get too small to read, so the viewer shows one page at a time. */
const MIN_SPREAD_SCALE = 0.55
/** Duration of a full page turn started by click, key or button. */
const TURN_MS = 1000
/** Screen distance from a page corner in which the mouse lifts the corner. */
const PEEL_ZONE = 90

type Props = {
  pages: ReactNode[]
  t: Messages['booklet']
}

type Pt = { x: number; y: number }

/**
 * A leaf being turned. Coordinates are in the "turn frame": the leaf lies flat on the right of
 * the spine (x = 0 … PAGE_W), and the grabbed corner rests at (PAGE_W, cy). Turning forward the
 * frame is the screen; turning back it is mirrored at the spine, so one fold model covers both.
 * `p` is where the grabbed corner is now; at (-PAGE_W, cy) the leaf has turned over completely.
 */
type Fold = {
  leaf: number
  /** Frame of the fold model: 1 = as on screen, -1 = mirrored at the spine */
  dir: 1 | -1
  /**
   * Single pages turning back: the forward turn played backwards, so the page lies down again
   * from the left edge instead of folding in from outside the visible page.
   */
  reverse: boolean
  /** 0 = top corner, PAGE_H = bottom corner */
  cy: number
  p: Pt
  mode: 'peel' | 'drag' | 'turn'
  /** Where the running animation takes the corner (frame x) */
  goal?: number
}

/**
 * Booklet with pages that turn like paper: the corner lifts and folds over, the back of the
 * page comes into view and the page casts a shadow on the one below. Pages turn by click, key,
 * button or by dragging a corner. Wide screens show spreads (cover alone on the right, back
 * cover alone on the left); narrow screens show single pages that turn away to the left.
 */
export function Booklet({ pages, t }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const book = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [spread, setSpread] = useState(true)
  // First visible page, in single-page terms. Spreads show pages (2k-1, 2k).
  const [page, setPage] = useState(0)
  const [fold, setFoldState] = useState<Fold | null>(null)
  const foldRef = useRef<Fold | null>(null)
  const raf = useRef<number | null>(null)
  // A leaf still finishing its turn while the next one has already started (quick clicks)
  const [trail, setTrailState] = useState<Fold | null>(null)
  const trailRef = useRef<Fold | null>(null)
  const trailRaf = useRef<number | null>(null)
  /** Which corner the mouse currently lifts ("leaf:dir:corner") */
  const peelKey = useRef<string | null>(null)
  const count = pages.length

  const setFold = useCallback((f: Fold | null) => {
    foldRef.current = f
    setFoldState(f)
  }, [])

  const setTrail = useCallback((f: Fold | null) => {
    trailRef.current = f
    setTrailState(f)
  }, [])

  const stopTrail = useCallback(() => {
    if (trailRaf.current !== null) cancelAnimationFrame(trailRaf.current)
    trailRaf.current = null
    setTrail(null)
  }, [setTrail])

  /** Stops running animations and drops the moving leaves; the page state is already final. */
  const settle = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
    peelKey.current = null
    setFold(null)
    stopTrail()
  }, [setFold, stopTrail])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      const two = Math.min(width / (2 * PAGE_W), height / PAGE_H) >= MIN_SPREAD_SCALE
      setSpread(two)
      settle()
      setScale(Math.min(width / ((two ? 2 : 1) * PAGE_W), height / PAGE_H, 1.3))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [settle])

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      if (trailRaf.current !== null) cancelAnimationFrame(trailRaf.current)
    },
    [],
  )

  // Spread mode: leaf k carries page 2k on its front and 2k+1 on its back.
  const leaves = spread ? Math.ceil(count / 2) : count
  const turned = spread ? Math.floor((page + 1) / 2) : page
  const maxTurned = spread ? leaves : count - 1

  /** The covers are card, not paper: they swing open stiffly instead of curling at the corner. */
  const isBoard = (k: number) => k === 0 || (spread && k === leaves - 1)

  const canTurn = (dir: 1 | -1) => (dir === 1 ? turned < maxTurned : turned > 0)

  /** Moves the page state one leaf on; the animation follows. */
  const commit = (dir: 1 | -1) => {
    const next = turned + dir
    setPage(spread ? Math.max(0, Math.min(count - 1, 2 * next - 1)) : next)
  }

  /** Animates the moving leaf's corner to `to` along a slight arc, like a hand lifting it. */
  const animate = (
    from: Fold,
    to: Pt,
    ms: number,
    ease: (t: number) => number,
    done?: () => void,
  ) => {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    const p0 = from.p
    const start = performance.now()
    const lift = PAGE_H * 0.05 * (Math.abs(to.x - p0.x) / (2 * PAGE_W))
    const up = from.cy === 0 ? 1 : -1
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms)
      const e = ease(k)
      const p = {
        x: p0.x + (to.x - p0.x) * e,
        y: p0.y + (to.y - p0.y) * e + up * lift * Math.sin(Math.PI * e),
      }
      setFold({ ...from, goal: to.x, p: constrain(p, from.cy) })
      if (k < 1) raf.current = requestAnimationFrame(step)
      else {
        raf.current = null
        done?.()
      }
    }
    // Show the start pose in the same render as the page change. Waiting for the first frame
    // would show the leaf one frame at its final place (e.g. already on the left) and flicker.
    setFold({ ...from, goal: to.x, p: constrain(p0, from.cy) })
    raf.current = requestAnimationFrame(step)
  }

  /** Lets a leaf finish on its own, quickly, so the next turn can start right away. */
  const finishAside = (f: Fold, goal: number) => {
    stopTrail()
    const p0 = f.p
    const start = performance.now()
    const ms = 120 + 380 * (Math.abs(goal - p0.x) / (2 * PAGE_W))
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms)
      const e = easeOut(k)
      const p = { x: p0.x + (goal - p0.x) * e, y: p0.y + (f.cy - p0.y) * e }
      setTrail({ ...f, goal, p: constrain(p, f.cy) })
      if (k < 1) trailRaf.current = requestAnimationFrame(step)
      else {
        trailRaf.current = null
        setTrail(null)
      }
    }
    setTrail({ ...f, goal })
    trailRaf.current = requestAnimationFrame(step)
  }

  const startTurn = (dir: 1 | -1, cy = PAGE_H) => {
    if (!canTurn(dir)) return
    const leaf = dir === 1 ? turned : turned - 1
    const reverse = !spread && dir === -1
    const current = foldRef.current
    const trailing = trailRef.current
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
    peelKey.current = null
    let from: Fold
    if (current?.leaf === leaf) {
      // The same leaf is already moving (lifted corner or turning the other way): go on from there
      from = { ...current, mode: 'turn' }
    } else if (trailing?.leaf === leaf) {
      stopTrail()
      from = { ...trailing, mode: 'turn' }
    } else {
      // Another leaf still moving finishes on its own instead of jumping to its end
      if (current?.mode === 'turn' && current.goal !== undefined) finishAside(current, current.goal)
      else if (current?.mode === 'peel') finishAside(current, PAGE_W)
      from = {
        leaf,
        dir: reverse ? 1 : dir,
        reverse,
        cy,
        p: { x: reverse ? -PAGE_W : PAGE_W, y: cy },
        mode: 'turn',
      }
    }
    commit(dir)
    if (prefersReducedMotion()) {
      settle()
      return
    }
    // In the fold frame the leaf lies unturned at +W (frame 1) or -W (mirrored frame)
    const flat = from.dir === 1 ? PAGE_W : -PAGE_W
    const goal = dir === 1 ? -flat : flat
    const share = Math.abs(from.p.x - goal) / (2 * PAGE_W)
    const ms = TURN_MS * (isBoard(leaf) ? 1.2 : 1) * Math.max(0.35, share)
    animate(from, { x: goal, y: from.cy }, ms, easeInOut, () => setFold(null))
  }

  const go = (dir: 1 | -1) => startTurn(dir)

  const jump = (to: number) => {
    settle()
    setPage(to)
  }

  const goRef = useRef(go)
  const jumpRef = useRef(jump)
  goRef.current = go
  jumpRef.current = jump

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goRef.current(1)
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') goRef.current(-1)
      else if (e.key === 'Home') jumpRef.current(0)
      else if (e.key === 'End') jumpRef.current(count - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count])

  /** Which way a click or grab at this x turns: the visible half decides. */
  const sideAt = (clientX: number): 1 | -1 => {
    const rect = book.current?.getBoundingClientRect()
    if (!rect) return 1
    const mid = spread
      ? turned === 0
        ? rect.left + rect.width * 0.75
        : turned === leaves
          ? rect.left + rect.width * 0.25
          : rect.left + rect.width / 2
      : rect.left + rect.width * 0.3
    return clientX >= mid ? 1 : -1
  }

  /** Grabbing the upper half takes the top corner, otherwise the bottom one. */
  const cornerAt = (clientY: number) => {
    const rect = book.current?.getBoundingClientRect()
    return rect && clientY < rect.top + rect.height / 2 ? 0 : PAGE_H
  }

  // --- Corner lift on hover -------------------------------------------------------------

  const unpeel = () => {
    const f = foldRef.current
    peelKey.current = null
    if (!f || f.mode !== 'peel') return
    animate(f, { x: PAGE_W, y: f.cy }, 260, easeOut, () => setFold(null))
  }

  const hover = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.buttons || prefersReducedMotion()) return
    const f = foldRef.current
    if (f && f.mode !== 'peel') return
    const rect = book.current?.getBoundingClientRect()
    if (!rect) return
    const top = e.clientY >= rect.top && e.clientY < rect.top + PEEL_ZONE
    const bottom = e.clientY <= rect.bottom && e.clientY > rect.bottom - PEEL_ZONE
    let dir: 1 | -1 | 0 = 0
    if (top || bottom) {
      if (e.clientX <= rect.right && e.clientX > rect.right - PEEL_ZONE && canTurn(1)) dir = 1
      else if (spread && e.clientX >= rect.left && e.clientX < rect.left + PEEL_ZONE && canTurn(-1))
        dir = -1
    }
    if (!dir) {
      if (peelKey.current) unpeel()
      return
    }
    const cy = top ? 0 : PAGE_H
    const leaf = dir === 1 ? turned : turned - 1
    const key = `${leaf}:${dir}:${cy}`
    if (peelKey.current === key) return
    peelKey.current = key
    const from: Fold =
      f && f.leaf === leaf && f.dir === dir && f.cy === cy
        ? f
        : { leaf, dir, reverse: false, cy, p: { x: PAGE_W, y: cy }, mode: 'peel' }
    // A cover only opens a crack, a page lifts its corner
    const to = isBoard(leaf)
      ? { x: PAGE_W - 22, y: cy }
      : { x: PAGE_W - 70, y: cy ? PAGE_H - 45 : 45 }
    animate(from, to, 320, easeOut)
  }

  // --- Dragging a page ------------------------------------------------------------------

  const drag = useRef<{
    id: number
    x: number
    y: number
    lastX: number
    lastT: number
    vx: number
    from: Fold | null
  } | null>(null)
  const dragged = useRef(false)

  const onPointerDown = (e: React.PointerEvent) => {
    dragged.current = false
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const target = e.target as HTMLElement
    if (!book.current?.contains(target) || target.closest('a')) return
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastT: e.timeStamp,
      vx: 0,
      from: null,
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) {
      hover(e)
      return
    }
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.from) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return
      const dir = spread ? sideAt(d.x) : dx < 0 ? 1 : -1
      if (!canTurn(dir)) {
        drag.current = null
        return
      }
      const leaf = dir === 1 ? turned : turned - 1
      const reverse = !spread && dir === -1
      const cy = cornerAt(d.y)
      const current = foldRef.current
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      raf.current = null
      peelKey.current = null
      // Grab a lifted corner where it is, otherwise the flat page
      d.from =
        current && current.leaf === leaf && current.dir === dir && current.mode === 'peel'
          ? { ...current, mode: 'drag' }
          : {
              leaf,
              dir: reverse ? 1 : dir,
              reverse,
              cy,
              p: { x: reverse ? -PAGE_W : PAGE_W, y: cy },
              mode: 'drag',
            }
      // A turn still running finishes on its own; its page state is already final
      if (current?.mode === 'turn' && current.goal !== undefined && current.leaf !== leaf)
        finishAside(current, current.goal)
      else if (current && current.mode !== 'peel') setFold(null)
      stage.current?.setPointerCapture(e.pointerId)
    }
    const from = d.from
    const s = scale || 1
    const dt = e.timeStamp - d.lastT
    if (dt > 0) d.vx = 0.7 * ((e.clientX - d.lastX) / dt) + 0.3 * d.vx
    d.lastX = e.clientX
    d.lastT = e.timeStamp
    setFold({
      ...from,
      p: constrain({ x: from.p.x + (from.dir * dx) / s, y: from.p.y + dy / s }, from.cy),
    })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    const f = foldRef.current
    if (!d.from || !f) return
    dragged.current = true
    const start = f.reverse ? -PAGE_W : PAGE_W
    // How far the turn got (0 … 1) and how fast it moved on (screen px/ms)
    const progress = (start - f.p.x) / (2 * start)
    const v = -Math.sign(start) * f.dir * d.vx
    // Flicks decide by direction, slow drags by how far the corner got
    const done = v > 0.3 || (v > -0.3 && progress > 0.3)
    if (done) commit(f.reverse ? -1 : f.dir)
    animate(
      { ...f, mode: 'turn' },
      { x: done ? -start : start, y: f.cy },
      done ? 200 + 600 * (1 - progress) : 200 + 500 * progress,
      easeOut,
      () => setFold(null),
    )
  }

  const onClick = (e: React.MouseEvent) => {
    if (dragged.current) {
      dragged.current = false
      return
    }
    if ((e.target as HTMLElement).closest('a')) return
    startTurn(sideAt(e.clientX), cornerAt(e.clientY))
  }

  const visible = spread ? [2 * turned - 1, 2 * turned].filter((p) => p >= 0 && p < count) : [page]
  const status = visible.map((p) => p + 1).join('–')

  const bookW = (spread ? 2 : 1) * PAGE_W
  // Visible extent of the book around the spine, [from, to]; the view keeps it centered.
  let span: [number, number] =
    turned === 0 ? [0, PAGE_W] : turned === leaves ? [-PAGE_W, 0] : [-PAGE_W, PAGE_W]
  // While a cover swings, the extent follows its outer edge frame by frame
  const swinging = spread && fold !== null && isBoard(fold.leaf)
  if (swinging) {
    const edge = Math.max(-PAGE_W, Math.min(PAGE_W, fold.dir * fold.p.x))
    span =
      fold.leaf === 0 && leaves > 1
        ? [Math.min(0, edge), PAGE_W]
        : fold.leaf === 0
          ? [Math.min(0, edge), Math.max(0, edge)]
          : [-PAGE_W, Math.max(0, edge)]
  }
  const shift = spread ? -(span[0] + span[1]) / 2 : 0
  const ease = swinging ? 'none' : undefined

  const faces = (k: number) =>
    spread
      ? { front: pages[2 * k], back: pages[2 * k + 1] ?? null }
      : { front: pages[k], back: null }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={stage}
        className="flex min-h-0 flex-1 touch-pan-y items-center justify-center select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse' && !drag.current) unpeel()
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
            transition: ease ?? 'transform .9s var(--ease-wipe), opacity .5s',
          }}
        >
          <div
            ref={book}
            role="region"
            aria-roledescription={t.title}
            aria-label={`${t.page} ${status} ${t.of} ${count}`}
            onClick={onClick}
            className="relative size-full cursor-pointer"
            // Single pages turn away over the left edge
            style={{
              clipPath: spread ? undefined : 'inset(-100px -100px -100px 0)',
            }}
          >
            {/* One shadow under the visible pages; per-page shadows stack into grey edges */}
            <div
              aria-hidden
              className="absolute top-0 h-full shadow-[0_30px_70px_-30px_rgba(17,42,70,.6)]"
              style={{
                left: spread ? PAGE_W + span[0] : 0,
                width: spread ? span[1] - span[0] : PAGE_W,
                transition: ease ?? 'left .9s var(--ease-wipe), width .9s var(--ease-wipe)',
              }}
            />
            {Array.from({ length: leaves }, (_, k) => {
              const { front, back } = faces(k)
              const moving = fold?.leaf === k ? fold : trail?.leaf === k ? trail : null
              const isTurned = k < turned
              const shown = spread ? k === turned || k === turned - 1 : k === page
              return (
                <div
                  key={`${spread}-${k}`}
                  aria-hidden={moving ? true : !shown}
                  className="absolute top-0 h-full"
                  style={{
                    left: spread ? PAGE_W : 0,
                    width: PAGE_W,
                    zIndex: moving
                      ? moving === fold
                        ? leaves + 2
                        : leaves + 1
                      : isTurned
                        ? k + 1
                        : leaves - k,
                    pointerEvents: (moving ? moving.mode === 'peel' : shown) ? 'auto' : 'none',
                  }}
                >
                  <Leaf
                    front={front}
                    back={back}
                    spread={spread}
                    turned={isTurned}
                    fold={moving}
                    board={isBoard(k)}
                    below={{ right: k + 1 < leaves, left: spread && k > 0 }}
                  />
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

/**
 * One leaf with both of its faces. The element tree is the same whether the leaf lies flat,
 * lies turned, folds or swings, so starting or ending a turn only changes styles: the pages
 * (and their images) stay mounted and nothing has to be laid out or decoded again mid-turn.
 *
 * - Pages fold like paper along a straight line: the part at the spine stays flat, the part
 *   with the grabbed corner is mirrored over the fold and shows the other side of the sheet.
 * - Covers are card: they swing around the spine in 3D, darken as they turn away from the
 *   light and shade the page they lift off.
 */
function Leaf({
  front,
  back,
  spread,
  turned,
  fold,
  board,
  below,
}: {
  front: ReactNode
  back: ReactNode
  spread: boolean
  turned: boolean
  fold: Fold | null
  board: boolean
  below: { left: boolean; right: boolean }
}) {
  const hidden: CSSProperties = { visibility: 'hidden' }
  let rotor: CSSProperties | undefined
  let wrapFront: CSSProperties | undefined
  let wrapBack: CSSProperties | undefined
  let faceFront: CSSProperties
  let faceBack: CSSProperties
  let overFront: ReactNode = null
  let overBack: ReactNode = null
  let under: ReactNode = null

  if (!fold) {
    faceFront = turned ? hidden : {}
    faceBack = turned && spread ? { left: -PAGE_W } : { ...hidden, left: -PAGE_W }
  } else if (board) {
    // Projected outer edge, -1 … 1 page widths from the spine
    const edge = Math.max(-1, Math.min(1, (fold.dir * fold.p.x) / PAGE_W))
    const angle = (Math.acos(edge) * 180) / Math.PI
    const lift = Math.sqrt(1 - edge * edge)
    const reach = Math.abs(edge) * PAGE_W
    const shade = (v: number, to: 'left' | 'right') => (
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to ${to}, rgba(0,0,0,${v}), rgba(0,0,0,${v * 0.55}))`,
        }}
      />
    )
    const card: CSSProperties = {
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      boxShadow: `0 0 ${10 + 30 * lift}px rgba(17,42,70,${0.12 + 0.2 * lift})`,
    }
    rotor = {
      transformOrigin: 'left center',
      transformStyle: 'preserve-3d',
      // Seen from in front of the spine, so the swinging edge grows as it comes closer
      transform: `perspective(4500px) rotateY(${-angle}deg)`,
    }
    wrapFront = wrapBack = { transformStyle: 'preserve-3d' }
    faceFront = card
    faceBack = { ...card, transform: 'rotateY(180deg)' }
    overFront = shade(Math.min(1, angle / 90) * 0.3, 'left')
    overBack = shade(Math.min(1, (180 - angle) / 90) * 0.3, 'right')
    // Shadow on the page the cover lifts off or comes down on
    const side = edge > 0 ? 'right' : 'left'
    if (below[side] && reach > 0) {
      under = (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0"
          style={{
            left: side === 'right' ? 0 : -(reach + 40),
            width: reach + 40,
            background: `linear-gradient(to ${side}, rgba(17,22,30,${0.3 * lift}), rgba(17,22,30,${0.14 * lift}) ${reach}px, rgba(17,22,30,0))`,
          }}
        />
      )
    }
  } else {
    const g = foldLayout(fold)
    const s = g.strength
    const w = Math.max(14, Math.min(90, g.depth * 0.5))
    const w1 = Math.min(g.depth * 0.3, 46)
    // The part of the sheet still lying flat
    const flat: CSSProperties = { clipPath: polygon(g.aClip) }
    // The folded flap, showing the other side of the sheet
    const flap: CSSProperties = {
      left: 0,
      transformOrigin: '0 0',
      transform: `matrix(${g.bMatrix.join(',')})`,
      clipPath: polygon(g.bClip),
    }
    const lifted: CSSProperties = {
      filter: `drop-shadow(0 0 ${4 + 12 * s}px rgba(17,42,70,${0.32 * s}))`,
    }
    // The paper bends at the fold: dark in the crease, a soft highlight where it curves
    const crease = (
      <Band
        o={g.flap.o}
        d={g.flap.d}
        stops={`rgba(0,0,0,${0.24 * s}) 0px, rgba(0,0,0,${0.07 * s}) ${w1}px, rgba(255,255,255,${0.16 * s}) ${Math.max(w1 + 1, g.depth * 0.55)}px, rgba(0,0,0,${0.06 * s}) ${Math.max(w1 + 2, g.depth)}px`}
      />
    )
    if (fold.dir === 1) {
      faceFront = flat
      faceBack = flap
      wrapBack = lifted
      overBack = crease
    } else {
      faceBack = { ...flat, left: -PAGE_W }
      faceFront = flap
      wrapFront = lifted
      overFront = crease
    }
    // Shadow the lifted sheet casts on the page below
    under = (
      <div className="absolute top-0 left-0 h-full w-full" style={{ clipPath: polygon(g.vacated) }}>
        <Band
          o={g.cast.o}
          d={g.cast.d}
          stops={`rgba(17,22,30,${0.42 * s}) 0px, rgba(17,22,30,${0.14 * s}) ${w * 0.35}px, rgba(17,22,30,0) ${w}px`}
        />
      </div>
    )
  }

  const face = 'absolute top-0 left-0 h-full w-full'
  return (
    <>
      {under}
      <div className="absolute inset-0" style={rotor}>
        <div className="absolute inset-0" style={wrapFront}>
          <div className={face} style={faceFront}>
            <Face side="right" spread={spread}>
              {front}
            </Face>
            {overFront}
          </div>
        </div>
        <div className="absolute inset-0" style={wrapBack}>
          <div className={face} style={faceBack}>
            <Face side="left" spread={spread}>
              {back ?? <Paper ghost={fold ? front : undefined} />}
            </Face>
            {overBack}
          </div>
        </div>
      </div>
    </>
  )
}

/** A linear gradient that starts at `o` and runs in direction `d`, as wide as the page. */
function Band({ o, d, stops }: { o: Pt; d: Pt; stops: string }) {
  const L = 1400
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: o.x,
        top: o.y - L,
        width: L,
        height: 2 * L,
        transformOrigin: '0 50%',
        transform: `rotate(${Math.atan2(d.y, d.x)}rad)`,
        background: `linear-gradient(to right, ${stops})`,
      }}
    />
  )
}

/** Blank back of a single page, with the printed side faintly showing through. */
function Paper({ ghost }: { ghost?: ReactNode }) {
  return (
    <div className="relative size-full bg-[#fbfbfa]">
      {ghost && (
        <div className="absolute inset-0 -scale-x-100 opacity-[.07] grayscale">{ghost}</div>
      )}
    </div>
  )
}

// --- Fold geometry ------------------------------------------------------------------------

/** Affine map [a, b, c, d, e, f] as in CSS matrix(): (x, y) → (ax + cy + e, bx + dy + f). */
type Mat = [number, number, number, number, number, number]

const ID: Mat = [1, 0, 0, 1, 0, 0]
/** Mirror inside one page: x → PAGE_W - x */
const FLIP_PAGE: Mat = [-1, 0, 0, 1, PAGE_W, 0]
/** Mirror at the spine: x → -x */
const FLIP_SPINE: Mat = [-1, 0, 0, 1, 0, 0]

const apply = (m: Mat, p: Pt): Pt => ({
  x: m[0] * p.x + m[2] * p.y + m[4],
  y: m[1] * p.x + m[3] * p.y + m[5],
})
const linear = (m: Mat, p: Pt): Pt => ({ x: m[0] * p.x + m[2] * p.y, y: m[1] * p.x + m[3] * p.y })
/** m1 after m2 */
const compose = (m1: Mat, m2: Mat): Mat => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
]

/** Keeps the corner where paper fixed at the spine can reach it. */
function constrain(p: Pt, cy: number): Pt {
  const y = cy === 0 ? Math.max(0, p.y) : Math.min(PAGE_H, p.y)
  let q = { x: p.x, y }
  // The edge from the corner to the spine has the page's width…
  q = limit(q, { x: 0, y: cy }, PAGE_W)
  // …and the diagonal to the other end of the spine can't stretch either
  q = limit(q, { x: 0, y: PAGE_H - cy }, Math.hypot(PAGE_W, PAGE_H))
  return q
}

function limit(p: Pt, o: Pt, r: number): Pt {
  const dx = p.x - o.x
  const dy = p.y - o.y
  const d = Math.hypot(dx, dy)
  return d <= r ? p : { x: o.x + (dx / d) * r, y: o.y + (dy / d) * r }
}

/** Part of a convex polygon where `f` ≥ 0 (f linear). */
function clip(poly: Pt[], f: (p: Pt) => number): Pt[] {
  const out: Pt[] = []
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length]
    const fa = f(a)
    const fb = f(b)
    if (fa >= 0) out.push(a)
    if (fa >= 0 !== fb >= 0) {
      const t = fa / (fa - fb)
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
    }
  })
  return out
}

const polygon = (pts: Pt[]) =>
  pts.length < 3
    ? 'polygon(0 0, 0 0, 0 0)'
    : `polygon(${pts.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(', ')})`

/**
 * The fold is the perpendicular bisector between the corner at rest and where it is now. The
 * sheet on the corner's side of it is mirrored over the fold. Results are in the coordinates
 * of each element: the flat face (A), the flap (B, plus its transform), and the leaf container.
 */
function foldLayout({ p: raw, cy, dir }: Fold) {
  const W = PAGE_W
  const H = PAGE_H
  const c = { x: W, y: cy }
  let p = constrain(raw, cy)
  if (Math.hypot(c.x - p.x, c.y - p.y) < 0.5) p = { x: W - 0.5, y: cy }
  const len = Math.hypot(c.x - p.x, c.y - p.y)
  const n = { x: (c.x - p.x) / len, y: (c.y - p.y) / len }
  const m = { x: (c.x + p.x) / 2, y: (c.y + p.y) / 2 }
  const side = (q: Pt) => (q.x - m.x) * n.x + (q.y - m.y) * n.y

  const sheet = [
    { x: 0, y: 0 },
    { x: W, y: 0 },
    { x: W, y: H },
    { x: 0, y: H },
  ]
  const flat = clip(sheet, (q) => -side(q))
  const flap = clip(sheet, side)
  const k = m.x * n.x + m.y * n.y
  const mirror: Mat = [
    1 - 2 * n.x * n.x,
    -2 * n.x * n.y,
    -2 * n.x * n.y,
    1 - 2 * n.y * n.y,
    2 * k * n.x,
    2 * k * n.y,
  ]

  // Frame → screen, and frame ↔ local coordinates of the two faces (all self-inverse)
  const screen = dir === 1 ? ID : FLIP_SPINE
  const faceA = dir === 1 ? ID : FLIP_PAGE
  const faceB = dir === 1 ? FLIP_PAGE : ID
  const progress = Math.min(1, Math.max(0, (W - p.x) / (2 * W)))
  // A real sheet bends instead of folding flat, so the flap never rises above or below the book
  const shown = clip(
    clip(flap, (q) => apply(mirror, q).y),
    (q) => H - apply(mirror, q).y,
  )

  return {
    aClip: flat.map((q) => apply(faceA, q)),
    bClip: shown.map((q) => apply(faceB, q)),
    bMatrix: compose(screen, compose(mirror, faceB)),
    flap: { o: apply(faceB, m), d: linear(faceB, n) },
    vacated: flap.map((q) => apply(screen, q)),
    cast: { o: apply(screen, m), d: linear(screen, n) },
    depth: Math.max(0, ...flap.map(side)),
    /** Shading is strongest mid-turn and fades out as the sheet lies down */
    strength: Math.min(1, 2.5 * Math.sin(Math.PI * progress)),
  }
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pad2 = (s: string) => s.replace(/\d+/g, (n) => n.padStart(2, '0'))

function Face({
  children,
  side,
  spread,
}: {
  children: ReactNode
  side: 'left' | 'right'
  spread: boolean
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
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
