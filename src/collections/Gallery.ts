import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { slugField } from './fields/slug'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Gallery',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'eventDate', 'location', 'isPublic', 'sortOrder'],
    description: 'Curate public image and video collections from missions and events.',
    listSearchableFields: ['title', 'slug', 'location'],
  },
  access: {
    read: publicOrEditor(),
    create: editors,
    update: editors,
    delete: editors,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    slugField(),
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        description: 'Images or videos shown in this gallery.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'eventDate',
          type: 'date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd MMM yyyy',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
          maxLength: 140,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      maxRows: 12,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          maxLength: 40,
        },
      ],
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
