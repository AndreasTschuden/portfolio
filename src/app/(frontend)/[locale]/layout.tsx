import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { isLocale } from '@/i18n'
import { getSiteSettings } from '@/lib/payload'
import { mediaSrc } from '@/lib/media'

import '../globals.css'

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
    title: seo?.title || name || 'Portfolio',
    description: seo?.description ?? undefined,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
    icons: { icon: '/favicon.svg' },
    manifest: '/site.webmanifest',
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale} className={`scroll-smooth ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Satoshi is only on Fontshare */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
      </head>
      <body className="m-0 overflow-x-clip bg-white font-sans text-navy antialiased selection:bg-ice">
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
