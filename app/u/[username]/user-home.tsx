import Link from 'next/link'
import { sortBy } from 'ramda'

import { Button } from '@/app/components/ui/button'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getAllSpecs, getAllSpecsWithUserIDs } from '@/app/lib/model/spec'
import { getAllUsers } from '@/app/lib/model/user'
import { toHome, toSpecItem, toSpecs } from '@/app/lib/routes'
import { Ingredient, Spec, User } from '@/app/lib/types'
import { sortSpecs } from '@/app/u/[username]/specs/_criteria/sort'
import { Card } from '@/app/u/[username]/specs/card'

export const revalidate = 0

const isStockedBottle = (dict: Record<string, Ingredient>) => (id: string) =>
  dict[id].ordinal !== undefined && (dict[id].stock ?? -1) >= 0

const sortByRecentSpec = (
  specsByUsername: Record<string, Spec[]>,
  users: User[],
) =>
  sortBy(
    (u) => specsByUsername[u.username]?.[0]?.updatedAt ?? '0',
    users,
  ).reverse()

type Props = {
  user: User
}

export async function UserHome({ user }: Props) {
  const follows = await getAllFollowing(user.id)
  const userIDs = [user.id, ...follows.map(({ followee }) => followee)]

  const [users, data, rawSpecs] = await Promise.all([
    getAllUsers(userIDs),
    getIngredientData(),
    getAllSpecsWithUserIDs(userIDs),
  ])

  const specs = sortSpecs(rawSpecs)

  const specsByUsername = specs.reduce<Record<string, Spec[]>>((acc, spec) => {
    const { username } = spec
    if (!acc[username]) acc[username] = []
    acc[username].push(spec)
    return acc
  }, {})

  const followers = sortByRecentSpec(specsByUsername, users.slice(1))

  return (
    <>
      <UserAvatarHeader username={user.username} />
      <div>
        <div className="-mx-2">
          {specsByUsername[user.username]
            ?.slice(0, 4)
            .map((spec) => (
              <Card
                key={spec.id}
                data={data}
                spec={spec}
                href={toSpecItem(spec, user.username)}
              />
            ))}
        </div>
        <ShowAll href={toSpecs(user.username)} />
      </div>
      {followers.map((follower) => (
        <div key={follower.id}>
          <div className="flex flex-col gap-2">
            <Link href={toHome(follower.username)}>
              <UserAvatar user={follower} size="md" />
            </Link>
            <div className="-mx-2">
              {specsByUsername[follower.username]
                ?.slice(0, 2)
                .map((spec) => (
                  <Card
                    key={spec.id}
                    data={data}
                    spec={spec}
                    href={toSpecItem(spec, user.username)}
                  />
                ))}
            </div>
          </div>
          <ShowAll href={toSpecs(follower.username)} />
        </div>
      ))}
    </>
  )
}

const ShowAll = ({ href }: { href: string }) => {
  return (
    <Link className="text-right text-sm font-medium" href={href}>
      <Button className="px-0" variant="link" size="sm">
        Show all
      </Button>
    </Link>
  )
}
