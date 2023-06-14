import { useData } from '@/components/data-provider'
import { IngredientPathText } from '@/components/ingredient-path/text'
import { HierarchicalCommandList } from '@/components/ui/hierarchical-command-list'
import { useGetIngredientPathName } from '@/hooks/use-get-ingredient-path-name'
import { useHierarchicalSpiritsRoot } from '@/hooks/use-hierarchical-spirits-root'
import { SpecIngredient } from '@/lib/types'

type Props = {
  hasSearch?: boolean
  onSelect(ingredient: SpecIngredient): void
}

export function SpiritItems({ hasSearch, onSelect }: Props) {
  const { ingredientDict } = useData()
  const categoryRoot = useHierarchicalSpiritsRoot()
  const getPathName = useGetIngredientPathName()
  return (
    <HierarchicalCommandList
      root={categoryRoot}
      hasSearch={hasSearch}
      getName={getPathName}
      getBottleName={(id) => ingredientDict[id]?.name ?? ''}
      renderName={(path, full) => (
        <IngredientPathText path={path} full={full} />
      )}
      onSelect={({ path, bottleID }) =>
        onSelect({ id: path[path.length - 1], bottleID })
      }
    />
  )
}
