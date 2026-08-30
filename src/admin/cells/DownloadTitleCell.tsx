import type { DefaultServerCellComponentProps } from 'payload'

export const DownloadTitleCell = async ({ cellData, linkURL, payload, rowData }: DefaultServerCellComponentProps) => {
  const record = rowData?.id
    ? await payload.findByID({ collection: 'downloads', id: rowData.id, depth: 1 })
    : null
  const file = record?.file && typeof record.file === 'object' ? record.file : null
  const href = linkURL || (rowData?.id ? `/admin/collections/downloads/${rowData.id}` : '#')
  const extension = file?.filename?.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <a className="aries-download-cell" href={href}>
      <span className="aries-download-cell__icon">{extension}</span>
      <span><strong>{String(cellData ?? '')}</strong><small>{file?.filename || record?.description || 'Downloadable resource'}</small></span>
    </a>
  )
}
