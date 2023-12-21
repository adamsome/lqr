import Link from 'next/link'
import { sortBy } from 'ramda'

import { sortSpecs } from '@/app/u/[username]/specs/_criteria/sort'
import { Card } from '@/app/u/[username]/specs/card'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { getFolloweeIDs } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getManyUsers } from '@/lib/model/user'
import { toHome, toSpecItem, toSpecs } from '@/lib/routes'
import { Ingredient, Spec, User } from '@/lib/types'

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
  const follows = await getFolloweeIDs(user.id)
  const userIDs = [user.id, ...follows.map(({ followee }) => followee)]

  const [users, data, rawSpecs] = await Promise.all([
    getManyUsers(userIDs),
    getIngredientData(),
    getSpecs(userIDs),
  ])

  const specs = sortSpecs(rawSpecs)

  const specsByUsername = specs.reduce<Record<string, Spec[]>>((acc, spec) => {
    const { username } = spec
    if (!acc[username]) acc[username] = []
    acc[username].push(spec)
    return acc
  }, {})

  const followers = sortByRecentSpec(specsByUsername, users.slice(1))

  const { dict } = data
  const specCount = specsByUsername[user.username]?.length ?? 0
  const bottleCount = Object.keys(dict).filter(isStockedBottle(dict)).length

  return (
    <>
      <UserAvatarHeader
        user={user}
        specCount={specCount}
        bottleCount={bottleCount}
      />
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
