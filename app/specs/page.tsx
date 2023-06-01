import {
  CategoryMeta,
  CategoryMetaProvider,
} from '@/components/category-meta-provider'
import { Table } from '@/components/specs/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getStaticData } from '@/lib/get-static-data'
import { getUserIngredients } from '@/lib/get-user-data'
import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { Ingredient, Spec } from '@/lib/types'

export const revalidate = 0

type Data = CategoryMeta & {
  ingredientDict: Record<string, Ingredient>
  specs: Record<string, Spec>
}

async function getData(): Promise<Data> {
  const [userIngredients, staticData] = await Promise.all([
    getUserIngredients(),
    getStaticData(),
  ])
  const { baseIngredients, ingredients, categoryFilter, specs } = staticData
  const data = parseIngredients(baseIngredients, userIngredients, ingredients)
  return { ...data, categoryFilter, specs }
}

export default async function IndexPage() {
  const { specs, ...meta } = await getData()
  return (
    <CategoryMetaProvider {...meta}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Specs</H1>
          <Table specs={specs} />
        </section>
      </Container>
    </CategoryMetaProvider>
  )
}
