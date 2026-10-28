import type { ReactNode } from 'react'

import { pad } from '@/lib/media'

import { Reveal } from '../motion/Reveal'

const iconProps = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

// Icons follow the card position (01–04) as in the design.
const icons: ReactNode[] = [
  <svg key="code" {...iconProps}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  </svg>,
  <svg key="design" {...iconProps}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M9 20h6M12 16v4M9 10l2 2 4-4" />
  </svg>,
  <svg key="responsive" {...iconProps}>
    <rect x="6" y="2.5" width="12" height="19" rx="2" />
    <path d="M11.5 18h1" />
  </svg>,
  <svg key="performance" {...iconProps}>
    <rect x="9.5" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" />
    <rect x="9.5" y="16" width="5" height="5" rx="1" />
    <rect x="16" y="16" width="5" height="5" rx="1" />
    <path d="M12 8v8M5.5 16v-3.5h13V16" />
  </svg>,
]

export function Services({ services }: { services: { title: string; text: string }[] }) {
  return (
    <div className="mt-[50px] grid flex-[0_1_572px] grid-cols-2 gap-x-5 gap-y-[15px]">
      {services.map((s, i) => (
        <Reveal key={i} delay={i * 100}>
          <div className="flex h-full min-h-[150px] cursor-default flex-col justify-between gap-[18px] rounded-[20px] bg-mist bg-[linear-gradient(var(--color-navy),var(--color-navy))] bg-no-repeat bg-position-[0_100%] bg-size-[100%_0%] px-[22px] py-5 text-navy [transition:background-size_.55s_var(--ease-soft),color_.35s] hover:bg-size-[100%_100%] hover:text-white">
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm opacity-60">{pad(i + 1)}</span>
              {icons[i % icons.length]}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold tracking-[.02em] uppercase">{s.title}</span>
              <span className="max-w-[239px] text-sm leading-[1.4] opacity-75">{s.text}</span>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
