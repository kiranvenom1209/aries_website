import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { validateSafeURL } from '../access/validateURL'
import { IMAGE_MIME_TYPES } from './fields/media'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: {
    singular: 'Sponsor',
    plural: 'Sponsors',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Organization',
    defaultColumns: ['name', 'tier', 'isActive', 'sortOrder'],
    description: 'Manage the partners shown on the public website. Add a logo, choose its level and set the display order.',
    listSearchableFields: ['name'],
  },
  access: {
    read: publicOrEditor('isActive'),
    create: editors,
    update: editors,
    delete: editors,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 140,
      admin: {
        components: {
          Cell: '/admin/cells/SponsorNameCell#SponsorNameCell',
        },
      },
    },
    {
      name: 'logo',
      label: 'Sponsor logo',
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
        description: 'Choose a logo from Media or upload a new one. A transparent PNG or WebP works best.',
      },
    },
    {
      name: 'website',
      type: 'text',
      maxLength: 300,
      validate: validateSafeURL,
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'partner',
      options: [
        { label: 'Principal', value: 'principal' },
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Partner', value: 'partner' },
        { label: 'Supporter', value: 'supporter' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'isActive',
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
