import type { DefaultServerCellComponentProps } from 'payload'

export const UserNameCell = ({ cellData, linkURL, rowData }: DefaultServerCellComponentProps) => {
  const name = String(cellData || rowData?.email || 'Editorial user')
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const href = linkURL || (rowData?.id ? `/admin/collections/users/${rowData.id}` : '#')

  return <a className="aries-user-cell" href={href}><span>{initials}</span><strong>{name}</strong></a>
}
