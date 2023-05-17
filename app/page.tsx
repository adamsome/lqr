import { columns } from '@/components/ingredients/columns'
import { DataTable } from '@/components/ingredients/data-table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { Ingredient } from '@/lib/ingredient'
import ingredients from '@/public/data/ingredients.json'

async function getData(): Promise<Ingredient[]> {
  // Fetch data from your API here.
  return ingredients as Ingredient[]
}

export default async function IndexPage() {
  const data = await getData()
  return (
    <Container className="relative py-8">
      <section className="flex flex-col gap-4">
        <H1>Stock</H1>
        <DataTable columns={columns} data={data} />
      </section>
    </Container>
  )
}
