import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Booklet } from '@/components/booklet/Booklet'
import {
  BackCoverPage,
  ContentsPage,
  CoverPage,
  IntroPage,
  ProjectDetailsPage,
  ProjectVisualPage,
} from '@/components/booklet/pages'
import { PrintButton } from '@/components/booklet/PrintButton'
import { Header } from '@/components/layout/Header'
import { Mask } from '@/components/motion/Reveal'
import { getMessages, isLocale } from '@/i18n'
import { getProjects, getSiteSettings } from '@/lib/payload'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/projects/booklet'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getMessages(locale).booklet
  return { title: t.title.replace(/\.$/, ''), description: t.description }
}

/** All projects as a booklet to flip through; printing it gives an A5 PDF. */
export default async function BookletPage({ params }: PageProps<'/[locale]/projects/booklet'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [projects, site] = await Promise.all([getProjects(locale), getSiteSettings(locale)])
  const m = getMessages(locale)
  const t = m.booklet
  const base = `/${locale}`

  // Order keeps every project on one spread: cover (right), intro | contents,
  // then image page | details page per project, back cover alone on the left.
  // Page numbers count the cover as 1.
  const firstProjectPage = 4
  const pages = [
    <CoverPage key="cover" projects={projects} site={site} t={t} />,
    <IntroPage key="intro" site={site} t={t} n={2} />,
    <ContentsPage key="contents" projects={projects} firstPage={firstProjectPage} t={t} n={3} />,
    ...projects.flatMap((p, i) => [
      <ProjectVisualPage
        key={`${p.id}-a`}
        project={p}
        index={i}
        total={projects.length}
        projectsT={m.projects}
        t={t}
        n={firstProjectPage + i * 2}
      />,
      <ProjectDetailsPage
        key={`${p.id}-b`}
        project={p}
        projectT={m.project}
        t={t}
        n={firstProjectPage + i * 2 + 1}
      />,
    ]),
    <BackCoverPage
      key="back"
      site={site}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL}
      tagline={m.footer.tagline}
      t={t}
    />,
  ]

  return (
    <>
      {/* Only this route prints as A5 sheets without browser margins */}
      <style>{'@page { size: A5 portrait; margin: 0; }'}</style>

      <div className="print:hidden">
        <Header locale={locale} t={m.nav} back={{ fallbackHref: `${base}/projects` }} />
        <main
          id="main"
          className="flex h-dvh min-h-[560px] flex-col px-gutter pt-[100px] pb-6 md:pt-[110px]"
        >
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pb-6 pl-inset">
            <h1 className="m-0 text-[clamp(36px,4.2vw,60px)] leading-none font-bold text-black">
              <Mask delay={80}>{t.title}</Mask>
            </h1>
            <PrintButton label={t.download} />
          </div>
          <Booklet pages={pages} t={t} />
        </main>
      </div>

      {/* Flat page sequence for printing / "Save as PDF" */}
      <div className="hidden [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:block">
        {pages.map((p, i) => (
          <div key={i} className="break-after-page last:break-after-auto">
            {p}
          </div>
        ))}
      </div>
    </>
  )
}
