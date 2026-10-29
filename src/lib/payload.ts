import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n'

const payload = () => getPayload({ config })

export const getHome = cache(async (locale: Locale) =>
  (await payload()).findGlobal({ slug: 'home', locale, depth: 2 }),
)

export const getSiteSettings = cache(async (locale: Locale) =>
  (await payload()).findGlobal({ slug: 'site-settings', locale, depth: 1 }),
)

export const getProjects = cache(async (locale: Locale) => {
  const { docs } = await (
    await payload()
  ).find({ collection: 'projects', locale, depth: 1, sort: 'order', limit: 100 })
  return docs
})

/** Newest projects first (by year, then by creation date), for the slider on Home. */
export const getLatestProjects = cache(async (locale: Locale, limit = 5) => {
  const { docs } = await (
    await payload()
  ).find({ collection: 'projects', locale, depth: 1, sort: ['-year', '-createdAt'], limit })
  return docs
})

export const getExperiences = cache(async (locale: Locale) => {
  const { docs } = await (
    await payload()
  ).find({ collection: 'experiences', locale, depth: 1, sort: 'order', limit: 100 })
  return docs
})
