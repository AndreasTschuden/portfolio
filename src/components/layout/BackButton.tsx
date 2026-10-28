'use client'

import { useRouter } from 'next/navigation'

import { switchLocalePath, type Locale } from '@/i18n'

import { ArrowBack } from '../icons'
import { previousPath } from './history'

type Props = {
  locale: Locale
  label: string
  /** Used when the page was opened directly, e.g. from a search result */
  fallbackHref: string
  underlineClassName: string
}

/** Goes back to the page the visitor came from on this site. */
export function BackButton({ locale, label, fallbackHref, underlineClassName }: Props) {
  const router = useRouter()

  const goBack = () => {
    const prev = previousPath()
    if (!prev) router.push(fallbackHref)
    // The language was switched since: open the previous page in the current language.
    else if (!prev.startsWith(`/${locale}`)) router.push(switchLocalePath(prev, locale))
    else router.back()
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-base text-navy hover:text-secondary"
    >
      <ArrowBack />
      <span className={`pb-0.5 ${underlineClassName}`}>{label}</span>
    </button>
  )
}
