import { Card } from '@/app/specs/card'
import { LoadMoreButton } from '@/app/specs/load-more-button'
import { CardGrid } from '@/components/ui/card-grid'
import { IngredientData, Spec } from '@/lib/types'

type Props = {
  data: IngredientData
  specs: Spec[]
  limit: number
  count: number
}

export function Grid({ data, specs, limit, count }: Props) {
  if (!specs.length) {
    return <>No results</>
  }
  return (
    <>
      <CardGrid>
        {specs.map((spec) => (
          <Card key={spec.id} data={data} spec={spec} />
        ))}
      </CardGrid>
      {limit < count && <LoadMoreButton limit={limit} />}
    </>
  )
}
