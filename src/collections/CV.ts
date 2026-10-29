import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/** CV as PDF, one per language. The home page links the newest one for the current locale. */
export const CV: CollectionConfig = {
  slug: 'cv',
  labels: { singular: 'CV', plural: 'CV' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'language', 'filename', 'updatedAt'],
    group: 'Assets',
  },
  defaultSort: '-updatedAt',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. CV 2026' } },
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Shown on the site in this language; falls back to the newest CV otherwise',
      },
    },
  ],
}
