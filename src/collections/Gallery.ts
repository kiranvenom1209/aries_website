import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { IMAGE_MIME_TYPES, VISUAL_MEDIA_MIME_TYPES } from './fields/media'
import { slugField } from './fields/slug'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Event gallery',
    plural: 'Event galleries',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'eventDate', 'location', 'isPublic', 'sortOrder'],
    description: 'Build public event albums by choosing a cover and grouping related images or videos.',
    listSearchableFields: ['title', 'slug', 'location'],
    pagination: {
      defaultLimit: 12,
      limits: [12, 24, 48],
    },
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
      admin: {
        components: {
          Cell: '/admin/cells/GalleryTitleCell#GalleryTitleCell',
        },
      },
    },
    slugField(),
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'coverImage',
      label: 'Album cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
      displayPreview: true,
      filterOptions: {
        mimeType: {
          in: IMAGE_MIME_TYPES,
        },
      },
      admin: {
        allowCreate: true,
        description: 'Choose the image visitors see before they open this album. You can upload a new image without leaving this page.',
      },
    },
    {
      name: 'items',
      label: 'Album images and videos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      displayPreview: true,
      filterOptions: {
        mimeType: {
          in: VISUAL_MEDIA_MIME_TYPES,
        },
      },
      admin: {
        allowCreate: true,
        isSortable: true,
        description: 'Add as many images or videos as you need. Drag selected items into the order visitors should see them; upload new media here at any time.',
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
