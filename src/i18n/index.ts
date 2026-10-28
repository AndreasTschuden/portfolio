import de from './messages/de.json'
import en from './messages/en.json'

export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export type Messages = typeof en

const messages: Record<Locale, Messages> = { en, de }

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

export const getMessages = (locale: Locale): Messages => messages[locale]

/** Swaps the leading locale segment of a pathname, e.g. /en/projects → /de/projects. */
export const switchLocalePath = (pathname: string, locale: Locale): string => {
  const [, , ...rest] = pathname.split('/')
  return `/${[locale, ...rest].join('/')}`.replace(/\/$/, '') || `/${locale}`
}
