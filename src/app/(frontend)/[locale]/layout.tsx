import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { isLocale } from '@/i18n'
import { getSiteSettings } from '@/lib/payload'
import { mediaSrc } from '@/lib/media'

import '../globals.css'

// Self-hosted: next/font serves both fonts from this site, no request goes to a font server.
const satoshi = localFont({
  src: [
    { path: '../fonts/satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/satoshi-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jetbrains',
})

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { seo, name } = await getSiteSettings(locale)
  const ogImage = mediaSrc(seo?.ogImage)

  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    title: {
      default: seo?.title || name || 'Portfolio',
      template: `%s · ${name || 'Portfolio'}`,
    },
    description: seo?.description ?? undefined,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
    icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
    manifest: '/site.webmanifest',
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale} className={`scroll-smooth ${satoshi.variable} ${jetbrains.variable}`}>
      <body className="m-0 overflow-x-clip bg-white font-sans text-navy antialiased selection:bg-ice">
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
