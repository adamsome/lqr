import invariant from 'tiny-invariant'

import BarContainer from '@/app/u/[username]/bar/bar-container'
import { IngredientDataProvider } from '@/components/data-provider'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getUser } from '@/lib/model/user'

export const revalidate = 0

type Props = {
  params?: {
    username?: string
  }
}

export default async function Page({ params = {} }: Props) {
  const { username } = params
  const user = await getUser(username)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  const data = await getIngredientData(user.id)

  return (
    <IngredientDataProvider {...data}>
      <BarContainer user={user} data={data} />
    </IngredientDataProvider>
  )
}
