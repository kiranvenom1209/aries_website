import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'
import { validateSafeURL } from '../access/validateURL'
import { IMAGE_MIME_TYPES } from './fields/media'
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
    defaultColumns: ['name', 'discipline', 'rank', 'isAlumni', 'isActive', 'sortOrder'],
    description: 'Each active person has a public page at /team/their-slug. Edit the biography, role, portrait and personal links here, then save to update the website.',
    preview: (data) => typeof data.slug === 'string' ? `/team/${data.slug}` : null,
    listSearchableFields: ['name', 'position', 'slug'],
    pagination: {
      defaultLimit: 25,
      limits: [25, 50, 100],
    },
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
      admin: {
        components: {
          Cell: '/admin/cells/TeamNameCell#TeamNameCell',
        },
      },
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
      label: 'Portrait',
      type: 'upload',
      relationTo: 'media',
      displayPreview: true,
      filterOptions: {
        mimeType: {
          in: IMAGE_MIME_TYPES,
        },
      },
      admin: {
        allowCreate: true,
        description: 'Choose a portrait from Media or upload a new image without leaving this profile.',
      },
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
      admin: { description: 'Biography for the member page. Use paragraphs, headings, lists and links for their background, work on the rover, projects and experience. Leave empty to hide this section.' },
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          name: 'linkedIn',
          label: 'Personal LinkedIn profile',
          type: 'text',
          maxLength: 300,
          validate: validateSafeURL,
          admin: { description: 'Their own linkedin.com/in/ profile URL. Leave blank if unconfirmed; company-page placeholders are not shown.' },
        },
        {
          name: 'website',
          label: 'Website, portfolio or GitHub',
          type: 'text',
          maxLength: 300,
          validate: validateSafeURL,
        },
      ],
    },
    {
      name: 'isAlumni',
      label: 'Alumni',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Former member. Keeps their public profile and search visibility, and moves their card to the alumni section. Keep Public profile enabled.',
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      label: 'Public profile',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Controls public visibility in the crew directory and on the individual profile page.',
        components: {
          Cell: '/admin/cells/TeamNameCell#TeamStatusCell',
        },
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
