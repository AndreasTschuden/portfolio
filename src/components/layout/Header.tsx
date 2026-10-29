'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import type { Locale, Messages } from '@/i18n'

import { ArrowUpRight, Logo } from '../icons'
import { useScrollFrame } from '../motion/useScrollFrame'
import { BackButton } from './BackButton'
import { recordPath } from './history'
import { LangToggle } from './LangToggle'
import { MenuButton, MobileMenu } from './MobileMenu'

/** Underline that grows from the left on hover. */
const hoverUnderline =
  'bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-position-[0_100%] bg-size-[0%_1px] transition-[background-size] duration-400 ease-soft hover:bg-size-[100%_1px]'

type Props = {
  locale: Locale
  t: Messages['nav']
  /** Sub pages show a back button next to the logo; `fallbackHref` is used without in-site history. */
  back?: { fallbackHref: string }
}

export function Header({ locale, t, back }: Props) {
  const [solid, setSolid] = useState(false)
  const solidRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = () => setMenuOpen((o) => !o)
  const pathname = usePathname()

  useEffect(() => recordPath(pathname), [pathname])

  useScrollFrame(({ y }) => {
    const next = y > 30
    if (next !== solidRef.current) {
      solidRef.current = next
      setSolid(next)
    }
  })

  const home = `/${locale}`
  // With the back link the inline nav needs more room, so the burger stays up to lg.
  const desktop = back ? 'lg' : 'md'
  const onHome = !back
  const links = [
    { href: onHome ? '#about' : `${home}#about`, label: t.about, current: false },
    {
      href: `${home}/projects`,
      label: t.projects,
      current: pathname.includes('/projects'),
    },
    { href: `${home}/experience`, label: t.experience, current: pathname.endsWith('/experience') },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          solid && !menuOpen
            ? 'bg-white/88 shadow-[0_1px_0_var(--color-line)] backdrop-blur-[12px]'
            : 'bg-transparent'
        }`}
      >
        <div
          className={`flex items-center px-gutter ${
            back ? 'gap-[34px] pt-[35px] pb-5' : 'gap-[clamp(20px,4vw,56px)] pt-7 pb-6'
          }`}
        >
          {onHome ? (
            <a href="#top" aria-label={t.home} onClick={closeMenu} className="flex text-navy">
              <Logo />
            </a>
          ) : (
            <Link href={home} aria-label={t.home} onClick={closeMenu} className="flex text-navy">
              <Logo />
            </Link>
          )}
          {back && (
            <>
              <BackButton
                locale={locale}
                label={t.back}
                fallbackHref={back.fallbackHref}
                underlineClassName={hoverUnderline}
              />
              <span aria-hidden className="hidden h-5 w-px bg-line lg:block" />
            </>
          )}
          <nav
            className={`hidden flex-wrap gap-[clamp(20px,4vw,72px)] text-base ${
              desktop === 'lg' ? 'lg:flex' : 'md:flex'
            }`}
          >
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} current={l.current}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div
            className={`ml-auto hidden items-center gap-10 text-base ${
              desktop === 'lg' ? 'lg:flex' : 'md:flex'
            }`}
          >
            <LangToggle locale={locale} label={t.langLabel} />
            <Link
              href={onHome ? '#contact' : `${home}#contact`}
              className="flex items-center gap-1 text-navy underline hover:text-secondary"
            >
              {t.touch}
              <ArrowUpRight />
            </Link>
          </div>
          <MenuButton open={menuOpen} onToggle={toggleMenu} t={t} desktop={desktop} />
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} locale={locale} t={t} desktop={desktop} />
    </>
  )
}

const NavLink = ({
  href,
  current,
  children,
}: {
  href: string
  current: boolean
  children: ReactNode
}) => (
  <Link
    href={href}
    aria-current={current ? 'page' : undefined}
    className={`pb-[3px] text-navy no-underline hover:text-secondary ${hoverUnderline} ${
      current ? 'bg-size-[100%_1px]' : ''
    }`}
  >
    {children}
  </Link>
)
