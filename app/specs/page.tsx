import { Table } from '@/app/specs/table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'

export default function Page() {
  return (
    <Container className="relative py-8">
      <section className="flex flex-col gap-4">
        <H1>Specs</H1>
        <Table />
      </section>
    </Container>
  )
}
