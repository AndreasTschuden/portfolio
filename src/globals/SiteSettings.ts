import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', admin: { description: 'e.g. Andreas Tschuden' } },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'contactHeadline',
      type: 'array',
      fields: [{ name: 'line', type: 'text', localized: true }],
    },
    { name: 'contactFormNote', type: 'textarea', localized: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
