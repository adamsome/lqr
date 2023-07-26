import { Card } from '@/app/specs/card'
import { CardGrid } from '@/components/ui/card-grid'
import { IngredientData, Spec } from '@/lib/types'

type Props = {
  data: IngredientData
  specs: Spec[]
}

export function Grid({ data, specs }: Props) {
  if (!specs.length) {
    return <>No results</>
  }
  return (
    <CardGrid>
      {specs.map((spec) => (
        <Card key={spec.id} data={data} spec={spec} />
      ))}
    </CardGrid>
  )
}
