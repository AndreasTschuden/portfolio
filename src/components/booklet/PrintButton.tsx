'use client'

import { ArrowDown } from '../icons'

/** Opens the print dialog; "Save as PDF" there produces the booklet as an A5 PDF. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group flex cursor-pointer items-center gap-3 rounded-full border-0 bg-navy py-2 pr-2 pl-6 text-base text-white transition-colors duration-400 hover:bg-secondary"
    >
      {label}
      <span className="flex size-10 items-center justify-center rounded-full bg-white/14 transition-colors duration-400 group-hover:bg-white group-hover:text-navy">
        <ArrowDown className="transition-transform duration-600 ease-soft group-hover:translate-y-0.5" />
      </span>
    </button>
  )
}
