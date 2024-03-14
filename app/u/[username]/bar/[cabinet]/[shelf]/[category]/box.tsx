'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

import { BoxButton } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box-button'
import { BoxLine } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box-line'
import { BarCategory, BarCategoryDef } from '@/app/u/[username]/bar/lib/types'
import { Level } from '@/app/components/layout/level'
import { useGetIngredientName } from '@/app/lib/ingredient/use-get-ingredient-name'
import { useMutateStock } from '@/app/api/stock/use-mutate-stock'
import { toBarCategory } from '@/app/lib/routes'
import { sortByStocked } from '@/app/lib/stock'
import { ExcludeState } from '@/app/u/[username]/specs/_criteria/types'
import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  username?: string
  def: BarCategoryDef
  category: BarCategory
  isCurrentUser?: boolean
  filterState?: ExcludeState
  readonly?: boolean
  href?: string
  onCategoryClick?: (def: BarCategoryDef) => void
}

export function Box({
  className,
  username,
  def,
  category,
  isCurrentUser,
  filterState,
  readonly,
  href,
  onCategoryClick,
}: Props) {
  const { keys, items = 0 } = def
  const allStocked = sortByStocked(category.stocked)
  const stocked = allStocked.filter(({ stock = -1 }) => stock > 0)
  const stockedCount = stocked.length
  const isStocked = stockedCount > 0

  const router = useRouter()
  const { mutating, mutate } = useMutateStock({ watchData: stockedCount })
  const getIngredientName = useGetIngredientName()

  const hideItems = def.hideItems || def.hideGridItems
  const count = hideItems ? 0 : items
  const displayItems = allStocked.slice(0, Math.floor(count)).map((it) => {
    let name = getIngredientName(it, { inclBottle: true })
    if (name.startsWith('Amaro ')) name = name.replace('Amaro ', '')
    return { ...it, name }
  })

  const handleClick = async () => {
    if (href) return router.push(href)
    if (onCategoryClick) return onCategoryClick(def)
    if (mutating || readonly) return
    if (!isCurrentUser || (!isStocked && !hideItems) || def.miscellaneous) {
      router.push(toBarCategory({ ...keys, username }), { scroll: false })
    } else if (!isStocked) {
      const id = def.ids?.[0] ?? def.include?.[0]?.id
      if (id) await mutate(id, 1)
    } else {
      const ids = stocked.map(({ id }) => id)
      await mutate(ids, 0)
    }
  }

  let name = category.name ?? 'Unknown Category'
  if (def.miscellaneous) name += '...'
  return (
    <BoxButton
      className={className}
      {...def}
      stocked={isStocked}
      filterState={filterState}
      disabled={mutating}
      readonly={readonly}
      onClick={handleClick}
    >
      <BoxLine
        className="font-semibold"
        stocked={isStocked}
        wrap={hideItems && items > 0}
        filterState={filterState}
        title
      >
        {name}
      </BoxLine>
      {displayItems.map((it) => (
        <BoxLine
          key={it.id}
          stocked={(it.stock ?? -1) > 0}
          filterState={filterState}
        >
          {it.name}
        </BoxLine>
      ))}
      {displayItems.length === 0 && !hideItems && items > 0 && (
        <Level
          className={cn(
            'text-muted-foreground/30 flex-1 self-end whitespace-nowrap font-normal tracking-tighter',
            filterState && filterState !== 'none' && 'text-background',
          )}
          items="end"
          gap={0}
        >
          <DotsHorizontalIcon className="h-3 w-3" />
        </Level>
      )}
    </BoxButton>
  )
}
