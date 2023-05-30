import { promises as fs } from 'fs'
import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'
import path from 'path'

import {
  CategoryMeta,
  CategoryMetaProvider,
} from '@/components/category-meta-provider'
import { Table } from '@/components/specs/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { connectToDatabase } from '@/lib/mongodb'
import { createIngredientParser } from '@/lib/parse-ingredients'
import { Ingredient, IngredientDef, Spec, User } from '@/lib/types'

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

async function getSpecs(): Promise<Record<string, Spec>> {
  return JSON.parse(await readData('public/data/specs.json'))
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

type Data = CategoryMeta & {
  ingredients: Ingredient[]
  specs: Record<string, Spec>
}

async function getData(): Promise<Data> {
  const [baseIngredients, ingredients, categoryFilter, userIngredients, specs] =
    await Promise.all([
      getBaseIngredients(),
      getIngredients(),
      getCategoryFilter(),
      getUserIngredients(),
      getSpecs(),
    ])

  const [baseIngredientDict, parseIngredient] = createIngredientParser(
    baseIngredients,
    userIngredients
  )

  return {
    baseIngredientDict,
    categoryFilter,
    ingredients: ingredients.map(parseIngredient),
    specs,
  }
}

export default async function IndexPage() {
  const { ingredients, specs, ...meta } = await getData()
  return (
    <CategoryMetaProvider {...meta}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Specs</H1>
          <Table specs={specs} ingredients={ingredients} />
        </section>
      </Container>
    </CategoryMetaProvider>
  )
}
