import {
  CategoryMeta,
  CategoryMetaProvider,
} from '@/components/category-meta-provider'
import { columns } from '@/components/ingredients/columns'
import { Container } from '@/components/ui/container'
import { DataTable } from '@/components/ui/data-table'
import { H1 } from '@/components/ui/h1'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { createIngredientParser } from '@/lib/parse-ingredients'
import { Ingredient, IngredientDef } from '@/lib/types'
import baseIngredientsJson from '@/public/data/base-ingredients.json'
import categoryFilterJson from '@/public/data/category-filter.json'
import ingredientsJson from '@/public/data/ingredients.json'
import userIngredientsJson from '@/public/data/user-ingredients.json'

async function getData(): Promise<
  CategoryMeta & { ingredients: Ingredient[] }
> {
  const [baseIngredientDict, parseIngredient] = createIngredientParser(
    baseIngredientsJson as IngredientDef[],
    userIngredientsJson as Record<string, Partial<IngredientDef>>
  )
  const ingredients = ingredientsJson as IngredientDef[]
  return {
    baseIngredientDict,
    categoryFilter: categoryFilterJson as HierarchicalFilter,
    ingredients: ingredients.map(parseIngredient),
  }
}

export default async function IndexPage() {
  const { ingredients, ...meta } = await getData()
  return (
    <CategoryMetaProvider {...meta}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Stock</H1>
          <DataTable columns={columns} data={ingredients} />
        </section>
      </Container>
    </CategoryMetaProvider>
  )
}
