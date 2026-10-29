import type { Media, Technology } from '@/payload-types'

/** Relationship fields are either populated documents or bare ids, depending on depth. */
export const populated = <T extends { id: string }>(value: T | string | null | undefined) =>
  value && typeof value === 'object' ? value : null

export const populatedList = <T extends { id: string }>(
  values: (T | string)[] | null | undefined,
) => (values ?? []).map(populated).filter((v): v is T => v !== null)

/**
 * File URL with a version from `updatedAt`. A re-uploaded file often keeps its URL
 * (e.g. /api/media/file/hero.png); the version makes caches like next/image's pick it up.
 */
export const mediaSrc = (media: Media | string | null | undefined) => {
  const doc = populated(media)
  if (!doc?.url) return null
  const version = Date.parse(doc.updatedAt)
  return Number.isNaN(version)
    ? doc.url
    : `${doc.url}${doc.url.includes('?') ? '&' : '?'}v=${version}`
}

/** simpleicons.org logo, or the uploaded custom icon. `color` is a hex without # or a named color. */
export const techIconSrc = (tech: Technology, color?: string) => {
  const custom = mediaSrc(tech.icon)
  if (custom) return custom
  const slug = tech.iconSlug || tech.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ''}`
}

export const pad = (n: number) => String(n).padStart(2, '0')
