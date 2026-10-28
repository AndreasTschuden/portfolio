import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'location', type: 'text' },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'current', type: 'checkbox' },
    { name: 'description', type: 'richText' },
  ],
}
