import { DataProvider } from '@/components/category-meta-provider'
import { Table } from '@/components/specs/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getData } from '@/lib/get-data'

export const revalidate = 0

export default async function IndexPage() {
  const data = await getData()
  return (
    <DataProvider {...data}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Specs</H1>
          <Table />
        </section>
      </Container>
    </DataProvider>
  )
}
