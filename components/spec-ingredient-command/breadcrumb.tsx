import { Dispatch } from 'react'

import { Action, State } from '@/components/spec-ingredient-command/reducer'
import { SpecIngredient } from '@/lib/types'
import {
  Breadcrumb as BreadcrumbBase,
  BreadcrumbItem,
} from '@/components/ui/breadcrumb'
import { INGREDIENT_KINDS } from '@/lib/ingredient/kind'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { rejectNil } from '@/lib/utils'

type Props = {
  state: State
  dispatch: Dispatch<Action>
}

export function Breadcrumb({ state, dispatch }: Props) {
  const getName = useGetIngredientName()
  const { kind, ingredient, special } = state

  if (!kind) return null

  const kindLabel = INGREDIENT_KINDS.find((k) => k.value === kind)?.label

  let ingredientName: string | undefined
  if (ingredient) ingredientName = getName(ingredient, { inclBottle: true })

  let specialName: string | undefined
  if (!ingredient && special === 'allSpirits') specialName = 'All Spirits'
  if (special === 'rum' && !isGenericRum(ingredient)) specialName = 'Rum'

  let categoryName: string | undefined
  if (ingredient?.bottleID) categoryName = getName(ingredient)

  const names = rejectNil([
    kindLabel,
    specialName,
    categoryName,
    ingredientName,
  ])

  const handleClick = () => dispatch({ type: 'back' })
  const handleItemClick = (i: number) => () =>
    i !== names.length - 1 ? handleClick() : {}

  return (
    <div className="border-b p-3 pr-10">
      <BreadcrumbBase back onBackClick={handleClick}>
        {names.map((name, i) => (
          <BreadcrumbItem key={`${i}_${name}`} onClick={handleItemClick(i)}>
            {name}
          </BreadcrumbItem>
        ))}
      </BreadcrumbBase>
    </div>
  )
}

function isGenericRum(ingredient?: SpecIngredient) {
  if (!ingredient) return false
  const { id, aging, black, bottleID, infusion, overproof, productionMethod } =
    ingredient
  return (
    id === 'cane_rum' &&
    !aging?.length &&
    black === undefined &&
    !bottleID &&
    !infusion &&
    overproof === undefined &&
    !productionMethod
  )
}
