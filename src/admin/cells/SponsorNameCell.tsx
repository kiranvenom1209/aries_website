import type { DefaultServerCellComponentProps } from 'payload'

export const SponsorNameCell = async ({ cellData, linkURL, payload, rowData }: DefaultServerCellComponentProps) => {
  const record = rowData?.id
    ? await payload.findByID({ collection: 'sponsors', id: rowData.id, depth: 1 })
    : null
  const logo = record?.logo && typeof record.logo === 'object' ? record.logo : null
  const href = linkURL || (rowData?.id ? `/admin/collections/sponsors/${rowData.id}` : '#')

  return (
    <a className="aries-sponsor-cell" href={href}>
      <span className="aries-sponsor-cell__logo">
        {/* Payload media URLs may be local or backed by Netlify Blobs; preserve the resolved URL. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo?.url ? <img alt="" src={logo.url} /> : <span>{String(cellData ?? '').slice(0, 2).toUpperCase()}</span>}
      </span>
      <span><strong>{String(cellData ?? '')}</strong><small>{record?.website || 'Partner profile'}</small></span>
    </a>
  )
}
