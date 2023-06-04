import { DataProvider } from '@/components/data-provider'
import { Spec } from '@/app/spec/[id]/spec'
import { Container } from '@/components/ui/container'
import { getData } from '@/lib/get-data'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const data = await getData()
  const { specs } = data
  const { id } = params
  const spec = specs[id]
  return (
    <DataProvider {...data}>
      <Container className="relative py-8">
        <Spec spec={spec} />
      </Container>
    </DataProvider>
  )
}
