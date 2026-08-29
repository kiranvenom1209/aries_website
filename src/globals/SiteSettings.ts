import type { GlobalConfig } from 'payload'

import { editors } from '../access/roles'
import { validateSafeURL } from '../access/validateURL'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Configuration',
    description: 'Shared identity, navigation, contact, and search metadata.',
  },
  access: {
    read: () => true,
    update: editors,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'HSM Aries',
              maxLength: 100,
            },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              defaultValue: 'Engineering beyond the horizon.',
              maxLength: 180,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              maxLength: 320,
              admin: {
                description: 'Default description for search engines and social previews.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'relationship',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'defaultSocialImage',
                  type: 'relationship',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navigation',
              type: 'array',
              maxRows: 8,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  maxLength: 40,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  maxLength: 240,
                  validate: validateSafeURL,
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'primaryAction',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  maxLength: 40,
                },
                {
                  name: 'url',
                  type: 'text',
                  maxLength: 240,
                  validate: validateSafeURL,
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & social',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                },
                {
                  name: 'location',
                  type: 'text',
                  maxLength: 180,
                  defaultValue: 'Hochschule Schmalkalden, Germany',
                },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              maxRows: 10,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  maxLength: 300,
                  validate: validateSafeURL,
                },
              ],
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'text',
                  type: 'text',
                  maxLength: 180,
                },
                {
                  name: 'url',
                  type: 'text',
                  maxLength: 240,
                  validate: validateSafeURL,
                },
              ],
            },
            {
              name: 'footerText',
              type: 'textarea',
              maxLength: 500,
            },
          ],
        },
      ],
    },
  ],
}
