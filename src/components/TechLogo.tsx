import { mediaSrc, techIconSrc } from '@/lib/media'
import type { Technology } from '@/payload-types'

const sizes = {
  lg: ['size-10', 'size-[34px]'],
  md: ['size-9', 'size-[30px]'],
  sm: ['size-8', 'size-[26px]'],
} as const

type Props = {
  tech: Technology
  size?: keyof typeof sizes
  /** Hex without # or a named color, e.g. "112a46" or "white" */
  color?: string
  /** Light tooltip for dark backgrounds */
  invert?: boolean
}

/** Monochrome technology logo that lifts on hover and shows its name in a tooltip. */
export function TechLogo({ tech, size = 'lg', color = '112a46', invert = false }: Props) {
  const [box, img] = sizes[size]
  // Uploaded icons are used as a mask so they take on `color` like the simpleicons ones.
  const custom = mediaSrc(tech.icon)

  return (
    <span
      className={`tap-hover group/logo relative flex ${box} items-center justify-center transition-transform duration-350 ease-soft hover:-translate-y-[3px]`}
      aria-label={tech.name}
    >
      {custom ? (
        <span
          role="img"
          aria-label={tech.name}
          className={`block ${img}`}
          style={{
            backgroundColor: /^[0-9a-f]{3,8}$/i.test(color) ? `#${color}` : color,
            mask: `url("${custom}") center / contain no-repeat`,
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- external SVG from simpleicons.org
        <img
          src={techIconSrc(tech, color)}
          alt={tech.name}
          className={`block ${img}`}
          loading="lazy"
        />
      )}
      <span
        className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[2] -translate-x-1/2 translate-y-1 rounded-lg px-2.5 py-[5px] font-mono text-xs whitespace-nowrap opacity-0 [transition:opacity_.25s,translate_.3s_var(--ease-soft)] group-hover/logo:translate-y-0 group-hover/logo:opacity-100 ${invert ? 'bg-white text-navy' : 'bg-navy text-white'}`}
      >
        {tech.name}
      </span>
    </span>
  )
}
