'use client'

import { PlusIcon } from '@radix-ui/react-icons'

import { Stack } from '@/app/components/layout/stack'
import { SpecIngredientCommandDialogButton } from '@/app/components/spec-ingredient-command/command-dialog-button'
import { Button } from '@/app/components/ui/button'
import { CheckboxWithLabel } from '@/app/components/ui/checkbox-label'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { getIngredientName as makeGetIngredientName } from '@/app/lib/ingredient/get-ingredient-name'
import { getSpecCategoryItems } from '@/app/lib/spec-category'
import { IngredientData, SpecIngredient, User } from '@/app/lib/types'
import {
  CATEGORY_KEY,
  INGREDIENT_KEY,
  USER_KEY,
} from '@/app/u/[username]/specs/_criteria/consts'
import { buildIngredientCriterion } from '@/app/u/[username]/specs/_criteria/ingredient-criterion'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { FilterSection } from '@/app/u/[username]/specs/filter-section'
import { IngredientFilter } from '@/app/u/[username]/specs/ingredient-filter'
import { useRouterSearchParams } from '@/app/u/[username]/specs/use-router-search-params'

const SPEC_CATEGORY_ITEMS = getSpecCategoryItems()

export type UserState = User & {
  checked?: boolean
}

export type Props = {
  className?: string
  data: IngredientData
  criteria: Criteria
  users: UserState[]
}

export function Filters({ className, data, criteria, users }: Props) {
  const { categories, ingredients } = criteria
  const { searchParams, append, clear } = useRouterSearchParams()

  const { dict } = data
  const getIngredientName = makeGetIngredientName(dict)

  const showUsers =
    users.filter(({ username }) => username !== criteria.username).length > 0

  function handleSelectIngredient(ingredient: SpecIngredient): void {
    append(INGREDIENT_KEY, buildIngredientCriterion(ingredient))
  }

  return (
    <Stack className={className} gap={4}>
      <Stack className="flex-initial max-h-screen overflow-y-auto" gap={6}>
        <FilterSection name="Category">
          {SPEC_CATEGORY_ITEMS.map(({ value, label }) => (
            <CheckboxWithLabel
              key={value}
              id={value}
              checked={categories.includes(value)}
              onCheckedChange={(checked) =>
                checked
                  ? append(CATEGORY_KEY, value)
                  : clear(CATEGORY_KEY, value)
              }
            >
              {label}
            </CheckboxWithLabel>
          ))}
        </FilterSection>

        {showUsers && (
          <FilterSection name="Users">
            {users.map((user) => {
              const { username, displayName, checked } = user
              return (
                <CheckboxWithLabel
                  key={username}
                  id={username}
                  checked={checked ?? false}
                  onCheckedChange={(value) =>
                    value
                      ? append(USER_KEY, username)
                      : clear(USER_KEY, username)
                  }
                >
                  <span className="inline-flex items-center gap-1 w-full overflow-hidden">
                    <UserAvatarImage user={user} size="sm" />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {displayName ?? username}
                    </span>
                  </span>
                </CheckboxWithLabel>
              )
            })}
          </FilterSection>
        )}

        <FilterSection name="Ingredients">
          <Stack className="empty:hidden" gap={1}>
            {ingredients.map((it) => {
              const { id = '' } = it
              const { ordinal, name } = dict[id] ?? {}
              const label = ordinal ? name : getIngredientName(it)
              return (
                <IngredientFilter
                  key={id || label}
                  name={label}
                  onClear={() =>
                    clear(INGREDIENT_KEY, buildIngredientCriterion(it))
                  }
                />
              )
            })}
          </Stack>
          <SpecIngredientCommandDialogButton
            className="flex gap-1 self-start"
            variant="secondary"
            size="sm"
            submit="ingredient"
            hideCustom
            onSelect={handleSelectIngredient}
          >
            <PlusIcon />
            Add Filter
          </SpecIngredientCommandDialogButton>
        </FilterSection>
      </Stack>

      <Stack className="flex-grow flex-shrink-0" justify="end">
        <Button
          className="sticky bottom-4"
          variant="secondary"
          disabled={!searchParams.toString()}
          onClick={() => clear()}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  )
}
