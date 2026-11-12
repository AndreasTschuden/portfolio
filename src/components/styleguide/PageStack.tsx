'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/** A4 landscape at 96 dpi, the size the pages are laid out in */
const PAGE_W = (297 * 96) / 25.4

/**
 * Shows the styleguide pages one below the other, zoomed down to fit narrow screens.
 * Printing ignores the zoom, so every page lands on its own A4 sheet at real size.
 */
export function PageStack({ pages }: { pages: ReactNode[] }) {
  const box = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setZoom(Math.min(1, el.clientWidth / PAGE_W))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} className="w-full">
      <div
        className="mx-auto flex w-fit flex-col gap-10 [zoom:var(--z)] print:gap-0 print:[zoom:1]"
        style={{ '--z': zoom } as CSSProperties}
      >
        {pages.map((p, i) => (
          <div
            key={i}
            className="shadow-[0_24px_60px_-28px_rgba(17,42,70,.45)] ring-1 ring-line print:break-after-page print:shadow-none print:ring-0 print:last:break-after-auto"
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  )
}
