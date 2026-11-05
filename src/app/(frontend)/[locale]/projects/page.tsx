import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NextTeaser } from '@/components/layout/NextTeaser'
import { BookOpen } from '@/components/icons'
import { Mask, Reveal } from '@/components/motion/Reveal'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getMessages, isLocale } from '@/i18n'
import { getProjects, getSiteSettings } from '@/lib/payload'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getMessages(locale).projects
  return { title: t.title.replace(/\.$/, ''), description: t.description }
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
      <main id="main">
        <section className="px-gutter pt-[140px] md:pt-[190px]">
          <div className="flex flex-wrap items-end justify-between gap-x-20 gap-y-6 pl-inset">
            <h1 className="m-0 text-h1 leading-none font-bold text-black">
              <Mask delay={80}>{t.title}</Mask>
            </h1>
            <Reveal delay={200}>
              <Link
                href={`${base}/projects/booklet`}
                className="group flex items-center gap-3 rounded-full bg-mist py-2 pr-2 pl-6 text-base text-navy no-underline transition-colors duration-400 hover:bg-navy hover:text-white"
              >
                {t.booklet}
                <span className="flex size-10 items-center justify-center rounded-full bg-white text-navy transition-transform duration-600 ease-soft group-hover:rotate-[-8deg]">
                  <BookOpen />
                </span>
              </Link>
            </Reveal>
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
      </main>
      <Footer locale={locale} site={site} t={m.footer} nav={m.nav} />
    </div>
  )
}
