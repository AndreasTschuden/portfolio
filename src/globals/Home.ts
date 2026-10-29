import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Home: GlobalConfig = {
  slug: 'home',
  admin: { group: 'Pages' },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          fields: [
            { name: 'role', type: 'text', localized: true },
            {
              name: 'stats',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'number' },
                    { name: 'label', type: 'text', localized: true },
                  ],
                },
              ],
            },
            { name: 'portrait', type: 'upload', relationTo: 'media' },
            {
              name: 'intro',
              type: 'textarea',
              localized: true,
              admin: { description: 'Wrap text in **…** to make it bold' },
            },
          ],
        },
        {
          name: 'about',
          fields: [
            {
              name: 'paragraphs',
              type: 'array',
              fields: [{ name: 'text', type: 'textarea', localized: true }],
            },
          ],
        },
        {
          label: 'Services',
          fields: [
            {
              name: 'services',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'text', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Stack',
          fields: [
            {
              name: 'stackGroups',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', localized: true },
                {
                  name: 'technologies',
                  type: 'relationship',
                  relationTo: 'technologies',
                  hasMany: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Projects',
          fields: [{ name: 'projectsIntro', type: 'textarea', localized: true }],
        },
      ],
    },
  ],
}
