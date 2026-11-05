'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import type { Locale, Messages } from '@/i18n'

import { ArrowDown, ArrowUpRight, Logo } from '../icons'
import { Reveal } from '../motion/Reveal'
import { hoverUnderline } from './hover-underline'

type Props = {
  locale: Locale
  site: { name?: string | null; email?: string | null; phone?: string | null }
  t: Messages['footer']
  nav: Messages['nav']
}

/** Tagline, navigation and contact columns, and a legal bar with the imprint link. */
export function Footer({ locale, site, t, nav }: Props) {
  const name = site.name ?? ''
  const home = `/${locale}`
  const links = [
    { href: `${home}#about`, label: nav.about },
    { href: `${home}/projects`, label: nav.projects },
    { href: `${home}/experience`, label: nav.experience },
  ]

  return (
    <footer className="overflow-hidden px-gutter pt-24 md:pt-[150px]">
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] md:pt-16">
        <Reveal className="flex flex-col gap-6 sm:col-span-2 md:col-span-1">
          <Link href={home} aria-label={nav.home} className="flex w-fit text-navy">
            <Logo />
          </Link>
          <p className="m-0 max-w-[420px] text-[clamp(24px,2.4vw,34px)] leading-[1.25] font-medium text-balance text-black">
            {t.tagline}
          </p>
        </Reveal>

        <Reveal delay={90} className="flex flex-col gap-5">
          <ColumnLabel>{t.navigation}</ColumnLabel>
          <nav aria-label={t.navigation}>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`pb-[3px] text-navy no-underline hover:text-secondary ${hoverUnderline}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal delay={180} className="flex min-w-0 flex-col gap-5">
          <ColumnLabel>{t.contact}</ColumnLabel>
          <div className="flex flex-col gap-3 text-base">
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className={`w-fit pb-[3px] break-words text-navy no-underline hover:text-secondary ${hoverUnderline}`}
              >
                {site.email}
              </a>
            )}
            {site.phone && (
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                className={`w-fit pb-[3px] text-navy no-underline hover:text-secondary ${hoverUnderline}`}
              >
                {site.phone}
              </a>
            )}
            <Link
              href={`${home}#contact`}
              className="mt-2 flex w-fit items-center gap-1 text-navy underline hover:text-secondary"
            >
              {nav.touch}
              <ArrowUpRight />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-6 pb-8 text-sm text-ash md:mt-24 md:pb-10">
        <span>
          © {new Date().getFullYear()} {name}. {t.rights}
        </span>
        <div className="flex items-center gap-8">
          <Link
            href={`${home}/imprint`}
            className={`pb-[2px] text-navy no-underline hover:text-secondary ${hoverUnderline}`}
          >
            {t.imprint}
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className="group flex cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-sm text-navy"
          >
            {t.top}
            <span className="flex size-9 items-center justify-center rounded-full bg-mist transition-colors duration-400 group-hover:bg-navy group-hover:text-white">
              <ArrowDown className="rotate-180 transition-transform duration-600 ease-soft group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}

const ColumnLabel = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-xs tracking-[.06em] text-steel uppercase">{children}</span>
)
