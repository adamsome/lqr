import { Spec } from '@/lib/types'

export const API_STOCK = '/api/stock'
export const API_SPECS = '/api/specs'

export const SIGN_IN = '/sign-in'
export const SIGN_UP = '/sign-up'

const prefixUserHome =
  (url: string = '') =>
  (username?: string | null) =>
    username ? `/u/${username}${url}` : '/'

const prefixUserItem =
  (fn: (username?: string | null) => string, url: string = '') =>
  (username?: string | null, id?: string | null) => {
    if (!username) return '/'
    const userRoute = fn(username)
    return id ? `${userRoute}/${id}${url}` : userRoute
  }

export const toHome = prefixUserHome()
export const toBar = prefixUserHome('/bar')
export const toCreateSpec = prefixUserHome('/create-spec')
export const toSpecs = prefixUserHome('/specs')
export const toSpecEdit = prefixUserItem(toSpecs, '/edit')
export const toResearch = () => '/research'

export const toSpecItem = (
  spec?: Pick<Spec, 'id' | 'username'>,
  fromUsername?: string,
) => {
  if (!spec) return fromUsername ? `/u/${fromUsername}` : '/'
  const { id, username } = spec
  return `/u/${username}/specs/${id}${
    fromUsername && username !== fromUsername ? `?u=${fromUsername}` : ''
  }`
}
