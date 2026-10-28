import type { CollectionConfig } from 'payload'

export const Education: CollectionConfig = {
  slug: 'education',
  admin: {
    defaultColumns: ['institution', 'focus', 'startYear', 'current'],
    useAsTitle: 'institution',
  },
  fields: [
    {
      name: 'institution',
      type: 'text',
      required: true,
      admin: { description: 'e.g. HTBLuVA Villach' },
    },
    {
      name: 'focus',
      type: 'text',
      admin: { description: 'e.g. Advanced Web Development · Diploma underway, Year IV of V' },
    },
    {
      name: 'degree',
      type: 'text',
      admin: { description: 'Optional degree / certificate label' },
    },
    {
      name: 'startYear',
      type: 'number',
      required: true,
      admin: { description: 'e.g. 2022' },
    },
    {
      name: 'endYear',
      type: 'number',
      admin: { description: 'Leave empty if still ongoing' },
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show "● Current" badge' },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower = shown first' },
    },
  ],
}
