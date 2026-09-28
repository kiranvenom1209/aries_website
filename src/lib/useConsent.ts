'use client'

import { useSyncExternalStore } from 'react'

import { readConsent, subscribeConsent, type ConsentRecord } from './consent'

/**
 * The visitor's decision: `undefined` while rendering on the server and during hydration,
 * `null` when nothing (valid) is stored, otherwise the record.
 */
export function useConsent(): ConsentRecord | null | undefined {
  return useSyncExternalStore<ConsentRecord | null | undefined>(subscribeConsent, readConsent, () => undefined)
}
