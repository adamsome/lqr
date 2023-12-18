import { Ingredient } from '@/app/u/[username]/specs/[id]/ingredient'
import { SpecStock } from '@/app/u/[username]/specs/[id]/spec-stock'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from '@/components/ui/card'
import { toSpecItem } from '@/lib/routes'
import { IngredientData, Spec } from '@/lib/types'

type Props = {
  data: IngredientData
  spec: Spec
  criteria: Criteria
  showStock?: boolean
}

export function TallCard({ data, spec, criteria, showStock }: Props) {
  const { id, name, ingredients, source, stock, username } = spec
  const searchParams =
    criteria.username && criteria.username !== username
      ? `?u=${criteria.username}`
      : ''
  return (
    <CardLink href={toSpecItem(username, id) + searchParams}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {source && <CardDescription>{source}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 text-sm">
        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, i) => (
            <Ingredient
              key={`${i}_${ingredient.name ?? ingredient.id}`}
              data={data}
              ingredient={ingredient}
              stock={stock?.ingredients[i]}
              showStock={showStock}
            />
          ))}
        </div>
      </CardContent>
      {showStock && (
        <CardFooter>
          <SpecStock stock={stock} />
        </CardFooter>
      )}
    </CardLink>
  )
}
