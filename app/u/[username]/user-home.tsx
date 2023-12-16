import { CardHeader, CardLink } from '@/components/ui/card'
import { CardGrid } from '@/components/ui/card-grid'
import { UserAvatar } from '@/components/user-avatar'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { toBar, toResearch, toSpecs } from '@/lib/routes'
import { Ingredient, User } from '@/lib/types'
import { CaretRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export const revalidate = 0

const isStockedBottle = (dict: Record<string, Ingredient>) => (id: string) =>
  dict[id].ordinal !== undefined && (dict[id].stock ?? -1) >= 0

type Props = {
  user: User
}

export async function UserHome({ user }: Props) {
  const { dict } = await getIngredientData(user.id)

  const bottleCount = Object.keys(dict).filter(isStockedBottle(dict)).length
  const bottleCountText = `${bottleCount} bottle${bottleCount !== 1 ? 's' : ''}`

  return (
    <>
      <Link href={toBar(user.username)}>
        <UserAvatar user={user} size="xl">
          {bottleCountText} <CaretRightIcon />
        </UserAvatar>
      </Link>
      <CardGrid>
        <CardLink href={toSpecs(user.username)}>
          <CardHeader>Specs</CardHeader>
        </CardLink>
        <CardLink href={toBar(user.username)}>
          <CardHeader>Bar</CardHeader>
        </CardLink>
        <CardLink href={toResearch()}>
          <CardHeader>Research</CardHeader>
        </CardLink>
      </CardGrid>
    </>
  )
}
