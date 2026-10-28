'use client'

/**
 * Shared IntersectionObserver for every reveal on the page.
 * While the home loader runs, reveals are held back and released together afterwards.
 */
const listeners = new Map<Element, () => void>()
const waiting = new Set<Element>()
let observer: IntersectionObserver | null = null
let ready = true
let poll = 0

const fire = (el: Element) => {
  const cb = listeners.get(el)
  if (!cb) return
  listeners.delete(el)
  waiting.delete(el)
  observer?.unobserve(el)
  cb()
}

const getObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        // Elements already above the viewport (e.g. after an anchor jump) are revealed too.
        if (!e.isIntersecting && e.boundingClientRect.top >= 0) return
        if (ready) fire(e.target)
        else waiting.add(e.target)
      }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  ))

/**
 * Fallback every 6 frames: reveals visible elements the observer misses, e.g. a fully
 * clipped "wipe" target (its own clip-path counts as not intersecting) or a fast jump.
 */
const startPolling = () => {
  if (poll) return
  let frame = 0
  const tick = () => {
    if (listeners.size === 0) {
      poll = 0
      return
    }
    if (ready && ++frame % 6 === 0)
      listeners.forEach((_, el) => {
        const r = el.getBoundingClientRect()
        // zero size = display:none (e.g. a filtered timeline entry)
        if ((r.width || r.height) && r.top < window.innerHeight) fire(el)
      })
    poll = requestAnimationFrame(tick)
  }
  poll = requestAnimationFrame(tick)
}

export const observeReveal = (el: Element, onReveal: () => void) => {
  listeners.set(el, onReveal)
  getObserver().observe(el)
  startPolling()
  return () => {
    listeners.delete(el)
    waiting.delete(el)
    observer?.unobserve(el)
  }
}

export const holdReveals = () => {
  ready = false
}

const readyListeners = new Set<() => void>()

export const releaseReveals = () => {
  ready = true
  waiting.forEach(fire)
  readyListeners.forEach((cb) => cb())
  readyListeners.clear()
}

/** Notifies once the loader has finished (immediately when there is no loader). */
export const onRevealsReady = (cb: () => void) => {
  if (ready) {
    cb()
    return () => {}
  }
  readyListeners.add(cb)
  return () => {
    readyListeners.delete(cb)
  }
}
