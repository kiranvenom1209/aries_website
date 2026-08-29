import { getStore } from '@netlify/blobs'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { getFileKey } from '@payloadcms/plugin-cloud-storage/utilities'

const STORE_NAME = 'hsm-aries-media'

const contentTypeFor = (value: unknown) =>
  typeof value === 'string' && value.length > 0 ? value : 'application/octet-stream'

/**
 * Stores Payload uploads in a site-scoped Netlify Blob store.
 *
 * The adapter deliberately keeps Payload's normal media URL and access-control
 * route. Public pages can therefore keep using `/api/media/file/...`, while the
 * file itself lives outside Netlify's ephemeral function filesystem.
 */
export const netlifyBlobsAdapter = (): Adapter => ({ collection: _collection, prefix }) => {
  const keyFor = (filename: string, documentPrefix?: string) =>
    getFileKey({
      collectionPrefix: prefix,
      docPrefix: documentPrefix,
      filename,
      useCompositePrefixes: true,
    }).fileKey

  return {
    name: 'netlify-blobs',
    handleUpload: async ({ data, file }) => {
      const bytes = file.buffer
      const payload = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer

      await getStore(STORE_NAME).set(keyFor(file.filename, data?.prefix), payload, {
        metadata: {
          contentType: file.mimeType,
          originalFilename: file.filename,
        },
      })
    },
    handleDelete: async ({ doc, filename }) => {
      await getStore(STORE_NAME).delete(keyFor(filename, doc.prefix))
    },
    staticHandler: async (_req, { params }) => {
      const blob = await getStore(STORE_NAME).getWithMetadata(
        keyFor(params.filename, params.prefix),
        { type: 'blob' },
      )

      if (!blob) {
        return new Response('Media asset not found.', { status: 404 })
      }

      return new Response(blob.data, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': contentTypeFor(blob.metadata.contentType),
          ...(blob.etag ? { ETag: blob.etag } : {}),
        },
      })
    },
  }
}
