import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { getConnectionString } from '@netlify/database'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Downloads } from './collections/Downloads'
import { Gallery } from './collections/Gallery'
import { News } from './collections/News'
import { Sponsors } from './collections/Sponsors'
import { Team } from './collections/Team'
import { SiteSettings } from './globals/SiteSettings'
import { netlifyBlobsAdapter } from './storage/netlifyBlobs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    'PAYLOAD_SECRET is required. Generate a long, random value before starting Payload.',
  )
}

const isNetlify = Boolean(process.env.NETLIFY)
const netlifyDatabaseURL = process.env.NETLIFY_DB_URL ?? (isNetlify ? getConnectionString() : undefined)
const databaseURL = netlifyDatabaseURL ?? process.env.DATABASE_URL
const usesPostgres = Boolean(databaseURL?.startsWith('postgres://') || databaseURL?.startsWith('postgresql://'))
const maxUploadSize = Number(process.env.PAYLOAD_MAX_UPLOAD_BYTES ?? 50_000_000)
const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL

if (!Number.isFinite(maxUploadSize) || maxUploadSize <= 0) {
  throw new Error('PAYLOAD_MAX_UPLOAD_BYTES must be a positive number of bytes.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: {
      Component: '/admin/UserAvatar#UserAvatar',
    },
    dateFormat: 'dd MMM yyyy, HH:mm',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '• HSM Aries Mission Control',
      description: 'Secure content operations for the HSM Aries rover team.',
    },
    components: {
      graphics: {
        Icon: '/admin/AriesBrand#AriesIcon',
        Logo: '/admin/AriesBrand#AriesLogo',
      },
      actions: ['/admin/AdminControls#HeaderActions'],
      afterNavLinks: ['/admin/AdminControls#SidebarControls'],
      beforeDashboard: ['/admin/DashboardIntro#DashboardIntro'],
      beforeLogin: ['/admin/LoginIntro#LoginIntro'],
    },
  },
  collections: [News, Media, Gallery, Team, Sponsors, Downloads, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  ...(siteURL ? { serverURL: siteURL } : {}),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usesPostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseURL,
        },
        // A fresh Netlify Database needs its Payload tables on the first deploy.
        // Set PAYLOAD_DB_PUSH=false after moving schema changes to migrations.
        push: process.env.PAYLOAD_DB_PUSH !== 'false',
      })
    : sqliteAdapter({
        client: {
          url: databaseURL?.startsWith('file:') ? databaseURL : 'file:./hsm-aries.db',
        },
      }),
  graphQL: {
    disable: true,
  },
  maxDepth: 4,
  upload: {
    abortOnLimit: true,
    limits: {
      fileSize: maxUploadSize,
      files: 1,
    },
    preserveExtension: true,
    safeFileNames: true,
  },
  telemetry: false,
  sharp,
  plugins: [
    cloudStoragePlugin({
      // Local development keeps using ./media. Netlify deploys use a durable,
      // site-scoped Blob store instead of the read-only function filesystem.
      alwaysInsertFields: true,
      collections: {
        media: {
          adapter: netlifyBlobsAdapter(),
          disableLocalStorage: true,
          prefix: 'media',
        },
      },
      enabled: isNetlify,
      useCompositePrefixes: true,
    }),
  ],
})
