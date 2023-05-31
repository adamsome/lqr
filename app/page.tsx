import { promises as fs } from 'fs'
import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'
import path from 'path'

import {
  CategoryMeta,
  CategoryMetaProvider,
} from '@/components/category-meta-provider'
import { Table } from '@/components/ingredients/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { connectToDatabase } from '@/lib/mongodb'
import { Ingredient, IngredientDef, User } from '@/lib/types'

export const revalidate = 0

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
  const [baseIngs, ingDefs, categoryFilter, userIngs] = await Promise.all([
    getBaseIngredients(),
    getIngredients(),
    getCategoryFilter(),
    getUserIngredients(),
  ])

  const data = parseIngredients(baseIngs, userIngs, ingDefs)

  return { ...data, categoryFilter }
}

export default async function IndexPage() {
  const { ingredients, ...meta } = await getData()
  return (
    <CategoryMetaProvider {...meta}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Stock</H1>
          <Table data={ingredients} />
        </section>
      </Container>
    </CategoryMetaProvider>
  )
}
