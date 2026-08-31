import type { DefaultServerCellComponentProps } from 'payload'

type MediaDoc = { alt?: string | null; thumbnailURL?: string | null; url?: string | null }

export const TeamNameCell = ({ cellData, linkURL, rowData }: DefaultServerCellComponentProps) => {
  const portrait = typeof rowData?.portrait === 'object' && rowData?.portrait ? rowData.portrait as MediaDoc : null
  const src = portrait?.thumbnailURL ?? portrait?.url ?? (typeof rowData?.portraitPath === 'string' ? rowData.portraitPath : null)
  const initials = String(cellData ?? '?').trim().split(/\s+/).slice(0, 2).map((part) => part?.[0] ?? '').join('').toUpperCase() || '?'

  return (
    <a className="aries-person-cell" href={linkURL ?? `/admin/collections/team/${rowData.id}`}>
      <span className="aries-person-cell__portrait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src ? <img src={src} alt="" /> : <span>{initials}</span>}
      </span>
      <span><strong>{String(cellData ?? 'Unnamed member')}</strong><small>{String(rowData.position ?? 'Role not set')}</small></span>
    </a>
  )
}

export const TeamStatusCell = ({ cellData }: DefaultServerCellComponentProps) => (
  <span className={`aries-status-cell ${cellData ? 'is-active' : 'is-inactive'}`}><span />{cellData ? 'Active' : 'Inactive'}</span>
)
