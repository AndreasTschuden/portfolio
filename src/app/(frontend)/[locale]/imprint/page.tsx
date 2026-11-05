import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NextTeaser } from '@/components/layout/NextTeaser'
import { Mask, Reveal } from '@/components/motion/Reveal'
import { getMessages, isLocale } from '@/i18n'
import { pad } from '@/lib/media'
import { getSiteSettings } from '@/lib/payload'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/imprint'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getMessages(locale).imprint
  return { title: t.title.replace(/\.$/, ''), description: t.description }
}

export default async function ImprintPage({ params }: PageProps<'/[locale]/imprint'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const site = await getSiteSettings(locale)
  const m = getMessages(locale)
  const t = m.imprint
  const base = `/${locale}`

  const rows: { title: string; content: ReactNode }[] = [
    {
      title: t.owner,
      content: (
        <p className="m-0">
          <span className="font-medium text-black">{site.name}</span>
          {site.location && (
            <>
              <br />
              {site.location}
            </>
          )}
        </p>
      ),
    },
    {
      title: t.contact,
      content: (
        <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-2">
          {site.email && (
            <>
              <dt className="text-ash">{t.email}</dt>
              <dd className="m-0">
                <a
                  href={`mailto:${site.email}`}
                  className="break-words text-navy underline hover:text-secondary"
                >
                  {site.email}
                </a>
              </dd>
            </>
          )}
          {site.phone && (
            <>
              <dt className="text-ash">{t.phone}</dt>
              <dd className="m-0">
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                  className="text-navy underline hover:text-secondary"
                >
                  {site.phone}
                </a>
              </dd>
            </>
          )}
        </dl>
      ),
    },
    ...t.sections.map((s) => ({ title: s.title, content: <p className="m-0">{s.text}</p> })),
  ]

  return (
    <div>
      <Header locale={locale} t={m.nav} back={{ fallbackHref: base }} />
      <main id="main">
        <section className="px-gutter pt-[140px] md:pt-[190px]">
          <div className="flex flex-col pl-inset">
            <h1 className="m-0 text-[clamp(40px,13vw,64px)] leading-none sm:text-h1 font-bold text-black">
              <Mask delay={80}>{t.title}</Mask>
            </h1>
            <Reveal
              as="p"
              delay={200}
              className="mt-7 mb-0 max-w-[720px] text-base leading-[1.38] text-pretty text-black"
            >
              {t.intro}
            </Reveal>
          </div>
        </section>

        <section className="px-gutter pt-16 md:pt-[90px]">
          <div className="pl-inset">
            {rows.map((row, i) => (
              <Reveal
                key={row.title}
                delay={Math.min(i, 3) * 70}
                className="grid gap-x-[clamp(16px,2vw,32px)] gap-y-3 border-t border-line py-8 md:grid-cols-[clamp(120px,22vw,320px)_minmax(0,1fr)] md:py-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-steel">{pad(i + 1)}</span>
                  <h2 className="m-0 text-xl leading-[1.25] font-medium text-navy">{row.title}</h2>
                </div>
                <div className="max-w-[680px] text-base leading-[1.5] text-pretty text-black">
                  {row.content}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="px-gutter pt-[60px] md:pt-[90px]">
          <NextTeaser href={`${base}#contact`} label={t.nextLabel} title={t.next} />
        </section>
      </main>
      <Footer locale={locale} site={site} t={m.footer} nav={m.nav} />
    </div>
  )
}
