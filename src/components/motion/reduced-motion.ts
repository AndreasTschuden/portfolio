'use client'

import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(query).matches

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(query)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
