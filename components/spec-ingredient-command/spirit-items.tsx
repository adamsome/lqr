import { useIngredientData } from '@/components/data-provider'
import { IngredienFullName } from '@/components/ingredient-full-name'
import { HierarchicalCommandList } from '@/components/ui/hierarchical-command-list'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { useGetIngredientPathName } from '@/hooks/use-get-ingredient-path-name'
import { useFilterIngredientTree } from '@/hooks/use-filter-ingredient-tree'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { SpecIngredient } from '@/lib/types'

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
