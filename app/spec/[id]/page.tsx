import { DataProvider } from '@/components/category-meta-provider'
import { Spec } from '@/components/specs/spec'
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
      <Spec spec={spec} />
    </DataProvider>
  )
}
