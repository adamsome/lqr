import { Fragment } from 'react'

import { cn } from '@/lib/utils'
import { useData } from '@/components/data-provider'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'

const DIM: Record<string, boolean> = {
  agave: true,
  cane: true,
  fortifiedwine: true,
  grain: true,
  liqueur: true,
  wine: true,
}
const DIM_LAST: Record<string, boolean> = {
  agave_tequila: true,
  brandy_grape: true,
  grain_gin: true,
  liqueur_amaro: true,
}
const ONLY: Record<string, boolean> = {
  brandy_grape_armagnac: true,
  brandy_grape_cognac: true,
  brandy_grape_eaudevie: true,
  brandy_grape_grappa: true,
  brandy_grape_pineaudescharentes: true,
  brandy_grape_pisco: true,
  brandy_grape_pommeau: true,
  grain_whiskey_bourbon: true,
  grain_whiskey_rye: true,
  grain_whiskey_scotch: true,
  liqueur_amaro_fernet: true,
}

type Props = {
  path: string[]
  full?: boolean
}

export function IngredientPathText({ path, full }: Props) {
  const { baseIngredientDict } = useData()

  if (!full) {
    if (path.length > 1) return <IngredientText id={path[path.length - 1]} />
    if (path.length === 1) return <CategoryText id={path[0]} />
    return null
  }

  const [category, ...ancestors] = path

  const onlyIndex = ancestors.findLastIndex((id) => ONLY[id])
  const hasChildren = ancestors.length > 0
  return (
    <span>
      <span
        className={cn({
          'text-muted-foreground':
            hasChildren && (onlyIndex >= 0 || DIM[category]),
        })}
      >
        {CATEGORY_DICT[category as Category]?.name ?? ''}
      </span>
      {hasChildren && <span>{', '}</span>}
      {ancestors.map((id, i) => (
        <Fragment key={id}>
          <span
            className={cn({
              'text-muted-foreground':
                (onlyIndex >= 0 && i !== onlyIndex) ||
                (DIM_LAST[ancestors[i - 1]] && i !== onlyIndex),
            })}
          >
            {baseIngredientDict[id]?.name ?? ''}
          </span>
          <span>{i === ancestors.length - 1 ? '' : ', '}</span>
        </Fragment>
      ))}
    </span>
  )
}

type TextProps = { id: string }

function IngredientText({ id }: TextProps) {
  const { baseIngredientDict } = useData()
  return <>{baseIngredientDict[id]?.name}</>
}

function CategoryText({ id }: TextProps) {
  return <>{CATEGORY_DICT[id as Category].name}</>
}
