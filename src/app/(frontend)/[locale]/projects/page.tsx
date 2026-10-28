import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NextTeaser } from '@/components/layout/NextTeaser'
import { Mask } from '@/components/motion/Reveal'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getMessages, isLocale } from '@/i18n'
import { getProjects, getSiteSettings } from '@/lib/payload'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getMessages(locale).projects.title }
}

export default async function ProjectsPage({ params }: PageProps<'/[locale]/projects'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [projects, site] = await Promise.all([getProjects(locale), getSiteSettings(locale)])
  const m = getMessages(locale)
  const t = m.projects
  const base = `/${locale}`

  return (
    <div>
      <Header locale={locale} t={m.nav} back={{ fallbackHref: `${base}#projects` }} />

      <section className="px-gutter pt-[140px] md:pt-[190px]">
        <div className="flex flex-wrap items-end justify-between gap-x-20 gap-y-6 pl-inset">
          <h1 className="m-0 text-h1 leading-none font-bold text-black">
            <Mask delay={80} innerClassName="-mb-[.22em] pb-[.22em]">
              {t.title}
            </Mask>
          </h1>
        </div>
      </section>

      <section className="px-gutter pt-12 md:pt-20">
        <div className="flex flex-col gap-[clamp(20px,2.5vw,32px)]">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              href={`${base}/projects/${p.slug}`}
              t={t}
            />
          ))}
        </div>
      </section>

      <section className="px-gutter pt-24 md:pt-[140px]">
        <NextTeaser href={`${base}/experience`} label={t.nextLabel} title={t.next} />
      </section>

      <Footer name={site.name ?? ''} />
    </div>
  )
}
