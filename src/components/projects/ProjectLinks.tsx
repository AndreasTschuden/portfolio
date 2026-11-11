import { ArrowUpRight } from '../icons'
import { Mask, Reveal } from '../motion/Reveal'

type Props = {
  liveUrl?: string | null
  repoUrl?: string | null
  t: { links: string; live: string; repo: string }
}

/** Names a link after where it points, e.g. GitHub or Figma, with a fallback label. */
function linkLabel(url: string, fallback: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host === 'github.com') return 'GitHub'
    if (host === 'gitlab.com') return 'GitLab'
    if (host.endsWith('figma.com')) return 'Figma'
  } catch {}
  return fallback
}

/** GitHub and live links at the end of a project page; renders nothing without either. */
export function ProjectLinks({ liveUrl, repoUrl, t }: Props) {
  const links = [
    repoUrl && { href: repoUrl, label: linkLabel(repoUrl, t.repo) },
    liveUrl && { href: liveUrl, label: linkLabel(liveUrl, t.live) },
  ].filter((l): l is { href: string; label: string } => Boolean(l))
  if (links.length === 0) return null

  return (
    <section className="px-gutter pt-20 md:pt-[120px]">
      <div className="pl-inset">
        <h2 className="m-0 text-[28px] md:text-4xl leading-[1.3] font-medium text-navy">
          <Mask>{t.links}</Mask>
        </h2>
        <div className="mt-[22px] flex flex-wrap gap-4">
          {links.map((l, i) => (
            <Reveal key={l.href} delay={100 + i * 90}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full bg-mist py-2 pr-2 pl-6 text-base text-navy no-underline transition-colors duration-400 hover:bg-navy hover:text-white"
              >
                {l.label}
                <span className="flex size-10 items-center justify-center rounded-full bg-white text-navy transition-transform duration-600 ease-soft group-hover:rotate-45">
                  <ArrowUpRight />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
