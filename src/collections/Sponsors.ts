import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { validateSafeURL } from '../access/validateURL'

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
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        allowCreate: true,
        allowEdit: true,
        appearance: 'drawer',
        description: 'Upload a clean, high-resolution logo. Transparent PNG or SVG works best.',
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
