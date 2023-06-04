import { CardIngredient } from '@/app/specs/card-ingredient'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardLink,
  CardTitle,
} from '@/components/ui/card'
import { Spec } from '@/lib/types'

type Props = {
  spec: Spec
}

export function Card({ spec }: Props) {
  const { id, name, ingredients, source } = spec
  return (
    <CardLink href={`/spec/${id}`}>
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
    </CardLink>
  )
}
