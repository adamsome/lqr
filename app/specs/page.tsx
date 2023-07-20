import { Table } from '@/app/specs/table'
import { H1 } from '@/components/ui/h1'

export default function Page() {
  return (
    <section className="relative my-8 flex flex-col gap-4">
      <H1>Specs</H1>
      <Table />
    </section>
  )
}
