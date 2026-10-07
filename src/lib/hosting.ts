import path from 'node:path'

/**
 * Where this server runs. `DEPLOY_TARGET=node` is our own server (the Raspberry Pi: `next start` behind a
 * Cloudflare Tunnel, local PostgreSQL, uploads on disk — see deploy/pi/README.md). Anything else keeps the
 * Netlify behaviour: Netlify Database, Netlify Blobs and a read-only function filesystem.
 */
export const selfHosted = process.env.DEPLOY_TARGET === 'node'

/** Netlify or another serverless host: uploads cannot live on the function filesystem. */
export const serverlessHost =
  !selfHosted &&
  Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_SITE_ID ||
      process.env.SITE_ID ||
      process.env.NETLIFY_DB_URL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.VERCEL ||
      process.env.NODE_ENV === 'production',
  )

/**
 * CMS uploads on our own server. On the Pi this is /srv/aries/shared/media, outside the release folders, so a
 * deploy or a rollback never touches what editors uploaded.
 */
export const mediaDir = () =>
  process.env.MEDIA_DIR ? path.resolve(process.env.MEDIA_DIR) : path.resolve(process.cwd(), 'media')
