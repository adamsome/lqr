import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'

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
import { Ingredient, IngredientDef, User } from '@/lib/types'
import { connectToDatabase } from '@/lib/util/mongodb'

import baseIngredientsJson from '@/public/data/base-ingredients.json'
import categoryFilterJson from '@/public/data/category-filter.json'
import ingredientsJson from '@/public/data/ingredients.json'
import userIngredientsJson from '@/public/data/user-ingredients.json'

async function getData(): Promise<
  CategoryMeta & { ingredients: Ingredient[] }
> {
  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ username: 'adamb' })
  if (user) {
    delete (user as OptionalId<WithId<any>>)._id
  }

  const [baseIngredientDict, parseIngredient] = createIngredientParser(
    baseIngredientsJson as IngredientDef[],
    user?.ingredients ?? {}
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
