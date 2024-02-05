import Link from 'next/link'
import { sortBy } from 'ramda'

import { Button } from '@/app/components/ui/button'
import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getAllSpecsWithUserIDs } from '@/app/lib/model/spec'
import { getAllUsers, getCurrentUser } from '@/app/lib/model/user'
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
  username?: string
}

export async function UserHome({ username }: Props) {
  const { user, isCurrentUser } = await getCurrentUser(username)
  const follows = await getAllFollowing(user?.id)
  const followees = follows.map(({ followee }) => followee)
  const userIDs = user ? [user.id, ...followees] : followees

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
      <UserAvatarHeader username={username}>
        {!isCurrentUser && <FollowButtonContainer username={username} />}
      </UserAvatarHeader>
      <div>
        <div className="-mx-2">
          {specsByUsername[username ?? '']
            ?.slice(0, 4)
            .map((spec) => (
              <Card
                key={spec.id}
                data={data}
                spec={spec}
                href={toSpecItem(spec, username)}
              />
            ))}
        </div>
        <ShowAll href={toSpecs(username)} />
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
                    href={toSpecItem(spec, username)}
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
