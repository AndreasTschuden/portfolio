import fs from 'fs'
import path from 'path'
import type { CollectionSlug, Payload } from 'payload'

export type Locale = 'en' | 'de'
export type L<T = string> = Record<Locale, T>

export const assetsDir = path.resolve(process.cwd(), 'seed-assets')

/** Gives DE array rows the ids of the already stored EN rows so EN values are kept. */
export const withIds = <T extends object>(rows: T[], stored?: { id?: string | null }[] | null) =>
  rows.map((row, i) => ({ ...row, id: stored?.[i]?.id ?? undefined }))

/** Deletes every document of the given collections (uploads also remove their files). */
export async function clearCollections(payload: Payload, collections: CollectionSlug[]) {
  for (const collection of collections) {
    const { docs, errors } = await payload.delete({
      collection,
      where: { id: { exists: true } },
      depth: 0,
    })
    if (errors.length > 0) {
      throw new Error(`Could not clear ${collection}: ${errors.map((e) => e.message).join(', ')}`)
    }
    payload.logger.info(`Removed ${docs.length} ${collection}`)
  }
}

/** Uploads a file from seed-assets/ with an EN + DE alt text and returns the media id. */
export async function uploadMedia(payload: Payload, file: string, alt: L): Promise<string> {
  const filePath = path.join(assetsDir, file)
  if (!fs.existsSync(filePath)) throw new Error(`Seed asset missing: seed-assets/${file}`)

  const doc = await payload.create({
    collection: 'media',
    locale: 'en',
    data: { alt: alt.en },
    filePath,
  })
  await payload.update({ collection: 'media', id: doc.id, locale: 'de', data: { alt: alt.de } })
  return doc.id
}
