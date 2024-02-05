import { Empty } from '@/app/components/empty'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarLink } from '@/app/components/user/user-avatar-link'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { toHome, toSpecItem } from '@/app/lib/routes'
import { Spec, User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { SpecStockText } from '@/app/u/[username]/specs/[id]/spec-stock'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Card, CardDescription } from '@/app/u/[username]/specs/card'
import { LoadMoreButton } from '@/app/u/[username]/specs/load-more-button'

type Props = {
  specs: Spec[]
  userDict: Record<string, User>
  criteria: Criteria
  count: number
  showStock?: boolean
}

export async function Grid({
  specs,
  userDict,
  criteria,
  count,
  showStock,
}: Props) {
  if (!specs.length) {
    return (
      <Empty title="No specs in your library">
        Create some cocktail specs or
        <br />
        follow some other users!
      </Empty>
    )
  }
  const data = await getIngredientData()
  const { limit } = criteria
  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(min(theme(spacing.64),calc(100vw-1rem)),1fr))]',
          'gap-2 sm:gap-3 lg:gap-4 -mx-2',
        )}
      >
        {specs.slice(0, criteria.limit).map((spec) => (
          <Card
            key={spec.id}
            data={data}
            spec={spec}
            href={toSpecItem(spec, criteria.username)}
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
          />
        ))}
      </div>
      {limit < count && <LoadMoreButton limit={limit} />}
    </>
  )
}
