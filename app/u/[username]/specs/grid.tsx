import Link from 'next/link'

import { Empty } from '@/app/components/empty'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarLink } from '@/app/components/user/user-avatar-link'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import {
  SPECS,
  toBar,
  toCreateSpec,
  toFollowing,
  toHome,
  toSpecItem,
  toSpecs,
} from '@/app/lib/routes'
import { Spec, User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { MoreMenu } from '@/app/u/[username]/specs/[id]/more-menu'
import { MoreMenuContent } from '@/app/u/[username]/specs/[id]/more-menu-content'
import { SpecStockText } from '@/app/u/[username]/specs/[id]/spec-stock'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Card, CardDescription } from '@/app/u/[username]/specs/card'
import { LoadMoreButton } from '@/app/u/[username]/specs/load-more-button'

const linkClass =
  'text-base text-accent-strong underline-offset-4 hover:underline'

type Props = {
  specs: Spec[]
  userDict: Record<string, User>
  criteria: Criteria
  count: number
  // Specs before filtering; distinguishes "filtered out" from "none at all"
  total?: number
  isCurrentUser?: boolean
  showStock?: boolean
}

export async function Grid({
  specs,
  userDict,
  criteria,
  count,
  total,
  isCurrentUser,
  showStock,
}: Props) {
  if (!specs.length) {
    const { username } = criteria
    if (total) {
      return (
        <Empty title="No specs match your filters">
          <Link
            className={linkClass}
            href={username ? toSpecs(username) : SPECS}
          >
            Clear filters
          </Link>
        </Empty>
      )
    }
    if (isCurrentUser) {
      return (
        <Empty title="Your library is empty">
          <p>Follow people to see their specs, or add your own.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link className={linkClass} href={toFollowing(username)}>
              Find people to follow
            </Link>
            <Link className={linkClass} href={toBar(username)}>
              Set up your bar
            </Link>
            <Link className={linkClass} href={toCreateSpec(username)}>
              Create a spec
            </Link>
          </div>
        </Empty>
      )
    }
    return <Empty title="No specs yet" />
  }
  const data = await getIngredientData()
  const { username = '', limit } = criteria
  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(min(theme(spacing.64),calc(100vw-1rem)),1fr))]',
          '-mx-2 gap-2 sm:gap-3 lg:gap-4',
        )}
      >
        {specs.slice(0, limit).map((spec) => (
          <Card
            key={spec.id}
            data={data}
            spec={spec}
            href={toSpecItem(spec, username)}
            description={
              <CardDescription>
                <UserAvatarLink className="z-10" href={toHome(spec.username)}>
                  <UserAvatar
                    className="overflow-hidden"
                    size="sm"
                    user={userDict[spec.username]}
                  />
                </UserAvatarLink>
                {showStock && spec.stock && (
                  <SpecStockText className="text-xs" stock={spec.stock} />
                )}
              </CardDescription>
            }
            actions={
              <MoreMenu>
                <MoreMenuContent username={username} spec={spec} />
              </MoreMenu>
            }
          />
        ))}
      </div>
      {limit < count && <LoadMoreButton limit={limit} />}
    </>
  )
}
