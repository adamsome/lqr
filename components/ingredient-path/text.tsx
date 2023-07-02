import { Fragment } from 'react'

import { useData } from '@/components/data-provider'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { cn } from '@/lib/utils'

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
  id?: string
  path?: string[]
}

export function IngredientPathText({ id, path }: Props) {
  const { baseIngredientDict, ingredientDict } = useData()

  if (!path) {
    if (!id) return <>Unknown Ingredient Path</>
    return (
      <>
        {ingredientDict[id]?.name ??
          baseIngredientDict[id]?.name ??
          CATEGORY_DICT[id as Category]?.name ??
          'Unknown Ingredient ID'}
      </>
    )
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
