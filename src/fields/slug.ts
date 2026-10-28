import type { FieldHook, TextField } from 'payload'

export const slugify = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Keeps a manually entered slug (normalised), otherwise derives it from `sourceField`.
 * The slug is not localized, so it is only generated from the title of the locale
 * the document is first saved in (the default locale when seeded).
 */
const formatSlug =
  (sourceField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    if (originalDoc?.slug) return originalDoc.slug

    const source = data?.[sourceField] ?? originalDoc?.[sourceField]
    return typeof source === 'string' ? slugify(source) : value
  }

export const slugField = (sourceField = 'title'): TextField => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  required: true,
  admin: {
    position: 'sidebar',
    description: `Generated from "${sourceField}" if left empty`,
  },
  hooks: {
    beforeValidate: [formatSlug(sourceField)],
  },
})
