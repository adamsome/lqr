import { Category, CATEGORY_DICT } from '@/lib/consts'
import { Ingredient } from '@/lib/types'
import { cn } from '@/lib/util/cn'
import { Fragment } from 'react'

const DIM: Partial<Record<Category, boolean>> = {
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

type Props = {
  ingredient: Ingredient
}

export function CategoryCell({ ingredient }: Props) {
  const { category, ancestors } = ingredient
  const onlyIndex = ancestors.findLastIndex((a) => ONLY[a.id])
  return (
    <div>
      <span
        className={cn(DIM[category] && 'text-muted-foreground', {
          'text-muted-foreground': onlyIndex >= 0 || DIM[category],
        })}
      >
        {CATEGORY_DICT[category].name}
      </span>
      <span>{', '}</span>
      {ancestors.map((ancestor, i) => (
        <Fragment key={ancestor.id}>
          <span
            className={cn({
              'text-muted-foreground':
                (onlyIndex >= 0 && i !== onlyIndex) ||
                (DIM_LAST[ancestors[i - 1]?.id] && i !== onlyIndex),
            })}
          >
            {ancestor.name}
          </span>
          <span>{i === ancestors.length - 1 ? '' : ', '}</span>
        </Fragment>
      ))}
    </div>
  )
}
