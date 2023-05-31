import { CardIngredient } from '@/components/specs/card-ingredient'
import {
  Card as BaseCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spec } from '@/lib/types'

type Props = {
  spec: Spec
}

export function Card({ spec }: Props) {
  const { name, ingredients, source } = spec
  return (
    <BaseCard>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {source && <CardDescription>{source}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, i) => (
            <CardIngredient
              key={`${i}_${ingredient.name ?? ingredient.id}`}
              ingredient={ingredient}
            />
          ))}
        </div>
      </CardContent>
    </BaseCard>
  )
}
