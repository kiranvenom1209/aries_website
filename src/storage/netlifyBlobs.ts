import { getStore } from '@netlify/blobs'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { getFileKey } from '@payloadcms/plugin-cloud-storage/utilities'

const STORE_NAME = 'hsm-aries-media'

const getMediaStore = () => {
  const siteID = process.env.NETLIFY_SITE_ID ?? process.env.SITE_ID
  const token = process.env.NETLIFY_API_TOKEN ?? process.env.NETLIFY_AUTH_TOKEN

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
  try {
    const store = getMediaStore()
    const key = getFileKey({
      collectionPrefix: 'media',
      docPrefix: prefix,
      filename,
      useCompositePrefixes: true,
    }).fileKey

    const blob = await store.getWithMetadata(key, { type: 'blob' })

    if (!blob) return null

    return new Response(blob.data, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': contentTypeFor(blob.metadata?.contentType),
        ...(blob.etag ? { ETag: blob.etag } : {}),
      },
    })
  } catch (err) {
    console.warn(`[Netlify Blobs] Could not retrieve media '${filename}':`, err)
    return null
  }
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
      `/media/${encodeURIComponent(filename)}`,
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
      try {
        const store = getMediaStore()
        if (!store) {
          console.warn(`[Netlify Blobs] No store available for uploading '${file?.filename}'.`)
          return
        }

        const key = keyFor(file.filename, data?.prefix)

        let payload: any = file.buffer
        if (!Buffer.isBuffer(payload) && payload) {
          payload = Buffer.from(payload)
        }

        if (!payload) {
          console.warn(`[Netlify Blobs] Empty buffer for '${file?.filename}'.`)
          return
        }

        await store.set(key, payload, {
          metadata: {
            contentType: file.mimeType,
            originalFilename: file.filename,
          },
        })
      } catch (err) {
        console.error(`[Netlify Blobs] handleUpload error for '${file?.filename}':`, err)
      }
    },
    handleDelete: async ({ doc, filename }) => {
      try {
        const store = getMediaStore()
        await store.delete(keyFor(filename, doc.prefix))
      } catch (err) {
        console.warn(`[Netlify Blobs] handleDelete error for '${filename}':`, err)
      }
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

