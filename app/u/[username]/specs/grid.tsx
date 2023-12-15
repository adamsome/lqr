import { Card } from '@/app/u/[username]/specs/card'
import { LoadMoreButton } from '@/app/u/[username]/specs/load-more-button'
import { CardGrid } from '@/components/ui/card-grid'
import { IngredientData, Spec } from '@/lib/types'

type Props = {
  data: IngredientData
  specs: Spec[]
  limit: number
  count: number
  usernameParam?: string
  showStock?: boolean
}

export function Grid({
  data,
  specs,
  limit,
  count,
  usernameParam,
  showStock,
}: Props) {
  if (!specs.length) {
    return <>No results</>
  }
  return (
    <>
      <CardGrid>
        {specs.map((spec) => (
          <Card
            key={spec.id}
            data={data}
            spec={spec}
            usernameParam={usernameParam}
            showStock={showStock}
          />
        ))}
      </CardGrid>
      {limit < count && <LoadMoreButton limit={limit} />}
    </>
  )
}
