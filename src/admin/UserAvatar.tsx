import type { ServerProps } from 'payload'

import type { Media, User } from '../payload-types'

type UserWithAvatar = User & {
  avatar?: Media | number | null
}

const mediaURL = (value: Media | number | null | undefined) =>
  value && typeof value === 'object'
    ? value.sizes?.thumbnail?.url ?? value.thumbnailURL ?? value.url ?? null
    : null

export const UserAvatar = async ({ payload, user }: ServerProps) => {
  let account = user as UserWithAvatar | null | undefined

  if (account?.id && !mediaURL(account.avatar)) {
    try {
      account = await payload.findByID({
        collection: 'users',
        id: account.id,
        depth: 1,
        overrideAccess: true,
      })
    } catch {
      // Keep the header usable even if the account image cannot be populated.
    }
  }

  const src = mediaURL(account?.avatar)
  const label = account?.name || account?.email || 'Editorial user'
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <span aria-label={`${label} account`} className="aries-user-avatar" role="img">
      {/* Payload media can come from local storage or Netlify Blobs; preserve its resolved URL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img alt="" src={src} /> : <span aria-hidden="true">{initials}</span>}
    </span>
  )
}
