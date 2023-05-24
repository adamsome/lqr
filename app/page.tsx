import { promises as fs } from 'fs'
import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'
import path from 'path'

import {
  CategoryMeta,
  CategoryMetaProvider,
} from '@/components/category-meta-provider'
import { columns } from '@/components/ingredients/columns'
import { Container } from '@/components/ui/container'
import { DataTable } from '@/components/ui/data-table'
import { H1 } from '@/components/ui/h1'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { connectToDatabase } from '@/lib/mongodb'
import { createIngredientParser } from '@/lib/parse-ingredients'
import { Ingredient, IngredientDef, User } from '@/lib/types'

async function readData(dataPath: string) {
  const data = await fs.readFile(path.join(process.cwd(), dataPath))
  return data.toString()
}

async function getBaseIngredients(): Promise<IngredientDef[]> {
  return JSON.parse(await readData('public/data/base-ingredients.json'))
}

async function getIngredients(): Promise<IngredientDef[]> {
  return JSON.parse(await readData('public/data/ingredients.json'))
}

async function getCategoryFilter(): Promise<HierarchicalFilter> {
  return JSON.parse(await readData('public/data/category-filter.json'))
}

async function getUserIngredients(): Promise<
  Record<string, Partial<IngredientDef>>
> {
  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ username: 'adamb' })
  if (user) {
    delete (user as OptionalId<WithId<User>>)._id
  }
  return user?.ingredients ?? {}
}

async function getData(): Promise<
  CategoryMeta & { ingredients: Ingredient[] }
> {
  const [baseIngredients, ingredients, categoryFilter, userIngredients] =
    await Promise.all([
      getBaseIngredients(),
      getIngredients(),
      getCategoryFilter(),
      getUserIngredients(),
    ])

  const [baseIngredientDict, parseIngredient] = createIngredientParser(
    baseIngredients,
    userIngredients
  )

  return {
    baseIngredientDict,
    categoryFilter,
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
