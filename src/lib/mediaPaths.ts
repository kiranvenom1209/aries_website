/**
 * Static photos that were renamed on disk but may still be referenced by their old
 * path from CMS records (team `portraitPath`, story image strings) that were seeded
 * before the rename. Resolve through here before handing a `/media/…` string to
 * `next/image` so old rows keep working without a database migration.
 *
 * 2026-09-12: five opaque PNG photos became JPEGs (26 MB → 1.7 MB).
 */
const LEGACY_MEDIA_PATHS: Record<string, string> = {
  '/media/2-e1776807359413.png': '/media/2-e1776807359413.jpg',
  '/media/frank-schroedel-wirtschaftsspiegel.png': '/media/frank-schroedel-wirtschaftsspiegel.jpg',
  '/media/mars-rover-render2.png': '/media/mars-rover-render2.jpg',
  '/media/Screenshot-2026-05-10-203543.png': '/media/Screenshot-2026-05-10-203543.jpg',
  '/media/sirleloimage.png': '/media/sirleloimage.jpg',
  // 2026-09-12: two more opaque PNGs re-exported as JPEG from larger originals in the WordPress backup.
  '/media/hsm-aries-3.png': '/media/hsm-aries-3.jpg',
  '/media/mars-rover-leap-one-1.png': '/media/mars-rover-leap-one-1.jpg',
}

export const resolveLegacyMediaPath = <T extends string | undefined>(path: T): T => {
  if (!path) return path
  const [file, suffix = ''] = path.split(/(?=[?#])/, 2)
  const renamed = LEGACY_MEDIA_PATHS[file]
  return (renamed ? `${renamed}${suffix}` : path) as T
}
