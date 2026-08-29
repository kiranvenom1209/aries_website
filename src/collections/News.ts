import type { CollectionConfig } from 'payload'

import { editors, publishedOrEditor } from '../access/roles'
import { slugField } from './fields/slug'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'Story',
    plural: 'News',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', '_status', 'category', 'publishedAt', 'featured', 'updatedAt'],
    description: 'Draft, schedule, and publish mission updates and team stories.',
    listSearchableFields: ['title', 'excerpt', 'slug'],
    livePreview: {
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1440, height: 960 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
      ],
      openByDefault: true,
      // Payload renders this URL in its built-in editor preview pane and sends
      // the unsaved document data to it over postMessage.
      url: ({ data }) => {
        const slug = typeof data.slug === 'string' ? data.slug : undefined
        return slug ? `/news/${slug}?preview=1` : null
      },
    },
  },
  access: {
    read: publishedOrEditor,
    create: editors,
    update: editors,
    delete: editors,
    readVersions: editors,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 900,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?._status === 'published' && !data.publishedAt) {
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 360,
      admin: {
        description: 'A concise summary for cards, search results, and social previews.',
      },
    },
    {
      name: 'author',
      type: 'text',
      maxLength: 80,
      defaultValue: 'HSM Aries Editorial',
      admin: {
        description: 'Displayed as the byline on mission dispatches.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description: 'Write the article here. Use headings to create the editorial section breaks shown on the public story page.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: {
          in: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
        },
      },
      admin: {
        description: 'Required cover image for the news index and article masthead. Upload a new image or choose one from Media.',
      },
    },
    {
      name: 'featuredVideo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          in: ['video/mp4', 'video/webm'],
        },
      },
      admin: {
        description: 'Optional primary video. It appears after the cover image on the published story with native controls.',
      },
    },
    {
      name: 'mediaDeck',
      type: 'array',
      maxRows: 16,
      admin: {
        description: 'Optional supporting images and videos. They appear as an editorial media deck at the end of the article.',
      },
      fields: [
        {
          name: 'asset',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          maxLength: 240,
          admin: {
            description: 'Optional article-specific caption. Leave blank to use the caption saved on the media item.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'general',
          options: [
            { label: 'Mission', value: 'mission' },
            { label: 'Engineering', value: 'engineering' },
            { label: 'Competition', value: 'competition' },
            { label: 'Team', value: 'team' },
            { label: 'Outreach', value: 'outreach' },
            { label: 'General', value: 'general' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd MMM yyyy, HH:mm',
            },
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this story in high-visibility areas of the website.',
        position: 'sidebar',
      },
    },
  ],
}
