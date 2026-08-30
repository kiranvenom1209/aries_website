import type { DefaultServerCellComponentProps } from 'payload'

export const NewsTitleCell = async ({ cellData, linkURL, payload, rowData }: DefaultServerCellComponentProps) => {
  const record = rowData?.id
    ? await payload.findByID({ collection: 'news', id: rowData.id, depth: 1 })
    : null
  const image = record?.featuredImage && typeof record.featuredImage === 'object' ? record.featuredImage : null
  const href = linkURL || (rowData?.id ? `/admin/collections/news/${rowData.id}` : '#')

  return (
    <a className="aries-story-cell" href={href}>
      <span className="aries-story-cell__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image?.url ? <img alt="" src={image.url} /> : <span>Story</span>}
      </span>
      <span className="aries-story-cell__copy">
        <strong>{String(cellData ?? '')}</strong>
        <small>{record?.excerpt || 'Open story'}</small>
      </span>
    </a>
  )
}
