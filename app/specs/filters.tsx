'use client'

import { Plus } from 'lucide-react'

import { CATEGORY_KEY, INGREDIENT_KEY } from '@/app/specs/consts'
import { FilterSection } from '@/app/specs/filter-section'
import { IngredientFilter } from '@/app/specs/ingredient-filter'
import { SpecIngredientCommandDialogButton } from '@/components/spec-ingredient-command/command-dialog-button'
import { Button } from '@/components/ui/button'
import { CheckboxLabel } from '@/components/ui/checkbox-label'
import { useRouterSearchParams } from '@/hooks/use-router-search-params'
import { getIngredientName as makeGetIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { SPEC_CATEGORIES } from '@/lib/spec-category'
import { IngredientData } from '@/lib/types'

type Props = {
  data: IngredientData
  categories: string[]
  ingredients: string[]
}

export function Filters({ data, categories, ingredients }: Props) {
  const { searchParams, append, clear } = useRouterSearchParams()

  const { dict } = data
  const getIngredientName = makeGetIngredientName(dict)

  return (
    <div className="flex flex-col gap-6">
      <FilterSection name="Category">
        {SPEC_CATEGORIES.map(({ value, label }) => (
          <CheckboxLabel
            key={value}
            id={value}
            checked={categories.includes(value)}
            onCheckedChange={(checked) =>
              checked ? append(CATEGORY_KEY, value) : clear(CATEGORY_KEY, value)
            }
          >
            {label}
          </CheckboxLabel>
        ))}
      </FilterSection>

      <FilterSection name="Ingredients">
        <div className="flex flex-col gap-1 empty:hidden">
          {ingredients.map((id) => {
            const { ordinal, name } = dict[id] ?? {}
            const label = ordinal ? name : getIngredientName({ id })
            return (
              <IngredientFilter
                key={id}
                name={label}
                onClear={() => clear(INGREDIENT_KEY, id)}
              />
            )
          })}
        </div>
        <SpecIngredientCommandDialogButton
          className="flex gap-1 self-start"
          variant="secondary"
          size="sm"
          submit="ingredient"
          onSelect={(it) => append(INGREDIENT_KEY, it.bottleID ?? it.id)}
        >
          <Plus size={16} />
          Add Filter
        </SpecIngredientCommandDialogButton>
      </FilterSection>

      {searchParams.toString() && (
        <Button variant="secondary" onClick={() => clear()}>
          Clear
        </Button>
      )}
    </div>
  )
}
