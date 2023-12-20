import Link from 'next/link'

import { SpecStockText } from '@/app/u/[username]/specs/[id]/spec-stock'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Card } from '@/app/u/[username]/specs/card'
import { LoadMoreButton } from '@/app/u/[username]/specs/load-more-button'
import { UserAvatar } from '@/components/user-avatar'
import { toHome, toSpecItem } from '@/lib/routes'
import { IngredientData, Spec, User } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  data: IngredientData
  specs: Spec[]
  userDict: Record<string, User>
  criteria: Criteria
  count: number
}

export function Grid({ data, specs, userDict, criteria, count }: Props) {
  if (!specs.length) {
    return <>No results</>
  }
  const { limit } = criteria
  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(min(theme(spacing.64),calc(100vw-1rem)),1fr))]',
          'gap-1 lg:gap-2 -mx-2',
        )}
      >
        {specs.slice(0, criteria.limit).map((spec) => (
          <Card
            key={spec.id}
            data={data}
            spec={spec}
            href={toSpecItem(spec, criteria.username)}
            description={
              <div className="inline-flex items-center gap-4 py-px w-full text-muted-foreground overflow-hidden">
                <Link className="relative" href={toHome(spec.username)}>
                  <UserAvatar
                    className="overflow-hidden"
                    size="sm"
                    user={userDict[spec.username]}
                  />
                </Link>
                {spec.stock && (
                  <SpecStockText className="text-xs" stock={spec.stock} />
                )}
              </div>
            }
          />
        ))}
      </div>
      {limit < count && <LoadMoreButton limit={limit} />}
    </>
  )
}
