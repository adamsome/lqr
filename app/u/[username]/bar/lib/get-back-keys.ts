import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'

export function getBackKeys<T extends CategoryKeys>(keys: T): T {
  let result: T = { ...keys, category: undefined }
  if (keys.category) return result
  result = { ...result, shelf: undefined }
  if (keys.shelf) return result
  return { ...result, cabinet: undefined }
}
