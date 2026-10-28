'use client'

import Link from 'next/link'
import { useCallback, useRef, useState, type ReactNode } from 'react'

import type { Locale, Messages } from '@/i18n'

import { ArrowBack, ArrowUpRight, Logo } from '../icons'
import { useScrollFrame } from '../motion/useScrollFrame'
import { LangToggle } from './LangToggle'
import { MenuButton, MobileMenu } from './MobileMenu'

/** Underline that grows from the left on hover. */
const hoverUnderline =
  'bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-position-[0_100%] bg-size-[0%_1px] transition-[background-size] duration-400 ease-soft hover:bg-size-[100%_1px]'

type Props = {
  locale: Locale
  t: Messages['nav']
  /** Home shows the section links, sub pages a back link. */
  back?: { href: string; label: string }
}

export function Header({ locale, t, back }: Props) {
  const [solid, setSolid] = useState(false)
  const solidRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = () => setMenuOpen((o) => !o)

  useScrollFrame(({ y }) => {
    const next = y > 30
    if (next !== solidRef.current) {
      solidRef.current = next
      setSolid(next)
    }
  })

  const home = `/${locale}`

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          solid && !menuOpen
            ? 'bg-white/88 shadow-[0_1px_0_var(--color-line)] backdrop-blur-[12px]'
            : 'bg-transparent'
        }`}
      >
        {back ? (
          <div className="flex items-center gap-[34px] px-gutter pt-[35px] pb-5">
            <Link href={home} aria-label={t.home} onClick={closeMenu} className="flex text-navy">
              <Logo />
            </Link>
            <Link
              href={back.href}
              className="mt-1.5 flex items-center gap-1 self-start text-base text-navy no-underline hover:text-secondary"
            >
              <ArrowBack />
              <span className={`pb-0.5 ${hoverUnderline}`}>{back.label}</span>
            </Link>
            <Actions locale={locale} t={t} contactHref={`${home}#contact`} className="mt-1.5" />
            <MenuButton open={menuOpen} onToggle={toggleMenu} t={t} />
          </div>
        ) : (
          <div className="flex items-center gap-[clamp(20px,4vw,56px)] px-gutter pt-7 pb-6">
            <a href="#top" aria-label={t.home} onClick={closeMenu} className="flex text-navy">
              <Logo />
            </a>
            <nav className="hidden flex-wrap gap-[clamp(20px,4vw,72px)] text-base md:flex">
              <NavLink href="#about">{t.about}</NavLink>
              <NavLink href="#projects">{t.projects}</NavLink>
              <NavLink href={`${home}/experience`}>{t.experience}</NavLink>
            </nav>
            <Actions locale={locale} t={t} contactHref="#contact" />
            <MenuButton open={menuOpen} onToggle={toggleMenu} t={t} />
          </div>
        )}
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} locale={locale} t={t} />
    </>
  )
}

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className={`pb-[3px] text-navy no-underline hover:text-secondary ${hoverUnderline}`}
  >
    {children}
  </Link>
)

function Actions({
  locale,
  t,
  contactHref,
  className = '',
}: Pick<Props, 'locale' | 't'> & { contactHref: string; className?: string }) {
  return (
    <div className={`ml-auto hidden items-center gap-10 text-base md:flex ${className}`}>
      <LangToggle locale={locale} label={t.langLabel} />
      <Link
        href={contactHref}
        className="flex items-center gap-1 text-navy underline hover:text-secondary"
      >
        {t.touch}
        <ArrowUpRight />
      </Link>
    </div>
  )
}
