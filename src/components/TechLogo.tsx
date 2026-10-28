import { techIconSrc } from '@/lib/media'
import type { Technology } from '@/payload-types'

const sizes = {
  lg: ['size-10', 'size-[34px]'],
  md: ['size-9', 'size-[30px]'],
  sm: ['size-8', 'size-[26px]'],
} as const

type Props = {
  tech: Technology
  size?: keyof typeof sizes
  /** simpleicons color, e.g. "112a46" or "white"; brand color when omitted */
  color?: string
  /** Light tooltip for dark backgrounds */
  invert?: boolean
}

/** Technology logo that lifts on hover and shows its name in a tooltip. */
export function TechLogo({ tech, size = 'lg', color, invert = false }: Props) {
  const [box, img] = sizes[size]

  return (
    <span
      className={`group/logo relative flex ${box} items-center justify-center transition-transform duration-350 ease-soft hover:-translate-y-[3px]`}
      aria-label={tech.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external SVG from simpleicons.org */}
      <img
        src={techIconSrc(tech, color)}
        alt={tech.name}
        className={`block ${img}`}
        loading="lazy"
      />
      <span
        className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[2] -translate-x-1/2 translate-y-1 rounded-lg px-2.5 py-[5px] font-mono text-xs whitespace-nowrap opacity-0 [transition:opacity_.25s,translate_.3s_var(--ease-soft)] group-hover/logo:translate-y-0 group-hover/logo:opacity-100 ${invert ? 'bg-white text-navy' : 'bg-navy text-white'}`}
      >
        {tech.name}
      </span>
    </span>
  )
}
