import type { Access, FieldAccess } from 'payload'

export type UserRole = 'admin' | 'editor'

type UserWithRole = {
  role?: UserRole | null
}

const getRole = (user: unknown): UserRole | null => {
  if (!user || typeof user !== 'object' || !('role' in user)) return null

  const role = (user as UserWithRole).role
  return role === 'admin' || role === 'editor' ? role : null
}

export const hasRole = (user: unknown, roles: UserRole[]): boolean => {
  const role = getRole(user)
  return role !== null && roles.includes(role)
}

export const isAdmin = (user: unknown): boolean => hasRole(user, ['admin'])

export const isEditor = (user: unknown): boolean => hasRole(user, ['admin', 'editor'])

export const admins: Access = ({ req }) => isAdmin(req.user)

export const editors: Access = ({ req }) => isEditor(req.user)

export const adminsOrSelf: Access = ({ req }) => {
  if (isAdmin(req.user)) return true

  if (isEditor(req.user) && req.user && typeof req.user === 'object' && 'id' in req.user) {
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  return false
}

export const adminsExceptSelf: Access = ({ req }) => {
  if (!isAdmin(req.user)) return false

  if (req.user && typeof req.user === 'object' && 'id' in req.user) {
    return {
      id: {
        not_equals: req.user.id,
      },
    }
  }

  return false
}

export const adminsField: FieldAccess = ({ req }) => isAdmin(req.user)

export const adminsFieldExceptSelf: FieldAccess = ({ id, req }) => {
  if (!isAdmin(req.user)) return false
  if (!req.user || typeof req.user !== 'object' || !('id' in req.user)) return false

  return String(req.user.id) !== String(id)
}

export const publishedOrEditor: Access = ({ req }) => {
  if (isEditor(req.user)) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const publicOrEditor =
  (fieldName = 'isPublic'): Access =>
  ({ req }) => {
    if (isEditor(req.user)) return true

    return {
      [fieldName]: {
        equals: true,
      },
    }
  }
