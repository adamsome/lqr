import { useIngredientData } from '@/app/components/data-provider'
import { IngredienFullName } from '@/app/components/ingredient-full-name'
import { HierarchicalCommandList } from '@/app/components/ui/hierarchical-command-list'
import { useGetIngredientName } from '@/app/lib/ingredient/use-get-ingredient-name'
import { useGetIngredientPathName } from '@/app/lib/ingredient/use-get-ingredient-path-name'
import { useFilterIngredientTree } from '@/app/components/spec-ingredient-command/use-filter-ingredient-tree'
import { CATEGORY_DICT, Category } from '@/app/lib/generated-consts'
import { SpecIngredient } from '@/app/lib/types'

type Props = {
  hasSearch?: boolean
  stocked?: Set<string>
  onSelect(ingredient: SpecIngredient): void
}

export function SpiritItems({ hasSearch, stocked, onSelect }: Props) {
  const { dict } = useIngredientData()
  const categoryRoot = useFilterIngredientTree('spirit', 'beerWine')
  const getIngredientPathName = useGetIngredientPathName()
  const getName = useGetIngredientName()
  return (
    <HierarchicalCommandList
      root={categoryRoot}
      disabledIDs={stocked}
      hasSearch={hasSearch}
      groupTrunks
      muteItems
      showBottles
      getIngredientPathName={getIngredientPathName}
      renderName={({ id, path, item }) => {
        if (path) return <IngredienFullName id={id} path={path} />
        if (item) return getName(item)
        if (!id) return 'Unknown Ingredient'
        return (
          dict[id]?.name ??
          CATEGORY_DICT[id as Category]?.name ??
          getName({ id })
        )
      }}
      onSelect={({ path, id: bottleID }) =>
        onSelect({ id: path?.[path.length - 1], bottleID })
      }
    />
  )
}
