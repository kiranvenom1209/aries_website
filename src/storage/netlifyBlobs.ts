import { getStore } from '@netlify/blobs'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { getFileKey } from '@payloadcms/plugin-cloud-storage/utilities'

const STORE_NAME = 'hsm-aries-media'

const getMediaStore = () => {
  if (process.env.NETLIFY_BLOBS_CONTEXT) {
    return getStore(STORE_NAME)
  }

  const siteID = process.env.NETLIFY_SITE_ID ?? process.env.SITE_ID
  const token = process.env.NETLIFY_API_TOKEN

  if (siteID && token) {
    return getStore({
      name: STORE_NAME,
      siteID,
      token,
    })
  }

  return getStore(STORE_NAME)
}

const contentTypeFor = (value: unknown) =>
  typeof value === 'string' && value.length > 0 ? value : 'application/octet-stream'

export const readNetlifyMedia = async (filename: string, prefix?: string) => {
  const blob = await getMediaStore().getWithMetadata(
    getFileKey({
      collectionPrefix: 'media',
      docPrefix: prefix,
      filename,
      useCompositePrefixes: true,
    }).fileKey,
    { type: 'blob' },
  )

  if (!blob) return null

  return new Response(blob.data, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': contentTypeFor(blob.metadata.contentType),
      ...(blob.etag ? { ETag: blob.etag } : {}),
    },
  })
}

const packagedMediaFallback = (
  requestURL: string | undefined,
  requestedFilename: string,
  document: unknown,
) => {
  const filename =
    typeof document === 'object' &&
    document !== null &&
    'filename' in document &&
    typeof document.filename === 'string'
      ? document.filename
      : requestedFilename

  return Response.redirect(
    new URL(
      `/media/${filename.split('/').map(encodeURIComponent).join('/')}`,
      requestURL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost',
    ),
    307,
  )
}

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

      await getMediaStore().set(keyFor(file.filename, data?.prefix), payload, {
        metadata: {
          contentType: file.mimeType,
          originalFilename: file.filename,
        },
      })
    },
    handleDelete: async ({ doc, filename }) => {
      await getMediaStore().delete(keyFor(filename, doc.prefix))
    },
    staticHandler: async (req, { doc, params }) => {
      try {
        const response = await readNetlifyMedia(params.filename, params.prefix)

        if (!response) {
          return packagedMediaFallback(req.url, params.filename, doc)
        }

        return response
      } catch {
        return packagedMediaFallback(req.url, params.filename, doc)
      }
    },
  }
}
