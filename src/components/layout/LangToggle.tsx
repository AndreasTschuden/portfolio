'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { switchLocalePath, type Locale } from '@/i18n'

export function LangToggle({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  // Moves the thumb right away; the route change follows.
  const [shown, setShown] = useState(locale)

  const toggle = () => {
    const next: Locale = shown === 'en' ? 'de' : 'en'
    setShown(next)
    startTransition(() =>
      // replace: switching the language is not a step "Back" should undo
      router.replace(switchLocalePath(pathname, next) + window.location.hash, { scroll: false }),
    )
  }

  const item = (l: Locale) =>
    `relative flex h-7 w-[38px] items-center justify-center transition-colors duration-300 ${
      shown === l ? 'text-white' : 'text-navy'
    }`

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="relative flex cursor-pointer items-center rounded-full border-0 bg-mist p-[3px] text-sm font-medium"
    >
      <span
        className={`absolute top-[3px] left-[3px] h-7 w-[38px] rounded-full bg-navy transition-transform duration-450 ease-soft ${
          shown === 'de' ? 'translate-x-[38px]' : 'translate-x-0'
        }`}
      />
      <span className={item('en')}>EN</span>
      <span className={item('de')}>DE</span>
    </button>
  )
}
