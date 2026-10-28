'use client'

import { useEffect, useRef } from 'react'

export type Frame = {
  /** window.scrollY */
  y: number
  /** scroll distance since the previous frame */
  dy: number
  vw: number
  vh: number
  /** document.documentElement.scrollHeight - vh */
  maxScroll: number
  now: number
}

type Callback = (frame: Frame) => void

// One requestAnimationFrame loop per page, shared by every subscriber.
const callbacks = new Set<Callback>()
let raf = 0
let lastY = 0

const tick = (now: number) => {
  const y = window.scrollY
  const vh = window.innerHeight
  const frame: Frame = {
    y,
    dy: y - lastY,
    vw: window.innerWidth,
    vh,
    maxScroll: document.documentElement.scrollHeight - vh,
    now,
  }
  lastY = y
  callbacks.forEach((cb) => cb(frame))
  raf = requestAnimationFrame(tick)
}

export const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v))

/** Runs `callback` on every animation frame while the component is mounted. */
export function useScrollFrame(callback: Callback) {
  const ref = useRef(callback)

  useEffect(() => {
    ref.current = callback
  })

  useEffect(() => {
    const cb: Callback = (frame) => ref.current(frame)
    callbacks.add(cb)
    if (callbacks.size === 1) {
      lastY = window.scrollY
      raf = requestAnimationFrame(tick)
    }
    return () => {
      callbacks.delete(cb)
      if (callbacks.size === 0) cancelAnimationFrame(raf)
    }
  }, [])
}
