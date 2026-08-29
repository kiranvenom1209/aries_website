import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { validateSafeURL } from '../access/validateURL'
import { slugField } from './fields/slug'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Team member',
    plural: 'Team',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Organization',
    defaultColumns: ['name', 'position', 'rank', 'discipline', 'isActive', 'sortOrder'],
    description: 'Manage the people behind HSM Aries.',
    listSearchableFields: ['name', 'position', 'discipline'],
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
      maxLength: 120,
    },
    slugField('name'),
    {
      name: 'position',
      type: 'text',
      required: true,
      maxLength: 140,
      admin: {
        description: 'Public-facing role, for example “Mechanical Lead”.',
      },
    },
    {
      name: 'discipline',
      type: 'select',
      defaultValue: 'other',
      options: [
        { label: 'Team Leadership', value: 'leadership' },
        { label: 'Mechanical Department', value: 'mechanical' },
        { label: 'Electrical Department', value: 'electrical' },
        { label: 'Software & Navigation', value: 'software' },
        { label: 'Communication Department', value: 'communication' },
        { label: 'Drill & Manipulator', value: 'drill-manipulator' },
        { label: 'Astroflight (AQUILA Drone)', value: 'astroflight' },
        { label: 'Scientific Payload', value: 'science' },
        { label: 'Mission, Resources & Outreach', value: 'mro' },
        { label: 'Advisors & Mentors', value: 'mentors' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'departments',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'All live-site departments in which this person appears. A person may belong to more than one.',
      },
      options: [
        { label: 'Team Leadership', value: 'leadership' },
        { label: 'Mechanical Department', value: 'mechanical' },
        { label: 'Electrical Department', value: 'electrical' },
        { label: 'Software & Navigation', value: 'software' },
        { label: 'Communication Department', value: 'communication' },
        { label: 'Drill & Manipulator', value: 'drill-manipulator' },
        { label: 'Astroflight (AQUILA Drone)', value: 'astroflight' },
        { label: 'Scientific Payload', value: 'science' },
        { label: 'Mission, Resources & Outreach', value: 'mro' },
        { label: 'Advisors & Mentors', value: 'mentors' },
      ],
    },
    {
      name: 'rank',
      type: 'select',
      admin: {
        description: 'Commander and Captain ranks automatically display the original LEAP-One badge.',
      },
      options: [
        { label: 'Commander', value: 'Commander' },
        { label: 'Captain', value: 'Captain' },
        { label: 'Crew', value: 'Crew' },
        { label: 'Advisor', value: 'Advisor' },
      ],
    },
    {
      name: 'portrait',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'portraitPath',
      type: 'text',
      admin: {
        description: 'Imported public portrait path from the live site, for example /media/ayan.jpg. Uploading a portrait above takes precedence.',
      },
    },
    {
      name: 'portraitCredit',
      type: 'text',
      maxLength: 180,
      admin: {
        description: 'Photo credit shown in structured image metadata, for example “Wirtschaftsspiegel Thüringen”.',
      },
    },
    {
      name: 'portraitCreditUrl',
      type: 'text',
      maxLength: 500,
      validate: validateSafeURL,
      admin: {
        description: 'Source page for the portrait credit.',
      },
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          name: 'linkedIn',
          type: 'text',
          maxLength: 300,
          validate: validateSafeURL,
        },
        {
          name: 'website',
          type: 'text',
          maxLength: 300,
          validate: validateSafeURL,
        },
      ],
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
