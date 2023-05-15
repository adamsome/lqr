import { Payment, columns } from '@/components/ingredients/columns'
import { DataTable } from '@/components/ingredients/data-table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [...Array(12).keys()].map((i) => ({
    id: String(i),
    amount: 100 + i * 10,
    status: i % 2 ? 'failed' : 'success',
    email: `user${i}@example.com`,
  }))
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
