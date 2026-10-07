import type { CollectionConfig } from 'payload'

import { editors } from '../access/roles'

export const FORM_NAMES = ['general-contact', 'join-aries', 'partnership-enquiry'] as const
export type FormName = (typeof FORM_NAMES)[number]

const readOnly = { readOnly: true }

/**
 * Messages from the contact, join and partner forms (replaces Netlify Forms). Only the server's /api/forms route
 * creates them; editors read them here, mark them done and delete them once the request is dealt with — the privacy
 * policy promises exactly that.
 */
export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Form message',
    plural: 'Form messages',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Inbox',
    defaultColumns: ['form', 'firstName', 'surname', 'email', 'status', 'createdAt'],
    description:
      'Messages sent through the contact, join and partner forms. Delete a message once it has been answered.',
    listSearchableFields: ['email', 'firstName', 'surname', 'company'],
  },
  access: {
    create: () => false,
    read: editors,
    update: editors,
    delete: editors,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'form',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'general-contact' },
        { label: 'Join the team', value: 'join-aries' },
        { label: 'Partnership', value: 'partnership-enquiry' },
      ],
      admin: readOnly,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Answered', value: 'answered' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'notified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'An e-mail copy went to the team mailbox.',
      },
    },
    { name: 'firstName', type: 'text', admin: readOnly },
    { name: 'surname', type: 'text', admin: readOnly },
    { name: 'email', type: 'email', required: true, admin: readOnly },
    { name: 'company', type: 'text', admin: { ...readOnly, condition: (data) => data?.form === 'partnership-enquiry' } },
    {
      name: 'partnershipScope',
      type: 'text',
      admin: { ...readOnly, condition: (data) => data?.form === 'partnership-enquiry' },
    },
    { name: 'studyProgram', type: 'text', admin: { ...readOnly, condition: (data) => data?.form === 'join-aries' } },
    { name: 'semester', type: 'text', admin: { ...readOnly, condition: (data) => data?.form === 'join-aries' } },
    {
      name: 'divisionPreference',
      type: 'text',
      admin: { ...readOnly, condition: (data) => data?.form === 'join-aries' },
    },
    { name: 'message', type: 'textarea', admin: readOnly },
  ],
}
