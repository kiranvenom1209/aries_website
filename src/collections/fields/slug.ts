import type { Field } from 'payload'

const DIACRITICS = /[\u0300-\u036f]/g
const INVALID_SLUG_CHARACTERS = /[^a-z0-9]+/g
const LEADING_OR_TRAILING_DASHES = /^-+|-+$/g

export const formatSlug = (input: unknown): string => {
  if (typeof input !== 'string') return ''

  return input
    .normalize('NFKD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(INVALID_SLUG_CHARACTERS, '-')
    .replace(LEADING_OR_TRAILING_DASHES, '')
}

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    description: 'URL-safe identifier. Generated from the title when left empty.',
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        if (value) return formatSlug(value)

        const source = data?.[sourceField]
        return formatSlug(source)
      },
    ],
  },
})
