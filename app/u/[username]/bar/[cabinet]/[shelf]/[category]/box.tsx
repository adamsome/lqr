'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

import { BoxButton } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box-button'
import { BoxLine } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box-line'
import { BarCategory, GridCategoryDef } from '@/app/u/[username]/bar/lib/types'
import { Level } from '@/components/layout/level'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { useMutateStock } from '@/lib/api/use-mutate-stock'
import { toBarCategory } from '@/lib/routes'
import { sortByStocked } from '@/lib/stock'

type Props = {
  className?: string
  username?: string
  def: GridCategoryDef
  category: BarCategory
  isCurrentUser?: boolean
}

export function Box({
  className,
  username,
  def,
  category,
  isCurrentUser,
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
    if (mutating) return
    if (
      !isCurrentUser ||
      (!isStocked && !hideItems) ||
      def.disableOneClickEmpty
    ) {
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
  if (def.disableOneClickEmpty) name += '...'
  return (
    <BoxButton
      className={className}
      {...def}
      stocked={isStocked}
      disabled={mutating}
      onClick={handleClick}
    >
      <BoxLine
        className="font-semibold"
        stocked={isStocked}
        wrap={hideItems && items > 0}
        title
      >
        {name}
      </BoxLine>
      {displayItems.map((it) => (
        <BoxLine key={it.id} stocked={(it.stock ?? -1) > 0}>
          {it.name}
        </BoxLine>
      ))}
      {displayItems.length === 0 && !hideItems && items > 0 && (
        <Level
          className="flex-1 self-end text-muted-foreground/30 font-normal tracking-tighter whitespace-nowrap"
          items="end"
          gap={0}
        >
          <DotsHorizontalIcon className="w-3 h-3" />
        </Level>
      )}
    </BoxButton>
  )
}
