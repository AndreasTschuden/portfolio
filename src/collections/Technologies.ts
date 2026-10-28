import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'iconSlug', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. Next.js' },
    },
    {
      name: 'iconSlug',
      type: 'text',
      admin: {
        description: 'simpleicons.org slug, e.g. "nextdotjs". Falls back to the lowercased name.',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional custom logo, overrides iconSlug' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Database', value: 'database' },
        { label: 'Tools', value: 'tools' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
