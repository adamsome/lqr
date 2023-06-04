import { DataProvider } from '@/components/data-provider'
import { Table } from '@/components/ingredients/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getData } from '@/lib/get-data'

export const revalidate = 0

export default async function IndexPage() {
  const data = await getData()
  const { ingredientIDs, ingredientDict } = data
  const ingredients = ingredientIDs.map((id) => ingredientDict[id])
  return (
    <DataProvider {...data}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Stock</H1>
          <Table data={ingredients} />
        </section>
      </Container>
    </DataProvider>
  )
}
