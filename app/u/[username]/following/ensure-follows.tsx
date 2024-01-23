import { add, isPast, parseISO } from 'date-fns'
import { PropsWithChildren } from 'react'

import { Follow } from '@/app/lib/types'

export type Props = PropsWithChildren<{
  follow?: Follow | null
}>

export const EnsureFollows = ({ children, follow }: Props) => {
  if (follow) {
    const { followedAt, follows } = follow
    // Allow unfollowed within last hour
    if (!follows && isPast(add(parseISO(followedAt), { hours: 1 }))) return null
  }
  return <>{children}</>
}
