import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NextTeaser } from '@/components/layout/NextTeaser'
import { Mask, Reveal } from '@/components/motion/Reveal'
import { CaseCards } from '@/components/projects/CaseCards'
import { ScreenSlider } from '@/components/projects/ScreenSlider'
import { TechLogo } from '@/components/TechLogo'
import { getMessages, isLocale, type Locale } from '@/i18n'
import { mediaSrc, populatedList } from '@/lib/media'
import { getProjects, getSiteSettings } from '@/lib/payload'
import type { Media, Technology } from '@/payload-types'

type Props = PageProps<'/[locale]/projects/[slug]'>

/** The project plus the one after it (by `order`, wrapping around to the first). */
async function findProject(locale: Locale, slug: string) {
  const projects = await getProjects(locale)
  const i = projects.findIndex((p) => p.slug === slug)
  if (i < 0) return null
  return {
    project: projects[i],
    next: projects.length > 1 ? projects[(i + 1) % projects.length] : null,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const found = await findProject(locale, slug)
  if (!found) return {}
  return { title: found.project.title, description: found.project.description ?? undefined }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const [found, site] = await Promise.all([findProject(locale, slug), getSiteSettings(locale)])
  if (!found) notFound()
  const { project, next } = found
  const m = getMessages(locale)
  const t = m.project
  const base = `/${locale}`

  const buildWith = populatedList<Media>(project.buildWith).filter((img) => img.url)
  const techs = populatedList<Technology>(project.technologies)
  const cs = project.caseStudy
  const cases = [cs?.problem, cs?.solution, cs?.outcome].map((text, k) => ({
    title: t.cases[k],
    text: text ?? '',
  }))
  const screens = (project.screens ?? []).map((s) => ({
    desktop: mediaSrc(s.desktop),
    mobile: mediaSrc(s.mobile),
    label: s.label ?? '',
  }))

  return (
    <div>
      <Header locale={locale} t={m.nav} back={{ fallbackHref: `${base}/projects` }} />

      <section className="px-gutter pt-[140px] md:pt-[190px]">
        <div className="flex flex-col pl-inset">
          <h1 className="m-0 text-h1 leading-none font-bold text-black">
            <Mask delay={80} innerClassName="-mb-[.22em] pb-[.22em]">
              {project.title}
            </Mask>
          </h1>
          {project.description && (
            <Reveal
              as="p"
              delay={200}
              className="mt-7 mb-0 max-w-[1080px] text-base leading-[1.38] text-pretty text-black"
            >
              {project.description}
            </Reveal>
          )}
          {(buildWith.length > 0 || techs.length > 0) && (
            <>
              <h2 className="mt-10 mb-0 text-[28px] md:text-4xl leading-[1.3] font-medium text-navy">
                <Mask>{t.build}</Mask>
              </h2>
              {buildWith.length > 0 ? (
                <div className="mt-[22px] -ml-[30px] flex flex-wrap gap-x-4">
                  {buildWith.map((img, i) => (
                    <Reveal
                      key={i}
                      type="wipe"
                      delay={100 + i * 160}
                      className="relative aspect-[390/72] w-[390px] max-w-full"
                    >
                      <Image
                        src={img.url!}
                        alt={img.alt}
                        fill
                        loading="eager"
                        sizes="390px"
                        className="object-cover"
                      />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Reveal
                  type="wipe"
                  delay={100}
                  className="mt-[22px] flex min-h-[72px] flex-wrap items-center gap-x-[22px] gap-y-[18px]"
                >
                  {techs.map((tech) => (
                    <TechLogo key={tech.id} tech={tech} />
                  ))}
                </Reveal>
              )}
            </>
          )}
        </div>

        {cases.some((c) => c.text) && <CaseCards cases={cases} />}
      </section>

      {screens.length > 0 && <ScreenSlider screens={screens} t={t} />}

      {next && (
        <section className="px-gutter pt-24 md:pt-[150px]">
          <NextTeaser
            href={`${base}/projects/${next.slug}`}
            label={t.nextProject}
            title={next.title}
            labelClassName="text-steel"
          />
        </section>
      )}

      <Footer name={site.name ?? ''} />
    </div>
  )
}
