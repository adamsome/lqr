'use client'

import { Cross1Icon } from '@radix-ui/react-icons'

import { IngredientPathText } from '@/components/ingredient-path/text'
import { StockIcon as BaseStockIcon } from '@/components/stock-icon'
import { Button } from '@/components/ui/button'
import { DataTableColumnFilterInput } from '@/components/ui/data-table-column-filter-input'
import { DataTableToolbarProps } from '@/components/ui/data-table-container'
import {
  DataTableFacetFilterButton,
  DataTableFacetedFilterItem,
} from '@/components/ui/data-table-facet-filter-button'
import { DataTableHierarchicalFacetFilterButton } from '@/components/ui/data-table-hierarchical-facet-filter-button'
import { DataTableMultiFacetFilterButton } from '@/components/ui/data-table-multi-facet-filter-button'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useGetIngredientPathName } from '@/hooks/use-get-ingredient-path-name'
import { useFilterIngredientTree } from '@/hooks/use-hierarchical-spirits-root'
import { useIsDataTableFiltered } from '@/hooks/use-is-data-table-filtered'
import {
  AGING_DICT,
  Aging,
  PRODUCTION_METHOD_DICT,
  ProductionMethod,
} from '@/lib/generated-consts'
import { StockState, getStockState } from '@/lib/stock'
import { Ingredient, WithPath } from '@/lib/types'

const STOCK_ITEMS: DataTableFacetedFilterItem[] = [
  { label: 'Full', value: 'full', icon: <StockIcon stock="full" /> },
  { label: 'Low', value: 'low', icon: <StockIcon stock="low" /> },
  { label: 'Missing', value: 'none', icon: <StockIcon stock="none" /> },
]

const NONE = { label: 'None', value: '__na' }

const PRODUCTION_METHODS = Object.keys(PRODUCTION_METHOD_DICT)
const PRODUCTION_METHOD_ITEMS: DataTableFacetedFilterItem[] =
  PRODUCTION_METHODS.map((key) => ({
    label: PRODUCTION_METHOD_DICT[key as ProductionMethod].name,
    value: key,
  })).concat(NONE)

const AGINGS = Object.keys(AGING_DICT)
const AGING_ITEMS: DataTableFacetedFilterItem[] = AGINGS.map((key) => ({
  label: AGING_DICT[key as Aging].name,
  value: key,
})).concat(NONE)

function transformStockFacets(facets: Map<any, number>) {
  const result = new Map<StockState, number>()
  facets.forEach((count, stock) => {
    const state = getStockState(stock)
    const curr = result.get(state) ?? 0
    result.set(state, curr + count)
  })
  return result
}

function transformCategoryFacets(facets: Map<any, number>) {
  const result = new Map<string, number>()
  facets.forEach((count, rawIDs) => {
    const ids = String(rawIDs).split('|')
    ids.forEach((id) => {
      const curr = result.get(id) ?? 0
      result.set(id, curr + count)
    })
  })
  return result
}

type Props = DataTableToolbarProps<WithPath<Ingredient>>

export function Toolbar({ table }: Props) {
  const isFiltered = useIsDataTableFiltered(table)
  const categoryRoot = useFilterIngredientTree('spirit', 'beerWine')
  const getIngredientPathName = useGetIngredientPathName()

  return (
    <div className="flex items-center justify-between -mx-4 px-4 col-[1/-1] overflow-x-auto no-scrollbar">
      <div className="flex flex-1 items-center gap-2">
        <DataTableColumnFilterInput
          id="name"
          placeholder="Filter Names..."
          table={table}
        />
        {table.getColumn('stock') && (
          <DataTableFacetFilterButton
            column={table.getColumn('stock')}
            title="In Stock"
            icon={<StockIcon stock="full" />}
            items={STOCK_ITEMS}
            transformFacetsFn={transformStockFacets}
          />
        )}
        {table.getColumn('ancestors') && (
          <DataTableHierarchicalFacetFilterButton
            column={table.getColumn('ancestors')}
            title="Category"
            root={categoryRoot}
            renderName={({ id, path }) => (
              <IngredientPathText id={id} path={path} />
            )}
            getIngredientPathName={getIngredientPathName}
            transformFacetsFn={transformCategoryFacets}
          />
        )}
        <DataTableMultiFacetFilterButton
          columns={[
            table.getColumn('productionMethod'),
            table.getColumn('aging'),
            table.getColumn('black'),
            table.getColumn('overproof'),
          ]}
          columnNames={['Method', 'Aging', 'Black', 'Overproof']}
          title="Style"
          itemsPerColumn={[
            PRODUCTION_METHOD_ITEMS,
            AGING_ITEMS,
            [{ label: 'Black', value: 'Black' }, NONE],
            [{ label: 'Overproof', value: 'Overproof' }, NONE],
          ]}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross1Icon className="ml-2" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

function StockIcon(props: { stock: StockState }) {
  return (
    <div className="mr-2 scale-[.8] transform">
      <BaseStockIcon {...props} />
    </div>
  )
}
