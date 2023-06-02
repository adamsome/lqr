import { CardIngredient } from '@/components/specs/card-ingredient'
import {
  Card as BaseCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spec } from '@/lib/types'
import Link from 'next/link'

type Props = {
  spec: Spec
}

export function Card({ spec }: Props) {
  const { id, name, ingredients, source } = spec
  return (
    <BaseCard>
      <Link className="block h-full" href={`/spec/${id}`}>
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
      </Link>
    </BaseCard>
  )
}
