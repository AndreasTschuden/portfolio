import type { Media, Technology } from '@/payload-types'

/** Relationship fields are either populated documents or bare ids, depending on depth. */
export const populated = <T extends { id: string }>(value: T | string | null | undefined) =>
  value && typeof value === 'object' ? value : null

export const populatedList = <T extends { id: string }>(
  values: (T | string)[] | null | undefined,
) => (values ?? []).map(populated).filter((v): v is T => v !== null)

export const mediaSrc = (media: Media | string | null | undefined) => populated(media)?.url ?? null

/** simpleicons.org logo, or the uploaded custom icon. `color` is a hex without # or a named color. */
export const techIconSrc = (tech: Technology, color?: string) => {
  const custom = mediaSrc(tech.icon)
  if (custom) return custom
  const slug = tech.iconSlug || tech.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ''}`
}

export const pad = (n: number) => String(n).padStart(2, '0')
