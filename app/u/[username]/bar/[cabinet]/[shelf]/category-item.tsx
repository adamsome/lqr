'use client'

import { useState } from 'react'

import { AddIngredientLink } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/add-ingredient-link'
import { Ingredient } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/ingredient'
import { HeadingLink } from '@/app/u/[username]/bar/components/heading-link'
import { BarCategory, GridCategoryDef } from '@/app/u/[username]/bar/lib/types'
import { Stack } from '@/components/layout/stack'
import { sortByStocked } from '@/lib/stock'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  username?: string
  def: GridCategoryDef
  category?: BarCategory
  flatList?: boolean
  isCurrentUser?: boolean
}

export function CategoryItem({
  className,
  username,
  def,
  category,
  flatList,
  isCurrentUser,
}: Props) {
  const { keys, hideItems, ids, include } = def
  const { name, stocked: rawStocked = [] } = category ?? {}
  const stocked = sortByStocked(rawStocked)
  const isStocked = stocked.filter(({ stock = -1 }) => stock > 0).length > 0

  const [collapse, setCollapse] = useState(false)

  if (!category) return null

  if (hideItems) {
    const id = ids?.[0] ?? include?.[0]?.id
    const it = stocked[0] ?? { id, stock: -1 }
    return (
      <Ingredient
        className="font-semibold tracking-tight"
        labelClassName={cn(
          !flatList && 'text-lg',
          !isStocked && 'text-muted-foreground',
        )}
        ingredient={it}
        name={name}
        border={false}
        isCurrentUser={isCurrentUser}
        disableDestock
      />
    )
  }

  const to = { ...keys, username }
  const nameStr = name ?? 'Unknown Category'
  return (
    <Stack className={className} gap={0}>
      <HeadingLink
        className={cn('-me-2', !isStocked && 'text-muted-foreground')}
        to={to}
        collapse={collapse}
        onClick={() => setCollapse((value) => !value)}
      >
        {nameStr}
      </HeadingLink>
      {!collapse && (
        <>
          {stocked.map((ingredient) => (
            <Ingredient
              key={ingredient.id}
              ingredient={ingredient}
              isCurrentUser={isCurrentUser}
            />
          ))}
          {isCurrentUser && <AddIngredientLink {...to} name={name} />}
          {!isCurrentUser && stocked.length === 0 && (
            <div className="pt-0.5 pb-2 text-muted-foreground/40 italic">
              {`No ${nameStr}`}
            </div>
          )}
        </>
      )}
    </Stack>
  )
}
