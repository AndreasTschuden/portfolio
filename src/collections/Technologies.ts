import type { CollectionConfig } from 'payload'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      options: ['UI', 'Frontend', 'Backend', 'Cms', 'Data', 'Ops'],
    },
    { name: 'icon', type: 'upload', relationTo: 'media' },
  ],
}
