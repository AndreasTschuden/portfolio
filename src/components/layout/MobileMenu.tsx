'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { pad } from '@/lib/media'
import type { Locale, Messages } from '@/i18n'

import { ArrowUpRight } from '../icons'
import { LangToggle } from './LangToggle'

export const MENU_ID = 'mobile-menu'

/** Two lines that turn into an ×. Only shown below md. */
/** Breakpoint from which the inline nav replaces the burger menu. */
export type Desktop = 'md' | 'lg'

export function MenuButton({
  open,
  onToggle,
  t,
  desktop,
}: {
  open: boolean
  onToggle: () => void
  t: Messages['nav']
  desktop: Desktop
}) {
  const line =
    'absolute top-1/2 left-1/2 -mt-[0.75px] -ml-3 h-[1.5px] w-6 rounded-full bg-navy transition-transform duration-450 ease-soft'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={MENU_ID}
      aria-label={open ? t.menuClose : t.menuOpen}
      className={`relative ml-auto size-10 flex-none cursor-pointer rounded-full border-0 bg-transparent ${desktop === 'lg' ? 'lg:hidden' : 'md:hidden'}`}
    >
      <span className={`${line} ${open ? 'translate-y-0 rotate-45' : '-translate-y-1'}`} />
      <span className={`${line} ${open ? 'translate-y-0 -rotate-45' : 'translate-y-1'}`} />
    </button>
  )
}

type Props = {
  desktop: Desktop
  open: boolean
  onClose: () => void
  locale: Locale
  t: Messages['nav']
}

/** Full-screen menu that wipes down from the top, links rise out of a mask. */
export function MobileMenu({ open, onClose, locale, t, desktop }: Props) {
  const home = `/${locale}`
  const links = [
    { href: `${home}#about`, label: t.about },
    { href: `${home}/projects`, label: t.projects },
    { href: `${home}/experience`, label: t.experience },
  ]

  // Lock page scroll, close on Escape and when the viewport grows to the desktop nav.
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const wide = window.matchMedia(desktop === 'lg' ? '(min-width: 64rem)' : '(min-width: 48rem)')
    const onResize = () => wide.matches && onClose()
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onResize)
    return () => {
      html.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onResize)
    }
  }, [open, onClose, desktop])

  return (
    <div
      id={MENU_ID}
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-40 flex flex-col bg-white px-gutter pt-[130px] pb-10 transition-[clip-path] duration-650 ease-swift ${desktop === 'lg' ? 'lg:hidden' : 'md:hidden'} ${
        open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)]'
      }`}
    >
      <nav className="flex flex-col gap-3">
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="flex items-baseline gap-4 text-navy no-underline"
          >
            <span
              className={`font-mono text-sm text-steel transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: open ? `${250 + i * 70}ms` : '0ms' }}
            >
              {pad(i + 1)}
            </span>
            <span className="-my-[.25em] block overflow-hidden py-[.25em] text-[clamp(40px,12vw,64px)] leading-[1.15]">
              <span
                className={`inline-block font-medium transition-transform duration-700 ease-soft ${
                  open ? 'translate-y-0' : 'translate-y-[calc(110%+.5em)]'
                }`}
                style={{ transitionDelay: open ? `${200 + i * 70}ms` : '0ms' }}
              >
                {l.label}
              </span>
            </span>
          </Link>
        ))}
      </nav>

      <div
        className={`mt-auto flex items-center justify-between gap-5 border-t border-line pt-6 text-base transition-[opacity,translate] duration-600 ease-soft ${
          open ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-4 opacity-0 delay-0'
        }`}
      >
        <LangToggle locale={locale} label={t.langLabel} />
        <Link
          href={`${home}#contact`}
          onClick={onClose}
          className="flex items-center gap-1 text-navy underline hover:text-secondary"
        >
          {t.touch}
          <ArrowUpRight />
        </Link>
      </div>
    </div>
  )
}
