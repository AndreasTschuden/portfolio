import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/home/ContactForm'
import { Hero } from '@/components/home/Hero'
import { Loader } from '@/components/home/Loader'
import { ProjectsScroller } from '@/components/home/ProjectsScroller'
import { Services } from '@/components/home/Services'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Mask, Reveal } from '@/components/motion/Reveal'
import { TechLogo } from '@/components/TechLogo'
import { getMessages, isLocale } from '@/i18n'
import { mediaSrc, populated, populatedList } from '@/lib/media'
import { getHome, getProjects, getSiteSettings } from '@/lib/payload'
import type { Technology } from '@/payload-types'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [home, site, projects] = await Promise.all([
    getHome(locale),
    getSiteSettings(locale),
    getProjects(locale, true),
  ])
  const m = getMessages(locale)
  const t = m.home
  const name = site.name ?? ''
  const base = `/${locale}`
  const portrait = populated(home.hero?.portrait)
  const portraitSrc = mediaSrc(portrait)
  const cv = mediaSrc(home.about?.cv)
  const headline = (site.contactHeadline ?? []).map((l) => l.line ?? '')

  return (
    <div>
      <Loader name={name} />
      <Header locale={locale} t={m.nav} />

      <Hero
        role={home.hero?.role ?? ''}
        year={new Date().getFullYear()}
        stats={(home.hero?.stats ?? []).map((s) => ({ value: s.value ?? 0, label: s.label ?? '' }))}
        hello={t.hello}
        intro={home.hero?.intro ?? ''}
        scrollDown={t.scrollDown}
        portrait={portrait && portraitSrc ? { src: portraitSrc, alt: portrait.alt || name } : null}
      />

      <section
        id="about"
        className="flex flex-wrap items-start justify-between gap-x-20 gap-y-12 px-gutter pt-20 md:gap-y-[60px] md:pt-[110px]"
      >
        <div className="flex max-w-[560px] flex-[1_1_420px] flex-col gap-5">
          <h2 className="m-0 text-h2 leading-[1.1] font-medium text-navy">
            <Mask>{t.about}</Mask>
          </h2>
          <Reveal
            delay={120}
            className="flex flex-col gap-[22px] text-base leading-[1.4] text-pretty text-black"
          >
            {(home.about?.paragraphs ?? []).map((p, i) => (
              <p key={p.id ?? i} className="m-0">
                {p.text}
              </p>
            ))}
          </Reveal>
          <Reveal delay={220} className="mt-[22px] flex gap-9 text-base">
            {cv && (
              <a
                href={cv}
                download
                className="flex items-center gap-1 text-navy underline hover:text-secondary"
              >
                {t.cv}
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M8.5 3v8M5 7.5l3.5 3.5L12 7.5M3.5 13.5h10" />
                </svg>
              </a>
            )}
            <Link
              href={`${base}/experience`}
              className="flex items-center gap-1 text-navy underline hover:text-secondary"
            >
              {m.nav.experience}
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M3 5h11M3 8.5h8M3 12h5" />
              </svg>
            </Link>
          </Reveal>
        </div>
        <Services
          services={(home.services ?? []).map((s) => ({
            title: s.title ?? '',
            text: s.text ?? '',
          }))}
        />
      </section>

      <section className="pt-28 md:pt-[170px]">
        <div className="px-gutter">
          <h2 className="m-0 text-h2 leading-[1.1] font-medium text-navy">
            <Mask>{t.stack}</Mask>
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 px-gutter pt-8 md:gap-5 md:pt-12">
          {(home.stackGroups ?? []).map((g, i) => (
            <Reveal
              key={g.id ?? i}
              delay={i * 90}
              className="flex flex-col gap-[26px] rounded-[20px] px-[22px] pt-[22px] pb-[26px] shadow-[inset_0_0_0_1px_var(--color-line)]"
            >
              <span className="text-lg font-bold text-navy">{g.label}</span>
              <div className="flex flex-wrap gap-x-[22px] gap-y-[18px]">
                {populatedList<Technology>(g.technologies).map((tech) => (
                  <TechLogo key={tech.id} tech={tech} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ProjectsScroller
        intro={home.projectsIntro ?? ''}
        allHref={`${base}/projects`}
        t={{
          projects: t.projects,
          seeMore: t.seeMore,
          scroll: t.scroll,
          allProjects: t.allProjects,
        }}
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          href: `${base}/projects/${p.slug}`,
          stack: populatedList<Technology>(p.technologies)
            .slice(0, 2)
            .map((tech) => tech.name)
            .join('  ·  '),
          cover: mediaSrc(p.coverImage),
        }))}
      />

      <section
        id="contact"
        className="flex flex-wrap gap-x-[60px] gap-y-16 px-gutter pt-28 md:gap-y-[60px] md:pt-[170px]"
      >
        <div className="flex max-w-[560px] flex-[1_1_360px] flex-col justify-between gap-12 md:gap-20">
          <h2 className="m-0 text-h2 leading-[1.35] font-bold text-black">
            {headline.map((line, i) => (
              <Mask
                key={i}
                delay={i * 90}
                innerClassName={i === headline.length - 1 && i > 0 ? 'text-secondary' : ''}
              >
                {line}
              </Mask>
            ))}
          </h2>
          <Reveal delay={200} className="flex flex-col gap-[30px] text-base">
            {site.phone && (
              <div className="flex flex-col gap-1.5">
                <span className="font-medium text-black">{t.phone}</span>
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                  className="text-ash no-underline"
                >
                  {site.phone}
                </a>
              </div>
            )}
            {site.email && (
              <div className="flex flex-col gap-1.5">
                <span className="font-medium text-black">{t.other}</span>
                <a href={`mailto:${site.email}`} className="text-ash no-underline">
                  {site.email}
                </a>
              </div>
            )}
          </Reveal>
        </div>
        <ContactForm locale={locale} note={site.contactFormNote ?? ''} t={t} />
      </section>

      <Footer name={name} />
    </div>
  )
}
