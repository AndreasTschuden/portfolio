import type { Messages } from '@/i18n'

/** "Solo" for one person, otherwise e.g. "3 people". */
export const teamLabel = (
  size: number | null | undefined,
  t: Pick<Messages['projects'], 'solo' | 'people'>,
) => (!size || size === 1 ? t.solo : `${size} ${t.people}`)
