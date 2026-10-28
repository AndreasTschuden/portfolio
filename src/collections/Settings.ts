import type { CollectionConfig } from 'payload'

export const Settings: CollectionConfig = {
  slug: 'settings',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'jobTitle', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'profileImage', type: 'upload', relationTo: 'media' },
    { name: 'email', type: 'email' },
    { name: 'github', type: 'text' },
    { name: 'linkedin', type: 'text' },
    { name: 'cv', type: 'upload', relationTo: 'media' },
    {
      name: 'birthDate',
      type: 'date',
      admin: { description: 'Used to calculate age automatically' },
    },
    {
      name: 'yearsOfCoding',
      type: 'text',
      admin: { description: 'e.g. "4+" — shown in About facts' },
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. "Villach · Austria"' },
    },
    {
      name: 'coordinates',
      type: 'text',
      admin: { description: 'e.g. "47.6101° N — 13.8558° E"' },
    },
    {
      name: 'scrollHint',
      type: 'text',
      admin: { description: 'Hero scroll label, e.g. "Seven chapters below"' },
    },
  ],
}
