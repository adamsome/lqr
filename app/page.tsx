import {
  CategoryMeta,
  CategoryMetaProvider,
} from '@/components/category-meta-provider'
import { Table } from '@/components/ingredients/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getStaticData } from '@/lib/get-static-data'
import { getUserIngredients } from '@/lib/get-user-data'
import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { Ingredient } from '@/lib/types'

export const revalidate = 0

async function getData(): Promise<
  CategoryMeta & { ingredients: Ingredient[] }
> {
  const [userIngredients, staticData] = await Promise.all([
    getUserIngredients(),
    getStaticData(),
  ])
  const { baseIngredients, ingredients, categoryFilter } = staticData
  const data = parseIngredients(baseIngredients, userIngredients, ingredients)
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
