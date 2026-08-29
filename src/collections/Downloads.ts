import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { slugField } from './fields/slug'

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  labels: {
    singular: 'Download',
    plural: 'Downloads',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'version', 'publishedAt', 'isPublic'],
    description: 'Publish press, competition, and technical files for visitors.',
    listSearchableFields: ['title', 'slug', 'description'],
  },
  access: {
    read: publicOrEditor(),
    create: editors,
    update: editors,
    delete: editors,
  },
  defaultSort: '-publishedAt',
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data?.publishedAt) {
          return {
            ...data,
            publishedAt: new Date().toISOString(),
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 180,
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 600,
    },
    {
      name: 'file',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Select an uploaded PDF or other approved media file.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'other',
          options: [
            { label: 'Press kit', value: 'press-kit' },
            { label: 'Technical', value: 'technical' },
            { label: 'Competition', value: 'competition' },
            { label: 'Brand assets', value: 'brand' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'version',
          type: 'text',
          maxLength: 40,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd MMM yyyy, HH:mm',
        },
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      min: 0,
      admin: {
        position: 'sidebar',
        step: 1,
      },
    },
  ],
}
