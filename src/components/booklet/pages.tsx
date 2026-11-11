import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Messages } from '@/i18n'
import { mediaImage, mediaSrc, pad, populatedList, techIconSrc } from '@/lib/media'
import { teamLabel } from '@/lib/project'
import { cardTheme } from '@/lib/themes'
import type { Project, Technology } from '@/payload-types'

import { Logo } from '../icons'

/*
 * Booklet pages in A5 (148 × 210 mm). The viewer scales them on screen; printing
 * ("Save as PDF") lays them out one per sheet at their real size.
 */

type T = Messages['booklet']
type Site = {
  name?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
}

const Label = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`font-mono text-[9.5px] tracking-[.08em] uppercase ${className}`}>
    {children}
  </span>
)

/** Page number in the outer bottom corner. */
const Folio = ({
  n,
  side,
  className,
}: {
  n: number
  side: 'left' | 'right'
  className: string
}) => (
  <span
    className={`absolute bottom-[26px] font-mono text-[9.5px] tracking-[.08em] ${className} ${
      side === 'left' ? 'left-[40px]' : 'right-[40px]'
    }`}
  >
    {pad(n)}
  </span>
)

const Page = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div
    className={`relative flex h-[210mm] w-[148mm] flex-col overflow-hidden px-[40px] pt-[40px] pb-[56px] font-sans ${className}`}
  >
    {children}
  </div>
)

export function CoverPage({ projects, site, t }: { projects: Project[]; site: Site; t: T }) {
  const covers = projects
    .map((p) => mediaImage(p.coverImage))
    .filter((c) => c !== null)
    .slice(0, 3)

  return (
    <Page className="bg-navy text-white">
      <Logo className="text-white" />

      {/* Fanned cover images, like cards laid on a table */}
      <div className="relative mt-[48px] h-[300px]">
        {covers.map((c, k) => {
          const pos = [
            'left-[6px] top-[38px] -rotate-[7deg]',
            'left-[150px] top-[0px] rotate-[2deg]',
            'left-[78px] top-[118px] -rotate-[1deg]',
          ][k]
          return (
            <div
              key={c.src}
              className={`absolute w-[300px] overflow-hidden rounded-[12px] bg-secondary shadow-[0_18px_40px_-14px_rgba(0,0,0,.55)] ring-1 ring-white/10 print:shadow-none ${pos}`}
              style={{ aspectRatio: c.ratio ?? 658 / 422 }}
            >
              <Image
                src={c.src}
                alt=""
                fill
                sizes="700px"
                loading="eager"
                className="object-cover"
              />
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <h1 className="m-0 text-[78px] leading-[.92] font-bold tracking-[-.01em]">
          {t.coverTitle}
        </h1>
        {site.name && <span className="text-[17px] font-medium text-mist/80">{site.name}</span>}
      </div>
      <span
        aria-hidden
        className="absolute right-[34px] bottom-[18px] text-[150px] leading-[.8] font-bold text-mist/10"
      >
        {pad(projects.length)}
      </span>
    </Page>
  )
}

export function IntroPage({ site, t, n }: { site: Site; t: T; n: number }) {
  return (
    <Page className="bg-white text-navy">
      <Label className="text-steel">{t.aboutLabel}</Label>
      <p className="mt-[110px] mb-0 text-[25px] leading-[1.28] font-medium text-balance text-black">
        {t.intro}
      </p>
      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-5 text-[12px]">
        {site.name && <span className="font-medium text-black">{site.name}</span>}
        {site.location && <span className="text-ash">{site.location}</span>}
      </div>
      <Folio n={n} side="left" className="text-steel" />
    </Page>
  )
}

export function ContentsPage({
  projects,
  firstPage,
  t,
  n,
}: {
  projects: Project[]
  /** Page number where the first project starts */
  firstPage: number
  t: T
  n: number
}) {
  return (
    <Page className="bg-white text-navy">
      <h2 className="m-0 text-[48px] leading-none font-bold text-black">{t.contents}</h2>
      <ol className="m-0 mt-[44px] flex list-none flex-col p-0">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className="flex items-baseline gap-4 border-t border-line py-[11px] last:border-b"
          >
            <span className="w-[22px] font-mono text-[10px] text-steel">{pad(i + 1)}</span>
            <span className="min-w-0 flex-1 truncate text-[16px] font-medium text-navy">
              {p.title}
            </span>
            {p.year && <span className="text-[11px] text-ash">{p.year}</span>}
            <span className="w-[22px] text-right font-mono text-[10px] text-steel">
              {pad(firstPage + i * 2)}
            </span>
          </li>
        ))}
      </ol>
      <Folio n={n} side="right" className="text-steel" />
    </Page>
  )
}

/** Left page of a project spread: everything there is to read about the project. */
export function ProjectTextPage({
  project,
  index,
  total,
  projectsT,
  projectT,
  t,
  n,
}: {
  project: Project
  index: number
  total: number
  projectsT: Messages['projects']
  projectT: Messages['project']
  t: T
  n: number
}) {
  const meta = [
    [projectsT.year, project.year],
    [projectsT.role, project.role],
    [projectsT.team, teamLabel(project.teamSize, projectsT)],
  ].filter(([, value]) => value)
  const techs = populatedList<Technology>(project.technologies)
  const cs = project.caseStudy
  const cases = [cs?.problem, cs?.solution, cs?.outcome]
    .map((text, k) => ({ title: projectT.cases[k], text }))
    .filter((c) => c.text)
  const links = [
    [t.live, project.liveUrl],
    [t.repo, project.repoUrl],
  ].filter((l): l is [string, string] => Boolean(l[1]))

  return (
    <Page className="bg-white text-navy">
      <Label className="text-steel">
        {t.project} {pad(index + 1)} / {pad(total)}
      </Label>
      <h2 className="m-0 mt-[14px] text-[28px] leading-[1.1] font-bold text-black">
        {project.title}
      </h2>
      {project.description && (
        <p className="mt-[10px] mb-0 text-[11px] leading-[1.5] text-pretty text-black/80">
          {project.description}
        </p>
      )}

      {meta.length > 0 && (
        <div className="mt-[16px] grid grid-cols-3 gap-4 border-t border-line pt-[10px]">
          {meta.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-[3px]">
              <span className="text-[9.5px] text-steel">{label}</span>
              <span className="text-[11.5px] font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}

      {techs.length > 0 && (
        <div className="mt-[16px] border-t border-line pt-[10px]">
          <h3 className="m-0 text-[15px] leading-[1.2] font-medium">{t.build}</h3>
          <ul className="m-0 mt-[10px] flex list-none flex-wrap gap-x-[14px] gap-y-[8px] p-0">
            {techs.map((tech) => (
              <li key={tech.id} className="flex items-center gap-[6px] text-[10px] leading-none">
                <TechIcon tech={tech} />
                {tech.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-[16px] flex flex-col gap-[10px]">
        {cases.map((c, k) => (
          <section key={c.title} className="border-t border-line pt-[9px]">
            <div className="flex items-baseline gap-[10px]">
              <span className="font-mono text-[9.5px] text-steel">{pad(k + 1)}</span>
              <h4 className="m-0 text-[13px] font-medium">{c.title}</h4>
            </div>
            <p className="mt-[4px] mb-0 text-[10px] leading-[1.5] text-pretty text-black/80">
              {c.text}
            </p>
          </section>
        ))}
      </div>

      {links.length > 0 && (
        <div className="mt-auto flex flex-col gap-1 pt-4">
          {links.map(([label, url]) => (
            <a key={url} href={url} className="flex gap-3 text-[10px] text-navy no-underline">
              <span className="w-[30px] font-mono text-steel uppercase">{label}</span>
              <span className="truncate underline">{url.replace(/^https?:\/\//, '')}</span>
            </a>
          ))}
        </div>
      )}
      <Folio n={n} side="left" className="text-steel" />
    </Page>
  )
}

/**
 * Right page of a project spread: up to three screens on the project's card color, one large
 * and two side by side below. Each keeps its own shape, so no part of a screen is cut off.
 */
export function ProjectImagesPage({
  project,
  index,
  qr,
  t,
  n,
}: {
  project: Project
  index: number
  /** Link to the project's page and its QR code as SVG markup */
  qr: { url: string; svg: string }
  t: T
  n: number
}) {
  const theme = cardTheme(index)
  const images = [
    ...(project.screens ?? []).map((s) => mediaImage(s.desktop)),
    mediaImage(project.coverImage),
  ]
    .filter((img) => img !== null)
    .filter((img, k, all) => all.findIndex((o) => o.src === img.src) === k)
    .slice(0, 3)

  // The first screen full width, the next two side by side
  const rows = images.length === 3 ? [[images[0]], [images[1], images[2]]] : images.map((i) => [i])

  return (
    <Page className={theme.bg}>
      <div className="my-auto flex flex-col gap-[14px]">
        {rows.map((row, r) => (
          <div key={r} className="flex items-start gap-[14px]">
            {row.map((img) => (
              <div
                key={img.src}
                className={`relative min-w-0 flex-1 overflow-hidden rounded-[10px] ${theme.img} shadow-[0_14px_30px_-16px_rgba(0,0,0,.45)] print:shadow-none`}
                style={{ aspectRatio: img.ratio ?? 16 / 10 }}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes={row.length === 1 ? '900px' : '450px'}
                  loading="eager"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Scan to open the project on the portfolio, centered at the foot of the page */}
      <a
        href={qr.url}
        className={`mx-auto flex flex-col items-center gap-[10px] pt-[18px] text-center no-underline ${theme.ink}`}
      >
        <span className="block rounded-[8px] bg-white p-[7px] shadow-[0_10px_24px_-14px_rgba(0,0,0,.45)] print:shadow-none">
          {/* SVG generated on the server by the qrcode package from our own URL */}
          <span
            aria-hidden
            className="block size-[68px] [&>svg]:block [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: qr.svg }}
          />
        </span>
        <span className="text-[11px] font-medium">{t.scan}</span>
      </a>
      <Folio n={n} side="right" className={theme.light ? 'text-steel' : 'text-mist/60'} />
    </Page>
  )
}

export function BackCoverPage({
  site,
  siteUrl,
  tagline,
  t,
}: {
  site: Site
  siteUrl?: string
  tagline: string
  t: T
}) {
  const host = siteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const contact = [
    site.email && { href: `mailto:${site.email}`, label: site.email },
    site.phone && { href: `tel:${site.phone.replace(/[^+\d]/g, '')}`, label: site.phone },
    host && siteUrl && { href: siteUrl, label: host },
  ].filter((c): c is { href: string; label: string } => Boolean(c))

  return (
    <Page className="bg-navy text-white">
      <Logo className="text-white" />
      <p className="mt-[150px] mb-0 text-[34px] leading-[1.2] font-medium text-balance">
        {tagline}
      </p>
      <div className="mt-auto flex flex-col gap-3">
        <Label className="text-mist/60">{t.contact}</Label>
        {contact.map((c) => (
          <a key={c.href} href={c.href} className="w-fit text-[14px] text-white no-underline">
            {c.label}
          </a>
        ))}
        <span className="mt-6 border-t border-white/15 pt-4 text-[10px] text-mist/60">
          © {new Date().getFullYear()} {site.name}
        </span>
      </div>
    </Page>
  )
}

/** Small monochrome logo; uploaded icons are a mask so they take the navy color too. */
function TechIcon({ tech }: { tech: Technology }) {
  const custom = mediaSrc(tech.icon)
  if (custom)
    return (
      <span
        aria-hidden
        className="block size-[19px] shrink-0 bg-navy"
        style={{ mask: `url("${custom}") center / contain no-repeat` }}
      />
    )
  // eslint-disable-next-line @next/next/no-img-element -- fallback SVG from simpleicons.org
  return <img src={techIconSrc(tech, '112a46')} alt="" className="block size-[19px] shrink-0" />
}
