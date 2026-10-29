import Image from 'next/image'
import Link from 'next/link'

import type { Messages } from '@/i18n'
import { mediaImage, pad, populatedList } from '@/lib/media'
import { teamLabel } from '@/lib/project'
import { cardTheme } from '@/lib/themes'
import type { Project, Technology } from '@/payload-types'

import { ArrowUpRight } from '../icons'
import { Reveal } from '../motion/Reveal'
import { TechLogo } from '../TechLogo'

type Props = {
  project: Project
  index: number
  href: string
  t: Messages['projects']
}

export function ProjectCard({ project, index, href, t }: Props) {
  const theme = cardTheme(index)
  const cover = mediaImage(project.coverImage)
  const team = teamLabel(project.teamSize, t)
  const meta = [
    [t.year, project.year],
    [t.role, project.role],
    [t.team, team],
  ]

  return (
    <Reveal>
      <Link
        href={href}
        className={`group grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[clamp(20px,3vw,48px)] rounded-[20px] p-[13px] text-inherit no-underline transition-transform duration-600 ease-soft hover:-translate-y-1.5 ${theme.bg}`}
      >
        {/* Takes the cover's aspect ratio, so the whole image shows without bars */}
        <div
          className={`relative self-start overflow-hidden rounded-2xl ${theme.img}`}
          style={{ aspectRatio: cover?.ratio ?? 658 / 422 }}
        >
          {cover && (
            <Image
              src={cover.src}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          <span
            className={`absolute right-6 bottom-3 text-[clamp(60px,7vw,110px)] leading-[.8] font-bold transition-transform duration-700 ease-soft group-hover:-translate-x-6 ${theme.num}`}
          >
            {pad(index + 1)}
          </span>
        </div>
        <div
          className={`flex min-w-0 flex-col gap-6 pt-[clamp(8px,1.5vw,20px)] pr-[clamp(8px,1.5vw,24px)] pb-[clamp(8px,1.5vw,16px)] pl-1 ${theme.ink}`}
        >
          <div aria-hidden />
          <div className="flex flex-col gap-3">
            <span className="text-title leading-[1.1] font-bold">{project.title}</span>
            <span className="max-w-[560px] text-base leading-[1.45] text-pretty">
              {project.description}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {meta.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-[13px] opacity-70">{label}</span>
                <span className="text-base font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-x-[18px] gap-y-3.5">
              {populatedList<Technology>(project.technologies).map((tech) => (
                <TechLogo
                  key={tech.id}
                  tech={tech}
                  size="md"
                  color={theme.light ? '112a46' : 'white'}
                  invert={!theme.light}
                />
              ))}
            </div>
            <span
              className={`flex size-[52px] flex-none items-center justify-center rounded-full text-white transition-colors duration-400 ${
                theme.light
                  ? 'bg-secondary group-hover:bg-navy'
                  : 'bg-white/14 group-hover:bg-white group-hover:text-navy'
              }`}
            >
              <ArrowUpRight
                size={26}
                className="transition-transform duration-600 ease-soft group-hover:rotate-45"
              />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
