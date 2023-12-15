import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Card } from '@/app/u/[username]/specs/card'
import { LoadMoreButton } from '@/app/u/[username]/specs/load-more-button'
import { CardGrid } from '@/components/ui/card-grid'
import { IngredientData, Spec } from '@/lib/types'

type Props = {
  data: IngredientData
  specs: Spec[]
  criteria: Criteria
  count: number
  showStock?: boolean
}

export function Grid({ data, specs, criteria, count, showStock }: Props) {
  if (!specs.length) {
    return <>No results</>
  }
  const { limit } = criteria
  return (
    <>
      <CardGrid>
        {specs.slice(0, criteria.limit).map((spec) => (
          <Card
            key={spec.id}
            data={data}
            spec={spec}
            criteria={criteria}
            showStock={showStock}
          />
        ))}
      </CardGrid>
      {limit < count && <LoadMoreButton limit={limit} />}
    </>
  )
}
