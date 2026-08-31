import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

import { editors, publicOrEditor } from '../access/roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isNetlify = Boolean(process.env.NETLIFY)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    listSearchableFields: ['filename', 'alt', 'caption', 'credit'],
    description: 'The shared asset library for images, videos, audio, and PDFs used across the Aries website.',
    pagination: {
      defaultLimit: 24,
      limits: [12, 24, 48, 96],
    },
  },
  access: {
    read: publicOrEditor(),
    create: editors,
    update: editors,
    delete: editors,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data) {
          if (!data.alt && data.filename && typeof data.filename === 'string') {
            data.alt = data.filename
              .replace(/\.[^/.]+$/, '')
              .replace(/[-_]/g, ' ')
              .trim()
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      maxLength: 180,
      admin: {
        description: 'Describe the media for visitors using assistive technology. Auto-filled from filename if left blank.',
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
    ...(isNetlify ? {} : { staticDir: path.resolve(dirname, '../../public/media') }),
    adminThumbnail: ({ doc }) => {
      const d = doc as { sizes?: { thumbnail?: { url?: string } }; url?: string; filename?: string }
      return d?.sizes?.thumbnail?.url ?? d?.url ?? (d?.filename ? `/api/media/file/${d.filename}` : null)
    },
    displayPreview: true,
    focalPoint: true,
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/ogg',
      'audio/mpeg',
      'audio/ogg',
      'audio/wav',
      'audio/webm',
      'application/pdf',
      'model/gltf-binary',
      'model/gltf+json',
      'application/zip',
      'application/x-zip-compressed',
      'text/plain',
      'text/csv',
      'application/json',
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
