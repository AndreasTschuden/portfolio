import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'organisation', 'type', 'startYear', 'endYear'],
    group: 'Content',
  },
  defaultSort: '-startYear',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Work', value: 'work' },
        { label: 'Education', value: 'edu' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'startYear', type: 'text', required: true, admin: { width: '33%' } },
        {
          name: 'endYear',
          type: 'text',
          admin: { width: '33%', description: 'Leave empty if ongoing ("Today")' },
        },
        {
          name: 'months',
          type: 'text',
          localized: true,
          admin: { width: '33%', description: 'Optional, e.g. "Jul – Aug"' },
        },
      ],
    },
    { name: 'role', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'organisation', type: 'text', localized: true },
        { name: 'place', type: 'text', localized: true },
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'learned',
      type: 'array',
      fields: [
        {
          name: 'kind',
          type: 'select',
          options: [
            { label: 'Tech', value: 'tech' },
            { label: 'Soft skill', value: 'soft' },
            { label: 'Process', value: 'process' },
          ],
        },
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}
