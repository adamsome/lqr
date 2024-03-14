'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { SpecIngredientCommandDialogButton } from '@/app/components/spec-ingredient-command/command-dialog-button'
import { Button } from '@/app/components/ui/button'
import { CheckboxWithLabel } from '@/app/components/ui/checkbox-label'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { getIngredientName as makeGetIngredientName } from '@/app/lib/ingredient/get-ingredient-name'
import { getSpecCategoryItems } from '@/app/lib/spec-category'
import { IngredientData, SpecIngredient, User } from '@/app/lib/types'
import { asArray } from '@/app/lib/utils'
import {
  BAR_CATEGORY_KEY,
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
  bar: ReactNode
}

export function Filters({ className, data, criteria, users, bar }: Props) {
  const { categories, ingredients } = criteria
  const { append, clear } = useRouterSearchParams()

  const { dict } = data
  const getIngredientName = makeGetIngredientName(dict)

  const showUsers =
    users.filter((u) => u.username !== criteria.username).length > 0

  function handleSelectIngredient(ingredient: SpecIngredient): void {
    append(INGREDIENT_KEY, buildIngredientCriterion(ingredient))
  }

  return (
    <Stack className={className} gap={4}>
      <Stack
        className="-ml-4 max-h-screen w-auto flex-initial overflow-y-auto pl-4 sm:-mb-[76px] sm:pb-[13px]"
        gap={6}
      >
        <FilterSection name="Category" actions={<Clear name={CATEGORY_KEY} />}>
          <Level className="flex-wrap gap-y-2" gap={4}>
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
          </Level>
        </FilterSection>

        {showUsers && (
          <FilterSection name="Users" actions={<Clear name={USER_KEY} />}>
            <Level className="flex-wrap gap-y-2" gap={4}>
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
                    <span className="inline-flex w-full items-center gap-1 overflow-hidden">
                      <UserAvatarImage user={user} size="sm" />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {displayName ?? username}
                      </span>
                    </span>
                  </CheckboxWithLabel>
                )
              })}
            </Level>
          </FilterSection>
        )}

        <FilterSection
          name="Bar"
          actions={
            <>
              <SpecIngredientCommandDialogButton
                className="text-accent-muted hover:text-accent-foreground hover:bg-accent-foreground/15 flex h-6 gap-1 px-2 py-px"
                variant="ghost"
                size="sm"
                submit="ingredient"
                hideCustom
                onSelect={handleSelectIngredient}
              >
                <PlusIcon />
                Filter Specific Ingredient
              </SpecIngredientCommandDialogButton>
              <Clear name={[BAR_CATEGORY_KEY, INGREDIENT_KEY]} />
            </>
          }
        >
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
          <div className="-ml-4 w-auto">{bar}</div>
        </FilterSection>
      </Stack>
    </Stack>
  )
}

type ClearProps = {
  name: string | string[]
}

function Clear({ name }: ClearProps) {
  const { searchParams, clear } = useRouterSearchParams()
  const names = asArray(name)
  if (names.flatMap((n) => searchParams.getAll(n)).length === 0) return null
  return (
    <Button
      className="text-accent-muted hover:text-accent-foreground hover:bg-accent-foreground/15 flex h-auto gap-1 px-2 py-px"
      variant="secondary"
      size="sm"
      onClick={() => clear(names)}
    >
      Clear
    </Button>
  )
}
