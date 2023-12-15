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
export const toSpecItem = prefixUserItem(toSpecs)
export const toSpecEdit = prefixUserItem(toSpecs, '/edit')
export const toResearch = () => '/research'
