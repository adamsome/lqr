import { Fragment } from 'react'

import { CATEGORY_DICT } from '@/lib/consts'
import { Ingredient } from '@/lib/types'
import { cn } from '@/lib/utils'

const DIM: Record<string, boolean> = {
  agave: true,
  cane: true,
  fortifiedwine: true,
  grain: true,
  liqueur: true,
}
const DIM_LAST: Record<string, boolean> = {
  agave_tequila: true,
  brandy_grape: true,
  grain_gin: true,
  liqueur_amaro: true,
}
const ONLY: Record<string, boolean> = {
  brandy_grape_cognac: true,
  brandy_grape_eaudevie: true,
  brandy_grape_grappa: true,
  brandy_grape_pisco: true,
  grain_whiskey_bourbon: true,
  grain_whiskey_rye: true,
  grain_whiskey_scotch: true,
  liqueur_amaro_fernet: true,
}

interface Item {
  id: string
  name: string
}

type Props = {
  items: Item[]
}

export function CategoryText({ items }: Props) {
  const [root, ...children] = items
  const onlyIndex = children.findLastIndex((a) => ONLY[a.id])
  return (
    <div>
      <span
        className={cn(DIM[root.id] && 'text-muted-foreground', {
          'text-muted-foreground': onlyIndex >= 0 || DIM[root.id],
        })}
      >
        {root.name}
      </span>
      <span>{', '}</span>
      {children.map((child, i) => (
        <Fragment key={child.id}>
          <span
            className={cn({
              'text-muted-foreground':
                (onlyIndex >= 0 && i !== onlyIndex) ||
                (DIM_LAST[children[i - 1]?.id] && i !== onlyIndex),
            })}
          >
            {child.name}
          </span>
          <span>{i === children.length - 1 ? '' : ', '}</span>
        </Fragment>
      ))}
    </div>
  )
}
