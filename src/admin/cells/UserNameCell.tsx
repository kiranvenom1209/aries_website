import type { DefaultServerCellComponentProps } from 'payload'

export const UserNameCell = async ({ cellData, linkURL, payload, rowData }: DefaultServerCellComponentProps) => {
  const name = String(cellData || rowData?.email || 'Editorial user')
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const href = linkURL || (rowData?.id ? `/admin/collections/users/${rowData.id}` : '#')
  const record = rowData?.id
    ? await payload.findByID({ collection: 'users', id: rowData.id, depth: 1 })
    : null
  const avatar = record?.avatar && typeof record.avatar === 'object' ? record.avatar : null
  const src = avatar?.sizes?.thumbnail?.url ?? avatar?.thumbnailURL ?? avatar?.url

  return (
    <a className="aries-user-cell" href={href}>
      <span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src ? <img alt="" src={src} /> : initials}
      </span>
      <strong>{name}</strong>
    </a>
  )
}
