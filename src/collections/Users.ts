import type { CollectionConfig } from 'payload'

import {
  admins,
  adminsExceptSelf,
  adminsField,
  adminsFieldExceptSelf,
  adminsOrSelf,
  isAdmin,
  isEditor,
} from '../access/roles'
import { IMAGE_MIME_TYPES } from './fields/media'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    description: 'Manage the people who can access Aries Mission Control.',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    admin: ({ req }) => isEditor(req.user),
    create: async ({ req }) => {
      if (isAdmin(req.user)) return true

      // Payload's first-user route needs one narrowly-scoped bootstrap exception.
      const existingUsers = await req.payload.count({
        collection: 'users',
        overrideAccess: true,
        req,
      })

      return existingUsers.totalDocs === 0
    },
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: adminsExceptSelf,
    unlock: admins,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        const existingUsers = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
          req,
        })

        if (existingUsers.totalDocs === 0) {
          return {
            ...data,
            role: 'admin',
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      maxLength: 100,
      admin: {
        description: 'Display name shown in Mission Control. Email is used when omitted.',
        components: {
          Cell: '/admin/cells/UserNameCell#UserNameCell',
        },
      },
    },
    {
      name: 'avatar',
      label: 'Profile image',
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
        description: 'Choose a portrait from Media or upload a new one. It appears in the Editorial Dashboard header and user directory.',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Administrator',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      access: {
        create: adminsField,
        update: adminsFieldExceptSelf,
      },
      admin: {
        description: 'Administrators manage accounts; editors manage site content.',
        position: 'sidebar',
      },
    },
  ],
}
