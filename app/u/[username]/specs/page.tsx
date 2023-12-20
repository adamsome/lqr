import invariant from 'tiny-invariant'

import { parseCriteria } from '@/app/u/[username]/specs/_criteria/parse'
import { SpecsContainer } from '@/app/u/[username]/specs/specs-container'
import { getUser } from '@/lib/model/user'

type Props = {
  params?: {
    username?: string
  }
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

export default async function Page({ params = {}, searchParams = {} }: Props) {
  const { username } = params

  const user = await getUser(username)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  const criteria = parseCriteria(searchParams ?? {}, username)
  return <SpecsContainer user={user} criteria={criteria} />
}
