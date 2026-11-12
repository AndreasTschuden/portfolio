import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PrintButton } from '@/components/booklet/PrintButton'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Mask, Reveal } from '@/components/motion/Reveal'
import { PageStack } from '@/components/styleguide/PageStack'
import { ColorPage, LogoPage, TypePage } from '@/components/styleguide/pages'
import { getMessages, isLocale } from '@/i18n'
import { getSiteSettings } from '@/lib/payload'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/styleguide'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getMessages(locale).styleguide
  return { title: t.title, description: t.description }
}

/**
 * Corporate-design styleguide, linked from the footer next to the imprint. The three pages
 * are German in both locales (a school document); printing gives an A4 landscape PDF with
 * only the pages, without header and footer.
 */
export default async function StyleguidePage({ params }: PageProps<'/[locale]/styleguide'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const site = await getSiteSettings(locale)
  const m = getMessages(locale)
  const t = m.styleguide

  const pages = [
    <LogoPage key="logo" />,
    <ColorPage key="color" />,
    <TypePage key="type" />,
  ]

  return (
    <div>
      {/* Only this route prints as A4 landscape sheets without browser margins */}
      <style>{'@page { size: A4 landscape; margin: 0; }'}</style>

      <div className="print:hidden">
        <Header locale={locale} t={m.nav} back={{ fallbackHref: `/${locale}` }} />
      </div>
      <main id="main" className="[print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
        <section className="px-gutter pt-[140px] md:pt-[190px] print:hidden">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pl-inset">
            <div className="flex flex-col">
              <h1 className="m-0 text-[clamp(40px,13vw,64px)] leading-none font-bold text-black sm:text-h1">
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
            <Reveal delay={260}>
              <PrintButton label={t.download} />
            </Reveal>
          </div>
        </section>

        <section lang="de" className="px-gutter pt-12 md:pt-[70px] print:p-0">
          <div className="pl-inset print:pl-0">
            <PageStack pages={pages} />
          </div>
        </section>
      </main>
      <div className="print:hidden">
        <Footer locale={locale} site={site} t={m.footer} nav={m.nav} />
      </div>
    </div>
  )
}
