import { Ingredient } from '@/app/specs/[id]/ingredient'
import { SpecStock } from '@/app/specs/[id]/spec-stock'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from '@/components/ui/card'
import { toSpec } from '@/lib/routes'
import { Spec } from '@/lib/types'

type Props = {
  spec: Spec
}

export function Card({ spec }: Props) {
  const { id, name, ingredients, source, stock } = spec
  return (
    <CardLink href={toSpec(id)}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {source && <CardDescription>{source}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 text-sm">
        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, i) => (
            <Ingredient
              key={`${i}_${ingredient.name ?? ingredient.id}`}
              ingredient={ingredient}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <SpecStock stock={stock} />
      </CardFooter>
    </CardLink>
  )
}
