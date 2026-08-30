import type { DefaultServerCellComponentProps } from 'payload'

type MediaDoc = { alt?: string | null; thumbnailURL?: string | null; url?: string | null }

export const GalleryTitleCell = async ({ cellData, linkURL, payload, rowData }: DefaultServerCellComponentProps) => {
  const doc = await payload.findByID({ collection: 'gallery', id: rowData.id, depth: 1, overrideAccess: true })
  const cover = typeof doc.coverImage === 'object' && doc.coverImage ? doc.coverImage as MediaDoc : null
  const src = cover?.thumbnailURL ?? cover?.url
  const itemCount = Array.isArray(doc.items) ? doc.items.length : 0

  return (
    <a className="aries-gallery-cell" href={linkURL ?? `/admin/collections/gallery/${rowData.id}`}>
      <span className="aries-gallery-cell__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src ? <img src={src} alt="" /> : <span>No cover</span>}
      </span>
      <span className="aries-gallery-cell__copy"><strong>{String(cellData ?? 'Untitled album')}</strong><small>{itemCount} {itemCount === 1 ? 'asset' : 'assets'} · Edit album</small></span>
    </a>
  )
}
