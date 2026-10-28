import Link from 'next/link'

import { ArrowUpRightLarge } from '../icons'
import { Mask, Reveal } from '../motion/Reveal'

type Props = {
  href: string
  label: string
  title: string
  /** Detail page uses the blue grey label */
  labelClassName?: string
}

/** Large "next page" link at the end of a page. */
export function NextTeaser({ href, label, title, labelClassName = 'text-secondary' }: Props) {
  return (
    <Link href={href} className="group inline-flex flex-col gap-1 text-black no-underline">
      <Reveal as="span" className={`text-base ${labelClassName}`}>
        {label}
      </Reveal>
      <span className="flex items-center gap-5 sm:gap-12">
        <Mask
          delay={80}
          className="block text-[clamp(36px,10vw,56px)] leading-[1.3] font-medium text-black md:text-teaser"
        >
          <span className="inline-block transition-transform duration-600 ease-soft group-hover:translate-x-2.5">
            {title}
          </span>
        </Mask>
        <Reveal type="pop" delay={250} as="span" className="flex-none">
          <span className="flex size-14 items-center justify-center rounded-full sm:size-20 bg-secondary text-white transition-colors duration-400 group-hover:bg-navy">
            <ArrowUpRightLarge className="size-9 sm:size-[50px] transition-transform duration-600 ease-soft group-hover:rotate-45" />
          </span>
        </Reveal>
      </span>
    </Link>
  )
}
