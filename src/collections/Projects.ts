import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'type', 'status', 'featured', 'order'],
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
    // ── Sidebar ─────────────────────────────────────────────
    slugField('title'),
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Order on Home and All Projects; "Next Project" follows it',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show in the horizontal slider on Home' },
    },

    // ── Core ────────────────────────────────────────────────
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short text for cards and the intro' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },

    // ── Meta ────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'text', admin: { description: 'e.g. 2025', width: '25%' } },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'School', value: 'school' },
            { label: 'Work', value: 'work' },
            { label: 'Personal', value: 'personal' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Done', value: 'done' },
            { label: 'WIP', value: 'wip' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'teamSize',
          type: 'number',
          min: 1,
          admin: { description: '1 = Solo', width: '25%' },
        },
      ],
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. Full-stack' },
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
    },
    {
      name: 'buildWith',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 2,
      label: 'Build with (images)',
      admin: {
        description:
          'Stack images next to "Build with." (390×72). Falls back to the technology logos.',
      },
    },

    // ── Case study ──────────────────────────────────────────
    {
      name: 'caseStudy',
      type: 'group',
      fields: [
        { name: 'problem', type: 'textarea', localized: true },
        { name: 'problemImage', type: 'upload', relationTo: 'media' },
        { name: 'solution', type: 'textarea', localized: true },
        { name: 'solutionImage', type: 'upload', relationTo: 'media' },
        { name: 'outcome', type: 'textarea', localized: true },
        { name: 'outcomeImage', type: 'upload', relationTo: 'media' },
      ],
    },

    // ── A look inside ───────────────────────────────────────
    {
      name: 'screens',
      type: 'array',
      label: 'Screens ("A look inside")',
      fields: [
        { name: 'label', type: 'text', localized: true },
        {
          type: 'row',
          fields: [
            { name: 'desktop', type: 'upload', relationTo: 'media' },
            { name: 'mobile', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },

    // ── Links ───────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'liveUrl', type: 'text' },
        { name: 'repoUrl', type: 'text' },
      ],
    },
  ],
}
