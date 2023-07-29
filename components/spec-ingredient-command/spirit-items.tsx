import { IngredientPathText } from '@/components/ingredient-path/text'
import { HierarchicalCommandList } from '@/components/ui/hierarchical-command-list'
import { useGetIngredientPathName } from '@/hooks/use-get-ingredient-path-name'
import { useFilterIngredientTree } from '@/hooks/use-hierarchical-spirits-root'
import { SpecIngredient } from '@/lib/types'

type Props = {
  hasSearch?: boolean
  onSelect(ingredient: SpecIngredient): void
}

export function SpiritItems({ hasSearch, onSelect }: Props) {
  const categoryRoot = useFilterIngredientTree('spirit', 'beerWine')
  const getIngredientPathName = useGetIngredientPathName()
  return (
    <HierarchicalCommandList
      root={categoryRoot}
      hasSearch={hasSearch}
      groupTrunks
      muteItems
      showBottles
      getIngredientPathName={getIngredientPathName}
      renderName={({ id, path }) => <IngredientPathText id={id} path={path} />}
      onSelect={({ path, id: bottleID }) =>
        onSelect({ id: path?.[path.length - 1], bottleID })
      }
    />
  )
}
