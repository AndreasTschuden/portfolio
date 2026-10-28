import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  HeadingFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'

import type { CollectionConfig } from 'payload'

const richText = () =>
  lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      HeadingFeature(),
      LinkFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      FixedToolbarFeature(),
    ],
  })

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    defaultColumns: ['title', 'status', 'publishedAt'],
    useAsTitle: 'title',
  },
  fields: [
    // ── Core ────────────────────────────────────────────────
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short lede shown on the homepage card and hero' },
    },

    // ── Status ──────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Shipped · In production', value: 'shipped' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'shipped',
    },

    // ── Tags (shown under title) ─────────────────────────────
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
      admin: { description: 'Short keyword tags shown under the project title' },
    },

    // ── Meta strip ──────────────────────────────────────────
    {
      name: 'meta',
      type: 'group',
      label: 'Meta Strip',
      fields: [
        { name: 'role', type: 'text', admin: { description: 'e.g. Fullstack' } },
        { name: 'roleNote', type: 'text', admin: { description: 'e.g. Solo build' } },
        { name: 'year', type: 'text', admin: { description: 'e.g. 2025' } },
        { name: 'period', type: 'text', admin: { description: 'e.g. Q1 — Q3' } },
        { name: 'timeline', type: 'text', admin: { description: 'e.g. 14 weeks' } },
        { name: 'timelineNote', type: 'text', admin: { description: 'e.g. Design → ship' } },
        { name: 'client', type: 'text', admin: { description: 'e.g. Tourism board' } },
        { name: 'clientNote', type: 'text', admin: { description: 'e.g. Carinthia, AT' } },
      ],
    },

    // ── Description ─────────────────────────────────────────
    {
      name: 'description',
      type: 'richText',
      label: 'Project Description',
      editor: richText(),
    },

    // ── Media ───────────────────────────────────────────────
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'label', type: 'text', admin: { description: 'e.g. 01 · Editor' } },
        { name: 'caption', type: 'text' },
      ],
    },

    // ── Technologies ────────────────────────────────────────
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
    },

    // ── Links ───────────────────────────────────────────────
    { name: 'projectUrl', type: 'text' },
    { name: 'githubUrl', type: 'text' },

    // ── Flags ───────────────────────────────────────────────
    { name: 'featured', type: 'checkbox' },
    { name: 'publishedAt', type: 'date' },
  ],
}
