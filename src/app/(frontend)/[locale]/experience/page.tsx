import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ExperienceView, type Entry } from '@/components/experience/ExperienceView'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NextTeaser } from '@/components/layout/NextTeaser'
import { getMessages, isLocale } from '@/i18n'
import { getExperiences, getSiteSettings } from '@/lib/payload'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/experience'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getMessages(locale).experience.title }
}

export default async function ExperiencePage({ params }: PageProps<'/[locale]/experience'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [experiences, site] = await Promise.all([getExperiences(locale), getSiteSettings(locale)])
  const m = getMessages(locale)
  const t = m.experience
  const base = `/${locale}`

  const entries: Entry[] = experiences.map((e) => ({
    id: e.id,
    type: e.type,
    // endYear empty → ongoing ("Today")
    year: e.endYear || t.now,
    period: e.months ? `${e.months} ${e.startYear}` : `${e.startYear} – ${e.endYear || t.now}`,
    role: e.role,
    org: e.organisation ?? '',
    place: e.place ?? '',
    description: e.description ?? '',
    learned: (e.learned ?? []).map((l) => ({
      kind: l.kind ?? '',
      title: l.title ?? '',
      text: l.text ?? '',
    })),
  }))

  return (
    <div>
      <Header locale={locale} t={m.nav} back={{ fallbackHref: `${base}#about` }} />
      <ExperienceView entries={entries} t={t} />
      <section className="px-gutter pt-[60px]">
        <NextTeaser href={`${base}#projects`} label={t.nextLabel} title={t.next} />
      </section>
      <Footer name={site.name ?? ''} />
    </div>
  )
}
