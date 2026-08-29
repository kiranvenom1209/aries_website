import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    listSearchableFields: ['filename', 'alt', 'caption', 'credit'],
    description: 'Images, videos, audio, and PDFs used across the Aries website.',
  },
  access: {
    read: publicOrEditor(),
    create: editors,
    update: editors,
    delete: editors,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      maxLength: 180,
      admin: {
        description: 'Describe the media for visitors using assistive technology.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'credit',
      type: 'text',
      maxLength: 160,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Turn off to prevent unauthenticated access to this file.',
        position: 'sidebar',
      },
    },
  ],
  upload: {
    adminThumbnail: ({ doc }) => {
      const d = doc as { sizes?: { thumbnail?: { url?: string } }; url?: string; filename?: string }
      return d?.sizes?.thumbnail?.url ?? d?.url ?? (d?.filename ? `/media/${d.filename}` : null)
    },
    displayPreview: true,
    focalPoint: true,
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/ogg',
      'application/pdf',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 78,
          },
        },
      },
      {
        name: 'card',
        width: 960,
        height: 640,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 82,
          },
        },
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 86,
          },
        },
      },
    ],
  },
}
